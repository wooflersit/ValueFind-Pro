import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { createClient } from '../utils/supabase/client';
import { apiCall } from '../utils/api';

interface UserRole {
  role: string;
  status: 'active' | 'inactive';
  kycStatus: 'not_started' | 'pending' | 'under_review' | 'verified' | 'rejected';
  metadata?: any;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  roles: Record<string, UserRole>;
  primaryRole: string;
  currentRole: string; // Active role for current session
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchUserData = async (userId: string) => {
    const response = await apiCall<User>('/auth/user', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    if (response.success && response.data) {
      const userData = response.data;
      // Set current role to primary role if not set
      if (!userData.currentRole) {
        userData.currentRole = userData.primaryRole;
      }
      setUser(userData);
    }
  };

  const refreshUser = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserData(session.user.id);
      }
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchUserData(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, role?: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
      await fetchUserData(data.user.id);
      // If specific role requested, switch to it
      if (role && user && user.roles[role]) {
        await switchRole(role);
      }
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const switchRole = async (newRole: string) => {
    if (!user) return;
    
    // Validate role exists
    if (!user.roles[newRole]) {
      throw new Error('Invalid role');
    }

    // Update current role in backend
    const response = await apiCall('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ userId: user.id, newRole }),
    });

    if (response.success) {
      setUser({ ...user, currentRole: newRole });
      // Refresh to get updated data
      await fetchUserData(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchRole, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
