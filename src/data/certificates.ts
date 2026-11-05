/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AchievementEntry } from '../types';

/**
 * Structured, strictly verified certificates & achievements data for Lalit Choudhary.
 * 
 * Strict Truthfulness Guarantee:
 * - Real certificate files exist in /public/assets/aistudio/
 * - Only genuine certificates with real files have download and full preview options enabled.
 */
export const certificatesData: AchievementEntry[] = [
  {
    id: 'cert-worldquant-gold',
    title: 'WorldQuant BRAIN Gold Level',
    issuer: 'WorldQuant BRAIN',
    category: 'Quant & Algorithmic Challenge',
    level: 'Gold Milestone',
    credentialBadge: 'Gold Level Milestone',
    hasGenuineFile: true,
    fileType: 'pdf',
    fileSize: '268 KB',
    certificatePath: '/assets/aistudio/WorldQuant_Gold_Certificate_fd9a9343.pdf',
    authority: 'Nitish Maini, Chief Strategy Officer of WorldQuant',
    summary:
      'Certificate of Accomplishment awarded for reaching Gold Level in the global WorldQuant Challenge®, demonstrating advanced quantitative modeling, predictive alpha signal generation, and financial engineering discipline.',
    verificationStatus: 'verified',
    milestoneOrder: 1,
  },
  {
    id: 'cert-hacktoberfest-2026',
    title: 'Hacktoberfest Hack Day Sonipat Attendee',
    issuer: 'Hacktoberfest (MLH x DEV x DigitalOcean)',
    category: 'Open Source & Hackathon',
    level: 'In-Person Attendee',
    credentialBadge: 'In-Person Community Milestone',
    date: 'October 31, 2026',
    hasGenuineFile: true,
    fileType: 'pdf',
    fileSize: '62 KB',
    certificatePath: '/assets/aistudio/HacktoberFest_Certificate_9daf99fa.pdf',
    summary:
      'Participated in-person at Hacktoberfest Hack Day Sonipat hosted at Rishihood University on October 31, 2026, collaborating with fellow engineers on open-source software and developer utilities.',
    verificationStatus: 'verified',
    milestoneOrder: 2,
  },
];
