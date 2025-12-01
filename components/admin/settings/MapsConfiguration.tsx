import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';
import { Alert, AlertDescription } from '../../ui/alert';
import { apiCall } from '../../../utils/api';
import { useNotification } from '../../../contexts/NotificationContext';
import { Save, MapPin, Loader2, CheckCircle, XCircle, Info } from 'lucide-react';

export const MapsConfiguration: React.FC = () => {
  const [config, setConfig] = useState({ enabled: false, provider: 'google', apiKey: '' });
  const [loading, setLoading] = useState(false);
  const [testAddress, setTestAddress] = useState('Koramangala, Bangalore');
  const [testResult, setTestResult] = useState<any>(null);
  const [testError, setTestError] = useState('');
  const [testing, setTesting] = useState(false);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    const response = await apiCall<any>('/admin/settings/maps-config', {}, false);
    if (response.success && response.data) {
      setConfig(response.data);
    } else {
      // Set defaults for demo
      setConfig({ enabled: false, provider: 'google', apiKey: '' });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (config.enabled && !config.apiKey) {
      showError('Please enter an API key');
      return;
    }

    setLoading(true);
    const response = await apiCall('/admin/settings/maps-config', {
      method: 'POST',
      body: JSON.stringify({ config }),
    }, false);
    setLoading(false);
    
    if (response.success) {
      showSuccess('Maps configuration saved successfully');
    } else {
      showError(response.error || 'Failed to save configuration');
    }
  };

  const handleTest = async () => {
    if (!config.apiKey) {
      setTestError('Please enter an API key first');
      return;
    }

    if (!testAddress) {
      setTestError('Please enter an address to test');
      return;
    }

    setTesting(true);
    setTestError('');
    setTestResult(null);

    const response = await apiCall('/maps/geocode', {
      method: 'POST',
      body: JSON.stringify({ address: testAddress }),
    }, false);

    setTesting(false);

    if (response.success && response.data) {
      setTestResult(response.data);
      showSuccess('Geocoding test successful!');
    } else {
      setTestError(response.error || 'Geocoding failed. Please check your API key and provider.');
      showError('Test failed. Check your configuration.');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Maps Configuration
          </CardTitle>
          <CardDescription>
            Configure Google Maps or Ola Maps for address autocomplete, geocoding, and distance calculation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <Label className="text-base">Enable Maps Integration</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Activate maps for address autocomplete and geocoding
              </p>
            </div>
            <Switch 
              checked={config.enabled} 
              onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })} 
            />
          </div>

          {/* Provider Selection */}
          <div className="space-y-2">
            <Label>Maps Provider</Label>
            <Select 
              value={config.provider} 
              onValueChange={(value) => setConfig({ ...config, provider: value })}
              disabled={!config.enabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Google Maps</span>
                    <span className="text-xs text-gray-500">Global coverage, highly accurate</span>
                  </div>
                </SelectItem>
                <SelectItem value="ola">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Ola Maps</span>
                    <span className="text-xs text-gray-500">India-focused, cost-effective</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input 
              type="password" 
              value={config.apiKey} 
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })} 
              placeholder={config.provider === 'google' ? 'AIzaSy...' : 'Enter Ola Maps API key'}
              disabled={!config.enabled}
            />
            <p className="text-xs text-muted-foreground">
              {config.provider === 'google' 
                ? 'Get your API key from Google Cloud Console' 
                : 'Get your API key from Ola Maps Developer Portal'}
            </p>
          </div>

          {/* Setup Instructions */}
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              {config.provider === 'google' ? (
                <div className="space-y-2">
                  <p className="font-medium">Google Maps Setup:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                    <li>Create a project and enable: Geocoding API, Places API, Distance Matrix API</li>
                    <li>Create API Key and restrict it to your domain</li>
                    <li>Paste the key above and test</li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium">Ola Maps Setup:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Go to <a href="https://maps.olacabs.com" target="_blank" rel="noopener noreferrer" className="underline">Ola Maps</a></li>
                    <li>Sign up and create a new project</li>
                    <li>Generate API Key</li>
                    <li>Paste the key above and test</li>
                  </ol>
                </div>
              )}
            </AlertDescription>
          </Alert>

          {/* Save Button */}
          <Button 
            onClick={handleSave} 
            disabled={loading} 
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Test Geocoding */}
      <Card>
        <CardHeader>
          <CardTitle>Test Geocoding</CardTitle>
          <CardDescription>
            Verify your configuration by testing address geocoding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Test Address</Label>
            <div className="flex gap-2">
              <Input 
                value={testAddress} 
                onChange={(e) => setTestAddress(e.target.value)} 
                placeholder="Enter an address to test"
                disabled={!config.enabled || !config.apiKey}
              />
              <Button 
                onClick={handleTest} 
                disabled={testing || !config.enabled || !config.apiKey}
                className="whitespace-nowrap"
              >
                {testing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Test
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="space-y-2">
                  <p className="font-medium">Geocoding Successful!</p>
                  <div className="text-xs space-y-1">
                    <p><strong>Address:</strong> {testResult.formattedAddress}</p>
                    <p><strong>Coordinates:</strong> {testResult.lat.toFixed(6)}, {testResult.lng.toFixed(6)}</p>
                    {testResult.city && <p><strong>City:</strong> {testResult.city}</p>}
                    {testResult.state && <p><strong>State:</strong> {testResult.state}</p>}
                    {testResult.pincode && <p><strong>Pincode:</strong> {testResult.pincode}</p>}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Test Error */}
          {testError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium">Test Failed</p>
                <p className="text-sm mt-1">{testError}</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Demo Mode Notice */}
          {!config.apiKey && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <Info className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <p className="font-medium">Demo Mode</p>
                <p className="text-sm mt-1">
                  Maps integration is currently in demo mode. Add your API key above to enable real geocoding.
                </p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Features Enabled */}
      <Card>
        <CardHeader>
          <CardTitle>Features Enabled by Maps</CardTitle>
          <CardDescription>
            Once configured, these features will be available throughout the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <CheckCircle className={`h-5 w-5 mt-0.5 ${config.enabled && config.apiKey ? 'text-green-600' : 'text-gray-300'}`} />
              <div>
                <p className="font-medium text-sm">Address Autocomplete</p>
                <p className="text-xs text-muted-foreground">Real-time suggestions in registration & checkout</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <CheckCircle className={`h-5 w-5 mt-0.5 ${config.enabled && config.apiKey ? 'text-green-600' : 'text-gray-300'}`} />
              <div>
                <p className="font-medium text-sm">Current Location</p>
                <p className="text-xs text-muted-foreground">One-click GPS location detection</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <CheckCircle className={`h-5 w-5 mt-0.5 ${config.enabled && config.apiKey ? 'text-green-600' : 'text-gray-300'}`} />
              <div>
                <p className="font-medium text-sm">Address Verification</p>
                <p className="text-xs text-muted-foreground">Validate and geocode addresses</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <CheckCircle className={`h-5 w-5 mt-0.5 ${config.enabled && config.apiKey ? 'text-green-600' : 'text-gray-300'}`} />
              <div>
                <p className="font-medium text-sm">Distance Calculation</p>
                <p className="text-xs text-muted-foreground">Calculate delivery distance & fees</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
