import React from 'react';
import Link from 'next/link';
import { FiCalendar, FiMessageSquare } from 'react-icons/fi';

export default function CTASection({ settings, locale }: { settings: any; locale: string }) {
  return (
    <section className="py-24 bg-gradient-to-br from-brand-navy via-brand-dark to-brand-navy text-white relative overflow-hidden" id="cta-section">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-teal/10 rounded-full blur-[120px]" />
      </div>
      <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
          {locale === 'ar' ? 'جاهزين نخدمك بأعلى جودة' : 'Ready to Serve You with the Highest Quality'}
        </h2>
        <p className="text-xl text-white/70 mb-10 leading-relaxed">
          {locale === 'ar'
            ? 'تواصل معنا اليوم واحصل على خدمة نظافة وصيانة احترافية لمنشأتك'
            : 'Contact us today and get professional cleaning and maintenance services for your facility'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href={`/${locale}/booking`}
            className="group bg-white text-brand-navy hover:bg-brand-teal hover:text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-2xl flex items-center gap-2"
          >
            <FiCalendar className="group-hover:scale-110 transition-transform" /> {locale === 'ar' ? 'احجز الآن' : 'Book Now'}
          </Link>
          {(settings.whatsappCta || settings.contactWhatsapp) && (
            <a
              href={`https://wa.me/${(settings.whatsappCta || settings.contactWhatsapp || '').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-2xl inline-flex items-center gap-3"
            >
              <FiMessageSquare className="group-hover:animate-pulse" /> {locale === 'ar' ? 'واتساب' : 'WhatsApp'}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
