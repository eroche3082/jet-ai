/**
 * Generador de Itinerarios para JetAI
 * Este archivo contiene funciones para generar itinerarios personalizados
 * basados en los perfiles de los usuarios.
 */

import { UserProfile } from "./conversationFlow";
import { googleCloud } from "./googlecloud";
import Anthropic from "@anthropic-ai/sdk";

// Esta función será implementada o reemplazada según sea necesario
async function analyzeText(prompt: string, type: string): Promise<string> {
  try {
    // En una implementación real, esto se conectaría con una API de IA
    // Por ahora, devolveremos respuestas genéricas para pruebas
    if (type === 'ai') {
      return `${prompt}\n\nThis is a placeholder response for AI text analysis.`;
    } else if (type === 'weather') {
      return `The weather is generally pleasant year-round. Pack for varying conditions.`;
    } else if (type === 'itinerary') {
      // Devolver un JSON simple para itinerario de prueba
      return JSON.stringify({
        days: [
          {
            day: 1,
            activities: [
              {
                time: "9:00 AM",
                activity: "City Tour",
                description: "Explore the main attractions",
                location: "City Center",
                cost: "$30"
              },
              {
                time: "1:00 PM",
                activity: "Lunch",
                description: "Enjoy local cuisine",
                location: "Old Town Restaurant",
                cost: "$15-25"
              }
            ]
          }
        ],
        additionalInfo: {
          weather: "Generally sunny, pack sunscreen",
          localCurrency: "Local currency is accepted everywhere",
          safetyTips: "The area is generally safe for tourists",
          customTips: ["Learn a few local phrases", "Try the local specialty dishes"]
        }
      });
    }
    
    return "No specific analysis available for this query type.";
  } catch (error) {
    console.error('Error in analyzeText:', error);
    return "Error processing text analysis request.";
  }
};

// Definición de tipo para formData
export interface FormData {
  name?: string;
  email?: string;
  destination?: string;
  budget?: string;
  dates?: string;
  travelers?: string;
  interests?: string;
  confirmation?: string;
}

// Estructura de un itinerario
export interface Itinerary {
  destination: string;
  dateRange: string;
  travelers: string;
  days: {
    day: number;
    activities: {
      time: string;
      activity: string;
      description: string;
      location?: string;
      cost?: string;
    }[];
  }[];
  budget: string;
  additionalInfo?: {
    weather?: string;
    localCurrency?: string;
    safetyTips?: string;
    customTips?: string[];
  };
}

/**
 * Genera un itinerario completo basado en el perfil del usuario
 */
// Define un tipo que acepte cualquier objeto con las propiedades necesarias del perfil
type ItineraryUserProfile = {
  destination?: string;
  budget?: string;
  dates?: string;
  travelers?: string;
  interests?: string | string[];
  [key: string]: any;
};

// Función para convertir un itinerario en texto para el usuario
export async function generateUserItinerary(profile: ItineraryUserProfile): Promise<string> {
  try {
    const itinerary = await generateItinerary(profile);
    
    // Convertir el itinerario a un formato markdown legible
    let itineraryText = `# Itinerario para ${itinerary.destination}\n\n`;
    
    // Agregar información general
    itineraryText += `## Información general\n`;
    itineraryText += `- **Destino:** ${itinerary.destination}\n`;
    itineraryText += `- **Fechas:** ${itinerary.dateRange}\n`;
    itineraryText += `- **Viajeros:** ${itinerary.travelers}\n`;
    itineraryText += `- **Presupuesto:** ${itinerary.budget}\n\n`;
    
    // Agregar días
    for (const day of itinerary.days) {
      itineraryText += `## Día ${day.day}\n\n`;
      
      for (const activity of day.activities) {
        itineraryText += `### ${activity.time} - ${activity.activity}\n`;
        itineraryText += `${activity.description}\n`;
        
        if (activity.location) {
          itineraryText += `**Ubicación:** ${activity.location}\n`;
        }
        
        if (activity.cost) {
          itineraryText += `**Costo aproximado:** ${activity.cost}\n`;
        }
        
        itineraryText += '\n';
      }
    }
    
    // Agregar información adicional
    if (itinerary.additionalInfo) {
      itineraryText += `## Información adicional\n\n`;
      
      if (itinerary.additionalInfo.weather) {
        itineraryText += `### Clima\n${itinerary.additionalInfo.weather}\n\n`;
      }
      
      if (itinerary.additionalInfo.localCurrency) {
        itineraryText += `### Moneda local\n${itinerary.additionalInfo.localCurrency}\n\n`;
      }
      
      if (itinerary.additionalInfo.safetyTips) {
        itineraryText += `### Consejos de seguridad\n${itinerary.additionalInfo.safetyTips}\n\n`;
      }
      
      if (itinerary.additionalInfo.customTips && itinerary.additionalInfo.customTips.length > 0) {
        itineraryText += `### Consejos adicionales\n`;
        for (const tip of itinerary.additionalInfo.customTips) {
          itineraryText += `- ${tip}\n`;
        }
      }
    }
    
    return itineraryText;
  } catch (error) {
    console.error('Error generating user itinerary text:', error);
    return `Lo siento, no fue posible generar un itinerario para ${profile.destination || 'el destino solicitado'}.`;
  }
}

/**
 * Genera un itinerario completo basado en el perfil del usuario
 */
export async function generateItinerary(profile: ItineraryUserProfile): Promise<Itinerary> {
  try {
    // Primero verificamos si tenemos todos los datos necesarios
    if (!profile.destination) {
      throw new Error("El destino es obligatorio para generar un itinerario");
    }

    // Determinar duración del viaje basado en el campo de fechas (esto es una aproximación simple)
    let durationDays = 3; // Por defecto 3 días
    if (profile.dates) {
      const datesLower = profile.dates.toLowerCase();
      // Buscar patrones que indiquen duración
      if (datesLower.includes("weekend") || datesLower.includes("fin de semana")) {
        durationDays = 2;
      } else if (datesLower.includes("week") || datesLower.includes("semana")) {
        durationDays = 7;
      } else if (
        datesLower.includes("fortnight") ||
        datesLower.includes("two weeks") ||
        datesLower.includes("dos semanas") ||
        datesLower.includes("quincena")
      ) {
        durationDays = 14;
      }
      
      // Buscar números específicos de días en múltiples idiomas
      const daysPatterns = [
        // Español
        /(\d+)\s*(días?|d[ií]as?|d\b)/i,
        // Italiano
        /(\d+)\s*(giorni|giorno)\b/i,
        // Portugués
        /(\d+)\s*(dias?)\b/i,
        // Inglés
        /(\d+)\s*(days?|d\b)/i,
        // Español - semanas
        /(\d+)\s*(semanas?)\b/i,
        // Italiano - semanas
        /(\d+)\s*(settimane?)\b/i,
        // Portugués - semanas
        /(\d+)\s*(semanas?)\b/i,
        // Inglés - semanas
        /(\d+)\s*(weeks?)\b/i,
        // Español - noches
        /(\d+)\s*(noches?)\b/i,
        // Italiano - noches
        /(\d+)\s*(notti?)\b/i,
        // Portugués - noches
        /(\d+)\s*(noites?)\b/i,
        // Inglés - noches
        /(\d+)\s*(nights?)\b/i
      ];
      
      // Intentar cada patrón
      for (const pattern of daysPatterns) {
        const match = datesLower.match(pattern);
        if (match && match[1]) {
          let multiplier = 1; // Por defecto para días
          
          // Si son semanas, multiplicar por 7
          if (match[2] && (
              match[2].startsWith('semana') || 
              match[2].startsWith('settiman') || 
              match[2].startsWith('week'))) {
            multiplier = 7;
          }
          
          durationDays = parseInt(match[1], 10) * multiplier;
          break; // Terminamos al encontrar el primer patrón que coincida
        }
      }
    }
    
    // Preparar la estructura del itinerario
    let itinerary: Itinerary = {
      destination: profile.destination,
      dateRange: profile.dates || "Fecha no especificada",
      travelers: profile.travelers || "No especificado",
      days: [],
      budget: profile.budget || "No especificado"
    };

    // Intentar generar el itinerario utilizando IA
    try {
      // Generar un prompt para la IA
      let prompt = `Generate a detailed ${durationDays}-day travel itinerary for ${profile.destination}.`;
      
      if (profile.budget) {
        prompt += ` The budget is ${profile.budget}.`;
      }
      
      if (profile.travelers) {
        prompt += ` Traveling with: ${profile.travelers}.`;
      }
      
      if (profile.interests) {
        prompt += ` Interests include: ${profile.interests}.`;
      }
      
      prompt += `\n\nFormat the response as a JSON object with this structure:
      {
        "days": [
          {
            "day": 1,
            "activities": [
              {
                "time": "9:00 AM",
                "activity": "Activity name",
                "description": "Detailed description",
                "location": "Location name",
                "cost": "Approximate cost"
              }
            ]
          }
        ],
        "additionalInfo": {
          "weather": "Weather forecast",
          "localCurrency": "Currency information",
          "safetyTips": "Safety advice",
          "customTips": ["Tip 1", "Tip 2"]
        }
      }`;

      let itineraryData;
      
      // Intentar con Anthropic Claude
      if (process.env.ANTHROPIC_API_KEY) {
        try {
          const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY
          });
          
          const response = await anthropic.messages.create({
            model: "claude-3-opus-20240229",
            max_tokens: 4000,
            system: "You are an expert travel planner. Create a detailed day-by-day itinerary based on the user's preferences. Format your entire response as a valid JSON object.",
            messages: [{ role: "user", content: prompt }]
          });
          
          // Extraer el JSON de la respuesta
          const content = response.content[0].text;
          try {
            // Buscar el JSON en el texto
            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                              content.match(/```\n([\s\S]*?)\n```/) || 
                              content.match(/({[\s\S]*})/);
                              
            if (jsonMatch && jsonMatch[1]) {
              itineraryData = JSON.parse(jsonMatch[1]);
            } else {
              // Si no hay formato de código, intentar parsear todo el contenido
              itineraryData = JSON.parse(content);
            }
          } catch (e) {
            console.error("Error parsing Anthropic JSON response:", e);
            console.log("Raw content:", content);
            throw new Error("Unable to parse AI-generated itinerary");
          }
        } catch (error) {
          console.error("Error using Anthropic for itinerary:", error);
          // Continuamos para intentar con la siguiente opción
        }
      }
      
      // Si no tenemos datos de Anthropic, intentar con la API genérica
      if (!itineraryData) {
        const aiResponse = await analyzeText(prompt, "itinerary");
        
        try {
          // Intentar extraer JSON de la respuesta
          const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                           aiResponse.match(/```\n([\s\S]*?)\n```/) || 
                           aiResponse.match(/({[\s\S]*})/);
                           
          if (jsonMatch && jsonMatch[1]) {
            itineraryData = JSON.parse(jsonMatch[1]);
          } else {
            itineraryData = JSON.parse(aiResponse);
          }
        } catch (e) {
          console.error("Error parsing generic AI JSON response:", e);
          throw new Error("Unable to parse AI-generated itinerary");
        }
      }
      
      // Ahora fusionamos los datos generados con nuestra estructura de itinerario
      if (itineraryData && itineraryData.days) {
        itinerary.days = itineraryData.days;
        
        if (itineraryData.additionalInfo) {
          itinerary.additionalInfo = itineraryData.additionalInfo;
        }
      }
    } catch (aiError) {
      console.error("AI itinerary generation failed:", aiError);
      
      // Crear un itinerario básico como fallback
      for (let i = 1; i <= durationDays; i++) {
        itinerary.days.push({
          day: i,
          activities: [
            {
              time: "9:00 AM",
              activity: "Exploring the city",
              description: `Discover the sights and attractions of ${profile.destination}`,
              location: "City Center",
              cost: "Varies"
            },
            {
              time: "1:00 PM",
              activity: "Lunch",
              description: "Enjoy local cuisine at a recommended restaurant",
              location: "Local Restaurant",
              cost: "$$"
            },
            {
              time: "3:00 PM",
              activity: "Cultural Visit",
              description: "Visit a significant cultural or historical site",
              location: "Main Attraction",
              cost: "$-$$$"
            }
          ]
        });
      }
      
      // Añadir información adicional básica
      itinerary.additionalInfo = {
        weather: `Check local weather for ${profile.destination} before your trip.`,
        localCurrency: "Research the local currency and exchange rates.",
        safetyTips: "Always keep your belongings secure and be aware of your surroundings.",
        customTips: [
          "Research local customs before arrival",
          "Make copies of important documents",
          "Purchase travel insurance"
        ]
      };
    }
    
    return itinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
}