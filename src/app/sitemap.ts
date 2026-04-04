import { MetadataRoute } from 'next';

let adminDb: any = null;
try {
  const adminModule = require('@/infrastructure/firebase/admin');
  adminDb = adminModule.adminDb;
} catch (e) {
  // Admin SDK not configured — will generate static-only sitemap
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://almotaheda.com';

  // Static pages
  const staticPages = [
    { path: '', priority: 1.0, freq: 'daily' as const },
    { path: '/services', priority: 0.9, freq: 'weekly' as const },
    { path: '/clients', priority: 0.8, freq: 'weekly' as const },
    { path: '/branches', priority: 0.8, freq: 'weekly' as const },
    { path: '/about', priority: 0.7, freq: 'monthly' as const },
    { path: '/contact', priority: 0.7, freq: 'monthly' as const },
    { path: '/booking', priority: 0.9, freq: 'weekly' as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Add static pages for both locales
  for (const locale of ['ar', 'en']) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.freq,
        priority: page.priority,
      });
    }
  }

  // Dynamic service pages (if Admin SDK is configured)
  if (adminDb) {
    try {
      const servicesSnap = await adminDb.collection('services').where('isActive', '==', true).get();
      for (const doc of servicesSnap.docs) {
        const data = doc.data();
        if (data.slug) {
          for (const locale of ['ar', 'en']) {
            entries.push({
              url: `${baseUrl}/${locale}/services/${data.slug}`,
              lastModified: data.updatedAt ? new Date(data.updatedAt) : new Date(),
              changeFrequency: 'weekly',
              priority: 0.7,
            });
          }
        }
      }
    } catch (e) {
      // Silently fail
    }

    try {
      const clientsSnap = await adminDb.collection('key_clients').where('isActive', '==', true).get();
      for (const doc of clientsSnap.docs) {
        const data = doc.data();
        for (const locale of ['ar', 'en']) {
          entries.push({
            url: `${baseUrl}/${locale}/clients/${data.id}`,
            lastModified: data.updatedAt ? new Date(data.updatedAt) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      }
    } catch (e) {
      // Silently fail
    }
  }

  return entries;
}
