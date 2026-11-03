/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VerificationStatus = 'verified' | 'pending_confirmation';

export interface BaseRecord {
  id: string;
  verificationStatus: VerificationStatus;
  confirmationNote?: string;
}

export interface NavItem {
  title: string;
  href: string;
  isExternal?: boolean;
}

export interface SocialLink {
  name: string;
  url: string;
  iconName: string;
  handle?: string;
  verified: boolean;
}

export interface EducationEntry extends BaseRecord {
  degree: string;
  fieldOfStudy: string;
  institution: string;
  university: string;
  location: string;
  status: string;
  expectedGraduationYear?: number;
}

export interface TechnicalInterest {
  category: string;
  topics: string[];
  description: string;
  verified: boolean;
}

export interface ProjectEntry extends BaseRecord {
  title: string;
  tagline: string;
  description: string;
  role: string;
  team?: string;
  category: 'AI & Developer Tools' | 'Mobile & Safety Systems' | 'Architecture & Concepts' | string;
  highlights: string[];
  tags: string[];
  repoUrl?: string;
  demoUrl?: string;
  isConcept?: boolean;
  conceptLabel?: string;
  statusBadge?: string;
  verifiedRepo?: boolean;
  verifiedDemo?: boolean;
  architectureNotes?: string[];
  metrics?: { label: string; value: string }[];
}

export interface GitHubRepoItem {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  pushed_at?: string;
  topics?: string[];
  is_fork: boolean;
  visibility?: string;
}

export interface GitHubUserProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubEventItem {
  id: string;
  type: string;
  repo_name: string;
  repo_url: string;
  created_at: string;
  action_summary: string;
  ref_type?: string;
  ref_name?: string;
  commit_count?: number;
}

export interface GitHubLanguageStat {
  language: string;
  count: number;
  percentage: number;
  color: string;
}

export interface GitHubApiResponse {
  repos: GitHubRepoItem[];
  fetchedAt: string;
  source: 'server_cache' | 'github_live' | 'fallback_snapshot';
  rateLimitRemaining?: number;
  error?: string;
}

export interface GitHubActivityApiResponse {
  profile: GitHubUserProfile;
  repos: GitHubRepoItem[];
  events: GitHubEventItem[];
  languages: GitHubLanguageStat[];
  fetchedAt: string;
  source: 'server_cache' | 'github_live' | 'fallback_snapshot';
  rateLimitRemaining: number;
  rateLimitReset?: number;
  error?: string;
}

export interface AchievementEntry extends BaseRecord {
  title: string;
  issuer: string;
  category: 'Quant & Algorithmic Challenge' | 'Open Source & Hackathon' | string;
  level?: string;
  date?: string;
  certificatePath?: string;
  summary: string;
  authority?: string;
  hasGenuineFile: boolean;
  fileType?: 'pdf' | 'image';
  fileSize?: string;
  verificationUrl?: string;
  pendingUploadNote?: string;
  credentialBadge?: string;
  milestoneOrder?: number;
}

export interface PendingConfirmationItem {
  field: string;
  context: string;
  suggestedPrompt: string;
}

export type SkillCategory =
  | 'All'
  | 'Programming'
  | 'Frontend Development'
  | 'Backend Development'
  | 'AI/ML Tools'
  | 'Developer Tools'
  | 'Version Control';

export interface SkillItem {
  id: string;
  name: string;
  category: Exclude<SkillCategory, 'All'>;
  description: string;
  iconName: string;
  isConfirmed: boolean;
  highlight?: boolean;
}

export interface PortfolioData {
  personalInfo: {
    fullName: string;
    role: string;
    headline: string;
    summary: string;
    location: string;
    email: string;
    resumeUrl?: string;
    socials: {
      github: SocialLink;
      linkedin: SocialLink;
    };
    interests: TechnicalInterest[];
  };
  education: EducationEntry[];
  projects: ProjectEntry[];
  achievements: AchievementEntry[];
  pendingConfirmations: PendingConfirmationItem[];
}

export interface SiteProfile {
  name: string;
  tagline: string;
  role: string;
  university: string;
  degree: string;
  location: string;
  availability: string;
  bioShort: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  profile: SiteProfile;
  navItems: NavItem[];
  socialLinks: SocialLink[];
}
