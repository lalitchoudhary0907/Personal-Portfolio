/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(80, 'Name must not exceed 80 characters')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name contains invalid characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(120, 'Email must not exceed 120 characters')
    .toLowerCase(),
  subject: z
    .string()
    .trim()
    .min(3, 'Subject must be at least 3 characters long')
    .max(120, 'Subject must not exceed 120 characters'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters long')
    .max(2500, 'Message must not exceed 2,500 characters'),
  honeypot: z.string().optional().default(''),
  formRenderedAt: z.number().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export type ContactFormErrors = Partial<Record<keyof ContactFormData | 'general', string>>;

export function validateContactInput(data: unknown): {
  success: boolean;
  data?: ContactFormData;
  errors?: ContactFormErrors;
} {
  const result = contactFormSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: ContactFormErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ContactFormData;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return { success: false, errors };
}
