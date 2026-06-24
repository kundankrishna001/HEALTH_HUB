import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  hasBackendConfig,
  loginWithEmail,
  logoutUser,
  observeSession,
  sendResetEmail,
  signupWithEmail,
  loginDemo
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
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
        setUser(nextUser);
        return nextUser;
      },
      signup: async (credentials) => {
        const nextUser = await signupWithEmail(credentials);
        setUser(nextUser);
        return nextUser;
      },
      loginDemo: async () => {
        const nextUser = await loginDemo();
        setUser(nextUser);
        return nextUser;
      },
      sendResetEmail,
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
