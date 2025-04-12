import { createContext, ReactNode, useContext } from "react";
import { User } from '../types/user';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Mock implementation - in a real app, this would fetch the user from your API
  const user = null;
  const isLoading = false;
  const error = null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
      }}
    >
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