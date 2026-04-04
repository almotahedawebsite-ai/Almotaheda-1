import React from 'react';
import { ServerSettingsRepository } from '@/infrastructure/repositories/server/ServerSettingsRepository';
import { tField } from '@/domain/types/settings';
import Link from 'next/link';
import { FiAward, FiGrid, FiTarget, FiShield, FiStar } from 'react-icons/fi';
import ConsultationSection from '@/presentation/components/Home/ConsultationSection';
import { ServerServiceRepository } from '@/infrastructure/repositories/server/ServerServiceRepository';
import ServicesSection from '@/presentation/components/Home/ServicesSection';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const settingsRepo = new ServerSettingsRepository();
  const settings = await settingsRepo.getGlobalSettings();

  const serviceRepo = new ServerServiceRepository();
  const services = await serviceRepo.getActive();

  return (
    <div className="pt-20 animate-fade-in-up">
      {/* Hero */}
      <section className="py-20 flex items-center justify-center text-white text-center relative overflow-hidden min-h-[45vh]">
        {/* Background Layering */}
        <img 
          src="https://res.cloudinary.com/dsr72hebx/image/upload/v1775242934/bg_about_1775242831605_mz5bfy.jpg"
          alt="About Us Background"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-95"
        />
        <div className="absolute inset-0 hero-gradient opacity-40 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/40 via-brand-navy/30 to-brand-navy z-10" />

        {/* Animated Effects */}
        <div className="absolute inset-0 z-10 overflow-hidden mix-blend-screen opacity-50 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-teal rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-black mb-4">
            <FiAward /> {locale === 'ar' ? 'من نحن' : 'About Us'}
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            {tField(settings.aboutTitle, locale) || (locale === 'ar' ? 'من نحن' : 'About Us')}
          </h1>
        </div>
      </section>

      {/* Intro Content */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
            {tField(settings.siteName, locale) || 'المتحدة'}
          </h2>
          <div className="text-gray-600 dark:text-gray-300 text-lg leading-loose whitespace-pre-line">
            {tField(settings.aboutContent, locale) || (locale === 'ar' ? 'شركة المتحدة لخدمات النظافة' : 'Al-Motaheda Cleaning Service')}
          </div>
        </div>
      </section>

      {/* Explore Our Services */}
      <ServicesSection services={services} locale={locale} />

      {/* Consultation Section */}
      <ConsultationSection locale={locale} settings={settings} />

      {/* Values */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white text-center mb-12">
            {locale === 'ar' ? 'قيمنا ومبادئنا' : 'Our Values'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: <FiTarget />, title: locale === 'ar' ? 'الدقة والالتزام' : 'Precision & Commitment', desc: locale === 'ar' ? 'نلتزم بالمواعيد ونحرص على تنفيذ كل مهمة بأعلى دقة وإتقان' : 'We commit to deadlines and execute every task with precision' },
              { icon: <FiShield />, title: locale === 'ar' ? 'الأمان والموثوقية' : 'Safety & Reliability', desc: locale === 'ar' ? 'فريق موثوق ومدرب يضمن سلامة ممتلكاتك أثناء العمل' : 'Trusted and trained team ensuring safety of your property' },
              { icon: <FiStar />, title: locale === 'ar' ? 'الابتكار والتطوير' : 'Innovation', desc: locale === 'ar' ? 'نستخدم أحدث المعدات والتقنيات لتقديم نتائج استثنائية' : 'We use the latest equipment and techniques for exceptional results' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 text-center card-hover">
                <span className="text-5xl mb-6 block">{item.icon}</span>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
