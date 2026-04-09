"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getCurrentUser,
  createUser,
  loginUser as storeLogin,
  logoutUser as storeLogout,
  setCurrentUser,
} from "@/lib/data/store";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getCurrentUser();
    if (stored) setUser(stored);
    setLoading(false);
  }, []);

  const signup = useCallback(async ({ email, password, businessName, businessCategory, preferredTone }) => {
    try {
      const newUser = createUser({
        email,
        password,
        businessName: businessName || "My Business",
        businessCategory: businessCategory || "Restaurant",
        preferredTone: preferredTone || "Professional",
      });
      setCurrentUser(newUser);
      setUser(newUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const loggedIn = storeLogin(email, password);
      setUser(loggedIn);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    storeLogout();
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    const updated = { ...user, ...updates };
    setCurrentUser(updated);
    setUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
