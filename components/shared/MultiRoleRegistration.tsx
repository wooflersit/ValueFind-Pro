import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Plus, Info } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';
import { apiCall } from '../../utils/api';

interface Props {
  onSuccess?: () => void;
}

export const MultiRoleRegistration: React.FC<Props> = ({ onSuccess }) => {
  const { user, refreshUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [selectedRole, setSelectedRole] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const availableRoles = [
    { value: 'store_owner', label: 'Store Owner', description: 'Sell products on the platform' },
    { value: 'delivery_partner', label: 'Delivery Partner', description: 'Deliver orders to customers' },
    { value: 'network_operator', label: 'Network Operator', description: 'Manage franchises and sellers' },
  ].filter(role => !user.roles[role.value]);

  const handleAddRole = async () => {
    if (!selectedRole) {
      showError('Please select a role');
      return;
    }

    if (selectedRole === 'store_owner' && !businessType) {
      showError('Please select business type');
      return;
    }

    if (selectedRole === 'delivery_partner' && !vehicleType) {
      showError('Please select vehicle type');
      return;
    }

    setLoading(true);
    const response = await apiCall('/auth/add-role', {
      method: 'POST',
      body: JSON.stringify({
        userId: user.id,
        role: selectedRole,
        metadata: {
          businessType: selectedRole === 'store_owner' ? businessType : undefined,
          vehicleType: selectedRole === 'delivery_partner' ? vehicleType : undefined,
        },
      }),
    });

    setLoading(false);
    if (response.success) {
      showSuccess(`${selectedRole.replace('_', ' ')} role added successfully!`);
      await refreshUser();
      setSelectedRole('');
      setBusinessType('');
      setVehicleType('');
      onSuccess?.();
    } else {
      showError(response.error || 'Failed to add role');
    }
  };

  if (availableRoles.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          You have registered for all available roles.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Another Role</CardTitle>
        <CardDescription>
          Register for additional roles with the same account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You can have multiple roles with one account. Each role has separate KYC verification and permissions.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label>Select Role</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a role to add" />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map(role => (
                <SelectItem key={role.value} value={role.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{role.label}</span>
                    <span className="text-xs text-gray-500">{role.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedRole === 'store_owner' && (
          <div className="space-y-2">
            <Label>Business Type</Label>
            <Select value={businessType} onValueChange={setBusinessType}>
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manufacturer">Manufacturer</SelectItem>
                <SelectItem value="distributor">Distributor</SelectItem>
                <SelectItem value="trader">Trader</SelectItem>
                <SelectItem value="retailer">Retailer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedRole === 'delivery_partner' && (
          <div className="space-y-2">
            <Label>Vehicle Type</Label>
            <Select value={vehicleType} onValueChange={setVehicleType}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bike">Bike</SelectItem>
                <SelectItem value="auto">Auto Rickshaw</SelectItem>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2">Your Current Roles:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(user.roles).map(([roleKey, roleData]) => (
              <Badge key={roleKey} variant="outline">
                {roleKey.replace('_', ' ')}
                {roleData.kycStatus === 'verified' && ' ✓'}
              </Badge>
            ))}
          </div>
        </div>

        <Button onClick={handleAddRole} disabled={loading || !selectedRole} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          {loading ? 'Adding Role...' : 'Add Role'}
        </Button>
      </CardContent>
    </Card>
  );
};
