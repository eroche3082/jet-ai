import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  User,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  auth, 
  googleProvider, 
  UserProfile, 
  createUserProfile, 
  getUserProfile, 
  updateUserProfile,
  hasCompletedOnboarding
} from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextProps {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isProfileLoading: boolean;
  hasCompletedOnboarding: boolean;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string, name?: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<User | null>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (travelPreferences?: UserProfile['travelPreferences']) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const { toast } = useToast();

  // Get user profile whenever currentUser changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchUserProfile = async () => {
      if (!currentUser) {
        if (isMounted) {
          setUserProfile(null);
          setIsProfileLoading(false);
          setOnboardingCompleted(false);
        }
        return;
      }
      
      try {
        setIsProfileLoading(true);
        const profile = await getUserProfile(currentUser.uid);
        const onboardingStatus = await hasCompletedOnboarding(currentUser.uid);
        
        if (isMounted) {
          setUserProfile(profile);
          setOnboardingCompleted(onboardingStatus);
          setIsProfileLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (isMounted) {
          setIsProfileLoading(false);
        }
      }
    };
    
    fetchUserProfile();
    
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string): Promise<User | null> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        title: 'Sign in error',
        description: error.message || 'Could not sign in with those credentials',
        variant: 'destructive',
      });
      return null;
    }
  };

  const signUp = async (email: string, password: string, name?: string): Promise<User | null> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile with name if provided
      if (result.user) {
        await createUserProfile(result.user, { name: name || '' });
      }
      
      return result.user;
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: 'Sign up error',
        description: error.message || 'Could not create an account with that information',
        variant: 'destructive',
      });
      return null;
    }
  };

  const signInWithGoogle = async (): Promise<User | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Create/update user profile
      if (result.user) {
        const profile = await getUserProfile(result.user.uid);
        if (!profile) {
          await createUserProfile(result.user, {
            name: result.user.displayName || '',
          });
        }
      }
      
      return result.user;
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast({
        title: 'Google sign in error',
        description: error.message || 'Could not sign in with Google',
        variant: 'destructive',
      });
      return null;
    }
  };

  const logOut = async (): Promise<void> => {
    try {
      await signOut(auth);
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: 'Sign out error',
        description: error.message || 'Could not sign you out',
        variant: 'destructive',
      });
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Email sent',
        description: 'We have sent you an email to reset your password',
      });
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: 'Password reset error',
        description: error.message || 'Could not send password reset email',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<void> => {
    if (!currentUser) {
      toast({
        title: 'Authentication required',
        description: 'You must be signed in to update your profile',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateUserProfile(currentUser.uid, data);
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Profile update error',
        description: error.message || 'Could not update your profile',
        variant: 'destructive',
      });
    }
  };

  const completeOnboarding = async (travelPreferences?: UserProfile['travelPreferences']): Promise<void> => {
    if (!currentUser) return;
    
    try {
      await updateUserProfile(currentUser.uid, {
        completedOnboarding: true,
        travelPreferences: travelPreferences || userProfile?.travelPreferences
      });
      
      setOnboardingCompleted(true);
      
      // Update local state
      setUserProfile(prev => prev ? {
        ...prev,
        completedOnboarding: true,
        travelPreferences: travelPreferences || prev.travelPreferences
      } : null);
      
      toast({
        title: 'Onboarding complete',
        description: 'Your personal JetAI dashboard has been created',
      });
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error',
        description: 'Could not complete onboarding process',
        variant: 'destructive',
      });
    }
  };

  const value = {
    currentUser,
    userProfile,
    isLoading,
    isProfileLoading,
    hasCompletedOnboarding: onboardingCompleted,
    signIn,
    signUp,
    signInWithGoogle,
    logOut,
    resetPassword,
    updateProfile,
    completeOnboarding,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}