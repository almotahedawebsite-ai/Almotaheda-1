import React from 'react';
import Link from 'next/link';
import { User } from 'firebase/auth';
import { FiGrid } from 'react-icons/fi';

interface DesktopNavMenuProps {
  navLinks: { href: string; label: string }[];
  user: User | null;
  isAdmin: boolean;
  isAdminLoading: boolean;
  currentLocale: string;
  t: Record<string, string>;
}

export default function DesktopNavMenu({
  navLinks,
  user,
  isAdmin,
  isAdminLoading,
  currentLocale,
  t,
}: DesktopNavMenuProps) {
  return (
    <div className="hidden lg:flex items-center gap-2 font-bold text-sm text-current">
      {navLinks.map((link) => (
        <Link 
          key={link.href}
          href={link.href} 
          className="bg-current/5 border border-current/10 hover:bg-current/10 px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          {link.label}
        </Link>
      ))}
      {/* Dashboard button - show while loading if user exists, confirm after check */}
      {user && !isAdminLoading && isAdmin && (
        <Link 
          href={`/${currentLocale}/dashboard`} 
          className="border border-current/20 bg-current/10 hover:bg-current/20 px-4 py-2 rounded-xl transition-all font-black text-xs flex items-center gap-1.5 group text-current"
        >
          <FiGrid className="group-hover:scale-110 transition-transform" /> {t.dashboard}
        </Link>
      )}
    </div>
  );
}
