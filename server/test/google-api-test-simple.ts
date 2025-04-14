/**
 * Simple test script for Google API keys
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Universal API key
const UNIVERSAL_API_KEY = 'AIzaSyDnmNNHrQ-xpnOozOZgVv4F9qQpiU-GfdA';

// Group API keys
const GROUP1_API_KEY = 'AIzaSyBUYoJ-RndERrcY9qkjD-2YGGY5m3Mzc0U'; // Maps
const GROUP2_API_KEY = 'AIzaSyByRQcsHT0AXxLsyPK2RrBZEwhe3T11q08'; // AI services
const GROUP3_API_KEY = 'AIzaSyBGWmVEy2zp6fpqaBkDOpV-Qj_FP6QkZj0'; // Firebase

// Gemini service account key
const GEMINI_API_KEY = 'cd3774b60591bf7032e7d8bbf7b537eca29c4891';

// Test Gemini API with all keys
async function testGeminiAPI() {
  console.log('\n==== Testing Gemini API ====');
  
  const keys = [
    UNIVERSAL_API_KEY,
    GROUP1_API_KEY,
    GROUP2_API_KEY,
    GROUP3_API_KEY,
    GEMINI_API_KEY
  ];
  
  for (const key of keys) {
    try {
      const genAI = new GoogleGenerativeAI(key);
      console.log(`Testing Gemini API with key: ${key.substring(0, 8)}...`);
      
      // Make a simple API call
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("What is the capital of France?");
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ Gemini API working with key: ${key.substring(0, 8)}...`);
      console.log(`  Response: ${text.substring(0, 30)}...`);
    } catch (error) {
      console.error(`❌ Gemini API failed with key: ${key.substring(0, 8)}...`);
      console.error(`Error: ${error.message}`);
    }
  }
}

// Run the test
async function runTest() {
  console.log('🧪 Starting Google Gemini API Test 🧪');
  await testGeminiAPI();
  console.log('\n🏁 Test completed 🏁');
}

runTest().catch(console.error);