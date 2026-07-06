import { apiRequest } from './httpClient';
import { clearToken, getToken, setToken } from './tokenStore';
import {
  clearDemoState,
  DEMO_TOKEN,
  DEMO_USER,
  getDemoState,
  isDemoToken
} from './demoMode';

const API_TIMEOUT_MS = 8000;

async function apiRequestWithTimeout(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    return await apiRequest(path, {
      ...options,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

export function observeSession(callback) {
  const token = getToken();
  if (!token) {
    callback(null);
    return () => {};
  }

  if (isDemoToken(token)) {
    getDemoState();
    callback(DEMO_USER);
    return () => {};
  }

  let mounted = true;
  apiRequest('/auth/me')
    .then((payload) => {
      if (mounted) callback(payload.user);
    })
    .catch(() => {
      clearToken();
      if (mounted) callback(null);
    });

  return () => {
    mounted = false;
  };
}

export async function loginWithEmail({ email, password }) {
  const payload = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  if (!payload?.token || !payload?.user) {
    throw new Error('Sign in failed. Please try again.');
  }
  setToken(payload.token);
  return payload.user;
}

export async function signupWithEmail({ name, email, password }) {
  const payload = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
  setToken(payload.token);
  return payload.user;
}

export async function loginDemo() {
  try {
    const payload = await apiRequestWithTimeout('/auth/demo', {
      method: 'POST'
    });
    setToken(payload.token);
    return payload.user;
  } catch {
    getDemoState();
    setToken(DEMO_TOKEN);
    return DEMO_USER;
  }
}

export async function sendResetEmail(email) {
  return apiRequest('/auth/reset-request', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export async function resetPassword({ token, password }) {
  return apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password })
  });
}

export async function logoutUser() {
  if (isDemoToken(getToken())) {
    clearToken();
    clearDemoState();
    return;
  }

  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } finally {
    clearToken();
  }
}

export const hasBackendConfig = true;
