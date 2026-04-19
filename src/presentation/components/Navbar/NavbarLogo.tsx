import React from 'react';
import Link from 'next/link';
import { SiteSettings, tField } from '@/domain/types/settings';

export default function NavbarLogo({
  settings,
  currentLocale,
}: {
  settings: Partial<SiteSettings>;
  currentLocale: string;
}) {
  return (
    <Link href={`/${currentLocale}`} className="flex items-center gap-3 group">
      {settings.logoUrl ? (
        <img src={settings.logoUrl} alt={tField(settings.siteName, currentLocale) || 'المتحدة'} className="h-12 w-auto object-contain" />
      ) : (
        <div className="w-12 h-12 bg-gradient-to-br from-brand-navy to-brand-teal rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-navy/20 group-hover:shadow-brand-navy/40 transition-shadow">
          م
        </div>
      )}
      <div className="hidden sm:block text-current">
        <span className="font-black text-2xl tracking-tight block leading-tight">
          {tField(settings.siteName, currentLocale) || 'المتحدة'}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
          Cleaning Service
        </span>
      </div>
    </Link>
  );
}
