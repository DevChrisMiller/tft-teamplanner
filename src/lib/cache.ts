interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Module-level cache — persists across requests within the same server instance.
// On Vercel, this resets on cold starts but is reused for warm requests.
const cache = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCached<T>(key: string, data: T, ttlMs = 1000 * 60 * 60): void {
  cache.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
}
