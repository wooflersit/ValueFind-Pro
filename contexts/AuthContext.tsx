import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { User, UserRole } from '../utils/supabase/types';
import { apiCall } from '../utils/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string, accessToken: string) => {
    const response = await apiCall<User>('/auth/user', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });

    if (response.success && response.data) {
      setUser(response.data);
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('user_id', userId);
    }
  };

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session && session.user) {
        await fetchUserData(session.user.id, session.access_token);
      } else {
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
      }
    } catch (error) {
      console.error('Session check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        await fetchUserData(session.user.id, session.access_token);
      } else {
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        await fetchUserData(data.user.id, data.session.access_token);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
  };

  const refreshUser = async () => {
    const userId = localStorage.getItem('user_id');
    const accessToken = localStorage.getItem('access_token');
    if (userId && accessToken) {
      await fetchUserData(userId, accessToken);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
