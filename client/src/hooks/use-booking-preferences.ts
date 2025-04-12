import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { firestore } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface BookingPreferences {
  preferredAirlines?: string[];
  seatPreference?: 'window' | 'aisle' | 'no preference';
  cabinClass?: 'economy' | 'premium economy' | 'business' | 'first';
  mealPreference?: string;
  maxPrice?: number;
  prefersDirect?: boolean;
  preferredDepartureTime?: 'morning' | 'afternoon' | 'evening' | 'any';
  hotelAmenities?: string[];
  roomType?: string;
  neighborhoodPreference?: string[];
  lastSearches?: string[];
}

export function useBookingPreferences() {
  const [preferences, setPreferences] = useState<BookingPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load preferences from Firebase
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) {
        setPreferences(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userDocRef = doc(firestore, 'users', user.id.toString());
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists() && userDoc.data().bookingPreferences) {
          setPreferences(userDoc.data().bookingPreferences);
        } else {
          // Initialize with default preferences
          const defaultPreferences: BookingPreferences = {
            preferredAirlines: [],
            seatPreference: 'no preference',
            cabinClass: 'economy',
            prefersDirect: true,
            preferredDepartureTime: 'any',
            hotelAmenities: ['wifi', 'breakfast'],
            lastSearches: [],
          };
          
          setPreferences(defaultPreferences);
          
          // Save default preferences to Firebase
          if (userDoc.exists()) {
            await updateDoc(userDocRef, {
              bookingPreferences: defaultPreferences
            });
          } else {
            await setDoc(userDocRef, {
              bookingPreferences: defaultPreferences
            });
          }
        }
      } catch (error) {
        console.error('Error loading booking preferences:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your booking preferences',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user, toast]);

  // Save preferences to Firebase
  const savePreferences = async (newPreferences: BookingPreferences) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save preferences',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      const userDocRef = doc(firestore, 'users', user.id.toString());
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        await updateDoc(userDocRef, {
          bookingPreferences: newPreferences
        });
      } else {
        await setDoc(userDocRef, {
          bookingPreferences: newPreferences
        });
      }
      
      setPreferences(newPreferences);
      
      toast({
        title: 'Success',
        description: 'Your booking preferences have been saved',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving booking preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your booking preferences',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Update a specific preference field
  const updatePreference = async (key: keyof BookingPreferences, value: any) => {
    if (!preferences) return;
    
    const updatedPreferences = {
      ...preferences,
      [key]: value
    };
    
    setPreferences(updatedPreferences);
    await savePreferences(updatedPreferences);
  };

  // Add a new search to last searches
  const addSearchToHistory = async (searchTerm: string) => {
    if (!preferences) return;
    
    const lastSearches = preferences.lastSearches || [];
    
    // Remove duplicate if exists and add to beginning
    const updatedSearches = [
      searchTerm,
      ...lastSearches.filter(s => s !== searchTerm)
    ].slice(0, 10); // Keep only last 10 searches
    
    const updatedPreferences = {
      ...preferences,
      lastSearches: updatedSearches
    };
    
    setPreferences(updatedPreferences);
    await savePreferences(updatedPreferences);
  };

  return {
    preferences,
    loading,
    saving,
    savePreferences,
    updatePreference,
    addSearchToHistory
  };
}