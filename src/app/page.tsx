/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { SkillsSection } from '../components/sections/SkillsSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';

// Code-split below-the-fold components to minimize initial JS payload
const GitHubActivitySection = React.lazy(() =>
  import('../components/sections/GitHubActivitySection').then((m) => ({
    default: m.GitHubActivitySection,
  }))
);

const AchievementsSection = React.lazy(() =>
  import('../components/sections/AchievementsSection').then((m) => ({
    default: m.AchievementsSection,
  }))
);

const ContactSection = React.lazy(() =>
  import('../components/sections/ContactSection').then((m) => ({
    default: m.ContactSection,
  }))
);

const SectionSkeleton: React.FC<{ id?: string; minHeight?: string }> = ({
  id,
  minHeight = 'min-h-[420px]',
}) => (
  <section
    id={id}
    className={`w-full ${minHeight} flex items-center justify-center py-20 opacity-40`}
    aria-busy="true"
  >
    <div className="w-6 h-6 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
  </section>
);

export const HomePage: React.FC = () => {
  return (
    <div className="w-full flex-1 flex flex-col">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <Suspense fallback={<SectionSkeleton id="github" minHeight="min-h-[460px]" />}>
        <GitHubActivitySection id="github" />
      </Suspense>
      <Suspense fallback={<SectionSkeleton id="achievements" minHeight="min-h-[500px]" />}>
        <AchievementsSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton id="contact" minHeight="min-h-[480px]" />}>
        <ContactSection id="contact" />
      </Suspense>
    </div>
  );
};
