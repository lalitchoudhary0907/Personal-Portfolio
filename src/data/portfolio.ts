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
      id: 'proj-docdrift',
      title: 'DocDrift',
      tagline: 'Automated Documentation Drift Detection',
      category: 'AI & Developer Tools',
      role: 'Co-Creator / Developer (Team Midnight Commit)',
      team: 'Midnight Commit',
      repoUrl: 'https://github.com/lalitchoudhary0907/MidnightCommit-Hacktoberfest2026',
      verifiedRepo: true,
      statusBadge: 'Verified Repo (Team Midnight Commit)',
      description:
        'Engineered by team "Midnight Commit" at Hacktoberfest 2026 Hack Day Sonipat x Rishihood University (Problem Statement 05) to automatically detect discrepancies and semantic drift between evolving codebases and technical documentation.',
      highlights: [
        'Parses AST structures and Git diffs to detect discrepancies between function signatures and docs',
        'Leverages open-weight Qwen 3.5 (4B) local LLM inference to automatically generate doc updates',
        'Developed and presented as Team "Midnight Commit" during the Hacktoberfest 2026 Hack Day',
      ],
      tags: ['Python', 'Qwen 3.5 (4B)', 'Git Diff', 'AST Analysis', 'Developer Tools', 'Automation'],
      verificationStatus: 'verified',
      confirmationNote: 'Verified repository and hackathon project. Codebase available on GitHub (MidnightCommit-Hacktoberfest2026).',
    },
    {
      id: 'proj-corealert',
      title: 'CoreAlert',
      tagline: 'Emergency SOS & Distress Telemetry System',
      category: 'Mobile & Safety Systems',
      role: 'Creator / System Architect',
      statusBadge: 'In Active Development (Private)',
      verifiedRepo: false,
      description:
        'A mission-critical emergency SOS application designed for rapid distress alerting, instantaneous device location sharing, and high-reliability responder dispatch workflows.',
      highlights: [
        'Rapid-trigger distress signal dispatch mechanism designed for minimal user interaction',
        'Telemetry packaging engineered for resilient transmission over low-bandwidth conditions',
        'Fail-safe architecture oriented toward personal safety and emergency responder workflows',
      ],
      tags: ['Mobile Systems', 'Emergency SOS', 'Geolocation', 'Telemetry', 'Safety Architecture'],
      verificationStatus: 'verified',
      confirmationNote: 'Project title, concept, and telemetry architecture verified. Repository is currently maintained in private development.',
    },
    {
      id: 'proj-vastrago',
      title: 'VastraGo',
      tagline: 'AI Fashion & Bespoke Tailoring Marketplace',
      category: 'Architecture & Concepts',
      role: 'Product Architect & System Designer',
      isConcept: true,
      conceptLabel: 'System Concept & Architecture',
      statusBadge: 'Verified System Concept',
      verifiedRepo: false,
      description:
        'An intelligent platform concept bridging personalized digital fashion recommendations with local artisanal tailoring, empowering custom apparel fitting through AI assistance.',
      highlights: [
        'Architectural blueprint for AI-guided measurement estimation and custom garment fitting',
        'Decentralized local artisan network connecting verified master tailors directly with clients',
        'Preserves traditional craft heritage while modernizing bespoke garment ordering workflows',
      ],
      tags: ['System Concept', 'Applied AI', 'Marketplace Architecture', 'Fashion Tech', 'Design Spec'],
      verificationStatus: 'verified',
      confirmationNote: 'Concept and architectural model verified under the name VastraGo (formerly StitchAI). Labeled as a concept project.',
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
      id: 'achieve-worldquant-silver',
      title: 'WorldQuant BRAIN Silver Level',
      issuer: 'WorldQuant BRAIN',
      category: 'Quant & Algorithmic Challenge',
      level: 'Silver Milestone',
      credentialBadge: 'Silver Level Milestone',
      hasGenuineFile: false,
      pendingUploadNote: 'Milestone Verified · Official Certificate PDF Pending Upload',
      summary:
        'Achieved Silver Level milestone in the WorldQuant Challenge®, developing predictive financial alpha signals and statistical algorithms.',
      verificationStatus: 'verified',
      milestoneOrder: 2,
    },
    {
      id: 'achieve-worldquant-bronze',
      title: 'WorldQuant BRAIN Bronze Level',
      issuer: 'WorldQuant BRAIN',
      category: 'Quant & Algorithmic Challenge',
      level: 'Bronze Milestone',
      credentialBadge: 'Bronze Level Milestone',
      hasGenuineFile: false,
      pendingUploadNote: 'Milestone Verified · Official Certificate PDF Pending Upload',
      summary:
        'Reached Bronze Level milestone in the WorldQuant Challenge®, marking the initial benchmark in quantitative research and alpha construction.',
      verificationStatus: 'verified',
      milestoneOrder: 3,
    },
    {
      id: 'achieve-hacktoberfest-2026',
      title: 'Hacktoberfest Hack Day Sonipat In-Person Attendee',
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
      milestoneOrder: 4,
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
