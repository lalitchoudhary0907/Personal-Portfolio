/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { profile } from '../data/profile';
import { Heading, SerifAccent, Body } from './Typography';
import { Reveal, SectionLabelCounter } from './Reveal';

export const About: React.FC = () => {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative w-full py-[12vh] px-6 sm:px-10 max-w-7xl mx-auto border-t border-[var(--line)] select-none"
    >
      <div className="mb-12 sm:mb-16">
        <SectionLabelCounter label="02 / ABOUT" className="mb-4" />
        <Heading id="about-heading">
          Background &amp; <SerifAccent>Focus</SerifAccent>
        </Heading>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16 items-start">
        {/* Left: 2-3 sentences max using only verified facts, rising as a block */}
        <div className="md:col-span-8 flex flex-col gap-6">
          <Reveal variant="rise">
            <Body className="text-[clamp(1.2rem,2.2vw,1.75rem)] leading-[1.5] text-[var(--ink)] font-normal max-w-2xl">
              {profile.aboutText}
            </Body>
          </Reveal>

          <Reveal variant="rise" delay={0.15}>
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 font-display text-[13px] uppercase tracking-[0.1em] text-[#bbc7c6]">
              <div className="flex items-center gap-2">
                <span className="text-[#cbfffc] font-bold">&#10022;</span>
                <span className="text-[#edfffe]">Degree: {profile.education.degree}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#cbfffc] font-bold">&#10022;</span>
                <span className="text-[#edfffe]">Institution: {profile.education.institution}</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right: Optional Photo Slot with clip-path reveal (16px radius, Kelp surface) */}
        <div className="md:col-span-4 flex justify-start md:justify-end">
          {profile.photo ? (
            <Reveal variant="image">
              <img
                src={profile.photo}
                alt={profile.name}
                width={320}
                height={400}
                loading="lazy"
                decoding="async"
                className="w-full max-w-xs aspect-[4/5] object-cover rounded-[16px] border border-white/10 bg-[#003734]"
              />
            </Reveal>
          ) : (
            <Reveal variant="rise" delay={0.1}>
              <div
                aria-hidden="true"
                className="w-full max-w-xs aspect-[4/5] bg-[#003734] border border-white/10 rounded-[16px] flex flex-col items-center justify-center p-6 text-center"
              >
                <span className="font-display font-medium text-5xl text-[#cbfffc]/30 tracking-tight">
                  LC
                </span>
                <span className="font-display text-[11px] uppercase tracking-[0.12em] text-[#edfffe] mt-3">
                  Auros Portrait Slot
                </span>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
};

export const AboutSection = About;
