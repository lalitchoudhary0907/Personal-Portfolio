/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SiteConfig } from '../types';
import { portfolioData } from '../data/portfolio';

export const siteConfig: SiteConfig = {
  name: portfolioData.personalInfo.fullName,
  title: `${portfolioData.personalInfo.fullName} | CS & AI Student & Aspiring Software Engineer`,
  description: `Production-oriented personal portfolio for ${portfolioData.personalInfo.fullName}, BTech Computer Science & AI student at Newton School of Technology, Rishihood University.`,
  url: 'https://lalitchoudhary.dev',
  profile: {
    name: portfolioData.personalInfo.fullName,
    tagline: 'Building intelligent software systems at the intersection of AI, robust architecture, and delightful craft.',
    role: portfolioData.personalInfo.role,
    university: `${portfolioData.education[0].institution}, ${portfolioData.education[0].university}`,
    degree: `${portfolioData.education[0].degree} in ${portfolioData.education[0].fieldOfStudy}`,
    location: portfolioData.personalInfo.location,
    availability: 'Open for Software Engineering & AI Internships & Projects',
    bioShort: portfolioData.personalInfo.summary,
  },
  navItems: [
    { title: 'Home', href: '#home' },
    { title: 'About', href: '#about' },
    { title: 'Skills', href: '#skills' },
    { title: 'Projects', href: '#projects' },
    { title: 'GitHub', href: '#github' },
    { title: 'Achievements', href: '#achievements' },
    { title: 'Contact', href: '#contact' },
  ],
  socialLinks: [
    portfolioData.personalInfo.socials.github,
    portfolioData.personalInfo.socials.linkedin,
    {
      name: 'Email',
      url: `mailto:${portfolioData.personalInfo.email}`,
      iconName: 'mail',
      verified: true,
    },
  ],
};
