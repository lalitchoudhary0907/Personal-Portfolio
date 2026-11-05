/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PortfolioData } from '../types';

/**
 * Centralized, strongly typed portfolio data for Lalit Choudhary.
 * 
 * Strict Data Governance:
 * - Every record explicitly declares its `verificationStatus` ('verified' vs 'pending_confirmation').
 * - No fictitious companies, dates, GPA, or fake external URLs are introduced.
 * - External assets reference verified local certificate files provided in the workspace.
 */
export const portfolioData: PortfolioData = {
  personalInfo: {
    fullName: 'Lalit Choudhary',
    role: 'BTech Computer Science & AI Student, Aspiring Software Engineer',
    headline: 'BTech CS & AI student focused on software engineering, intelligent systems, and open-source tooling.',
    summary:
      'Computer Science & Artificial Intelligence undergraduate at Newton School of Technology (Rishihood University). Focused on building reliable software systems, applied machine learning workflows, and developer-centric tooling. Active quantitative researcher with Gold level recognition in the WorldQuant Challenge and open-source contributor.',
    location: 'India',
    email: 'lalitchoudhary0907@gmail.com',
    socials: {
      github: {
        name: 'GitHub',
        url: 'https://github.com/lalitchoudhary0907',
        handle: 'lalitchoudhary0907',
        iconName: 'github',
        verified: true,
      },
      linkedin: {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/lalitchoudhary0907',
        handle: 'in/lalitchoudhary0907',
        iconName: 'linkedin',
        verified: true,
      },
    },
    interests: [
      {
        category: 'Core Engineering',
        topics: ['Software Engineering', 'Python Programming', 'Web Development'],
        description: 'Architecting robust full-stack applications, scalable backend logic, and clean software interfaces.',
        verified: true,
      },
      {
        category: 'Artificial Intelligence',
        topics: ['Artificial Intelligence', 'Machine Learning', 'AI-Powered Developer Tools'],
        description: 'Applying intelligent models and heuristic workflows to solve developer productivity and marketplace challenges.',
        verified: true,
      },
      {
        category: 'Collaboration & Community',
        topics: ['Open-Source Development', 'Git & GitHub'],
        description: 'Engaging with the global open-source community, maintaining version control discipline, and peer code collaboration.',
        verified: true,
      },
    ],
  },

  education: [
    {
      id: 'edu-nst-rishihood',
      degree: 'Bachelor of Technology (BTech)',
      fieldOfStudy: 'Computer Science & Artificial Intelligence',
      institution: 'Newton School of Technology',
      university: 'Rishihood University',
      location: 'Sonipat, Haryana, India',
      status: 'Undergraduate Student (In Progress)',
      verificationStatus: 'verified',
      confirmationNote: 'Degree, field of study, and institution verified. Graduation year pending user confirmation.',
    },
  ],

  projects: [
    {
      id: 'proj-focusflow',
      title: 'FocusFlow',
      tagline: 'Modern Responsive Pomodoro Productivity Platform',
      category: 'Web Development & Productivity',
      role: 'Creator & Lead Developer',
      repoUrl: 'https://github.com/lalitchoudhary0907/FocusFlow',
      liveUrl: 'https://focus-flow-eta-six.vercel.app',
      verifiedRepo: true,
      statusBadge: 'Verified Project & Live Deployment',
      description:
        'A modern, responsive Pomodoro timer web app featuring customizable focus sessions, productivity tracking, smooth animations, and persistent local storage.',
      highlights: [
        'Customizable focus work sessions and rest cycles with audio notifications',
        'Persistent local storage integration for productivity tracking and habit consistency',
        'Lightweight, responsive UI built with modern JavaScript and clean animations',
      ],
      tags: ['JavaScript', 'HTML5', 'CSS3', 'Productivity', 'Web Development'],
      verificationStatus: 'verified',
      confirmationNote: 'Verified repository and live production deployment at focus-flow-eta-six.vercel.app.',
    },
    {
      id: 'proj-vastrago',
      title: 'VastraGo',
      tagline: 'AI Fashion & Bespoke Tailoring Marketplace',
      category: 'Architecture & Concepts',
      role: 'Product Architect & System Designer',
      isConcept: true,
      conceptLabel: 'System Concept (Under Progress)',
      statusBadge: 'Under Progress',
      verifiedRepo: false,
      description:
        'An intelligent platform concept bridging personalized digital fashion recommendations with local artisanal tailoring, empowering custom apparel fitting through AI assistance.',
      highlights: [
        'Architectural blueprint for AI-guided measurement estimation and custom garment fitting',
        'Decentralized local artisan network connecting verified master tailors directly with clients',
        'Preserves traditional craft heritage while modernizing bespoke garment ordering workflows',
      ],
      tags: ['System Concept', 'Applied AI', 'Fashion Tech', 'Under Progress'],
      verificationStatus: 'verified',
      confirmationNote: 'Concept and architectural model verified under the name VastraGo. Marked as under progress.',
    },
  ],

  achievements: [
    {
      id: 'achieve-worldquant-gold',
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
        'Awarded Certificate of Accomplishment for reaching Gold Level in the global WorldQuant Challenge®, demonstrating disciplined quantitative modeling and mathematical problem-solving.',
      verificationStatus: 'verified',
      milestoneOrder: 1,
    },
    {
      id: 'achieve-hacktoberfest-2026',
      title: 'Hacktoberfest Hack Day Sonipat Attendee',
      issuer: 'Hacktoberfest (MLH x DEV x DigitalOcean)',
      category: 'Open Source & Hackathon',
      date: 'October 31, 2026',
      credentialBadge: 'In-Person Community Milestone',
      hasGenuineFile: true,
      fileType: 'pdf',
      fileSize: '62 KB',
      certificatePath: '/assets/aistudio/HacktoberFest_Certificate_9daf99fa.pdf',
      summary:
        'Participated in-person at Hacktoberfest Hack Day Sonipat x Rishihood University on October 31, 2026, collaborating with developers on open-source repositories and community software tooling.',
      verificationStatus: 'verified',
      milestoneOrder: 2,
    },
  ],

  pendingConfirmations: [
    {
      field: 'projects.coreAlertRepo',
      context: 'CoreAlert emergency SOS application',
      suggestedPrompt: 'When you are ready, share if there is a public repository or test deployment for CoreAlert.',
    },
    {
      field: 'projects.vastragoPrototype',
      context: 'VastraGo marketplace prototype',
      suggestedPrompt: 'Do you have architectural diagrams or an active prototype repository for VastraGo?',
    },
    {
      field: 'education.graduationYear',
      context: 'Expected graduation year for BTech degree',
      suggestedPrompt: 'What is your expected graduation year at Newton School of Technology (e.g., 2027 or 2028)?',
    },
  ],
};
