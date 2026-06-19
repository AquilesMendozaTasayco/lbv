const CACHE_PREFIX = "lbv_cache_";
const DEFAULT_TTL = 5 * 60 * 1000;

export function getCached(key) {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, expiry } = JSON.parse(raw);
    if (Date.now() > expiry) {
      sessionStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return data;
  } catch { return null; }
}

export function setCache(key, data, ttl = DEFAULT_TTL) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, expiry: Date.now() + ttl }));
  } catch { /* quota exceeded, ignore */ }
}