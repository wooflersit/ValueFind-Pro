import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Save } from 'lucide-react';

export const GeneralSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'ValueFind Pro',
    siteDescription: 'Multi-Tenant E-Commerce Platform',
    supportEmail: 'support@valuefind.com',
    supportPhone: '+91-1234567890',
  });

  const handleSave = () => {
    console.log('Saving general settings:', settings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Configure basic platform settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Site Name</Label>
          <Input value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Site Description</Label>
          <Textarea value={settings.siteDescription} onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Support Email</Label>
          <Input type="email" value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Support Phone</Label>
          <Input value={settings.supportPhone} onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })} />
        </div>
        <Button onClick={handleSave} className="w-full">
          <Save className="mr-2 h-4 w-4" /> Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};
