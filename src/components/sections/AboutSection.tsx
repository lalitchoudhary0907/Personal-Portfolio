/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  GraduationCap,
  Code2,
  Cpu,
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  Camera,
  CheckCircle2,
  BookOpen,
  Terminal,
} from 'lucide-react';
import { Container } from '../ui/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { SectionHeading, Kicker } from '../ui/Typography';
import { TechTag } from '../ui/Tag';
import { portfolioData } from '../../data/portfolio';

export const AboutSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const edu = portfolioData.education[0];

  return (
    <section
      id="about"
      aria-label="About Me and Education"
      className="relative py-20 sm:py-28 overflow-hidden scroll-mt-24 border-t border-slate-200/80 dark:border-white/[0.06]"
    >
      <Container size="lg" className="space-y-16 sm:space-y-20">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3 max-w-2xl"
        >
          <Kicker>
            <span>Background &amp; Philosophy</span>
            <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">&middot;</span>
            <span>Who I Am</span>
          </Kicker>

          <SectionHeading>
            Bridging algorithmic rigor with{' '}
            <span className="text-gradient-cyan-blue">real-world software</span>.
          </SectionHeading>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            A look into my academic foundation at Newton School of Technology, technical interests, and the engineering principles guiding my work.
          </p>
        </motion.div>

        {/* Asymmetric Grid: Profile & Core Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column (5 Cols): Photo Slot & Quick Info Card */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Real Profile Photo Container (Zero Fake Photo Policy) */}
            <div className="relative group">
              <div
                aria-hidden="true"
                className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"
              />

              <div className="relative rounded-2xl border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-[#0c1424] overflow-hidden aspect-[4/3] sm:aspect-square flex flex-col items-center justify-center p-6 text-center shadow-lg">
                {/* Visual Placeholder / Avatar Badge */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-blue-600/20 to-violet-600/20 border border-cyan-500/30 flex items-center justify-center text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] mb-4">
                  LC
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {portfolioData.personalInfo.fullName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    BTech CS &amp; AI Undergraduate
                  </p>
                </div>

                {/* Upload Slot Notice */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/[0.08] flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <Camera className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Profile Photo Slot (Ready for upload)</span>
                </div>
              </div>
            </div>

            {/* Quick Profile Parameters */}
            <Card variant="glass" className="p-5 space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.08]">
                <span className="font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                  Candidate Profile
                </span>
                <TechTag variant="cyan">Student</TechTag>
              </div>

              <div className="space-y-2.5 text-slate-700 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Location</span>
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {edu.location}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                    <span>Institution</span>
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white text-right">
                    Newton School of Technology
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-violet-500" />
                    <span>Degree</span>
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    B.Tech in CS &amp; AI
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Recognition</span>
                  </span>
                  <span className="font-medium text-amber-600 dark:text-amber-400">
                    WorldQuant Gold Level
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right Column (7 Cols): Biography & Pillars */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Biography Narrative */}
            <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                I am a Computer Science &amp; Artificial Intelligence student at{' '}
                <strong className="text-slate-900 dark:text-white font-semibold">
                  Newton School of Technology (Rishihood University)
                </strong>
                , dedicated to understanding how complex systems function from first principles. My passion lies in transforming theoretical computational ideas into tangible tools that people and engineering teams can rely on.
              </p>

              <p>
                Whether building tools to catch drift between software architecture and developer documentation, or prototyping rapid-response safety applications, I approach software engineering with an emphasis on clarity, security, and deliberate craftsmanship.
              </p>
            </div>

            {/* Interest & Pillar Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Card variant="interactive" className="p-5 space-y-2 group">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/40 flex items-center justify-center group-hover:scale-105 transition-transform motion-reduce:transform-none">
                  <Code2 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Software Engineering
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Focusing on disciplined application architecture, Python programming, robust TypeScript implementations, and resilient APIs.
                </p>
              </Card>

              <Card variant="interactive" className="p-5 space-y-2 group">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center group-hover:scale-105 transition-transform motion-reduce:transform-none">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Applied AI &amp; Developer Tools
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Leveraging machine learning to eliminate workflow friction, automate documentation maintenance, and create intelligent developer utilities.
                </p>
              </Card>

              <Card variant="interactive" className="p-5 space-y-2 group">
                <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800/40 flex items-center justify-center group-hover:scale-105 transition-transform motion-reduce:transform-none">
                  <Terminal className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Open-Source &amp; Git
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Committed to open collaboration, clean version control habits, peer code reviews, and community hackathons like Hacktoberfest.
                </p>
              </Card>

              <Card variant="interactive" className="p-5 space-y-2 group">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center group-hover:scale-105 transition-transform motion-reduce:transform-none">
                  <Compass className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Long-Term Career Direction
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Aspiring to contribute to core engineering teams building scalable distributed backends, developer platforms, and applied intelligence systems.
                </p>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Education Timeline Section */}
        <motion.div
          id="education"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8 pt-8 scroll-mt-28"
        >
          <div className="space-y-2">
            <Kicker>
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic Pathway</span>
            </Kicker>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Education &amp; Institution
            </h3>
          </div>

          {/* Education Timeline Card */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-cyan-500/30 dark:border-cyan-400/30 space-y-6">
            {/* Timeline Indicator Dot */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-cyan-500 border-4 border-slate-50 dark:border-[#070b14] shadow-[0_0_10px_rgba(6,182,212,0.6)]" />

            <Card variant="elevated" glowingEdge="cyan" className="p-6 sm:p-7 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {edu.degree} in {edu.fieldOfStudy}
                  </h4>
                  <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                    {edu.institution}, {edu.university}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Undergraduate Degree (In Progress)</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Pursuing an intensive undergraduate degree integrating core computer science fundamentals with advanced artificial intelligence, distributed software design, and quantitative computing.
              </p>

              {/* Core Academic Curricula & Focus Areas */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Key Focus Areas
                </span>
                <div className="flex flex-wrap gap-2">
                  <TechTag variant="cyan">Data Structures &amp; Algorithms</TechTag>
                  <TechTag variant="blue">Artificial Intelligence &amp; ML</TechTag>
                  <TechTag variant="neutral">Python Programming</TechTag>
                  <TechTag variant="violet">Software Engineering</TechTag>
                  <TechTag variant="neutral">Database Systems &amp; Web</TechTag>
                </div>
              </div>

              {/* Academic Trust Marker */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enrolled Student &middot; Newton School of Technology</span>
                </div>
                <span>{edu.location}</span>
              </div>
            </Card>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
