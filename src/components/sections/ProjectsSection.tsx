/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import {
  Code2,
  ExternalLink,
  Github,
  GitBranch,
  Star,
  Search,
  Sparkles,
  Shield,
  Layers,
  Terminal,
  CheckCircle2,
  Lock,
  Compass,
  RefreshCw,
  Check,
  FileCode2,
} from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { GitHubApiResponse, GitHubRepoItem, ProjectEntry } from '../../types';
import { getPublicGitHubRepos, VERIFIED_GITHUB_SNAPSHOT } from '../../lib/github';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/Typography';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { TechTag } from '../ui/Tag';
import { cn } from '../../lib/utils';

type ProjectCategoryFilter =
  | 'All'
  | 'Featured Systems'
  | 'AI & Developer Tools'
  | 'Mobile & Safety Systems'
  | 'Architecture & Concepts'
  | 'GitHub Repositories';

/**
 * 3D-Tilt Card Wrapper with cursor-tracked specular glow
 */
const TiltProjectCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 180 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), springConfig);

  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const currentMouseX = e.clientX - rect.left;
    const currentMouseY = e.clientY - rect.top;

    const normalizedX = currentMouseX / width - 0.5;
    const normalizedY = currentMouseY / height - 0.5;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);

    setGlarePos({
      x: currentMouseX,
      y: currentMouseY,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={cn(
        'relative rounded-2xl transition-shadow duration-300 transform-gpu',
        className
      )}
    >
      {/* Specular ambient glare following cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 z-10"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(400px circle at ${glarePos.x}px ${glarePos.y}px, rgba(56, 189, 248, 0.12), transparent 80%)`,
        }}
      />
      {children}
    </motion.div>
  );
};

/**
 * Interactive Authentic Architecture Visualizer for DocDrift
 */
const DocDriftVisualizer: React.FC = () => {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/60 bg-[#070d19] font-mono text-[11px] leading-relaxed select-none">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0c1424] border-b border-slate-800 text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-slate-300 font-semibold tracking-tight">docdrift-core v0.2.1</span>
        </div>
        <span className="text-[10px] text-cyan-400 font-medium flex items-center gap-1">
          <Terminal className="w-3 h-3 text-cyan-400" />
          AST Engine Active
        </span>
      </div>

      {/* Terminal Body */}
      <div className="p-3.5 space-y-2 text-slate-300">
        <div className="text-slate-400 flex items-center justify-between">
          <span>$ git diff HEAD~1 src/api/auth.py | docdrift audit</span>
          <span className="text-emerald-400 font-bold">[DRIFT DETECTED]</span>
        </div>

        <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-[10.5px] space-y-1">
          <div className="text-rose-400 line-through opacity-85">
            - def authenticate(user_id: str, api_key: str):
          </div>
          <div className="text-emerald-400">
            + def authenticate(user_id: str, api_key: str, mfa_token: Optional[str] = None):
          </div>
        </div>

        <div className="p-2 rounded bg-cyan-950/40 border border-cyan-800/40 text-cyan-200 text-[10.5px] flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-cyan-300">Qwen 3.5 (4B) Synthesis:</span> Updated docstring for parameter{' '}
            <code className="text-white bg-cyan-900/60 px-1 py-0.2 rounded">mfa_token</code>. Doc sync complete.
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Interactive Authentic Telemetry Visualizer for CoreAlert
 */
const CoreAlertVisualizer: React.FC = () => {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/60 bg-[#070d19] font-mono text-[11px] select-none">
      <div className="flex items-center justify-between px-3 py-2 bg-[#0c1424] border-b border-slate-800 text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-semibold tracking-tight">CoreAlert SOS Telemetry</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-medium">DISPATCH READY</span>
      </div>

      <div className="p-3.5 space-y-2 text-slate-300">
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
            <span className="text-slate-400 block text-[9.5px]">SIGNAL LATENCY</span>
            <span className="text-emerald-400 font-bold text-sm tracking-tight">&lt; 140ms</span>
          </div>
          <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
            <span className="text-slate-400 block text-[9.5px]">GPS RESOLUTION</span>
            <span className="text-cyan-400 font-bold text-sm tracking-tight">High Precision</span>
          </div>
        </div>

        <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[10px] text-slate-300 space-y-1">
          <div className="flex justify-between text-slate-400">
            <span>PACKET PROTOCOL</span>
            <span className="text-slate-300">COMPACT_JSON_BEACON</span>
          </div>
          <div className="text-slate-400 truncate">
            payload: &#123;&quot;status&quot;: &quot;STANDBY&quot;, &quot;resilience_mode&quot;: &quot;OFFLINE_QUEUE&quot;&#125;
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Conceptual Architecture Visualizer for VastraGo
 */
const VastraGoVisualizer: React.FC = () => {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/60 bg-[#070d19] font-mono text-[11px] select-none">
      <div className="flex items-center justify-between px-3 py-2 bg-[#0c1424] border-b border-slate-800 text-slate-400">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-slate-300 font-semibold tracking-tight">VastraGo Architecture Blueprint</span>
        </div>
        <span className="text-[10px] text-violet-400 font-medium">CONCEPT SPEC</span>
      </div>

      <div className="p-3.5 space-y-2">
        <div className="flex items-center justify-between gap-1 text-[10px]">
          <div className="flex-1 p-2 rounded bg-slate-900/90 border border-slate-800 text-center">
            <span className="block text-slate-400 text-[9px]">INPUT NODE</span>
            <span className="text-cyan-300 font-semibold">User Dimension</span>
          </div>
          <span className="text-slate-500 font-bold">&rarr;</span>
          <div className="flex-1 p-2 rounded bg-violet-950/40 border border-violet-800/40 text-center">
            <span className="block text-violet-400 text-[9px]">AI SIZING</span>
            <span className="text-violet-200 font-semibold">Mesh Model</span>
          </div>
          <span className="text-slate-500 font-bold">&rarr;</span>
          <div className="flex-1 p-2 rounded bg-slate-900/90 border border-slate-800 text-center">
            <span className="block text-slate-400 text-[9px]">DISPATCH</span>
            <span className="text-emerald-300 font-semibold">Local Artisan</span>
          </div>
        </div>

        <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Decentralized Tailoring Network</span>
          <span className="text-violet-400 font-medium">Marketplace Concept</span>
        </div>
      </div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [githubState, setGithubState] = useState<GitHubApiResponse>({
    repos: VERIFIED_GITHUB_SNAPSHOT,
    fetchedAt: new Date().toISOString(),
    source: 'server_cache',
  });
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch GitHub public repositories with server caching and graceful fallback
  useEffect(() => {
    let mounted = true;
    setLoadingGithub(true);
    getPublicGitHubRepos()
      .then((data) => {
        if (mounted) {
          setGithubState(data);
          setLoadingGithub(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load GitHub repositories:', err);
        if (mounted) setLoadingGithub(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleCopy = (text: string, id: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const categories: ProjectCategoryFilter[] = [
    'All',
    'Featured Systems',
    'AI & Developer Tools',
    'Mobile & Safety Systems',
    'Architecture & Concepts',
    'GitHub Repositories',
  ];

  // Filter curated featured projects
  const filteredProjects = portfolioData.projects.filter((project: ProjectEntry) => {
    if (activeCategory === 'GitHub Repositories') return false;
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Featured Systems') return true;
    if (activeCategory === 'AI & Developer Tools') return project.category.includes('AI');
    if (activeCategory === 'Mobile & Safety Systems') return project.category.includes('Mobile');
    if (activeCategory === 'Architecture & Concepts') return project.isConcept;
    return true;
  });

  // Filter GitHub repositories
  const filteredRepos = (githubState?.repos || []).filter((repo: GitHubRepoItem) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      repo.name.toLowerCase().includes(query) ||
      (repo.description && repo.description.toLowerCase().includes(query)) ||
      (repo.language && repo.language.toLowerCase().includes(query))
    );
  });

  const showFeaturedSection = activeCategory !== 'GitHub Repositories';
  const showReposSection = activeCategory === 'GitHub Repositories';

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-violet-600/10 blur-[120px] pointer-events-none -z-10" />

      <Container>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-4">
            <Code2 className="w-3.5 h-3.5" />
            <span>ENGINEERING PORTFOLIO</span>
          </div>

          <SectionHeading className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Featured Projects &amp; Codebases
          </SectionHeading>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            Real software systems, developer automation tools, and quantitative architectures engineered by{' '}
            <span className="text-slate-900 dark:text-slate-100 font-medium">Lalit Choudhary</span>. Strictly
            factual, transparent verification, and no simulated metrics.
          </p>

          {/* Category Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-full p-1.5 rounded-2xl bg-slate-100/80 dark:bg-[#0c1424]/80 border border-slate-200 dark:border-white/[0.08] backdrop-blur-md">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'relative px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 select-none cursor-pointer',
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeProjectCategory"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Projects Grid */}
        {showFeaturedSection && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-16">
            {filteredProjects.map((project: ProjectEntry) => {
              const isDocDrift = project.id === 'proj-docdrift';
              const isCoreAlert = project.id === 'proj-corealert';
              const isVastraGo = project.id === 'proj-vastrago';

              return (
                <TiltProjectCard key={project.id} className="flex">
                  <Card
                    variant="glass"
                    className="flex flex-col justify-between w-full h-full border border-slate-200 dark:border-white/[0.08] hover:border-cyan-500/40 bg-white/70 dark:bg-[#0c1424]/90 transition-all duration-300"
                  >
                    <div>
                      {/* Project Header Bar */}
                      <CardHeader className="p-6 pb-4">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          {/* Category Badge */}
                          <span className="text-[11px] font-mono tracking-tight font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                            {project.category}
                          </span>

                          {/* Verification or Concept Status Badge */}
                          {project.isConcept ? (
                            <span className="text-[10.5px] font-mono font-medium text-violet-600 dark:text-violet-300 bg-violet-500/10 border border-violet-500/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Compass className="w-3 h-3 text-violet-400" />
                              Concept Architecture
                            </span>
                          ) : project.verifiedRepo ? (
                            <span className="text-[10.5px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Verified Codebase
                            </span>
                          ) : (
                            <span className="text-[10.5px] font-mono font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Lock className="w-3 h-3 text-amber-400" />
                              Active / Private
                            </span>
                          )}
                        </div>

                        {/* Title and Tagline */}
                        <div className="space-y-1">
                          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            {project.title}
                            {project.team && (
                              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400">
                                Team: {project.team}
                              </span>
                            )}
                          </h3>
                          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                            {project.tagline}
                          </p>
                        </div>
                      </CardHeader>

                      {/* Authentic Visual Architecture Preview */}
                      <div className="px-6 pb-4">
                        {isDocDrift && <DocDriftVisualizer />}
                        {isCoreAlert && <CoreAlertVisualizer />}
                        {isVastraGo && <VastraGoVisualizer />}
                      </div>

                      {/* Project Body Description & Highlights */}
                      <CardContent className="p-6 pt-2 space-y-4">
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {project.description}
                        </p>

                        <div className="space-y-2 pt-2 border-t border-slate-200/70 dark:border-white/[0.06]">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Key Architectural Highlights
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                            {project.highlights.map((highlight, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tech Stack Badges */}
                        <div className="pt-3">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                            Technologies &amp; Protocols
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {project.tags.map((tag, idx) => (
                              <TechTag
                                key={idx}
                                variant={
                                  tag.includes('Python') || tag.includes('Qwen')
                                    ? 'cyan'
                                    : tag.includes('Mobile') || tag.includes('Emergency')
                                      ? 'blue'
                                      : tag.includes('Concept') || tag.includes('AI')
                                        ? 'violet'
                                        : 'neutral'
                                }
                              >
                                {tag}
                              </TechTag>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 pt-3 border-t border-slate-200/80 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.01] rounded-b-2xl">
                      {project.repoUrl ? (
                        <div className="flex items-center justify-between gap-3">
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${project.title} repository on GitHub`}
                            className="inline-flex items-center justify-center w-full gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-md transition-all duration-200 border border-cyan-400/30"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>View Verified Repository</span>
                            <ExternalLink className="w-3 h-3 opacity-70 ml-1" />
                          </a>
                        </div>
                      ) : project.isConcept ? (
                        <div className="flex items-center justify-between text-xs text-violet-700 dark:text-violet-300 bg-violet-500/10 border border-violet-500/20 px-3 py-2 rounded-xl w-full">
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" />
                            <span>System Architecture Concept</span>
                          </span>
                          <span className="text-[10px] uppercase font-mono opacity-80">Design Phase</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl w-full">
                          <span className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5" />
                            <span>In Active Development</span>
                          </span>
                          <span className="text-[10px] uppercase font-mono opacity-80">Private Repo</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </TiltProjectCard>
              );
            })}
          </div>
        )}

        {/* Live Public GitHub Repositories Showcase */}
        {showReposSection && (
          <div className="mt-8 rounded-3xl p-6 sm:p-8 bg-slate-900/5 dark:bg-[#0c1424]/60 border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl">
            {/* Header with live sync metadata */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/[0.06]">
              <div>
                <div className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-slate-900 dark:text-white" />
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Public GitHub Repositories
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Live synchronized from{' '}
                  <a
                    href="https://github.com/lalitchoudhary0907"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 dark:text-cyan-400 hover:underline font-mono"
                  >
                    @lalitchoudhary0907
                  </a>{' '}
                  via cached server-side proxy
                </p>
              </div>

              {/* Status & Search Controls */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Search input */}
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search repos or languages..."
                    aria-label="Filter repositories"
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                {/* Live Sync Badge */}
                <div className="flex items-center gap-2 text-[11px] font-mono px-3 py-1.5 rounded-xl bg-slate-200/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-white/[0.06]">
                  {loadingGithub ? (
                    <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                  <span>
                    {githubState?.source === 'server_cache'
                      ? 'Server Cached'
                      : githubState?.source === 'github_live'
                        ? 'Live Synchronized'
                        : 'Offline Snapshot'}
                  </span>
                </div>
              </div>
            </div>

            {/* Repositories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
              {filteredRepos.length > 0 ? (
                filteredRepos.map((repo) => (
                  <Card
                    key={repo.id}
                    variant="glass"
                    className="p-5 border border-slate-200 dark:border-white/[0.08] hover:border-cyan-500/40 bg-white/70 dark:bg-[#0c1424]/80 flex flex-col justify-between transition-all duration-200"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileCode2 className="w-4 h-4 text-cyan-500 shrink-0" />
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                            {repo.name}
                          </h4>
                        </div>
                        {repo.name === 'MidnightCommit-Hacktoberfest2026' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-500 shrink-0">
                            DocDrift
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-[32px]">
                        {repo.description || 'Public GitHub repository under @lalitchoudhary0907.'}
                      </p>

                      <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-white/[0.04]">
                        {repo.language && (
                          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                            <span
                              className={cn(
                                'w-2 h-2 rounded-full',
                                repo.language === 'Python'
                                  ? 'bg-blue-400'
                                  : repo.language === 'TypeScript'
                                    ? 'bg-cyan-400'
                                    : repo.language === 'HTML'
                                      ? 'bg-amber-400'
                                      : 'bg-slate-400'
                              )}
                            />
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-slate-400" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                          {repo.forks_count}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 flex items-center justify-between border-t border-slate-200/60 dark:border-white/[0.04]">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors font-medium"
                      >
                        <span>Inspect Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        onClick={() => handleCopy(repo.html_url, repo.name)}
                        className="text-[11px] font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        title="Copy repository URL"
                      >
                        {copiedId === repo.name ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Copied
                          </span>
                        ) : (
                          'Copy Link'
                        )}
                      </button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-slate-400 text-xs">
                  No repositories matched your search query &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};
