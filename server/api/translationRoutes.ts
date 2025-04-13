import { Router } from 'express';
import { v2 } from '@google-cloud/translate';
import textToSpeech from '@google-cloud/text-to-speech';

const router = Router();
const { Translate } = v2;

// Initialize translation client
let translate: v2.Translate;
try {
  translate = new Translate({
    key: process.env.GOOGLE_TRANSLATE_API_KEY || process.env.GOOGLE_CLOUD_API_KEY,
  });
  console.log('Google Translate client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Google Translate client:', error);
}

// Initialize text-to-speech client
let ttsClient: textToSpeech.TextToSpeechClient;
try {
  ttsClient = new textToSpeech.TextToSpeechClient({
    key: process.env.GOOGLE_TTS_API_KEY || process.env.GOOGLE_CLOUD_API_KEY,
  });
  console.log('Google Text-to-Speech client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Google Text-to-Speech client:', error);
}

// Translate text
router.post('/translate', async (req, res) => {
  try {
    if (!translate) {
      return res.status(503).json({ 
        error: 'Translation service not available',
        message: 'The translation service is currently unavailable.'
      });
    }

    const { text, targetLanguage, sourceLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'Text and target language are required.'
      });
    }

    const options: any = {
      to: targetLanguage,
    };

    if (sourceLanguage) {
      options.from = sourceLanguage;
    }

    const [translation] = await translate.translate(text, options);
    
    // For translations, the first response is always the translated text
    return res.json({
      translatedText: translation,
      detectedSourceLanguage: sourceLanguage ? undefined : (translation as any).detectedSourceLanguage,
    });
  } catch (error: any) {
    console.error('Translation error:', error);
    
    return res.status(500).json({
      error: 'Translation error',
      message: error.message || 'An error occurred during translation.',
    });
  }
});

// Detect language
router.post('/detect-language', async (req, res) => {
  try {
    if (!translate) {
      return res.status(503).json({ 
        error: 'Translation service not available',
        message: 'The language detection service is currently unavailable.'
      });
    }

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Missing required parameter',
        message: 'Text is required for language detection.'
      });
    }

    const [detections] = await translate.detect(text);
    const detection = Array.isArray(detections) ? detections[0] : detections;
    
    return res.json({
      detectedLanguage: detection.language,
      confidence: detection.confidence,
    });
  } catch (error: any) {
    console.error('Language detection error:', error);
    
    return res.status(500).json({
      error: 'Language detection error',
      message: error.message || 'An error occurred during language detection.',
    });
  }
});

// Text-to-Speech
router.post('/text-to-speech', async (req, res) => {
  try {
    if (!ttsClient) {
      return res.status(503).json({ 
        error: 'Text-to-speech service not available',
        message: 'The text-to-speech service is currently unavailable.'
      });
    }

    const { text, languageCode, voiceName, speakingRate } = req.body;

    if (!text || !languageCode) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'Text and language code are required.'
      });
    }

    // Configure voice settings
    const voice = {
      languageCode: languageCode,
      name: voiceName || '',
    };

    // Configure audio settings
    const audioConfig = {
      audioEncoding: 'MP3' as const,
      speakingRate: speakingRate || 1.0,
    };

    // Perform the text-to-speech request
    const [response] = await ttsClient.synthesizeSpeech({
      input: { text },
      voice,
      audioConfig,
    });

    // Convert audio content to base64
    const audioContent = response.audioContent?.toString('base64');

    return res.json({
      audioContent,
    });
  } catch (error: any) {
    console.error('Text-to-speech error:', error);
    
    return res.status(500).json({
      error: 'Text-to-speech error',
      message: error.message || 'An error occurred during text-to-speech conversion.',
    });
  }
});

export default router;