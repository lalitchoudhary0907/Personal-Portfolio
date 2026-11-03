/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Github,
  GitBranch,
  Star,
  ExternalLink,
  Search,
  RefreshCw,
  GitCommit,
  GitPullRequest,
  Check,
  Code2,
  Clock,
  Users,
  BookOpen,
  AlertCircle,
  FolderGit2,
  Terminal,
  Activity,
  Layers,
} from 'lucide-react';
import { GitHubActivityApiResponse, GitHubEventItem, GitHubRepoItem } from '../../types';
import { getPublicGitHubActivity } from '../../lib/github';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/Typography';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

type ActivityTab = 'repositories' | 'languages' | 'timeline';

export const GitHubActivitySection: React.FC<{ id?: string }> = ({ id = 'github' }) => {
  const [data, setData] = useState<GitHubActivityApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActivityTab>('repositories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [copiedRepo, setCopiedRepo] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
      // Clear localStorage cache to force fresh server call
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('lc_github_activity_cache_v2');
        } catch {
          // Ignore
        }
      }
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await getPublicGitHubActivity();
      setData(response);
    } catch (err: any) {
      console.error('Failed to load GitHub activity:', err);
      setError('Unable to load GitHub activity at this moment. You can browse repositories directly on GitHub.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyLink = (url: string, name: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedRepo(name);
      setTimeout(() => setCopiedRepo(null), 2000);
    }
  };

  // Filter repositories based on search and selected language
  const filteredRepos = useMemo(() => {
    if (!data?.repos) return [];
    return data.repos.filter((repo: GitHubRepoItem) => {
      const matchesSearch =
        searchQuery === '' ||
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (repo.language && repo.language.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLanguage = selectedLanguage === 'All' || repo.language === selectedLanguage;

      return matchesSearch && matchesLanguage;
    });
  }, [data?.repos, searchQuery, selectedLanguage]);

  // Format relative time helper
  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return 'recently';
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return 'just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 2592000) return `${Math.floor(diffSec / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const availableLanguages = useMemo(() => {
    if (!data?.repos) return ['All'];
    const langs = new Set<string>();
    data.repos.forEach((r) => {
      if (r.language) langs.add(r.language);
    });
    return ['All', ...Array.from(langs)];
  }, [data?.repos]);

  return (
    <section id={id} className="py-24 relative overflow-hidden bg-slate-50/50 dark:bg-transparent">
      {/* Subtle ambient gradient backdrop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-indigo-600/10 blur-[130px] pointer-events-none -z-10" />

      <Container>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-4">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>LIVE OPEN SOURCE ACTIVITY</span>
          </div>

          <SectionHeading className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            GitHub Activity &amp; Codebases
          </SectionHeading>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            Live public repositories, language distribution, and commit events directly from{' '}
            <a
              href="https://github.com/lalitchoudhary0907"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
            >
              @lalitchoudhary0907
            </a>
            . Server-cached and verified without synthetic metrics.
          </p>

          {/* Tab Selector Controls */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-[#0c1424]/90 border border-slate-300/80 dark:border-white/[0.08] backdrop-blur-md">
            {[
              { id: 'repositories', label: 'Public Repositories', icon: BookOpen },
              { id: 'languages', label: 'Language Breakdown', icon: Layers },
              { id: 'timeline', label: 'Recent Activity', icon: GitCommit },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActivityTab)}
                  className={cn(
                    'relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 select-none cursor-pointer',
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeGitHubTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <TabIcon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Profile Card Banner */}
        {data && (
          <div className="mb-10 rounded-3xl p-6 sm:p-7 bg-white/80 dark:bg-[#0c1424]/80 border border-slate-200 dark:border-white/[0.08] shadow-sm backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* User Bio and Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={data.profile.avatar_url}
                    alt={data.profile.name || data.profile.login}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-cyan-500/40 object-cover bg-slate-800"
                    loading="lazy"
                  />
                  <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {data.profile.name || 'Lalit Choudhary'}
                    </h3>
                    <a
                      href={data.profile.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5"
                    >
                      @{data.profile.login}
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    {data.profile.bio || "B.Tech in Computer Science & Artificial Intelligence student"}
                  </p>
                </div>
              </div>

              {/* Factual Stats Summary */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full md:w-auto">
                <div className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/[0.06] text-center">
                  <span className="block text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">
                    Repositories
                  </span>
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {data.profile.public_repos}
                  </span>
                </div>

                <div className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/[0.06] text-center">
                  <span className="block text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">
                    Followers
                  </span>
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {data.profile.followers}
                  </span>
                </div>

                {/* Server Sync Status & Refresh Button */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/[0.06] text-[11px] font-mono text-slate-600 dark:text-slate-300">
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      data.source === 'github_live'
                        ? 'bg-emerald-400 animate-pulse'
                        : data.source === 'server_cache'
                          ? 'bg-cyan-400'
                          : 'bg-amber-400'
                    )}
                  />
                  <span>
                    {data.source === 'github_live'
                      ? 'Live Synced'
                      : data.source === 'server_cache'
                        ? 'Server Cache'
                        : 'Verified Snapshot'}
                  </span>
                  <button
                    onClick={() => loadData(true)}
                    disabled={isRefreshing}
                    title="Refresh data from server"
                    aria-label="Refresh GitHub activity"
                    className="ml-2 p-1 rounded-md text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin text-cyan-400')} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-slate-200/70 dark:bg-slate-800/50 border border-slate-300/50 dark:border-white/[0.06] p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-2/3" />
                  <div className="h-3 bg-slate-300/70 dark:bg-slate-700/60 rounded w-full" />
                  <div className="h-3 bg-slate-300/70 dark:bg-slate-700/60 rounded w-4/5" />
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-300/40 dark:border-slate-700/40">
                  <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-16" />
                  <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-10" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="rounded-2xl p-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-center max-w-xl mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <h4 className="text-base font-semibold text-rose-800 dark:text-rose-200 mb-1">
              GitHub Sync Notice
            </h4>
            <p className="text-xs text-rose-600 dark:text-rose-300 mb-4">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => loadData(true)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500 transition-colors"
              >
                Retry Request
              </button>
              <a
                href="https://github.com/lalitchoudhary0907"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Visit GitHub Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Content Views */}
        {!isLoading && !error && data && (
          <div>
            {/* VIEW 1: REPOSITORIES */}
            {activeTab === 'repositories' && (
              <div className="space-y-6">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white/70 dark:bg-[#0c1424]/70 border border-slate-200 dark:border-white/[0.08] backdrop-blur-md">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter by repository name, description, or language..."
                      aria-label="Filter repositories"
                      className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>

                  {/* Language Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={cn(
                          'px-3 py-1.5 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all duration-150 cursor-pointer',
                          selectedLanguage === lang
                            ? 'bg-cyan-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        )}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Repositories Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                  <AnimatePresence mode="popLayout">
                    {filteredRepos.length > 0 ? (
                      filteredRepos.map((repo) => (
                        <motion.div
                          key={repo.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="flex"
                        >
                          <Card
                            variant="glass"
                            className="p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] hover:border-cyan-500/40 bg-white/80 dark:bg-[#0c1424]/90 flex flex-col justify-between w-full transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/5 group"
                          >
                            <div className="space-y-3">
                              {/* Header: Title and Fork badge */}
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <FolderGit2 className="w-4 h-4 text-cyan-500 shrink-0 group-hover:text-cyan-400 transition-colors" />
                                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                                    {repo.name}
                                  </h4>
                                </div>
                                {repo.is_fork && (
                                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                                    Forked
                                  </span>
                                )}
                              </div>

                              {/* Description */}
                              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed min-h-[42px]">
                                {repo.description || 'Public GitHub codebase repository under @lalitchoudhary0907.'}
                              </p>

                              {/* Topics / Badges */}
                              {repo.topics && repo.topics.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {repo.topics.slice(0, 3).map((topic, i) => (
                                    <span
                                      key={i}
                                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20"
                                    >
                                      #{topic}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Metadata & Actions Footer */}
                            <div className="pt-4 mt-4 border-t border-slate-200/70 dark:border-white/[0.06] space-y-3">
                              <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                                {/* Language */}
                                <div className="flex items-center gap-1.5">
                                  {repo.language ? (
                                    <>
                                      <span
                                        className={cn(
                                          'w-2.5 h-2.5 rounded-full',
                                          repo.language === 'TypeScript'
                                            ? 'bg-blue-500'
                                            : repo.language === 'Python'
                                              ? 'bg-amber-500'
                                              : repo.language === 'HTML'
                                                ? 'bg-rose-500'
                                                : 'bg-slate-400'
                                        )}
                                      />
                                      <span className="text-slate-700 dark:text-slate-200">{repo.language}</span>
                                    </>
                                  ) : (
                                    <span className="text-slate-400">Markdown</span>
                                  )}
                                </div>

                                {/* Stars and Forks */}
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1" title="Stars">
                                    <Star className="w-3.5 h-3.5" />
                                    {repo.stargazers_count}
                                  </span>
                                  <span className="flex items-center gap-1" title="Forks">
                                    <GitBranch className="w-3.5 h-3.5" />
                                    {repo.forks_count}
                                  </span>
                                </div>
                              </div>

                              {/* Relative Updated Date and Links */}
                              <div className="flex items-center justify-between pt-2 text-xs">
                                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Updated {formatRelativeTime(repo.updated_at)}
                                </span>

                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleCopyLink(repo.html_url, repo.name)}
                                    className="text-[11px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                  >
                                    {copiedRepo === repo.name ? (
                                      <span className="text-emerald-500 flex items-center gap-0.5">
                                        <Check className="w-3 h-3" /> Copied
                                      </span>
                                    ) : (
                                      'Copy'
                                    )}
                                  </button>
                                  <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Open repository ${repo.name} on GitHub`}
                                    className="font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 inline-flex items-center gap-1"
                                  >
                                    <span>Code</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))
                    ) : (
                      /* Graceful Empty Search State */
                      <div className="col-span-full py-12 px-6 rounded-2xl border border-dashed border-slate-300 dark:border-white/[0.1] text-center">
                        <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          No public repositories match your filter
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                          Try searching for a different keyword or reset the language filter to &quot;All&quot;.
                        </p>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedLanguage('All');
                          }}
                          className="mt-4 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* VIEW 2: LANGUAGE BREAKDOWN */}
            {activeTab === 'languages' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card
                  variant="glass"
                  className="lg:col-span-2 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0c1424]/90"
                >
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-cyan-500" />
                    <span>Language Distribution</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">
                    Derived strictly from confirmed public repositories under{' '}
                    <span className="font-mono text-cyan-600 dark:text-cyan-400">@lalitchoudhary0907</span>.
                  </p>

                  {/* Multi-segment Progress Bar */}
                  <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800 mb-6 p-0.5">
                    {data.languages.map((lang) => (
                      <div
                        key={lang.language}
                        style={{
                          width: `${lang.percentage}%`,
                          backgroundColor: lang.color,
                        }}
                        className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
                        title={`${lang.language}: ${lang.percentage}% (${lang.count} repos)`}
                      />
                    ))}
                  </div>

                  {/* Language Breakdown Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.languages.map((lang) => (
                      <div
                        key={lang.language}
                        className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0"
                            style={{ backgroundColor: lang.color }}
                          />
                          <div>
                            <span className="block font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {lang.language}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                              {lang.count} {lang.count === 1 ? 'repository' : 'repositories'}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                          {lang.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Engineering Stance Note */}
                <Card
                  variant="glass"
                  className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0c1424]/90 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 w-fit">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <h5 className="font-bold text-base text-slate-900 dark:text-white">
                      Transparent Codebase Architecture
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Every project repository is publicly accessible on GitHub. All language metrics and statistics
                      are computed dynamically from real Git metadata without fictitious proficiency numbers.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-200 dark:border-white/[0.06] mt-4">
                    <a
                      href="https://github.com/lalitchoudhary0907"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>Explore on GitHub</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>
                </Card>
              </div>
            )}

            {/* VIEW 3: TIMELINE / EVENTS */}
            {activeTab === 'timeline' && (
              <Card
                variant="glass"
                className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0c1424]/90"
              >
                <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/[0.06]">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <GitCommit className="w-5 h-5 text-cyan-500" />
                      <span>Recent Public Events Stream</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Authentic public commit, push, and branch actions on GitHub.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {data.events.length} {data.events.length === 1 ? 'event' : 'events'}
                  </span>
                </div>

                <div className="mt-6 space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {data.events.length > 0 ? (
                    data.events.map((evt: GitHubEventItem) => {
                      const isPush = evt.type === 'PushEvent';
                      const isCreate = evt.type === 'CreateEvent';

                      return (
                        <div key={evt.id} className="relative flex items-start gap-4 pl-1">
                          {/* Dot / Icon */}
                          <div
                            className={cn(
                              'relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white dark:ring-[#0c1424]',
                              isPush
                                ? 'bg-cyan-500/20 text-cyan-500 border border-cyan-500/40'
                                : isCreate
                                  ? 'bg-blue-500/20 text-blue-500 border border-blue-500/40'
                                  : 'bg-slate-500/20 text-slate-400 border border-slate-500/40'
                            )}
                          >
                            {isPush ? (
                              <GitCommit className="w-3.5 h-3.5" />
                            ) : isCreate ? (
                              <GitBranch className="w-3.5 h-3.5" />
                            ) : (
                              <Activity className="w-3.5 h-3.5" />
                            )}
                          </div>

                          {/* Event Content */}
                          <div className="flex-1 p-3.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.04]">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                              <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                                {evt.action_summary}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">
                                {formatRelativeTime(evt.created_at)}
                              </span>
                            </div>

                            <a
                              href={evt.repo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1 mt-1"
                            >
                              <span>{evt.repo_name}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No recent public events in the current monitoring window.
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}
      </Container>
    </section>
  );
};
