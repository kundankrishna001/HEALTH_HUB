import { storage } from './storage';

const TOKEN_KEY = 'health-hub:token';

export function getToken() {
  return storage.get(TOKEN_KEY, null);
}

export function setToken(token) {
  if (token) {
    storage.set(TOKEN_KEY, token);
  } else {
    storage.remove(TOKEN_KEY);
  }
}

export function clearToken() {
  storage.remove(TOKEN_KEY);
}
