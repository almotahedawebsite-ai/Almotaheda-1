'use client';

import React, { useEffect, useState } from 'react';
import { SiteSettings, tField } from '@/domain/types/settings';
import DarkModeToggle from '@/presentation/components/DarkModeToggle';
import LanguageSwitcher from '@/presentation/components/LanguageSwitcher';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { FiCalendar, FiLogIn, FiUser, FiLogOut, FiGrid } from 'react-icons/fi';
import { isSuperAdminEmail } from '@/app/actions/auth';
import NavbarLogo from '@/presentation/components/Navbar/NavbarLogo';
import DesktopNavMenu from '@/presentation/components/Navbar/DesktopNavMenu';
import MobileSidebar from '@/presentation/components/Navbar/MobileSidebar';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, db } from '@/infrastructure/firebase/config';

const navLabels: Record<string, Record<string, string>> = {
  ar: { 
    home: 'الرئيسية', 
    services: 'خدماتنا', 
    clients: 'عملاؤنا', 
    branches: 'فروعنا', 
    about: 'من نحن', 
    contact: 'تواصل معنا', 
    booking: 'احجز الآن',
    login: 'تسجيل الدخول', 
    profile: 'حسابي', 
    dashboard: 'لوحة التحكم',
    logout: 'تسجيل الخروج',
  },
  en: { 
    home: 'Home', 
    services: 'Services', 
    clients: 'Our Clients', 
    branches: 'Branches', 
    about: 'About Us', 
    contact: 'Contact', 
    booking: 'Book Now',
    login: 'Sign In', 
    profile: 'My Account', 
    dashboard: 'Dashboard',
    logout: 'Sign Out',
  },
};

export default function Navbar({ settings, currentLocale = 'ar' }: { settings: Partial<SiteSettings>, currentLocale?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const isSuper = await isSuperAdminEmail(u.email || '');
        if (isSuper) {
          setIsAdmin(true);
          setIsAdminLoading(false);
        } else {
          const adminDoc = await getDoc(doc(db, 'admins', u.email || ''));
          setIsAdmin(adminDoc.exists());
          setIsAdminLoading(false);
        }
      } else {
        setIsAdmin(false);
        setIsAdminLoading(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = navLabels[currentLocale] || navLabels['ar'];

  const navLinks = [
    { href: `/${currentLocale}`, label: t.home },
    { href: `/${currentLocale}/services`, label: t.services },
    { href: `/${currentLocale}/clients`, label: t.clients },
    { href: `/${currentLocale}/branches`, label: t.branches },
    { href: `/${currentLocale}/about`, label: t.about },
    { href: `/${currentLocale}/contact`, label: t.contact },
  ];

  // --- Navbar dynamic styles ---
  const bgColor   = settings.navbarBgColor   || '#ffffff';
  const textColor = settings.navbarTextColor || '#1e293b';
  const opacity   = scrolled
    ? (settings.navbarScrolledOpacity ?? 97)
    : (settings.navbarOpacity         ?? 95);

  // Convert 0-100 opacity to hex alpha (00–FF)
  const alphaHex = Math.round((opacity / 100) * 255).toString(16).padStart(2, '0').toUpperCase();

  // Build a css hex color with alpha: '#rrggbbAA'
  const navBgWithAlpha = bgColor.length === 7 ? `${bgColor}${alphaHex}` : bgColor;

  const navStyle: React.CSSProperties = {
    backgroundColor: navBgWithAlpha,
    color: textColor,
    backdropFilter: opacity < 100 ? 'blur(12px)' : undefined,
    WebkitBackdropFilter: opacity < 100 ? 'blur(12px)' : undefined,
    boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : undefined,
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={navStyle}
      id="main-navbar"
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <NavbarLogo settings={settings} currentLocale={currentLocale} />

        {/* Desktop Menu */}
        <DesktopNavMenu 
          navLinks={navLinks}
          user={user}
          isAdmin={isAdmin}
          isAdminLoading={isAdminLoading}
          currentLocale={currentLocale}
          t={t}
        />

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {settings.enableMultiLanguage && <LanguageSwitcher currentLocale={currentLocale} />}
          {settings.enableDarkMode && <DarkModeToggle />}

          {/* Book Now CTA */}
          <Link
            href={`/${currentLocale}/booking`}
            className="hidden sm:flex bg-gradient-to-r from-brand-navy to-brand-teal hover:from-brand-teal hover:to-brand-navy text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-navy/20 hover:shadow-brand-teal/30 text-sm items-center gap-2 group"
          >
            <FiCalendar className="group-hover:scale-110 transition-transform" /> {t.booking}
          </Link>

          {/* Login / Profile Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 bg-current/5 hover:bg-current/10 border border-current/10 rounded-full pl-4 pr-1 py-1 transition-colors text-current"
              >
                <span className="font-medium text-sm hidden sm:block">{user.displayName?.split(' ')[0] || t.profile}</span>
                {user.photoURL ? (
                  <img src={user.photoURL} className="w-9 h-9 rounded-full" referrerPolicy="no-referrer" alt="avatar" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-current/20 flex items-center justify-center font-bold text-sm">
                    {(user.displayName || 'U')[0]}
                  </div>
                )}
              </button>
              {/* Dropdown */}
              {showMenu && (
                <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 py-2 z-50" dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
                  <Link href={`/${currentLocale}/profile`} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 font-medium rounded-xl mx-1 flex items-center gap-2" onClick={() => setShowMenu(false)}>
                    <FiUser /> {t.profile}
                  </Link>
                  {isAdmin && (
                    <Link href={`/${currentLocale}/dashboard`} className="px-4 py-3 text-sm text-brand-navy dark:text-brand-teal hover:bg-brand-navy/5 dark:hover:bg-brand-teal/10 font-bold rounded-xl mx-1 flex items-center gap-2" onClick={() => setShowMenu(false)}>
                      <FiGrid /> {t.dashboard}
                    </Link>
                  )}
                  <hr className="my-1 border-gray-100 dark:border-slate-700" />
                  <button
                    onClick={async () => {
                      await signOut(auth);
                      await fetch('/api/auth/session', { method: 'DELETE' });
                      window.location.href = `/${currentLocale}/login`;
                    }}
                    className="w-full text-right px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium rounded-xl mx-1 flex items-center gap-2"
                  >
                    <FiLogOut /> {t.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href={`/${currentLocale}/login`}
              className="bg-current/10 hover:bg-current/20 border border-current/10 px-4 py-2 rounded-xl font-bold transition-all text-sm flex items-center gap-2 group text-current"
            >
              <FiLogIn className="group-hover:scale-110 transition-transform" /> {t.login}
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2.5 rounded-xl hover:bg-current/10 transition-colors text-current"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="القائمة"
            id="mobile-menu-toggle"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : 'w-5 opacity-100'}`}></span>
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-4'}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileSidebar 
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        navLinks={navLinks}
        user={user}
        isAdmin={isAdmin}
        isAdminLoading={isAdminLoading}
        currentLocale={currentLocale}
        t={t}
      />

      {/* Click outside to close dropdown */}
      {showMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
      )}
    </nav>
  );
}
