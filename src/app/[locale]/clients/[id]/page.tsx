import React from 'react';
import Link from 'next/link';
import { ServerKeyClientRepository } from '@/infrastructure/repositories/server/ServerKeyClientRepository';
import { tField } from '@/domain/types/settings';
import { notFound } from 'next/navigation';
import { FiArrowLeft, FiBriefcase } from 'react-icons/fi';

export default async function ClientDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const repo = new ServerKeyClientRepository();
  const client = await repo.getById(id);

  if (!client) notFound();

  const allClients = await repo.getActive();
  const otherClients = allClients.filter(c => c.id !== client.id);

  return (
    <div className="pt-20 animate-fade-in-up">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-brand-navy to-brand-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-brand-teal rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <Link href={`/${locale}/clients`} className="inline-flex items-center gap-2 text-white/60 hover:text-white font-bold text-sm mb-6 transition-colors">
            <FiArrowLeft /> {locale === 'ar' ? 'العودة لقائمة العملاء' : 'Back to Clients'}
          </Link>
          <div className="flex items-center gap-6">
            {client.logo ? (
              <img src={client.logo} alt={tField(client.name, locale)} className="w-24 h-24 object-contain rounded-2xl bg-white/10 p-3" />
            ) : (
              <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center text-5xl"><FiBriefcase /></div>
            )}
            <div>
              <h1 className="text-4xl md:text-5xl font-black">{tField(client.name, locale)}</h1>
              {client.category && (
                <span className="inline-block bg-white/10 text-white/80 px-4 py-1 rounded-full text-sm font-bold mt-3">{client.category}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6 max-w-4xl">
          {client.image && (
            <div className="rounded-3xl overflow-hidden shadow-xl mb-10">
              <img src={client.image} alt={tField(client.name, locale)} className="w-full h-[400px] object-cover" />
            </div>
          )}

          <div className="bg-gray-50 dark:bg-slate-800 p-10 rounded-3xl border border-gray-100 dark:border-slate-700">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
              {locale === 'ar' ? 'عن العميل' : 'About the Client'}
            </h2>
            {tField(client.description, locale) ? (
              <div className="text-gray-600 dark:text-gray-300 leading-loose whitespace-pre-line text-lg">
                {tField(client.description, locale)}
              </div>
            ) : (
              <p className="text-gray-400 text-lg">{locale === 'ar' ? 'سيتم إضافة التفاصيل قريباً' : 'Details coming soon'}</p>
            )}
          </div>
        </div>
      </section>

      {/* Other Clients */}
      {otherClients.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8">
              {locale === 'ar' ? 'عملاء آخرون' : 'Other Clients'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {otherClients.map(c => (
                <Link
                  key={c.id}
                  href={`/${locale}/clients/${c.id}`}
                  className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 card-hover group text-center"
                >
                  {c.logo ? (
                    <img src={c.logo} alt={tField(c.name, locale)} className="w-16 h-16 mx-auto mb-3 object-contain rounded-xl" />
                  ) : (
                    <div className="w-16 h-16 mx-auto mb-3 bg-brand-navy/5 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform"><FiBriefcase className="text-brand-navy" /></div>
                  )}
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-teal transition-colors text-sm">
                    {tField(c.name, locale)}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
