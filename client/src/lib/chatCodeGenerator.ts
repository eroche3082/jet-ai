import QRCode from 'qrcode';

export async function generateUserCode(userData: {
  name: string;
  email: string;
  preferences: Record<string, any>;
}): Promise<string> {
  // Generate a unique code based on user preferences
  const platform = 'TRAVEL';
  
  // Determine user category based on preferences
  let level = 'BEG'; // Default category: Beginner
  
  if (userData.preferences.travelTypes) {
    if (userData.preferences.travelTypes.includes('Luxury Travel')) {
      level = 'VIP';
    } else if (userData.preferences.travelTypes.includes('Adventure Travel')) {
      level = 'ADV';  // Advanced
    } else if (userData.preferences.travelTypes.includes('Business Travel')) {
      level = 'BIZ';  // Business
    } else if (userData.preferences.travelTypes.includes('Family Travel')) {
      level = 'FAM';  // Family
    } else if (userData.preferences.travelTypes.includes('Backpacking')) {
      level = 'EXP';  // Explorer
    }
  }
  
  // Determine language code if language preference exists
  let languageCode = '';
  if (userData.preferences.languages && userData.preferences.languages.length > 0) {
    const languageMap: Record<string, string> = {
      'Spanish': '-ES',
      'French': '-FR',
      'German': '-DE',
      'Italian': '-IT',
      'Japanese': '-JP',
      'Chinese': '-CN',
      'Portuguese': '-PT',
      'Russian': '-RU',
      'Arabic': '-AR',
      'Korean': '-KR'
    };
    
    // Get the first language preference
    const firstLanguage = userData.preferences.languages[0];
    languageCode = languageMap[firstLanguage] || '';
  }
  
  // Generate a random 4-digit number
  const random = Math.floor(1000 + Math.random() * 9000);
  
  return `${platform}-${level}${languageCode}-${random}`;
}

export async function processWithAI(userData: {
  name: string;
  email: string;
  preferences: Record<string, any>;
}): Promise<{
  code: string;
  category: string;
  summary: string;
}> {
  try {
    // Call the API endpoint to analyze preferences
    const response = await fetch('/api/analyze-preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze preferences');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error processing with AI:', error);
    
    // Fallback to local processing
    const code = await generateUserCode(userData);
    let category = 'Standard Traveler';
    
    // Map code category to readable format
    if (code.includes('TRAVEL-VIP')) {
      category = 'Luxury Traveler';
    } else if (code.includes('TRAVEL-ADV')) {
      category = 'Adventure Seeker';
    } else if (code.includes('TRAVEL-BIZ')) {
      category = 'Business Traveler';
    } else if (code.includes('TRAVEL-FAM')) {
      category = 'Family Explorer';
    } else if (code.includes('TRAVEL-EXP')) {
      category = 'Seasoned Explorer';
    } else if (code.includes('TRAVEL-BEG')) {
      category = 'Travel Beginner';
    }
    
    // Check for language specialization
    let languageSpecialty = '';
    const languageMatches = code.match(/TRAVEL-[A-Z]+-([A-Z]{2})-/);
    if (languageMatches && languageMatches[1]) {
      const languageCode = languageMatches[1];
      const languageMap: Record<string, string> = {
        'ES': 'Spanish',
        'FR': 'French',
        'DE': 'German',
        'IT': 'Italian',
        'JP': 'Japanese',
        'CN': 'Chinese',
        'PT': 'Portuguese',
        'RU': 'Russian',
        'AR': 'Arabic',
        'KR': 'Korean'
      };
      
      if (languageCode in languageMap) {
        languageSpecialty = ` with ${languageMap[languageCode]} proficiency`;
      }
    }
    
    return {
      code,
      category: languageSpecialty ? `${category}${languageSpecialty}` : category,
      summary: `We've created a profile based on your preferences. As a ${category}${languageSpecialty}, you'll receive tailored recommendations for your travel style.${languageSpecialty ? ` We've also noted your interest in ${languageSpecialty.replace(' with ', '').replace(' proficiency', '')} language learning and will customize your experience accordingly.` : ''} You can now explore personalized travel recommendations and use our AI assistant for planning your trips.`,
    };
  }
}

export async function generateQRCode(code: string): Promise<string | null> {
  try {
    // Generate a QR code as a data URL
    return await QRCode.toDataURL(code, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 200,
      color: {
        dark: '#4a89dc',
        light: '#ffffff',
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
}