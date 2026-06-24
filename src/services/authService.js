import { apiRequest } from './httpClient';
import { clearToken, getToken, setToken } from './tokenStore';

export function observeSession(callback) {
  const token = getToken();
  if (!token) {
    callback(null);
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
  const payload = await apiRequest('/auth/demo', {
    method: 'POST'
  });
  setToken(payload.token);
  return payload.user;
}

export async function sendResetEmail(email) {
  return apiRequest('/auth/reset-request', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export async function logoutUser() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } finally {
    clearToken();
  }
}

export const hasBackendConfig = true;
