/**
 * API de Google Cloud en el servidor
 * 
 * Este módulo proporciona endpoints de API para acceder a los servicios de Google Cloud:
 * - Weather API (pronóstico del clima)
 * - Geocoding API (geocodificación de direcciones)
 * - Routes API (rutas y direcciones)
 * - Time Zone API (zonas horarias)
 * - Street View API (vistas de calle)
 * - Static Maps API (mapas estáticos)
 * - Video Intelligence API (análisis de videos)
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { 
  getVisionClient, 
  getTranslationClient, 
  getTextToSpeechClient, 
  getMapsClient,
  getVideoIntelligenceClient
} from '../lib/googleApiConfig';

// Configuración de Multer para almacenar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ 
  storage, 
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB límite de tamaño
});

// Manejador de errores para multer
const handleMulterError = (err: any, req: Request, res: Response, next: Function) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        error: 'El archivo es demasiado grande. El tamaño máximo permitido es 50MB.' 
      });
    }
    return res.status(400).json({ error: `Error de multer: ${err.message}` });
  } else if (err) {
    return res.status(500).json({ error: err.message });
  }
  next();
};

// Ruta para obtener pronóstico del clima
export const getWeatherHandler = async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Se requieren los parámetros lat y lon' });
    }
    
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'No se ha configurado la clave API' });
    }
    
    try {
      // Intentar con Google Weather API
      const response = await fetch(
        `https://weather.googleapis.com/v1/current?location=${lat},${lon}&key=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Error en Weather API: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (primaryError) {
      console.log('El servicio de Weather API no está disponible, usando fallback...');
      
      // FALLBACK: Usar OpenMeteo API (servicio gratuito sin API key)
      try {
        const fallbackResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto`
        );
        
        if (!fallbackResponse.ok) {
          throw new Error('Error en el servicio de clima alternativo');
        }
        
        const fallbackData = await fallbackResponse.json();
        
        // Transformar datos de fallback para coincidir con el formato esperado
        const formattedData = {
          current: {
            temperature: {
              value: fallbackData.current.temperature_2m,
              unit: fallbackData.current_units.temperature_2m
            },
            humidity: {
              value: fallbackData.current.relative_humidity_2m,
              unit: fallbackData.current_units.relative_humidity_2m
            },
            windSpeed: {
              value: fallbackData.current.wind_speed_10m,
              unit: fallbackData.current_units.wind_speed_10m
            },
            precipitation: {
              value: fallbackData.current.precipitation,
              unit: fallbackData.current_units.precipitation
            },
            weatherCode: fallbackData.current.weather_code,
            _source: 'fallback_openmeteo'
          },
          location: {
            latitude: Number(lat),
            longitude: Number(lon)
          }
        };
        
        res.json(formattedData);
      } catch (fallbackError: any) {
        // Si ambos servicios fallan, enviar error más detallado
        console.error('Error en el servicio de clima alternativo:', fallbackError);
        throw new Error('Todos los servicios de clima están fallando');
      }
    }
  } catch (error: any) {
    console.error('Error en el servicio de clima:', error);
    res.status(503).json({ 
      error: error.message,
      suggestion: 'Verifica que la API de Weather esté habilitada en tu cuenta de Google Cloud.'
    });
  }
};

// Ruta para geocodificar direcciones
export const geocodeHandler = async (req: Request, res: Response) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Se requiere el parámetro address' });
    }
    
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'No se ha configurado la clave API' });
    }
    
    try {
      // Intentar con Google Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address as string
        )}&key=${apiKey}`
      );
      
      const data = await response.json();
      
      // Verificar si hay error de autorización
      if (data.status === 'REQUEST_DENIED') {
        throw new Error(data.error_message || 'Error de autorización en Geocoding API');
      }
      
      res.json(data);
    } catch (primaryError) {
      console.log('El servicio de Geocoding API no está disponible, usando fallback...');
      
      // FALLBACK: Usar OpenStreetMap Nominatim (servicio gratuito sin API key)
      try {
        const fallbackResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            address as string
          )}&format=json&addressdetails=1&limit=5`,
          {
            headers: {
              'User-Agent': 'JetAI/1.0' // Nominatim requiere un User-Agent
            }
          }
        );
        
        if (!fallbackResponse.ok) {
          throw new Error('Error en el servicio de geocodificación alternativo');
        }
        
        const fallbackData = await fallbackResponse.json();
        
        // Transformar datos de fallback para coincidir con el formato de Google
        const formattedData = {
          results: fallbackData.map((item: any) => ({
            place_id: item.place_id,
            formatted_address: item.display_name,
            geometry: {
              location: {
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon)
              },
              location_type: 'APPROXIMATE',
              viewport: {
                northeast: {
                  lat: parseFloat(item.boundingbox[1]),
                  lng: parseFloat(item.boundingbox[3])
                },
                southwest: {
                  lat: parseFloat(item.boundingbox[0]),
                  lng: parseFloat(item.boundingbox[2])
                }
              }
            },
            types: [item.type],
            address_components: Object.entries(item.address).map(([type, value]) => ({
              long_name: value,
              short_name: value,
              types: [type]
            })),
            _source: 'fallback_nominatim'
          })),
          status: fallbackData.length > 0 ? 'OK' : 'ZERO_RESULTS'
        };
        
        res.json(formattedData);
      } catch (fallbackError: any) {
        console.error('Error en el servicio de geocodificación alternativo:', fallbackError);
        throw new Error('Todos los servicios de geocodificación están fallando');
      }
    }
  } catch (error: any) {
    console.error('Error en el servicio de geocodificación:', error);
    res.status(503).json({ 
      error: error.message,
      suggestion: 'Verifica que la API de Geocoding esté habilitada en tu cuenta de Google Cloud.'
    });
  }
};

// Ruta para obtener rutas
export const getRoutesHandler = async (req: Request, res: Response) => {
  try {
    const { origin, destination, mode, waypoints } = req.query;
    
    if (!origin || !destination) {
      return res.status(400).json({ 
        error: 'Se requieren los parámetros origin y destination' 
      });
    }
    
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'No se ha configurado la clave API' });
    }
    
    try {
      // Intentar con Google Routes API
      let url = `https://routes.googleapis.com/directions/v2:computeRoutes`;
      
      const requestBody = {
        origin: {
          address: origin as string
        },
        destination: {
          address: destination as string
        },
        travelMode: (mode as string || 'DRIVE').toUpperCase(),
        routingPreference: "TRAFFIC_AWARE",
        computeAlternativeRoutes: true,
        languageCode: "es-ES",
        units: "METRIC"
      };
      
      // Si hay waypoints, agregarlos a la solicitud
      if (waypoints) {
        Object.assign(requestBody, {
          intermediates: (waypoints as string).split('|').map(wp => ({ address: wp }))
        });
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`Error en Routes API: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Agregar fuente de datos para seguimiento
      Object.assign(data, { _source: 'google_routes_api' });
      
      res.json(data);
    } catch (primaryError) {
      console.log('El servicio de Routes API no está disponible, usando fallback...');
      
      // FALLBACK: Usar OpenStreetMap Routing Machine (OSRM)
      try {
        // Primero convertir las direcciones en coordenadas usando nuestro servicio geocoding con fallback
        const originCoords = await getCoordinatesFromAddress(origin as string);
        const destinationCoords = await getCoordinatesFromAddress(destination as string);
        
        if (!originCoords || !destinationCoords) {
          throw new Error('No se pudieron obtener las coordenadas de las direcciones');
        }
        
        // Determinar el perfil (tipo de ruta) basado en el modo
        let profile = 'driving';
        if (mode) {
          const modeStr = (mode as string).toLowerCase();
          if (modeStr === 'walking' || modeStr === 'walk') profile = 'foot';
          if (modeStr === 'bicycling' || modeStr === 'bicycle') profile = 'bike';
        }
        
        // Construir URL para servicio OSRM público
        let osrmUrl = `https://router.project-osrm.org/route/v1/${profile}/`;
        osrmUrl += `${originCoords.lng},${originCoords.lat};${destinationCoords.lng},${destinationCoords.lat}`;
        osrmUrl += '?overview=full&geometries=polyline&steps=true';
        
        // Agregar waypoints si existen
        if (waypoints && waypoints.toString().trim() !== '') {
          osrmUrl = await addWaypointsToOsrmUrl(osrmUrl, waypoints as string, profile);
        }
        
        const fallbackResponse = await fetch(osrmUrl);
        
        if (!fallbackResponse.ok) {
          throw new Error('Error en el servicio de rutas alternativo');
        }
        
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData.code !== 'Ok' || !fallbackData.routes || fallbackData.routes.length === 0) {
          throw new Error('No se encontraron rutas para el trayecto solicitado');
        }
        
        // Transformar datos de fallback para coincidir con el formato de Google
        const mainRoute = fallbackData.routes[0];
        
        const formattedData = {
          routes: [{
            duration: {
              seconds: Math.round(mainRoute.duration)
            },
            distanceMeters: Math.round(mainRoute.distance),
            polyline: {
              encodedPolyline: mainRoute.geometry
            },
            legs: mainRoute.legs.map((leg: any, index: number) => ({
              steps: leg.steps.map((step: any) => ({
                distanceMeters: Math.round(step.distance),
                duration: { seconds: Math.round(step.duration) },
                navigationInstruction: { instructions: step.maneuver.instruction }
              }))
            }))
          }],
          _source: 'fallback_osrm',
          _source_info: {
            provider: 'OpenStreetMap Routing Machine',
            profile: profile
          }
        };
        
        res.json(formattedData);
      } catch (fallbackError: any) {
        console.error('Error en el servicio de rutas alternativo:', fallbackError);
        throw new Error('Todos los servicios de rutas están fallando: ' + fallbackError.message);
      }
    }
  } catch (error: any) {
    console.error('Error en el servicio de rutas:', error);
    res.status(503).json({ 
      error: error.message,
      suggestion: 'Verifica que la API de Routes esté habilitada en tu cuenta de Google Cloud.'
    });
  }
};

// Función auxiliar para obtener coordenadas a partir de una dirección
async function getCoordinatesFromAddress(address: string): Promise<{lat: number, lng: number} | null> {
  try {
    // Intentar primero con nuestra API de geocodificación
    const response = await fetch(`http://localhost:5000/api/geocode?address=${encodeURIComponent(address)}`);
    
    if (!response.ok) {
      throw new Error('Error en el servicio de geocodificación');
    }
    
    const data = await response.json();
    
    if (data.status === 'ZERO_RESULTS' || !data.results || data.results.length === 0) {
      throw new Error('No se encontraron resultados para la dirección');
    }
    
    const location = data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  } catch (error) {
    console.error('Error obteniendo coordenadas:', error);
    return null;
  }
}

// Función auxiliar para agregar waypoints a la URL de OSRM
async function addWaypointsToOsrmUrl(baseUrl: string, waypointsStr: string, profile: string): Promise<string> {
  try {
    // Separar waypoints y convertirlos en coordenadas
    const waypointList = waypointsStr.split('|');
    let newUrl = baseUrl.split('?')[0]; // Quitar parámetros
    
    // Extraer coordenadas originales
    const coordParts = newUrl.split(`/${profile}/`)[1].split(';');
    const origin = coordParts[0];
    const destination = coordParts[coordParts.length - 1];
    
    // Iniciar nueva cadena de coordenadas con origen
    let coords = origin;
    
    // Agregar cada waypoint
    for (const waypoint of waypointList) {
      const waypointCoords = await getCoordinatesFromAddress(waypoint);
      if (waypointCoords) {
        coords += `;${waypointCoords.lng},${waypointCoords.lat}`;
      }
    }
    
    // Agregar destino
    coords += `;${destination}`;
    
    // Reconstruir URL
    newUrl = `https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=full&geometries=polyline&steps=true`;
    return newUrl;
  } catch (error) {
    console.error('Error agregando waypoints a OSRM:', error);
    return baseUrl; // Devolver URL original en caso de error
  }
}

// Ruta para obtener zona horaria
export const getTimeZoneHandler = async (req: Request, res: Response) => {
  try {
    const { location, timestamp } = req.query;
    
    if (!location) {
      return res.status(400).json({ error: 'Se requiere el parámetro location' });
    }
    
    const time = timestamp || Math.floor(Date.now() / 1000);
    
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'No se ha configurado la clave API' });
    }
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/timezone/json?location=${location}&timestamp=${time}&key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Error en Time Zone API: ${response.statusText}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error en el servicio de zona horaria:', error);
    res.status(500).json({ error: error.message });
  }
};

// Ruta para obtener imagen de Street View
export const getStreetViewHandler = async (req: Request, res: Response) => {
  try {
    const { location, size, heading, pitch } = req.query;
    
    if (!location) {
      return res.status(400).json({ error: 'Se requiere el parámetro location' });
    }
    
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'No se ha configurado la clave API' });
    }
    
    let url = `https://maps.googleapis.com/maps/api/streetview?key=${apiKey}`;
    url += `&location=${encodeURIComponent(location as string)}`;
    url += `&size=${size || '600x400'}`;
    
    if (heading) url += `&heading=${heading}`;
    if (pitch) url += `&pitch=${pitch}`;
    
    // Redireccionar a la URL de la imagen
    res.redirect(url);
  } catch (error: any) {
    console.error('Error en el servicio de Street View:', error);
    res.status(500).json({ error: error.message });
  }
};

// Ruta para obtener mapa estático
export const getStaticMapHandler = async (req: Request, res: Response) => {
  try {
    const { center, zoom, size, markers } = req.query;
    
    if (!center) {
      return res.status(400).json({ error: 'Se requiere el parámetro center' });
    }
    
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'No se ha configurado la clave API' });
    }
    
    let url = `https://maps.googleapis.com/maps/api/staticmap?key=${apiKey}`;
    url += `&center=${encodeURIComponent(center as string)}`;
    url += `&zoom=${zoom || 13}`;
    url += `&size=${size || '600x400'}`;
    
    // Agregar marcadores si existen
    if (markers) {
      try {
        const markerList = JSON.parse(markers as string);
        markerList.forEach((marker: any) => {
          const color = marker.color || 'red';
          const label = marker.label || '';
          url += `&markers=color:${color}|label:${label}|${encodeURIComponent(marker.location)}`;
        });
      } catch (e) {
        console.warn('Error al parsear marcadores:', e);
      }
    }
    
    // Redireccionar a la URL de la imagen
    res.redirect(url);
  } catch (error: any) {
    console.error('Error en el servicio de mapa estático:', error);
    res.status(500).json({ error: error.message });
  }
};

// Ruta para analizar videos
export const analyzeVideoHandler = async (req: Request, res: Response) => {
  try {
    const videoClient = getVideoIntelligenceClient();
    if (!videoClient) {
      return res.status(500).json({ error: 'Cliente de Video Intelligence no disponible' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'Se requiere un archivo de video' });
    }
    
    const features = req.body.features 
      ? JSON.parse(req.body.features) 
      : ['LABEL_DETECTION'];
    
    const request = {
      inputContent: req.file.buffer.toString('base64'),
      features: features,
      locationId: 'us-east1',
    };
    
    const [operation] = await videoClient.annotateVideo(request);
    const [response] = await operation.promise();
    
    res.json(response);
  } catch (error: any) {
    console.error('Error en el servicio de análisis de video:', error);
    res.status(500).json({ error: error.message });
  }
};

// Configuración de rutas
export const configureRoutes = (app: any) => {
  const router = Router();
  
  // Configurar rutas para los servicios de Google Cloud
  router.get('/weather', getWeatherHandler);
  router.get('/geocode', geocodeHandler);
  router.get('/routes', getRoutesHandler);
  router.get('/timezone', getTimeZoneHandler);
  router.get('/streetview', getStreetViewHandler);
  router.get('/static-map', getStaticMapHandler);
  router.post('/video-intelligence', upload.single('video'), handleMulterError, analyzeVideoHandler);
  
  app.use('/api', router);
  
  console.log('Rutas de Google API configuradas correctamente');
};

export default {
  configureRoutes,
  getWeatherHandler,
  geocodeHandler,
  getRoutesHandler,
  getTimeZoneHandler,
  getStreetViewHandler,
  getStaticMapHandler,
  analyzeVideoHandler
};