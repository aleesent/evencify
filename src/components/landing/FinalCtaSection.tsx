import React from 'react';
import { ArrowRight, UserCheck, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ThreeDCardWrapper } from './ThreeDCardVisuals';

interface FinalCtaSectionProps {
  onJoinAsCrew?: () => void;
  onJoinAsOrganiser?: () => void;
  onJoinCrew?: () => void;
  onHireCrew?: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onJoinAsCrew,
  onJoinAsOrganiser,
  onJoinCrew,
  onHireCrew,
}) => {
  const handleCrew = onJoinCrew || onJoinAsCrew;
  const handleOrganiser = onHireCrew || onJoinAsOrganiser;

  return (
    <section id="final-cta" className="relative overflow-hidden py-20 lg:py-28 bg-white border-t border-neutral-200 text-neutral-950">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-5">
          {/* Eyebrow badge matching minimal aesthetic */}
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-[11px] font-semibold tracking-widest text-neutral-600 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
            <span>START YOUR NEXT EVENT TODAY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 leading-tight">
            Ready to change how you manage{' '}
            <span className="font-serif italic font-normal text-neutral-900">
              events and crew?
            </span>
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 font-normal max-w-2xl mx-auto leading-relaxed">
            Join thousands of verified event professionals across India. One platform for reliable crew hiring,
            instant assignment confirmations, and escrow-secured payments.
          </p>

          {/* Dual 3D Pathway Cards with physical tilt & specular sheen */}
          <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            
            {/* Crew Card */}
            <ThreeDCardWrapper>
              <div
                className="flex flex-col justify-between h-full rounded-[24px] sm:rounded-[28px] border border-neutral-200/80 bg-white p-7 transition-all duration-300 hover:border-neutral-400 group"
                style={{
                  boxShadow: 'rgba(40, 45, 25, 0.08) 0px 30px 60px -20px, rgba(0, 0, 0, 0.04) 0px 10px 20px -10px',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-xs">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-neutral-100 border border-neutral-200/80 px-3 py-1 text-[10px] font-bold tracking-wider text-neutral-700 uppercase">
                      FOR FREELANCERS & CREW
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight text-neutral-950">
                    Looking for event shifts?
                  </h3>
                  <p className="mt-2.5 text-sm text-neutral-600 font-normal leading-relaxed">
                    Build a verified credentials pass, discover high-paying shifts in your city, and receive immediate payments with zero platform commission.
                  </p>

                  <div className="mt-5 space-y-2.5">
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-neutral-800">
                      <CheckCircle2 className="h-4 w-4 text-neutral-950 shrink-0" />
                      <span>Direct organiser communication & briefing</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-neutral-800">
                      <CheckCircle2 className="h-4 w-4 text-neutral-950 shrink-0" />
                      <span>Zero commission taken from your shift fee</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-neutral-800">
                      <CheckCircle2 className="h-4 w-4 text-neutral-950 shrink-0" />
                      <span>Same-day UPI disbursement on shift completion</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-neutral-100">
                  <button
                    onClick={handleCrew}
                    className="group/btn w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-950 py-3.5 px-5 text-sm font-semibold text-white hover:bg-neutral-800 transition-all active:scale-[0.98] cursor-pointer shadow-xs"
                  >
                    <span>Join as Crew</span>
                    <ArrowRight className="h-4 w-4 text-white transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </ThreeDCardWrapper>

            {/* Organiser Card */}
            <ThreeDCardWrapper>
              <div
                className="flex flex-col justify-between h-full rounded-[24px] sm:rounded-[28px] border border-neutral-200/80 bg-white p-7 transition-all duration-300 hover:border-neutral-400 group"
                style={{
                  boxShadow: 'rgba(40, 45, 25, 0.08) 0px 30px 60px -20px, rgba(0, 0, 0, 0.04) 0px 10px 20px -10px',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-950">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-neutral-950 text-white px-3 py-1 text-[10px] font-bold tracking-wider uppercase">
                      FOR EVENT MANAGERS
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight text-neutral-950">
                    Organising an event?
                  </h3>
                  <p className="mt-2.5 text-sm text-neutral-600 font-normal leading-relaxed">
                    Post shifts with department criteria, review rated talent with verified credentials, and lock in standby buffers against last-minute dropouts.
                  </p>

                  <div className="mt-5 space-y-2.5">
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-neutral-800">
                      <CheckCircle2 className="h-4 w-4 text-neutral-950 shrink-0" />
                      <span>Post event staffing call in under 3 minutes</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-neutral-800">
                      <CheckCircle2 className="h-4 w-4 text-neutral-950 shrink-0" />
                      <span>Guaranteed standbys to prevent no-show delays</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-neutral-800">
                      <CheckCircle2 className="h-4 w-4 text-neutral-950 shrink-0" />
                      <span>Escrow holds funds safely until check-out</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-neutral-100">
                  <button
                    onClick={handleOrganiser}
                    className="group/btn w-full flex items-center justify-center gap-2 rounded-xl bg-white border border-neutral-300 py-3.5 px-5 text-sm font-semibold text-neutral-950 hover:bg-neutral-50 hover:border-neutral-400 transition-all active:scale-[0.98] cursor-pointer shadow-xs"
                  >
                    <span>Join as Organiser</span>
                    <ArrowRight className="h-4 w-4 text-neutral-950 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </ThreeDCardWrapper>

          </div>

          {/* Minimal trust badge strip */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-neutral-500">
            <div className="flex items-center gap-1.5 text-neutral-800">
              <ShieldCheck className="h-4 w-4 text-neutral-950" />
              <span>Escrow Protected Shifts</span>
            </div>
            <span className="text-neutral-300">•</span>
            <div>Zero Platform Commission</div>
            <span className="text-neutral-300">•</span>
            <div>Immediate UPI Settlement</div>
          </div>
        </div>
      </div>
    </section>
  );
};
