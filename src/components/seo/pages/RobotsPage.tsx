import React, { useMemo } from 'react';
import { SEOHead } from '../SEOHead';
import { Breadcrumbs } from '../Breadcrumbs';
import { FileText, Copy, Check } from 'lucide-react';

const ROBOTS_TEXT = `User-agent: *
Allow: /
Allow: /events/
Allow: /events/*
Allow: /crew-jobs
Allow: /event-staffing
Allow: /organise-event
Allow: /event-management
Allow: /about
Allow: /contact
Allow: /privacy
Allow: /terms
Allow: /faq
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /auth/
Disallow: /chat/
Disallow: /account/
Disallow: /*?*sort=
Disallow: /*?*filter=
Disallow: /*?*session=

# Sitemap directive
Sitemap: https://evencify.com/sitemap.xml`;

export const RobotsPage: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const seo = useMemo(() => {
    return {
      title: 'robots.txt | Evencify Search Crawler Directives',
      metaDescription: 'Robots.txt instructions and indexing rules for Evencify.com search crawlers.',
      canonicalUrl: 'https://evencify.com/robots.txt',
      h1: 'Robots.txt Configuration',
      robots: 'noindex, follow',
      breadcrumbItems: [
        { label: 'Home', url: '/' },
        { label: 'robots.txt', url: '/robots.txt' },
      ],
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(ROBOTS_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-16">
      <SEOHead seo={seo} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={seo.breadcrumbItems} />

        <div className="mt-4 mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              <FileText className="h-4 w-4 text-[#FED000]" />
              <span>Crawler Directives</span>
            </div>
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              {seo.h1}
            </h1>
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-black transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Directives'}</span>
          </button>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
          <pre className="p-4 rounded-xl bg-neutral-950 text-neutral-200 text-xs font-mono overflow-x-auto">
            {ROBOTS_TEXT}
          </pre>
        </div>
      </div>
    </div>
  );
};
