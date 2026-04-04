import React from 'react';
import Link from 'next/link';
import { ServerServiceRepository } from '@/infrastructure/repositories/server/ServerServiceRepository';
import { ServerSettingsRepository } from '@/infrastructure/repositories/server/ServerSettingsRepository';
import { tField } from '@/domain/types/settings';
import { notFound } from 'next/navigation';
import { FiArrowLeft, FiCalendar, FiMessageSquare, FiDroplet, FiShield, FiSearch, FiCoffee, FiTool, FiSun, FiBriefcase, FiUser, FiCheckCircle, FiStar } from 'react-icons/fi';

const serviceIcons: Record<string, React.ReactNode> = {
  'cleaning': <FiDroplet />, 'sanitization': <FiShield />, 'pest-control': <FiSearch />, 'restaurant': <FiCoffee />,
  'maintenance': <FiTool />, 'landscaping': <FiSun />, 'corporate': <FiBriefcase />, 'labor': <FiUser />, 'contracts': <FiCheckCircle />,
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const repo = new ServerServiceRepository();
  const service = await repo.getBySlug(slug);

  if (!service) notFound();

  const settingsRepo = new ServerSettingsRepository();
  const settings = await settingsRepo.getGlobalSettings();

  const allServices = await repo.getActive();
  const otherServices = allServices.filter(s => s.id !== service.id).slice(0, 4);

  return (
    <div className="pt-20 animate-fade-in-up">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-brand-navy to-brand-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-teal rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <Link href={`/${locale}/services`} className="inline-flex items-center gap-2 text-white/60 hover:text-white font-bold text-sm mb-6 transition-colors">
            <FiArrowLeft /> {locale === 'ar' ? 'العودة للخدمات' : 'Back to Services'}
          </Link>
          <h1 className="text-4xl md:text-6xl font-black mb-4">{tField(service.name, locale)}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image */}
              {service.image && (
                <div className="rounded-3xl overflow-hidden shadow-xl">
                  <img src={service.image} alt={tField(service.name, locale)} className="w-full h-[400px] object-cover" />
                </div>
              )}

              {/* Video */}
              {service.video && (
                <div className="rounded-3xl overflow-hidden shadow-xl">
                  <video 
                    controls 
                    className="w-full rounded-3xl"
                    poster={service.image || ''}
                  >
                    <source src={service.video} type="video/mp4" />
                  </video>
                </div>
              )}

              {/* Description */}
              <div className="bg-gray-50 dark:bg-slate-800 p-10 rounded-3xl border border-gray-100 dark:border-slate-700">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                  {locale === 'ar' ? 'تفاصيل الخدمة' : 'Service Details'}
                </h2>
                {tField(service.description, locale) ? (
                  <div className="text-gray-600 dark:text-gray-300 leading-loose whitespace-pre-line text-lg">
                    {tField(service.description, locale)}
                  </div>
                ) : (
                  <p className="text-gray-400 text-lg">{locale === 'ar' ? 'سيتم إضافة تفاصيل الخدمة قريباً' : 'Service details coming soon'}</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* CTA Card */}
              <div className="bg-gradient-to-br from-brand-navy to-brand-dark text-white p-8 rounded-3xl shadow-xl sticky top-28">
                <h3 className="text-xl font-black mb-4">
                  {locale === 'ar' ? 'احجز هذه الخدمة' : 'Book This Service'}
                </h3>
                <p className="text-white/60 text-sm mb-6">
                  {locale === 'ar' ? 'تواصل معنا الآن لحجز هذه الخدمة والحصول على أفضل النتائج' : 'Contact us now to book this service'}
                </p>
                <Link
                  href={`/${locale}/booking?service=${service.id}`}
                  className="group flex justify-center items-center gap-2 w-full bg-white text-brand-navy hover:bg-brand-teal hover:text-white py-4 rounded-2xl font-black transition-all shadow-lg text-lg"
                >
                  <FiCalendar className="group-hover:scale-110 transition-transform" /> {locale === 'ar' ? 'احجز الآن' : 'Book Now'}
                </Link>

                {(settings.whatsappCta || settings.contactWhatsapp) && (
                  <a
                    href={`https://wa.me/${(settings.whatsappCta || settings.contactWhatsapp).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`أريد الاستفسار عن خدمة: ${tField(service.name, 'ar')}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex justify-center items-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black transition-all mt-3 text-lg"
                  >
                    <FiMessageSquare className="group-hover:animate-pulse" /> {locale === 'ar' ? 'واتساب' : 'WhatsApp'}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Services */}
      {otherServices.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8">
              {locale === 'ar' ? 'خدمات أخرى قد تهمك' : 'Other Services You May Like'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherServices.map((s, idx) => (
                <Link
                  key={s.id}
                  href={`/${locale}/services/${s.slug}`}
                  className="group bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 hover:border-brand-teal/50 hover:shadow-2xl hover:shadow-brand-teal/10 relative overflow-hidden flex flex-col transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="h-40 relative overflow-hidden">
                    {s.image ? (
                      <img 
                        src={s.image} 
                        alt={tField(s.name, locale)} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-navy to-brand-dark flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                        <span className="text-5xl text-white/10">{serviceIcons[s.category] || <FiStar />}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    
                    <div className={`absolute bottom-3 w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-brand-teal/30 group-hover:-translate-y-1 transition-transform duration-300 ${locale === 'ar' ? 'right-3' : 'left-3'} bg-brand-teal text-white`}>
                      {serviceIcons[s.category] || <FiStar />}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col relative z-10 bg-white dark:bg-slate-800">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-brand-teal transition-colors line-clamp-2">
                      {tField(s.name, locale)}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
