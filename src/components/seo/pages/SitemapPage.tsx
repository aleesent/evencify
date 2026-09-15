import React, { useState, useMemo } from 'react';
import { EventItem } from '../../../types';
import { SEOHead } from '../SEOHead';
import { Breadcrumbs } from '../Breadcrumbs';
import { generateAllSitemapEntries, generateSitemapXml, SitemapUrlEntry } from '../../../services/sitemapGenerator';
import { getSEOData } from '../../../services/seoData';
import { navigateTo } from '../../../services/router';
import {
  FileCode,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Search,
  Code,
  LayoutGrid,
} from 'lucide-react';

interface SitemapPageProps {
  events: EventItem[];
  rawXml?: boolean;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ events, rawXml = false }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'xml'>('html');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const entries = useMemo(() => generateAllSitemapEntries(events), [events]);
  const xmlString = useMemo(() => generateSitemapXml(entries), [entries]);

  const seo = useMemo(() => {
    return {
      title: 'HTML & XML Sitemap | Evencify Event Index',
      metaDescription: 'Complete index of all city event pages, category hubs, and verified event listings on Evencify.',
      canonicalUrl: 'https://evencify.com/sitemap',
      h1: 'Evencify Index & Sitemap',
      robots: 'index, follow',
      breadcrumbItems: [
        { label: 'Home', url: '/' },
        { label: 'Sitemap', url: '/sitemap' },
      ],
    };
  }, []);

  const filteredEntries = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.loc.toLowerCase().includes(q) ||
        e.section?.toLowerCase().includes(q)
    );
  }, [entries, search]);

  const sections = useMemo(() => {
    const map: Record<string, SitemapUrlEntry[]> = {};
    filteredEntries.forEach((e) => {
      const sec = e.section || 'General';
      if (!map[sec]) map[sec] = [];
      map[sec].push(e);
    });
    return map;
  }, [filteredEntries]);

  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    const path = url.replace('https://evencify.com', '');
    navigateTo(path || '/');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-16">
      <SEOHead seo={seo} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={seo.breadcrumbItems} />

        {/* Hero Header */}
        <div className="mt-4 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              <Globe className="h-4 w-4 text-[#FED000]" />
              <span>Full Index Directory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              {seo.h1}
            </h1>
            <p className="mt-2 text-sm text-neutral-600 max-w-2xl">
              Complete index containing {entries.length} indexed URLs across Indian cities, categories, dates, and live events.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('html')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'html'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Visual Index</span>
            </button>
            <button
              onClick={() => setActiveTab('xml')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'xml'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              <span>Raw sitemap.xml</span>
            </button>
          </div>
        </div>

        {activeTab === 'html' ? (
          <div>
            {/* Search Filter */}
            <div className="mb-8 max-w-md">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by city, category or URL..."
                  className="w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {(Object.entries(sections) as [string, SitemapUrlEntry[]][]).map(([secName, secEntries]) => (
                <div
                  key={secName}
                  className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs"
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-t-0 border-b border-neutral-100">
                    <h2 className="text-base font-bold text-neutral-900">{secName}</h2>
                    <span className="text-xs font-medium text-neutral-400">
                      {secEntries.length} pages
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {secEntries.map((item) => {
                      const path = item.loc.replace('https://evencify.com', '') || '/';
                      return (
                        <a
                          key={item.loc}
                          href={path}
                          onClick={(e) => handleLinkClick(e, item.loc)}
                          className="flex items-start justify-between gap-2 p-2.5 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-100/70 hover:border-neutral-200 transition-colors group"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-neutral-900 truncate group-hover:text-black">
                              {item.title || item.loc}
                            </div>
                            <div className="text-[11px] text-neutral-400 truncate">{item.loc}</div>
                          </div>
                          <span className="text-[10px] font-bold text-neutral-400 bg-white px-1.5 py-0.5 rounded border border-neutral-200 shrink-0">
                            P: {item.priority}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                <FileCode className="h-4 w-4 text-[#FED000]" />
                <span>XML Schema standard compliant (sitemaps.org 0.9)</span>
              </div>
              <button
                onClick={handleCopyXml}
                className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-black transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied XML' : 'Copy Sitemap XML'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-neutral-950 text-neutral-200 text-xs font-mono overflow-x-auto max-h-[600px] scrollbar-thin">
              {xmlString}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
