import React from 'react';
import Link from 'next/link';
import { tField } from '@/domain/types/settings';
import { KeyClient } from '@/domain/types/keyClient';
import { FiStar, FiBriefcase } from 'react-icons/fi';

export default function KeyClientsSection({ clients, locale }: { clients: KeyClient[]; locale: string }) {
  return (
    <section className="py-24 bg-gradient-to-br from-brand-navy to-brand-dark text-white relative overflow-hidden" id="clients-section">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-brand-teal rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-teal rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-white/10 text-white px-5 py-2 rounded-full text-sm font-black mb-4 backdrop-blur-sm">
            <FiStar /> {locale === 'ar' ? 'عملاؤنا المميزون' : 'Our Key Clients'}
          </span>
          <h2 className="text-4xl md:text-5xl font-black leading-tight">
            {locale === 'ar' ? 'ثقة كبرى الشركات والمؤسسات' : 'Trusted by Major Organizations'}
          </h2>
          <p className="text-white/60 text-lg mt-4 max-w-2xl mx-auto">
            {locale === 'ar' ? 'نفتخر بخدمة أهم العملاء والمؤسسات في مصر' : 'Proudly serving Egypt\'s most prestigious organizations'}
          </p>
        </div>

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
                {client.logo ? (
                  <img src={client.logo} alt={tField(client.name, locale)} className="w-20 h-20 mx-auto mb-4 object-contain rounded-2xl" />
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
          <div className="text-center mt-12">
            <Link
              href={`/${locale}/clients`}
              className="inline-flex items-center gap-2 bg-white text-brand-navy hover:bg-brand-teal hover:text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-2xl"
            >
              {locale === 'ar' ? 'عرض جميع العملاء' : 'View All Clients'}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
