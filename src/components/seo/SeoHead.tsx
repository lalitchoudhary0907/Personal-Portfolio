/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { siteConfig, getSiteUrl } from '../../config/site';
import { portfolioData } from '../../data/portfolio';

interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  canonicalPath?: string;
}

/**
 * Manages dynamic search engine optimization (SEO), OpenGraph social cards,
 * Twitter sharing tags, canonical link headers, and Schema.org JSON-LD structured data.
 */
export const SeoHead: React.FC<SeoHeadProps> = ({
  title = siteConfig.title,
  description = siteConfig.description,
  image = '/og-image.png',
  canonicalPath = '',
}) => {
  useEffect(() => {
    const siteUrl = getSiteUrl();
    const fullCanonicalUrl = siteUrl ? `${siteUrl}${canonicalPath || ''}` : '';
    const fullImageUrl = image.startsWith('http') ? image : (siteUrl ? `${siteUrl}${image}` : image);

    // 1. Sync document title
    document.title = title;

    // Helper to create or update meta tags
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrValue);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Helper to create or update link tags
    const setLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    // 2. Standard Search Metadata
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'author', portfolioData.personalInfo.fullName);
    setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('name', 'googlebot', 'index, follow');
    setMetaTag('name', 'theme-color', '#070b14');

    // 3. Canonical URL (only set when canonical URL is known or derived)
    if (fullCanonicalUrl) {
      setLinkTag('canonical', fullCanonicalUrl);
    }

    // 4. OpenGraph Metadata
    setMetaTag('property', 'og:site_name', `${portfolioData.personalInfo.fullName} Portfolio`);
    setMetaTag('property', 'og:type', 'profile');
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    if (fullCanonicalUrl) {
      setMetaTag('property', 'og:url', fullCanonicalUrl);
    }
    setMetaTag('property', 'og:image', fullImageUrl);
    if (fullImageUrl.startsWith('https://')) {
      setMetaTag('property', 'og:image:secure_url', fullImageUrl);
    }
    setMetaTag('property', 'og:image:type', 'image/png');
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
    setMetaTag('property', 'og:image:alt', `${portfolioData.personalInfo.fullName} - Computer Science & AI Student, Aspiring Software Engineer`);
    setMetaTag('property', 'og:locale', 'en_US');

    // Profile-specific OpenGraph extensions
    setMetaTag('property', 'profile:first_name', 'Lalit');
    setMetaTag('property', 'profile:last_name', 'Choudhary');
    setMetaTag('property', 'profile:username', 'lalitchoudhary0907');

    // 5. Twitter / X Sharing Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', fullImageUrl);
    setMetaTag('name', 'twitter:image:alt', `${portfolioData.personalInfo.fullName} Portfolio Showcase`);

    // 6. Schema.org JSON-LD Structured Data
    const personId = siteUrl ? `${siteUrl}/#person` : '#person';
    const websiteId = siteUrl ? `${siteUrl}/#website` : '#website';
    const webpageId = fullCanonicalUrl ? `${fullCanonicalUrl}#webpage` : '#webpage';
    const primaryPersonUrl = siteUrl || portfolioData.personalInfo.socials.github.url;

    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': [
        // Entity 1: Person (Lalit Choudhary)
        {
          '@type': 'Person',
          '@id': personId,
          name: portfolioData.personalInfo.fullName,
          givenName: 'Lalit',
          familyName: 'Choudhary',
          jobTitle: 'Aspiring Software Engineer',
          description: description,
          url: primaryPersonUrl,
          email: `mailto:${portfolioData.personalInfo.email}`,
          image: fullImageUrl,
          alumniOf: {
            '@type': 'CollegeOrUniversity',
            name: `${portfolioData.education[0].institution}, ${portfolioData.education[0].university}`,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Sonipat',
              addressRegion: 'Haryana',
              addressCountry: 'India',
            },
          },
          knowsAbout: [
            'Python',
            'TypeScript',
            'JavaScript',
            'React',
            'Next.js',
            'Artificial Intelligence',
            'Machine Learning',
            'Quantitative Modeling',
            'Git & Open Source',
            'RESTful APIs',
            'Distributed Systems',
          ],
          award: [
            'WorldQuant Challenge Gold Level',
            'WorldQuant Challenge Silver Level',
            'WorldQuant Challenge Bronze Level',
            'Hacktoberfest Hack Day Sonipat',
          ],
          sameAs: [
            portfolioData.personalInfo.socials.github.url,
            portfolioData.personalInfo.socials.linkedin.url,
          ],
        },
        // Entity 2: WebSite
        {
          '@type': 'WebSite',
          '@id': websiteId,
          url: siteUrl || primaryPersonUrl,
          name: `${portfolioData.personalInfo.fullName} Portfolio`,
          description: description,
          inLanguage: 'en-US',
          author: {
            '@id': personId,
          },
        },
        // Entity 3: ProfilePage
        {
          '@type': 'ProfilePage',
          '@id': webpageId,
          url: fullCanonicalUrl || primaryPersonUrl,
          name: title,
          description: description,
          isPartOf: {
            '@id': websiteId,
          },
          mainEntity: {
            '@id': personId,
          },
        },
      ],
    };

    // Inject or update structured data script
    let scriptTag = document.getElementById('schema-json-ld') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-json-ld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(schemaData, null, 2);
  }, [title, description, image, canonicalPath]);

  return null;
};
