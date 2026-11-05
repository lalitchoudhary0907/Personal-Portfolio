/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Display, Heading, Body, SerifAccent, Label } from './Typography';

export const StyleGuide: React.FC = () => {
  const swatches = [
    {
      name: 'Paper',
      token: '--paper',
      hex: '#F0E9DA',
      bgClass: 'bg-paper',
      borderClass: 'border-line',
      textClass: 'text-ink',
      role: 'Page canvas background',
      contrast: 'Base Canvas',
    },
    {
      name: 'Paper Deep',
      token: '--paper-deep',
      hex: '#E6DDC9',
      bgClass: 'bg-paper-deep',
      borderClass: 'border-line',
      textClass: 'text-ink',
      role: 'Bands & empty image slots',
      contrast: '13.2:1 with Ink',
    },
    {
      name: 'Ink',
      token: '--ink',
      hex: '#1C1512',
      bgClass: 'bg-ink',
      borderClass: 'border-ink',
      textClass: 'text-paper',
      role: 'Primary typography & strong lines',
      contrast: '14.8:1 on Paper (AAA)',
    },
    {
      name: 'Ink Muted',
      token: '--ink-muted',
      hex: '#6A5E54',
      bgClass: 'bg-ink-muted',
      borderClass: 'border-line',
      textClass: 'text-paper',
      role: 'Secondary copy, indices & captions',
      contrast: '5.2:1 on Paper (AA)',
    },
    {
      name: 'Oxblood',
      token: '--oxblood',
      hex: '#6B1522',
      bgClass: 'bg-oxblood',
      borderClass: 'border-oxblood',
      textClass: 'text-paper',
      role: 'Cover, strips, focus ring, serif accent word',
      contrast: '10.2:1 on Paper (AAA)',
    },
    {
      name: 'Line',
      token: '--line',
      hex: 'rgba(28,21,18,0.14)',
      bgClass: 'bg-ink/14',
      borderClass: 'border-line',
      textClass: 'text-ink',
      role: '1px hairlines & editorial dividers',
      contrast: '14% opacity Ink',
    },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink px-6 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
        {/* Style Guide Header */}
        <header className="border-b border-line pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <Label className="block mb-2 text-ink-muted">00 / System Specification</Label>
            <Heading as="h1" className="text-3xl sm:text-5xl font-bold tracking-tight">
              Design Tokens &amp; <SerifAccent>Typography</SerifAccent>
            </Heading>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="font-mono text-xs uppercase tracking-[0.12em] px-4 py-2 border border-line bg-paper hover:bg-paper-deep transition-colors text-ink"
            >
              &larr; Return to Portfolio
            </a>
          </div>
        </header>

        {/* 1. Color Palette Swatches */}
        <section aria-labelledby="tokens-title" className="space-y-8">
          <div>
            <Label className="block mb-1 text-ink-muted">01 / Palette &amp; Contrast</Label>
            <Heading as="h2" className="text-2xl sm:text-3xl font-semibold">
              Restricted Chromatic System
            </Heading>
            <Body muted className="mt-2 text-sm">
              Only four colours plus ink-muted and line. No gradients, glows, or synthetic accents.
            </Body>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {swatches.map((s) => (
              <div
                key={s.token}
                className="border border-line bg-paper-deep p-4 flex flex-col justify-between"
              >
                <div
                  className={`w-full h-24 border ${s.borderClass} ${s.bgClass} flex items-center justify-center p-3`}
                >
                  <span className={`font-mono text-xs uppercase tracking-wider font-medium ${s.textClass}`}>
                    {s.hex}
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-line">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-base text-ink">{s.name}</span>
                    <code className="font-mono text-xs text-ink-muted">{s.token}</code>
                  </div>
                  <p className="mt-1 font-display text-xs text-ink-muted leading-relaxed">{s.role}</p>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-oxblood">
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
