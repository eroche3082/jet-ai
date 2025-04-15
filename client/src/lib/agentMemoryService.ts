/**
 * JET AI Agent Memory Service
 * Handles persistent memory storage and retrieval for AI agent interactions
 */

import { db, firebaseApp } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, where, Timestamp, DocumentData } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export interface MemoryEntry {
  timestamp: Date;
  module: string;
  action: string;
  details: string;
  userId?: string;
  metadata?: any;
}

export interface MemoryQuery {
  limit?: number;
  module?: string;
  action?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

// Initialize agent memory collection
const MEMORY_COLLECTION = 'agent_memory';

/**
 * Records a new memory entry in the agent memory system
 */
export async function recordMemory(entry: Omit<MemoryEntry, 'timestamp'>): Promise<string | null> {
  try {
    if (!db) {
      console.error('Firebase not initialized');
      return null;
    }

    // Add current user ID if available and not already specified
    if (!entry.userId) {
      const auth = getAuth(firebaseApp);
      const currentUser = auth.currentUser;
      if (currentUser) {
        entry.userId = currentUser.uid;
      }
    }

    const memoryRef = collection(db, MEMORY_COLLECTION);
    
    const docRef = await addDoc(memoryRef, {
      ...entry,
      timestamp: Timestamp.now(),
    });
    
    console.log(`Memory recorded with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error recording memory:', error);
    return null;
  }
}

/**
 * Retrieves memory entries based on query parameters
 */
export async function queryMemory(params: MemoryQuery = {}): Promise<MemoryEntry[]> {
  try {
    if (!db) {
      console.error('Firebase not initialized');
      return [];
    }
    
    const memoryRef = collection(db, MEMORY_COLLECTION);
    let queryConstraints = [] as any[];
    
    // Add query constraints based on parameters
    if (params.module) {
      queryConstraints.push(where('module', '==', params.module));
    }
    
    if (params.action) {
      queryConstraints.push(where('action', '==', params.action));
    }
    
    if (params.userId) {
      queryConstraints.push(where('userId', '==', params.userId));
    }
    
    if (params.startDate) {
      queryConstraints.push(where('timestamp', '>=', Timestamp.fromDate(params.startDate)));
    }
    
    if (params.endDate) {
      queryConstraints.push(where('timestamp', '<=', Timestamp.fromDate(params.endDate)));
    }
    
    // Always order by timestamp descending (newest first)
    queryConstraints.push(orderBy('timestamp', 'desc'));
    
    // Apply limit if specified (default to 100)
    const resultLimit = params.limit || 100;
    queryConstraints.push(limit(resultLimit));
    
    const q = query(memoryRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    // Process results
    const memories: MemoryEntry[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      memories.push({
        ...data,
        timestamp: data.timestamp.toDate(),
      } as MemoryEntry);
    });
    
    return memories;
  } catch (error) {
    console.error('Error querying memory:', error);
    return [];
  }
}

/**
 * Get recent memory entries for a specific module or all modules
 */
export async function getRecentMemories(module?: string, limit = 10): Promise<MemoryEntry[]> {
  const query: MemoryQuery = { limit };
  if (module) {
    query.module = module;
  }
  return queryMemory(query);
}

/**
 * Get system configuration changes memory
 */
export async function getConfigurationChanges(limit = 20): Promise<MemoryEntry[]> {
  return queryMemory({
    module: 'system',
    action: 'config_change',
    limit
  });
}

/**
 * Get user interaction memories
 */
export async function getUserInteractions(userId: string, limit = 50): Promise<MemoryEntry[]> {
  return queryMemory({
    userId,
    limit
  });
}

/**
 * Clear memory older than specified date
 * Note: This is a placeholder for a function that would typically run
 * in a backend service with proper authentication
 */
export async function clearOldMemories(olderThan: Date): Promise<boolean> {
  console.log(`Memory clearing for entries older than ${olderThan} would run on the server side`);
  return true;
}

/**
 * Directly log to memory without waiting for the operation to complete
 * Useful for non-critical logs that shouldn't block execution
 */
export function logToMemory(module: string, action: string, details: string, metadata?: any): void {
  recordMemory({
    module,
    action,
    details,
    metadata
  }).catch(err => {
    console.error('Failed to log to memory:', err);
  });
}

/**
 * Initialize memory system for new user
 */
export async function initializeUserMemory(userId: string, userDetails: any): Promise<boolean> {
  try {
    await recordMemory({
      module: 'user',
      action: 'initialize',
      details: `Initialized memory system for user ${userId}`,
      userId,
      metadata: {
        userDetails: {
          ...userDetails,
          // Exclude sensitive data
          password: undefined,
          securityQuestion: undefined
        }
      }
    });
    return true;
  } catch (error) {
    console.error('Error initializing user memory:', error);
    return false;
  }
}