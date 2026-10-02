import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, ExternalLink, User, Building, PlusCircle, Shield, Share2 } from 'lucide-react';

interface DirectLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DirectLinkItem {
  title: string;
  description: string;
  category: 'crew' | 'event' | 'admin';
  queryParam: string;
  hashParam: string;
  pathParam: string;
}

export const DIRECT_LINKS: DirectLinkItem[] = [
  // Unified Auth
  {
    title: 'Evencify Unified Log In',
    description: 'Directly opens sign-in screen with role switcher for Crew Members and Organisers.',
    category: 'admin',
    queryParam: '/?auth=login',
    hashParam: '/#login',
    pathParam: '/login',
  },
  {
    title: 'Evencify Unified Create Account',
    description: 'Directly opens account registration with role selection.',
    category: 'admin',
    queryParam: '/?auth=signup',
    hashParam: '/#signup',
    pathParam: '/signup',
  },

  // Crew
  {
    title: 'Crew Log In',
    description: 'Directly opens sign-in screen pre-selected for verified Crew Members.',
    category: 'crew',
    queryParam: '/?auth=login&role=crew',
    hashParam: '/#crew-login',
    pathParam: '/crew/login',
  },
  {
    title: 'Crew Sign Up (Create Account)',
    description: 'Directly opens account creation for verified event crew members.',
    category: 'crew',
    queryParam: '/?auth=signup&role=crew',
    hashParam: '/#crew-signup',
    pathParam: '/crew/signup',
  },
  {
    title: 'Crew Portal / Shifts',
    description: 'Direct access to view shifts, gig applications, and crew earnings.',
    category: 'crew',
    queryParam: '/?role=crew',
    hashParam: '/#crew',
    pathParam: '/crew',
  },

  // Event & Organiser
  {
    title: 'Organiser Log In',
    description: 'Directly opens sign-in screen pre-selected for Event Organisers.',
    category: 'event',
    queryParam: '/?auth=login&role=organiser',
    hashParam: '/#event-login',
    pathParam: '/event/login',
  },
  {
    title: 'Organiser Sign Up (Create Account)',
    description: 'Directly opens account creation for event planners, agencies & companies.',
    category: 'event',
    queryParam: '/?auth=signup&role=organiser',
    hashParam: '/#event-signup',
    pathParam: '/event/signup',
  },
  {
    title: 'Create Event (Direct Post)',
    description: 'Directly launches the 4-step event publishing and staffing modal.',
    category: 'event',
    queryParam: '/?action=create-event',
    hashParam: '/#create-event',
    pathParam: '/create-event',
  },
  {
    title: 'Events & Organiser Portal',
    description: 'Direct access to manage events, applicant roster, and crew payouts.',
    category: 'event',
    queryParam: '/?role=organiser',
    hashParam: '/#events',
    pathParam: '/events',
  },

  // Admin
  {
    title: 'Operator & Admin Portal',
    description: 'Direct access to platform operations, Brevo SMTP settings, and audit logs.',
    category: 'admin',
    queryParam: '/?admin=true',
    hashParam: '/#admin',
    pathParam: '/admin',
  },
];

export const DirectLinksModal: React.FC<DirectLinksModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [format, setFormat] = useState<'query' | 'hash' | 'path'>('query');
  const [domainMode, setDomainMode] = useState<'current' | 'production'>('current');

  if (!isOpen) return null;

  const getFullUrl = (item: DirectLinkItem) => {
    const origin =
      domainMode === 'production'
        ? 'https://evencify.com'
        : window.location.origin;
    if (format === 'query') return `${origin}${item.queryParam}`;
    if (format === 'hash') return `${origin}${item.hashParam}`;
    return `${origin}${item.pathParam}`;
  };

  const handleCopy = (item: DirectLinkItem, index: number) => {
    const fullUrl = getFullUrl(item);
    navigator.clipboard.writeText(fullUrl);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleOpen = (item: DirectLinkItem) => {
    if (domainMode === 'production') {
      window.open(getFullUrl(item), '_blank', 'noopener,noreferrer');
      return;
    }
    const fullUrl = getFullUrl(item);
    // If opening within current app, dispatch URL and close modal
    if (format === 'query') {
      window.history.pushState({}, '', item.queryParam);
    } else if (format === 'hash') {
      window.location.hash = item.hashParam.replace('/', '');
    } else {
      window.history.pushState({}, '', item.pathParam);
    }
    window.dispatchEvent(new PopStateEvent('popstate'));
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative my-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-neutral-200/90 bg-white p-5 sm:p-8 z-10 shadow-2xl"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 rounded-full p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-800">
                <Share2 className="h-3.5 w-3.5 text-neutral-600" />
                Direct Navigation Links
              </span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
              Direct Open &amp; Share Links
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500">
              Use these direct links to immediately open login, create account, or create event modals from any page, email, social media, or QR code.
            </p>

            {/* Domain & URL Format Switchers */}
            <div className="mt-4 space-y-2.5 border-b border-neutral-100 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-neutral-500">Domain:</span>
                <button
                  type="button"
                  onClick={() => setDomainMode('current')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    domainMode === 'current'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  This App Preview ({window.location.host.slice(0, 18)}...)
                </button>
                <button
                  type="button"
                  onClick={() => setDomainMode('production')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    domainMode === 'production'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Production (evencify.com)
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-neutral-500">Link Style:</span>
                <button
                  type="button"
                  onClick={() => setFormat('query')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    format === 'query'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Query Params (/?auth=...)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('hash')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    format === 'hash'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Hash (/#crew-login)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('path')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    format === 'path'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Clean Paths (/crew/login)
                </button>
              </div>
            </div>
          </div>

          {/* Links list */}
          <div className="space-y-3">
            {DIRECT_LINKS.map((item, idx) => {
              const fullUrl = getFullUrl(item);
              const isCopied = copiedIndex === idx;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-4 hover:border-neutral-300 hover:bg-white transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-neutral-200 text-neutral-700 shrink-0">
                        {item.category === 'crew' ? (
                          <User className="h-4 w-4" />
                        ) : item.category === 'event' ? (
                          item.title.includes('Create') ? (
                            <PlusCircle className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Building className="h-4 w-4" />
                          )
                        ) : (
                          <Shield className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-neutral-900">{item.title}</h4>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                              item.category === 'crew'
                                ? 'bg-amber-100 text-amber-800'
                                : item.category === 'event'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-neutral-200 text-neutral-700'
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(item, idx)}
                        className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-900 text-white hover:bg-neutral-800'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpen(item)}
                        className="rounded-xl border border-neutral-200 bg-white p-1.5 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 transition-colors cursor-pointer"
                        title="Open Link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* URL Display */}
                  <div className="rounded-lg bg-neutral-100 px-3 py-1.5 text-[11px] font-mono text-neutral-700 truncate select-all">
                    {fullUrl}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>All links support query params, hash tags, and direct clean paths.</span>
            <button
              type="button"
              onClick={onClose}
              className="font-semibold text-neutral-900 hover:underline cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
