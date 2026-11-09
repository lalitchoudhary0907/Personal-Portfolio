/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Display, Heading, Body, SerifAccent, Label } from './Typography';
import { useTheme } from '../context/ThemeContext';
import { PALETTE_LIST } from '../config/palettes';
import { PaletteId } from '../types/theme';

export const StyleGuide: React.FC = () => {
  const { paletteId, setPaletteId, activePalette } = useTheme();

  const swatches = [
    {
      name: 'Background Void',
      token: '--paper',
      hex: activePalette.colors.background,
      bgStyle: { backgroundColor: activePalette.colors.background },
      borderClass: 'border-white/10',
      textClass: 'text-[var(--ink)]',
      role: 'Main canvas viewport background',
      contrast: `${activePalette.contrast.textOnBackground} (Text / BG)`,
    },
    {
      name: 'Surface Card',
      token: '--paper-deep',
      hex: activePalette.colors.surface,
      bgStyle: { backgroundColor: activePalette.colors.surface },
      borderClass: 'border-white/10',
      textClass: 'text-[var(--ink)]',
      role: 'Card surfaces & elevated panels',
      contrast: `${activePalette.contrast.textOnSurface} (Text / Surface)`,
    },
    {
      name: 'Primary Brand',
      token: '--primary',
      hex: activePalette.colors.primary,
      bgStyle: { backgroundColor: activePalette.colors.primary },
      borderClass: 'border-transparent',
      textClass: 'text-[#08090D]',
      role: 'Primary action buttons, active navigation, key highlights',
      contrast: `${activePalette.contrast.primaryOnBackground} (AAA)`,
    },
    {
      name: 'Secondary Accent',
      token: '--secondary',
      hex: activePalette.colors.secondary,
      bgStyle: { backgroundColor: activePalette.colors.secondary },
      borderClass: 'border-transparent',
      textClass: 'text-[#08090D]',
      role: 'Secondary typography, subtle labels, architectural tags',
      contrast: 'Secondary tone',
    },
    {
      name: 'High-Frequency Accent',
      token: '--accent',
      hex: activePalette.colors.accent,
      bgStyle: { backgroundColor: activePalette.colors.accent },
      borderClass: 'border-transparent',
      textClass: 'text-[#08090D]',
      role: 'Luminescent highlights, interactive badges, hover glow',
      contrast: `${activePalette.contrast.accentOnBackground} (AAA)`,
    },
    {
      name: 'Structural Hairline',
      token: '--line',
      hex: activePalette.colors.border,
      bgStyle: { backgroundColor: activePalette.colors.border },
      borderClass: 'border-white/10',
      textClass: 'text-[var(--ink)]',
      role: '1px glass dividers & structural bounds',
      contrast: 'Glass Line',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] px-6 py-12 sm:py-20 transition-colors duration-500">
      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
        {/* Style Guide Header */}
        <header className="border-b border-[var(--line)] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <Label className="block mb-2 text-[var(--ink-muted)]">00 / System Specification</Label>
            <Heading as="h1" className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--ink)]">
              Design Tokens &amp; <SerifAccent className="text-[var(--primary)]">Identities</SerifAccent>
            </Heading>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="font-mono text-xs uppercase tracking-[0.12em] px-4 py-2 border border-[var(--line)] bg-[var(--paper)] hover:bg-[var(--paper-deep)] transition-colors text-[var(--ink)]"
            >
              &larr; Return to Portfolio
            </a>
          </div>
        </header>

        {/* 0. Four Curated Colour Palettes Section */}
        <section aria-labelledby="palettes-title" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Label className="block mb-1 text-[var(--ink-muted)]">01 / Curated Palettes (Part 2)</Label>
              <Heading as="h2" className="text-2xl sm:text-3xl font-semibold text-[var(--ink)]">
                Four Brand Exploration Identities
              </Heading>
            </div>
            <div className="font-mono text-xs text-[var(--ink-muted)]">
              Currently Active: <span className="text-[var(--primary)] font-bold">{activePalette.name}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {PALETTE_LIST.map((p) => {
              const isSelected = paletteId === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-[var(--primary)] ring-1 ring-[var(--primary)]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  style={{ backgroundColor: p.colors.surface }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold"
                      style={{ backgroundColor: p.colors.primary, color: p.colors.background }}
                    >
                      {p.letter}
                    </span>
                    <button
                      onClick={() => setPaletteId(p.id as PaletteId)}
                      className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold transition-transform active:scale-95"
                      style={{
                        backgroundColor: isSelected ? p.colors.primary : 'transparent',
                        color: isSelected ? p.colors.background : p.colors.primary,
                        border: `1px solid ${p.colors.primary}`,
                      }}
                    >
                      {isSelected ? '✓ Active' : 'Switch'}
                    </button>
                  </div>
                  <h3 className="font-serif text-sm font-semibold text-white mb-1">{p.name}</h3>
                  <p className="text-[11px] text-[#8B9BB4] line-clamp-2 mb-3">{p.visualIdentity}</p>
                  
                  <div className="flex gap-1 h-3 rounded overflow-hidden">
                    <div style={{ backgroundColor: p.colors.background, flex: 2 }} title="Background" />
                    <div style={{ backgroundColor: p.colors.surface, flex: 2 }} title="Surface" />
                    <div style={{ backgroundColor: p.colors.primary, flex: 3 }} title="Primary" />
                    <div style={{ backgroundColor: p.colors.secondary, flex: 2 }} title="Secondary" />
                    <div style={{ backgroundColor: p.colors.accent, flex: 2 }} title="Accent" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 1. Color Palette Swatches */}
        <section aria-labelledby="tokens-title" className="space-y-8 border-t border-[var(--line)] pt-12">
          <div>
            <Label className="block mb-1 text-[var(--ink-muted)]">02 / Active Semantic Tokens</Label>
            <Heading as="h2" className="text-2xl sm:text-3xl font-semibold text-[var(--ink)]">
              Dynamic Token Bindings
            </Heading>
            <Body muted className="mt-2 text-sm text-[var(--ink-muted)]">
              All CSS custom properties mapped to active palette {activePalette.letter} ({activePalette.name}).
            </Body>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {swatches.map((s) => (
              <div
                key={s.token}
                className="border border-[var(--line)] bg-[var(--paper-deep)] p-4 flex flex-col justify-between rounded-xl"
              >
                <div
                  style={s.bgStyle}
                  className={`w-full h-24 border ${s.borderClass} flex items-center justify-center p-3 rounded-lg shadow-inner`}
                >
                  <span className={`font-mono text-xs uppercase tracking-wider font-semibold ${s.textClass}`}>
                    {s.hex}
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--line)]">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-base text-[var(--ink)]">{s.name}</span>
                    <code className="font-mono text-xs text-[var(--ink-muted)]">{s.token}</code>
                  </div>
                  <p className="mt-1 font-display text-xs text-[var(--ink-muted)] leading-relaxed">{s.role}</p>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-[var(--primary)]">
                    {s.contrast}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Typography Scale */}
        <section aria-labelledby="typography-title" className="space-y-12 border-t border-line pt-12 sm:pt-16">
          <div>
            <Label className="block mb-1 text-ink-muted">02 / Typographic Identity</Label>
            <Heading as="h2" className="text-2xl sm:text-3xl font-semibold">
              Type Utilities &amp; Hierarchy
            </Heading>
            <Body muted className="mt-2 text-sm">
              Bricolage Grotesque (variable wght/wdth), Instrument Serif Italic, and DM Mono.
            </Body>
          </div>

          {/* Display Preview */}
          <div className="border border-line bg-paper-deep p-6 sm:p-10 space-y-3">
            <Label className="text-ink-muted">Display &middot; clamp(3rem, 14vw, 13rem) &middot; leading 0.9 &middot; tracking -0.04em</Label>
            <Display className="break-words">
              FOLIO
            </Display>
          </div>

          {/* Heading Preview */}
          <div className="border border-line bg-paper-deep p-6 sm:p-10 space-y-3">
            <Label className="text-ink-muted">Heading &middot; clamp(1.85rem, 4.5vw, 3.5rem) &middot; leading 0.98 &middot; tracking -0.03em</Label>
            <Heading className="break-words">
              A Printed Monograph in <SerifAccent>Movement</SerifAccent>
            </Heading>
          </div>

          {/* SerifAccent Sample Line */}
          <div className="border border-line bg-paper-deep p-6 sm:p-10 space-y-3">
            <Label className="text-ink-muted">SerifAccent &middot; Instrument Serif Italic &middot; Oxblood Accent</Label>
            <p className="font-display text-2xl sm:text-4xl text-ink leading-tight">
              Exploring systems, code, and <SerifAccent>quantitative</SerifAccent> models.
            </p>
            <Body muted className="text-xs">
              Rule: Single accent words only per heading. Never paragraphs or entire sentences.
            </Body>
          </div>

          {/* Body Text Preview */}
          <div className="border border-line bg-paper-deep p-6 sm:p-10 space-y-3">
            <Label className="text-ink-muted">Body &middot; 17px &middot; leading 1.55 &middot; max 62ch &middot; WCAG AA (14.8:1)</Label>
            <Body>
              A printed monograph that moves. An oxblood cover opens to an editorial paper page.
              Typography is the identity. No gradients, no glow, no glassmorphism, no neon, no
              dashboard styling, and no terminal gimmicks. Every surface respects the tactile
              quality of ink pressed into heavy cream stock.
            </Body>
            <div className="pt-2">
              <Label className="block mb-1 text-ink-muted">Body Muted &middot; WCAG AA (5.2:1)</Label>
              <Body muted>
                Secondary text reserved for background context, sub-indices, and captions.
              </Body>
            </div>
          </div>

          {/* Label Preview */}
          <div className="border border-line bg-paper-deep p-6 sm:p-10 space-y-3">
            <Label className="text-ink-muted">Label &middot; DM Mono &middot; uppercase 12px &middot; tracking 0.12em</Label>
            <div className="flex flex-wrap gap-4 pt-2">
              <Label>01 / WORK</Label>
              <Label>02 / ABOUT</Label>
              <Label>03 / ACHIEVEMENTS</Label>
              <Label muted>FIG. 1.0 &mdash; MONOGRAPH INDEX</Label>
            </div>
          </div>

          {/* Interactive State Verification (Focus Ring & Selection) */}
          <div className="border border-line bg-paper-deep p-6 sm:p-10 space-y-4">
            <Label className="text-ink-muted">Interactive State &middot; Focus Ring (2px oxblood, 3px offset) &middot; Selection</Label>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="font-mono text-xs uppercase tracking-[0.12em] px-5 py-2.5 border border-ink bg-ink text-paper transition-colors cursor-pointer"
              >
                Tab to test focus ring
              </button>
              <button
                type="button"
                className="font-mono text-xs uppercase tracking-[0.12em] px-5 py-2.5 border border-line bg-paper text-ink transition-colors cursor-pointer"
              >
                Secondary button
              </button>
            </div>
            <Body muted className="text-xs pt-1">
              Select any text in this container to verify the oxblood on paper selection highlight.
            </Body>
          </div>
        </section>

        {/* Inverted Section Verification */}
        <section aria-labelledby="inverted-title" className="p-8 sm:p-12 bg-ink text-paper space-y-4">
          <Label className="text-paper/60">Inverted Surface Contract &middot; Background Ink, Text Paper</Label>
          <Heading as="h2" className="text-paper text-2xl sm:text-4xl">
            The Inverted <SerifAccent className="text-oxblood">Contact</SerifAccent> Mode
          </Heading>
          <p className="font-display text-base text-paper/85 max-w-[62ch] leading-relaxed">
            In the final section, the monograph inverts to deep ink with paper typography, maintaining
            pure dual-contrast without introducing foreign chromatic shades.
          </p>
        </section>
      </div>
    </div>
  );
};
