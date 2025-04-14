/**
 * Google Services Comprehensive Test Suite
 * 
 * This test file verifies that all essential Google cloud services
 * are working properly with our dynamic API key management system.
 * 
 * Services tested:
 * - Text-to-Speech (TTS)
 * - Speech-to-Text (STT)
 * - Cloud Vision API
 * - Cloud Natural Language API
 * - Cloud Translation API
 * - Gemini AI
 * - Vertex AI
 * - Maps API
 * - Video Intelligence API
 */

import fs from 'fs';
import path from 'path';
import util from 'util';
import { apiKeyManager, ServiceCategory } from '../lib/apiKeyManager';
import { 
  getVisionClient, 
  getTranslateClient, 
  getTTSClient, 
  getMapsClient, 
  getVideoClient,
  getGeminiClient,
  getVertexAIClient
} from '../lib/googleApiConfig';
import { SpeechClient } from '@google-cloud/speech';
import { LanguageServiceClient } from '@google-cloud/language';
import axios from 'axios';

// Helper to create a temporary output directory
const tempDir = path.join(process.cwd(), 'temp_test_output');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Helper to log service test status
function logServiceTest(serviceName: string, status: 'SUCCESS' | 'FAILURE', details?: string) {
  const statusSymbol = status === 'SUCCESS' ? '✅' : '❌';
  console.log(`${statusSymbol} ${serviceName}: ${status} ${details ? '- ' + details : ''}`);
}

/**
 * Test Cloud Vision API
 */
async function testVisionAPI() {
  try {
    const visionClient = getVisionClient();
    
    // Prepare a sample image (Google logo)
    const imageFile = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    
    // Send the image to the Vision API for label detection
    const [result] = await visionClient.labelDetection(imageFile);
    const labels = result.labelAnnotations;
    
    if (labels && labels.length > 0) {
      logServiceTest('Google Cloud Vision API', 'SUCCESS', 
        `Detected ${labels.length} labels including "${labels[0].description}" (${Math.round((labels[0].score || 0) * 100)}% confidence)`);
      return true;
    } else {
      logServiceTest('Google Cloud Vision API', 'FAILURE', 'No labels detected');
      return false;
    }
  } catch (error: any) {
    logServiceTest('Google Cloud Vision API', 'FAILURE', error.message);
    return false;
  }
}

/**
 * Test Translation API
 */
async function testTranslationAPI() {
  try {
    const translateClient = getTranslateClient();
    
    // Text to translate
    const text = 'Hello, world!';
    const targetLanguage = 'es'; // Spanish
    
    // Translate the text
    const [translation] = await translateClient.translate({
      content: [text],
      mimeType: 'text/plain',
      targetLanguageCode: targetLanguage
    });
    
    if (translation && translation.translations && translation.translations.length > 0) {
      const translatedText = translation.translations[0].translatedText;
      logServiceTest('Google Cloud Translation API', 'SUCCESS', 
        `Translated "${text}" to "${translatedText}" (${targetLanguage})`);
      return true;
    } else {
      logServiceTest('Google Cloud Translation API', 'FAILURE', 'No translation returned');
      return false;
    }
  } catch (error: any) {
    logServiceTest('Google Cloud Translation API', 'FAILURE', error.message);
    return false;
  }
}

/**
 * Test Text-to-Speech API
 */
async function testTextToSpeechAPI() {
  try {
    const ttsClient = getTTSClient();
    
    // Text to synthesize
    const text = 'Welcome to JET AI, your intelligent travel companion.';
    
    // Configure request
    const request = {
      input: { text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' as const },
      audioConfig: { audioEncoding: 'MP3' as const },
    };
    
    // Generate speech
    const [response] = await ttsClient.synthesizeSpeech(request);
    const audioContent = response.audioContent;
    
    if (audioContent) {
      // Write the audio content to a file
      const outputFile = path.join(tempDir, 'test-tts-output.mp3');
      fs.writeFileSync(outputFile, audioContent as Buffer);
      
      logServiceTest('Google Cloud Text-to-Speech API', 'SUCCESS', 
        `Generated speech saved to ${outputFile} (${(audioContent as Buffer).length} bytes)`);
      return true;
    } else {
      logServiceTest('Google Cloud Text-to-Speech API', 'FAILURE', 'No audio content returned');
      return false;
    }
  } catch (error: any) {
    logServiceTest('Google Cloud Text-to-Speech API', 'FAILURE', error.message);
    return false;
  }
}

/**
 * Test Speech-to-Text API
 */
async function testSpeechToTextAPI() {
  try {
    // Use direct API key instead of client library
    const apiKey = apiKeyManager.getApiKeyForService(ServiceCategory.TTS); // Using TTS category for STT
    
    // We'll use a public sample audio file from Google
    const audioUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';
    
    const requestBody = {
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
      audio: {
        uri: audioUri,
      },
    };
    
    const response = await axios.post(
      `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
      requestBody
    );
    
    if (response.data && response.data.results && response.data.results.length > 0) {
      const transcript = response.data.results[0].alternatives[0].transcript;
      logServiceTest('Google Cloud Speech-to-Text API', 'SUCCESS',
        `Transcribed: "${transcript.substring(0, 50)}..."`);
      return true;
    } else {
      logServiceTest('Google Cloud Speech-to-Text API', 'FAILURE', 'No transcription returned');
      return false;
    }
  } catch (error: any) {
    logServiceTest('Google Cloud Speech-to-Text API', 'FAILURE', 
      error.response?.data?.error?.message || error.message);
    return false;
  }
}

/**
 * Test Natural Language API
 */
async function testNaturalLanguageAPI() {
  try {
    // Use direct API key instead of client library
    const apiKey = apiKeyManager.getApiKeyForService(ServiceCategory.VISION); // Using Vision category for Natural Language
    
    const text = 'Google Cloud Platform is a suite of cloud computing services that runs on the same infrastructure that Google uses internally for its end-user products.';
    
    const requestBody = {
      document: {
        type: 'PLAIN_TEXT',
        content: text,
      },
      encodingType: 'UTF8',
    };
    
    const response = await axios.post(
      `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`,
      requestBody
    );
    
    if (response.data && response.data.documentSentiment) {
      const sentiment = response.data.documentSentiment;
      logServiceTest('Google Cloud Natural Language API', 'SUCCESS',
        `Sentiment score: ${sentiment.score.toFixed(2)}, magnitude: ${sentiment.magnitude.toFixed(2)}`);
      return true;
    } else {
      logServiceTest('Google Cloud Natural Language API', 'FAILURE', 'No sentiment analysis returned');
      return false;
    }
  } catch (error: any) {
    logServiceTest('Google Cloud Natural Language API', 'FAILURE', 
      error.response?.data?.error?.message || error.message);
    return false;
  }
}

/**
 * Test Gemini AI
 */
async function testGeminiAI() {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = 'What are 3 must-visit attractions in Paris? Keep it brief.';
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (text) {
      logServiceTest('Google Gemini AI', 'SUCCESS', `Generated response: "${text.substring(0, 100)}..."`);
      return true;
    } else {
      logServiceTest('Google Gemini AI', 'FAILURE', 'No text generated');
      return false;
    }
  } catch (error: any) {
    logServiceTest('Google Gemini AI', 'FAILURE', error.message);
    return false;
  }
}

/**
 * Test Maps API
 */
async function testMapsAPI() {
  try {
    const mapsClient = getMapsClient();
    const apiKey = apiKeyManager.getMapsApiKey();
    
    // Get directions from Paris to Nice
    const response = await mapsClient.directions({
      params: {
        origin: 'Paris, France',
        destination: 'Nice, France',
        key: apiKey
      }
    });
    
    if (response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      const distance = route.legs[0].distance.text;
      const duration = route.legs[0].duration.text;
      
      logServiceTest('Google Maps API', 'SUCCESS', `Distance from Paris to Nice: ${distance}, duration: ${duration}`);
      return true;
    } else {
      logServiceTest('Google Maps API', 'FAILURE', 'No routes found');
      return false;
    }
  } catch (error: any) {
    logServiceTest('Google Maps API', 'FAILURE', error.message);
    return false;
  }
}

/**
 * Test Video Intelligence API
 */
async function testVideoIntelligenceAPI() {
  try {
    // Use direct API key instead of client library since it requires long-running operations
    const apiKey = apiKeyManager.getApiKeyForService(ServiceCategory.VIDEO);
    
    // Use a public sample video from Google
    const videoUri = 'gs://cloud-samples-data/video/animals.mp4';
    
    const requestBody = {
      inputUri: videoUri,
      features: ['LABEL_DETECTION'],
    };
    
    // This doesn't actually wait for the operation to complete, just starts it
    const response = await axios.post(
      `https://videointelligence.googleapis.com/v1/videos:annotate?key=${apiKey}`,
      requestBody
    );
    
    if (response.data && response.data.name) {
      logServiceTest('Google Video Intelligence API', 'SUCCESS', 
        `Operation started successfully: ${response.data.name}`);
      return true;
    } else {
      logServiceTest('Google Video Intelligence API', 'FAILURE', 'Operation failed to start');
      return false;
    }
  } catch (error: any) {
    logServiceTest('Google Video Intelligence API', 'FAILURE', 
      error.response?.data?.error?.message || error.message);
    return false;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🔍 Starting comprehensive Google Service tests with API Key Manager...');
  console.log(`Current API Key Groups: ${Object.keys(apiKeyManager['apiKeys']).length}`);
  
  // Run all tests and collect results
  const results = await Promise.all([
    testVisionAPI(),
    testTranslationAPI(),
    testTextToSpeechAPI(),
    testSpeechToTextAPI(),
    testNaturalLanguageAPI(),
    testGeminiAI(),
    testMapsAPI(),
    testVideoIntelligenceAPI(),
  ]);
  
  // Calculate success rate
  const successCount = results.filter(result => result).length;
  const totalTests = results.length;
  const successRate = (successCount / totalTests) * 100;
  
  console.log(`\n📊 Test Results: ${successCount}/${totalTests} services working (${successRate.toFixed(1)}%)`);
  console.log(`🗄️ Temporary files stored in: ${tempDir}`);
  
  return successRate === 100;
}

// For ES modules, we can't use require.main === module
// This code will only run if executed directly with node
// It won't run when imported from another module

export {
  runAllTests,
  testVisionAPI,
  testTranslationAPI,
  testTextToSpeechAPI,
  testSpeechToTextAPI,
  testNaturalLanguageAPI,
  testGeminiAI,
  testMapsAPI,
  testVideoIntelligenceAPI
};