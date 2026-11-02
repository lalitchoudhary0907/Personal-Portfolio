/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sun, Moon, ArrowUpRight, FileText } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { portfolioData } from '../../data/portfolio';
import { cn } from '../../lib/utils';

interface NavbarProps {
  darkMode?: boolean;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode = true, onToggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const navRef = useRef<HTMLElement>(null);

  // Monitor scroll for subtle elevation and compact transition
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard accessibility: Close mobile drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Scroll-spy active section observer
  useEffect(() => {
    const sectionIds = siteConfig.navItems.map((item) => item.href.replace('#', '')).filter(Boolean);
    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Find the first intersecting section with highest visible ratio
      const visibleEntry = entries.find((entry) => entry.isIntersecting);
      if (visibleEntry) {
        const matchingItem = siteConfig.navItems.find(
          (item) => item.href.replace('#', '') === visibleEntry.target.id
        );
        if (matchingItem) {
          setActiveSection(matchingItem.title);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.2, 0.5],
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (title: string, href: string) => {
    setActiveSection(title);
    setMobileMenuOpen(false);

    // If anchor exists, smooth scroll
    const targetId = href.replace('#', '');
    if (targetId) {
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Rule: Resume button only when a real resume file is supplied
  const hasRealResume = Boolean(portfolioData.personalInfo.resumeUrl?.trim());

  return (
    <header
      ref={navRef}
      className="fixed top-2 sm:top-4 inset-x-0 z-50 mx-auto max-w-5xl px-3 sm:px-6 pointer-events-none"
    >
      <nav
        aria-label="Primary navigation"
        className={cn(
          'pointer-events-auto transition-all duration-300 rounded-2xl flex items-center justify-between gap-4 sm:gap-6 px-3.5 sm:px-5',
          scrolled
            ? 'py-2 sm:py-2.5 bg-[#070b14]/90 dark:bg-[#070b14]/90 bg-white/90 border border-white/[0.12] dark:border-white/[0.12] border-slate-200/90 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.45)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.65)] backdrop-blur-2xl'
            : 'py-2.5 sm:py-3.5 bg-[#070b14]/70 dark:bg-[#070b14]/70 bg-white/75 border border-white/[0.08] dark:border-white/[0.08] border-slate-200/70 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.3)] backdrop-blur-xl'
        )}
      >
        {/* Zone 1: Brand with LC Monogram */}
        <a
          href="#home"
          onClick={() => handleNavClick('Home', '#home')}
          aria-label="Lalit Choudhary - Home"
          className="flex items-center gap-2.5 group whitespace-nowrap shrink-0 text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl"
        >
          {/* LC Monogram */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-violet-600/20 dark:from-cyan-500/25 dark:via-blue-600/25 dark:to-violet-600/25 border border-cyan-500/30 dark:border-cyan-400/30 flex items-center justify-center font-bold text-xs font-mono text-cyan-600 dark:text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)] group-hover:border-cyan-400 transition-colors">
            LC
          </div>

          <span className="font-bold text-sm sm:text-base tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            Lalit<span className="text-slate-400 dark:text-slate-500 font-normal hidden sm:inline"> Choudhary</span>
          </span>
        </a>

        {/* Zone 2: Navigation Links with Active Motion Indicator */}
        <div className="hidden md:flex items-center gap-1 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
          {siteConfig.navItems.map((item) => {
            const isActive = activeSection === item.title;
            return (
              <a
                key={item.title}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.title, item.href);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
                  isActive
                    ? 'text-cyan-600 dark:text-cyan-300 font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-white/[0.04]'
                )}
              >
                <span>{item.title}</span>

                {/* Motion Active Indicator Pill */}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-lg bg-cyan-500/10 dark:bg-cyan-400/15 border border-cyan-500/30 dark:border-cyan-400/30 -z-10 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Zone 3: Actions (Theme Toggle, optional Resume Button, Contact CTA, Mobile Toggle) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-cyan-300 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer border border-slate-200 dark:border-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {darkMode ? <Sun className="w-4 h-4 text-cyan-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>
          )}

          {/* Conditional Resume Button (Only rendered when a real resume file is supplied) */}
          {hasRealResume && (
            <a
              href={portfolioData.personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] rounded-xl border border-slate-200 dark:border-white/[0.1] transition-all whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-500" />
              <span>Resume</span>
            </a>
          )}

          {/* Primary Action Button */}
          <a
            href={`mailto:${portfolioData.personalInfo.email}`}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-95 motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <span>Get in Touch</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer border border-slate-200 dark:border-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer with Smooth AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Mobile navigation"
            className="pointer-events-auto md:hidden mt-2 p-3 rounded-2xl bg-white/95 dark:bg-[#0c1424]/95 border border-slate-200 dark:border-white/[0.1] shadow-2xl backdrop-blur-2xl space-y-2"
          >
            <div className="flex flex-col space-y-1">
              {siteConfig.navItems.map((item) => {
                const isActive = activeSection === item.title;
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.title, item.href);
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors flex items-center justify-between',
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                    )}
                  >
                    <span>{item.title}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Mobile Footer CTAs */}
            <div className="pt-2 border-t border-slate-200/80 dark:border-white/[0.08] space-y-2">
              {hasRealResume && (
                <a
                  href={portfolioData.personalInfo.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/[0.06] rounded-xl"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-500" />
                  <span>View Resume</span>
                </a>
              )}

              <a
                href={`mailto:${portfolioData.personalInfo.email}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-md"
              >
                <span>Get in Touch</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
