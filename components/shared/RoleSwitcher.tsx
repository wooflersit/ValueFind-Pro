import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { UserCog, ShieldCheck, Store, Truck, ShoppingBag, Crown } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const roleIcons: Record<string, any> = {
  master_admin: Crown,
  network_operator: UserCog,
  store_owner: Store,
  delivery_partner: Truck,
  customer: ShoppingBag,
};

const roleLabels: Record<string, string> = {
  master_admin: 'Master Admin',
  network_operator: 'Network Operator',
  store_owner: 'Store Owner',
  delivery_partner: 'Delivery Partner',
  customer: 'Customer',
};

const roleColors: Record<string, string> = {
  master_admin: 'bg-purple-100 text-purple-800 border-purple-300',
  network_operator: 'bg-blue-100 text-blue-800 border-blue-300',
  store_owner: 'bg-green-100 text-green-800 border-green-300',
  delivery_partner: 'bg-orange-100 text-orange-800 border-orange-300',
  customer: 'bg-gray-100 text-gray-800 border-gray-300',
};

export const RoleSwitcher: React.FC = () => {
  const { user, switchRole } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  if (!user || Object.keys(user.roles).length <= 1) {
    return null; // Don't show if user has only one role
  }

  const handleSwitchRole = async (newRole: string) => {
    if (newRole === user.currentRole) {
      setOpen(false);
      return;
    }

    setSwitching(true);
    try {
      await switchRole(newRole);
      showSuccess(`Switched to ${roleLabels[newRole]}`);
      setOpen(false);
      // Force page reload to update dashboard
      window.location.href = `/${newRole.replace('_', '-')}/dashboard`;
    } catch (error: any) {
      showError(error.message || 'Failed to switch role');
    } finally {
      setSwitching(false);
    }
  };

  const CurrentIcon = roleIcons[user.currentRole] || ShoppingBag;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CurrentIcon className="h-4 w-4" />
          {roleLabels[user.currentRole]}
          <Badge variant="secondary" className="ml-2">
            {Object.keys(user.roles).length} roles
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Switch Role</DialogTitle>
          <DialogDescription>
            You have multiple roles. Select which role you want to use.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {Object.entries(user.roles).map(([roleKey, roleData]) => {
            const Icon = roleIcons[roleKey] || ShoppingBag;
            const isActive = roleKey === user.currentRole;
            const isVerified = roleData.kycStatus === 'verified';

            return (
              <button
                key={roleKey}
                onClick={() => handleSwitchRole(roleKey)}
                disabled={switching || roleData.status === 'inactive'}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  isActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${roleColors[roleKey]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{roleLabels[roleKey]}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {roleData.metadata?.businessType && (
                          <Badge variant="outline" className="text-xs">
                            {roleData.metadata.businessType}
                          </Badge>
                        )}
                        {roleData.metadata?.vehicleType && (
                          <Badge variant="outline" className="text-xs">
                            {roleData.metadata.vehicleType}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {isActive && (
                      <Badge className="bg-blue-600">Active</Badge>
                    )}
                    {isVerified && (
                      <div className="flex items-center gap-1 text-green-600 text-xs">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Verified</span>
                      </div>
                    )}
                    {roleData.kycStatus === 'pending' && (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">KYC Pending</Badge>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Note:</strong> Switching roles will reload the dashboard with role-specific features and permissions.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
