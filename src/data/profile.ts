/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProfileData {
  name: string;
  tagline: string;
  educationLabel: string;
  photo?: string;
  aboutText: string;
  education: {
    degree: string;
    institution: string;
    university: string;
  };
  contact: {
    email: string;
    linkedin: string;
    github: string;
  };
  bio: string;
}

export const profile: ProfileData = {
  name: 'Lalit Choudhary',
  tagline: 'Computer Science & AI student. Building software with intent.',
  educationLabel: 'BTECH CSAI — NEWTON SCHOOL OF TECHNOLOGY, RISHIHOOD UNIVERSITY',
  photo: '',
  aboutText:
    'Pursuing a BTech in Computer Science & Artificial Intelligence at Newton School of Technology, Rishihood University. Focused on software engineering, artificial intelligence, web development, and open source.',
  education: {
    degree: 'BTech Computer Science & Artificial Intelligence',
    institution: 'Newton School of Technology',
    university: 'Rishihood University',
  },
  contact: {
    email: 'lalitchoudhary0907@gmail.com',
    linkedin: 'https://www.linkedin.com/in/lalitchoudhary0907',
    github: 'https://github.com/lalitchoudhary0907',
  },
  bio: '',
};
