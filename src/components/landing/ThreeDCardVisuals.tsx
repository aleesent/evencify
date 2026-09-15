import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  QrCode,
  MapPin,
  Calendar,
  Zap,
} from 'lucide-react';

interface TiltProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Interactive 3D Card wrapper with smooth perspective tilt and specular highlight
 */
export const ThreeDCardWrapper: React.FC<TiltProps> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className={`transition-transform duration-200 ${className}`}
    >
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px) scale(1.02)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        }}
        className="relative"
      >
        {children}
        {/* Subtle clean specular sheen overlay on hover */}
        {isHovered && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/25 to-white/40 mix-blend-overlay transition-opacity duration-300"
            style={{ transform: 'translateZ(20px)' }}
          />
        )}
      </div>
    </div>
  );
};

/**
 * 3D Crew Identity & Shift Pass Card
 * Strictly Black, White, and Yellow palette
 */
export const CrewPass3DCard: React.FC = () => {
  return (
    <ThreeDCardWrapper className="w-full max-w-[420px] mx-auto">
      <div className="relative overflow-hidden rounded-[28px] border-2 border-black bg-white p-6">
        {/* Top Black / Yellow Header Bar */}
        <div className="flex items-center justify-between border-b border-black/15 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FED000] text-black font-black text-xs border border-black">
              E
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-black">
                EVENCIFY CREW PASS
              </span>
              <div className="text-[11px] font-bold text-black">Verified Professional</div>
            </div>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-[#FED000] px-3 py-1 text-[10px] font-black text-black border border-black">
            <CheckCircle2 className="h-3 w-3 text-black" />
            <span>ACTIVE PASS</span>
          </div>
        </div>

        {/* Member Profile info */}
        <div className="mt-5 flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden border-2 border-black bg-black">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80"
              alt="Crew Member"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 right-0 rounded-tl-md bg-[#FED000] p-0.5 border-t border-l border-black">
              <ShieldCheck className="h-3 w-3 text-black" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-base font-extrabold text-black truncate">Pooja Verma</h4>
              <span className="rounded-full bg-black text-[#FED000] px-2 py-0.5 text-[9px] font-black">
                TOP CREW
              </span>
            </div>
            <p className="text-xs text-black font-semibold">Lead Stage Coordinator</p>
            <div className="mt-1 flex items-center gap-3 text-[11px] text-black">
              <span className="flex items-center gap-1 font-bold text-black">
                <Star className="h-3.5 w-3.5 fill-[#FED000] text-black" />
                4.96 (52 Gigs)
              </span>
              <span className="font-semibold">• Mumbai</span>
            </div>
          </div>
        </div>

        {/* Next Confirmed Event Card */}
        <div className="mt-5 rounded-2xl border-2 border-black bg-[#FFFDE6] p-3.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-black">
            <span className="flex items-center gap-1 text-black font-black">
              <Calendar className="h-3.5 w-3.5 text-black" />
              Next Confirmed Shift
            </span>
            <span className="rounded-full bg-black text-[#FED000] px-2.5 py-0.5 text-[10px] font-black">
              ₹4,000 / Day
            </span>
          </div>
          <div className="mt-2 text-xs font-black text-black">
            India Global Summit 2026
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-black font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-black" />
              Jio World Centre
            </span>
            <span className="flex items-center gap-1 text-black font-black">
              <Clock className="h-3 w-3 text-black" />
              08:30 AM Call
            </span>
          </div>
        </div>

        {/* Card Footer: Instant UPI Badge */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-black/15 text-[11px]">
          <div className="flex items-center gap-1.5 text-black font-bold">
            <Zap className="h-3.5 w-3.5 text-black fill-[#FED000]" />
            <span>Direct Same-Day UPI Settlement</span>
          </div>
          <QrCode className="h-6 w-6 text-black" />
        </div>
      </div>
    </ThreeDCardWrapper>
  );
};

/**
 * 3D Organiser Command & Live Staffing Roster Card
 * Strictly Black, White, and Yellow palette
 */
export const OrganiserRoster3DCard: React.FC = () => {
  return (
    <ThreeDCardWrapper className="w-full max-w-[420px] mx-auto">
      <div className="relative overflow-hidden rounded-[28px] border-2 border-black bg-white p-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-black/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FED000] border border-black" />
              <span className="text-[10px] font-black uppercase tracking-widest text-black">
                LIVE EVENT ROSTER
              </span>
            </div>
            <h4 className="text-sm font-black text-black mt-0.5">
              Sunburn Arena Festival 2026
            </h4>
          </div>
          <span className="rounded-full bg-[#FED000] border border-black px-2.5 py-1 text-[10px] font-black text-black">
            DAY 1 OF 3
          </span>
        </div>

        {/* Fulfillment Metrics */}
        <div className="mt-5 rounded-2xl bg-black text-white p-4 border border-black">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white font-bold">Crew Staffing Progress</span>
            <span className="font-black text-[#FED000] text-sm">38 / 40 Confirmed (95%)</span>
          </div>
          <div className="mt-2.5 h-3 w-full overflow-hidden rounded-full bg-white/20 border border-white/20">
            <div
              className="h-full rounded-full bg-[#FED000]"
              style={{ width: '95%' }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-white font-medium">
            <span>2 Standby Buffers Ready</span>
            <span className="text-[#FED000] font-black">0 Dropouts</span>
          </div>
        </div>

        {/* Verified Roster Avatars list */}
        <div className="mt-4 space-y-2.5">
          <div className="text-[11px] font-black uppercase tracking-wider text-black">
            Assigned Department Leads
          </div>

          <div className="flex items-center justify-between rounded-xl border-2 border-black bg-[#FFFDE6] p-2.5">
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Crew"
                className="h-9 w-9 rounded-xl object-cover border-2 border-black"
              />
              <div>
                <div className="text-xs font-black text-black">Arjun Nair</div>
                <div className="text-[10px] font-bold text-black">Production Manager • ★ 4.98</div>
              </div>
            </div>
            <span className="rounded-md bg-black text-[#FED000] px-2.5 py-0.5 text-[10px] font-black">
              CHECKED IN
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border-2 border-black bg-white p-2.5">
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                alt="Crew"
                className="h-9 w-9 rounded-xl object-cover border-2 border-black"
              />
              <div>
                <div className="text-xs font-black text-black">Sneha Patel</div>
                <div className="text-[10px] font-bold text-black">Guest Relations • ★ 4.92</div>
              </div>
            </div>
            <span className="rounded-md bg-black text-[#FED000] px-2.5 py-0.5 text-[10px] font-black">
              CHECKED IN
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-black/15 flex items-center justify-between text-[11px] text-black font-semibold">
          <span className="font-bold text-black">Active Event Shift</span>
          <span className="font-black text-black flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-black fill-[#FED000]" />
            Verified Organiser
          </span>
        </div>
      </div>
    </ThreeDCardWrapper>
  );
};

/**
 * 3D Trust & Escrow Guarantee Card
 * Strictly Black, White, and Yellow palette
 */
export const EscrowGuarantee3DCard: React.FC = () => {
  return (
    <ThreeDCardWrapper className="w-full max-w-[420px] mx-auto">
      <div className="relative overflow-hidden rounded-[28px] border-2 border-black bg-white p-6">
        <div className="flex items-center justify-between border-b border-black/15 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FED000] text-black font-black border border-black">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-black">
                EVENCIFY ESCROW SHIELD
              </span>
              <div className="text-xs font-black text-black">100% Payout Protection</div>
            </div>
          </div>
          <span className="rounded-full bg-[#FED000] px-3 py-0.5 text-[10px] font-black text-black border border-black">
            GUARANTEED
          </span>
        </div>

        <div className="mt-4 space-y-3 text-xs">
          <div className="flex items-start gap-2.5 rounded-xl bg-[#FFFDE6] p-3 border-2 border-black">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-black fill-[#FED000] mt-0.5" />
            <div>
              <span className="font-black text-black">Pre-Funded Shift Security</span>
              <p className="text-[11px] text-black font-medium mt-0.5">
                Organisers lock shift compensation in platform escrow before crew reporting.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl bg-white p-3 border-2 border-black">
            <Zap className="h-4 w-4 shrink-0 text-black fill-[#FED000] mt-0.5" />
            <div>
              <span className="font-black text-black">Immediate UPI Payout Upon Wrap</span>
              <p className="text-[11px] text-black font-medium mt-0.5">
                Funds are settled directly into the crew bank account with zero platform deduction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ThreeDCardWrapper>
  );
};
