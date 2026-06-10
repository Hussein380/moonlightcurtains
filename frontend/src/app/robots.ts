import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.moonlightcurtains.co.ke';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/checkout/', '/cart/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
