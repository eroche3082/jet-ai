/**
 * Script de prueba simple para verificar el funcionamiento 
 * del extractor de perfiles y generador de itinerarios
 */

// Importar las funciones necesarias
import { extractUserProfileFromHistory } from './enhancedConversationFlow.ts';
import { generateUserItinerary } from './itineraryGenerator.ts';

// Crear un historial de conversación de prueba
const testHistory = [
  { role: 'user', content: 'Hola, estoy planeando un viaje a Barcelona' },
  { role: 'assistant', content: '¡Excelente elección! Barcelona es una ciudad maravillosa. ¿Cuándo planeas viajar?' },
  { role: 'user', content: 'Estoy pensando en ir la próxima semana por 5 días' },
  { role: 'assistant', content: '¡Perfecto! ¿Viajas solo o acompañado?' },
  { role: 'user', content: 'Vamos 2 personas' },
  { role: 'assistant', content: '¿Y cuál es tu presupuesto aproximado para este viaje?' },
  { role: 'user', content: 'Tengo un presupuesto de 1500 euros aproximadamente' },
  { role: 'assistant', content: '¿Qué tipo de actividades o experiencias te interesan más durante tu visita?' },
  { role: 'user', content: 'Me gusta mucho la gastronomía, la arquitectura y la cultura' },
  { role: 'assistant', content: 'Gracias por toda esta información. ¿Te gustaría que te preparara un itinerario?' },
  { role: 'user', content: 'Sí, por favor, crea un itinerario para mí' }
];

// Función principal para ejecutar el test
async function runTest() {
  console.log('Comenzando prueba de extracción de perfil y generación de itinerario...');
  
  try {
    // Extraer el perfil del historial
    console.log('\n1. Extrayendo perfil del historial de conversación...');
    const userProfile = extractUserProfileFromHistory(testHistory);
    console.log('Perfil extraído:', JSON.stringify(userProfile, null, 2));
    
    // Verificar que tengamos datos suficientes
    if (!userProfile.destination) {
      throw new Error('No se pudo extraer el destino del historial');
    }
    
    // Generar itinerario
    console.log('\n2. Generando itinerario basado en el perfil...');
    const itinerary = await generateUserItinerary(userProfile);
    console.log('Itinerario generado:', itinerary.substring(0, 500) + '...');
    
    console.log('\n✅ Prueba completada con éxito!');
  } catch (error) {
    console.error('\n❌ Error durante la prueba:', error);
  }
}

// Ejecutar la prueba
runTest();