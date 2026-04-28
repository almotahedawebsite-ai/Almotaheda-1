import React from 'react';
import Link from 'next/link';
import { tField } from '@/domain/types/settings';
import { KeyClient } from '@/domain/types/keyClient';
import { SiteSettings } from '@/domain/types/settings';
import {
  FiStar,
  FiBriefcase,
  FiHome,
  FiShield,
  FiBook,
  FiShoppingBag,
  FiGrid,
  FiBarChart2,
} from 'react-icons/fi';
import { MdOutlineHotel, MdOutlineAccountBalance, MdOutlineLocationCity } from 'react-icons/md';

// ─── Category Config ────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<
  string,
  { labelAr: string; labelEn: string; icon: React.ReactNode; color: string }
> = {
  hotels: {
    labelAr: 'فنادق',
    labelEn: 'Hotels',
    icon: <MdOutlineHotel className="text-xl" />,
    color: 'from-amber-500/20 to-amber-600/10 border-amber-400/30 text-amber-300',
  },
  government: {
    labelAr: 'وزارات ومؤسسات حكومية',
    labelEn: 'Government',
    icon: <MdOutlineAccountBalance className="text-xl" />,
    color: 'from-blue-500/20 to-blue-600/10 border-blue-400/30 text-blue-300',
  },
  military: {
    labelAr: 'منشآت عسكرية',
    labelEn: 'Military',
    icon: <FiShield className="text-xl" />,
    color: 'from-red-500/20 to-red-600/10 border-red-400/30 text-red-300',
  },
  malls: {
    labelAr: 'مولات تجارية',
    labelEn: 'Malls',
    icon: <FiShoppingBag className="text-xl" />,
    color: 'from-purple-500/20 to-purple-600/10 border-purple-400/30 text-purple-300',
  },
  universities: {
    labelAr: 'جامعات',
    labelEn: 'Universities',
    icon: <FiBook className="text-xl" />,
    color: 'from-green-500/20 to-green-600/10 border-green-400/30 text-green-300',
  },
  commercial: {
    labelAr: 'مشاريع تجارية وترفيهية',
    labelEn: 'Commercial',
    icon: <FiGrid className="text-xl" />,
    color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-400/30 text-cyan-300',
  },
  towers: {
    labelAr: 'أبراج وعقارات',
    labelEn: 'Towers & Real Estate',
    icon: <MdOutlineLocationCity className="text-xl" />,
    color: 'from-teal-500/20 to-teal-600/10 border-teal-400/30 text-teal-300',
  },
  companies: {
    labelAr: 'شركات',
    labelEn: 'Companies',
    icon: <FiBarChart2 className="text-xl" />,
    color: 'from-pink-500/20 to-pink-600/10 border-pink-400/30 text-pink-300',
  },
};

const DEFAULT_CATEGORY = {
  labelAr: 'أماكن أخرى',
  labelEn: 'Other',
  icon: <FiHome className="text-xl" />,
  color: 'from-white/10 to-white/5 border-white/20 text-white/80',
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function KeyClientsSection({
  clients,
  locale,
  settings,
}: {
  clients: KeyClient[];
  locale: string;
  settings?: SiteSettings;
}) {
  // Group places by category
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
  const categoryOrder = ['hotels', 'government', 'military', 'malls', 'universities', 'commercial', 'towers', 'companies', 'other'];

  return (
    <section
      className="py-24 bg-gradient-to-br from-brand-navy to-brand-dark text-white relative overflow-hidden"
      id="clients-section"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-brand-teal rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-teal rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600 rounded-full blur-[130px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* ── Section Header ── */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-white/10 text-white px-5 py-2 rounded-full text-sm font-black mb-4 backdrop-blur-sm">
            <FiStar /> {locale === 'ar' ? 'عملاؤنا المميزون' : 'Our Key Clients'}
          </span>
          <h2 className="text-4xl md:text-5xl font-black leading-tight">
            {locale === 'ar' ? 'ثقة كبرى الشركات والمؤسسات' : 'Trusted by Major Organizations'}
          </h2>
          <p className="text-white/60 text-lg mt-4 max-w-2xl mx-auto">
            {locale === 'ar'
              ? 'نفتخر بخدمة أهم العملاء والمؤسسات في مصر'
              : "Proudly serving Egypt's most prestigious organizations"}
          </p>
        </div>

        {/* ── Clients Grid ── */}
        {clients.length === 0 ? (
          <div className="text-center py-10 flex flex-col items-center justify-center">
            <FiBriefcase className="text-5xl mb-4 text-white/20" />
            <p className="text-white/50 text-lg font-bold">
              {locale === 'ar' ? 'سيتم إضافة العملاء قريباً' : 'Clients coming soon'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {clients.map((client, idx) => (
              <Link
                key={client.id}
                href={`/${locale}/clients/${client.id}`}
                className="glass rounded-3xl p-8 text-center group hover:bg-white/20 transition-all cursor-pointer"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {(client.logo || client.image) ? (
                  <img
                    src={client.logo || client.image}
                    alt={tField(client.name, locale)}
                    className="w-20 h-20 mx-auto mb-4 object-contain rounded-2xl"
                  />
                ) : (
                  <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    <FiBriefcase />
                  </div>
                )}
                <h3 className="font-black text-white text-lg group-hover:text-brand-teal transition-colors">
                  {tField(client.name, locale)}
                </h3>
              </Link>
            ))}
          </div>
        )}

        {clients.length > 0 && (
          <div className="text-center mt-12 mb-20">
            <Link
              href={`/${locale}/clients`}
              className="inline-flex items-center gap-2 bg-white text-brand-navy hover:bg-brand-teal hover:text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-2xl"
            >
              {locale === 'ar' ? 'عرض جميع العملاء' : 'View All Clients'}
            </Link>
          </div>
        )}

        {/* ── Stats ── */}
        {settings && (settings.apartmentsCleanedCount || settings.villasCleanedCount) && (
          <div className="mt-20 border-t border-white/10 pt-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-black text-white">
                {locale === 'ar' ? 'أرقام نفخر بها' : 'Numbers We Are Proud Of'}
              </h3>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
              {settings.apartmentsCleanedCount && (
                <div className="glass rounded-3xl p-10 text-center flex-1 max-w-sm mx-auto group hover:bg-white/20 transition-all cursor-default">
                  <div className="text-5xl md:text-6xl font-black text-brand-teal mb-4 group-hover:scale-110 transition-transform">
                    +{settings.apartmentsCleanedCount}
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-white">
                    {locale === 'ar' ? 'شقة' : 'Apartments'}
                  </div>
                  <div className="text-white/60 mt-2">
                    {locale === 'ar' ? 'تم تقديم الخدمة لها' : 'Services provided'}
                  </div>
                </div>
              )}
              {settings.villasCleanedCount && (
                <div className="glass rounded-3xl p-10 text-center flex-1 max-w-sm mx-auto group hover:bg-white/20 transition-all cursor-default">
                  <div className="text-5xl md:text-6xl font-black text-brand-teal mb-4 group-hover:scale-110 transition-transform">
                    +{settings.villasCleanedCount}
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-white">
                    {locale === 'ar' ? 'فيلا' : 'Villas'}
                  </div>
                  <div className="text-white/60 mt-2">
                    {locale === 'ar' ? 'تم تقديم الخدمة لها' : 'Services provided'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Portfolio Places — Categorized ── */}
        {places.length > 0 && (
          <div className="mt-24">
            {/* Header */}
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 bg-white/10 text-white px-5 py-2 rounded-full text-sm font-black mb-4 backdrop-blur-sm">
                <FiBriefcase /> {locale === 'ar' ? 'سابقة الأعمال' : 'Portfolio'}
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-white">
                {locale === 'ar' ? 'أبرز مشاريعنا ومواقع عملنا' : 'Our Key Projects & Locations'}
              </h3>
              <p className="text-white/50 mt-3 max-w-xl mx-auto">
                {locale === 'ar'
                  ? 'نفخر بمحفظة متنوعة من المشاريع الكبرى في مختلف القطاعات'
                  : 'A diverse portfolio spanning multiple sectors across Egypt'}
              </p>
            </div>

            {/* Category Groups */}
            <div className="space-y-10">
              {categoryOrder.map((cat) => {
                const items = grouped[cat];
                if (!items || items.length === 0) return null;
                const config = CATEGORY_CONFIG[cat] ?? DEFAULT_CATEGORY;

                return (
                  <div key={cat}>
                    {/* Category Label */}
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-black bg-gradient-to-r border ${config.color} backdrop-blur-sm`}
                      >
                        {config.icon}
                        {locale === 'ar' ? config.labelAr : config.labelEn}
                      </div>
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-white/30 text-sm font-bold">{items.length}</span>
                    </div>

                    {/* Places Pills */}
                    <div className="flex flex-wrap gap-3">
                      {items.map((place, idx) => (
                        <div
                          key={idx}
                          className={`
                            group relative inline-flex items-center gap-2
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
        )}
      </div>
    </section>
  );
}
