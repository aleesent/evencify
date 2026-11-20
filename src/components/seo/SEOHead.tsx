import React, { useEffect } from 'react';
import { SEOOutput } from '../../services/seoData';

interface SEOHeadProps {
  seo: SEOOutput;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ seo }) => {
  useEffect(() => {
    // 1. Update Document Title & Language
    document.title = seo.title;
    if (document.documentElement.lang !== 'en-IN') {
      document.documentElement.lang = 'en-IN';
    }

    // Helper to update or create meta tags
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    const removeMetaTag = (attrName: 'name' | 'property', attrValue: string) => {
      const meta = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (meta) meta.remove();
    };

    const setLinkTag = (rel: string, href: string, extra?: Record<string, string>) => {
      const extraSelector = extra?.hreflang ? `[hreflang="${extra.hreflang}"]` : '';
      let link = document.querySelector(`link[rel="${rel}"]${extraSelector}`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        if (extra) {
          Object.entries(extra).forEach(([k, v]) => link!.setAttribute(k, v));
        }
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // 2. Standard Meta Tags (never emit deprecated meta keywords)
    setMetaTag('name', 'description', seo.description);
    setMetaTag('name', 'robots', seo.robots);
    removeMetaTag('name', 'keywords');

    // 3. Canonical & Alternate Links
    setLinkTag('canonical', seo.canonicalUrl);
    if (seo.robots.startsWith('noindex')) {
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    } else {
      setLinkTag('alternate', seo.canonicalUrl, { hreflang: 'en-IN' });
      setLinkTag('alternate', seo.canonicalUrl, { hreflang: 'x-default' });
    }

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', seo.ogTitle || seo.title);
    setMetaTag('property', 'og:description', seo.ogDescription || seo.description);
    setMetaTag('property', 'og:url', seo.canonicalUrl);
    setMetaTag('property', 'og:type', seo.ogType || 'website');
    setMetaTag('property', 'og:image', seo.ogImage);
    setMetaTag('property', 'og:site_name', 'Evencify');
    setMetaTag('property', 'og:locale', 'en_IN');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', seo.twitterCard || 'summary_large_image');
    setMetaTag('name', 'twitter:site', '@evencify');
    setMetaTag('name', 'twitter:title', seo.twitterTitle || seo.title);
    setMetaTag('name', 'twitter:description', seo.twitterDescription || seo.description);
    setMetaTag('name', 'twitter:image', seo.twitterImage || seo.ogImage);

    // 6. JSON-LD Structured Data — replace ALL existing JSON-LD scripts cleanly to avoid duplicates
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach((script) => script.remove());

    if (seo.structuredData && seo.structuredData.length > 0) {
      seo.structuredData.forEach((data, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-jsonld', 'true');
        script.setAttribute('data-schema-index', String(index));
        script.text = JSON.stringify(data);
        document.head.appendChild(script);
      });
    }

    return () => {
      const scripts = document.querySelectorAll('script[data-seo-jsonld="true"]');
      scripts.forEach((script) => script.remove());
    };
  }, [seo]);

  return null;
};
