import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type User = { user_id: string; email: string; name: string; picture?: string };

type AuthCtx = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signInWithSessionId: (sessionId: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx>({
  user: null,
  token: null,
  loading: true,
  signInWithSessionId: async () => {},
  signOut: async () => {},
});

const TOKEN_KEY = 'session_token';
const BACKEND = process.env.EXPO_PUBLIC_BACKEND_URL as string;

async function storeGet(key: string): Promise<string | null> {
  if (Platform.OS === 'web') return AsyncStorage.getItem(key);
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return AsyncStorage.getItem(key);
  }
}
async function storeSet(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(key, value);
    return;
  }
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    await AsyncStorage.setItem(key, value);
  }
}
async function storeDel(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(key);
    return;
  }
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    await AsyncStorage.removeItem(key);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    const t = await storeGet(TOKEN_KEY);
    if (!t) {
      setLoading(false);
      return;
    }
    try {
      const resp = await fetch(`${BACKEND}/api/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        setUser(data);
        setToken(t);
      } else {
        await storeDel(TOKEN_KEY);
      }
    } catch {
      // keep token; might be offline
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const signInWithSessionId = async (sessionId: string) => {
    const resp = await fetch(`${BACKEND}/api/auth/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    });
    if (!resp.ok) throw new Error('Sign in failed');
    const data = await resp.json();
    await storeSet(TOKEN_KEY, data.session_token);
    setToken(data.session_token);
    setUser(data.user);
  };

  const signOut = async () => {
    const t = token;
    setUser(null);
    setToken(null);
    await storeDel(TOKEN_KEY);
    if (t) {
      try {
        await fetch(`${BACKEND}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${t}` },
        });
      } catch {}
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signInWithSessionId, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
