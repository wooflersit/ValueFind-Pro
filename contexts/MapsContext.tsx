import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiCall } from '../utils/api';

export interface MapsConfig {
  enabled: boolean;
  provider: 'google' | 'ola';
  apiKey: string;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface AddressSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

interface MapsContextType {
  config: MapsConfig | null;
  loading: boolean;
  geocodeAddress: (address: string) => Promise<GeocodeResult | null>;
  reverseGeocode: (lat: number, lng: number) => Promise<GeocodeResult | null>;
  autocomplete: (input: string) => Promise<AddressSuggestion[]>;
  getPlaceDetails: (placeId: string) => Promise<GeocodeResult | null>;
  calculateDistance: (origin: string, destination: string) => Promise<any>;
  isConfigured: boolean;
}

const MapsContext = createContext<MapsContextType | undefined>(undefined);

export const MapsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<MapsConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    const response = await apiCall<MapsConfig>('/admin/settings/maps-config', {}, false);
    if (response.success && response.data) {
      setConfig(response.data);
    } else {
      // Default config for development
      setConfig({ enabled: true, provider: 'google', apiKey: 'demo' });
    }
    setLoading(false);
  };

  const geocodeAddress = async (address: string): Promise<GeocodeResult | null> => {
    const response = await apiCall<GeocodeResult>('/maps/geocode', {
      method: 'POST',
      body: JSON.stringify({ address }),
    }, false);
    return response.success && response.data ? response.data : null;
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<GeocodeResult | null> => {
    const response = await apiCall<GeocodeResult>('/maps/reverse-geocode', {
      method: 'POST',
      body: JSON.stringify({ lat, lng }),
    }, false);
    return response.success && response.data ? response.data : null;
  };

  const autocomplete = async (input: string): Promise<AddressSuggestion[]> => {
    if (!input || input.length < 3) return [];
    const response = await apiCall<{ predictions: AddressSuggestion[] }>('/maps/autocomplete', {
      method: 'POST',
      body: JSON.stringify({ input }),
    }, false);
    return response.success && response.data ? response.data.predictions : [];
  };

  const getPlaceDetails = async (placeId: string): Promise<GeocodeResult | null> => {
    const response = await apiCall<GeocodeResult>('/maps/place-details', {
      method: 'POST',
      body: JSON.stringify({ placeId }),
    }, false);
    return response.success && response.data ? response.data : null;
  };

  const calculateDistance = async (origin: string, destination: string): Promise<any> => {
    const response = await apiCall('/maps/distance', {
      method: 'POST',
      body: JSON.stringify({ origins: [origin], destinations: [destination] }),
    }, false);
    return response.success && response.data ? response.data : null;
  };

  return (
    <MapsContext.Provider
      value={{
        config,
        loading,
        geocodeAddress,
        reverseGeocode,
        autocomplete,
        getPlaceDetails,
        calculateDistance,
        isConfigured: config?.enabled || false,
      }}
    >
      {children}
    </MapsContext.Provider>
  );
};

export const useMaps = () => {
  const context = useContext(MapsContext);
  if (!context) throw new Error('useMaps must be used within MapsProvider');
  return context;
};
