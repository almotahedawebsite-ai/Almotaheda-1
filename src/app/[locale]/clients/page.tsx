import React from 'react';
import Link from 'next/link';
import { FiStar, FiBriefcase, FiArrowLeft, FiBarChart2, FiBook, FiShield, FiShoppingBag, FiGrid, FiHome } from 'react-icons/fi';
import { MdOutlineHotel, MdOutlineAccountBalance, MdOutlineLocationCity } from 'react-icons/md';
import { ServerKeyClientRepository } from '@/infrastructure/repositories/server/ServerKeyClientRepository';
import { ServerSettingsRepository } from '@/infrastructure/repositories/server/ServerSettingsRepository';
import { tField } from '@/domain/types/settings';

// ─── Category Config (same as KeyClientsSection) ─────────────────────────────
const CATEGORY_CONFIG: Record<string, { labelAr: string; labelEn: string; icon: React.ReactNode; color: string }> = {
  hotels:      { labelAr: 'فنادق', labelEn: 'Hotels', icon: <MdOutlineHotel className="text-xl" />, color: 'from-amber-500/20 to-amber-600/10 border-amber-400/30 text-amber-600 dark:text-amber-300' },
  government:  { labelAr: 'وزارات ومؤسسات حكومية', labelEn: 'Government', icon: <MdOutlineAccountBalance className="text-xl" />, color: 'from-blue-500/20 to-blue-600/10 border-blue-400/30 text-blue-700 dark:text-blue-300' },
  military:    { labelAr: 'منشآت عسكرية', labelEn: 'Military', icon: <FiShield className="text-xl" />, color: 'from-red-500/20 to-red-600/10 border-red-400/30 text-red-700 dark:text-red-300' },
  malls:       { labelAr: 'مولات تجارية', labelEn: 'Malls', icon: <FiShoppingBag className="text-xl" />, color: 'from-purple-500/20 to-purple-600/10 border-purple-400/30 text-purple-700 dark:text-purple-300' },
  universities:{ labelAr: 'جامعات', labelEn: 'Universities', icon: <FiBook className="text-xl" />, color: 'from-green-500/20 to-green-600/10 border-green-400/30 text-green-700 dark:text-green-300' },
  commercial:  { labelAr: 'مشاريع تجارية وترفيهية', labelEn: 'Commercial', icon: <FiGrid className="text-xl" />, color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-400/30 text-cyan-700 dark:text-cyan-300' },
  towers:      { labelAr: 'أبراج وعقارات', labelEn: 'Towers & Real Estate', icon: <MdOutlineLocationCity className="text-xl" />, color: 'from-teal-500/20 to-teal-600/10 border-teal-400/30 text-teal-700 dark:text-teal-300' },
  companies:   { labelAr: 'شركات', labelEn: 'Companies', icon: <FiBarChart2 className="text-xl" />, color: 'from-pink-500/20 to-pink-600/10 border-pink-400/30 text-pink-700 dark:text-pink-300' },
};

const DEFAULT_CATEGORY = {
  labelAr: 'أماكن أخرى', labelEn: 'Other',
  icon: <FiHome className="text-xl" />,
  color: 'from-gray-200/50 to-gray-100/30 border-gray-300/50 text-gray-600 dark:text-gray-300',
};

const CATEGORY_ORDER = ['hotels', 'government', 'military', 'malls', 'universities', 'commercial', 'towers', 'companies', 'other'];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ClientsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const repo = new ServerKeyClientRepository();
  const clients = await repo.getActive();

  const settingsRepo = new ServerSettingsRepository();
  const settings = await settingsRepo.getGlobalSettings();

  const places = settings?.topRequestedPlaces ?? [];
  const grouped = places.reduce<Record<string, { ar: string; en: string; category?: string }[]>>(
    (acc, place) => {
      const cat = place.category ?? 'other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(place);
      return acc;
    },
    {}
  );

  return (
    <div className="pt-20 animate-fade-in-up">
      {/* ── Header ── */}
      <section className="py-20 flex items-center justify-center text-white text-center relative overflow-hidden min-h-[40vh]">
        <img
          src="https://res.cloudinary.com/dsr72hebx/image/upload/v1775243510/bg_clients_1775243426851_z9chsf.jpg"
          alt="Clients Background"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-95"
        />
        <div className="absolute inset-0 hero-gradient opacity-40 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/40 via-brand-navy/30 to-brand-navy z-10" />
        <div className="absolute inset-0 z-10 overflow-hidden mix-blend-screen opacity-50 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-teal rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-black mb-4">
            <FiStar /> {locale === 'ar' ? 'عملاؤنا المميزون' : 'Our Key Clients'}
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            {locale === 'ar' ? 'ثقة كبرى المؤسسات' : 'Trusted by Major Organizations'}
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {locale === 'ar' ? 'نفتخر بخدمة أهم العملاء والمؤسسات في مصر' : "Proudly serving Egypt's most prestigious organizations"}
          </p>
        </div>
      </section>

      {/* ── Clients Grid ── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          {clients.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <FiStar className="text-6xl mb-4 text-brand-navy" />
              <p className="text-gray-400 text-lg font-bold">
                {locale === 'ar' ? 'سيتم إضافة العملاء قريباً' : 'Clients coming soon'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {clients.map((client) => (
                <Link
                  key={client.id}
                  href={`/${locale}/clients/${client.id}`}
                  className="card-hover group bg-gray-50 dark:bg-slate-800 rounded-3xl p-10 border border-gray-100 dark:border-slate-700 hover:border-brand-teal/30 text-center"
                >
                  {client.logo ? (
                    <img src={client.logo} alt={tField(client.name, locale)} className="w-24 h-24 mx-auto mb-6 object-contain rounded-2xl" />
                  ) : (
                    <div className="w-24 h-24 mx-auto mb-6 bg-brand-navy/5 dark:bg-brand-teal/10 rounded-2xl flex items-center justify-center text-5xl group-hover:scale-110 transition-transform text-brand-navy">
                      <FiBriefcase />
                    </div>
                  )}
                  <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-brand-teal transition-colors mb-2">
                    {tField(client.name, locale)}
                  </h3>
                  {tField(client.description, locale) && (
                    <p className="text-gray-500 text-sm line-clamp-2 mt-2">{tField(client.description, locale)}</p>
                  )}
                  <div className="mt-4 flex justify-center items-center gap-2 text-sm font-bold text-brand-teal opacity-0 group-hover:opacity-100 transition-opacity">
                    {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'} <FiArrowLeft />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Portfolio Places — Categorized ── */}
      {places.length > 0 && (
        <section className="py-24 bg-gradient-to-br from-brand-navy to-brand-dark text-white relative overflow-hidden">
          {/* Background blobs */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-brand-teal rounded-full blur-[100px]" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-teal rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600 rounded-full blur-[130px]" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            {/* Header */}
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 bg-white/10 text-white px-5 py-2 rounded-full text-sm font-black mb-4 backdrop-blur-sm">
                <FiBriefcase /> {locale === 'ar' ? 'سابقة الأعمال' : 'Portfolio'}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white">
                {locale === 'ar' ? 'أبرز مشاريعنا ومواقع عملنا' : 'Our Key Projects & Locations'}
              </h2>
              <p className="text-white/50 mt-4 max-w-xl mx-auto text-lg">
                {locale === 'ar'
                  ? 'نفخر بمحفظة متنوعة من المشاريع الكبرى في مختلف القطاعات'
                  : 'A diverse portfolio spanning multiple sectors across Egypt'}
              </p>
            </div>

            {/* Category Groups */}
            <div className="space-y-12">
              {CATEGORY_ORDER.map((cat) => {
                const items = grouped[cat];
                if (!items || items.length === 0) return null;
                const config = CATEGORY_CONFIG[cat] ?? DEFAULT_CATEGORY;

                return (
                  <div key={cat}>
                    {/* Category Label Row */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-black bg-gradient-to-r border backdrop-blur-sm ${config.color}`}>
                        {config.icon}
                        {locale === 'ar' ? config.labelAr : config.labelEn}
                      </div>
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-white/30 text-sm font-bold">{items.length}</span>
                    </div>

                    {/* Pills */}
                    <div className="flex flex-wrap gap-3">
                      {items.map((place, idx) => (
                        <div
                          key={idx}
                          className={`
                            inline-flex items-center gap-2
                            bg-gradient-to-br border backdrop-blur-md
                            px-5 py-3 rounded-2xl font-bold
                            hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-default
                            text-sm md:text-base
                            ${config.color}
                          `}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />
                          {tField(place, locale)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
