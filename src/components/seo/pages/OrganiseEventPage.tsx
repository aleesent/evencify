import React, { useMemo } from 'react';
import { SEOHead } from '../SEOHead';
import { Breadcrumbs } from '../Breadcrumbs';
import { FaqAccordion } from '../FaqAccordion';
import { getSEOData, slugify } from '../../../services/seoData';
import { navigateTo } from '../../../services/router';
import {
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Lock,
  Star,
  MapPin,
} from 'lucide-react';
import { UserRole } from '../../../types';

interface OrganiseEventPageProps {
  onOpenCreateEvent?: () => void;
  onOpenAuthModal?: (role?: UserRole) => void;
}

export const OrganiseEventPage: React.FC<OrganiseEventPageProps> = ({
  onOpenCreateEvent,
  onOpenAuthModal,
}) => {
  const seo = useMemo(() => {
    return getSEOData({ type: 'organise-event' });
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Post Your Event & Crew Shifts',
      desc: 'Set your event date, venue, attendance, and specify exact crew roles required (VIP ushers, registration staff, security, stage hands) with clear shift rates.',
    },
    {
      num: '02',
      title: 'Review Verified Applicants',
      desc: 'Browse background-checked crew profiles complete with experience levels, past organizer reviews, language proficiencies, and verification badges.',
    },
    {
      num: '03',
      title: 'Lock In Escrow & Coordinate',
      desc: 'Deposit shift payouts safely into Evencify Escrow. Admin creates an automated group chat with accepted crew for instant briefing and shift call times.',
    },
    {
      num: '04',
      title: 'Flawless Execution & Instant Release',
      desc: 'Track on-site check-in via QR codes. Approve shift completion with 1-click and release payouts instantly to crew members.',
    },
  ];

  const organiserFaqs = [
    {
      q: 'How fast can I staff an event in Surat or Gujarat?',
      a: 'Most organizers in Surat and Ahmedabad receive qualified applicant responses within 2 to 4 hours of posting their event requirements. For urgent same-day or next-day shifts, our priority broadcast alerts local available crew instantly.',
    },
    {
      q: 'How does the Evencify Escrow protection work for organizers?',
      a: 'Your crew budget is safely held until the event concludes. If a crew member fails to show up or breaches shift guidelines, you do not pay for unfilled shifts and funds remain in your organizer balance or are refunded.',
    },
    {
      q: 'Can I re-hire top-rated crew members for recurring events?',
      a: 'Yes, Evencify allows you to favorite crew profiles, invite them directly to private shift postings, and build your reliable roster of vetted event professionals.',
    },
    {
      q: 'What crew roles can I hire through Evencify?',
      a: 'You can hire hospitality ushers, registration desk executives, promoters, security and bouncers, stage setup/teardown rigging hands, runners, and bilingual VIP liaisons.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-16">
      <SEOHead seo={seo} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={seo.breadcrumbItems} />

        {/* Hero Section */}
        <div className="mt-4 mb-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <Building2 className="h-4 w-4 text-[#FED000]" />
            <span>Event Management & Staffing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            {seo.h1}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed">
            Eliminate event day staffing panic. Source, screen, and hire background-verified event crew across Gujarat and India with automated escrow payouts and shift group communication.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (onOpenCreateEvent) onOpenCreateEvent();
                else if (onOpenAuthModal) onOpenAuthModal('organiser');
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-bold text-white hover:bg-black transition-colors cursor-pointer shadow-xs"
            >
              <span>Post Event & Hire Crew</span>
              <ArrowRight className="h-4 w-4 text-[#FED000]" />
            </button>
            <button
              onClick={() => onOpenAuthModal?.('organiser')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-bold text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <span>Sign Up as Organiser</span>
            </button>
          </div>
        </div>

        {/* 4 Steps Workflow */}
        <div className="my-12">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-6">
            How Event Staffing Works on Evencify
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div
                key={s.num}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl font-extrabold text-[#FED000] mb-2">{s.num}</div>
                  <h3 className="text-base font-bold text-neutral-900 mb-2">{s.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 mb-4">
              <Lock className="h-5 w-5 text-[#FED000]" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">Escrow Safety Vault</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              No dispute worries. Payments are only released once shifts are completed to your full satisfaction.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 mb-4">
              <Users className="h-5 w-5 text-[#FED000]" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">Pre-Screened Talent</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              All crew profiles display government identity verification, verified shift histories, and real organizer reviews.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 mb-4">
              <Zap className="h-5 w-5 text-[#FED000]" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">Automated Event Chat Groups</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              When shifts are filled, the system can spin up a secure private event coordination group for shift announcements.
            </p>
          </div>
        </div>

        {/* Top Cities */}
        <section className="my-12 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <MapPin className="h-4 w-4 text-[#FED000]" />
            <span>Staffing Availability</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-3">
            Hire Event Crew in Your City
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {['Surat', 'Ahmedabad', 'Vadodara', 'Mumbai', 'Bengaluru', 'Delhi'].map((cityName) => (
              <a
                key={cityName}
                href={`/events/${slugify(cityName)}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(`/events/${slugify(cityName)}`);
                }}
                className="flex flex-col items-center justify-center text-center rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 hover:bg-neutral-100 transition-colors"
              >
                <span className="text-xs font-bold text-neutral-900">{cityName}</span>
                <span className="text-[11px] text-neutral-500">Hire Crew →</span>
              </a>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <FaqAccordion
          title="Frequently Asked Questions for Event Organisers"
          description="Common questions about posting events and hiring verified crew on Evencify."
          faqs={organiserFaqs}
        />
      </div>
    </div>
  );
};
