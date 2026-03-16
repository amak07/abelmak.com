import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://abelmak.com',
      lastModified: '2026-03-16',
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
