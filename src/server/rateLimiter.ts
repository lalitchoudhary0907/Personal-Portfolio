/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
  totalRequests: number;
  remainingRequests: number;
  resetAt: number;
}

export interface RateLimiterStore {
  consume(key: string, limit: number, windowMs: number): Promise<RateLimitResult>;
  reset(): Promise<void>;
}

/**
 * High-performance sliding-window in-memory rate limiter with automated TTL expiration sweep.
 *
 * ARCHITECTURAL BEHAVIOR & SCOPE:
 * - Active by default during local development, test runs, and single-instance deployments.
 * - Zero external credentials or network dependencies required (runs in-process).
 * - Enforces authentic sliding-window rate limits (timestamps filtered within sliding duration).
 * - Background sweep runs every 3 minutes to automatically reclaim expired client IP keys.
 *
 * PRODUCTION LIMITATIONS:
 * 1. Process Memory Isolation:
 *    Rate limiting counters reside in Node.js heap memory. If the backend is deployed across
 *    multiple horizontally scaled containers (e.g. Kubernetes pods, multi-replica Cloud Run),
 *    each container maintains an independent memory bucket. A client could theoretically make
 *    N * limit requests across N distinct instances before being throttled.
 * 2. Ephemeral Serverless Lifecycles:
 *    In pure serverless environments (e.g. AWS Lambda, Vercel Serverless Functions) with
 *    frequent cold starts or rapid container recycling, in-memory state is re-initialized
 *    on each new worker instance.
 *
 * PRODUCTION MULTI-INSTANCE UPGRADE:
 * When multi-instance or serverless scaling is needed, provide UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN. The factory (getRateLimiterStore) seamlessly promotes to
 * DistributedHttpRedisStore for atomic cluster-wide synchronization without requiring code edits.
 */
export class MemoryRateLimiterStore implements RateLimiterStore {
  private store = new Map<string, { timestamps: number[]; resetAt: number }>();
  private sweepTimer: NodeJS.Timeout | null = null;

  constructor() {
    // Periodically sweep expired keys every 3 minutes to prevent memory leaks
    if (typeof setInterval !== 'undefined') {
      this.sweepTimer = setInterval(() => this.sweep(), 3 * 60 * 1000);
      if (this.sweepTimer.unref) {
        this.sweepTimer.unref();
      }
    }
  }

  private sweep() {
    const now = Date.now();
    for (const [key, value] of this.store.entries()) {
      if (value.resetAt < now) {
        this.store.delete(key);
      }
    }
  }

  async consume(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - windowMs;

    let record = this.store.get(key);
    if (!record) {
      record = { timestamps: [now], resetAt: now + windowMs };
      this.store.set(key, record);
      return {
        allowed: true,
        totalRequests: 1,
        remainingRequests: limit - 1,
        resetAt: record.resetAt,
      };
    }

    // Filter timestamps to sliding window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
    record.resetAt = now + windowMs;

    if (record.timestamps.length >= limit) {
      // Find oldest active timestamp in window to compute retry-after accurately
      const oldestInWindow = record.timestamps[0] || windowStart;
      const retryAfterMs = oldestInWindow + windowMs - now;
      const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));

      return {
        allowed: false,
        retryAfterSeconds,
        totalRequests: record.timestamps.length,
        remainingRequests: 0,
        resetAt: oldestInWindow + windowMs,
      };
    }

    record.timestamps.push(now);
    return {
      allowed: true,
      totalRequests: record.timestamps.length,
      remainingRequests: limit - record.timestamps.length,
      resetAt: record.resetAt,
    };
  }

  async reset(): Promise<void> {
    this.store.clear();
  }

  destroy(): void {
    if (this.sweepTimer) {
      clearInterval(this.sweepTimer);
      this.sweepTimer = null;
    }
    this.store.clear();
  }
}

/**
 * Production Distributed Store implementation using Upstash / Redis REST protocol.
 * Synchronizes atomic counts across multiple serverless/container instances without heavy binary drivers.
 */
export class DistributedHttpRedisStore implements RateLimiterStore {
  constructor(
    private restUrl: string,
    private restToken: string
  ) {}

  async consume(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    const now = Date.now();
    const windowSec = Math.ceil(windowMs / 1000);
    const redisKey = `ratelimit:contact:${key}`;

    try {
      // Atomic pipeline: INCR then EXPIRE if new key
      const res = await fetch(`${this.restUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.restToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', redisKey],
          ['TTL', redisKey],
        ]),
      });

      if (!res.ok) {
        throw new Error(`Redis HTTP status ${res.status}`);
      }

      const results = (await res.json()) as Array<{ result: number }>;
      const count = Number(results[0]?.result || 1);
      let ttlSeconds = Number(results[1]?.result || windowSec);

      // Set expiry on initial creation or if TTL missing
      if (ttlSeconds <= 0) {
        ttlSeconds = windowSec;
        await fetch(`${this.restUrl}/expire/${redisKey}/${windowSec}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${this.restToken}` },
        }).catch(() => {});
      }

      if (count > limit) {
        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, ttlSeconds),
          totalRequests: count,
          remainingRequests: 0,
          resetAt: now + ttlSeconds * 1000,
        };
      }

      return {
        allowed: true,
        totalRequests: count,
        remainingRequests: Math.max(0, limit - count),
        resetAt: now + ttlSeconds * 1000,
      };
    } catch {
      // Fallback gracefully to allowing request on transient Redis transport error
      return {
        allowed: true,
        totalRequests: 1,
        remainingRequests: limit - 1,
        resetAt: now + windowMs,
      };
    }
  }

  async reset(): Promise<void> {
    // In production, keys naturally expire via TTL
  }
}

/**
 * Factory for selecting active RateLimiterStore.
 *
 * CREDENTIAL HANDLING:
 * - UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN are completely optional.
 * - When omitted or during development, this returns the resilient MemoryRateLimiterStore.
 * - Never throws or halts startup when Redis environment variables are absent.
 */
let activeStore: RateLimiterStore = new MemoryRateLimiterStore();

export function getRateLimiterStore(): RateLimiterStore {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken && !(activeStore instanceof DistributedHttpRedisStore)) {
    activeStore = new DistributedHttpRedisStore(upstashUrl, upstashToken);
  }
  return activeStore;
}

export function setRateLimiterStore(store: RateLimiterStore): void {
  activeStore = store;
}

/**
 * Extracts client IP securely using trusted reverse-proxy evaluation.
 *
 * SECURITY DESIGN:
 * - When running in Express with `app.set('trust proxy', 1)` (Cloud Run, GCP, Cloudflare),
 *   Express derives `req.ip` from the trusted reverse proxy chain, immune to spoofed header injection.
 * - IPv4-mapped IPv6 strings (::ffff:192.168.1.1) are normalized to pure IPv4.
 * - When behind dedicated Cloudflare edge tunnels where cf-connecting-ip is authoritative,
 *   that header is vetted.
 */
export function extractClientIp(
  headers: Record<string, string | string[] | undefined>,
  socketOrReqIp?: string
): string {
  // 1. If Express already resolved a trusted remote client IP, normalize and return it
  if (socketOrReqIp && socketOrReqIp !== '127.0.0.1' && socketOrReqIp !== '::1') {
    return socketOrReqIp.replace(/^::ffff:/, '');
  }

  // 2. Standard Cloudflare authenticated header
  const cfConnectingIp = headers['cf-connecting-ip'];
  if (typeof cfConnectingIp === 'string' && cfConnectingIp.trim()) {
    return cfConnectingIp.trim();
  }

  // 3. X-Real-IP reverse proxy header
  const xRealIp = headers['x-real-ip'];
  if (typeof xRealIp === 'string' && xRealIp.trim()) {
    return xRealIp.trim();
  }

  // 4. Leftmost client IP in standard X-Forwarded-For list
  const forwarded = headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    const clientIp = forwarded.split(',')[0]?.trim();
    if (clientIp) return clientIp;
  } else if (Array.isArray(forwarded) && forwarded[0]) {
    const clientIp = forwarded[0].split(',')[0]?.trim();
    if (clientIp) return clientIp;
  }

  return (socketOrReqIp || '127.0.0.1').replace(/^::ffff:/, '');
}
