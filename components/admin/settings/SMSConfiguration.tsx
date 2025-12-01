import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';
import { apiCall } from '../../../utils/api';
import { useNotification } from '../../../contexts/NotificationContext';
import { Save, Send } from 'lucide-react';

export const SMSConfiguration: React.FC = () => {
  const [config, setConfig] = useState({ enabled: false, provider: 'msg91', apiKey: '', senderId: '', templateId: '' });
  const [loading, setLoading] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const response = await apiCall<any>('/admin/settings/sms-config', {});
    if (response.success && response.data) {
      setConfig(response.data);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const response = await apiCall('/admin/settings/sms-config', {
      method: 'POST',
      body: JSON.stringify({ config }),
    });
    setLoading(false);
    if (response.success) {
      showSuccess('SMS configuration saved successfully');
    } else {
      showError(response.error || 'Failed to save configuration');
    }
  };

  const handleTest = async () => {
    setLoading(true);
    const response = await apiCall('/admin/settings/test-sms', {
      method: 'POST',
      body: JSON.stringify({ phone: testPhone, message: 'Test SMS from ValueFind Pro' }),
    });
    setLoading(false);
    if (response.success) {
      showSuccess('Test SMS sent successfully');
    } else {
      showError(response.error || 'Failed to send test SMS');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Configuration</CardTitle>
        <CardDescription>Configure SMS provider for OTP and notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label>Enable SMS</Label>
            <p className="text-sm text-muted-foreground">Activate SMS sending</p>
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
              <SelectItem value="msg91">MSG91</SelectItem>
              <SelectItem value="textlocal">Textlocal</SelectItem>
              <SelectItem value="fast2sms">Fast2SMS</SelectItem>
              <SelectItem value="twilio">Twilio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>API Key</Label>
          <Input type="password" value={config.apiKey} onChange={(e) => setConfig({ ...config, apiKey: e.target.value })} placeholder="Enter API key" />
        </div>

        <div className="space-y-2">
          <Label>Sender ID</Label>
          <Input value={config.senderId} onChange={(e) => setConfig({ ...config, senderId: e.target.value })} placeholder="VLUFND" />
        </div>

        <div className="space-y-2">
          <Label>Template ID (Optional)</Label>
          <Input value={config.templateId} onChange={(e) => setConfig({ ...config, templateId: e.target.value })} placeholder="Enter template ID" />
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-4">Test SMS</h3>
          <div className="flex gap-2">
            <Input value={testPhone} onChange={(e) => setTestPhone(e.target.value)} placeholder="+91XXXXXXXXXX" />
            <Button onClick={handleTest} disabled={loading || !config.enabled}>
              <Send className="mr-2 h-4 w-4" /> Test
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
