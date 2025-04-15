/**
 * JET AI - Agent Memory Service
 * 
 * This service manages the historical memory of the AI agent,
 * storing and retrieving user interactions and system configurations
 * to provide context for future interactions.
 */

import { collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit, where, deleteDoc, Timestamp, DocumentData } from 'firebase/firestore';
import { db } from './firebase';

export interface MemoryEntry {
  id?: string;
  timestamp: Timestamp | Date;
  type: 'interaction' | 'configuration' | 'system' | 'error';
  category: string;
  content: any;
  userId?: string;
  metadata?: Record<string, any>;
}

const MEMORY_COLLECTION = 'agent_memory';
const MEMORY_LIMIT = 1000; // Maximum number of memories to keep per user

/**
 * Initialize memory system
 */
export async function initMemorySystem() {
  try {
    console.log('Initializing agent memory system...');
    // Create a test memory to verify connection
    await createMemory({
      timestamp: new Date(),
      type: 'system',
      category: 'initialization',
      content: 'Memory system initialized successfully',
    });
    console.log('Agent memory system initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing agent memory:', error);
    return false;
  }
}

/**
 * Create a new memory entry
 */
export async function createMemory(memory: MemoryEntry): Promise<string | null> {
  try {
    if (!db) {
      console.warn('Firebase not initialized - memory creation skipped');
      return null;
    }
    
    const memoryCollection = collection(db, MEMORY_COLLECTION);
    const newMemoryDoc = doc(memoryCollection);
    
    const memoryWithTimestamp = {
      ...memory,
      timestamp: memory.timestamp instanceof Date ? Timestamp.fromDate(memory.timestamp) : memory.timestamp,
      id: newMemoryDoc.id
    };
    
    await setDoc(newMemoryDoc, memoryWithTimestamp);
    return newMemoryDoc.id;
  } catch (error) {
    console.error('Error creating memory:', error);
    return null;
  }
}

/**
 * Get a memory by ID
 */
export async function getMemoryById(memoryId: string): Promise<MemoryEntry | null> {
  try {
    if (!db) {
      console.warn('Firebase not initialized - memory retrieval skipped');
      return null;
    }
    
    const memoryDoc = doc(db, MEMORY_COLLECTION, memoryId);
    const memorySnapshot = await getDoc(memoryDoc);
    
    if (memorySnapshot.exists()) {
      const data = memorySnapshot.data() as MemoryEntry;
      return {
        ...data,
        id: memorySnapshot.id
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting memory by ID:', error);
    return null;
  }
}

/**
 * Get memories filtered by type and/or user
 */
export async function getMemories(
  options: {
    userId?: string;
    type?: 'interaction' | 'configuration' | 'system' | 'error';
    category?: string;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
  } = {}
): Promise<MemoryEntry[]> {
  try {
    if (!db) {
      console.warn('Firebase not initialized - memory retrieval skipped');
      return [];
    }
    
    const { userId, type, category, limit: memoryLimit = 50, startDate, endDate } = options;
    
    let memoryQuery = collection(db, MEMORY_COLLECTION);
    let constraints = [];
    
    if (userId) {
      constraints.push(where('userId', '==', userId));
    }
    
    if (type) {
      constraints.push(where('type', '==', type));
    }
    
    if (category) {
      constraints.push(where('category', '==', category));
    }
    
    if (startDate) {
      constraints.push(where('timestamp', '>=', Timestamp.fromDate(startDate)));
    }
    
    if (endDate) {
      constraints.push(where('timestamp', '<=', Timestamp.fromDate(endDate)));
    }
    
    const finalQuery = query(
      memoryCollection,
      ...constraints,
      orderBy('timestamp', 'desc'),
      limit(memoryLimit)
    );
    
    const memorySnapshots = await getDocs(finalQuery);
    
    return memorySnapshots.docs.map(doc => {
      const data = doc.data() as Omit<MemoryEntry, 'id'>;
      return {
        ...data,
        id: doc.id
      };
    });
  } catch (error) {
    console.error('Error getting memories:', error);
    return [];
  }
}

/**
 * Delete a memory by ID
 */
export async function deleteMemory(memoryId: string): Promise<boolean> {
  try {
    if (!db) {
      console.warn('Firebase not initialized - memory deletion skipped');
      return false;
    }
    
    const memoryDoc = doc(db, MEMORY_COLLECTION, memoryId);
    await deleteDoc(memoryDoc);
    return true;
  } catch (error) {
    console.error('Error deleting memory:', error);
    return false;
  }
}

/**
 * Clean up old memories to maintain system performance
 */
export async function cleanupOldMemories(userId?: string): Promise<number> {
  try {
    if (!db) {
      console.warn('Firebase not initialized - memory cleanup skipped');
      return 0;
    }
    
    let memoryQuery = collection(db, MEMORY_COLLECTION);
    
    if (userId) {
      memoryQuery = query(
        memoryQuery,
        where('userId', '==', userId),
        orderBy('timestamp', 'asc')
      ) as any;
    } else {
      memoryQuery = query(
        memoryQuery,
        orderBy('timestamp', 'asc')
      ) as any;
    }
    
    const allMemories = await getDocs(memoryQuery);
    const totalMemories = allMemories.size;
    
    if (totalMemories <= MEMORY_LIMIT) {
      return 0;
    }
    
    const memoriesToDelete = totalMemories - MEMORY_LIMIT;
    const deletedMemories = [];
    
    for (let i = 0; i < memoriesToDelete; i++) {
      if (i < allMemories.docs.length) {
        const memory = allMemories.docs[i];
        await deleteDoc(memory.ref);
        deletedMemories.push(memory.id);
      }
    }
    
    return deletedMemories.length;
  } catch (error) {
    console.error('Error cleaning up old memories:', error);
    return 0;
  }
}

/**
 * Count memories by type
 */
export async function countMemoriesByType(): Promise<Record<string, number>> {
  try {
    if (!db) {
      console.warn('Firebase not initialized - memory counting skipped');
      return {};
    }
    
    const types = ['interaction', 'configuration', 'system', 'error'];
    const counts: Record<string, number> = {};
    
    for (const type of types) {
      const typeQuery = query(
        collection(db, MEMORY_COLLECTION),
        where('type', '==', type)
      );
      
      const snapshot = await getDocs(typeQuery);
      counts[type] = snapshot.size;
    }
    
    return counts;
  } catch (error) {
    console.error('Error counting memories by type:', error);
    return {};
  }
}

export default {
  initMemorySystem,
  createMemory,
  getMemoryById,
  getMemories,
  deleteMemory,
  cleanupOldMemories,
  countMemoriesByType
};