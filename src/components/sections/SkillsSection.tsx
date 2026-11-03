/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useId } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Sparkles, Layers, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';
import { SectionHeading, Kicker } from '../ui/Typography';
import { TechTag } from '../ui/Tag';
import { TechIcon } from '../ui/TechIcon';
import { skillsData, SKILL_CATEGORIES } from '../../data/skills';
import { SkillCategory } from '../../types';
import { cn } from '../../lib/utils';

export const SkillsSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('All');
  const baseId = useId();

  const filteredSkills = selectedCategory === 'All'
    ? skillsData
    : skillsData.filter((skill) => skill.category === selectedCategory);

  return (
    <section
      id="skills"
      aria-label="Skills and Technologies"
      className="relative py-20 sm:py-28 overflow-hidden scroll-mt-24 border-t border-slate-200/80 dark:border-white/[0.06]"
    >
      <Container size="lg" className="space-y-12 sm:space-y-16">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3 max-w-2xl"
        >
          <Kicker>
            <span>Technical Capabilities</span>
            <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">&middot;</span>
            <span>Stack &amp; Frameworks</span>
          </Kicker>

          <SectionHeading>
            Skills, languages &amp;{' '}
            <span className="text-gradient-cyan-blue">technologies</span>.
          </SectionHeading>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Technologies and engineering workflows applied across coursework, open-source initiatives, and practical software projects.
          </p>
        </motion.div>

        {/* Category Filters: Accessible Segmented Tabs */}
        <div className="flex items-center overflow-x-auto no-scrollbar pb-2 pt-1 gap-1.5 sm:gap-2">
          <div
            role="tablist"
            aria-label="Skill category filters"
            className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08]"
          >
            {SKILL_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  id={`${baseId}-tab-${category}`}
                  aria-selected={isSelected}
                  aria-controls={`${baseId}-panel-${category}`}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'relative px-3 sm:px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95',
                    isSelected
                      ? 'text-slate-900 dark:text-cyan-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.04]'
                  )}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeSkillCategoryPill"
                      className="absolute inset-0 bg-white dark:bg-cyan-500/20 rounded-lg border border-slate-200/90 dark:border-cyan-400/40 shadow-xs"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills Grid */}
        <div
          role="tabpanel"
          id={`${baseId}-panel-${selectedCategory}`}
          aria-labelledby={`${baseId}-tab-${selectedCategory}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                layout={!prefersReducedMotion}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.25,
                  delay: prefersReducedMotion ? 0 : index * 0.03,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Card
                  variant="interactive"
                  glowingEdge={skill.highlight ? 'cyan' : 'none'}
                  className="p-5 h-full flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Official-looking icon + Category Tag */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center p-2 group-hover:scale-105 group-hover:border-cyan-500/50 transition-all duration-200 motion-reduce:group-hover:scale-100">
                        <TechIcon name={skill.iconName} className="w-5 h-5" />
                      </div>

                      <TechTag variant={skill.highlight ? 'cyan' : 'neutral'}>
                        {skill.category}
                      </TechTag>
                    </div>

                    {/* Skill Name */}
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {skill.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                        {skill.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Verification Indicator (No Fake Percentages) */}
                  <div className="pt-3 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirmed Skill</span>
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                      Production Stack
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Honest Stack Disclosure Footer */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>All technologies verified through active projects, coursework, and competitive milestones.</span>
          </div>

          <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
            {filteredSkills.length} of {skillsData.length} Technologies
          </span>
        </div>
      </Container>
    </section>
  );
};
