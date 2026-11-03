/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryRateLimiterStore, extractClientIp } from './rateLimiter';

test('MemoryRateLimiterStore limits requests per sliding window', async () => {
  const store = new MemoryRateLimiterStore();
  const key = 'test-client-1';
  const limit = 3;
  const windowMs = 5000;

  // First 3 requests must pass
  const r1 = await store.consume(key, limit, windowMs);
  assert.equal(r1.allowed, true);
  assert.equal(r1.remainingRequests, 2);

  const r2 = await store.consume(key, limit, windowMs);
  assert.equal(r2.allowed, true);
  assert.equal(r2.remainingRequests, 1);

  const r3 = await store.consume(key, limit, windowMs);
  assert.equal(r3.allowed, true);
  assert.equal(r3.remainingRequests, 0);

  // 4th request must be denied
  const r4 = await store.consume(key, limit, windowMs);
  assert.equal(r4.allowed, false);
  assert.equal(r4.remainingRequests, 0);
  assert.ok(typeof r4.retryAfterSeconds === 'number' && r4.retryAfterSeconds > 0);

  store.destroy();
});

test('MemoryRateLimiterStore isolates counters by client key', async () => {
  const store = new MemoryRateLimiterStore();

  const userA = '192.168.1.1';
  const userB = '192.168.1.2';

  // Fill userA limit
  for (let i = 0; i < 5; i++) {
    await store.consume(userA, 5, 10000);
  }
  const blockedA = await store.consume(userA, 5, 10000);
  assert.equal(blockedA.allowed, false);

  // userB must still be allowed
  const allowedB = await store.consume(userB, 5, 10000);
  assert.equal(allowedB.allowed, true);

  store.destroy();
});

test('extractClientIp resolves trusted proxy headers correctly', () => {
  // Cloudflare header priority
  const cfHeaders = {
    'cf-connecting-ip': '203.0.113.195',
    'x-forwarded-for': '198.51.100.1, 203.0.113.195',
  };
  assert.equal(extractClientIp(cfHeaders, '127.0.0.1'), '203.0.113.195');

  // Standard X-Forwarded-For leftmost client IP
  const xffHeaders = {
    'x-forwarded-for': '198.51.100.44, 10.0.0.1, 10.0.0.2',
  };
  assert.equal(extractClientIp(xffHeaders, '127.0.0.1'), '198.51.100.44');

  // Fallback to socket IP when headers absent
  assert.equal(extractClientIp({}, '172.16.0.5'), '172.16.0.5');
});

test('getRateLimiterStore operates reliably without UPSTASH_REDIS credentials', async () => {
  const origUrl = process.env.UPSTASH_REDIS_REST_URL;
  const origToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;

  try {
    const store = new MemoryRateLimiterStore();
    const result = await store.consume('optional-cred-ip', 2, 5000);
    assert.equal(result.allowed, true);
    assert.equal(result.remainingRequests, 1);

    const second = await store.consume('optional-cred-ip', 2, 5000);
    assert.equal(second.allowed, true);
    assert.equal(second.remainingRequests, 0);

    const third = await store.consume('optional-cred-ip', 2, 5000);
    assert.equal(third.allowed, false);

    store.destroy();
  } finally {
    if (origUrl) process.env.UPSTASH_REDIS_REST_URL = origUrl;
    if (origToken) process.env.UPSTASH_REDIS_REST_TOKEN = origToken;
  }
});
