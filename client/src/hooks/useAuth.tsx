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
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextProps {
  currentUser: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<User | null>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
      console.error('Error in sign in:', error);
      toast({
        title: 'Error al iniciar sesión',
        description: error.message || 'No pudimos iniciar sesión con esas credenciales',
        variant: 'destructive',
      });
      return null;
    }
  };

  const signUp = async (email: string, password: string): Promise<User | null> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error: any) {
      console.error('Error in sign up:', error);
      toast({
        title: 'Error al registrarse',
        description: error.message || 'No pudimos crear una cuenta con esos datos',
        variant: 'destructive',
      });
      return null;
    }
  };

  const signInWithGoogle = async (): Promise<User | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: any) {
      console.error('Error in Google sign in:', error);
      toast({
        title: 'Error con Google',
        description: error.message || 'No pudimos iniciar sesión con Google',
        variant: 'destructive',
      });
      return null;
    }
  };

  const logOut = async (): Promise<void> => {
    try {
      await signOut(auth);
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente',
      });
    } catch (error: any) {
      console.error('Error in logout:', error);
      toast({
        title: 'Error al cerrar sesión',
        description: error.message || 'No pudimos cerrar tu sesión',
        variant: 'destructive',
      });
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Email enviado',
        description: 'Hemos enviado un email para restablecer tu contraseña',
      });
    } catch (error: any) {
      console.error('Error in password reset:', error);
      toast({
        title: 'Error al restablecer contraseña',
        description: error.message || 'No pudimos enviar el email de restablecimiento',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    logOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}