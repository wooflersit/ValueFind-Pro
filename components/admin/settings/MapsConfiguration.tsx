import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';
import { apiCall } from '../../../utils/api';
import { useNotification } from '../../../contexts/NotificationContext';
import { Save, MapPin } from 'lucide-react';

export const MapsConfiguration: React.FC = () => {
  const [config, setConfig] = useState({ enabled: false, provider: 'google', apiKey: '' });
  const [loading, setLoading] = useState(false);
  const [testAddress, setTestAddress] = useState('');
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const response = await apiCall<any>('/admin/settings/maps-config', {});
    if (response.success && response.data) {
      setConfig(response.data);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const response = await apiCall('/admin/settings/maps-config', {
      method: 'POST',
      body: JSON.stringify({ config }),
    });
    setLoading(false);
    if (response.success) {
      showSuccess('Maps configuration saved successfully');
    } else {
      showError(response.error || 'Failed to save configuration');
    }
  };

  const handleTest = async () => {
    setLoading(true);
    const response = await apiCall('/admin/settings/test-geocoding', {
      method: 'POST',
      body: JSON.stringify({ address: testAddress }),
    });
    setLoading(false);
    if (response.success) {
      showSuccess('Geocoding test successful');
    } else {
      showError(response.error || 'Failed to geocode address');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maps Configuration</CardTitle>
        <CardDescription>Configure maps provider for geocoding and location services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label>Enable Maps</Label>
            <p className="text-sm text-muted-foreground">Activate maps integration</p>
          </div>
          <Switch checked={config.enabled} onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })} />
        </div>

        <div className="space-y-2">
          <Label>Provider</Label>
          <Select value={config.provider} onValueChange={(value) => setConfig({ ...config, provider: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="google">Google Maps</SelectItem>
              <SelectItem value="ola">Ola Maps</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>API Key</Label>
          <Input type="password" value={config.apiKey} onChange={(e) => setConfig({ ...config, apiKey: e.target.value })} placeholder="Enter API key" />
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-4">Test Geocoding</h3>
          <div className="flex gap-2">
            <Input value={testAddress} onChange={(e) => setTestAddress(e.target.value)} placeholder="Enter address to test" />
            <Button onClick={handleTest} disabled={loading || !config.enabled}>
              <MapPin className="mr-2 h-4 w-4" /> Test
            </Button>
          </div>
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          <Save className="mr-2 h-4 w-4" /> Save Configuration
        </Button>
      </CardContent>
    </Card>
  );
};
