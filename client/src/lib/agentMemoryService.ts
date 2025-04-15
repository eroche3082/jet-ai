import { doc, getDoc, setDoc, collection, addDoc, Timestamp, updateDoc, query, orderBy, limit, getDocs, arrayUnion, DocumentData } from 'firebase/firestore';
import { firestore } from './firebase';

// Path to Agent Memory in Firestore
const MEMORY_PATH = 'agent-memory/jetai';
const MEMORY_LOGS_PATH = 'agent-memory/logs';

/**
 * Agent Memory structure based on the required schema
 */
export interface AgentMemory {
  agent_name: string;
  role: string;
  version: string;
  deployment_status: 'pre-deploy' | 'deployed' | 'maintenance';
  design: {
    theme: 'dark' | 'light';
    primary_color: string;
    font: string;
    button_style: 'pill' | 'rounded' | 'square';
  };
  homepage: {
    sections: string[];
    cta_text: string;
  };
  superadmin_enabled: boolean;
  editor_enabled: boolean;
  connected_apis: string[];
  onboarding_flow: 'enabled' | 'disabled';
  memory_logs: {
    [date: string]: string[];
  };
  important_prompts: string[];
  last_updated: any; // Timestamp
}

/**
 * Default agent memory
 */
export const DEFAULT_AGENT_MEMORY: AgentMemory = {
  agent_name: "JET AI",
  role: "Luxury AI travel concierge",
  version: "v1.0",
  deployment_status: "pre-deploy",
  design: {
    theme: "dark",
    primary_color: "#001f3f",
    font: "Poppins",
    button_style: "pill"
  },
  homepage: {
    sections: ["Hero", "Features", "Pricing", "AI Assistant"],
    cta_text: "Plan My Journey"
  },
  superadmin_enabled: true,
  editor_enabled: true,
  connected_apis: ["Gemini", "Google Maps", "Stripe", "Firestore"],
  onboarding_flow: "enabled",
  memory_logs: {
    "2025-04-14": [
      "JET AI visual editor created at /editor",
      "SuperAdmin QR and face scan access enabled",
      "Avatar configuration implemented with LiveSmart",
      "UI sections verified and cleaned for Firebase deployment"
    ]
  },
  important_prompts: [
    "PHASE 1 – Firebase Deployment Setup",
    "PHASE 2 – Live Visual Editing System",
    "PHASE 4 – Memory Migration Activated"
  ],
  last_updated: Timestamp.now()
};

/**
 * Memory log structure
 */
export interface MemoryLog {
  id: string;
  action: string;
  details?: any;
  userId: string;
  timestamp: any; // Timestamp
}

/**
 * Get the current agent memory from Firestore
 */
export async function getAgentMemory(): Promise<AgentMemory> {
  try {
    const memoryRef = doc(firestore, MEMORY_PATH);
    const memorySnap = await getDoc(memoryRef);
    
    if (memorySnap.exists()) {
      return memorySnap.data() as AgentMemory;
    } else {
      // If no memory exists, create one with default values
      await setDoc(memoryRef, DEFAULT_AGENT_MEMORY);
      return DEFAULT_AGENT_MEMORY;
    }
  } catch (error) {
    console.error('Error getting agent memory:', error);
    return DEFAULT_AGENT_MEMORY;
  }
}

/**
 * Update the agent memory in Firestore
 * @param memory Updated memory values
 * @param userId ID of the user making the change
 */
export async function updateAgentMemory(memory: Partial<AgentMemory>, userId: string): Promise<boolean> {
  try {
    const memoryRef = doc(firestore, MEMORY_PATH);
    const currentMemory = await getAgentMemory();
    
    // Create update object with new timestamp
    const updateData = {
      ...memory,
      last_updated: Timestamp.now()
    };
    
    // Update memory document
    await updateDoc(memoryRef, updateData);
    
    // Log this update
    await logMemoryActivity(userId, 'update_agent_memory', { 
      fields_updated: Object.keys(memory) 
    });
    
    return true;
  } catch (error) {
    console.error('Error updating agent memory:', error);
    return false;
  }
}

/**
 * Add a log entry to today's memory logs
 * @param log Log message to add
 * @param userId ID of the user making the change
 */
export async function addMemoryLog(log: string, userId: string): Promise<boolean> {
  try {
    const memoryRef = doc(firestore, MEMORY_PATH);
    const currentMemory = await getAgentMemory();
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Create or update today's logs
    const memoryLogs = { ...currentMemory.memory_logs };
    if (!memoryLogs[today]) {
      memoryLogs[today] = [];
    }
    memoryLogs[today].push(log);
    
    // Update memory with new log
    await updateDoc(memoryRef, { 
      memory_logs: memoryLogs,
      last_updated: Timestamp.now()
    });
    
    // Log this activity
    await logMemoryActivity(userId, 'add_memory_log', { log });
    
    return true;
  } catch (error) {
    console.error('Error adding memory log:', error);
    return false;
  }
}

/**
 * Get important prompts from agent memory
 */
export async function getImportantPrompts(): Promise<string[]> {
  try {
    const memory = await getAgentMemory();
    return memory.important_prompts || [];
  } catch (error) {
    console.error('Error getting important prompts:', error);
    return [];
  }
}

/**
 * Add an important prompt to agent memory
 * @param prompt Prompt to add
 * @param userId ID of the user making the change
 */
export async function addImportantPrompt(prompt: string, userId: string): Promise<boolean> {
  try {
    const memoryRef = doc(firestore, MEMORY_PATH);
    
    // Add prompt to the array
    await updateDoc(memoryRef, {
      important_prompts: arrayUnion(prompt),
      last_updated: Timestamp.now()
    });
    
    // Log this activity
    await logMemoryActivity(userId, 'add_important_prompt', { prompt });
    
    return true;
  } catch (error) {
    console.error('Error adding important prompt:', error);
    return false;
  }
}

/**
 * Log memory activity to a separate collection
 * @param userId ID of user making the action
 * @param action Description of the action
 * @param details Additional details
 */
export async function logMemoryActivity(userId: string, action: string, details?: any): Promise<void> {
  try {
    const logsCollection = collection(firestore, MEMORY_LOGS_PATH);
    await addDoc(logsCollection, {
      userId,
      action,
      details,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error('Error logging memory activity:', error);
  }
}

/**
 * Get recent memory logs
 * @param count Number of logs to retrieve
 */
export async function getRecentMemoryLogs(count: number = 50): Promise<MemoryLog[]> {
  try {
    const logsCollection = collection(firestore, MEMORY_LOGS_PATH);
    const q = query(logsCollection, orderBy('timestamp', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    
    const logs: MemoryLog[] = [];
    querySnapshot.forEach(doc => {
      logs.push({
        id: doc.id,
        ...doc.data()
      } as MemoryLog);
    });
    
    return logs;
  } catch (error) {
    console.error('Error getting memory logs:', error);
    return [];
  }
}

/**
 * Export agent memory as JSON
 */
export async function exportAgentMemory(): Promise<string> {
  try {
    const memory = await getAgentMemory();
    return JSON.stringify(memory, null, 2);
  } catch (error) {
    console.error('Error exporting agent memory:', error);
    return JSON.stringify(DEFAULT_AGENT_MEMORY, null, 2);
  }
}

/**
 * Create memory backup in Firestore
 * @param userId ID of the user creating the backup
 */
export async function createMemoryBackup(userId: string): Promise<string | null> {
  try {
    const memory = await getAgentMemory();
    const backupsCollection = collection(firestore, 'agent-memory-backups');
    
    const backup = {
      ...memory,
      backup_created: Timestamp.now(),
      backup_by: userId
    };
    
    const docRef = await addDoc(backupsCollection, backup);
    
    // Log this activity
    await logMemoryActivity(userId, 'create_memory_backup', { backupId: docRef.id });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating memory backup:', error);
    return null;
  }
}

/**
 * Initialize agent memory if it doesn't exist
 */
export async function initializeAgentMemory(): Promise<void> {
  try {
    const memoryRef = doc(firestore, MEMORY_PATH);
    const memorySnap = await getDoc(memoryRef);
    
    if (!memorySnap.exists()) {
      await setDoc(memoryRef, DEFAULT_AGENT_MEMORY);
      console.log('Agent memory initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing agent memory:', error);
  }
}

// Call initialization on module import
initializeAgentMemory();

// Export all functions
export default {
  getAgentMemory,
  updateAgentMemory,
  addMemoryLog,
  getImportantPrompts,
  addImportantPrompt,
  logMemoryActivity,
  getRecentMemoryLogs,
  exportAgentMemory,
  createMemoryBackup
};