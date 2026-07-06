import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  hasBackendConfig,
  loginWithEmail,
  logoutUser,
  observeSession,
  resetPassword,
  sendResetEmail,
  signupWithEmail,
  loginDemo
} from '../services/authService';
import { setUnauthorizedHandler } from '../services/httpClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    const unsubscribe = observeSession((nextUser) => {
      setUser(nextUser || null);
      setBootstrapped(true);
    });
    return unsubscribe;
  }, []);

  const actions = useMemo(
    () => ({
      user,
      bootstrapped,
      hasBackendConfig,
      login: async (credentials) => {
        const nextUser = await loginWithEmail(credentials);
        flushSync(() => setUser(nextUser));
        return nextUser;
      },
      signup: async (credentials) => {
        const nextUser = await signupWithEmail(credentials);
        flushSync(() => setUser(nextUser));
        return nextUser;
      },
      loginDemo: async () => {
        const nextUser = await loginDemo();
        flushSync(() => setUser(nextUser));
        return nextUser;
      },
      sendResetEmail,
      resetPassword,
      logout: async () => {
        await logoutUser();
        setUser(null);
      },
    }),
    [user, bootstrapped]
  );

  return <AuthContext.Provider value={actions}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
