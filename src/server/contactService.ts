/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { validateContactInput, ContactFormData } from '../lib/validations/contact';
import { getRateLimiterStore, RateLimitResult } from './rateLimiter';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;
const MIN_SUBMISSION_TIME_MS = 1200; // Submissions faster than 1.2s flagged as bot

export function isEmailServiceConfigured(): boolean {
  const key = process.env.RESEND_API_KEY;
  return typeof key === 'string' && key.trim().length > 0 && !key.includes('placeholder');
}

export function getPublicServiceStatus() {
  return {
    service: 'contact-gateway',
    configured: isEmailServiceConfigured(),
    recipientEmail: process.env.CONTACT_RECEIVER_EMAIL || 'lalitchoudhary0907@gmail.com',
    provider: isEmailServiceConfigured() ? 'Resend' : 'Unconfigured Standby (Direct mailto available)',
  };
}

export interface SendContactEmailResponse {
  success: boolean;
  status: number;
  message?: string;
  messageId?: string;
  error?: string;
  errors?: Record<string, string>;
  configured?: boolean;
  retryAfterSeconds?: number;
}

/**
 * Sanitizes single-line fields to prevent CRLF email header injection
 */
function stripControlCharacters(str: string): string {
  return str.replace(/[\r\n\t\x00-\x1F\x7F]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * HTML character entity escaping for safe rendering in email body
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\//g, '&#x2F;');
}

export async function processContactSubmission(
  rawInput: unknown,
  clientIp: string = '127.0.0.1'
): Promise<SendContactEmailResponse> {
  // 1. Zod Validation
  const validation = validateContactInput(rawInput);
  if (!validation.success || !validation.data) {
    return {
      success: false,
      status: 400,
      error: 'Form validation failed. Please correct the highlighted fields.',
      errors: validation.errors as Record<string, string>,
    };
  }

  const formData: ContactFormData = validation.data;

  // 2. Spam Honeypot Protection
  if (formData.honeypot && formData.honeypot.trim().length > 0) {
    // Sanitized server log: never log body or user secrets
    console.warn('[Security] Honeypot triggered from IP');
    return {
      success: false,
      status: 400,
      error: 'Automated spam submission detected.',
    };
  }

  // 3. Bot Submission Timing Protection
  if (formData.formRenderedAt) {
    const duration = Date.now() - formData.formRenderedAt;
    if (duration > 0 && duration < MIN_SUBMISSION_TIME_MS) {
      console.warn('[Security] Inhuman submission speed detected');
      return {
        success: false,
        status: 400,
        error: 'Submission was too fast. Please take a moment before submitting.',
      };
    }
  }

  // 4. Rate Limiting Check via Production Store
  const rateLimiter = getRateLimiterStore();
  const rateLimit: RateLimitResult = await rateLimiter.consume(
    clientIp,
    MAX_REQUESTS_PER_WINDOW,
    RATE_LIMIT_WINDOW_MS
  );

  if (!rateLimit.allowed) {
    console.warn('[Security] Rate limit exceeded for connection');
    return {
      success: false,
      status: 429,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
      error: `Too many submissions from this connection. Please try again in ${rateLimit.retryAfterSeconds || 60} seconds.`,
    };
  }

  // 5. Provider Configuration Check
  // USER MANDATE: "Use a reliable email service only after credentials are configured. Do not pretend messages were sent successfully."
  if (!isEmailServiceConfigured()) {
    return {
      success: false,
      status: 503,
      configured: false,
      error:
        'The email delivery service has not been configured with provider API credentials. To prevent your message from being lost, please email Lalit directly at lalitchoudhary0907@gmail.com or connect on LinkedIn.',
    };
  }

  // 6. Deliver via Resend API
  try {
    const resendApiKey = process.env.RESEND_API_KEY!;
    const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL || 'lalitchoudhary0907@gmail.com';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

    // Sanitize headers to prevent CRLF injection
    const cleanName = stripControlCharacters(formData.name);
    const cleanSubject = stripControlCharacters(formData.subject);

    // Escape HTML special characters for safe email template injection
    const safeName = escapeHtml(cleanName);
    const safeEmail = escapeHtml(formData.email);
    const safeSubject = escapeHtml(cleanSubject);
    const safeMessage = escapeHtml(formData.message).replace(/\n/g, '<br/>');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipientEmail],
        reply_to: formData.email,
        subject: `[Portfolio Contact] ${cleanSubject} - from ${cleanName}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px;">
              <h2 style="color: #0f172a; margin: 0; font-size: 20px;">New Message from Portfolio Website</h2>
              <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Recipient: Lalit Choudhary</p>
            </div>
            
            <div style="background: #ffffff; padding: 16px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
              <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>From:</strong> ${safeName} &lt;<a href="mailto:${safeEmail}" style="color: #0284c7;">${safeEmail}</a>&gt;</p>
              <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Subject:</strong> ${safeSubject}</p>
              <p style="margin: 0; font-size: 14px;"><strong>Sent:</strong> ${new Date().toUTCString()}</p>
            </div>

            <div style="background: #ffffff; padding: 20px; border-radius: 6px; border: 1px solid #e2e8f0;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569;">Message:</h3>
              <div style="color: #1e293b; font-size: 15px; line-height: 1.6;">${safeMessage}</div>
            </div>

            <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
              Sent via Lalit Choudhary's Portfolio Contact Gateway
            </div>
          </div>
        `,
        text: `New Portfolio Message\n\nFrom: ${cleanName} <${formData.email}>\nSubject: ${cleanSubject}\nDate: ${new Date().toISOString()}\n\nMessage:\n${formData.message}`,
      }),
    });

    if (!response.ok) {
      // TASK 1: Log only sanitized diagnostic information (status code only, NEVER tokens, headers or message text)
      console.error('[ContactGateway] Upstream provider returned error status:', response.status);
      
      // TASK 1: Return generic error message to client, never raw upstream details
      return {
        success: false,
        status: 502,
        error: 'Email delivery is temporarily unavailable. Please try again later.',
      };
    }

    const data = (await response.json()) as { id: string };
    return {
      success: true,
      status: 200,
      messageId: data.id,
      message: 'Your message was successfully sent! Lalit will get back to you shortly.',
    };
  } catch {
    // TASK 1: Log only sanitized diagnostic; return generic message to client
    console.error('[ContactGateway] Network transport error communicating with provider');
    return {
      success: false,
      status: 500,
      error: 'Email delivery is temporarily unavailable. Please try again later.',
    };
  }
}
