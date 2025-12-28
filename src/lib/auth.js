"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  signInWithEmail as fbSignIn,
  signUpWithEmail as fbSignUp,
  signOut as fbSignOut,
  onAuthChange,
} from "./firebase";

// Simple React context + hooks for client-side auth state
const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Convenience wrappers for firebaseClient auth helpers
export async function signUp(email, password) {
  return fbSignUp(email, password);
}

export async function signIn(email, password) {
  return fbSignIn(email, password);
}

export async function signOut() {
  return fbSignOut();
}

export default {
  AuthProvider,
  useAuth,
  signIn,
  signUp,
  signOut,
};
