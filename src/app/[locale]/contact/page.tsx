import React from 'react';
import { ServerSettingsRepository } from '@/infrastructure/repositories/server/ServerSettingsRepository';
import ContactForm from '@/presentation/components/ContactForm';
import { tField } from '@/domain/types/settings';
import Link from 'next/link';
import { FiPhone, FiMessageSquare, FiMail, FiMapPin, FiClipboard } from 'react-icons/fi';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const settingsRepo = new ServerSettingsRepository();
  const settings = await settingsRepo.getGlobalSettings();

  return (
    <div className="pt-20 animate-fade-in-up">
      {/* Hero */}
      <section className="py-20 flex items-center justify-center text-white text-center relative overflow-hidden min-h-[40vh]">
        {/* Background Layering */}
        <img 
          src="https://res.cloudinary.com/dsr72hebx/image/upload/v1775242947/bg_contact_1775242865464_caa8eo.jpg"
          alt="Contact Us Background"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-95"
        />
        <div className="absolute inset-0 hero-gradient opacity-40 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/40 via-brand-navy/30 to-brand-navy z-10" />

        {/* Animated Effects */}
        <div className="absolute inset-0 z-10 overflow-hidden mix-blend-screen opacity-50 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-teal rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-black mb-4">
            <FiPhone /> {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            {locale === 'ar' ? 'نحن هنا لمساعدتك' : 'We Are Here to Help'}
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {locale === 'ar' ? 'فريقنا متاح دائماً للرد على استفساراتك وتلبية متطلباتك' : 'Our team is always available to answer your inquiries'}
          </p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Info */}
            <div className="space-y-6">
              {/* WhatsApp */}
              {(settings.whatsappCta || settings.contactWhatsapp) && (
                <a
                  href={`https://wa.me/${(settings.whatsappCta || settings.contactWhatsapp).replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-50 dark:bg-green-900/20 p-8 rounded-2xl border border-green-100 dark:border-green-800/30 flex items-center gap-6 hover:shadow-lg hover:-translate-y-1 transition-all group"
                >
                  <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-lg shadow-green-500/20">
                    <FiMessageSquare />
                  </div>
                  <div>
                    <h3 className="font-black text-green-800 dark:text-green-300 mb-1 text-lg">{locale === 'ar' ? 'واتساب (الأسرع)' : 'WhatsApp (Fastest)'}</h3>
                    <p className="text-green-600 font-mono text-lg" dir="ltr">{settings.whatsappCta || settings.contactWhatsapp}</p>
                  </div>
                </a>
              )}

              {/* Phone */}
              <div className="bg-gray-50 dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center gap-6 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-brand-teal/10 text-brand-teal rounded-2xl flex items-center justify-center text-3xl">
                  <FiPhone />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white mb-1 text-lg">{locale === 'ar' ? 'الهاتف المباشر' : 'Direct Phone'}</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-mono text-lg" dir="ltr">{settings.contactPhone || (locale === 'ar' ? 'لم يتم إضافته بعد' : 'Not added yet')}</p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-gray-50 dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center gap-6 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-brand-navy/10 text-brand-navy dark:text-brand-teal rounded-2xl flex items-center justify-center text-3xl">
                  <FiMail />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white mb-1 text-lg">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-mono text-lg">{settings.contactEmail || (locale === 'ar' ? 'لم يتم إضافته بعد' : 'Not added yet')}</p>
                </div>
              </div>

              {/* Address */}
              <div className="bg-gray-50 dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center gap-6 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl flex items-center justify-center text-3xl">
                  <FiMapPin />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white mb-1 text-lg">{locale === 'ar' ? 'العنوان الرئيسي' : 'Main Address'}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{tField(settings.contactAddress, locale) || (locale === 'ar' ? 'لم يتم تحديده' : 'Not set')}</p>
                </div>
              </div>

              {/* Booking CTA */}
              <Link
                href={`/${locale}/booking`}
                className="block bg-gradient-to-r from-brand-navy to-brand-teal text-white p-8 rounded-2xl text-center hover:shadow-xl transition-all group"
              >
                <FiClipboard className="text-3xl mb-3 flex justify-center w-full group-hover:scale-110 transition-transform" />
                <h3 className="font-black text-xl mb-1">{locale === 'ar' ? 'احجز خدمتك الآن' : 'Book Your Service Now'}</h3>
                <p className="text-white/60 text-sm">{locale === 'ar' ? 'نموذج الحجز السريع مع خيارات الدفع الإلكتروني' : 'Quick booking form with electronic payment options'}</p>
              </Link>
            </div>

            {/* Map & Form */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col">
              {settings.contactMapUrl && (
                <div 
                  className="w-full h-72 bg-gray-100 relative"
                  dangerouslySetInnerHTML={{ __html: settings.contactMapUrl }}
                />
              )}
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
