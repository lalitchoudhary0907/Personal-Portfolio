/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  X,
} from 'lucide-react';
import { AchievementEntry } from '../../types';

interface CertificateModalProps {
  cert: AchievementEntry | null;
  onClose: () => void;
}

/**
 * Full-Size Viewing Modal for Genuine Certificate Files
 * Lazy-loaded on demand to keep initial bundle size lean.
 */
export const CertificateModal: React.FC<CertificateModalProps> = ({ cert, onClose }) => {
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

export default CertificateModal;
