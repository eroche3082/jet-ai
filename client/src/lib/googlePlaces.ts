// Google Places API utilities
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY || '';

export interface PlacePrediction {
  id: string;
  description: string;
  placeId: string;
  mainText: string;
  secondaryText: string;
}

// This function gets place autocomplete predictions
export async function getPlaceAutocomplete(
  input: string,
  types: string = 'locality|country'
): Promise<PlacePrediction[]> {
  if (!input || input.length < 2) return [];
  
  try {
    const response = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(input)}&types=${types}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching place autocomplete: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.predictions.map((p: any) => ({
      id: p.place_id,
      description: p.description,
      placeId: p.place_id,
      mainText: p.structured_formatting?.main_text || p.description,
      secondaryText: p.structured_formatting?.secondary_text || ''
    }));
  } catch (error) {
    console.error('Error fetching place autocomplete:', error);
    return [];
  }
}

// This function gets place details by placeId
export async function getPlaceDetails(placeId: string): Promise<any> {
  try {
    const response = await fetch(`/api/places/details?place_id=${placeId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching place details: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}