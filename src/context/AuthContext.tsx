import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { AuthSession, LoginResponse } from '../models/auth';
import { apiRequest, setAccessToken, setUnauthorizedHandler } from '../services/api';
import { authStorage } from '../services/authStorage';

interface AuthContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    setSession(null);
    setAccessToken(null);
    await authStorage.clear();
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  useEffect(() => {
    void (async () => {
      const saved = await authStorage.load();
      if (saved && Date.parse(saved.expiresAt) > Date.now()) {
        setSession(saved);
        setAccessToken(saved.accessToken);
      } else if (saved) {
        await authStorage.clear();
      }
      setIsLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const nextSession = await apiRequest<LoginResponse>('/api/auth/login', {
      auth: false,
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password }),
    });
    await authStorage.save(nextSession);
    setAccessToken(nextSession.accessToken);
    setSession(nextSession);
  }, []);

  const value = useMemo(() => ({ session, isLoading, login, logout }), [session, isLoading, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
