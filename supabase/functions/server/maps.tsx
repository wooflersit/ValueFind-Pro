// Maps API Routes for ValueFind Pro
// Supports Google Maps and Ola Maps

import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const mapsRouter = new Hono();

// Helper to get Maps configuration
const getMapsConfig = async () => {
  const config = await kv.get('settings:maps_config');
  return config || { enabled: false, provider: 'google', apiKey: '' };
};

// Google Maps Geocoding
const geocodeGoogle = async (address: string, apiKey: string) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
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
};

// Ola Maps Geocoding
const geocodeOla = async (address: string, apiKey: string) => {
  const url = `https://api.olamaps.io/places/v1/geocode?address=${encodeURIComponent(address)}&api_key=${apiKey}`;
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
};

// Google Maps Autocomplete
const autocompleteGoogle = async (input: string, apiKey: string, sessionToken?: string) => {
  let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&components=country:in`;
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
};

// Google Maps Place Details
const placeDetailsGoogle = async (placeId: string, apiKey: string) => {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,geometry,address_components&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status === 'OK' && data.result) {
    const result = data.result;
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
};

// Google Maps Distance Matrix
const distanceMatrixGoogle = async (origins: string[], destinations: string[], apiKey: string) => {
  const originsStr = origins.join('|');
  const destinationsStr = destinations.join('|');
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(originsStr)}&destinations=${encodeURIComponent(destinationsStr)}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
    const element = data.rows[0].elements[0];
    return {
      distance: element.distance.value / 1000, // km
      duration: element.duration.value / 60, // minutes
      distanceText: element.distance.text,
      durationText: element.duration.text,
    };
  }
  return null;
};

// Reverse Geocode Google
const reverseGeocodeGoogle = async (lat: number, lng: number, apiKey: string) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
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
};

// Routes

// Geocode Address
mapsRouter.post('/make-server-ced858b5/maps/geocode', async (c) => {
  try {
    const { address } = await c.req.json();
    if (!address) return c.json({ error: 'Address required' }, 400);

    const config = await getMapsConfig();
    if (!config.enabled) return c.json({ error: 'Maps not configured' }, 400);

    let result = null;
    if (config.provider === 'google') {
      result = await geocodeGoogle(address, config.apiKey);
    } else if (config.provider === 'ola') {
      result = await geocodeOla(address, config.apiKey);
    }

    if (result) {
      return c.json(result);
    }
    return c.json({ error: 'Geocoding failed' }, 404);
  } catch (error: any) {
    console.error('Geocode error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Reverse Geocode
mapsRouter.post('/make-server-ced858b5/maps/reverse-geocode', async (c) => {
  try {
    const { lat, lng } = await c.req.json();
    if (lat === undefined || lng === undefined) {
      return c.json({ error: 'Latitude and longitude required' }, 400);
    }

    const config = await getMapsConfig();
    if (!config.enabled) return c.json({ error: 'Maps not configured' }, 400);

    let result = null;
    if (config.provider === 'google') {
      result = await reverseGeocodeGoogle(lat, lng, config.apiKey);
    }

    if (result) {
      return c.json(result);
    }
    return c.json({ error: 'Reverse geocoding failed' }, 404);
  } catch (error: any) {
    console.error('Reverse geocode error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Autocomplete
mapsRouter.post('/make-server-ced858b5/maps/autocomplete', async (c) => {
  try {
    const { input, sessionToken } = await c.req.json();
    if (!input) return c.json({ predictions: [] });

    const config = await getMapsConfig();
    if (!config.enabled) return c.json({ predictions: [] });

    let predictions = [];
    if (config.provider === 'google') {
      predictions = await autocompleteGoogle(input, config.apiKey, sessionToken);
    }

    return c.json({ predictions });
  } catch (error: any) {
    console.error('Autocomplete error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Place Details
mapsRouter.post('/make-server-ced858b5/maps/place-details', async (c) => {
  try {
    const { placeId } = await c.req.json();
    if (!placeId) return c.json({ error: 'Place ID required' }, 400);

    const config = await getMapsConfig();
    if (!config.enabled) return c.json({ error: 'Maps not configured' }, 400);

    let result = null;
    if (config.provider === 'google') {
      result = await placeDetailsGoogle(placeId, config.apiKey);
    }

    if (result) {
      return c.json(result);
    }
    return c.json({ error: 'Place details not found' }, 404);
  } catch (error: any) {
    console.error('Place details error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Distance Matrix
mapsRouter.post('/make-server-ced858b5/maps/distance', async (c) => {
  try {
    const { origins, destinations } = await c.req.json();
    if (!origins || !destinations) {
      return c.json({ error: 'Origins and destinations required' }, 400);
    }

    const config = await getMapsConfig();
    if (!config.enabled) return c.json({ error: 'Maps not configured' }, 400);

    let result = null;
    if (config.provider === 'google') {
      result = await distanceMatrixGoogle(origins, destinations, config.apiKey);
    }

    if (result) {
      return c.json(result);
    }
    return c.json({ error: 'Distance calculation failed' }, 404);
  } catch (error: any) {
    console.error('Distance calculation error:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default mapsRouter;
