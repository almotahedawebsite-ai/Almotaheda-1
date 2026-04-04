'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteSettings, tField } from '@/domain/types/settings';
import { auth, db } from '@/infrastructure/firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { Service } from '@/domain/types/service';
import { FiCalendar, FiUser, FiLogIn, FiPhone, FiMail, FiMapPin, FiMessageSquare } from 'react-icons/fi';

export default function Footer({ settings, currentLocale = 'ar' }: { settings: Partial<SiteSettings>, currentLocale?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const colRef = collection(db, 'services');
        const q = query(colRef, where('isActive', '==', true), orderBy('order', 'asc'), limit(6));
        const snapshot = await getDocs(q);
        setServices(snapshot.docs.map(doc => doc.data() as Service));
      } catch (e) {
        // Silently fail - services just won't show in footer
      }
    };
    fetchServices();
  }, []);

  const t = {
    ar: { login: 'تسجيل الدخول', profile: 'حسابي' },
    en: { login: 'Sign In', profile: 'My Account' },
  }[currentLocale] || { login: 'تسجيل الدخول', profile: 'حسابي' };

  return (
    <footer className="bg-brand-navy text-white pt-20 pb-8" id="site-footer">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mb-12 lg:mb-16">
          
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="h-12 brightness-0 invert opacity-80" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-brand-teal to-white/20 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                  م
                </div>
              )}
              <div>
                <span className="text-2xl font-black text-white block">{tField(settings.siteName, currentLocale) || 'المتحدة'}</span>
                <span className="text-[10px] text-brand-teal font-bold uppercase tracking-widest">Cleaning Service</span>
              </div>
            </Link>
            <p className="text-white/60 leading-relaxed text-sm md:text-base max-w-md">
              {tField(settings.aboutContent, currentLocale) 
                ? tField(settings.aboutContent, currentLocale)?.substring(0, 120) + '...' 
                : 'شركة المتحدة لخدمات النظافة والتعقيم والصيانة - خبرة واحترافية'}
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1 space-y-5">
            <h3 className="font-black text-white mb-4 lg:mb-6 text-lg relative inline-block">
              روابط سريعة
              <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-brand-teal rounded-full"></span>
            </h3>
            <ul className="space-y-3 font-medium text-white/60 text-sm md:text-base">
              <li><Link href={`/${currentLocale}`} className="hover:text-brand-teal transition-colors">الرئيسية</Link></li>
              <li><Link href={`/${currentLocale}/services`} className="hover:text-brand-teal transition-colors">خدماتنا</Link></li>
              <li><Link href={`/${currentLocale}/clients`} className="hover:text-brand-teal transition-colors">عملاؤنا</Link></li>
              <li><Link href={`/${currentLocale}/branches`} className="hover:text-brand-teal transition-colors">فروعنا</Link></li>
              <li><Link href={`/${currentLocale}/about`} className="hover:text-brand-teal transition-colors">من نحن</Link></li>
              <li><Link href={`/${currentLocale}/booking`} className="flex items-center gap-2 hover:text-brand-teal transition-colors font-bold group"><FiCalendar className="group-hover:scale-110 transition-transform" /> احجز الآن</Link></li>
              <li>
                <Link href={user ? `/${currentLocale}/profile` : `/${currentLocale}/login`} className="flex items-center gap-2 hover:text-brand-teal transition-colors group">
                  {user ? <><FiUser className="group-hover:scale-110 transition-transform" /> {t.profile}</> : <><FiLogIn className="group-hover:scale-110 transition-transform" /> {t.login}</>}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="col-span-1 space-y-5">
            <h3 className="font-black text-white mb-4 lg:mb-6 text-lg relative inline-block">
              خدماتنا
              <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-brand-teal rounded-full"></span>
            </h3>
            <ul className="space-y-3 font-medium text-white/60 text-sm md:text-base">
              {services.length > 0 ? (
                services.map(s => (
                  <li key={s.id}>
                    <Link href={`/${currentLocale}/services/${s.slug}`} className="hover:text-brand-teal transition-colors">
                      {tField(s.name, currentLocale)}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link href={`/${currentLocale}/services`} className="hover:text-brand-teal transition-colors">النظافة الداخلية</Link></li>
                  <li><Link href={`/${currentLocale}/services`} className="hover:text-brand-teal transition-colors">تنظيف الواجهات</Link></li>
                  <li><Link href={`/${currentLocale}/services`} className="hover:text-brand-teal transition-colors">مكافحة الحشرات</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1 space-y-5 bg-white/[0.02] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-teal/20 blur-3xl rounded-full"></div>
            <h3 className="font-black text-white mb-4 lg:mb-6 text-lg relative inline-block z-10">
              تواصل معنا
              <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-brand-teal rounded-full"></span>
            </h3>
            <ul className="space-y-4 text-white/60 text-sm relative z-10">
              {(settings.whatsappCta || settings.contactWhatsapp) && (
                <li className="flex items-center gap-3 group px-2 py-1 -mx-2 hover:bg-white/5 rounded-lg transition-colors">
                  <FiMessageSquare className="text-green-400 group-hover:animate-pulse" /> 
                  <a href={`https://wa.me/${(settings.whatsappCta || settings.contactWhatsapp || '').replace(/[^0-9]/g, '')}`} target="_blank" className="hover:text-green-400 transition-colors" dir="ltr">
                    {settings.whatsappCta || settings.contactWhatsapp}
                  </a>
                </li>
              )}
              {settings.contactPhone && (
                <li className="flex items-center gap-3">
                  <FiPhone className="text-brand-teal animate-bounce" /> <span dir="ltr">{settings.contactPhone}</span>
                </li>
              )}
              {settings.contactEmail && (
                <li className="flex items-center gap-3">
                  <FiMail className="text-brand-teal" /> {settings.contactEmail}
                </li>
              )}
              {tField(settings.contactAddress, currentLocale) && (
                <li className="flex items-start gap-3">
                  <FiMapPin className="text-brand-teal mt-1 shrink-0" /> 
                  <span className="leading-relaxed">{tField(settings.contactAddress, currentLocale)}</span>
                </li>
              )}
            </ul>
            
            {/* Social Icons */}
            {settings.socialLinks && settings.socialLinks.length > 0 && (
              <div className="flex gap-3 pt-4 flex-wrap">
                {settings.socialLinks.map((link, idx) => (
                  <a key={idx} href={link.url} target="_blank" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-brand-teal flex items-center justify-center transition-all hover:-translate-y-1" title={link.platform}>
                    {link.icon ? (
                      link.icon.startsWith('http') ? (
                        <img src={link.icon} alt={link.platform} className="w-5 h-5 object-contain invert opacity-70" />
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: link.icon }} className="flex items-center justify-center w-5 h-5 fill-current"></span>
                      )
                    ) : (
                      <span className="text-xs uppercase font-bold">{link.platform.substring(0, 2)}</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 pb-4 text-sm font-medium text-white/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {tField(settings.siteName, currentLocale) || 'المتحدة'}. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <Link href={`/${currentLocale}/privacy`} className="hover:text-brand-teal transition-colors">سياسة الخصوصية</Link>
            <Link href={`/${currentLocale}/terms`} className="hover:text-brand-teal transition-colors">شروط الاستخدام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
