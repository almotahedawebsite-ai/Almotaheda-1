import React from 'react';
import { Metadata } from 'next';
import { ServerSettingsRepository } from '@/infrastructure/repositories/server/ServerSettingsRepository';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة | المتحدة',
  description: 'إجابات للأسئلة الشائعة حول خدمات شركة المتحدة.',
};

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const repo = new ServerSettingsRepository();
  const settings = await repo.getGlobalSettings();
  
  const whatsappNumber = settings.whatsappCta || settings.contactWhatsapp || '';
  const contactLink = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}` : `/${locale}/contact`;

  const faqs = isEn ? [
    {
      q: "What areas do you cover?",
      a: "We currently cover all areas across the country with a wide network of branches to ensure prompt service."
    },
    {
      q: "How can I book a service?",
      a: "You can book a service directly through our website, or by contacting our customer service via WhatsApp or phone."
    },
    {
      q: "Are the cleaning materials you use safe?",
      a: "Yes, we use high-quality, eco-friendly cleaning and sterilization materials that are safe for children and pets."
    },
    {
      q: "Do you provide commercial cleaning services?",
      a: "Yes, we provide comprehensive cleaning and maintenance services for offices, companies, hospitals, and commercial facilities."
    },
    {
      q: "What if I am not satisfied with the service?",
      a: "Customer satisfaction is our priority. If you have any remarks, please contact us within 48 hours and we will address the issue promptly."
    }
  ] : [
    {
      q: "ما هي المناطق التي تغطيها خدماتكم؟",
      a: "نغطي حالياً جميع المناطق على مستوى الجمهورية من خلال شبكة واسعة من الفروع لضمان سرعة الاستجابة."
    },
    {
      q: "كيف يمكنني حجز خدمة؟",
      a: "يمكنك حجز الخدمة مباشرة من خلال موقعنا الإلكتروني، أو عن طريق التواصل مع خدمة العملاء عبر الواتساب أو الهاتف."
    },
    {
      q: "هل مواد التنظيف المستخدمة آمنة؟",
      a: "نعم، نستخدم مواد تنظيف وتعقيم عالية الجودة وصديقة للبيئة، وآمنة تماماً على الأطفال والحيوانات الأليفة."
    },
    {
      q: "هل تقدمون خدمات للشركات والمؤسسات؟",
      a: "نعم، نقدم خدمات تنظيف وصيانة شاملة للمكاتب، الشركات، المستشفيات، والمنشآت التجارية."
    },
    {
      q: "ماذا لو لم أكن راضياً عن الخدمة المقدمة؟",
      a: "رضا عملائنا هو أولويتنا. في حال وجود أي ملاحظات، يرجى التواصل معنا خلال 48 ساعة وسنقوم بمعالجة الأمر فوراً."
    }
  ];

  return (
    <main className="min-h-screen bg-brand-light">
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-sm border border-brand-navy/5 p-8 md:p-12">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-black text-brand-navy mb-4">
                {isEn ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'}
              </h1>
              <p className="text-brand-navy/60">
                {isEn ? 'Find answers to the most common questions about our services.' : 'إجابات على أكثر الأسئلة شيوعاً حول خدماتنا.'}
              </p>
            </div>
            
            <div className="space-y-6" dir={isEn ? 'ltr' : 'rtl'}>
              {faqs.map((faq, index) => (
                <div key={index} className="bg-brand-light rounded-2xl p-6 border border-brand-navy/5">
                  <h3 className="text-lg font-bold text-brand-navy mb-3 flex items-start gap-3">
                    <span className="text-brand-teal flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    {faq.q}
                  </h3>
                  <p className="text-brand-navy/70 leading-relaxed pr-8 pl-8">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center bg-brand-navy/5 rounded-2xl p-8">
              <h4 className="text-xl font-bold text-brand-navy mb-4">
                {isEn ? 'Still have questions?' : 'لا زلت تملك أسئلة؟'}
              </h4>
              <p className="text-brand-navy/70 mb-6">
                {isEn ? 'Contact our support team and we will be happy to assist you.' : 'تواصل مع فريق الدعم الفني وسنكون سعداء بمساعدتك.'}
              </p>
              <a href={contactLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#20b858] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                {isEn ? 'Contact on WhatsApp' : 'تواصل عبر الواتساب'}
              </a>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
