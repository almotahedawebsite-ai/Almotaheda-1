import React from 'react';
import ContactForm from '../ContactForm';
import { FiMessageSquare } from 'react-icons/fi';

export default function ContactSection({ locale }: { locale: string }) {
  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-800/30" id="contact">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800">
          
          <div className="p-10 lg:p-16 flex flex-col justify-center text-center lg:text-right" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <div className="mx-auto lg:mx-0 w-max mb-6">
              <span className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-5 py-2 rounded-full text-sm font-black">
                <FiMessageSquare /> {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              {locale === 'ar' ? 'لديك استفسار أو تود طلب خدمة؟' : 'Have an inquiry or want to request a service?'}
            </h2>
            
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
              {locale === 'ar' 
                ? 'فريق خدمة العملاء لدينا مستعد للرد على جميع استفساراتك وتزويدك بكل التفاصيل التي تحتاجها في أسرع وقت.' 
                : 'Our customer support team is ready to answer all your inquiries and provide you with all the details you need as quickly as possible.'}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800/50 border-t lg:border-t-0 lg:border-r border-gray-100 dark:border-slate-700">
            <ContactForm />
          </div>
          
        </div>
      </div>
    </section>
  );
}
