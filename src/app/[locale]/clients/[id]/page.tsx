import React from 'react';
import Link from 'next/link';
import { ServerKeyClientRepository } from '@/infrastructure/repositories/server/ServerKeyClientRepository';
import { tField } from '@/domain/types/settings';
import { notFound } from 'next/navigation';
import {
  FiArrowLeft, FiArrowRight, FiBriefcase, FiStar, FiCheckCircle, FiAward,
} from 'react-icons/fi';
import { MdOutlineHotel, MdOutlineAccountBalance, MdOutlineLocationCity } from 'react-icons/md';

// ── Category labels ────────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, { ar: string; en: string; color: string }> = {
  hotels:       { ar: 'فنادق',                     en: 'Hotels',            color: 'bg-amber-100 text-amber-700' },
  government:   { ar: 'وزارات ومؤسسات حكومية',    en: 'Government',        color: 'bg-blue-100 text-blue-700' },
  military:     { ar: 'منشآت عسكرية',              en: 'Military',          color: 'bg-red-100 text-red-700' },
  malls:        { ar: 'مولات تجارية',              en: 'Malls',             color: 'bg-purple-100 text-purple-700' },
  universities: { ar: 'جامعات',                    en: 'Universities',      color: 'bg-green-100 text-green-700' },
  commercial:   { ar: 'مشاريع تجارية وترفيهية',   en: 'Commercial',        color: 'bg-cyan-100 text-cyan-700' },
  towers:       { ar: 'أبراج وعقارات',             en: 'Towers',            color: 'bg-teal-100 text-teal-700' },
  companies:    { ar: 'شركات',                     en: 'Companies',         color: 'bg-pink-100 text-pink-700' },
};

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const repo = new ServerKeyClientRepository();
  const client = await repo.getById(id);
  if (!client) notFound();

  const allClients = await repo.getActive();
  // Show up to 8 related clients (same category first, then others)
  const sameCategory = allClients.filter(c => c.id !== client.id && c.category === client.category);
  const others = allClients.filter(c => c.id !== client.id && c.category !== client.category);
  const relatedClients = [...sameCategory, ...others].slice(0, 8);

  const catConfig = CATEGORY_LABELS[client.category] ?? null;
  const isRtl = locale === 'ar';
  const BackIcon = isRtl ? FiArrowRight : FiArrowLeft;

  return (
    <div className="pt-20 animate-fade-in-up" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-slate-900 to-brand-dark text-white">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-teal/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px]" />
        </div>

        {/* Background image if available */}
        {client.image && (
          <div className="absolute inset-0">
            <img src={client.image} alt="" className="w-full h-full object-cover opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 to-brand-dark/90" />
          </div>
        )}

        <div className="container mx-auto px-6 py-20 relative z-10">
          {/* Breadcrumb */}
          <Link
            href={`/${locale}/clients`}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-bold mb-10 transition-colors group"
          >
            <BackIcon className="group-hover:-translate-x-1 transition-transform" />
            {isRtl ? 'العودة لقائمة العملاء' : 'Back to Clients'}
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Logo */}
            <div className="shrink-0">
              {(client.logo || client.image) ? (
                <div className="w-28 h-28 md:w-36 md:h-36 bg-white rounded-3xl shadow-2xl p-4 flex items-center justify-center">
                  <img
                    src={client.logo || client.image}
                    alt={tField(client.name, locale)}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 md:w-36 md:h-36 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
                  <FiBriefcase className="text-5xl text-white/60" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              {catConfig && (
                <span className={`inline-block text-xs font-black px-4 py-1.5 rounded-full mb-4 ${catConfig.color}`}>
                  {isRtl ? catConfig.ar : catConfig.en}
                </span>
              )}
              <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
                {tField(client.name, locale)}
              </h1>
              {tField(client.description, locale) && (
                <p className="text-white/60 text-lg leading-relaxed max-w-2xl line-clamp-3">
                  {tField(client.description, locale)}
                </p>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/10">
                  <FiStar className="text-amber-400" />
                  {isRtl ? 'عميل متميز' : 'Featured Client'}
                </span>
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/10">
                  <FiCheckCircle className="text-green-400" />
                  {isRtl ? 'خدمة مُعتمدة' : 'Verified Service'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left: Description */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image */}
              {client.image && (
                <div className="rounded-3xl overflow-hidden shadow-xl">
                  <img
                    src={client.image}
                    alt={tField(client.name, locale)}
                    className="w-full h-72 md:h-96 object-cover"
                  />
                </div>
              )}

              {/* Description Card */}
              <div className="bg-gray-50 dark:bg-slate-800 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-slate-700">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-5 flex items-center gap-3">
                  <span className="w-8 h-8 bg-brand-teal/10 rounded-xl flex items-center justify-center text-brand-teal">
                    <FiBriefcase />
                  </span>
                  {isRtl ? 'عن العميل' : 'About the Client'}
                </h2>
                {tField(client.description, locale) ? (
                  <div className="text-gray-600 dark:text-gray-300 leading-loose text-lg whitespace-pre-line">
                    {tField(client.description, locale)}
                  </div>
                ) : (
                  <p className="text-gray-400 text-lg">
                    {isRtl ? 'سيتم إضافة التفاصيل قريباً' : 'Details coming soon'}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="bg-gradient-to-br from-brand-navy to-brand-dark text-white rounded-3xl p-7 shadow-xl">
                <h3 className="font-black text-lg mb-5 flex items-center gap-2">
                  <FiAward className="text-brand-teal" />
                  {isRtl ? 'معلومات سريعة' : 'Quick Info'}
                </h3>
                <div className="space-y-4">
                  {catConfig && (
                    <div className="flex items-center justify-between py-3 border-b border-white/10">
                      <span className="text-white/50 text-sm">{isRtl ? 'التصنيف' : 'Category'}</span>
                      <span className="font-bold text-sm">{isRtl ? catConfig.ar : catConfig.en}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white/50 text-sm">{isRtl ? 'الحالة' : 'Status'}</span>
                    <span className="font-bold text-sm text-green-400 flex items-center gap-1">
                      <FiCheckCircle /> {isRtl ? 'عميل نشط' : 'Active Client'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-white/50 text-sm">{isRtl ? 'الخدمة' : 'Service'}</span>
                    <span className="font-bold text-sm text-brand-teal">{isRtl ? 'المتحدة' : 'Al-Motaheda'}</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-brand-teal/5 border-2 border-brand-teal/20 rounded-3xl p-7 text-center">
                <FiStar className="text-brand-teal text-3xl mx-auto mb-3" />
                <h3 className="font-black text-gray-900 dark:text-white mb-2">
                  {isRtl ? 'تحتاج خدمة مماثلة؟' : 'Need a similar service?'}
                </h3>
                <p className="text-gray-500 text-sm mb-5">
                  {isRtl
                    ? 'تواصل معنا الآن للحصول على أفضل الأسعار'
                    : 'Contact us now for the best prices'}
                </p>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-navy text-white font-bold px-6 py-3 rounded-2xl transition-all w-full shadow-lg"
                >
                  {isRtl ? 'تواصل معنا' : 'Contact Us'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Clients ── */}
      {relatedClients.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                {isRtl ? 'عملاء آخرون' : 'Other Clients'}
              </h2>
              <Link
                href={`/${locale}/clients`}
                className="text-brand-teal hover:text-brand-navy font-bold text-sm flex items-center gap-1 transition-colors"
              >
                {isRtl ? 'عرض الكل' : 'View All'} <FiArrowLeft className={isRtl ? 'rotate-180' : ''} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {relatedClients.map((c) => (
                <Link
                  key={c.id}
                  href={`/${locale}/clients/${c.id}`}
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 hover:border-brand-teal/40 hover:shadow-lg transition-all text-center"
                >
                  {(c.logo || c.image) ? (
                    <img
                      src={c.logo || c.image}
                      alt={tField(c.name, locale)}
                      className="w-16 h-16 mx-auto mb-3 object-contain rounded-xl group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-16 h-16 mx-auto mb-3 bg-brand-navy/5 dark:bg-brand-teal/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FiBriefcase className="text-2xl text-brand-navy dark:text-brand-teal" />
                    </div>
                  )}
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-teal transition-colors text-sm leading-tight">
                    {tField(c.name, locale)}
                  </h3>
                  {CATEGORY_LABELS[c.category] && (
                    <span className={`inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full ${CATEGORY_LABELS[c.category].color}`}>
                      {isRtl ? CATEGORY_LABELS[c.category].ar : CATEGORY_LABELS[c.category].en}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
