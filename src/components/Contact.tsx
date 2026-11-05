/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { profile } from '../data/profile';
import { useMagnetic } from '../hooks/useMagnetic';
import { Heading, SerifAccent } from './Typography';
import { SectionLabelCounter } from './Reveal';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const emailMagnetic = useMagnetic<HTMLAnchorElement>({
    radius: 90,
    pullFactor: 0.25,
    maxOffset: 8,
  });

  const copyEmailMagnetic = useMagnetic<HTMLButtonElement>({
    radius: 70,
    pullFactor: 0.25,
    maxOffset: 8,
  });

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    }
  };

  return (
    <section
      id="contact"
      data-cursor="on-dark"
      aria-labelledby="contact-heading"
      className="relative w-full bg-[var(--ink)] text-[var(--paper)] py-[12vh] px-6 sm:px-10 select-none"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header with drawing rule line */}
        <div className="mb-12 sm:mb-16">
          <SectionLabelCounter
            label="05 / CONTACT"
            lineColor="bg-[var(--paper)]/30"
            className="mb-4 text-[var(--paper-deep)]/70"
          />
          <Heading id="contact-heading" className="text-[var(--paper)]">
            Direct <SerifAccent className="text-[var(--paper-deep)]">Dialogue</SerifAccent>
          </Heading>
        </div>

        {/* Giant Email Link with magnetic interaction and micro-feedback */}
        <div className="py-8 sm:py-12 border-t border-[var(--paper)]/15">
          <motion.a
            ref={emailMagnetic.ref}
            style={emailMagnetic.style}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: 0.2, ease: [0.76, 0, 0.24, 1] }}
            href={`mailto:${profile.contact.email}`}
            data-cursor="link"
            aria-label={`Send email to ${profile.contact.email}`}
            className="font-display text-[clamp(1.75rem,5.5vw,4.5rem)] font-bold tracking-tight text-[var(--paper)] hover:text-[var(--paper-deep)] break-all inline-block transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--oxblood)]"
          >
            {profile.contact.email}
          </motion.a>

          {/* Action Row: Copy Email + Copied Live Notification */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <motion.button
              ref={copyEmailMagnetic.ref}
              style={copyEmailMagnetic.style}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.76, 0, 0.24, 1] }}
              type="button"
              onClick={handleCopyEmail}
              data-cursor="link"
              aria-label="Copy email address to clipboard"
              className="min-h-[44px] inline-flex items-center justify-center font-mono text-xs uppercase tracking-widest px-6 py-3 border border-[var(--paper)]/30 hover:border-[var(--paper)] text-[var(--paper)] hover:bg-[var(--paper)]/10 transition-colors cursor-pointer"
            >
              {copied ? 'Copied to Clipboard' : 'Copy Email'}
            </motion.button>

            {/* Screen reader & visual status announcement */}
            <div aria-live="polite" className="font-mono text-xs text-[var(--paper-deep)]">
              {copied && (
                <span className="flex items-center gap-1.5 text-[var(--paper)]">
                  <span>✦</span> Email copied to clipboard
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Social / Profile Links */}
        <div className="pt-10 border-t border-[var(--paper)]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--paper-deep)]/70">
            External Profiles
          </span>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8 font-mono text-xs uppercase tracking-widest">
            {profile.contact.github && (
              <a
                href={profile.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                aria-label="GitHub profile (opens in new window)"
                className="group min-h-[44px] inline-flex items-center gap-1.5 px-2 py-2 text-[var(--paper)] hover:text-[var(--paper-deep)] transition-colors duration-200"
              >
                <span>GitHub</span>
                <span
                  aria-hidden="true"
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                >
                  &nearr;
                </span>
              </a>
            )}

            {profile.contact.linkedin && (
              <a
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                aria-label="LinkedIn profile (opens in new window)"
                className="group min-h-[44px] inline-flex items-center gap-1.5 px-2 py-2 text-[var(--paper)] hover:text-[var(--paper-deep)] transition-colors duration-200"
              >
                <span>LinkedIn</span>
                <span
                  aria-hidden="true"
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                >
                  &nearr;
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export const ContactSection = Contact;
