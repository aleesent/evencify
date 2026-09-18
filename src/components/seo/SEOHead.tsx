import React, { useEffect } from 'react';
import { SEOOutput } from '../../services/seoData';

interface SEOHeadProps {
  seo: SEOOutput;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ seo }) => {
  useEffect(() => {
    // 1. Update Document Title
    document.title = seo.title;

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

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', seo.description);
    setMetaTag('name', 'robots', seo.robots);
    if (seo.keywords) {
      setMetaTag('name', 'keywords', seo.keywords);
    }

    // 3. Canonical Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', seo.canonicalUrl);

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', seo.ogTitle || seo.title);
    setMetaTag('property', 'og:description', seo.ogDescription || seo.description);
    setMetaTag('property', 'og:url', seo.canonicalUrl);
    setMetaTag('property', 'og:type', seo.ogType || 'website');
    setMetaTag('property', 'og:image', seo.ogImage);
    setMetaTag('property', 'og:site_name', 'Evencify');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', seo.twitterCard || 'summary_large_image');
    setMetaTag('name', 'twitter:title', seo.twitterTitle || seo.title);
    setMetaTag('name', 'twitter:description', seo.twitterDescription || seo.description);
    setMetaTag('name', 'twitter:image', seo.twitterImage || seo.ogImage);

    // 6. JSON-LD Structured Data
    // Remove existing dynamic json-ld scripts injected by SEOHead
    const existingScripts = document.querySelectorAll('script[data-seo-jsonld="true"]');
    existingScripts.forEach((script) => script.remove());

    if (seo.structuredData && seo.structuredData.length > 0) {
      seo.structuredData.forEach((data, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-jsonld', 'true');
        script.setAttribute('data-schema-index', String(index));
        script.text = JSON.stringify(data, null, 2);
        document.head.appendChild(script);
      });
    }

    // Cleanup on unmount or before next render
    return () => {
      const scripts = document.querySelectorAll('script[data-seo-jsonld="true"]');
      scripts.forEach((script) => script.remove());
    };
  }, [seo]);

  return null;
};
