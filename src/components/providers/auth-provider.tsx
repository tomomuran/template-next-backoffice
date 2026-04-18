"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { UserProfile } from "@/lib/auth/roles";

const AuthContext = createContext<UserProfile | null>(null);

interface AuthProviderProps {
  profile: UserProfile | null;
  children: ReactNode;
}

export function AuthProvider({ profile, children }: AuthProviderProps) {
  return <AuthContext.Provider value={profile}>{children}</AuthContext.Provider>;
}

export function useCurrentUser() {
  return useContext(AuthContext);
}
