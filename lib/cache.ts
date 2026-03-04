interface CacheEntry<T> {
  value: T;
  expiresAt: number; // 0 means never expires
}

const store = new Map<string, CacheEntry<unknown>>();

function isExpired(entry: CacheEntry<unknown>): boolean {
  if (entry.expiresAt === 0) return false;
  return Date.now() > entry.expiresAt;
}

export function get<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;

  if (isExpired(entry)) {
    store.delete(key);
    return undefined;
  }

  // Clean up other expired entries on every get
  for (const [k, v] of store) {
    if (k !== key && isExpired(v)) {
      store.delete(k);
    }
  }

  return entry.value as T;
}

export function set<T>(key: string, value: T, ttlMs: number): void {
  const expiresAt = ttlMs === 0 ? 0 : Date.now() + ttlMs;
  store.set(key, { value, expiresAt });
}

export function has(key: string): boolean {
  const entry = store.get(key);
  if (!entry) return false;
  if (isExpired(entry)) {
    store.delete(key);
    return false;
  }
  return true;
}
