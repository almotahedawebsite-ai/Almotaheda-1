import React from 'react';
import Link from 'next/link';
import { tField } from '@/domain/types/settings';
import { Service } from '@/domain/types/service';
import { FiGrid, FiArrowLeft, FiStar, FiDroplet, FiShield, FiSearch, FiCoffee, FiTool, FiSun, FiBriefcase, FiUser, FiCheckCircle } from 'react-icons/fi';

const serviceIcons: Record<string, React.ReactNode> = {
  'cleaning': <FiDroplet />, 'sanitization': <FiShield />, 'pest-control': <FiSearch />, 'restaurant': <FiCoffee />,
  'maintenance': <FiTool />, 'landscaping': <FiSun />, 'corporate': <FiBriefcase />, 'labor': <FiUser />, 'contracts': <FiCheckCircle />,
};

export default function ServicesSection({ services, locale }: { services: Service[]; locale: string }) {
  if (services.length === 0) return null;

  return (
    <section className="py-24 bg-white dark:bg-slate-900" id="services-section">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-5 py-2 rounded-full text-sm font-black mb-4">
            <FiGrid /> {locale === 'ar' ? 'خدماتنا' : 'Our Services'}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
            {locale === 'ar' ? 'خدمات متكاملة لكل احتياجاتك' : 'Comprehensive Services for All Your Needs'}
          </h2>
          <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
            {locale === 'ar' ? 'نقدم مجموعة شاملة من خدمات النظافة والتعقيم والصيانة بأيدي فريق متخصص ومدرب' : 'A complete range of cleaning, sanitization and maintenance services by a specialized team'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service, idx) => (
            <Link
              key={service.id}
              href={`/${locale}/services/${service.slug}`}
              className="group bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 hover:border-brand-teal/50 hover:shadow-2xl hover:shadow-brand-teal/10 relative overflow-hidden flex flex-col transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
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

        {services.length > 6 && (
          <div className="text-center mt-12">
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center gap-2 bg-brand-navy text-white hover:bg-brand-teal px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-brand-navy/20 hover:shadow-brand-teal/20"
            >
              {locale === 'ar' ? 'عرض جميع الخدمات' : 'View All Services'}
              <span>({services.length})</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
