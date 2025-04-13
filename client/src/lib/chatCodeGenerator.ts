import QRCode from 'qrcode';

export async function generateUserCode(userData: {
  name: string;
  email: string;
  preferences: Record<string, any>;
}): Promise<string> {
  // Generate a unique code based on user preferences
  const prefix = 'JET';
  
  // Determine user category based on preferences
  let category = 'STD'; // Default category
  
  if (userData.preferences.travelTypes) {
    if (userData.preferences.travelTypes.includes('Luxury Travel')) {
      category = 'VIP';
    } else if (userData.preferences.travelTypes.includes('Adventure Travel')) {
      category = 'ADV';
    } else if (userData.preferences.travelTypes.includes('Business Travel')) {
      category = 'BIZ';
    } else if (userData.preferences.travelTypes.includes('Family Travel')) {
      category = 'FAM';
    }
  }
  
  // Generate a random 4-digit number
  const random = Math.floor(1000 + Math.random() * 9000);
  
  return `${prefix}-${category}-${random}`;
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
    if (code.includes('-VIP-')) {
      category = 'Luxury Traveler';
    } else if (code.includes('-ADV-')) {
      category = 'Adventure Seeker';
    } else if (code.includes('-BIZ-')) {
      category = 'Business Traveler';
    } else if (code.includes('-FAM-')) {
      category = 'Family Explorer';
    }
    
    return {
      code,
      category,
      summary: `We've created a profile based on your preferences. As a ${category}, you'll receive tailored recommendations for your travel style. You can now explore personalized travel recommendations and use our AI assistant for planning your trips.`,
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