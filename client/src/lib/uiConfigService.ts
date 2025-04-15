/**
 * JET AI UI Configuration Service
 * Manages UI configurations stored in Firebase for the Live Visual Editor
 */

import { db, firebaseApp } from './firebase';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, 
         onSnapshot, Timestamp, DocumentData, DocumentReference } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { logToMemory } from './agentMemoryService';

// Define types for UI Configuration
export interface UIComponent {
  id: string;
  name: string;
  type: string;
  content?: string;
  style?: Record<string, string>;
  children?: UIComponent[];
  props?: Record<string, any>;
  parentId?: string;
  order?: number;
  metadata?: Record<string, any>;
  lastModified?: Date;
  lastModifiedBy?: string;
}

export interface UILayout {
  id: string;
  name: string;
  components: UIComponent[];
  version: number;
  created: Date;
  lastModified: Date;
  createdBy: string;
  lastModifiedBy: string;
  isActive: boolean;
  description?: string;
  tags?: string[];
}

export interface UITheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    success: string;
    warning: string;
    error: string;
    [key: string]: string;
  };
  typography: {
    fontFamily: string;
    headings: {
      fontFamily?: string;
      fontWeight: number;
      lineHeight: number;
    };
    body: {
      fontFamily?: string;
      fontWeight: number;
      lineHeight: number;
    };
  };
  spacing: {
    unit: number;
    scale: number[];
  };
  borderRadius: number;
  shadows: string[];
  transitions: {
    default: string;
  };
  breakpoints: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  version: number;
  created: Date;
  lastModified: Date;
  createdBy: string;
  lastModifiedBy: string;
  isActive: boolean;
}

export interface UIGlobalConfig {
  activeThemeId: string;
  activeLayoutIds: {
    [pagePath: string]: string;
  };
  settings: {
    animationsEnabled: boolean;
    darkMode: boolean;
    defaultLanguage: string;
    editorEnabled: boolean;
    maintenanceMode: boolean;
    [key: string]: any;
  };
  version: number;
  lastModified: Date;
  lastModifiedBy: string;
}

// Collections
const LAYOUTS_COLLECTION = 'ui_layouts';
const THEMES_COLLECTION = 'ui_themes';
const COMPONENTS_COLLECTION = 'ui_components';
const CONFIG_COLLECTION = 'ui_config';
const GLOBAL_CONFIG_DOC = 'global';

// Helper for current user info
const getCurrentUser = () => {
  const auth = getAuth(firebaseApp);
  return auth.currentUser ? {
    id: auth.currentUser.uid,
    email: auth.currentUser.email,
    displayName: auth.currentUser.displayName
  } : null;
};

// Helper for timestamps
const toFirebaseTimestamp = (date: Date = new Date()) => Timestamp.fromDate(date);

// Helper to convert Firestore data to app models
const convertFirestoreData = <T extends object>(data: DocumentData): T => {
  const result: any = { ...data };
  
  // Convert Firestore Timestamps to JavaScript Dates
  for (const key in result) {
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate();
    } else if (result[key] && typeof result[key] === 'object') {
      result[key] = convertFirestoreData(result[key]);
    }
  }
  
  return result as T;
};

/**
 * Get the global UI configuration
 */
export async function getGlobalConfig(): Promise<UIGlobalConfig | null> {
  try {
    if (!db) {
      console.error('Firebase not initialized');
      return null;
    }
    
    const configRef = doc(db, CONFIG_COLLECTION, GLOBAL_CONFIG_DOC);
    const configSnapshot = await getDoc(configRef);
    
    if (!configSnapshot.exists()) {
      console.log('No global config found, creating default');
      return createDefaultGlobalConfig();
    }
    
    return convertFirestoreData<UIGlobalConfig>(configSnapshot.data());
  } catch (error) {
    console.error('Error getting global UI config:', error);
    return null;
  }
}

/**
 * Create default global configuration
 */
async function createDefaultGlobalConfig(): Promise<UIGlobalConfig | null> {
  try {
    if (!db) {
      console.error('Firebase not initialized');
      return null;
    }
    
    const user = getCurrentUser();
    const userId = user?.id || 'system';
    
    const defaultConfig: UIGlobalConfig = {
      activeThemeId: 'default',
      activeLayoutIds: {
        '/': 'default_home',
        '/dashboard': 'default_dashboard'
      },
      settings: {
        animationsEnabled: true,
        darkMode: false,
        defaultLanguage: 'en',
        editorEnabled: true,
        maintenanceMode: false
      },
      version: 1,
      lastModified: new Date(),
      lastModifiedBy: userId
    };
    
    const configRef = doc(db, CONFIG_COLLECTION, GLOBAL_CONFIG_DOC);
    await setDoc(configRef, {
      ...defaultConfig,
      lastModified: toFirebaseTimestamp(defaultConfig.lastModified)
    });
    
    // Log to memory system
    logToMemory('ui_config', 'create_default', 'Created default global UI configuration', {
      userId,
      configId: GLOBAL_CONFIG_DOC
    });
    
    return defaultConfig;
  } catch (error) {
    console.error('Error creating default global config:', error);
    return null;
  }
}

/**
 * Update the global UI configuration
 */
export async function updateGlobalConfig(
  config: Partial<UIGlobalConfig>
): Promise<UIGlobalConfig | null> {
  try {
    if (!db) {
      console.error('Firebase not initialized');
      return null;
    }
    
    const user = getCurrentUser();
    if (!user) {
      console.error('User not authenticated');
      return null;
    }
    
    const configRef = doc(db, CONFIG_COLLECTION, GLOBAL_CONFIG_DOC);
    const configSnapshot = await getDoc(configRef);
    
    let currentConfig: UIGlobalConfig;
    
    if (!configSnapshot.exists()) {
      currentConfig = await createDefaultGlobalConfig() as UIGlobalConfig;
    } else {
      currentConfig = convertFirestoreData<UIGlobalConfig>(configSnapshot.data());
    }
    
    // Update configuration
    const updatedConfig = {
      ...currentConfig,
      ...config,
      version: currentConfig.version + 1,
      lastModified: new Date(),
      lastModifiedBy: user.id
    };
    
    // Convert dates to Firestore timestamps
    await updateDoc(configRef, {
      ...updatedConfig,
      lastModified: toFirebaseTimestamp(updatedConfig.lastModified)
    });
    
    // Log to memory
    logToMemory('ui_config', 'update', `Updated global UI configuration (v${updatedConfig.version})`, {
      userId: user.id,
      configId: GLOBAL_CONFIG_DOC,
      changes: config
    });
    
    return updatedConfig;
  } catch (error) {
    console.error('Error updating global config:', error);
    return null;
  }
}

/**
 * Get a theme by ID
 */
export async function getTheme(themeId: string): Promise<UITheme | null> {
  try {
    if (!db) {
      console.error('Firebase not initialized');
      return null;
    }
    
    const themeRef = doc(db, THEMES_COLLECTION, themeId);
    const themeSnapshot = await getDoc(themeRef);
    
    if (!themeSnapshot.exists()) {
      console.log(`Theme ${themeId} not found`);
      return null;
    }
    
    return convertFirestoreData<UITheme>(themeSnapshot.data());
  } catch (error) {
    console.error(`Error getting theme ${themeId}:`, error);
    return null;
  }
}

/**
 * Get the active theme
 */
export async function getActiveTheme(): Promise<UITheme | null> {
  try {
    const config = await getGlobalConfig();
    if (!config) return null;
    
    return getTheme(config.activeThemeId);
  } catch (error) {
    console.error('Error getting active theme:', error);
    return null;
  }
}

/**
 * Get a layout by ID
 */
export async function getLayout(layoutId: string): Promise<UILayout | null> {
  try {
    if (!db) {
      console.error('Firebase not initialized');
      return null;
    }
    
    const layoutRef = doc(db, LAYOUTS_COLLECTION, layoutId);
    const layoutSnapshot = await getDoc(layoutRef);
    
    if (!layoutSnapshot.exists()) {
      console.log(`Layout ${layoutId} not found`);
      return null;
    }
    
    return convertFirestoreData<UILayout>(layoutSnapshot.data());
  } catch (error) {
    console.error(`Error getting layout ${layoutId}:`, error);
    return null;
  }
}

/**
 * Get the active layout for a specific page path
 */
export async function getActiveLayout(pagePath: string): Promise<UILayout | null> {
  try {
    const config = await getGlobalConfig();
    if (!config) return null;
    
    // Get layout ID for the page, or use default if not specified
    const layoutId = config.activeLayoutIds[pagePath] || config.activeLayoutIds['/'] || 'default_home';
    
    return getLayout(layoutId);
  } catch (error) {
    console.error(`Error getting active layout for path ${pagePath}:`, error);
    return null;
  }
}

/**
 * Create a new theme
 */
export async function createTheme(theme: Omit<UITheme, 'id' | 'created' | 'lastModified' | 'createdBy' | 'lastModifiedBy' | 'version'>): Promise<UITheme | null> {
  try {
    if (!db) {
      console.error('Firebase not initialized');
      return null;
    }
    
    const user = getCurrentUser();
    if (!user) {
      console.error('User not authenticated');
      return null;
    }
    
    // Generate a unique ID if not provided
    const themeId = theme.id || `theme_${Date.now()}`;
    
    const newTheme: UITheme = {
      ...theme,
      id: themeId,
      version: 1,
      created: new Date(),
      lastModified: new Date(),
      createdBy: user.id,
      lastModifiedBy: user.id
    };
    
    const themeRef = doc(db, THEMES_COLLECTION, themeId);
    await setDoc(themeRef, {
      ...newTheme,
      created: toFirebaseTimestamp(newTheme.created),
      lastModified: toFirebaseTimestamp(newTheme.lastModified)
    });
    
    // Log to memory
    logToMemory('ui_theme', 'create', `Created new theme: ${theme.name}`, {
      userId: user.id,
      themeId
    });
    
    return newTheme;
  } catch (error) {
    console.error('Error creating theme:', error);
    return null;
  }
}

/**
 * Update an existing theme
 */
export async function updateTheme(
  themeId: string,
  updates: Partial<UITheme>
): Promise<UITheme | null> {
  try {
    if (!db) {
      console.error('Firebase not initialized');
      return null;
    }
    
    const user = getCurrentUser();
    if (!user) {
      console.error('User not authenticated');
      return null;
    }
    
    const themeRef = doc(db, THEMES_COLLECTION, themeId);
    const themeSnapshot = await getDoc(themeRef);
    
    if (!themeSnapshot.exists()) {
      console.error(`Theme ${themeId} not found`);
      return null;
    }
    
    const currentTheme = convertFirestoreData<UITheme>(themeSnapshot.data());
    
    // Build updated theme object
    const updatedTheme = {
      ...currentTheme,
      ...updates,
      id: themeId, // Ensure ID remains unchanged
      version: currentTheme.version + 1,
      lastModified: new Date(),
      lastModifiedBy: user.id
    };
    
    // Update the document
    await updateDoc(themeRef, {
      ...updatedTheme,
      lastModified: toFirebaseTimestamp(updatedTheme.lastModified)
    });
    
    // Log to memory
    logToMemory('ui_theme', 'update', `Updated theme: ${updatedTheme.name}`, {
      userId: user.id,
      themeId,
      changes: updates
    });
    
    return updatedTheme;
  } catch (error) {
    console.error(`Error updating theme ${themeId}:`, error);
    return null;
  }
}

/**
 * Create a new layout
 */
export async function createLayout(layout: Omit<UILayout, 'id' | 'created' | 'lastModified' | 'createdBy' | 'lastModifiedBy' | 'version'>): Promise<UILayout | null> {
  try {
    if (!db) {
      console.error('Firebase not initialized');
      return null;
    }
    
    const user = getCurrentUser();
    if (!user) {
      console.error('User not authenticated');
      return null;
    }
    
    // Generate a unique ID if not provided
    const layoutId = layout.id || `layout_${Date.now()}`;
    
    const newLayout: UILayout = {
      ...layout,
      id: layoutId,
      version: 1,
      created: new Date(),
      lastModified: new Date(),
      createdBy: user.id,
      lastModifiedBy: user.id
    };
    
    const layoutRef = doc(db, LAYOUTS_COLLECTION, layoutId);
    await setDoc(layoutRef, {
      ...newLayout,
      created: toFirebaseTimestamp(newLayout.created),
      lastModified: toFirebaseTimestamp(newLayout.lastModified)
    });
    
    // Log to memory
    logToMemory('ui_layout', 'create', `Created new layout: ${layout.name}`, {
      userId: user.id,
      layoutId
    });
    
    return newLayout;
  } catch (error) {
    console.error('Error creating layout:', error);
    return null;
  }
}

/**
 * Update an existing layout
 */
export async function updateLayout(
  layoutId: string,
  updates: Partial<UILayout>
): Promise<UILayout | null> {
  try {
    if (!db) {
      console.error('Firebase not initialized');
      return null;
    }
    
    const user = getCurrentUser();
    if (!user) {
      console.error('User not authenticated');
      return null;
    }
    
    const layoutRef = doc(db, LAYOUTS_COLLECTION, layoutId);
    const layoutSnapshot = await getDoc(layoutRef);
    
    if (!layoutSnapshot.exists()) {
      console.error(`Layout ${layoutId} not found`);
      return null;
    }
    
    const currentLayout = convertFirestoreData<UILayout>(layoutSnapshot.data());
    
    // Build updated layout object
    const updatedLayout = {
      ...currentLayout,
      ...updates,
      id: layoutId, // Ensure ID remains unchanged
      version: currentLayout.version + 1,
      lastModified: new Date(),
      lastModifiedBy: user.id
    };
    
    // Update the document
    await updateDoc(layoutRef, {
      ...updatedLayout,
      lastModified: toFirebaseTimestamp(updatedLayout.lastModified)
    });
    
    // Log to memory
    logToMemory('ui_layout', 'update', `Updated layout: ${updatedLayout.name}`, {
      userId: user.id,
      layoutId,
      changes: updates
    });
    
    return updatedLayout;
  } catch (error) {
    console.error(`Error updating layout ${layoutId}:`, error);
    return null;
  }
}

/**
 * Set the active theme
 */
export async function setActiveTheme(themeId: string): Promise<boolean> {
  try {
    const updatedConfig = await updateGlobalConfig({
      activeThemeId: themeId
    });
    
    return updatedConfig !== null;
  } catch (error) {
    console.error(`Error setting active theme to ${themeId}:`, error);
    return false;
  }
}

/**
 * Set the active layout for a specific page path
 */
export async function setActiveLayout(pagePath: string, layoutId: string): Promise<boolean> {
  try {
    const config = await getGlobalConfig();
    if (!config) return false;
    
    const updatedConfig = await updateGlobalConfig({
      activeLayoutIds: {
        ...config.activeLayoutIds,
        [pagePath]: layoutId
      }
    });
    
    return updatedConfig !== null;
  } catch (error) {
    console.error(`Error setting active layout for ${pagePath} to ${layoutId}:`, error);
    return false;
  }
}

/**
 * Subscribe to changes in the global configuration
 */
export function subscribeToGlobalConfig(callback: (config: UIGlobalConfig) => void): () => void {
  if (!db) {
    console.error('Firebase not initialized');
    return () => {};
  }
  
  const configRef = doc(db, CONFIG_COLLECTION, GLOBAL_CONFIG_DOC);
  
  const unsubscribe = onSnapshot(configRef, (snapshot) => {
    if (snapshot.exists()) {
      const config = convertFirestoreData<UIGlobalConfig>(snapshot.data());
      callback(config);
    }
  }, (error) => {
    console.error('Error subscribing to global config:', error);
  });
  
  return unsubscribe;
}

/**
 * Subscribe to changes in a theme
 */
export function subscribeToTheme(themeId: string, callback: (theme: UITheme | null) => void): () => void {
  if (!db) {
    console.error('Firebase not initialized');
    return () => {};
  }
  
  const themeRef = doc(db, THEMES_COLLECTION, themeId);
  
  const unsubscribe = onSnapshot(themeRef, (snapshot) => {
    if (snapshot.exists()) {
      const theme = convertFirestoreData<UITheme>(snapshot.data());
      callback(theme);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error(`Error subscribing to theme ${themeId}:`, error);
  });
  
  return unsubscribe;
}

/**
 * Subscribe to changes in a layout
 */
export function subscribeToLayout(layoutId: string, callback: (layout: UILayout | null) => void): () => void {
  if (!db) {
    console.error('Firebase not initialized');
    return () => {};
  }
  
  const layoutRef = doc(db, LAYOUTS_COLLECTION, layoutId);
  
  const unsubscribe = onSnapshot(layoutRef, (snapshot) => {
    if (snapshot.exists()) {
      const layout = convertFirestoreData<UILayout>(snapshot.data());
      callback(layout);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error(`Error subscribing to layout ${layoutId}:`, error);
  });
  
  return unsubscribe;
}