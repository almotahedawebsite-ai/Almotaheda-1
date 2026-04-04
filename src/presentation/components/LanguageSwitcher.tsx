'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { locales, Locale } from '@/lib/i18n';
import { FiGlobe } from 'react-icons/fi';

export default function LanguageSwitcher({ currentLocale = 'ar' }: { currentLocale?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split('/');

  const toggleLanguage = () => {
    const newLocale = currentLocale === 'ar' ? 'en' : 'ar';
    
    // Replace the locale segment in the pathname
    const newSegments = [...segments];
    newSegments[1] = newLocale;
    const newPath = newSegments.join('/') || '/';
    
    // Add the cookie anyway for the middleware to remember preference, but the URL is leading
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    
    router.push(newPath);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-black px-6 py-3 rounded-2xl transition-all flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95"
    >
      <FiGlobe className="text-xl" /> 
      <span className="uppercase tracking-widest text-sm">
        {currentLocale === 'ar' ? 'English' : 'العربية'}
      </span>
    </button>
  );
}
