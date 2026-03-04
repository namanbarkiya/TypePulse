"use client";

import React, { createContext, useContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { id: string; email: string; name: string } | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: true,
  isLoading: false,
  user: { id: "guest", email: "guest@local", name: "Guest" },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider value={{ isAuthenticated: true, isLoading: false, user: { id: "guest", email: "guest@local", name: "Guest" } }}>
      {children}
    </AuthContext.Provider>
  );
};
