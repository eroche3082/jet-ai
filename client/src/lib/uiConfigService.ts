import { doc, getDoc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { firestore } from './firebase';

// Path to UI configuration in Firestore
const CONFIG_PATH = 'config/jetai';

// UI Configuration interface matching the required Firestore schema
export interface UIConfig {
  primary_color: string;
  font_family: string;
  layout: 'dark' | 'light';
  button_shape: 'pill' | 'rounded' | 'square';
  homepage_title: string;
  homepage_subtitle: string;
  cta_text: string;
  header_menu: string[];
  visible_sections: {
    chat: boolean;
    features: boolean;
    pricing: boolean;
    itineraries: boolean;
  };
  last_edit?: {
    user_id: string;
    timestamp: any;
  };
}

// Default configuration values
export const DEFAULT_UI_CONFIG: UIConfig = {
  primary_color: '#001f3f',
  font_family: 'Poppins',
  layout: 'dark',
  button_shape: 'pill',
  homepage_title: 'Welcome to JET AI',
  homepage_subtitle: 'Your luxury travel concierge',
  cta_text: 'Plan My Journey',
  header_menu: ['Home', 'Features', 'Pricing', 'Assistant'],
  visible_sections: {
    chat: true,
    features: true,
    pricing: true,
    itineraries: true
  }
};

/**
 * Get the current UI configuration from Firestore
 */
export async function getUIConfig(): Promise<UIConfig> {
  try {
    const configRef = doc(firestore, CONFIG_PATH);
    const configSnap = await getDoc(configRef);
    
    if (configSnap.exists()) {
      return configSnap.data() as UIConfig;
    } else {
      // If no configuration exists, create one with default values
      await setDoc(configRef, DEFAULT_UI_CONFIG);
      return DEFAULT_UI_CONFIG;
    }
  } catch (error) {
    console.error('Error getting UI configuration:', error);
    return DEFAULT_UI_CONFIG;
  }
}

/**
 * Update the UI configuration in Firestore
 * @param config New configuration values
 * @param userId ID of the user making the change
 */
export async function updateUIConfig(config: Partial<UIConfig>, userId: string): Promise<boolean> {
  try {
    const configRef = doc(firestore, CONFIG_PATH);
    const currentConfig = await getUIConfig();
    
    // Update with new values
    await setDoc(configRef, {
      ...currentConfig,
      ...config,
      last_edit: {
        user_id: userId,
        timestamp: new Date()
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error updating UI configuration:', error);
    return false;
  }
}

/**
 * Subscribe to UI configuration changes
 * @param callback Function to call when configuration changes
 */
export function subscribeToUIConfig(callback: (config: UIConfig) => void): Unsubscribe {
  const configRef = doc(firestore, CONFIG_PATH);
  
  return onSnapshot(configRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as UIConfig);
    } else {
      callback(DEFAULT_UI_CONFIG);
    }
  }, (error) => {
    console.error('Error subscribing to UI configuration:', error);
  });
}

/**
 * Log editor activity
 * @param userId ID of user making the edit
 * @param action Description of the action performed
 * @param details Additional details about the edit
 */
export async function logEditorActivity(userId: string, action: string, details?: any): Promise<void> {
  try {
    const activityRef = doc(firestore, 'editorLogs', `${Date.now()}-${userId}`);
    await setDoc(activityRef, {
      userId,
      action,
      details,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error logging editor activity:', error);
  }
}