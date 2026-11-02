/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  FileText,
  ShieldCheck,
  X,
  Clock,
  Sparkles,
  Trophy,
  FileUp,
  Maximize2,
} from 'lucide-react';
import { certificatesData } from '../../data/certificates';
import { AchievementEntry } from '../../types';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/Typography';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { cn } from '../../lib/utils';

type AchievementFilter =
  | 'All Milestones'
  | 'Available Documents'
  | 'WorldQuant BRAIN'
  | 'Open Source & Hackathon';

/**
 * Authentic visual certificate preview card for verified documents
 */
const CertificateVisualPreview: React.FC<{
  cert: AchievementEntry;
  onOpenModal: () => void;
}> = ({ cert, onOpenModal }) => {
  const isGold = cert.level?.includes('Gold');
  const isHackathon = cert.category.includes('Open Source');

  return (
    <div
      onClick={onOpenModal}
      className={cn(
        'relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group select-none border transition-all duration-300',
        isGold
          ? 'bg-gradient-to-br from-[#121626] via-[#1a1c2e] to-[#0d111d] border-amber-500/30 group-hover:border-amber-400/60 shadow-inner'
          : isHackathon
            ? 'bg-gradient-to-br from-[#0c1824] via-[#102434] to-[#0a1420] border-cyan-500/30 group-hover:border-cyan-400/60 shadow-inner'
            : 'bg-gradient-to-br from-[#0e1628] to-[#080d18] border-slate-700/60 group-hover:border-slate-500 shadow-inner'
      )}
    >
      {/* Decorative Guilloche/Border Pattern */}
      <div className="absolute inset-2.5 rounded-lg border border-dashed border-white/[0.12] pointer-events-none" />
      <div className="absolute inset-3.5 rounded-md border border-white/[0.06] pointer-events-none" />

      {/* Certificate Content Layout */}
      <div className="relative h-full flex flex-col justify-between p-5 text-center z-0">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                isGold ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'bg-cyan-400'
              )}
            />
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
              {cert.issuer}
            </span>
          </div>

          <span
            className={cn(
              'text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border',
              isGold
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
            )}
          >
            {cert.fileSize || 'PDF Document'}
          </span>
        </div>

        {/* Center Insignia & Title */}
        <div className="my-auto space-y-1.5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.1] text-amber-400 mx-auto shadow-sm">
            {isGold ? (
              <Trophy className="w-5 h-5 text-amber-400" />
            ) : (
              <Award className="w-5 h-5 text-cyan-400" />
            )}
          </div>

          <div className="text-[11px] font-serif tracking-widest uppercase text-slate-300 font-medium">
            Certificate of Accomplishment
          </div>

          <div
            className={cn(
              'text-sm sm:text-base font-bold tracking-tight',
              isGold
                ? 'bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent'
                : 'text-white'
            )}
          >
            {cert.title}
          </div>

          <div className="text-[10.5px] text-slate-400 font-mono">
            Awarded to <span className="text-white font-medium">Lalit Choudhary</span>
          </div>
        </div>

        {/* Bottom Signatory Bar */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/[0.08] pt-2">
          <span className="truncate max-w-[150px]">{cert.authority || 'Verified Authority'}</span>
          <span className="font-mono text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>View PDF</span>
            <Eye className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Hover Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 p-4 z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs shadow-lg transform -translate-y-1 group-hover:translate-y-0 transition-transform">
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Open Full Certificate</span>
        </span>
        <span className="text-[11px] text-slate-300 font-mono">Click to preview document</span>
      </div>
    </div>
  );
};

/**
 * Honest Pending-Content State for Milestones Awaiting PDF Upload
 */
const PendingCertificatePlaceholder: React.FC<{ cert: AchievementEntry }> = ({ cert }) => {
  const isSilver = cert.level?.includes('Silver');
  const isBronze = cert.level?.includes('Bronze');

  return (
    <div
      className={cn(
        'relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-dashed select-none flex flex-col justify-between p-5 text-center',
        isSilver
          ? 'bg-slate-900/30 border-slate-700/80 text-slate-400'
          : isBronze
            ? 'bg-orange-950/10 border-orange-800/40 text-slate-400'
            : 'bg-slate-900/20 border-slate-800 text-slate-400'
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="text-slate-400 uppercase tracking-widest">{cert.issuer}</span>
        <span className="inline-flex items-center gap-1 text-amber-500/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
          <Clock className="w-2.5 h-2.5" />
          <span>Pending Upload</span>
        </span>
      </div>

      {/* Center Details */}
      <div className="my-auto space-y-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 mx-auto">
          <FileUp className="w-4 h-4 text-slate-400" />
        </div>

        <div className="space-y-0.5">
          <div className="text-sm font-semibold text-slate-300">{cert.title}</div>
          <div className="text-[11px] text-slate-400 font-medium">Milestone Verified by Candidate</div>
        </div>

        <p className="text-[10.5px] text-slate-400 line-clamp-2 max-w-[240px] mx-auto leading-relaxed">
          Official certificate document awaiting user upload. Will be published upon file submission.
        </p>
      </div>

      {/* Footer Status */}
      <div className="text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        <span>Factual Milestone · No Simulated PDF</span>
      </div>
    </div>
  );
};

/**
 * Full-Size Viewing Modal for Genuine Certificate Files
 */
const CertificateModal: React.FC<{
  cert: AchievementEntry | null;
  onClose: () => void;
}> = ({ cert, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!cert || !cert.certificatePath) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0c1424] text-slate-100 rounded-2xl border border-slate-700/70 shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-[#070d19]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-[280px] sm:max-w-md">
                  {cert.title}
                </h3>
                {cert.level && (
                  <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {cert.level}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Issuer: <span className="text-slate-200">{cert.issuer}</span>
                {cert.date && <span> &middot; {cert.date}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={cert.certificatePath}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm transition-colors cursor-pointer"
              title="Download Genuine Certificate PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close certificate viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal PDF Viewer Body */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#060a12] flex flex-col items-center justify-center min-h-[420px] sm:min-h-[500px]">
          <iframe
            src={`${cert.certificatePath}#toolbar=0&navpanes=0`}
            title={cert.title}
            className="w-full h-[55vh] rounded-xl border border-slate-800 bg-[#0c1424] shadow-inner"
          />

          {/* Verification Footnote */}
          <div className="w-full mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 border-t border-slate-800/80 pt-3">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Genuine verification document issued to Lalit Choudhary</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={cert.certificatePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
              >
                <span>Open in standalone tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const AchievementsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<AchievementFilter>('All Milestones');
  const [selectedCert, setSelectedCert] = useState<AchievementEntry | null>(null);

  const filters: AchievementFilter[] = [
    'All Milestones',
    'Available Documents',
    'WorldQuant BRAIN',
    'Open Source & Hackathon',
  ];

  const filteredAchievements = certificatesData.filter((item) => {
    if (activeFilter === 'Available Documents') return item.hasGenuineFile;
    if (activeFilter === 'WorldQuant BRAIN') return item.issuer.includes('WorldQuant');
    if (activeFilter === 'Open Source & Hackathon') return item.category.includes('Open Source');
    return true;
  });

  return (
    <section id="achievements" className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-violet-500/10 blur-[130px] pointer-events-none -z-10" />

      <Container>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono mb-4">
            <Trophy className="w-3.5 h-3.5" />
            <span>HONORS &amp; CERTIFICATIONS</span>
          </div>

          <SectionHeading className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Achievements &amp; Milestones
          </SectionHeading>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            Quantitative milestones, challenge achievements, and open-source hackathon recognition attained by{' '}
            <span className="text-slate-900 dark:text-slate-100 font-medium">Lalit Choudhary</span>. Only
            authentic certificates with verifiable files are displayed for viewing and download.
          </p>

          {/* Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-full p-1.5 rounded-2xl bg-slate-100/80 dark:bg-[#0c1424]/80 border border-slate-200 dark:border-white/[0.08] backdrop-blur-md">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    'relative px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 select-none cursor-pointer',
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeAchievementFilter"
                      className="absolute inset-0 bg-gradient-to-r from-amber-600 to-cyan-600 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{filter}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Certificate Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {filteredAchievements.map((item) => {
            const isGold = item.level?.includes('Gold');

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex"
              >
                <Card
                  variant="glass"
                  className={cn(
                    'flex flex-col justify-between w-full h-full border transition-all duration-300 p-6 sm:p-7',
                    isGold
                      ? 'border-amber-500/30 hover:border-amber-400/50 bg-white/70 dark:bg-[#0c1424]/90'
                      : 'border-slate-200 dark:border-white/[0.08] hover:border-cyan-500/40 bg-white/70 dark:bg-[#0c1424]/90'
                  )}
                >
                  <div>
                    {/* Header info bar */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div>
                        <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                          {item.issuer}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                          {item.title}
                        </h3>
                      </div>

                      {item.hasGenuineFile ? (
                        <span className="text-[10.5px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Verified Certificate
                        </span>
                      ) : (
                        <span className="text-[10.5px] font-mono font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3 text-amber-400" />
                          Document Pending
                        </span>
                      )}
                    </div>

                    {/* Certificate Preview or Pending Placeholder */}
                    <div className="mb-5">
                      {item.hasGenuineFile ? (
                        <CertificateVisualPreview
                          cert={item}
                          onOpenModal={() => setSelectedCert(item)}
                        />
                      ) : (
                        <PendingCertificatePlaceholder cert={item} />
                      )}
                    </div>

                    {/* Summary description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.summary}
                    </p>

                    {item.authority && (
                      <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                        Signatory: <span className="text-slate-700 dark:text-slate-300">{item.authority}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-5 mt-5 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between gap-3">
                    {item.hasGenuineFile && item.certificatePath ? (
                      <>
                        <button
                          onClick={() => setSelectedCert(item)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Full-Size</span>
                        </button>

                        <a
                          href={item.certificatePath}
                          download
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-sm transition-all duration-200 border border-cyan-400/30"
                          title="Download Certificate PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </a>
                      </>
                    ) : (
                      <div className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                        <span>Milestone Verified</span>
                        <span className="text-amber-500/90 text-[11px]">PDF Pending Upload</span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>

      {/* Full-size PDF Viewing Modal */}
      <AnimatePresence>
        {selectedCert && (
          <CertificateModal
            cert={selectedCert}
            onClose={() => setSelectedCert(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
