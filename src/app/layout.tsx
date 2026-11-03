/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AmbientBackdrop } from '../components/ui/AmbientBackdrop';
import { AmbientCursorLight } from '../components/ui/AmbientCursorLight';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  // Dark-first default
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Initialize dark-first class on root document
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleToggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('portfolio-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('portfolio-theme', 'light');
      }
      return next;
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors selection:bg-cyan-500/20 selection:text-cyan-800 dark:selection:text-cyan-200">
      {/* Soft Ambient Lighting Backdrop */}
      <AmbientBackdrop />

      {/* Desktop-only subtle cursor following glow */}
      <AmbientCursorLight />

      {/* Main Content Tree with padding for floating Navbar */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar darkMode={darkMode} onToggleTheme={handleToggleTheme} />
        {/* pt-20 sm:pt-24 prevents floating navbar overlap */}
        <main className="flex-1 flex flex-col pt-16 sm:pt-20">{children}</main>
        <Footer />
      </div>
    </div>
  );
};
