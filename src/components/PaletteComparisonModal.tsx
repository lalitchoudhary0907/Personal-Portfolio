/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { PaletteDefinition, PaletteId } from '../types/theme';

export const PaletteComparisonModal: React.FC = () => {
  const { isComparisonOpen, closeComparison, paletteId, setPaletteId, palettes } = useTheme();
  const [activeTab, setActiveTab] = useState<'grid' | PaletteId>('grid');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (!isComparisonOpen) return null;

  const handleCopy = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const displayedPalettes =
    activeTab === 'grid'
      ? palettes
      : palettes.filter((p) => p.id === activeTab);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-palette-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeComparison();
      }}
    >
      <div className="relative w-full max-w-7xl max-h-[92vh] flex flex-col bg-[#0A0D14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-[#F4F7FF]">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0E121B]/90 backdrop-blur-sm gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--secondary)]">
                Design Token & Identity Studio — Part 2
              </p>
            </div>
            <h2 id="modal-palette-title" className="text-xl sm:text-2xl font-serif font-normal tracking-tight text-white">
              Colour Palette Exploration System
            </h2>
            <p className="text-xs text-[#8B9BB4] mt-0.5 max-w-2xl">
              Inspect all 4 curated design identities in realistic UI contexts, verified WCAG AAA contrast ratios, and future Three.js shader uniform definitions.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-white/5 p-1 rounded-lg border border-white/10 text-xs font-mono">
              <button
                onClick={() => setActiveTab('grid')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'grid'
                    ? 'bg-[var(--primary)] text-[#080C16] font-semibold'
                    : 'text-[#8B9BB4] hover:text-white'
                }`}
              >
                All 4 Palettes
              </button>
              {palettes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveTab(p.id)}
                  className={`px-2.5 py-1.5 rounded-md transition-all ${
                    activeTab === p.id
                      ? 'bg-[var(--primary)] text-[#080C16] font-semibold'
                      : 'text-[#8B9BB4] hover:text-white'
                  }`}
                >
                  [{p.letter}] {p.shortName}
                </button>
              ))}
            </div>

            <button
              onClick={closeComparison}
              aria-label="Close modal"
              className="px-3.5 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-xs transition-colors"
            >
              Close ✕
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Palettes Grid */}
          <div
            className={`grid gap-6 ${
              activeTab === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
                : 'grid-cols-1 max-w-3xl mx-auto'
            }`}
          >
            {displayedPalettes.map((palette) => {
              const isSelected = paletteId === palette.id;
              const { colors, contrast, shaderUniforms } = palette;

              return (
                <div
                  key={palette.id}
                  className={`relative flex flex-col rounded-xl border transition-all duration-300 overflow-hidden ${
                    isSelected
                      ? 'border-[var(--primary)] shadow-[0_0_30px_rgba(104,139,255,0.2)]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                  }}
                >
                  {/* Card Header & Activation */}
                  <div
                    className="p-4 sm:p-5 border-b"
                    style={{ borderColor: colors.border }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs"
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.background,
                          }}
                        >
                          {palette.letter}
                        </span>
                        <h3 className="font-serif text-lg font-medium leading-snug">
                          {palette.shortName}
                        </h3>
                      </div>
                      {isSelected ? (
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold"
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.background,
                          }}
                        >
                          ACTIVE
                        </span>
                      ) : (
                        <button
                          onClick={() => setPaletteId(palette.id)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-mono transition-transform hover:scale-105 active:scale-95"
                          style={{
                            backgroundColor: colors.surface,
                            color: colors.primary,
                            border: `1px solid ${colors.borderBright}`,
                          }}
                        >
                          Preview Live →
                        </button>
                      )}
                    </div>

                    <p
                      className="text-xs line-clamp-2 mt-1 leading-relaxed"
                      style={{ color: colors.textMuted }}
                    >
                      {palette.visualIdentity}
                    </p>
                  </div>

                  {/* Swatches Section */}
                  <div
                    className="p-4 border-b space-y-2"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                    }}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>
                      <span>Role Swatches</span>
                      <span>Click to copy hex</span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      {[
                        { label: 'BG', hex: colors.background, border: true },
                        { label: 'SURF', hex: colors.surface, border: true },
                        { label: 'PRIM', hex: colors.primary },
                        { label: 'SEC', hex: colors.secondary },
                        { label: 'ACC', hex: colors.accent },
                      ].map((swatch) => (
                        <button
                          key={swatch.label}
                          onClick={() => handleCopy(swatch.hex)}
                          className="group relative flex flex-col items-center p-1.5 rounded border transition-transform hover:-translate-y-0.5"
                          style={{
                            backgroundColor: swatch.hex,
                            borderColor: swatch.border ? colors.borderBright : 'transparent',
                          }}
                          title={`Copy ${swatch.hex}`}
                        >
                          <span
                            className="text-[9px] font-mono font-bold mt-3"
                            style={{
                              color: swatch.label === 'BG' || swatch.label === 'SURF' ? colors.text : colors.background,
                            }}
                          >
                            {swatch.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono pt-1" style={{ color: colors.textMuted }}>
                      <span>Primary: <span style={{ color: colors.primary }}>{colors.primary}</span></span>
                      <span>Accent: <span style={{ color: colors.accent }}>{colors.accent}</span></span>
                    </div>
                  </div>

                  {/* Realistic UI Specimen 1: Hero Typography & Nav */}
                  <div className="p-4 border-b space-y-3" style={{ borderColor: colors.border }}>
                    <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: colors.textMuted }}>
                      01 // Hero & Typography Specimen
                    </div>

                    <div
                      className="p-3.5 rounded-lg border relative overflow-hidden"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      }}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-2" style={{ color: colors.textMuted }}>
                        <span style={{ color: colors.primary }}>● LC_PORTFOLIO</span>
                        <span>[28° N, 77° E]</span>
                      </div>

                      <div className="font-serif text-lg leading-tight tracking-tight mb-1" style={{ color: colors.text }}>
                        Architecting Autonomous Systems.
                      </div>

                      <p className="text-[11px] leading-relaxed" style={{ color: colors.textMuted }}>
                        Computer Science & Artificial Intelligence Engineer at WorldQuant & IIIT Delhi.
                      </p>

                      {/* Small technical badges */}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        <span
                          className="text-[9px] font-mono px-2 py-0.5 rounded border"
                          style={{
                            color: colors.primary,
                            borderColor: colors.borderBright,
                            backgroundColor: `${colors.primary}12`,
                          }}
                        >
                          CS & AI
                        </span>
                        <span
                          className="text-[9px] font-mono px-2 py-0.5 rounded border"
                          style={{
                            color: colors.accent,
                            borderColor: colors.borderAccent,
                            backgroundColor: `${colors.accent}12`,
                          }}
                        >
                          QUANTITATIVE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Realistic UI Specimen 2: Realistic Project Card (FocusFlow) */}
                  <div className="p-4 border-b space-y-3" style={{ borderColor: colors.border }}>
                    <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: colors.textMuted }}>
                      02 // Project Card Specimen
                    </div>

                    <div
                      className="p-3.5 rounded-lg border relative transition-all duration-300"
                      style={{
                        backgroundColor: colors.surfaceCard,
                        borderColor: colors.borderBright,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-[9px] font-mono uppercase px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: `${colors.accent}20`,
                            color: colors.accent,
                            border: `1px solid ${colors.borderAccent}`,
                          }}
                        >
                          SYSTEM ARCHITECTURE
                        </span>
                        <span className="font-mono text-[10px]" style={{ color: colors.textMuted }}>
                          2024 ↗
                        </span>
                      </div>

                      <h4 className="font-serif text-sm font-medium mb-1" style={{ color: colors.text }}>
                        FocusFlow: Neuro-State Productivity
                      </h4>

                      <p className="text-[11px] line-clamp-2 mb-3" style={{ color: colors.textMuted }}>
                        Ambient biometric workflow engine orchestrating deep work intervals and distraction mitigation.
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: colors.border }}>
                        <span className="text-[10px] font-mono" style={{ color: colors.secondary }}>
                          Python · PyTorch · FastAPI
                        </span>
                        <span
                          className="text-[10px] font-mono font-medium underline underline-offset-4"
                          style={{ color: colors.primary }}
                        >
                          View Artifact ↗
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Realistic UI Specimen 3: Button & Interactive Lab */}
                  <div className="p-4 border-b space-y-3" style={{ borderColor: colors.border }}>
                    <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: colors.textMuted }}>
                      03 // Interactive Button States
                    </div>

                    <div className="space-y-2">
                      <button
                        className="w-full py-2 px-3 rounded-lg font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.background,
                          boxShadow: `0 0 16px ${colors.primaryGlow}`,
                        }}
                      >
                        Primary Action ↗
                      </button>

                      <button
                        className="w-full py-2 px-3 rounded-lg font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-colors hover:bg-white/5"
                        style={{
                          color: colors.text,
                          borderColor: colors.borderBright,
                          backgroundColor: colors.surface,
                        }}
                      >
                        Secondary Outline
                      </button>

                      <div
                        className="p-2 rounded text-center text-[10px] font-mono"
                        style={{
                          color: colors.accent,
                          backgroundColor: `${colors.accent}14`,
                          border: `1px dashed ${colors.borderAccent}`,
                        }}
                      >
                        Active Selection / Hover Accent Glow
                      </div>
                    </div>
                  </div>

                  {/* Realistic UI Specimen 4: Atmospheric Gradient Specimen */}
                  <div className="p-4 border-b space-y-2" style={{ borderColor: colors.border }}>
                    <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: colors.textMuted }}>
                      04 // Atmospheric Gradient Mesh
                    </div>

                    <div
                      className="h-14 rounded-lg relative overflow-hidden border"
                      style={{
                        borderColor: colors.border,
                        background: `radial-gradient(ellipse at top left, ${colors.primary}40, transparent 65%), radial-gradient(ellipse at bottom right, ${colors.accent}30, transparent 65%), ${colors.background}`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: colors.textMuted }}>
                          Dynamic Shader & Canvas Field
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* WCAG Contrast Verification & Shader Uniforms */}
                  <div className="p-4 space-y-3" style={{ backgroundColor: `${colors.surface}80` }}>
                    <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: colors.textMuted }}>
                      05 // Accessibility (WCAG AAA)
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                      <div className="p-1.5 rounded border" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
                        <span className="block text-[8px]" style={{ color: colors.textMuted }}>TEXT / BG</span>
                        <span className="font-semibold" style={{ color: colors.primary }}>{contrast.textOnBackground}</span>
                      </div>
                      <div className="p-1.5 rounded border" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
                        <span className="block text-[8px]" style={{ color: colors.textMuted }}>PRIMARY / BG</span>
                        <span className="font-semibold" style={{ color: colors.accent }}>{contrast.primaryOnBackground}</span>
                      </div>
                      <div className="p-1.5 rounded border" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
                        <span className="block text-[8px]" style={{ color: colors.textMuted }}>ACCENT / BG</span>
                        <span className="font-semibold" style={{ color: colors.primary }}>{contrast.accentOnBackground}</span>
                      </div>
                      <div className="p-1.5 rounded border" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
                        <span className="block text-[8px]" style={{ color: colors.textMuted }}>TEXT / SURFACE</span>
                        <span className="font-semibold" style={{ color: colors.accent }}>{contrast.textOnSurface}</span>
                      </div>
                    </div>

                    {/* Shader Vector Uniforms ready for Three.js */}
                    <div className="pt-2 border-t text-[9px] font-mono" style={{ borderColor: colors.border }}>
                      <span className="block uppercase text-[8px] mb-1" style={{ color: colors.textMuted }}>
                        Three.js Shader Uniforms:
                      </span>
                      <code className="block p-1.5 rounded overflow-x-auto text-[8px]" style={{ backgroundColor: colors.background, color: colors.secondary }}>
                        uPrimary = [{shaderUniforms.primaryVec3.join(', ')}]<br />
                        uAccent  = [{shaderUniforms.accentVec3.join(', ')}]
                      </code>
                    </div>

                    {/* Quick Select Button */}
                    <button
                      onClick={() => {
                        setPaletteId(palette.id);
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-all"
                      style={{
                        backgroundColor: isSelected ? colors.primary : colors.surface,
                        color: isSelected ? colors.background : colors.text,
                        border: `1px solid ${isSelected ? colors.primary : colors.borderBright}`,
                      }}
                    >
                      {isSelected ? '✓ Currently Active' : `Apply ${palette.shortName} →`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0E121B] flex flex-wrap items-center justify-between text-xs text-[#8B9BB4] gap-3">
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Quick switch: <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">Alt</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">1..4</kbd></span>
            <span>Toggle modal: <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">Alt</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">P</kbd></span>
          </div>

          <div className="flex items-center gap-3">
            {copiedHex && (
              <span className="text-xs font-mono text-[var(--accent)] animate-pulse">
                Copied {copiedHex} to clipboard!
              </span>
            )}
            <button
              onClick={closeComparison}
              className="px-4 py-1.5 rounded-lg bg-[var(--primary)] text-[#080C16] font-mono text-xs font-semibold tracking-wider hover:opacity-90 transition-opacity"
            >
              Done Exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
