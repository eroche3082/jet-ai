export interface Location {
  lat: number;
  lng: number;
  name: string;
  address?: string;
  placeId?: string;
}

export interface MapOptions {
  zoom?: number;
  center?: { lat: number; lng: number };
}

export function getGoogleMapsUrl(location: Location): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name)}&query_place_id=${location.placeId}`;
}

export function getStaticMapUrl(location: Location, width = 600, height = 300, zoom = 13): string {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  return `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=${zoom}&size=${width}x${height}&markers=color:red%7C${location.lat},${location.lng}&key=${apiKey}`;
}

export function getDirectionsUrl(from: Location, to: Location, mode = 'driving'): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from.name)}&destination=${encodeURIComponent(to.name)}&travelmode=${mode}`;
}
