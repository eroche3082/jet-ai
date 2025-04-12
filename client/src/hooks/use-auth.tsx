import { createContext, ReactNode, useContext, useState } from "react";
import type { User, UserPreferences } from "../../shared/schema";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

// Mock user data for testing purposes
const mockUser: User = {
  id: 1,
  username: 'test_user',
  email: 'test@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  password: '', // We never expose the actual password
  preferences: {
    theme: 'light',
    language: 'en',
    notifications: true
  }
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // For testing purposes, we'll use a mock user
  const [authState] = useState<AuthContextType>({
    user: null, // Guest mode, no authenticated user
    isLoading: false,
    error: null
  });

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}