/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { profile } from '../data/profile';
import { useMagnetic } from '../hooks/useMagnetic';

export const Footer: React.FC = () => {
  const replayMagnetic = useMagnetic<HTMLButtonElement>({
    radius: 60,
    pullFactor: 0.2,
    maxOffset: 6,
  });

  const backToTopMagnetic = useMagnetic<HTMLAnchorElement>({
    radius: 60,
    pullFactor: 0.2,
    maxOffset: 6,
  });

  const handleReplayIntro = () => {
    try {
      localStorage.removeItem('lc_intro_seen_v1');
    } catch {
      // Storage access safety
    }
    window.location.search = '?intro=1';
  };

  const handleBackToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      role="contentinfo"
      className="w-full border-t border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] pt-10 pb-[max(2.5rem,calc(1.5rem+env(safe-area-inset-bottom)))] px-6 sm:px-10 select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
        {/* Left: Copyright */}
        <div>
          &copy; 2026 {profile.name}
        </div>

        {/* Center / Right: Actions */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <motion.button
            ref={replayMagnetic.ref}
            style={replayMagnetic.style}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.76, 0, 0.24, 1] }}
            type="button"
            onClick={handleReplayIntro}
            data-cursor="link"
            aria-label="Replay cover intro animation"
            className="min-h-[44px] inline-flex items-center px-2 py-2 hover:text-[var(--oxblood)] transition-colors cursor-pointer"
          >
            Replay Intro &larr;
          </motion.button>

          <motion.a
            ref={backToTopMagnetic.ref}
            style={backToTopMagnetic.style}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.76, 0, 0.24, 1] }}
            href="#top"
            onClick={handleBackToTop}
            data-cursor="link"
            aria-label="Scroll back to top of page"
            className="min-h-[44px] inline-flex items-center px-2 py-2 hover:text-[var(--oxblood)] transition-colors"
          >
            Back to Top &uarr;
          </motion.a>

          <a
            href="/?tokens"
            data-cursor="link"
            className="min-h-[44px] inline-flex items-center px-2 py-2 text-[var(--ink-muted)]/60 hover:text-[var(--oxblood)] transition-colors"
            title="Design Tokens & Style Guide"
          >
            Tokens
          </a>
        </div>
      </div>
    </footer>
  );
};
