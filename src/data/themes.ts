/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ColorPart {
  name: string;
  hex: string;
  role: string;
  description: string;
  percentage: string;
}

export interface ThemeOption {
  id: 'auros' | 'cyan' | 'emerald' | 'violet' | 'amber';
  name: string;
  tagline: string;
  vibe: string;
  bestFor: string;
  contrastRatio: string;
  primary: ColorPart;
  secondary: ColorPart;
  accent: ColorPart;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'auros',
    name: 'Auros: Abyssal Terminal',
    tagline: 'Near-black teal canvas with bioluminescent data orbs & aurora gradient',
    vibe: 'Abyssal fintech & trading terminal: depth-of-water surface stack, matter typography, bioluminescent data orbs.',
    bestFor: 'CS & AI Developers, Quantitative Researchers, Modern Systems Engineers',
    contrastRatio: '16.4:1 (AAA High Contrast)',
    primary: {
      name: 'Liquid Abyss',
      hex: '#012624',
      role: 'Primary (Canvas & Atmosphere)',
      description: 'Near-black teal canvas establishing the deep-water cinematic atmosphere',
      percentage: '65%',
    },
    secondary: {
      name: 'Liquid Kelp & Platinum',
      hex: '#003734 / #FFFFFF',
      role: 'Secondary (Surface Lift & Headings)',
      description: 'Raised kelp card surfaces (16px radius, no shadow) with pure platinum headings and silver mist copy',
      percentage: '25%',
    },
    accent: {
      name: 'Bioluminescent Aurora & Phosphor',
      hex: '#CBFFFC / #FDE9FF',
      role: 'Accent (Aurora CTA & Stat Glow)',
      description: 'Cyan-to-pink aurora pill button, lavender-phosphor stats, and floating data orb particles',
      percentage: '10%',
    },
  },
  {
    id: 'cyan',
    name: 'Option 1: Electric Cyber',
    tagline: 'Modern AI Terminal & High-Tech Quantitative Engineering',
    vibe: 'Cutting-edge developer systems, artificial intelligence, precision code.',
    bestFor: 'AI Engineers, Full-Stack Developers, Modern Tech Students',
    contrastRatio: '14.8:1 (AAA High Contrast)',
    primary: {
      name: 'Obsidian Deep',
      hex: '#08090D',
      role: 'Primary (Base & Void)',
      description: 'Absorbs light, creates infinite depth for glowing particles & code terminal',
      percentage: '65%',
    },
    secondary: {
      name: 'Ghost Slate & Ice White',
      hex: '#0E131E / #F0F6FC',
      role: 'Secondary (Surfaces & Typography)',
      description: 'Elevated dark cards with sharp, fatigue-free off-white text',
      percentage: '25%',
    },
    accent: {
      name: 'Electric Cyan',
      hex: '#00F2FE',
      role: 'Accent (Focal Signal & Energy)',
      description: 'High-visibility signals for active states, magnetic links & scroll progress',
      percentage: '10%',
    },
  },
  {
    id: 'emerald',
    name: 'Option 2: Matrix Emerald',
    tagline: 'Algorithmic Systems & Quantitative Finance Core',
    vibe: 'High-speed signal processing, Linux kernel, algorithmic alpha generation.',
    bestFor: 'Quant Developers, Algorithmic Problem Solvers, Linux & Open Source Enthusiasts',
    contrastRatio: '15.6:1 (AAA High Contrast)',
    primary: {
      name: 'Abyssal Jade',
      hex: '#060A08',
      role: 'Primary (Base & Void)',
      description: 'Ultra-deep organic black with faint green undertones for trading terminal focus',
      percentage: '65%',
    },
    secondary: {
      name: 'Graphite Forest & Chalk Mint',
      hex: '#0C1510 / #E6F4EA',
      role: 'Secondary (Surfaces & Typography)',
      description: 'Frosted jade-tinted surfaces with natural mint-white typography',
      percentage: '25%',
    },
    accent: {
      name: 'Hyper Emerald',
      hex: '#00FF9D',
      role: 'Accent (Focal Signal & Energy)',
      description: 'Laser-focused algorithmic green echoing WorldQuant Gold achievement',
      percentage: '10%',
    },
  },
  {
    id: 'violet',
    name: 'Option 3: Midnight Tokyo',
    tagline: 'Creative Engineering & High-End Tech Studio',
    vibe: 'Atmospheric, artistic, memorable, and distinctive personal branding.',
    bestFor: 'Creative Technologists, Product Engineers, Tech Studio Founders',
    contrastRatio: '13.9:1 (AAA High Contrast)',
    primary: {
      name: 'Pitch Violet',
      hex: '#090710',
      role: 'Primary (Base & Void)',
      description: 'Deep midnight obsidian with subtle cosmic violet saturation',
      percentage: '65%',
    },
    secondary: {
      name: 'Dark Iris & Lilac White',
      hex: '#130F20 / #F3EEFA',
      role: 'Secondary (Surfaces & Typography)',
      description: 'Rich dark violet glass containers with soft lilac typography',
      percentage: '25%',
    },
    accent: {
      name: 'Neon Ultraviolet',
      hex: '#A855F7',
      role: 'Accent (Focal Signal & Energy)',
      description: 'Electric violet-magenta spark for marquee ribbons and glowing cursor',
      percentage: '10%',
    },
  },
  {
    id: 'amber',
    name: 'Option 4: Titanium Monolith',
    tagline: 'Industrial Minimalism & Precision Hardware',
    vibe: 'Clean, distraction-free, executive engineering, and warm optical clarity.',
    bestFor: 'Software Architects, Systems Engineers, Minimalist Purists',
    contrastRatio: '14.2:1 (AAA High Contrast)',
    primary: {
      name: 'True Carbon',
      hex: '#0B0B0C',
      role: 'Primary (Base & Void)',
      description: 'Neutral matte black surface that eliminates distractions entirely',
      percentage: '65%',
    },
    secondary: {
      name: 'Zinc Slate & Pure Off-White',
      hex: '#161618 / #F5F5F7',
      role: 'Secondary (Surfaces & Typography)',
      description: 'Crisp industrial charcoal cards with crystal-clear white body text',
      percentage: '25%',
    },
    accent: {
      name: 'Solar Amber',
      hex: '#F59E0B',
      role: 'Accent (Focal Signal & Energy)',
      description: 'Warm glowing amber spark inspired by vacuum tubes and compiler warnings',
      percentage: '10%',
    },
  },
];
