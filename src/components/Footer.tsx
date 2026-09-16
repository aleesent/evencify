import React from 'react';
import { motion } from 'motion/react';
import { EvencifyLogo } from './EvencifyLogo';
import { UserRole } from '../types';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { SEOFooterLinks } from './seo/SEOFooterLinks';

interface FooterProps {
  onSelectRole: (role: UserRole) => void;
  onNavigateSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#090A0D] text-white overflow-hidden">
      {/* Dynamic Animated Yellow Border Line at the top edge */}
      <div className="relative w-full h-[2px] bg-neutral-900 overflow-hidden z-20">
        {/* Subtle static ambient glow track */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FED000]/15 to-transparent" />

        {/* Primary radiant yellow beam sliding across */}
        <motion.div
          className="absolute top-0 bottom-0 w-64 sm:w-96 bg-gradient-to-r from-transparent via-[#FED000] to-transparent shadow-[0_0_14px_#FED000]"
          initial={{ x: '-100%' }}
          animate={{ x: '100vw' }}
          transition={{
            repeat: Infinity,
            duration: 4.2,
            ease: 'easeInOut',
          }}
        />

        {/* Secondary counter beam for fluid dynamic energy */}
        <motion.div
          className="absolute top-0 bottom-0 w-40 sm:w-60 bg-gradient-to-r from-transparent via-[#FFF066] to-transparent opacity-80 shadow-[0_0_10px_#FED000]"
          initial={{ x: '-50%' }}
          animate={{ x: '100vw' }}
          transition={{
            repeat: Infinity,
            duration: 6.8,
            ease: 'linear',
            delay: 1.6,
          }}
        />
      </div>

      {/* Dynamic Ambient Yellow Lighting behind content */}
      <motion.div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-32 bg-gradient-to-b from-[#FED000]/10 via-[#FED000]/3 to-transparent blur-3xl z-0"
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main Footer Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          
          {/* Brand & Mission Info (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <EvencifyLogo variant="dark" size="md" showTagline={true} />
            </div>

            <p className="max-w-md text-sm text-neutral-400 font-normal leading-relaxed">
              Evencify is India’s premier private event workforce infrastructure, connecting verified
              production crew, stage technicians, and coordinators with event planners and management companies.
            </p>

            {/* Trust & Guarantee Pill */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-800/90 bg-neutral-900/60 px-3.5 py-2 text-xs text-neutral-300">
                <ShieldCheck className="h-4 w-4 text-[#FED000] shrink-0" />
                <span>Escrow-secured payouts • Zero cut on crew rates</span>
              </div>
            </div>
          </div>

          {/* Column 1: For Crew (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-xs font-bold text-neutral-200 uppercase tracking-widest flex items-center gap-1.5">
              <span>For Crew</span>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onNavigateSection('for-crew')}
                  className="group flex items-center justify-between w-full hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span>Find Shifts</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#FED000] transition-all" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('for-crew')}
                  className="group flex items-center justify-between w-full hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span>Crew Categories</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#FED000] transition-all" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('trust-safety')}
                  className="group flex items-center justify-between w-full hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span>Same-Day Payouts</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#FED000] transition-all" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('trust-safety')}
                  className="group flex items-center justify-between w-full hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span>Digital Pass</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#FED000] transition-all" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: For Organisers (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-xs font-bold text-neutral-200 uppercase tracking-widest flex items-center gap-1.5">
              <span>For Organisers</span>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onNavigateSection('for-organisers')}
                  className="group flex items-center justify-between w-full hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span>Post Staffing Call</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#FED000] transition-all" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('for-organisers')}
                  className="group flex items-center justify-between w-full hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span>Browse Talent</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#FED000] transition-all" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('for-organisers')}
                  className="group flex items-center justify-between w-full hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span>Standby Buffers</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#FED000] transition-all" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('trust')}
                  className="group flex items-center justify-between w-full hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span>Escrow Protection</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#FED000] transition-all" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Governance & Admin Portal (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-xs font-bold text-neutral-200 uppercase tracking-widest flex items-center gap-1.5">
              <span>Governance</span>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onNavigateSection('trust-safety')}
                  className="group flex items-center justify-between w-full hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span>Verified Credentials Only</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#FED000] transition-all" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('trust-safety')}
                  className="group flex items-center justify-between w-full hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span>System-Generated Ratings</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#FED000] transition-all" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('trust-safety')}
                  className="group flex items-center justify-between w-full hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span>Private Database Policy</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#FED000] transition-all" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('trust-safety')}
                  className="group flex items-center justify-between w-full hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span>Enterprise Compliance</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#FED000] transition-all" />
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Dynamic SEO Internal Links for Surat, Gujarat, Cities, and Categories */}
        <SEOFooterLinks />

        {/* Bottom Sub-Bar */}
        <div className="mt-8 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© {currentYear} Evencify Technologies Pvt. Ltd. All rights reserved.</span>
            <span className="hidden sm:inline text-neutral-800">•</span>
            {/* Live operational status indicator */}
            <div className="inline-flex items-center justify-center gap-1.5 text-neutral-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>All Systems Operational</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-neutral-400">
            <button
              onClick={() => onNavigateSection('trust')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => onNavigateSection('faq')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              FAQs
            </button>
            <button
              onClick={() => onNavigateSection('trust')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy & Trust
            </button>
            <button
              onClick={() => onNavigateSection('trust')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

