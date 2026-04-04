/**
 * 8. OBSERVABILITY
 * 
 * Strategy:
 * - Error Tracking: Sentry integration in _app.tsx.
 * - Performance: OpenTelemetry for tracing database reads.
 * - Logs: Structured logging (Winston) sent to Cloud Logging.
 */

export const Logger = {
  info: (msg: string, meta?: any) => {
    console.log(`[INFO] ${msg}`, meta);
    // In production: send to Sentry or LogRocket
  },
  error: (msg: string, error: any) => {
    console.error(`[ERROR] ${msg}`, error);
    // Sentry.captureException(error)
  }
};

/**
 * 6. CACHING STRATEGY
 * 
 * Layers:
 * 1. CDN (Vercel Edge): 30-day cache for static assets.
 * 2. ISR Cache (Next.js): Revalidates every 60s for dynamic pages.
 * 3. Repository Cache: In-memory LRU cache for Firestore docs (prevents redundant reads).
 */

const localCache = new Map<string, { data: any, timestamp: number }>();

export const getWithCache = async (key: string, fetchFn: () => Promise<any>, ttl: number = 60000) => {
  const cached = localCache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) return cached.data;
  
  const fresh = await fetchFn();
  localCache.set(key, { data: fresh, timestamp: Date.now() });
  return fresh;
};
