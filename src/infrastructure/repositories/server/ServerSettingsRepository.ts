import { unstable_cache } from 'next/cache';
import { adminDb } from '../../firebase/admin';
import { ServerBaseRepository } from './ServerBaseRepository';
import { SiteSettings } from '../../../domain/types/settings';

export class ServerSettingsRepository extends ServerBaseRepository<SiteSettings> {
  private static readonly GLOBAL_DOC_ID = 'global_settings';

  constructor() {
    super(adminDb, 'settings');
  }

  async getGlobalSettings(): Promise<SiteSettings> {
    return unstable_cache(
      async () => {
        const doc = await this.getById(ServerSettingsRepository.GLOBAL_DOC_ID);
        if (doc) return doc;
        
        return {
          id: ServerSettingsRepository.GLOBAL_DOC_ID,
          websiteSchema: '',
          organizationSchema: '',
          metaTitle: { ar: 'المتحدة لخدمات النظافة', en: 'Al-Motaheda Cleaning Service' },
          metaDescription: { ar: 'شركة المتحدة لخدمات النظافة والتعقيم والصيانة', en: 'Al-Motaheda Cleaning Service' },
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
          aboutContent: { ar: 'شركة المتحدة لخدمات النظافة', en: 'Al-Motaheda Cleaning Service' },
          aboutImage: '',
          whatsappCta: '',
          pagesSeo: {},
          enableDarkMode: false,
          enableMultiLanguage: false,
          defaultLocale: 'ar'
        } as SiteSettings;
      },
      ['global-settings-v2'],
      { tags: ['settings'] }
    )();
  }

  async saveGlobalSettings(data: Partial<SiteSettings>): Promise<void> {
    const exists = await this.getById(ServerSettingsRepository.GLOBAL_DOC_ID);
    if (exists) {
      await this.update(ServerSettingsRepository.GLOBAL_DOC_ID, data);
    } else {
      // Re-use logic or implement create
      await this.create(ServerSettingsRepository.GLOBAL_DOC_ID, {
        id: ServerSettingsRepository.GLOBAL_DOC_ID,
        ...data
      } as SiteSettings);
    }
  }
}
