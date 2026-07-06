import { clearToken, getToken } from './tokenStore';
import { isDemoToken } from './demoMode';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

let onUnauthorized = () => {};

export function setUnauthorizedHandler(handler) {
  onUnauthorized = typeof handler === 'function' ? handler : () => {};
}

function normalizeErrorMessage(message, fallback) {
  if (typeof message !== 'string') return fallback;
  const cleaned = message.trim();
  if (!cleaned || cleaned.includes('undefined')) return fallback;
  return cleaned;
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers
    });
  } catch {
    throw new Error('Unable to reach the server. Check your connection and try again.');
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');
  let payload = null;
  if (isJson) {
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    if (response.status === 401 && !isDemoToken(getToken())) {
      clearToken();
      onUnauthorized();
    }
    const fallback =
      response.status === 401
        ? 'Invalid email or password.'
        : response.status >= 500
          ? 'Server error. Please try again in a moment.'
          : 'Request failed.';
    const error = new Error(
      normalizeErrorMessage(payload?.message, fallback)
    );
    error.status = response.status;
    throw error;
  }

  return payload;
}
