import React from 'react';
import { StoryVisualType } from './types';

interface FeatureVisualProps {
  type: StoryVisualType;
}

// Realistic SVG Barcode with crisp, varied bar widths and serial caption
const RealisticBarcode = ({ code = 'EV-2026-8842-X', height = 18 }: { code?: string; height?: number }) => (
  <div className="flex flex-col items-center justify-center w-full">
    <svg className="w-full max-w-[140px] opacity-80" height={height} viewBox="0 0 160 24" fill="currentColor">
      <rect x="0" y="0" width="3" height="24" />
      <rect x="5" y="0" width="1.5" height="24" />
      <rect x="9" y="0" width="4" height="24" />
      <rect x="15" y="0" width="1.5" height="24" />
      <rect x="18" y="0" width="2.5" height="24" />
      <rect x="23" y="0" width="5" height="24" />
      <rect x="30" y="0" width="2" height="24" />
      <rect x="34" y="0" width="1" height="24" />
      <rect x="37" y="0" width="4" height="24" />
      <rect x="43" y="0" width="2" height="24" />
      <rect x="47" y="0" width="3" height="24" />
      <rect x="52" y="0" width="1" height="24" />
      <rect x="55" y="0" width="5" height="24" />
      <rect x="62" y="0" width="2" height="24" />
      <rect x="66" y="0" width="3.5" height="24" />
      <rect x="71" y="0" width="1.5" height="24" />
      <rect x="75" y="0" width="4" height="24" />
      <rect x="81" y="0" width="2" height="24" />
      <rect x="85" y="0" width="1" height="24" />
      <rect x="88" y="0" width="3.5" height="24" />
      <rect x="93" y="0" width="2.5" height="24" />
      <rect x="98" y="0" width="5" height="24" />
      <rect x="105" y="0" width="1.5" height="24" />
      <rect x="108" y="0" width="3" height="24" />
      <rect x="113" y="0" width="2" height="24" />
      <rect x="117" y="0" width="4" height="24" />
      <rect x="123" y="0" width="1.5" height="24" />
      <rect x="126" y="0" width="3" height="24" />
      <rect x="131" y="0" width="2.5" height="24" />
      <rect x="135" y="0" width="4.5" height="24" />
      <rect x="142" y="0" width="1.5" height="24" />
      <rect x="145" y="0" width="3" height="24" />
      <rect x="150" y="0" width="2" height="24" />
      <rect x="154" y="0" width="4" height="24" />
    </svg>
    <span className="font-mono text-[7px] sm:text-[8px] tracking-[0.25em] text-neutral-500 uppercase mt-0.5">
      *{code}*
    </span>
  </div>
);

// Authentic vector 2D QR Code Matrix
const VectorQRCode = ({ size = 42 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 29 29" fill="black" className="shrink-0">
    <rect x="0" y="0" width="7" height="7" rx="0.5" fill="none" stroke="black" strokeWidth="1" />
    <rect x="2" y="2" width="3" height="3" fill="black" />
    <rect x="22" y="0" width="7" height="7" rx="0.5" fill="none" stroke="black" strokeWidth="1" />
    <rect x="24" y="2" width="3" height="3" fill="black" />
    <rect x="0" y="22" width="7" height="7" rx="0.5" fill="none" stroke="black" strokeWidth="1" />
    <rect x="2" y="24" width="3" height="3" fill="black" />
    <rect x="9" y="1" width="2" height="2" />
    <rect x="13" y="2" width="2" height="2" />
    <rect x="17" y="1" width="2" height="2" />
    <rect x="10" y="4" width="2" height="2" />
    <rect x="14" y="5" width="2" height="2" />
    <rect x="18" y="4" width="2" height="2" />
    <rect x="1" y="9" width="2" height="2" />
    <rect x="4" y="10" width="2" height="2" />
    <rect x="8" y="8" width="2" height="2" />
    <rect x="12" y="8" width="2" height="2" />
    <rect x="15" y="9" width="2" height="2" />
    <rect x="19" y="8" width="2" height="2" />
    <rect x="23" y="10" width="2" height="2" />
    <rect x="26" y="9" width="2" height="2" />
    <rect x="8" y="12" width="2" height="2" />
    <rect x="11" y="12" width="2" height="2" />
    <rect x="14" y="13" width="2" height="2" />
    <rect x="18" y="12" width="2" height="2" />
    <rect x="21" y="13" width="2" height="2" />
    <rect x="9" y="16" width="2" height="2" />
    <rect x="13" y="16" width="2" height="2" />
    <rect x="16" y="17" width="2" height="2" />
    <rect x="20" y="16" width="2" height="2" />
    <rect x="1" y="18" width="2" height="2" />
    <rect x="4" y="19" width="2" height="2" />
    <rect x="8" y="20" width="2" height="2" />
    <rect x="11" y="20" width="2" height="2" />
    <rect x="15" y="21" width="2" height="2" />
    <rect x="18" y="20" width="2" height="2" />
    <rect x="22" y="19" width="2" height="2" />
    <rect x="25" y="20" width="2" height="2" />
    <rect x="10" y="24" width="2" height="2" />
    <rect x="14" y="25" width="2" height="2" />
    <rect x="18" y="24" width="2" height="2" />
  </svg>
);

export const FeatureVisual: React.FC<FeatureVisualProps> = ({ type }) => {
  const renderCardContent = () => {
    switch (type) {
      // -----------------------------------------------------------------------
      // CREW 01: OFFICIAL CREW PASS (Tangible Lanyard Badge)
      // -----------------------------------------------------------------------
      case 'crew-profile':
        return (
          <div className="h-full flex flex-col justify-between p-2.5 sm:p-4 bg-white text-neutral-900 select-none">
            {/* Lanyard punch hole & Header band */}
            <div>
              <div className="w-10 h-1.5 rounded-full bg-neutral-200 mx-auto mb-1.5 sm:mb-2" />
              <div className="bg-neutral-900 text-white rounded-lg px-2.5 py-1 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] sm:text-[11px] font-black tracking-widest text-[#FED000]">
                    EVENCIFY
                  </span>
                  <span className="text-neutral-500 text-[10px]">|</span>
                  <span className="font-mono text-[8px] sm:text-[10px] tracking-wider text-neutral-300">
                    CREW PASS
                  </span>
                </div>
                <span className="font-mono text-[8px] sm:text-[9px] font-bold text-neutral-200 border border-neutral-700 px-1.5 py-0.5 rounded">
                  KYC: VERIFIED
                </span>
              </div>
            </div>

            {/* Crew Member Dossier */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 my-auto bg-neutral-50 p-2 sm:p-2.5 rounded-xl border border-neutral-200">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  alt="Pooja Verma"
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 xs:w-13 xs:h-13 sm:w-16 sm:h-16 rounded-lg object-cover border border-neutral-300"
                />
                <span className="absolute -bottom-1 -right-1 font-mono text-[7px] sm:text-[8px] font-bold bg-neutral-900 text-white px-1 rounded">
                  Z-A
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-base font-black text-neutral-900 truncate">
                    Pooja Verma
                  </h4>
                  <span className="font-mono text-[9px] sm:text-[11px] font-black text-neutral-900">
                    4.96 ★
                  </span>
                </div>
                <p className="font-mono text-[9px] sm:text-[11px] text-neutral-600 font-medium truncate">
                  Lead Stage Coordinator
                </p>
                <div className="flex items-center gap-2 mt-1 text-[8px] sm:text-[10px] text-neutral-500 font-mono">
                  <span>52 GIGS</span>
                  <span>•</span>
                  <span>0 DROPOUTS</span>
                  <span>•</span>
                  <span>MUMBAI</span>
                </div>
              </div>
            </div>

            {/* Credential Data Strip & Barcode */}
            <div className="pt-1 border-t border-neutral-200/80">
              <div className="flex items-center justify-between mb-1 text-[8px] sm:text-[10px] font-mono">
                <span className="text-neutral-500">CLEARANCE: ALL-ZONES</span>
                <span className="font-bold text-neutral-900">₹4,000 / DAY (LOCKED)</span>
              </div>
              <RealisticBarcode code="EV-CREW-88421-IND" height={16} />
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // CREW 02: STADIUM SHIFT CALL SHEET & ESCROW
      // -----------------------------------------------------------------------
      case 'crew-discovery':
        return (
          <div className="h-full flex flex-col justify-between p-2.5 sm:p-4 bg-white text-neutral-900 select-none">
            {/* Header with Stadium Banner */}
            <div className="relative rounded-lg overflow-hidden h-16 xs:h-20 sm:h-28 border border-neutral-300">
              <img
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80"
                alt="Sunburn Arena Concert"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent" />
              <div className="absolute top-1.5 left-2">
                <span className="font-mono text-[7px] sm:text-[9px] font-black uppercase tracking-wider bg-neutral-900/90 text-[#FED000] px-1.5 py-0.5 rounded border border-neutral-700">
                  ESCROW GUARANTEED
                </span>
              </div>
              <div className="absolute bottom-1.5 left-2 text-white">
                <h4 className="text-xs sm:text-base font-black tracking-tight leading-none">
                  Sunburn Arena 2026
                </h4>
                <p className="font-mono text-[8px] sm:text-[10px] text-neutral-300 mt-0.5">
                  DY Patil Stadium • Dec 28–30
                </p>
              </div>
            </div>

            {/* Call Sheet Breakdown Table */}
            <div className="my-auto bg-neutral-50 rounded-lg p-2 border border-neutral-200 divide-y divide-neutral-200/80">
              <div className="flex items-center justify-between pb-1 text-[9px] sm:text-[11px] font-mono">
                <span className="text-neutral-500 uppercase">ROLE</span>
                <span className="font-bold text-neutral-900">Main Stage Coordinator</span>
              </div>
              <div className="flex items-center justify-between py-1 text-[9px] sm:text-[11px] font-mono">
                <span className="text-neutral-500 uppercase">TIMINGS</span>
                <span className="font-bold text-neutral-900">10:00 AM – 10:00 PM</span>
              </div>
              <div className="flex items-center justify-between pt-1 text-[9px] sm:text-[11px] font-mono">
                <span className="text-neutral-500 uppercase">DAILY PAYOUT</span>
                <span className="font-black text-neutral-950">₹4,500 / Day Net</span>
              </div>
            </div>

            {/* Escrow Deposit Stamp */}
            <div className="pt-1 border-t border-neutral-200 flex items-center justify-between font-mono text-[8px] sm:text-[10px]">
              <span className="text-neutral-500">ESCROW ID: #ESC-9942</span>
              <span className="bg-neutral-900 text-white font-bold px-2 py-0.5 rounded">
                100% SECURED
              </span>
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // CREW 03: MULTI-CITY SHIFT BOARD (Dense Directory)
      // -----------------------------------------------------------------------
      case 'crew-search':
        return (
          <div className="h-full flex flex-col justify-between p-2.5 sm:p-4 bg-white text-neutral-900 select-none">
            {/* Header & Filter Pills */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-500">
                  METRO SHIFT DIRECTORY
                </span>
                <span className="font-mono text-[8px] sm:text-[9px] font-black bg-neutral-900 text-[#FED000] px-1.5 py-0.5 rounded">
                  142 OPEN CALLS
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[8px] sm:text-[9px] text-neutral-700">
                <span className="bg-neutral-100 border border-neutral-300 px-1.5 py-0.5 rounded font-bold">
                  MUMBAI
                </span>
                <span className="bg-neutral-100 border border-neutral-300 px-1.5 py-0.5 rounded font-bold">
                  STAGE
                </span>
                <span className="bg-neutral-100 border border-neutral-300 px-1.5 py-0.5 rounded font-bold">
                  WEEKEND
                </span>
                <span className="bg-neutral-100 border border-neutral-300 px-1.5 py-0.5 rounded font-bold">
                  ₹4K+
                </span>
              </div>
            </div>

            {/* Dense 3-Row Shift Ledger */}
            <div className="my-auto space-y-1 sm:space-y-1.5">
              <div className="p-1.5 sm:p-2 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between font-mono text-[9px] sm:text-[11px]">
                <div className="min-w-0">
                  <div className="font-black text-neutral-900 truncate">Lakmé Fashion Week</div>
                  <div className="text-[8px] sm:text-[9px] text-neutral-500">BKC • Backstage Lead</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-neutral-900">₹5,000</div>
                  <div className="text-[7px] sm:text-[8px] text-neutral-500 font-bold">2 SLOTS</div>
                </div>
              </div>

              <div className="p-1.5 sm:p-2 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between font-mono text-[9px] sm:text-[11px]">
                <div className="min-w-0">
                  <div className="font-black text-neutral-900 truncate">Sunburn Arena 2026</div>
                  <div className="text-[8px] sm:text-[9px] text-neutral-500">DY Patil • Stage Coord</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-neutral-900">₹4,500</div>
                  <div className="text-[7px] sm:text-[8px] text-neutral-500 font-bold">LOCKED</div>
                </div>
              </div>

              <div className="p-1.5 sm:p-2 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between font-mono text-[9px] sm:text-[11px]">
                <div className="min-w-0">
                  <div className="font-black text-neutral-900 truncate">Global Tech Summit</div>
                  <div className="text-[8px] sm:text-[9px] text-neutral-500">Jio World • VIP Lounge</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-neutral-900">₹3,800</div>
                  <div className="text-[7px] sm:text-[8px] text-neutral-500 font-bold">URGENT</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-1 border-t border-neutral-200 flex items-center justify-between font-mono text-[8px] sm:text-[10px] text-neutral-500">
              <span>ZERO AGENT FEES</span>
              <span className="font-bold text-neutral-900">DIRECT BOOKING</span>
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // CREW 04: 1-CLICK VERIFICATION DOSSIER
      // -----------------------------------------------------------------------
      case 'crew-apply':
        return (
          <div className="h-full flex flex-col justify-between p-2.5 sm:p-4 bg-white text-neutral-900 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-500">
                1-CLICK DISPATCH DOSSIER
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] font-bold bg-neutral-900 text-white px-1.5 py-0.5 rounded">
                READY
              </span>
            </div>

            {/* Candidate Summary Block */}
            <div className="my-auto bg-neutral-50 p-2 sm:p-2.5 rounded-lg border border-neutral-200 space-y-1.5">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-200">
                <div>
                  <h5 className="text-xs sm:text-sm font-black text-neutral-900">Pooja Verma</h5>
                  <p className="font-mono text-[8px] sm:text-[10px] text-neutral-500">
                    Applying: Sunburn Arena (Main Stage)
                  </p>
                </div>
                <span className="font-mono text-[10px] sm:text-xs font-black text-neutral-900">
                  ₹4,500/day
                </span>
              </div>

              {/* Dossier Itemized Checklist */}
              <div className="space-y-1 font-mono text-[8px] sm:text-[10px] text-neutral-700">
                <div className="flex items-center justify-between">
                  <span>AADHAAR KYC</span>
                  <span className="font-bold text-neutral-900">VERIFIED (UIDAI)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>TRACK RECORD</span>
                  <span className="font-bold text-neutral-900">52 COMPLETED SHIFTS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>ATTENDANCE SCORE</span>
                  <span className="font-bold text-neutral-900">100% ON-TIME</span>
                </div>
              </div>
            </div>

            {/* Bottom Submission Stamp */}
            <div className="pt-1 border-t border-neutral-200 flex items-center justify-between font-mono text-[8px] sm:text-[10px]">
              <span className="text-neutral-500">TIMESTAMP: 09:14:22 IST</span>
              <span className="bg-neutral-900 text-[#FED000] font-black px-2 py-0.5 rounded">
                SUBMITTED ✓
              </span>
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // CREW 05: DIGITAL GATE PASS (Physical QR Voucher)
      // -----------------------------------------------------------------------
      case 'crew-track':
        return (
          <div className="h-full flex flex-col justify-between p-2.5 sm:p-4 bg-white text-neutral-900 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[7px] sm:text-[9px] font-black uppercase tracking-wider text-neutral-500 block">
                  ADMISSION VOUCHER
                </span>
                <h4 className="text-xs sm:text-sm font-black text-neutral-900">
                  India Tech Summit 2026
                </h4>
              </div>
              <span className="font-mono text-[8px] sm:text-[9px] font-black bg-neutral-900 text-white px-2 py-0.5 rounded">
                GATE 4B
              </span>
            </div>

            {/* Pass QR and Reporting Timings */}
            <div className="my-auto flex items-center justify-between bg-neutral-50 rounded-lg p-2 sm:p-2.5 border border-neutral-200">
              <div className="space-y-0.5 font-mono text-[8px] sm:text-[10px]">
                <span className="text-neutral-500 uppercase block">CALL TIME</span>
                <span className="text-xs sm:text-sm font-black text-neutral-950 block">
                  08:30 AM SHARP
                </span>
                <span className="text-neutral-600 block mt-1">
                  Jio World Convention Centre
                </span>
                <span className="text-neutral-500 block">
                  Supervisor: Vikram S. (Stage Dir)
                </span>
              </div>
              <div className="bg-white p-1.5 rounded border border-neutral-300 shrink-0 flex flex-col items-center">
                <VectorQRCode size={46} />
                <span className="font-mono text-[7px] font-bold text-neutral-500 mt-0.5">
                  ID: #8842
                </span>
              </div>
            </div>

            {/* Zones Cleared Barcode */}
            <div className="pt-1 border-t border-neutral-200 flex items-center justify-between font-mono text-[8px] sm:text-[10px]">
              <span className="text-neutral-500">ZONES: A • B • BACKSTAGE</span>
              <span className="font-bold text-neutral-900">SCAN READY</span>
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // CREW 06: UPI ESCROW SETTLEMENT RECEIPT
      // -----------------------------------------------------------------------
      case 'crew-reputation':
        return (
          <div className="h-full flex flex-col justify-between p-2.5 sm:p-4 bg-white text-neutral-900 select-none">
            {/* Bank Header */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-500">
                ESCROW SETTLEMENT ADVICE
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] font-bold bg-neutral-100 border border-neutral-300 px-1.5 py-0.5 rounded text-neutral-800">
                0% FEES
              </span>
            </div>

            {/* Financial Ledger Slip */}
            <div className="my-auto bg-neutral-50 p-2 sm:p-2.5 rounded-lg border border-neutral-200 space-y-1 font-mono text-[8px] sm:text-[10px]">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-200">
                <span className="text-neutral-500">NET SETTLEMENT DISBURSED</span>
                <span className="text-xs sm:text-base font-black text-neutral-950">
                  ₹18,000.00
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-600">
                <span>TXN REF</span>
                <span className="font-bold text-neutral-900">UPI/2026/89421008</span>
              </div>
              <div className="flex items-center justify-between text-neutral-600">
                <span>BENEFICIARY</span>
                <span className="font-bold text-neutral-900">Pooja Verma (ICICI)</span>
              </div>
              <div className="flex items-center justify-between text-neutral-600">
                <span>TIMESTAMP</span>
                <span className="font-bold text-neutral-900">22:15 IST (Instant Wrap)</span>
              </div>
            </div>

            {/* Testimonial & Score */}
            <div className="pt-1 border-t border-neutral-200 flex items-center justify-between font-mono text-[8px] sm:text-[10px]">
              <span className="text-neutral-500">RATING: 5.0 / 5.0 ★</span>
              <span className="font-bold text-neutral-900">PERCEPT LIVE VERIFIED</span>
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // ORGANISER 01: EVENT BLUEPRINT (Production Manifest)
      // -----------------------------------------------------------------------
      case 'organiser-create':
        return (
          <div className="h-full flex flex-col justify-between p-2.5 sm:p-4 bg-white text-neutral-900 select-none">
            {/* Header Image */}
            <div className="relative rounded-lg overflow-hidden h-16 xs:h-20 sm:h-28 border border-neutral-300">
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80"
                alt="Arena Production Blueprint"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent" />
              <div className="absolute top-1.5 left-2">
                <span className="font-mono text-[7px] sm:text-[9px] font-black uppercase tracking-wider bg-neutral-900 text-[#FED000] px-1.5 py-0.5 rounded border border-neutral-700">
                  PRODUCTION BLUEPRINT
                </span>
              </div>
              <div className="absolute bottom-1.5 left-2 text-white">
                <h4 className="text-xs sm:text-base font-black tracking-tight leading-none">
                  Sunburn Arena 2026
                </h4>
                <p className="font-mono text-[8px] sm:text-[10px] text-neutral-300 mt-0.5">
                  DY Patil Stadium • 40 Crew Positions
                </p>
              </div>
            </div>

            {/* Headcount Allocation Table */}
            <div className="my-auto bg-neutral-50 p-2 rounded-lg border border-neutral-200 space-y-1 font-mono text-[8px] sm:text-[10px]">
              <div className="flex items-center justify-between pb-0.5 border-b border-neutral-200">
                <span className="text-neutral-500">ZONE ALLOCATION</span>
                <span className="font-bold text-neutral-900">40 TOTAL CREW</span>
              </div>
              <div className="grid grid-cols-2 gap-1 pt-0.5 text-neutral-700">
                <div>STAGE: 16 MEMBERS</div>
                <div>HOSPITALITY: 12 MEMBERS</div>
                <div>GATE SCANS: 8 MEMBERS</div>
                <div>RUNNERS: 4 MEMBERS</div>
              </div>
            </div>

            {/* Escrow Guarantee Lock */}
            <div className="pt-1 border-t border-neutral-200 flex items-center justify-between font-mono text-[8px] sm:text-[10px]">
              <span className="text-neutral-500">ESCROW LOCKED</span>
              <span className="font-black text-neutral-950">₹1,80,000 (100% READY)</span>
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // ORGANISER 02: ROLE SPECIFICATION & ESCROW
      // -----------------------------------------------------------------------
      case 'organiser-criteria':
        return (
          <div className="h-full flex flex-col justify-between p-2.5 sm:p-4 bg-white text-neutral-900 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-500">
                ROLE SPECIFICATION
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] font-bold bg-neutral-900 text-[#FED000] px-1.5 py-0.5 rounded">
                8 OPEN SLOTS
              </span>
            </div>

            {/* Criteria Specs Table */}
            <div className="my-auto bg-neutral-50 p-2 sm:p-2.5 rounded-lg border border-neutral-200 divide-y divide-neutral-200 font-mono text-[8px] sm:text-[10px]">
              <div className="flex items-center justify-between pb-1">
                <span className="text-neutral-500">ROLE TITLE</span>
                <span className="font-bold text-neutral-900">Stage Coordinator</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-neutral-500">CALL TIME</span>
                <span className="font-bold text-neutral-900">09:00 AM – 09:00 PM</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-neutral-500">DRESS CODE</span>
                <span className="font-bold text-neutral-900">All-Black Formal Tee</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-500">STANDBY CONTINGENCY</span>
                <span className="font-bold text-neutral-900">4 Standbys Included</span>
              </div>
            </div>

            {/* Guaranteed Escrow Payout */}
            <div className="pt-1 border-t border-neutral-200 flex items-center justify-between font-mono text-[8px] sm:text-[10px]">
              <span className="text-neutral-500">CONTRACT #AGR-4409</span>
              <span className="font-black text-neutral-950">₹4,500 / DAY LOCKED</span>
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // ORGANISER 03: VERIFIED TALENT DIRECTORY
      // -----------------------------------------------------------------------
      case 'organiser-discovery':
        return (
          <div className="h-full flex flex-col justify-between p-2.5 sm:p-4 bg-white text-neutral-900 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-500">
                VERIFIED TALENT POOL
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] font-bold bg-neutral-100 border border-neutral-300 px-1.5 py-0.5 rounded text-neutral-800">
                180+ AVAILABLE
              </span>
            </div>

            {/* Candidate Directory Rows */}
            <div className="my-auto space-y-1.5">
              <div className="flex items-center gap-2.5 p-1.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                  alt="Arjun Nair"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover border border-neutral-300 shrink-0"
                />
                <div className="min-w-0 flex-1 font-mono text-[8px] sm:text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-neutral-900 truncate">Arjun Nair</span>
                    <span className="font-bold text-neutral-900">4.98 ★</span>
                  </div>
                  <div className="text-neutral-500">Production Lead • 38 Gigs</div>
                  <div className="text-[7px] sm:text-[8px] text-neutral-400">AADHAAR KYC: VERIFIED</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-1.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Pooja Verma"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover border border-neutral-300 shrink-0"
                />
                <div className="min-w-0 flex-1 font-mono text-[8px] sm:text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-neutral-900 truncate">Pooja Verma</span>
                    <span className="font-bold text-neutral-900">4.96 ★</span>
                  </div>
                  <div className="text-neutral-500">Stage Coordinator • 52 Gigs</div>
                  <div className="text-[7px] sm:text-[8px] text-neutral-400">AADHAAR KYC: VERIFIED</div>
                </div>
              </div>
            </div>

            {/* Bottom Security Note */}
            <div className="pt-1 border-t border-neutral-200 flex items-center justify-between font-mono text-[8px] sm:text-[10px] text-neutral-500">
              <span>ZERO FAKE PROFILES</span>
              <span className="font-bold text-neutral-900">UIDAI VERIFIED</span>
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // ORGANISER 04: APPLICANT EVALUATION MATRIX
      // -----------------------------------------------------------------------
      case 'organiser-inbox':
        return (
          <div className="h-full flex flex-col justify-between p-2.5 sm:p-4 bg-white text-neutral-900 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-500">
                CANDIDATE DOSSIER
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] font-black bg-neutral-900 text-white px-2 py-0.5 rounded">
                98.4% MATCH
              </span>
            </div>

            {/* Detailed Applicant Matrix */}
            <div className="my-auto bg-neutral-50 p-2 sm:p-2.5 rounded-lg border border-neutral-200 space-y-1 font-mono text-[8px] sm:text-[10px]">
              <div className="flex items-center gap-2 pb-1 border-b border-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Pooja Verma"
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded object-cover border border-neutral-300 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-black text-neutral-900 truncate">
                    Pooja Verma
                  </div>
                  <div className="text-neutral-500">52 Verified Arena Shifts</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-neutral-700 pt-0.5">
                <span>PAST CREDITS</span>
                <span className="font-bold text-neutral-900">Sunburn '25, Lakmé FW</span>
              </div>
              <div className="flex items-center justify-between text-neutral-700">
                <span>PUNCTUALITY</span>
                <span className="font-bold text-neutral-900">100% (+5m early avg)</span>
              </div>
            </div>

            {/* Decision Action Button */}
            <div className="pt-1 border-t border-neutral-200 flex items-center justify-between font-mono text-[8px] sm:text-[10px]">
              <span className="text-neutral-500">STATUS: SHORTLISTED</span>
              <span className="bg-neutral-900 text-[#FED000] font-black px-2.5 py-0.5 rounded cursor-pointer">
                CONFIRM TO ROSTER →
              </span>
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // ORGANISER 05: 1-CLICK SHORTLISTING (Roster Lock)
      // -----------------------------------------------------------------------
      case 'organiser-shortlist':
        return (
          <div className="h-full flex flex-col justify-between p-2.5 sm:p-4 bg-white text-neutral-900 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-500">
                ROSTER LOCK STATUS
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] font-bold bg-neutral-900 text-white px-1.5 py-0.5 rounded">
                95% CONFIRMED
              </span>
            </div>

            {/* Progress & Slots Table */}
            <div className="my-auto space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[9px] sm:text-[11px] font-bold text-neutral-900">
                <span>ACTIVE ASSIGNMENTS</span>
                <span className="font-black">38 / 40 CONFIRMED</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-900 rounded-full w-[95%]" />
              </div>
              <div className="bg-neutral-50 p-2 rounded-lg border border-neutral-200 font-mono text-[8px] sm:text-[10px] space-y-0.5 text-neutral-700">
                <div className="flex items-center justify-between">
                  <span>DIGITAL AGREEMENTS</span>
                  <span className="font-bold text-neutral-900">38 DISPATCHED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>VENUE GATE PASSES</span>
                  <span className="font-bold text-neutral-900">38 QR GENERATED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>STANDBY CONTINGENCY</span>
                  <span className="font-bold text-neutral-900">4 ON STANDBY ALERT</span>
                </div>
              </div>
            </div>

            {/* Lock Status */}
            <div className="pt-1 border-t border-neutral-200 flex items-center justify-between font-mono text-[8px] sm:text-[10px]">
              <span className="text-neutral-500">SECURITY PROTOCOL</span>
              <span className="font-bold text-neutral-900">ROSTER COMPLETE</span>
            </div>
          </div>
        );

      // -----------------------------------------------------------------------
      // ORGANISER 06: LIVE ROSTER & ESCROW RELEASE
      // -----------------------------------------------------------------------
      case 'organiser-roster':
      default:
        return (
          <div className="h-full flex flex-col justify-between p-2.5 sm:p-4 bg-white text-neutral-900 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-500">
                TURNSTILE CHECK-IN
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] font-bold bg-neutral-100 border border-neutral-300 px-1.5 py-0.5 rounded text-neutral-800">
                0% NO-SHOWS
              </span>
            </div>

            {/* Attendance & Escrow Release Box */}
            <div className="my-auto space-y-1.5">
              <div className="bg-neutral-50 rounded-lg p-2 sm:p-2.5 border border-neutral-200 flex items-center justify-between font-mono text-[9px] sm:text-[11px]">
                <div>
                  <span className="text-neutral-500 text-[8px] sm:text-[9px] uppercase block">
                    GATE 2 ATTENDANCE
                  </span>
                  <span className="font-black text-neutral-950 block">
                    38 / 38 Crew Scanned
                  </span>
                </div>
                <span className="font-mono text-[8px] sm:text-[9px] font-bold bg-neutral-900 text-white px-2 py-0.5 rounded">
                  ALL PRESENT
                </span>
              </div>

              {/* Instant 1-Tap UPI Settlement Banner */}
              <div className="bg-neutral-900 text-white p-2 sm:p-2.5 rounded-lg flex items-center justify-between font-mono text-[8px] sm:text-[10px]">
                <div>
                  <span className="text-[#FED000] font-bold block">1-TAP ESCROW RELEASE</span>
                  <span className="text-neutral-400 block text-[7px] sm:text-[8px]">
                    38 Direct Bank Payouts
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-black text-[#FED000]">
                  ₹1,71,000
                </span>
              </div>
            </div>

            {/* Audit Reference */}
            <div className="pt-1 border-t border-neutral-200 flex items-center justify-between font-mono text-[8px] sm:text-[10px] text-neutral-500">
              <span>AUDIT: ESCROW-REL-9921</span>
              <span className="font-bold text-neutral-900">DISBURSED & VERIFIED</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="w-full h-full rounded-[16px] sm:rounded-[24px] bg-white border border-neutral-300/80 flex flex-col justify-between text-neutral-900 select-none overflow-hidden"
      style={{
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
      }}
    >
      {renderCardContent()}
    </div>
  );
};
