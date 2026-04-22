'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppCTA from './WhatsAppCTA';
import PhoneCallCTA from './PhoneCallCTA';
import FloatingSocialLinks from './FloatingSocialLinks';
import { SiteSettings } from '@/domain/types/settings';

interface Props {
  children: React.ReactNode;
  settings: Partial<SiteSettings>;
  currentLocale?: string;
}

export default function ConditionalLayout({ children, settings, currentLocale = 'ar' }: Props) {
  const pathname = usePathname();

  // Hide the global Navbar/Footer if the user is in Dashboard or Login
  const isDashboard = pathname.includes('/dashboard') || pathname.includes('/login');

  if (isDashboard) {
    return <>{children}</>;
  }

  // Render full global wrapper for the standard site
  return (
    <>
      <Navbar settings={settings} currentLocale={currentLocale} />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer settings={settings} currentLocale={currentLocale} />
      {/* WhatsApp Floating CTA */}
      {(settings.whatsappCta || settings.contactWhatsapp) && (
        <WhatsAppCTA phoneNumber={settings.whatsappCta || settings.contactWhatsapp || ''} />
      )}
      {/* Phone Call Floating CTA */}
      {settings.contactPhone && (
        <PhoneCallCTA phoneNumber={settings.contactPhone} locale={currentLocale} />
      )}
      {/* Social Media Links Floating */}
      {settings.socialLinks && settings.socialLinks.length > 0 && (
        <FloatingSocialLinks socialLinks={settings.socialLinks} />
      )}
    </>
  );
}
