// This service handles communication with the Google Translate API through our backend

interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

interface TranslationResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
  error?: string;
}

interface TextToSpeechRequest {
  text: string;
  languageCode: string;
  voiceName?: string;
  speakingRate?: number;
}

interface TextToSpeechResponse {
  audioContent?: string; // Base64 encoded audio content
  error?: string;
}

interface LanguageDetectionRequest {
  text: string;
}

interface LanguageDetectionResponse {
  detectedLanguage: string;
  confidence: number;
  error?: string;
}

export async function translateText(params: TranslationRequest): Promise<TranslationResponse> {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Translation failed');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Translation error:', error);
    return {
      translatedText: '',
      error: error.message || 'Failed to translate text',
    };
  }
}

export async function textToSpeech(params: TextToSpeechRequest): Promise<TextToSpeechResponse> {
  try {
    const response = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Text-to-speech conversion failed');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Text-to-speech error:', error);
    return {
      error: error.message || 'Failed to convert text to speech',
    };
  }
}

export async function detectLanguage(params: LanguageDetectionRequest): Promise<LanguageDetectionResponse> {
  try {
    const response = await fetch('/api/detect-language', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Language detection failed');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Language detection error:', error);
    return {
      detectedLanguage: 'unknown',
      confidence: 0,
      error: error.message || 'Failed to detect language',
    };
  }
}

// Language learning progress tracking
export interface UserLanguageLearningProgress {
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  completedLessons: number[];
  destination?: string;
  lastActivity?: Date;
}

export function saveLanguageLearningProgress(progress: UserLanguageLearningProgress): void {
  localStorage.setItem('jetai_language_preferences', JSON.stringify(progress));
}

export function getLanguageLearningProgress(): UserLanguageLearningProgress | null {
  const savedProgress = localStorage.getItem('jetai_language_preferences');
  if (!savedProgress) return null;
  
  try {
    return JSON.parse(savedProgress);
  } catch (e) {
    console.error('Error parsing language learning progress:', e);
    return null;
  }
}

// Helper to get all supported languages
export const getSupportedLanguages = () => [
  { code: 'es', name: 'Spanish', destinations: ['Spain', 'Mexico', 'Argentina'], flagEmoji: '🇪🇸' },
  { code: 'fr', name: 'French', destinations: ['France', 'Canada', 'Switzerland'], flagEmoji: '🇫🇷' },
  { code: 'it', name: 'Italian', destinations: ['Italy'], flagEmoji: '🇮🇹' },
  { code: 'de', name: 'German', destinations: ['Germany', 'Austria', 'Switzerland'], flagEmoji: '🇩🇪' },
  { code: 'ja', name: 'Japanese', destinations: ['Japan'], flagEmoji: '🇯🇵' },
  { code: 'zh', name: 'Mandarin Chinese', destinations: ['China', 'Taiwan', 'Singapore'], flagEmoji: '🇨🇳' },
  { code: 'pt', name: 'Portuguese', destinations: ['Portugal', 'Brazil'], flagEmoji: '🇵🇹' },
  { code: 'ru', name: 'Russian', destinations: ['Russia'], flagEmoji: '🇷🇺' },
];

// Get language name from code
export function getLanguageName(code: string): string {
  const language = getSupportedLanguages().find(lang => lang.code === code);
  return language ? language.name : code;
}

// Get phrase collections by language and level
export function getPhrasesForLanguage(
  languageCode: string, 
  category: 'travel' | 'business' | 'emergency' | 'social' = 'travel'
): { phrase: string; translation: string }[] {
  const phrasesMap: Record<string, Record<string, { phrase: string; translation: string }[]>> = {
    travel: {
      es: [
        { phrase: 'Hola, ¿cómo estás?', translation: 'Hello, how are you?' },
        { phrase: '¿Dónde está el hotel?', translation: 'Where is the hotel?' },
        { phrase: 'Me gustaría reservar una habitación', translation: 'I would like to book a room' },
        { phrase: '¿Cuánto cuesta esto?', translation: 'How much does this cost?' },
        { phrase: 'La cuenta, por favor', translation: 'The bill, please' },
      ],
      fr: [
        { phrase: 'Bonjour, comment allez-vous?', translation: 'Hello, how are you?' },
        { phrase: 'Où est l\'hôtel?', translation: 'Where is the hotel?' },
        { phrase: 'Je voudrais réserver une chambre', translation: 'I would like to book a room' },
        { phrase: 'Combien ça coûte?', translation: 'How much does this cost?' },
        { phrase: 'L\'addition, s\'il vous plaît', translation: 'The bill, please' },
      ],
      de: [
        { phrase: 'Hallo, wie geht es Ihnen?', translation: 'Hello, how are you?' },
        { phrase: 'Wo ist das Hotel?', translation: 'Where is the hotel?' },
        { phrase: 'Ich möchte ein Zimmer buchen', translation: 'I would like to book a room' },
        { phrase: 'Wie viel kostet das?', translation: 'How much does this cost?' },
        { phrase: 'Die Rechnung, bitte', translation: 'The bill, please' },
      ],
    },
    emergency: {
      es: [
        { phrase: 'Necesito ayuda', translation: 'I need help' },
        { phrase: 'Llame a un médico, por favor', translation: 'Call a doctor, please' },
        { phrase: 'Es una emergencia', translation: 'It\'s an emergency' },
        { phrase: 'Perdí mi pasaporte', translation: 'I lost my passport' },
        { phrase: '¿Dónde está el hospital?', translation: 'Where is the hospital?' },
      ],
      fr: [
        { phrase: 'J\'ai besoin d\'aide', translation: 'I need help' },
        { phrase: 'Appelez un médecin, s\'il vous plaît', translation: 'Call a doctor, please' },
        { phrase: 'C\'est une urgence', translation: 'It\'s an emergency' },
        { phrase: 'J\'ai perdu mon passeport', translation: 'I lost my passport' },
        { phrase: 'Où est l\'hôpital?', translation: 'Where is the hospital?' },
      ],
      de: [
        { phrase: 'Ich brauche Hilfe', translation: 'I need help' },
        { phrase: 'Rufen Sie bitte einen Arzt', translation: 'Call a doctor, please' },
        { phrase: 'Es ist ein Notfall', translation: 'It\'s an emergency' },
        { phrase: 'Ich habe meinen Pass verloren', translation: 'I lost my passport' },
        { phrase: 'Wo ist das Krankenhaus?', translation: 'Where is the hospital?' },
      ],
    },
  };

  return phrasesMap[category]?.[languageCode] || [];
}

// Get lesson content by language and level
export function getLessonsForLanguage(
  languageCode: string,
  level: 'beginner' | 'intermediate' | 'advanced'
): { id: number; title: string; duration: string; completed: boolean }[] {
  // Default lessons that apply to any language
  const lessonsByLevel = {
    beginner: [
      { id: 1, title: 'Greetings and Introductions', duration: '15 min', completed: false },
      { id: 2, title: 'Finding Your Way Around', duration: '20 min', completed: false },
      { id: 3, title: 'Ordering Food and Drinks', duration: '25 min', completed: false },
      { id: 4, title: 'Public Transportation', duration: '15 min', completed: false },
      { id: 5, title: 'Shopping and Bargaining', duration: '20 min', completed: false },
    ],
    intermediate: [
      { id: 1, title: 'Making Conversation', duration: '25 min', completed: false },
      { id: 2, title: 'Travel Emergencies', duration: '30 min', completed: false },
      { id: 3, title: 'Cultural Etiquette', duration: '20 min', completed: false },
      { id: 4, title: 'Booking Accommodations', duration: '15 min', completed: false },
      { id: 5, title: 'Local Customs and Traditions', duration: '30 min', completed: false },
    ],
    advanced: [
      { id: 1, title: 'Negotiating and Business Talk', duration: '35 min', completed: false },
      { id: 2, title: 'Medical Emergencies', duration: '25 min', completed: false },
      { id: 3, title: 'Local Slang and Idioms', duration: '30 min', completed: false },
      { id: 4, title: 'Making Friends Locally', duration: '20 min', completed: false },
      { id: 5, title: 'Discussing Arts and Culture', duration: '30 min', completed: false },
    ],
  };

  return lessonsByLevel[level] || [];
}