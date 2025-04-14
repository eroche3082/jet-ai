/**
 * Test script for Google API services
 * Verifies API key and service account functionality
 */

import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { SpeechClient } from '@google-cloud/speech';
import { TranslationServiceClient } from '@google-cloud/translate';
import { LanguageServiceClient } from '@google-cloud/language';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Test keys 
const SPEECH_TO_TEXT_KEYS = [
  'abb18c32c54ca1ed1a88a1860f2cbae6665b808a',
  '0223b7d7e9ebd331f039bc34e3358eb1f3c8f39c'
];

const TEXT_TO_SPEECH_KEYS = [
  'b14fd9b505812344b5a120b5276b89645fbfd6a7',
  'c3387999555f04f8a5ae4e712d4c6f81c9b6a95f'
];

const TRANSLATE_API_KEYS = [
  '7c0b1f5f326b71b4150b01ee3aad512dca15161d',
  '25c1f362b81d514d3990d84da07aaa3fcf23616a'
];

const NATURAL_LANGUAGE_KEY = '72a8b832b28f39bea070faacf58db45d06a444f0';
const VISION_API_KEY = 'b678f53b1f4df4affd333d996c746389e95a7fb0';
const GEMINI_API_KEY = 'cd3774b60591bf7032e7d8bbf7b537eca29c4891';

// Universal API key
const UNIVERSAL_API_KEY = 'AIzaSyDnmNNHrQ-xpnOozOZgVv4F9qQpiU-GfdA';

// Test Speech to Text API
async function testSpeechToText() {
  console.log('\n==== Testing Speech to Text API ====');
  
  for (const key of SPEECH_TO_TEXT_KEYS) {
    try {
      const client = new SpeechClient({ key });
      console.log(`Testing Speech to Text with key: ${key.substring(0, 8)}...`);
      
      // Make a simple API call
      const [operation] = await client.longRunningRecognize({
        config: {
          languageCode: 'en-US',
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
        },
        audio: {
          content: Buffer.from('').toString('base64'),
        },
      });
      
      console.log(`✅ Speech to Text API working with key: ${key.substring(0, 8)}...`);
    } catch (error) {
      console.error(`❌ Speech to Text API failed with key: ${key.substring(0, 8)}...`);
      console.error(`Error: ${error.message}`);
    }
  }
  
  // Try with universal key
  try {
    const client = new SpeechClient({ key: UNIVERSAL_API_KEY });
    console.log(`Testing Speech to Text with universal key: ${UNIVERSAL_API_KEY.substring(0, 8)}...`);
    
    // Make a simple API call
    const [operation] = await client.longRunningRecognize({
      config: {
        languageCode: 'en-US',
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
      },
      audio: {
        content: Buffer.from('').toString('base64'),
      },
    });
    
    console.log(`✅ Speech to Text API working with universal key`);
  } catch (error) {
    console.error(`❌ Speech to Text API failed with universal key`);
    console.error(`Error: ${error.message}`);
  }
}

// Test Text to Speech API
async function testTextToSpeech() {
  console.log('\n==== Testing Text to Speech API ====');
  
  for (const key of TEXT_TO_SPEECH_KEYS) {
    try {
      const client = new TextToSpeechClient({ key });
      console.log(`Testing Text to Speech with key: ${key.substring(0, 8)}...`);
      
      // Make a simple API call
      const [response] = await client.listVoices({});
      console.log(`✅ Text to Speech API working with key: ${key.substring(0, 8)}...`);
      console.log(`  Found ${response.voices?.length} voices`);
    } catch (error) {
      console.error(`❌ Text to Speech API failed with key: ${key.substring(0, 8)}...`);
      console.error(`Error: ${error.message}`);
    }
  }
  
  // Try with universal key
  try {
    const client = new TextToSpeechClient({ key: UNIVERSAL_API_KEY });
    console.log(`Testing Text to Speech with universal key: ${UNIVERSAL_API_KEY.substring(0, 8)}...`);
    
    // Make a simple API call
    const [response] = await client.listVoices({});
    console.log(`✅ Text to Speech API working with universal key`);
    console.log(`  Found ${response.voices?.length} voices`);
  } catch (error) {
    console.error(`❌ Text to Speech API failed with universal key`);
    console.error(`Error: ${error.message}`);
  }
}

// Test Translation API
async function testTranslationAPI() {
  console.log('\n==== Testing Translation API ====');
  
  for (const key of TRANSLATE_API_KEYS) {
    try {
      const client = new TranslationServiceClient({ key });
      console.log(`Testing Translation API with key: ${key.substring(0, 8)}...`);
      
      // Make a simple API call
      const projectId = 'jetai-travel-companion';
      const location = 'global';
      
      const request = {
        parent: `projects/${projectId}/locations/${location}`,
        sourceLanguageCode: 'en',
        targetLanguageCode: 'es',
        mimeType: 'text/plain',
        contents: ['Hello, world!'],
      };
      
      const [response] = await client.translateText(request);
      console.log(`✅ Translation API working with key: ${key.substring(0, 8)}...`);
      if (response.translations && response.translations.length > 0) {
        console.log(`  Translation: ${response.translations[0].translatedText}`);
      }
    } catch (error) {
      console.error(`❌ Translation API failed with key: ${key.substring(0, 8)}...`);
      console.error(`Error: ${error.message}`);
    }
  }
  
  // Try with universal key
  try {
    const client = new TranslationServiceClient({ key: UNIVERSAL_API_KEY });
    console.log(`Testing Translation API with universal key: ${UNIVERSAL_API_KEY.substring(0, 8)}...`);
    
    const projectId = 'jetai-travel-companion';
    const location = 'global';
    
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      sourceLanguageCode: 'en',
      targetLanguageCode: 'es',
      mimeType: 'text/plain',
      contents: ['Hello, world!'],
    };
    
    const [response] = await client.translateText(request);
    console.log(`✅ Translation API working with universal key`);
    if (response.translations && response.translations.length > 0) {
      console.log(`  Translation: ${response.translations[0].translatedText}`);
    }
  } catch (error) {
    console.error(`❌ Translation API failed with universal key`);
    console.error(`Error: ${error.message}`);
  }
}

// Test Natural Language API
async function testNaturalLanguageAPI() {
  console.log('\n==== Testing Natural Language API ====');
  
  try {
    const client = new LanguageServiceClient({ key: NATURAL_LANGUAGE_KEY });
    console.log(`Testing Natural Language API with key: ${NATURAL_LANGUAGE_KEY.substring(0, 8)}...`);
    
    // Make a simple API call
    const document = {
      content: 'Google Cloud Platform is a great service for building scalable applications.',
      type: 'PLAIN_TEXT',
    };
    
    const [result] = await client.analyzeSentiment({ document });
    console.log(`✅ Natural Language API working with key: ${NATURAL_LANGUAGE_KEY.substring(0, 8)}...`);
    console.log(`  Document sentiment score: ${result.documentSentiment?.score}`);
  } catch (error) {
    console.error(`❌ Natural Language API failed with key: ${NATURAL_LANGUAGE_KEY.substring(0, 8)}...`);
    console.error(`Error: ${error.message}`);
  }
  
  // Try with universal key
  try {
    const client = new LanguageServiceClient({ key: UNIVERSAL_API_KEY });
    console.log(`Testing Natural Language API with universal key: ${UNIVERSAL_API_KEY.substring(0, 8)}...`);
    
    // Make a simple API call
    const document = {
      content: 'Google Cloud Platform is a great service for building scalable applications.',
      type: 'PLAIN_TEXT',
    };
    
    const [result] = await client.analyzeSentiment({ document });
    console.log(`✅ Natural Language API working with universal key`);
    console.log(`  Document sentiment score: ${result.documentSentiment?.score}`);
  } catch (error) {
    console.error(`❌ Natural Language API failed with universal key`);
    console.error(`Error: ${error.message}`);
  }
}

// Test Vision API
async function testVisionAPI() {
  console.log('\n==== Testing Vision API ====');
  
  try {
    const client = new ImageAnnotatorClient({ key: VISION_API_KEY });
    console.log(`Testing Vision API with key: ${VISION_API_KEY.substring(0, 8)}...`);
    
    // Make a simple API call
    const fileUri = 'https://cloud.google.com/vision/docs/images/bicycle_example.png';
    const [result] = await client.labelDetection(fileUri);
    console.log(`✅ Vision API working with key: ${VISION_API_KEY.substring(0, 8)}...`);
    if (result.labelAnnotations && result.labelAnnotations.length > 0) {
      console.log(`  Detected: ${result.labelAnnotations[0].description}`);
    }
  } catch (error) {
    console.error(`❌ Vision API failed with key: ${VISION_API_KEY.substring(0, 8)}...`);
    console.error(`Error: ${error.message}`);
  }
  
  // Try with universal key
  try {
    const client = new ImageAnnotatorClient({ key: UNIVERSAL_API_KEY });
    console.log(`Testing Vision API with universal key: ${UNIVERSAL_API_KEY.substring(0, 8)}...`);
    
    // Make a simple API call
    const fileUri = 'https://cloud.google.com/vision/docs/images/bicycle_example.png';
    const [result] = await client.labelDetection(fileUri);
    console.log(`✅ Vision API working with universal key`);
    if (result.labelAnnotations && result.labelAnnotations.length > 0) {
      console.log(`  Detected: ${result.labelAnnotations[0].description}`);
    }
  } catch (error) {
    console.error(`❌ Vision API failed with universal key`);
    console.error(`Error: ${error.message}`);
  }
}

// Test Gemini API
async function testGeminiAPI() {
  console.log('\n==== Testing Gemini API ====');
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log(`Testing Gemini API with key: ${GEMINI_API_KEY.substring(0, 8)}...`);
    
    // Make a simple API call
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("What is the capital of France?");
    console.log(`✅ Gemini API working with key: ${GEMINI_API_KEY.substring(0, 8)}...`);
  } catch (error) {
    console.error(`❌ Gemini API failed with key: ${GEMINI_API_KEY.substring(0, 8)}...`);
    console.error(`Error: ${error.message}`);
  }
  
  // Try with universal key
  try {
    const genAI = new GoogleGenerativeAI(UNIVERSAL_API_KEY);
    console.log(`Testing Gemini API with universal key: ${UNIVERSAL_API_KEY.substring(0, 8)}...`);
    
    // Make a simple API call
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("What is the capital of France?");
    console.log(`✅ Gemini API working with universal key`);
  } catch (error) {
    console.error(`❌ Gemini API failed with universal key`);
    console.error(`Error: ${error.message}`);
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 Starting Google API Service Tests 🧪');
  
  await testTextToSpeech().catch(console.error);
  await testTranslationAPI().catch(console.error);
  await testNaturalLanguageAPI().catch(console.error);
  await testVisionAPI().catch(console.error);
  await testGeminiAPI().catch(console.error);
  
  console.log('\n🏁 All tests completed 🏁');
}

// Run the tests
runTests().catch(console.error);