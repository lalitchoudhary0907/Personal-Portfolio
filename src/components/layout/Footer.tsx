/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { siteConfig } from '../../config/site';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-white/[0.08] bg-white/70 dark:bg-[#070b14]/70 backdrop-blur-md transition-colors py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} {siteConfig.name}</span>
          <span aria-hidden="true" className="text-cyan-500/50">&middot;</span>
          <span>Newton School of Technology, Rishihood University</span>
        </div>

        <div className="flex items-center gap-6">
          {siteConfig.socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
