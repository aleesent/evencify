import React, { useMemo } from 'react';
import { SEOHead } from '../SEOHead';
import { Breadcrumbs } from '../Breadcrumbs';
import { FaqAccordion } from '../FaqAccordion';
import { getSEOData, slugify } from '../../../services/seoData';
import { navigateTo } from '../../../services/router';
import {
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  MapPin,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
} from 'lucide-react';
import { UserRole } from '../../../types';

interface CrewJobsPageProps {
  onOpenAuthModal?: (role?: UserRole) => void;
}

export const CrewJobsPage: React.FC<CrewJobsPageProps> = ({ onOpenAuthModal }) => {
  const seo = useMemo(() => {
    return getSEOData({ type: 'crew-jobs' });
  }, []);

  const roles = [
    {
      title: 'Hospitality & VIP Ushering',
      rate: '₹1,500 – ₹2,500 / shift',
      desc: 'Guest escorting, VIP lounge coordination, table service facilitation at luxury weddings and galas.',
      skills: 'Grooming, courteous etiquette, bilingual communication',
    },
    {
      title: 'Registration Desk & Badge Operations',
      rate: '₹1,600 – ₹2,800 / day',
      desc: 'QR badge scanning, welcome kit handover, delegate ticketing verification at trade expos & tech summits.',
      skills: 'Basic tech proficiency, punctuality, speed',
    },
    {
      title: 'Stage Setup & Production Rigging',
      rate: '₹2,000 – ₹3,500 / day',
      desc: 'Stage trussing, sound check assistance, LED screen positioning, load-in and load-out.',
      skills: 'Physical fitness, structural safety awareness',
    },
    {
      title: 'Event Security & Crowd Perimeter',
      rate: '₹2,200 – ₹3,500 / shift',
      desc: 'Access control, artist greenroom security, barricade management, queue discipline.',
      skills: 'De-escalation, vigilance, physical presence',
    },
    {
      title: 'Brand Promoters & Product Specialists',
      rate: '₹1,800 – ₹3,000 / day',
      desc: 'Product demonstration, brochure distribution, lead generation at malls and trade exhibitions.',
      skills: 'Charisma, conversational fluency, product knowledge',
    },
    {
      title: 'Backstage & Artist Hospitality',
      rate: '₹2,000 – ₹3,200 / shift',
      desc: 'Greenroom rider fulfillment, artist runner duties, timeline coordination for concert headliners.',
      skills: 'Discretion, quick problem solving, reliability',
    },
  ];

  const crewFaqs = [
    {
      q: 'How does Evencify guarantee same-day crew payouts?',
      a: 'Evencify holds the event staffing budget in an escrow security account before the event begins. Once your shift supervisor confirms your attendance and shift completion, funds are released directly to your verified bank account or UPI ID.',
    },
    {
      q: 'Do I need prior event experience to apply for crew shifts?',
      a: 'No, we have opportunities for both freshers and seasoned veterans. We offer roles like Event Helper, Registration Desk, and Brand Promoter that provide entry-level hands-on training with experienced leads.',
    },
    {
      q: 'In which cities does Evencify have active crew shift openings?',
      a: 'We have active crew staffing networks in Surat, Ahmedabad, Vadodara, Rajkot, Mumbai, Pune, Bengaluru, Delhi NCR, and Hyderabad.',
    },
    {
      q: 'How do I build a top-rated crew profile on Evencify?',
      a: 'Complete your profile with a professional photo, verify your Aadhaar or government ID, add any past event experience, and maintain a 100% on-time attendance record on your assigned shifts.',
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
            <Briefcase className="h-4 w-4 text-[#FED000]" />
            <span>Event Workforce Platform</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            {seo.h1}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed">
            Connect directly with verified event organizers for high-paying flexible shifts. Backed by guaranteed escrow payouts, transparent day rates, and verified shift reviews.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenAuthModal?.(undefined, 'signup')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-bold text-white hover:bg-black transition-colors cursor-pointer shadow-xs"
            >
              <span>Join as Verified Crew</span>
              <ArrowRight className="h-4 w-4 text-[#FED000]" />
            </button>
            <button
              onClick={() => navigateTo('/events')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-bold text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <span>Explore Upcoming Events</span>
            </button>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 mb-4">
              <DollarSign className="h-5 w-5 text-[#FED000]" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">Guaranteed Escrow Payouts</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              No chasing organizers for weeks. Event budgets are held in advance escrow and cleared same-day upon shift completion.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 mb-4">
              <ShieldCheck className="h-5 w-5 text-[#FED000]" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">Verified Organizers Only</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              All event organizers on Evencify are identity verified, with transparent venue addresses, clear dress codes, and shift timings.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 mb-4">
              <Award className="h-5 w-5 text-[#FED000]" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">Build Your Professional Rating</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Earn 5-star organizer reviews with every successful gig and unlock high-tier VIP shifts and supervisory pay.
            </p>
          </div>
        </div>

        {/* Roles Breakdown */}
        <div className="my-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                Popular Event Crew Categories & Rates
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Standard daily shift rates across Surat, Ahmedabad, and major Indian cities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((r) => (
              <div
                key={r.title}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {r.rate}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 mb-2">{r.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-4">{r.desc}</p>
                </div>
                <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-500">
                  <span className="font-semibold text-neutral-700">Key Skills:</span> {r.skills}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Crew Cities */}
        <section className="my-12 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <MapPin className="h-4 w-4 text-[#FED000]" />
            <span>Active Workforce Hubs</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-3">
            Find Crew Shifts by City
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
                <span className="text-[11px] text-neutral-500">View Gigs →</span>
              </a>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <FaqAccordion
          title="Frequently Asked Questions About Event Crew Jobs"
          description="Everything you need to know about working shifts on Evencify."
          faqs={crewFaqs}
        />
      </div>
    </div>
  );
};
