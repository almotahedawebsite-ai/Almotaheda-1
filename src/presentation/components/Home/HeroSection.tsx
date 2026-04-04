import React from 'react';
import Link from 'next/link';
import { tField } from '@/domain/types/settings';
import { FiCalendar, FiArrowLeft } from 'react-icons/fi';

export default function HeroSection({ settings, locale }: { settings: any; locale: string }) {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-navy" id="hero-section">
      {/* Background Image - Full Visibility */}
      <img 
        src={settings.heroImage || 'https://res.cloudinary.com/dsr72hebx/image/upload/v1775240899/hero_hhzeus.jpg'} 
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-95" 
        alt={tField(settings.siteName, locale) || 'المتحدة'} 
      />

      {/* Soft Brand Color Tint */}
      <div className="absolute inset-0 hero-gradient opacity-40 z-10 mix-blend-multiply" />

      {/* Base Dark Overlay for Perfect Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/40 via-brand-navy/30 to-brand-navy z-10" />

      {/* Animated background shapes */}
      <div className="absolute inset-0 z-10 overflow-hidden mix-blend-screen opacity-50 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-teal/30 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-brand-teal/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto space-y-8 pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-white/90 text-sm font-bold animate-fade-in-down">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          {locale === 'ar' ? 'نخدم القطاع السكني والتجاري والصناعي والحكومي' : 'Serving residential, commercial, industrial & government sectors'}
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-2xl leading-[1.1]">
          {tField(settings.siteName, locale) || 'المتحدة'}
        </h1>

        <p className="text-xl md:text-2xl text-white/80 font-bold max-w-3xl mx-auto leading-relaxed">
          {locale === 'ar'
            ? 'خبراء النظافة والتعقيم والصيانة — خدمات متكاملة بأعلى معايير الجودة والاحترافية'
            : 'Cleaning, Sanitization & Maintenance Experts — Comprehensive services with the highest quality standards'}
        </p>

        <p className="text-base text-brand-teal/80 font-bold tracking-[0.3em] uppercase">
          Cleaning Service
        </p>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/${locale}/booking`}
            className="group bg-white text-brand-navy hover:bg-brand-teal hover:text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-black/20 hover:shadow-brand-teal/30 inline-flex items-center gap-3"
            id="hero-cta-book"
          >
            <FiCalendar className="group-hover:scale-110 transition-transform" /> {locale === 'ar' ? 'احجز خدمتك الآن' : 'Book Your Service'}
          </Link>
          <Link
            href={`/${locale}/services`}
            className="glass text-white hover:bg-white/20 px-10 py-4 rounded-2xl font-bold text-lg transition-all inline-flex items-center gap-3"
            id="hero-cta-services"
          >
            <span className="flex items-center justify-center gap-2">{locale === 'ar' ? 'استكشف خدماتنا' : 'Explore Services'} <FiArrowLeft /></span>
          </Link>
        </div>

        {/* Stats bar */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { num: '+500', label: locale === 'ar' ? 'عميل سعيد' : 'Happy Clients' },
            { num: '+16', label: locale === 'ar' ? 'خدمة متكاملة' : 'Services' },
            { num: '24/7', label: locale === 'ar' ? 'دعم متواصل' : 'Support' },
            { num: '+10', label: locale === 'ar' ? 'سنوات خبرة' : 'Years Experience' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="glass rounded-2xl p-4 text-center group hover:bg-white/20 transition-all cursor-default"
            >
              <p className="text-2xl md:text-3xl font-black text-white group-hover:text-brand-teal transition-colors">{stat.num}</p>
              <p className="text-xs text-white/60 font-bold mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
