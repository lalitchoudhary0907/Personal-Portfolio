/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { AmbientBackground } from './components/AmbientBackground';
import { StripsBand } from './components/StripsBand';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Achievements } from './components/Achievements';
import { Contact } from './components/Contact';
import { StyleGuide } from './components/StyleGuide';
import { Intro } from './components/Intro';
import { useIntro } from './hooks/useIntro';
import { Cursor } from './components/Cursor';
import { CursorProvider } from './context/CursorContext';
import { ThemeProvider } from './context/ThemeContext';
import { ScrollProvider } from './context/ScrollContext';
import { PaletteSwitcherBar } from './components/PaletteSwitcherBar';
import { PaletteComparisonModal } from './components/PaletteComparisonModal';

export default function App() {
  const [showTokens, setShowTokens] = useState(() => {
    return typeof window !== 'undefined' && window.location.search.includes('tokens');
  });

  const { isIntroActive, isSplitting, introDone, phase, progress, variant, skipIntro } = useIntro();

  useEffect(() => {
    const handleLocationChange = () => {
      setShowTokens(window.location.search.includes('tokens'));
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  return (
    <ThemeProvider>
      {showTokens ? (
        <StyleGuide />
      ) : (
        <ScrollProvider>
          <CursorProvider>
            {isIntroActive && (
              <Intro
                isSplitting={isSplitting}
                phase={phase}
                progress={progress}
                variant={variant}
                onSkip={skipIntro}
              />
            )}

            {/* Custom Cursor appears only after introDone */}
            <Cursor introDone={introDone} />

            {/* Ambient floating background with moving fluid orbs, reactive particle mesh and interactive ripples */}
            <AmbientBackground />

            <div
              inert={isIntroActive || undefined}
              className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)] overflow-x-hidden transition-colors duration-500"
            >
              {/* Skip to Content Link */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 min-h-[44px] min-w-[44px] px-5 py-3 inline-flex items-center justify-center bg-[var(--primary)] text-[var(--paper)] font-mono text-xs uppercase tracking-wider outline-none"
              >
                Skip to content
              </a>

              {/* Semantic Header Landmark with dynamic scroll progress bar */}
              <Header />

              {/* Semantic Main Landmark hosting dynamic scrolling sections */}
              <main id="main-content" tabIndex={-1} className="flex-1 w-full outline-none">
                <Hero introDone={introDone} />
                <StripsBand />
                <Projects />
                <About />
                <Skills />
                <Achievements />
                <Contact />
              </main>

              {/* Semantic Footer Landmark */}
              <Footer />
            </div>

            {/* Interactive Palette Switcher HUD Bar */}
            <PaletteSwitcherBar />

            {/* Full-Featured Palette Exploration Studio Modal */}
            <PaletteComparisonModal />
          </CursorProvider>
        </ScrollProvider>
      )}
    </ThemeProvider>
  );
}
