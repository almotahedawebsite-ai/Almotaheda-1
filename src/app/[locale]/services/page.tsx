import React from 'react';
import Link from 'next/link';
import { ServerServiceRepository } from '@/infrastructure/repositories/server/ServerServiceRepository';
import { tField } from '@/domain/types/settings';
import { FiDroplet, FiShield, FiSearch, FiCoffee, FiTool, FiSun, FiBriefcase, FiUser, FiCheckCircle, FiGrid, FiArrowLeft, FiStar, FiPhone } from 'react-icons/fi';

const serviceIcons: Record<string, React.ReactNode> = {
  'cleaning': <FiDroplet />, 'sanitization': <FiShield />, 'pest-control': <FiSearch />, 'restaurant': <FiCoffee />,
  'maintenance': <FiTool />, 'landscaping': <FiSun />, 'corporate': <FiBriefcase />, 'labor': <FiUser />, 'contracts': <FiCheckCircle />,
};

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const repo = new ServerServiceRepository();
  const services = await repo.getActive();

  return (
    <div className="pt-20 animate-fade-in-up">
      {/* Header */}
      <section className="py-20 flex items-center justify-center text-white text-center relative overflow-hidden min-h-[40vh]">
        {/* Background Layering */}
        <img 
          src="https://res.cloudinary.com/dsr72hebx/image/upload/v1775242956/bg_services_1775242898294_nniiyh.jpg"
          alt="All Services Background"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-95"
        />
        <div className="absolute inset-0 hero-gradient opacity-40 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/40 via-brand-navy/30 to-brand-navy z-10" />

        {/* Animated Effects */}
        <div className="absolute inset-0 z-10 overflow-hidden mix-blend-screen opacity-50 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-black mb-4">
            <FiGrid /> {locale === 'ar' ? 'خدماتنا' : 'Our Services'}
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            {locale === 'ar' ? 'خدمات متكاملة لكل احتياجاتك' : 'Complete Services for All Needs'}
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {locale === 'ar' ? 'نقدم أكثر من 16 خدمة احترافية في النظافة والتعقيم والصيانة' : 'More than 16 professional cleaning, sanitization and maintenance services'}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          {services.length === 0 ? (
            <div className="text-center py-20">
              <FiGrid className="text-6xl mb-4 block text-brand-navy group-hover:scale-110 transition-transform flex justify-center mx-auto" />
              <p className="text-gray-400 text-lg font-bold">{locale === 'ar' ? 'سيتم إضافة الخدمات قريباً' : 'Services coming soon'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {services.map((service, idx) => (
                <div
                  key={service.id}
                  className="group bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 hover:border-brand-teal/50 hover:shadow-2xl hover:shadow-brand-teal/10 relative overflow-hidden flex flex-col transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <Link href={`/${locale}/services/${service.slug}`} className="h-36 sm:h-56 relative overflow-hidden block">
                    {service.image ? (
                      <img 
                        src={service.image} 
                        alt={tField(service.name, locale)} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-navy to-brand-dark flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                        <span className="text-6xl text-white/10">{serviceIcons[service.category] || <FiStar />}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    
                    <div className={`absolute bottom-3 sm:bottom-4 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-lg shadow-brand-teal/30 group-hover:-translate-y-2 transition-transform duration-300 ${locale === 'ar' ? 'right-3 sm:right-4' : 'left-3 sm:left-4'} bg-brand-teal text-white`}>
                      {serviceIcons[service.category] || <FiStar />}
                    </div>
                  </Link>

                  <div className="p-3 sm:p-6 flex-1 flex flex-col relative z-10 bg-white dark:bg-slate-800">
                    <h3 className="text-sm sm:text-xl font-black text-gray-900 dark:text-white mb-1 sm:mb-2 group-hover:text-brand-teal transition-colors line-clamp-1">
                      {tField(service.name, locale)}
                    </h3>
                    {tField(service.description, locale) && (
                      <p className="hidden sm:block text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed mb-4 flex-1">
                        {tField(service.description, locale)}
                      </p>
                    )}
                    {/* Buttons */}
                    <div className="mt-auto flex flex-col sm:flex-row gap-2 pt-2 sm:pt-3 border-t border-gray-100 dark:border-slate-700">
                      <Link
                        href={`/${locale}/services/${service.slug}`}
                        className="flex-1 flex items-center justify-center gap-1 text-xs sm:text-sm font-bold px-2 sm:px-3 py-2 rounded-xl border-2 border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white transition-all duration-200"
                      >
                        {locale === 'ar' ? 'التفاصيل' : 'Details'} <FiArrowLeft className={`text-xs ${locale !== 'ar' ? 'rotate-180' : ''}`} />
                      </Link>
                      <Link
                        href={`/${locale}/contact`}
                        className="flex-1 flex items-center justify-center gap-1 text-xs sm:text-sm font-bold px-2 sm:px-3 py-2 rounded-xl border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white transition-all duration-200"
                      >
                        <FiPhone className="text-xs" /> {locale === 'ar' ? 'تواصل' : 'Contact'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
