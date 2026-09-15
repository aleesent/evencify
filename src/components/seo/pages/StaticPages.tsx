import React, { useMemo } from 'react';
import { SEOHead } from '../SEOHead';
import { Breadcrumbs } from '../Breadcrumbs';
import { FaqAccordion } from '../FaqAccordion';
import { getSEOData } from '../../../services/seoData';
import { navigateTo } from '../../../services/router';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Shield,
  FileText,
  HelpCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const seo = useMemo(() => getSEOData({ type: 'about' }), []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-16">
      <SEOHead seo={seo} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={seo.breadcrumbItems} />

        <div className="mt-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <Building2 className="h-4 w-4 text-[#FED000]" />
            <span>About Evencify</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            {seo.h1}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
            Evencify is India’s dedicated event discovery and verified on-demand workforce platform. Headquartered in Surat, Gujarat, we connect event planners, corporate organizers, and luxury wedding curators with vetted local crew while empowering attendees to discover the best live experiences across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="text-3xl font-extrabold text-[#FED000] mb-2">5,000+</div>
            <h3 className="text-sm font-bold text-neutral-900">Verified Crew Network</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Screened hospitality staff, security, promoters, and stage technicians across Surat, Ahmedabad, and major Indian cities.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="text-3xl font-extrabold text-[#FED000] mb-2">₹100%</div>
            <h3 className="text-sm font-bold text-neutral-900">Escrow Payment Security</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Guaranteed same-day crew payouts and complete budget protection for organizers.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="text-3xl font-extrabold text-[#FED000] mb-2">25+</div>
            <h3 className="text-sm font-bold text-neutral-900">Active Indian Cities</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Hyper-local coverage starting from Gujarat into Maharashtra, Karnataka, NCR, and Telangana.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-8 space-y-6 shadow-xs text-sm sm:text-base text-neutral-700 leading-relaxed">
          <h2 className="text-xl font-bold text-neutral-900">Our Mission</h2>
          <p>
            Event production is fast-paced, high-stakes, and inherently human. Yet for decades, event staffing across India has relied on informal WhatsApp groups, late cash payments, and unreliable turnouts. At the same time, attendees struggle to find verified local event schedules without dealing with intrusive ticket scalpers.
          </p>
          <p>
            Evencify was built to solve this two-sided challenge: providing transparent, verified shift contracts and guaranteed escrow payouts for event crew, while offering organizers a single pane of glass to hire, manage, and coordinate event personnel seamlessly.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const seo = useMemo(() => getSEOData({ type: 'contact' }), []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-16">
      <SEOHead seo={seo} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={seo.breadcrumbItems} />

        <div className="mt-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <Mail className="h-4 w-4 text-[#FED000]" />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
            {seo.h1}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed">
            Have questions about posting an event, crew verification, or platform partnerships? Reach out to our operational team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-xs space-y-6">
            <h2 className="text-xl font-bold text-neutral-900">Evencify Operations HQ</h2>
            <div className="space-y-4 text-sm text-neutral-600">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#FED000] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block">Surat Headquarters:</strong>
                  402, Riverfront Commercial Complex, Vesu Main Road, Surat, Gujarat 395007, India
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#FED000] shrink-0" />
                <div>
                  <strong className="text-neutral-900 block">Email:</strong>
                  contact@evencify.com / support@evencify.com
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#FED000] shrink-0" />
                <div>
                  <strong className="text-neutral-900 block">Phone Support:</strong>
                  +91 (0261) 450-EVNC / +91 98250 00000
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-xs">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Send a Message</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you! Your message has been sent to our support desk.');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Mehta"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm focus:outline-none focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm focus:outline-none focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Message / Inquiry</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about your event staffing needs or feedback..."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm focus:outline-none focus:border-neutral-900"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-neutral-900 py-3 text-xs font-bold text-white hover:bg-black transition-colors cursor-pointer"
              >
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  const seo = useMemo(() => getSEOData({ type: 'privacy' }), []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-16">
      <SEOHead seo={seo} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={seo.breadcrumbItems} />

        <div className="mt-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <Shield className="h-4 w-4 text-[#FED000]" />
            <span>Legal Notice</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            {seo.h1}
          </h1>
          <p className="mt-2 text-xs text-neutral-500">Last updated: September 2026</p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-xs text-sm text-neutral-700 space-y-6 leading-relaxed">
          <p>
            Evencify (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy in compliance with Indian Information Technology Act, 2000 and Digital Personal Data Protection (DPDP) Act.
          </p>
          <h3 className="text-base font-bold text-neutral-900">1. Information We Collect</h3>
          <p>
            We collect personal identity details provided during account creation (Name, Email, Mobile number, City), crew verification documentation (Govt ID, experience records), and transaction logs required for escrow payout processing.
          </p>
          <h3 className="text-base font-bold text-neutral-900">2. Geolocation Data</h3>
          <p>
            When utilizing our &quot;Events Near Me&quot; discovery feature, location coordinates are processed ephemerally on the client-side device to calculate Haversine distance to event venues. We do not store or sell continuous background location tracking.
          </p>
          <h3 className="text-base font-bold text-neutral-900">3. Contact</h3>
          <p>For data inquiries or deletion requests, contact privacy@evencify.com.</p>
        </div>
      </div>
    </div>
  );
};

export const TermsOfServicePage: React.FC = () => {
  const seo = useMemo(() => getSEOData({ type: 'terms' }), []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-16">
      <SEOHead seo={seo} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={seo.breadcrumbItems} />

        <div className="mt-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <FileText className="h-4 w-4 text-[#FED000]" />
            <span>Platform Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            {seo.h1}
          </h1>
          <p className="mt-2 text-xs text-neutral-500">Last updated: September 2026</p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-xs text-sm text-neutral-700 space-y-6 leading-relaxed">
          <h3 className="text-base font-bold text-neutral-900">1. Platform Role</h3>
          <p>
            Evencify provides an online marketplace facilitating discovery of public events and workforce matchmaking between independent event organizers and freelance event crew.
          </p>
          <h3 className="text-base font-bold text-neutral-900">2. Escrow & Shift Payments</h3>
          <p>
            Organizers agree to fund event crew shift budgets into the escrow vault prior to shift commencement. Upon satisfactory shift delivery, funds are disbursed according to the agreed day rate or shift rate.
          </p>
          <h3 className="text-base font-bold text-neutral-900">3. Code of Conduct</h3>
          <p>
            Crew members and organizers agree to uphold professional standards on-site. Discrimination, no-shows without prior emergency notification, or unsafe working conditions result in immediate profile suspension.
          </p>
        </div>
      </div>
    </div>
  );
};

export const GlobalFaqPage: React.FC = () => {
  const seo = useMemo(() => getSEOData({ type: 'faq' }), []);

  const allFaqs = [
    {
      q: 'What is Evencify?',
      a: 'Evencify is India’s event discovery and staffing platform. It allows users to discover upcoming events across India and enables event organizers to hire background-verified event crew with escrow payout security.',
    },
    {
      q: 'How do I find events near me today or this weekend?',
      a: 'Visit evencify.com/events/near-me or tap "Events Near Me" in the top navigation. Allow location access to view events sorted by exact road distance, or filter by your city.',
    },
    {
      q: 'How does Evencify protect crew payments?',
      a: 'Organizers deposit shift budgets into the Evencify Escrow Vault before shifts start. Once your shift is verified by the organizer, funds are released directly to your bank account or UPI on the same day.',
    },
    {
      q: 'How do event organizers create and staff an event?',
      a: 'Sign up as an Organizer, click "Create Event", add your event details (venue, schedule, expected attendance), specify required crew roles (ushers, security, promoters, technicians), and publish to receive applications.',
    },
    {
      q: 'Which cities does Evencify support?',
      a: 'Evencify has active hubs across Surat, Ahmedabad, Vadodara, Rajkot, Mumbai, Pune, Bengaluru, Delhi NCR, Hyderabad, Chennai, Kolkata, and Jaipur.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-16">
      <SEOHead seo={seo} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={seo.breadcrumbItems} />

        <div className="mt-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <HelpCircle className="h-4 w-4 text-[#FED000]" />
            <span>Help Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            {seo.h1}
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Everything you need to know about discovering events and working shifts on Evencify.
          </p>
        </div>

        <FaqAccordion
          title="Frequently Asked Questions"
          description="Detailed answers to common questions about Evencify."
          faqs={allFaqs}
        />
      </div>
    </div>
  );
};

export const StaticPage: React.FC<{ pageType?: 'about' | 'contact' | 'privacy' | 'terms' | 'faq' }> = ({
  pageType = 'about',
}) => {
  switch (pageType) {
    case 'about':
      return <AboutPage />;
    case 'contact':
      return <ContactPage />;
    case 'privacy':
      return <PrivacyPolicyPage />;
    case 'terms':
      return <TermsOfServicePage />;
    case 'faq':
      return <GlobalFaqPage />;
    default:
      return <AboutPage />;
  }
};

