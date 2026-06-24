const prefix = 'health-hub';

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(`${prefix}:${key}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    window.localStorage.setItem(`${prefix}:${key}`, JSON.stringify(value));
  },
  remove(key) {
    window.localStorage.removeItem(`${prefix}:${key}`);
  }
};
