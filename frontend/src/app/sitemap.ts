import { MetadataRoute } from 'next';
import { API_BASE } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.moonlightcurtains.co.ke';

  // Static core pages
  const staticPages = [
    '',
    '/shop',
    '/categories',
    '/guide',
    '/about',
    '/contact',
    '/custom-order',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : route === '/shop' ? 0.9 : 0.8,
  }));

  // Fetch all products dynamically from the backend
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_BASE}/products`, { cache: 'no-store' });
    if (res.ok) {
      const products = await res.json();
      productPages = products.map((product: any) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt || product.createdAt || new Date()),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
  }

  return [...staticPages, ...productPages];
}
