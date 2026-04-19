import React, { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { User } from 'firebase/auth';
import { FiGrid, FiUser, FiLogIn, FiCalendar } from 'react-icons/fi';

interface MobileSidebarProps {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  navLinks: { href: string; label: string }[];
  user: User | null;
  isAdmin: boolean;
  isAdminLoading: boolean;
  currentLocale: string;
  t: Record<string, string>;
}

export default function MobileSidebar({
  menuOpen,
  setMenuOpen,
  navLinks,
  user,
  isAdmin,
  isAdminLoading,
  currentLocale,
  t,
}: MobileSidebarProps) {
  return (
    <div 
      className={`lg:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300 ${
        menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`} 
      dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="py-4 px-6 space-y-1">
        {navLinks.map((link) => (
          <Link 
            key={link.href}
            href={link.href} 
            className="block font-bold text-gray-700 dark:text-gray-300 py-3 px-4 mb-2 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-800 hover:bg-brand-navy hover:text-white dark:hover:bg-brand-teal transition-all"
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

        {user && !isAdminLoading && isAdmin && (
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
  );
}
