import React from 'react';
import Link from 'next/link';
import { tField } from '@/domain/types/settings';
import { Branch } from '@/domain/types/branch';
import { FiMap, FiMapPin, FiPhone } from 'react-icons/fi';

export default function BranchesSection({ branches, locale }: { branches: Branch[]; locale: string }) {
  return (
    <section className="py-24 bg-white dark:bg-slate-900" id="branches-section">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-5 py-2 rounded-full text-sm font-black mb-4">
            <FiMap /> {locale === 'ar' ? 'فروعنا' : 'Our Branches'}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
            {locale === 'ar' ? 'نغطي أكثر من محافظة' : 'We Cover Multiple Governorates'}
          </h2>
        </div>

        {branches.length === 0 ? (
          <div className="text-center py-10 flex flex-col items-center justify-center">
            <FiMap className="text-5xl mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-400 text-lg font-bold">
              {locale === 'ar' ? 'سيتم إضافة الفروع قريباً' : 'Branches coming soon'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.slice(0, 3).map((branch) => (
              <div key={branch.id} className="bg-gray-50 dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-700 card-hover">
                {branch.image ? (
                  <img src={branch.image} alt={tField(branch.name, locale)} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-brand-navy to-brand-teal flex items-center justify-center text-6xl text-white/30 group-hover:scale-105 transition-transform duration-500">
                    <FiMap />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{tField(branch.name, locale)}</h3>
                  {tField(branch.address, locale) && (
                    <p className="text-gray-500 text-sm mb-3 flex items-center gap-2">
                      <FiMapPin className="text-brand-teal" /> {tField(branch.address, locale)}
                    </p>
                  )}
                  {branch.phone && (
                    <p className="text-gray-500 text-sm mb-3 flex items-center gap-2">
                      <FiPhone className="text-brand-teal" /> <span dir="ltr">{branch.phone}</span>
                    </p>
                  )}
                  {branch.googleMapUrl && (
                    <a
                      href={branch.googleMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-brand-teal font-bold text-sm hover:underline group-hover:-translate-y-0.5 transition-transform"
                    >
                      <FiMap /> {locale === 'ar' ? 'عرض على الخريطة' : 'View on Map'}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {branches.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href={`/${locale}/branches`}
              className="inline-flex items-center gap-2 bg-brand-navy text-white hover:bg-brand-teal px-8 py-4 rounded-2xl font-bold transition-all"
            >
              {locale === 'ar' ? 'عرض جميع الفروع' : 'View All Branches'}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
