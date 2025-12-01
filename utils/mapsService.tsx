// Maps Service Implementation for ValueFind Pro
// Supports: Google Maps, Ola Maps

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

export interface AutocompleteResult {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export interface DistanceResult {
  distance: number; // in kilometers
  duration: number; // in minutes
  distanceText: string;
  durationText: string;
}

// Google Maps Geocoding
export const geocode_Google = async (
  config: MapsConfig,
  address: string
): Promise<GeocodeResult | null> => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${config.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      const location = result.geometry.location;
      const addressComponents = result.address_components;

      const getComponent = (type: string) => {
        const component = addressComponents.find((c: any) => c.types.includes(type));
        return component?.long_name || '';
      };

      return {
        lat: location.lat,
        lng: location.lng,
        formattedAddress: result.formatted_address,
        city: getComponent('locality') || getComponent('administrative_area_level_2'),
        state: getComponent('administrative_area_level_1'),
        pincode: getComponent('postal_code'),
        country: getComponent('country'),
      };
    }
    return null;
  } catch (error) {
    console.error('Google geocoding error:', error);
    return null;
  }
};

// Google Maps Reverse Geocoding
export const reverseGeocode_Google = async (
  config: MapsConfig,
  lat: number,
  lng: number
): Promise<GeocodeResult | null> => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${config.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      const addressComponents = result.address_components;

      const getComponent = (type: string) => {
        const component = addressComponents.find((c: any) => c.types.includes(type));
        return component?.long_name || '';
      };

      return {
        lat,
        lng,
        formattedAddress: result.formatted_address,
        city: getComponent('locality') || getComponent('administrative_area_level_2'),
        state: getComponent('administrative_area_level_1'),
        pincode: getComponent('postal_code'),
        country: getComponent('country'),
      };
    }
    return null;
  } catch (error) {
    console.error('Google reverse geocoding error:', error);
    return null;
  }
};

// Google Maps Autocomplete
export const autocomplete_Google = async (
  config: MapsConfig,
  input: string,
  sessionToken?: string
): Promise<AutocompleteResult[]> => {
  try {
    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${config.apiKey}`;
    if (sessionToken) url += `&sessiontoken=${sessionToken}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      return data.predictions.map((p: any) => ({
        placeId: p.place_id,
        description: p.description,
        mainText: p.structured_formatting.main_text,
        secondaryText: p.structured_formatting.secondary_text,
      }));
    }
    return [];
  } catch (error) {
    console.error('Google autocomplete error:', error);
    return [];
  }
};

// Google Maps Distance Matrix
export const calculateDistance_Google = async (
  config: MapsConfig,
  origin: string,
  destination: string
): Promise<DistanceResult | null> => {
  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${config.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
      const element = data.rows[0].elements[0];
      return {
        distance: element.distance.value / 1000, // Convert to km
        duration: element.duration.value / 60, // Convert to minutes
        distanceText: element.distance.text,
        durationText: element.duration.text,
      };
    }
    return null;
  } catch (error) {
    console.error('Google distance calculation error:', error);
    return null;
  }
};

// Ola Maps Geocoding
export const geocode_Ola = async (
  config: MapsConfig,
  address: string
): Promise<GeocodeResult | null> => {
  try {
    const url = `https://api.olamaps.io/places/v1/geocode?address=${encodeURIComponent(address)}&api_key=${config.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.geocodingResults && data.geocodingResults.length > 0) {
      const result = data.geocodingResults[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
        city: result.city,
        state: result.state,
        pincode: result.postal_code,
        country: result.country,
      };
    }
    return null;
  } catch (error) {
    console.error('Ola geocoding error:', error);
    return null;
  }
};

// Ola Maps Reverse Geocoding
export const reverseGeocode_Ola = async (
  config: MapsConfig,
  lat: number,
  lng: number
): Promise<GeocodeResult | null> => {
  try {
    const url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${config.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat,
        lng,
        formattedAddress: result.formatted_address,
        city: result.city,
        state: result.state,
        pincode: result.postal_code,
        country: result.country,
      };
    }
    return null;
  } catch (error) {
    console.error('Ola reverse geocoding error:', error);
    return null;
  }
};

// Main Geocode Function
export const geocodeAddress = async (
  config: MapsConfig,
  address: string
): Promise<GeocodeResult | null> => {
  if (!config.enabled) return null;
  
  switch (config.provider) {
    case 'google':
      return geocode_Google(config, address);
    case 'ola':
      return geocode_Ola(config, address);
    default:
      return null;
  }
};

// Main Reverse Geocode Function
export const reverseGeocodeLocation = async (
  config: MapsConfig,
  lat: number,
  lng: number
): Promise<GeocodeResult | null> => {
  if (!config.enabled) return null;
  
  switch (config.provider) {
    case 'google':
      return reverseGeocode_Google(config, lat, lng);
    case 'ola':
      return reverseGeocode_Ola(config, lat, lng);
    default:
      return null;
  }
};

// Main Autocomplete Function
export const autocompleteAddress = async (
  config: MapsConfig,
  input: string,
  sessionToken?: string
): Promise<AutocompleteResult[]> => {
  if (!config.enabled) return [];
  
  switch (config.provider) {
    case 'google':
      return autocomplete_Google(config, input, sessionToken);
    case 'ola':
      // Ola Maps autocomplete would be implemented similarly
      return [];
    default:
      return [];
  }
};

// Main Distance Calculation Function
export const calculateDistance = async (
  config: MapsConfig,
  origin: string,
  destination: string
): Promise<DistanceResult | null> => {
  if (!config.enabled) return null;
  
  switch (config.provider) {
    case 'google':
      return calculateDistance_Google(config, origin, destination);
    case 'ola':
      // Ola Maps distance calculation would be implemented similarly
      return null;
    default:
      return null;
  }
};
