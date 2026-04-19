import React from 'react';
import { FiMapPin, FiPhoneCall, FiMail, FiMessageCircle } from 'react-icons/fi';
import { tField } from '@/domain/types/settings';

export default function ContactInfoSection({ settings, locale }: { settings: any; locale: string }) {
  const infoBlocks = [
    {
      icon: <FiPhoneCall />,
      title: locale === 'ar' ? 'اتصل بنا' : 'Call Us',
      value: settings.contactPhone,
      link: settings.contactPhone ? `tel:${settings.contactPhone}` : '#'
    },
    {
      icon: <FiMessageCircle />,
      title: locale === 'ar' ? 'واتساب' : 'WhatsApp',
      value: settings.contactWhatsapp || settings.whatsappCta,
      link: (settings.contactWhatsapp || settings.whatsappCta) 
        ? `https://wa.me/${(settings.contactWhatsapp || settings.whatsappCta || '').replace(/[^0-9]/g, '')}`
        : '#'
    },
    {
      icon: <FiMail />,
      title: locale === 'ar' ? 'البريد الإلكتروني' : 'Email Us',
      value: settings.contactEmail,
      link: settings.contactEmail ? `mailto:${settings.contactEmail}` : '#'
    },
    {
      icon: <FiMapPin />,
      title: locale === 'ar' ? 'مقرنا' : 'Our Location',
      value: tField(settings.contactAddress, locale),
      link: settings.contactMapUrl || '#'
    }
  ].filter(b => b.value && b.value.length > 0);

  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            {locale === 'ar' ? 'بيانات التواصل' : 'Contact Information'}
          </h2>
          <p className="text-gray-500 text-lg">
            {locale === 'ar' ? 'نحن متواجدون للرد على استفساراتكم من خلال القنوات التالية' : 'We are available to answer your inquiries through the following channels'}
          </p>
        </div>

        {infoBlocks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg font-bold">
              {locale === 'ar' ? 'المرجو إضافة بيانات التواصل من لوحة التحكم' : 'Please add contact information from the dashboard'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {infoBlocks.map((block, idx) => (
              <a 
                key={idx}
                href={block.link}
                target={block.link.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-center group hover:-translate-y-2 transition-all duration-300 shadow-lg border border-gray-100 dark:border-slate-700"
              >
                <div className="w-11 h-11 sm:w-16 sm:h-16 mx-auto bg-brand-teal/10 text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors rounded-full flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-6">
                  {block.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-xl mb-1 sm:mb-3">{block.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-xs sm:text-base break-all" dir="ltr">{block.value}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
