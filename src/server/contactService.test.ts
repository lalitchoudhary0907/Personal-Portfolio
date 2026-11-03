/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  processContactSubmission,
  isEmailServiceConfigured,
  getPublicServiceStatus,
} from './contactService';
import { MemoryRateLimiterStore, setRateLimiterStore } from './rateLimiter';
import { validateContactInput } from '../lib/validations/contact';

test('validateContactInput validates properly formatted inputs', () => {
  const valid = {
    name: 'Alice Recruiter',
    email: 'alice@company.com',
    subject: 'Summer Software Engineering Internship 2026',
    message: 'Hello Lalit, we would love to invite you for an interview regarding your DocDrift project.',
    honeypot: '',
    formRenderedAt: Date.now() - 5000,
  };

  const res = validateContactInput(valid);
  assert.equal(res.success, true);
  assert.ok(res.data);
  assert.equal(res.data?.email, 'alice@company.com');
});

test('validateContactInput catches invalid inputs with specific error messages', () => {
  // Empty / short fields
  const invalid = {
    name: 'A',
    email: 'not-an-email',
    subject: 'Hi',
    message: 'Too short',
  };

  const res = validateContactInput(invalid);
  assert.equal(res.success, false);
  assert.ok(res.errors);
  assert.ok(res.errors?.name);
  assert.ok(res.errors?.email);
  assert.ok(res.errors?.subject);
  assert.ok(res.errors?.message);
});

test('validateContactInput rejects CRLF line breaks in name field', () => {
  const crlfName = {
    name: 'Alice\r\nBcc: evil@attacker.com',
    email: 'alice@company.com',
    subject: 'Interview Invitation',
    message: 'Valid message body exceeding minimum length requirement.',
    honeypot: '',
  };

  const res = validateContactInput(crlfName);
  assert.equal(res.success, false);
  assert.ok(res.errors?.name);
});

test('processContactSubmission flags honeypot spam immediately', async () => {
  const spam = {
    name: 'Spam Bot',
    email: 'bot@spam.com',
    subject: 'Buy cheap SEO backlinks now',
    message: 'Guaranteed search engine ranking top positions for your site today.',
    honeypot: 'filled_by_automated_scraper',
    formRenderedAt: Date.now() - 5000,
  };

  const result = await processContactSubmission(spam, '192.168.1.100');
  assert.equal(result.success, false);
  assert.equal(result.status, 400);
  assert.match(result.error || '', /spam/i);
});

test('processContactSubmission rejects inhumanly fast bot submissions', async () => {
  const fastSubmission = {
    name: 'Fast Bot',
    email: 'fast@bot.com',
    subject: 'Instant submission inquiry',
    message: 'This message was delivered in less than two hundred milliseconds.',
    honeypot: '',
    formRenderedAt: Date.now() - 200, // only 200ms ago
  };

  const result = await processContactSubmission(fastSubmission, '192.168.1.101');
  assert.equal(result.success, false);
  assert.equal(result.status, 400);
  assert.match(result.error || '', /too fast/i);
});

test('rate limiter throttles excessive requests per IP address', async () => {
  const testStore = new MemoryRateLimiterStore();
  setRateLimiterStore(testStore);
  const testIp = '10.0.0.42';

  const validPayload = {
    name: 'Sarah Connor',
    email: 'sarah@resistance.org',
    subject: 'Interview for AI Engineering Intern',
    message: 'Hello Lalit, we would like to talk with you regarding your AI projects and WorldQuant achievements.',
    honeypot: '',
    formRenderedAt: Date.now() - 6000,
  };

  // 5 requests processed
  for (let i = 0; i < 5; i++) {
    await processContactSubmission(validPayload, testIp);
  }

  // 6th request must be throttled with HTTP 429
  const throttled = await processContactSubmission(validPayload, testIp);
  assert.equal(throttled.status, 429);
  assert.equal(throttled.success, false);
  assert.ok(typeof throttled.retryAfterSeconds === 'number' && throttled.retryAfterSeconds > 0);

  testStore.destroy();
});

test('unconfigured provider returns truthful 503 error without faking message delivery', async () => {
  const origKey = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;

  try {
    const valid = {
      name: 'Sarah Connor',
      email: 'sarah@resistance.org',
      subject: 'Interview for AI Engineering Intern',
      message: 'Hello Lalit, we would like to talk with you regarding your AI projects and WorldQuant achievements.',
      honeypot: '',
      formRenderedAt: Date.now() - 6000,
    };

    const res = await processContactSubmission(valid, '10.0.0.99');
    assert.equal(res.success, false);
    assert.equal(res.status, 503);
    assert.equal(res.configured, false);
    // Explicitly confirms honesty: does NOT pretend message was sent
    assert.match(res.error || '', /provider API credentials|lalitchoudhary0907@gmail.com/);

    const status = getPublicServiceStatus();
    assert.equal(status.configured, false);
    assert.equal(status.recipientEmail, 'lalitchoudhary0907@gmail.com');
  } finally {
    if (origKey !== undefined) {
      process.env.RESEND_API_KEY = origKey;
    }
  }
});

test('returns generic error message on upstream delivery failure without leaking internal details', async () => {
  // Test with invalid key that causes 401/403 or network failure from Resend
  process.env.RESEND_API_KEY = 're_test_dummy_invalid_key_1234567890';

  try {
    const valid = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Collaboration Inquiry',
      message: 'Hello Lalit, let us discuss open source tools and AI development.',
      honeypot: '',
      formRenderedAt: Date.now() - 5000,
    };

    const res = await processContactSubmission(valid, '10.0.0.188');
    assert.equal(res.success, false);
    // TASK 1 Verification: Must return generic message, never raw upstream details or keys
    assert.equal(res.error, 'Email delivery is temporarily unavailable. Please try again later.');
    assert.ok(res.status === 502 || res.status === 500);
  } finally {
    delete process.env.RESEND_API_KEY;
  }
});
