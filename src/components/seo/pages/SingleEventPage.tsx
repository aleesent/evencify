import React, { useMemo, useState } from 'react';
import { EventItem, UserRole } from '../../../types';
import { SEOHead } from '../SEOHead';
import { Breadcrumbs } from '../Breadcrumbs';
import { RelatedEvents } from '../RelatedEvents';
import { getSEOData, slugify } from '../../../services/seoData';
import { navigateTo } from '../../../services/router';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building,
  Briefcase,
  Share2,
  Check,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Ticket,
} from 'lucide-react';

interface SingleEventPageProps {
  eventSlug: string;
  citySlug?: string;
  events: EventItem[];
  currentRole: UserRole;
  onApplyAsCrew?: (eventId: string, category: string) => void;
  onOpenAuthModal?: (role?: UserRole) => void;
}

export const SingleEventPage: React.FC<SingleEventPageProps> = ({
  eventSlug,
  citySlug,
  events,
  currentRole,
  onApplyAsCrew,
  onOpenAuthModal,
}) => {
  const [copied, setCopied] = useState(false);

  // Find event matching slug
  const event = useMemo(() => {
    const cleanSlug = slugify(eventSlug);
    return (
      events.find((e) => slugify(e.name) === cleanSlug || e.id.toLowerCase() === cleanSlug) ||
      events[0]
    );
  }, [eventSlug, events]);

  const seo = useMemo(() => {
    return getSEOData({
      type: 'event',
      event,
    });
  }, [event]);

  // Related events in same city
  const cityRelatedEvents = useMemo(() => {
    return events.filter(
      (e) => e.id !== event.id && e.city.toLowerCase() === event.city.toLowerCase()
    );
  }, [events, event]);

  // Related events in same category
  const categoryRelatedEvents = useMemo(() => {
    return events.filter(
      (e) => e.id !== event.id && e.eventType.toLowerCase() === event.eventType.toLowerCase()
    );
  }, [events, event]);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out ${event.name} happening in ${event.city} on ${event.date} at ${event.venue}: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `Join ${event.name} in ${event.city} on ${event.date} via @Evencify: ${window.location.href}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-16">
      <SEOHead seo={seo} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={seo.breadcrumbItems} />

        {/* Back navigation */}
        <div className="mt-2 mb-6">
          <button
            onClick={() => navigateTo(`/events/${slugify(event.city)}`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Events in {event.city}</span>
          </button>
        </div>

        {/* Main Event Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header Card */}
            <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-3 py-1 text-xs font-bold text-white">
                  <Sparkles className="h-3 w-3 text-[#FED000]" />
                  <span>{event.eventType}</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
                  <MapPin className="h-3 w-3 text-neutral-400" />
                  <span>{event.city}</span>
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    event.status === 'Open'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                  }`}
                >
                  {event.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                {event.name}
              </h1>

              {/* Organiser Bar */}
              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 font-bold text-xs">
                    <Building className="h-4 w-4 text-neutral-600" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400">Organised By</div>
                    <a
                      href={`/organiser/${slugify(event.organiserName)}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(`/organiser/${slugify(event.organiserName)}`);
                      }}
                      className="text-sm font-bold text-neutral-900 hover:underline flex items-center gap-1"
                    >
                      <span>{event.organiserName}</span>
                      <ExternalLink className="h-3 w-3 text-neutral-400" />
                    </a>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verified Event Production</span>
                </div>
              </div>
            </div>

            {/* Date, Time & Venue Key Info Card */}
            <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Date, Schedule & Venue</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                    <Calendar className="h-5 w-5 text-[#FED000]" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 font-medium">Event Date</div>
                    <div className="text-base font-bold text-neutral-900 mt-0.5">{event.date}</div>
                    <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {event.startTime} – {event.endTime} IST
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                    <MapPin className="h-5 w-5 text-[#FED000]" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 font-medium">Venue Address</div>
                    <div className="text-base font-bold text-neutral-900 mt-0.5">{event.venue}</div>
                    <div className="text-xs text-neutral-600 mt-0.5">
                      {event.fullAddress || `${event.venue}, ${event.city}`}
                    </div>
                  </div>
                </div>

                {event.expectedAttendance && (
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                      <Users className="h-5 w-5 text-[#FED000]" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 font-medium">Capacity</div>
                      <div className="text-base font-bold text-neutral-900 mt-0.5">
                        ~{event.expectedAttendance.toLocaleString()} Expected Guests
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5">Offline In-Person Event</div>
                    </div>
                  </div>
                )}

                {event.dressCode && (
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                      <Sparkles className="h-5 w-5 text-[#FED000]" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 font-medium">Dress Code / Attire</div>
                      <div className="text-sm font-semibold text-neutral-900 mt-0.5">
                        {event.dressCode}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Crew Shift Requirements (Workforce Transparency) */}
            {event.crewPositionsTotal > 0 && (
              <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">
                      Workforce & Crew Requirements
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Open staffing positions backed by escrow-secured same-day payouts.
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-900">
                    {event.crewPositionsAvailable} of {event.crewPositionsTotal} shifts open
                  </span>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-[#FED000]" />
                      <span className="font-bold text-sm text-neutral-900">
                        {event.requiredCategory}
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-neutral-900">
                      ₹{event.payAmount.toLocaleString()} / {event.payBasis.replace('Per ', '')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-neutral-600">
                    <div>
                      <span className="text-neutral-400">Experience:</span>{' '}
                      <strong>{event.experienceRequirement}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400">Gender:</span>{' '}
                      <strong>{event.genderRequirement}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400">Payout:</span>{' '}
                      <strong>{event.paymentTimeline}</strong>
                    </div>
                  </div>

                  {event.specialRequirements && (
                    <div className="pt-2 text-xs text-neutral-600 border-t border-neutral-200/60">
                      <span className="text-neutral-400">Briefing notes:</span>{' '}
                      {event.specialRequirements}
                    </div>
                  )}

                  {currentRole === 'crew' && onApplyAsCrew && (
                    <div className="pt-3">
                      <button
                        onClick={() => onApplyAsCrew(event.id, event.requiredCategory)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-black transition-colors cursor-pointer"
                      >
                        <Briefcase className="h-4 w-4 text-[#FED000]" />
                        <span>Apply for this Crew Shift</span>
                      </button>
                    </div>
                  )}

                  {currentRole !== 'crew' && onOpenAuthModal && (
                    <div className="pt-3">
                      <button
                        onClick={() => onOpenAuthModal('crew')}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-black transition-colors cursor-pointer"
                      >
                        <Briefcase className="h-4 w-4 text-[#FED000]" />
                        <span>Sign In as Crew to Apply</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Action & Share Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Action Box */}
            <div className="sticky top-28 rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm space-y-5">
              <div>
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Event Status
                </div>
                <div className="text-xl font-extrabold text-neutral-900 mt-1">
                  {event.status === 'Open' ? 'Registration Open' : event.status}
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Verified production schedule on Evencify. No hidden booking fees.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => alert(`Registration details for ${event.name} sent to your inbox!`)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FED000] py-3 text-sm font-bold text-neutral-950 hover:bg-[#FED000]/90 transition-colors shadow-xs cursor-pointer"
                >
                  <Ticket className="h-4 w-4 text-neutral-950" />
                  <span>Reserve Pass / Attend</span>
                </button>

                <a
                  href={`/events/${slugify(event.city)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(`/events/${slugify(event.city)}`);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  <span>More Events in {event.city}</span>
                </a>
              </div>

              {/* Social Share Suite */}
              <div className="pt-4 border-t border-neutral-100">
                <div className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Share2 className="h-3.5 w-3.5 text-neutral-500" />
                  <span>Share This Event</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white p-2 text-neutral-700 hover:border-neutral-400 transition-colors cursor-pointer"
                  >
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={handleShareTwitter}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white p-2 text-neutral-700 hover:border-neutral-400 transition-colors cursor-pointer"
                  >
                    <span>Twitter / X</span>
                  </button>
                  <button
                    onClick={handleShareLinkedIn}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white p-2 text-neutral-700 hover:border-neutral-400 transition-colors cursor-pointer"
                  >
                    <span>LinkedIn</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border p-2 transition-colors cursor-pointer ${
                      copied
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : null}
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-500 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#FED000] shrink-0" />
                <span>Verified venue safety, official schedule & zero scalping.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Events: More in City */}
        {cityRelatedEvents.length > 0 && (
          <RelatedEvents
            title={`More Upcoming Events in ${event.city}`}
            description={`Explore other verified productions, festivals, and workshops in ${event.city}.`}
            events={cityRelatedEvents}
            viewAllUrl={`/events/${slugify(event.city)}`}
            viewAllLabel={`View All in ${event.city}`}
            maxEvents={3}
          />
        )}

        {/* Related Events: More in Category */}
        {categoryRelatedEvents.length > 0 && (
          <RelatedEvents
            title={`More ${event.eventType} Events in India`}
            description={`Discover other verified ${event.eventType.toLowerCase()} happening across India.`}
            events={categoryRelatedEvents}
            viewAllUrl={`/events/${slugify(event.eventType)}`}
            viewAllLabel={`View All ${event.eventType} Events`}
            maxEvents={3}
          />
        )}
      </div>
    </div>
  );
};
