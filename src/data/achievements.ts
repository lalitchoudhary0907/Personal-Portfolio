/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AchievementMilestone {
  id: string;
  issuer: string;
  tier: 'Bronze' | 'Silver' | 'Gold';
  title: string;
  year: string;
  image: string;
  verificationUrl: string;
}

export const achievements: AchievementMilestone[] = [
  {
    id: 'worldquant-bronze',
    issuer: 'WorldQuant BRAIN',
    tier: 'Bronze',
    title: 'Bronze Milestone',
    year: '',
    image: '',
    verificationUrl: '',
  },
  {
    id: 'worldquant-silver',
    issuer: 'WorldQuant BRAIN',
    tier: 'Silver',
    title: 'Silver Milestone',
    year: '',
    image: '',
    verificationUrl: '',
  },
  {
    id: 'worldquant-gold',
    issuer: 'WorldQuant BRAIN',
    tier: 'Gold',
    title: 'Gold Milestone',
    year: '',
    image: '',
    verificationUrl: '',
  },
];
