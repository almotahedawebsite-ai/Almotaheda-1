export type TranslatableString = string | { ar: string; en: string };

export const tField = (field: TranslatableString | undefined | null, locale: string): string => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return (field as any)[locale] || field.ar || '';
};

export interface SiteSettings {
  id: string;
  websiteSchema: string;
  organizationSchema: string;
  metaTitle: TranslatableString;
  metaDescription: TranslatableString;
  metaGraphImage: string;
  faviconUrl: string;
  metaPixelId: string;
  googleAnalyticsId: string;
  tiktokPixelId: string;
  snapchatPixelId: string;
  googleTagManagerId: string;
  customHeadCode: string;
  customBodyCode: string;

  // Branding Integration
  siteName: TranslatableString;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;

  // Navbar Appearance
  navbarBgColor: string;       // e.g. '#ffffff'
  navbarOpacity: number;       // 0–100 (default state)
  navbarScrolledOpacity: number; // 0–100 (after scroll)
  navbarTextColor: string;     // e.g. '#1e293b'

  // Corporate Data
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactAddress: TranslatableString;
  contactMapUrl: string;

  // Social Media Links
  socialLinks: { platform: string; url: string; icon?: string }[];

  aboutTitle: TranslatableString;
  aboutContent: TranslatableString;
  aboutImage: string;

  // WhatsApp CTA
  whatsappCta: string;

  // Payment Settings
  instapayQrImage: string;
  eWalletNumber: string;

  // Per-Page SEO
  pagesSeo: Record<string, {
    h1: TranslatableString;
    h2: TranslatableString;
    metaTitle: TranslatableString;
    metaDescription: TranslatableString;
  }>;

  // System Toggles
  enableDarkMode: boolean;
  enableMultiLanguage: boolean;
  defaultLocale?: 'ar' | 'en';
}
