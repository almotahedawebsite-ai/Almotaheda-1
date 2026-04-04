import React from 'react';
import Link from 'next/link';
import { FiStar, FiBriefcase, FiArrowLeft } from 'react-icons/fi';
import { ServerKeyClientRepository } from '@/infrastructure/repositories/server/ServerKeyClientRepository';
import { tField } from '@/domain/types/settings';

export default async function ClientsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const repo = new ServerKeyClientRepository();
  const clients = await repo.getActive();

  return (
    <div className="pt-20 animate-fade-in-up">
      {/* Header */}
      <section className="py-20 flex items-center justify-center text-white text-center relative overflow-hidden min-h-[40vh]">
        {/* Background Layering */}
        <img 
          src="https://res.cloudinary.com/dsr72hebx/image/upload/v1775243510/bg_clients_1775243426851_z9chsf.jpg"
          alt="Clients Background"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-95"
        />
        <div className="absolute inset-0 hero-gradient opacity-40 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/40 via-brand-navy/30 to-brand-navy z-10" />

        {/* Animated Effects */}
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
            {locale === 'ar' ? 'نفتخر بخدمة أهم العملاء والمؤسسات في مصر' : 'Proudly serving Egypt\'s most prestigious organizations'}
          </p>
        </div>
      </section>

      {/* Clients Grid */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          {clients.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <FiStar className="text-6xl mb-4 text-brand-navy" />
              <p className="text-gray-400 text-lg font-bold">{locale === 'ar' ? 'سيتم إضافة العملاء قريباً' : 'Clients coming soon'}</p>
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
    </div>
  );
}
