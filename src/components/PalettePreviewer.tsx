/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { THEME_OPTIONS, ThemeOption } from '../data/themes';
import { motion, AnimatePresence } from 'motion/react';

export const PalettePreviewer: React.FC = () => {
  const [activeThemeId, setActiveThemeId] = useState<'auros' | 'cyan' | 'emerald' | 'violet' | 'amber'>('auros');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize theme from localStorage or URL parameter
  useEffect(() => {
    let initialTheme: 'auros' | 'cyan' | 'emerald' | 'violet' | 'amber' = 'auros';
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTheme = urlParams.get('theme') as any;
      if (['auros', 'cyan', 'emerald', 'violet', 'amber'].includes(urlTheme)) {
        initialTheme = urlTheme;
      } else {
        const stored = localStorage.getItem('lc_portfolio_theme') as any;
        if (['auros', 'cyan', 'emerald', 'violet', 'amber'].includes(stored)) {
          initialTheme = stored;
        }
      }
    }
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (themeId: 'auros' | 'cyan' | 'emerald' | 'violet' | 'amber') => {
    setActiveThemeId(themeId);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeId);
      localStorage.setItem('lc_portfolio_theme', themeId);
      window.dispatchEvent(new CustomEvent('theme_changed', { detail: { themeId } }));
    }
  };

  const activeTheme = THEME_OPTIONS.find((t) => t.id === activeThemeId) || THEME_OPTIONS[0];

  return (
    <>
      {/* Floating Theme Quick-Switcher Bar (Bottom Right) */}
      <aside
        aria-label="Color Palette Preview Switcher"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 p-1.5 sm:p-2 bg-[#0E131E]/95 border border-white/15 backdrop-blur-xl rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.7)] select-none"
      >
        <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-wider text-[#8E9BAE] pl-2 pr-1 font-semibold">
          PALETTE:
        </span>

        {/* 4 Theme Color Swatch Buttons */}
        <div className="flex items-center gap-1.5">
          {THEME_OPTIONS.map((theme) => {
            const isSelected = activeThemeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => applyTheme(theme.id)}
                data-cursor="link"
                aria-pressed={isSelected}
                aria-label={`Preview ${theme.name} (${theme.primary.name}, ${theme.accent.name})`}
                className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-white scale-110 shadow-lg'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${theme.primary.hex.split('/')[0].trim()} 50%, ${theme.accent.hex.split('/')[0].trim()} 50%)`,
                }}
              >
                {isSelected && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme.accent.hex.split('/')[0].trim() }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Opener for Full 3-Part Breakdown */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          data-cursor="link"
          aria-label="View side-by-side color palette breakdown"
          className="ml-1 px-3 py-1.5 border border-white/15 hover:border-[var(--oxblood)] bg-white/[0.04] hover:bg-white/[0.08] text-[var(--ink)] hover:text-[var(--oxblood)] font-mono text-[11px] uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>◫</span>
          <span className="hidden md:inline font-medium">Breakdown</span>
        </button>
      </aside>

      {/* Comprehensive Palette Breakdown & Live Comparison Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="palette-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10 select-none overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
              className="bg-[#08090D] border border-white/15 w-full max-w-6xl max-h-[92vh] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0E131E]/90">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#00F2FE] font-bold">
                      COLOR SYSTEM ARCHITECTURE
                    </span>
                    <span className="text-white/20">|</span>
                    <span className="font-mono text-xs text-[#8E9BAE]">
                      3-Part Visual Hierarchy
                    </span>
                  </div>
                  <h2
                    id="palette-modal-title"
                    className="font-display text-2xl sm:text-3xl font-bold text-[#F0F6FC] mt-1"
                  >
                    Curated Color Combinations &amp; Breakdown
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  data-cursor="link"
                  aria-label="Close palette comparison modal"
                  className="px-3.5 py-1.5 border border-white/20 hover:border-white/50 text-[#F0F6FC] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Close [Esc]
                </button>
              </div>

              {/* Modal Body: Comparison Cards Grid */}
              <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 custom-scrollbar">
                {THEME_OPTIONS.map((theme) => {
                  const isCurrent = activeThemeId === theme.id;
                  return (
                    <div
                      key={theme.id}
                      className={`p-6 border transition-all duration-300 flex flex-col justify-between ${
                        isCurrent
                          ? 'border-[var(--oxblood)] bg-white/[0.03] shadow-[0_0_30px_rgba(0,242,254,0.15)] ring-1 ring-[var(--oxblood)]'
                          : 'border-white/10 bg-white/[0.01] hover:border-white/25'
                      }`}
                    >
                      <div>
                        {/* Option Title & Badges */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-display text-xl font-bold text-[#F0F6FC]">
                                {theme.name}
                              </h3>
                              {isCurrent && (
                                <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--oxblood)] text-[#08090D] font-bold">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <p className="font-mono text-xs text-[#8E9BAE] mt-1">
                              {theme.tagline}
                            </p>
                          </div>
                          <span className="shrink-0 font-mono text-[10px] px-2 py-1 bg-white/5 border border-white/10 text-emerald-400">
                            {theme.contrastRatio}
                          </span>
                        </div>

                        {/* 3-Part Color Architecture Breakdown */}
                        <div className="grid grid-cols-3 gap-3 my-5">
                          {/* 1. Primary */}
                          <div className="p-3 border border-white/10 bg-black/40 flex flex-col justify-between">
                            <div>
                              <div
                                className="w-full h-8 border border-white/10 mb-2 shadow-inner"
                                style={{ backgroundColor: theme.primary.hex }}
                              />
                              <span className="font-mono text-[10px] text-white/50 uppercase block font-semibold">
                                1. Primary
                              </span>
                              <span className="font-mono text-xs font-bold text-[#F0F6FC] block truncate">
                                {theme.primary.hex}
                              </span>
                            </div>
                            <span className="font-mono text-[9px] text-[#8E9BAE] mt-2 block">
                              Base & Void ({theme.primary.percentage})
                            </span>
                          </div>

                          {/* 2. Secondary */}
                          <div className="p-3 border border-white/10 bg-black/40 flex flex-col justify-between">
                            <div>
                              <div
                                className="w-full h-8 border border-white/10 mb-2 shadow-inner"
                                style={{
                                  background: `linear-gradient(90deg, ${theme.secondary.hex.split('/')[0].trim()} 50%, #ffffff 50%)`,
                                }}
                              />
                              <span className="font-mono text-[10px] text-white/50 uppercase block font-semibold">
                                2. Secondary
                              </span>
                              <span className="font-mono text-xs font-bold text-[#F0F6FC] block truncate">
                                {theme.secondary.hex}
                              </span>
                            </div>
                            <span className="font-mono text-[9px] text-[#8E9BAE] mt-2 block">
                              Surfaces & Text ({theme.secondary.percentage})
                            </span>
                          </div>

                          {/* 3. Accent */}
                          <div className="p-3 border border-white/10 bg-black/40 flex flex-col justify-between">
                            <div>
                              <div
                                className="w-full h-8 border border-white/10 mb-2 shadow-inner"
                                style={{
                                  background: theme.accent.hex.includes('/')
                                    ? `linear-gradient(90deg, ${theme.accent.hex.split('/')[0].trim()} 50%, ${theme.accent.hex.split('/')[1].trim()} 50%)`
                                    : theme.accent.hex,
                                }}
                              />
                              <span className="font-mono text-[10px] text-white/50 uppercase block font-semibold">
                                3. Accent
                              </span>
                              <span
                                className="font-mono text-xs font-bold block truncate"
                                style={{ color: theme.accent.hex.split('/')[0].trim() }}
                              >
                                {theme.accent.hex}
                              </span>
                            </div>
                            <span className="font-mono text-[9px] text-[#8E9BAE] mt-2 block">
                              Signal & Pulse ({theme.accent.percentage})
                            </span>
                          </div>
                        </div>

                        {/* Interactive Mini Component Preview */}
                        <div
                          className="p-4 border border-white/10 relative overflow-hidden"
                          style={{ backgroundColor: theme.primary.hex.split('/')[0].trim() }}
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-white/10">
                            <span
                              className="font-display font-medium text-lg tracking-tight"
                              style={{ color: '#F0F6FC' }}
                            >
                              L<span style={{ color: theme.accent.hex.split('/')[0].trim() }}>A</span>LIT
                            </span>
                            <span
                              className="font-display text-[10px] px-2 py-0.5 rounded-[4px] border uppercase tracking-wider"
                              style={{
                                color: theme.accent.hex.split('/')[0].trim(),
                                borderColor: `${theme.accent.hex.split('/')[0].trim()}40`,
                                backgroundColor: `${theme.accent.hex.split('/')[0].trim()}15`,
                              }}
                            >
                              AUROS ACTIVE
                            </span>
                          </div>

                          <div className="pt-3 flex items-center justify-between">
                            <div>
                              <span
                                className="font-display font-medium text-sm block"
                                style={{ color: '#F0F6FC' }}
                              >
                                FocusFlow
                              </span>
                              <span
                                className="font-display text-[9px] uppercase tracking-wider block"
                                style={{ color: '#8E9BAE' }}
                              >
                                JavaScript · HTML5 · CSS3
                              </span>
                            </div>
                            <span
                              className="font-mono text-sm font-bold"
                              style={{ color: theme.accent.hex.split('/')[0].trim() }}
                            >
                              ↗
                            </span>
                          </div>
                        </div>

                        {/* Vibe and Recommendation */}
                        <div className="mt-4 space-y-1 font-mono text-[11px]">
                          <p className="text-[#8E9BAE]">
                            <span className="text-white/40">Vibe:</span> {theme.vibe}
                          </p>
                          <p className="text-[#8E9BAE]">
                            <span className="text-white/40">Best For:</span>{' '}
                            <span className="text-[#F0F6FC]">{theme.bestFor}</span>
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={() => applyTheme(theme.id)}
                        data-cursor="link"
                        className={`mt-6 w-full py-2.5 font-mono text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          isCurrent
                            ? 'bg-[var(--oxblood)] text-[#08090D] shadow-[0_0_20px_var(--accent-cyan-glow)]'
                            : 'bg-white/10 hover:bg-white/20 text-[#F0F6FC] border border-white/20'
                        }`}
                      >
                        {isCurrent ? (
                          <>
                            <span>✓</span>
                            <span>Currently Active</span>
                          </>
                        ) : (
                          <span>Apply This Palette &rarr;</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 bg-[#0E131E]/80 flex items-center justify-between font-mono text-[11px] text-[#8E9BAE]">
                <span>Choice persists across browser visits automatically.</span>
                <span className="text-[var(--oxblood)]">
                  Active Theme: {activeTheme.name}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
