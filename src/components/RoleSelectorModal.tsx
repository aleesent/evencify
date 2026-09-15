import React from 'react';
import { UserRole } from '../types';
import { X, UserCheck, Building2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: 'crew' | 'organiser') => void;
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg overflow-hidden rounded-[28px] border-2 border-black bg-white p-6 sm:p-8 shadow-2xl z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 rounded-full p-2 text-black hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Heading */}
          <div className="mb-6 pr-8">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#FED000] px-3 py-1 text-[11px] font-black tracking-wider text-black uppercase mb-3">
              <span className="h-2 w-2 rounded-full bg-black" />
              ACCOUNT TYPE
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
              Choose how you’ll use <span className="underline decoration-4 decoration-[#FED000]">Evencify.</span>
            </h2>
            <p className="mt-1.5 text-sm font-semibold text-black">
              Select your role to get started with verified access.
            </p>
          </div>

          {/* 2 Role Cards */}
          <div className="space-y-3.5">
            {/* Crew Card */}
            <button
              onClick={() => {
                onSelectRole('crew');
                onClose();
              }}
              className="group relative flex w-full items-start gap-4 rounded-2xl border-2 border-black bg-[#FFFDE6] p-5 text-left transition-all duration-200 hover:bg-[#FEF3C7] cursor-pointer"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FED000] text-black border-2 border-black group-hover:scale-105 transition-transform">
                <UserCheck className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-black">
                    CREW MEMBER
                  </span>
                  <ArrowRight className="h-4 w-4 text-black group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="mt-1 text-lg font-black text-black">
                  I’m a Crew Member
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-black leading-relaxed">
                  Find event opportunities, apply for roles and build your professional profile.
                </p>
              </div>
            </button>

            {/* Organiser Card */}
            <button
              onClick={() => {
                onSelectRole('organiser');
                onClose();
              }}
              className="group relative flex w-full items-start gap-4 rounded-2xl border-2 border-black bg-white p-5 text-left transition-all duration-200 hover:bg-[#FFFDE6] cursor-pointer"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-[#FED000] border-2 border-black group-hover:scale-105 transition-transform">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-black">
                    EVENT ORGANISER
                  </span>
                  <ArrowRight className="h-4 w-4 text-black group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="mt-1 text-lg font-black text-black">
                  I’m an Event Organiser
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-black leading-relaxed">
                  Create events, find crew and manage your event team.
                </p>
              </div>
            </button>
          </div>

          <div className="mt-6 border-t-2 border-black/15 pt-4 text-center">
            <p className="text-xs font-bold text-black">
              Select your role to get started with your customized dashboard.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
