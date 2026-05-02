// contexts/auth.tsx
import { createContext, useContext, type ReactNode } from "react";
import { useMe } from "@/queries/useMe";
import type { MeQuery } from "@/graphql/graphql";

type AuthContextType = {
  user?: MeQuery["me"] | null;
  isLoading: boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading, refetch } = useMe();

  return (
    <AuthContext.Provider value={{ user: user, isLoading, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
