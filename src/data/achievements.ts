/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AchievementItem {
  id: string;
  issuer: string;
  title: string;
  subtitle: string;
  authority?: string;
  date: string;
  image: string;
  pdfUrl?: string;
  summary: string;
  tags?: string[];
}

export const achievements: AchievementItem[] = [
  {
    id: 'worldquant-gold',
    issuer: 'WorldQuant BRAIN',
    title: 'WorldQuant Challenge® — Gold Level',
    subtitle: 'Certificate of Accomplishment',
    authority: 'Nitish Maini, Chief Strategy Officer of WorldQuant',
    date: '2026',
    image: '/assets/certificates/worldquant-gold.png',
    pdfUrl: '/assets/aistudio/WorldQuant_Gold_Certificate_fd9a9343.pdf',
    summary:
      'Awarded in recognition for reaching Gold Level in the global WorldQuant Challenge®, demonstrating disciplined quantitative alpha signal generation and mathematical problem-solving.',
    tags: ['Quantitative Finance', 'WorldQuant BRAIN', 'Gold Level'],
  },
  {
    id: 'hacktoberfest-2026',
    issuer: 'Hacktoberfest (MLH × DEV × DigitalOcean)',
    title: 'Hacktoberfest 2026',
    subtitle: 'Certificate of Attendance — Hack Day Sonipat',
    authority: 'The Hacktoberfest Team',
    date: 'October 31, 2026',
    image: '/assets/certificates/hacktoberfest-2026.png',
    pdfUrl: '/assets/aistudio/HacktoberFest_Certificate_9daf99fa.pdf',
    summary:
      'Attended Hacktoberfest Hack Day Sonipat × Rishihood University in person on October 31, 2026, contributing to open-source software and engineering collaboration.',
    tags: ['Open Source', 'Hack Day', 'Rishihood University'],
  },
];
