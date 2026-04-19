import { Firestore } from 'firebase/firestore';
import { BaseRepository } from './BaseRepository';
import { SiteSettings } from '../../domain/types/settings';

export class SettingsRepository extends BaseRepository<SiteSettings> {
  private static readonly GLOBAL_DOC_ID = 'global_settings';

  constructor(db: Firestore) {
    super(db, 'settings');
  }

  async getGlobalSettings(): Promise<SiteSettings> {
    const doc = await this.getById(SettingsRepository.GLOBAL_DOC_ID);
    if (doc) return doc;
    
    // Return empty defaults if not found
    return {
      id: SettingsRepository.GLOBAL_DOC_ID,
      websiteSchema: '',
      organizationSchema: '',
      metaTitle: { ar: 'المتحدة لخدمات النظافة', en: 'Al-Motaheda Cleaning Service' },
      metaDescription: { ar: 'شركة المتحدة لخدمات النظافة والتعقيم والصيانة - خبرة واحترافية في تنظيف الواجهات والمفروشات والفلل والمصانع والمستشفيات', en: 'Al-Motaheda Cleaning Service - Professional cleaning, sanitization, and maintenance services' },
      metaGraphImage: '',
      faviconUrl: '',
      metaPixelId: '',
      googleAnalyticsId: '',
      tiktokPixelId: '',
      snapchatPixelId: '',
      googleTagManagerId: '',
      customHeadCode: '',
      customBodyCode: '',
      siteName: { ar: 'المتحدة', en: 'Al-Motaheda' },
      logoUrl: '',
      primaryColor: '#0A2463',
      secondaryColor: '#3E92CC',
      navbarBgColor: '#ffffff',
      navbarOpacity: 95,
      navbarScrolledOpacity: 97,
      navbarTextColor: '#1e293b',
      contactEmail: '',
      contactPhone: '',
      contactWhatsapp: '',
      contactAddress: { ar: '', en: '' },
      contactMapUrl: '',
      socialLinks: [],
      aboutTitle: { ar: 'من نحن', en: 'About Us' },
      aboutContent: { ar: 'شركة المتحدة لخدمات النظافة - نقدم خدمات متكاملة في النظافة والتعقيم والصيانة بأعلى معايير الجودة والاحترافية.', en: 'Al-Motaheda Cleaning Service - Comprehensive cleaning, sanitization, and maintenance services with the highest quality standards.' },
      aboutImage: '',
      whatsappCta: '',
      instapayQrImage: '',
      eWalletNumber: '',
      pagesSeo: {},
      enableDarkMode: false,
      enableMultiLanguage: false,
      defaultLocale: 'ar'
    };
  }

  async saveGlobalSettings(data: Partial<SiteSettings>): Promise<void> {
    const exists = await this.getById(SettingsRepository.GLOBAL_DOC_ID);
    if (exists) {
      await this.update(SettingsRepository.GLOBAL_DOC_ID, data);
    } else {
      await this.create(SettingsRepository.GLOBAL_DOC_ID, {
        id: SettingsRepository.GLOBAL_DOC_ID,
        websiteSchema: data.websiteSchema || '',
        organizationSchema: data.organizationSchema || '',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        metaGraphImage: data.metaGraphImage || '',
        faviconUrl: data.faviconUrl || '',
        metaPixelId: data.metaPixelId || '',
        googleAnalyticsId: data.googleAnalyticsId || '',
        tiktokPixelId: data.tiktokPixelId || '',
        snapchatPixelId: data.snapchatPixelId || '',
        googleTagManagerId: data.googleTagManagerId || '',
        customHeadCode: data.customHeadCode || '',
        customBodyCode: data.customBodyCode || '',
        siteName: data.siteName || '',
        logoUrl: data.logoUrl || '',
        primaryColor: data.primaryColor || '#0A2463',
        secondaryColor: data.secondaryColor || '#3E92CC',
        navbarBgColor: data.navbarBgColor || '#ffffff',
        navbarOpacity: data.navbarOpacity ?? 95,
        navbarScrolledOpacity: data.navbarScrolledOpacity ?? 97,
        navbarTextColor: data.navbarTextColor || '#1e293b',
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || '',
        contactWhatsapp: data.contactWhatsapp || '',
        contactAddress: data.contactAddress || '',
        contactMapUrl: data.contactMapUrl || '',
        socialLinks: data.socialLinks || [],
        aboutTitle: data.aboutTitle || '',
        aboutContent: data.aboutContent || '',
        aboutImage: data.aboutImage || '',
        whatsappCta: data.whatsappCta || '',
        instapayQrImage: data.instapayQrImage || '',
        eWalletNumber: data.eWalletNumber || '',
        pagesSeo: data.pagesSeo || {},
        enableDarkMode: data.enableDarkMode ?? false,
        enableMultiLanguage: data.enableMultiLanguage ?? false,
        defaultLocale: data.defaultLocale || 'ar'
      });
    }
  }
}
