import React, { useState, useEffect, useRef } from 'react';
import { useMaps } from '../../contexts/MapsContext';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { MapPin, Loader2, Navigation, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface AddressData {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  lat?: number;
  lng?: number;
  formattedAddress?: string;
}

interface Props {
  value: AddressData;
  onChange: (address: AddressData) => void;
  label?: string;
  required?: boolean;
  showMap?: boolean;
  validateServiceArea?: boolean;
  serviceAreaPincodes?: string[];
}

export const AddressAutocomplete: React.FC<Props> = ({
  value,
  onChange,
  label = 'Address',
  required = true,
  showMap = false,
  validateServiceArea = false,
  serviceAreaPincodes = [],
}) => {
  const { autocomplete, getPlaceDetails, geocodeAddress, reverseGeocode, isConfigured } = useMaps();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [geocoded, setGeocoded] = useState(false);
  const [serviceAreaValid, setServiceAreaValid] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) {
        handleSearch(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (validateServiceArea && value.pincode) {
      checkServiceArea(value.pincode);
    }
  }, [value.pincode, validateServiceArea]);

  const handleSearch = async (query: string) => {
    if (!isConfigured) return;
    setLoading(true);
    const results = await autocomplete(query);
    setSuggestions(results);
    setShowSuggestions(true);
    setLoading(false);
  };

  const handleSelectSuggestion = async (suggestion: any) => {
    setLoading(true);
    setShowSuggestions(false);
    setSearchQuery(suggestion.description);

    const details = await getPlaceDetails(suggestion.placeId);
    if (details) {
      onChange({
        line1: details.formattedAddress || suggestion.mainText,
        city: details.city || '',
        state: details.state || '',
        pincode: details.pincode || '',
        lat: details.lat,
        lng: details.lng,
        formattedAddress: details.formattedAddress,
      });
      setGeocoded(true);
    }
    setLoading(false);
  };

  const handleManualGeocode = async () => {
    const fullAddress = `${value.line1}, ${value.city}, ${value.state}, ${value.pincode}`;
    setLoading(true);
    const result = await geocodeAddress(fullAddress);
    if (result) {
      onChange({
        ...value,
        lat: result.lat,
        lng: result.lng,
        formattedAddress: result.formattedAddress,
        city: result.city || value.city,
        state: result.state || value.state,
        pincode: result.pincode || value.pincode,
      });
      setGeocoded(true);
    }
    setLoading(false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const result = await reverseGeocode(latitude, longitude);
        if (result) {
          onChange({
            line1: result.formattedAddress || '',
            city: result.city || '',
            state: result.state || '',
            pincode: result.pincode || '',
            lat: result.lat,
            lng: result.lng,
            formattedAddress: result.formattedAddress,
          });
          setSearchQuery(result.formattedAddress || '');
          setGeocoded(true);
        }
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setGettingLocation(false);
      }
    );
  };

  const checkServiceArea = (pincode: string) => {
    if (serviceAreaPincodes.length === 0) {
      setServiceAreaValid(null);
      return;
    }
    const isValid = serviceAreaPincodes.includes(pincode);
    setServiceAreaValid(isValid);
  };

  return (
    <div className="space-y-4">
      {/* Search Input with Autocomplete */}
      {isConfigured && (
        <div className="space-y-2" ref={inputRef}>
          <Label htmlFor="address-search">
            {label} Search {required && <span className="text-red-500">*</span>}
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="address-search"
              placeholder="Start typing your address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="pl-10 pr-10"
            />
            {loading && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />}
            {geocoded && !loading && <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-1 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{suggestion.mainText}</p>
                      <p className="text-xs text-gray-500">{suggestion.secondaryText}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              className="flex-1"
            >
              {gettingLocation ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="mr-2 h-4 w-4" />
              )}
              Use Current Location
            </Button>
          </div>
        </div>
      )}

      {/* Manual Address Fields */}
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="line1">
            Address Line 1 {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="line1"
            placeholder="House/Flat No, Building Name, Street"
            value={value.line1}
            onChange={(e) => onChange({ ...value, line1: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="line2">Address Line 2</Label>
          <Input
            id="line2"
            placeholder="Area, Colony (Optional)"
            value={value.line2 || ''}
            onChange={(e) => onChange({ ...value, line2: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="city">
              City {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="city"
              placeholder="Bangalore"
              value={value.city}
              onChange={(e) => onChange({ ...value, city: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">
              State {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="state"
              placeholder="Karnataka"
              value={value.state}
              onChange={(e) => onChange({ ...value, state: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="pincode">
              Pincode {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="pincode"
              placeholder="560001"
              maxLength={6}
              value={value.pincode}
              onChange={(e) => onChange({ ...value, pincode: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="landmark">Landmark</Label>
            <Input
              id="landmark"
              placeholder="Near Park"
              value={value.landmark || ''}
              onChange={(e) => onChange({ ...value, landmark: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Service Area Validation */}
      {validateServiceArea && serviceAreaValid !== null && (
        <Alert variant={serviceAreaValid ? 'default' : 'destructive'}>
          {serviceAreaValid ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            {serviceAreaValid
              ? 'Great! We deliver to this area.'
              : 'Sorry, we don\'t deliver to this pincode yet. Please check back soon!'}
          </AlertDescription>
        </Alert>
      )}

      {/* Geocode Button */}
      {isConfigured && !geocoded && value.line1 && value.city && value.pincode && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleManualGeocode}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="mr-2 h-4 w-4" />
          )}
          Verify Address Location
        </Button>
      )}

      {/* Map Preview (Optional) */}
      {showMap && value.lat && value.lng && (
        <div className="border rounded-lg overflow-hidden">
          <div className="h-48 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Map Preview</p>
              <p className="text-xs">Lat: {value.lat.toFixed(6)}, Lng: {value.lng.toFixed(6)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formatted Address Display */}
      {geocoded && value.formattedAddress && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Verified Address:</strong>
            <br />
            {value.formattedAddress}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
