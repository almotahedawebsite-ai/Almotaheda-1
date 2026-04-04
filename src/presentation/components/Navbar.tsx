'use client';

import React, { useEffect, useState } from 'react';
import { SiteSettings, tField } from '@/domain/types/settings';
import DarkModeToggle from '@/presentation/components/DarkModeToggle';
import LanguageSwitcher from '@/presentation/components/LanguageSwitcher';
import { auth, db } from '@/infrastructure/firebase/config';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { FiGrid, FiCalendar, FiLogIn, FiUser, FiLogOut } from 'react-icons/fi';

const SUPER_ADMIN = 'gemeslaim10@gmail.com';

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
  const [showMenu, setShowMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        if (u.email === SUPER_ADMIN) {
          setIsAdmin(true);
        } else {
          const adminDoc = await getDoc(doc(db, 'admins', u.email || ''));
          setIsAdmin(adminDoc.exists());
        }
      } else {
        setIsAdmin(false);
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

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg shadow-brand-navy/5' 
          : 'bg-white dark:bg-slate-900'
      }`}
      id="main-navbar"
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href={`/${currentLocale}`} className="flex items-center gap-3 group">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt={tField(settings.siteName, currentLocale) || 'المتحدة'} className="h-12 w-auto object-contain" />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-brand-navy to-brand-teal rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-navy/20 group-hover:shadow-brand-navy/40 transition-shadow">
              م
            </div>
          )}
          <div className="hidden sm:block">
            <span className="font-black text-2xl text-brand-navy dark:text-white tracking-tight block leading-tight">
              {tField(settings.siteName, currentLocale) || 'المتحدة'}
            </span>
            <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest">
              Cleaning Service
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1 font-bold text-sm">
          {navLinks.map(link => (
            <Link 
              key={link.href}
              href={link.href} 
              className="text-gray-600 dark:text-gray-300 hover:text-brand-navy dark:hover:text-brand-teal px-4 py-2 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link 
              href={`/${currentLocale}/dashboard`} 
              className="bg-brand-navy/5 text-brand-navy dark:bg-brand-teal/10 dark:text-brand-teal px-4 py-2 rounded-xl hover:bg-brand-navy hover:text-white dark:hover:bg-brand-teal transition-all font-black text-xs flex items-center gap-1.5 group"
            >
              <FiGrid className="group-hover:scale-110 transition-transform" /> {t.dashboard}
            </Link>
          )}
        </div>

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
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-full pl-4 pr-1 py-1 transition-colors"
              >
                <span className="font-medium text-gray-800 dark:text-gray-200 text-sm hidden sm:block">{user.displayName?.split(' ')[0] || t.profile}</span>
                {user.photoURL ? (
                  <img src={user.photoURL} className="w-9 h-9 rounded-full" referrerPolicy="no-referrer" alt="avatar" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center font-bold text-sm">
                    {(user.displayName || 'U')[0]}
                  </div>
                )}
              </button>
              {/* Dropdown */}
              {showMenu && (
                <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 py-2 z-50" dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
                  <Link href={`/${currentLocale}/profile`} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 font-medium rounded-xl mx-1 flex items-center gap-2">
                    <FiUser /> {t.profile}
                  </Link>
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
              className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl font-bold transition-all text-sm flex items-center gap-2 group"
            >
              <FiLogIn className="group-hover:scale-110 transition-transform text-brand-teal" /> {t.login}
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="القائمة"
            id="mobile-menu-toggle"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${menuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
              <span className={`block h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${menuOpen ? 'opacity-0' : 'w-5 opacity-100'}`}></span>
              <span className={`block h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${menuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-4'}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`} 
        dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="py-4 px-6 space-y-1">
          {navLinks.map(link => (
            <Link 
              key={link.href}
              href={link.href} 
              className="block font-bold text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          <Link 
            href={`/${currentLocale}/booking`}
            className="font-bold text-white bg-gradient-to-r from-brand-navy to-brand-teal py-3 px-4 rounded-xl text-center mt-3 flex items-center justify-center gap-2 group"
            onClick={() => setMenuOpen(false)}
          >
            <FiCalendar className="group-hover:scale-110 transition-transform" /> {t.booking}
          </Link>

          {isAdmin && (
            <Link 
              href={`/${currentLocale}/dashboard`} 
              className="font-bold text-brand-navy dark:text-brand-teal py-3 px-4 rounded-xl bg-brand-navy/5 dark:bg-brand-teal/10 text-center flex items-center justify-center gap-2 group"
              onClick={() => setMenuOpen(false)}
            >
              <FiGrid className="group-hover:scale-110 transition-transform" /> {t.dashboard}
            </Link>
          )}
          
          {user ? (
            <Link 
              href={`/${currentLocale}/profile`} 
              className="font-bold text-gray-600 dark:text-gray-400 py-3 px-4 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <FiUser className="text-brand-teal" /> {t.profile}
            </Link>
          ) : (
            <Link 
              href={`/${currentLocale}/login`} 
              className="font-bold text-gray-600 dark:text-gray-400 py-3 px-4 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <FiLogIn className="text-brand-teal" /> {t.login}
            </Link>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
      )}
    </nav>
  );
}
