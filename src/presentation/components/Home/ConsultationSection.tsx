import React from 'react';
import Link from 'next/link';
import { FiMessageSquare, FiPhoneCall, FiCheckCircle } from 'react-icons/fi';
import { tField } from '@/domain/types/settings';

export default function ConsultationSection({ locale, settings }: { locale: string; settings: any }) {
  return (
    <section className="bg-brand-navy overflow-hidden relative">
      <div className="flex flex-col lg:flex-row w-full items-stretch min-h-[600px]">
        
        {/* Image Side */}
        <div className="w-full lg:w-1/2 relative min-h-[400px]">
          <img 
            src={settings.aboutImage || 'https://res.cloudinary.com/dsr72hebx/image/upload/v1775242937/image_about_1775242848845_o49wej.jpg'} 
            alt={locale === 'ar' ? 'استشارة مجانية' : 'Free Consultation'} 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          {/* Navy Overlay to match brand */}
          <div className="absolute inset-0 bg-brand-navy mix-blend-multiply opacity-50" />
          
          {/* Gradient masking for smooth blend into the solid color */}
          <div className={`absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-${locale === 'ar' ? 'r' : 'l'} from-brand-dark via-transparent to-transparent opacity-80`} />
        </div>

        {/* Text Side */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-brand-navy to-brand-dark p-12 md:p-24 text-white relative z-10 flex flex-col justify-center border-t lg:border-t-0 lg:border-r border-brand-teal/10" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <div className="max-w-xl mx-auto lg:mx-0 lg:ml-12 xl:ml-20">
            <div className="inline-flex items-center gap-2 bg-brand-teal/20 text-brand-teal px-4 py-2 rounded-full font-bold mb-6 border border-brand-teal/30">
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
              {locale === 'ar' ? 'متاحون الآن' : 'Available Now'}
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              {locale === 'ar' ? 'احصل على استشارة مجانية' : 'Get a Free Consultation'}
            </h2>
            
            <p className="text-white/70 text-xl mb-10 leading-relaxed">
              {locale === 'ar' 
                ? 'فريق الخبراء لدينا مستعد لتقييم احتياجات منشأتك وتقديم أفضل خطة نظافة وصيانة تناسب أعمالك بدون أي تكاليف مبدئية.'
                : 'Our expert team is ready to evaluate your facility needs and provide the best cleaning and maintenance plan suitable for your business with zero initial costs.'}
            </p>

            <ul className="space-y-5 mb-12 text-white/90 text-lg font-medium">
              {[
                locale === 'ar' ? 'معاينة مجانية للموقع' : 'Free Site Visit',
                locale === 'ar' ? 'خطة عمل مخصصة' : 'Custom Work Plan',
                locale === 'ar' ? 'تسعير شفاف وواضح' : 'Transparent Pricing'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <FiCheckCircle className="text-brand-teal text-2xl" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              {(settings.whatsappCta || settings.contactWhatsapp) && (
                <a
                  href={`https://wa.me/${(settings.whatsappCta || settings.contactWhatsapp || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-3 text-lg"
                >
                  <FiMessageSquare className="text-2xl" /> {locale === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp Us'}
                </a>
              )}
              
              <Link
                href={`/${locale}/booking`}
                className="bg-brand-teal/10 hover:bg-brand-teal border border-brand-teal text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 text-lg"
              >
                <FiPhoneCall className="text-xl" /> {locale === 'ar' ? 'طلب معاينة' : 'Request Visit'}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
