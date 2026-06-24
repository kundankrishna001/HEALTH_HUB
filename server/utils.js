export function normalizeList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function deepMerge(base, patch) {
  if (Array.isArray(base) && Array.isArray(patch)) return patch;
  if (isPlainObject(base) && isPlainObject(patch)) {
    const result = { ...base };
    for (const [key, value] of Object.entries(patch)) {
      result[key] = key in base ? deepMerge(base[key], value) : value;
    }
    return result;
  }
  return patch === undefined ? base : patch;
}

export function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
