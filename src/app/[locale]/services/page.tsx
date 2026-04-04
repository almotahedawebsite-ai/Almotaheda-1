import React from 'react';
import Link from 'next/link';
import { ServerServiceRepository } from '@/infrastructure/repositories/server/ServerServiceRepository';
import { tField } from '@/domain/types/settings';
import { FiDroplet, FiShield, FiSearch, FiCoffee, FiTool, FiSun, FiBriefcase, FiUser, FiCheckCircle, FiGrid, FiArrowLeft, FiStar } from 'react-icons/fi';

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service, idx) => (
                <Link
                  key={service.id}
                  href={`/${locale}/services/${service.slug}`}
                  className="group bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 hover:border-brand-teal/50 hover:shadow-2xl hover:shadow-brand-teal/10 relative overflow-hidden flex flex-col transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="h-56 relative overflow-hidden">
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
                    
                    <div className={`absolute bottom-4 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-brand-teal/30 group-hover:-translate-y-2 transition-transform duration-300 ${locale === 'ar' ? 'right-4' : 'left-4'} bg-brand-teal text-white`}>
                      {serviceIcons[service.category] || <FiStar />}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col relative z-10 bg-white dark:bg-slate-800">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-brand-teal transition-colors line-clamp-1">
                      {tField(service.name, locale)}
                    </h3>
                    {tField(service.description, locale) && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed mb-4 flex-1">
                        {tField(service.description, locale)}
                      </p>
                    )}
                    <div className={`mt-auto flex items-center gap-2 text-sm font-bold text-brand-teal opacity-0 group-hover:opacity-100 transition-all duration-300 ${locale === 'ar' ? '-translate-x-4 group-hover:translate-x-0' : 'translate-x-4 group-hover:translate-x-0'}`}>
                      {locale === 'ar' ? 'تفاصيل الخدمة' : 'Service Details'} <FiArrowLeft className={locale === 'ar' ? '' : 'rotate-180'} />
                    </div>
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
