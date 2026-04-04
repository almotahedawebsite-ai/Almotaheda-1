'use client';

import React, { useState } from 'react';
import { auth } from '@/infrastructure/firebase/config';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { 
  FiPieChart, FiLayers, FiStar, FiMap, FiList, FiCreditCard, FiFileText, 
  FiEdit3, FiPenTool, FiShield, FiInbox, FiUsers, FiSettings, FiSearch, 
  FiTrendingUp, FiBookOpen, FiLogOut, FiGlobe 
} from 'react-icons/fi';

interface Props {
  children: React.ReactNode;
  user: {
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  };
  settings: any;
  currentLocale: string;
}

export default function DashboardClientLayout({ children, user, settings, currentLocale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: `/${currentLocale}/dashboard`, icon: <FiPieChart />, label: 'الرئيسية (Overview)' },
    { href: `/${currentLocale}/dashboard/services`, icon: <FiLayers />, label: 'إدارة الخدمات' },
    { href: `/${currentLocale}/dashboard/key-clients`, icon: <FiStar />, label: 'أهم العملاء' },
    { href: `/${currentLocale}/dashboard/branches`, icon: <FiMap />, label: 'إدارة الفروع' },
    { href: `/${currentLocale}/dashboard/bookings`, icon: <FiList />, label: 'إدارة الحجوزات' },
    { href: `/${currentLocale}/dashboard/payments`, icon: <FiCreditCard />, label: 'مراجعة المدفوعات' },
    { href: `/${currentLocale}/dashboard/contracts`, icon: <FiFileText />, label: 'التعاقدات' },
  ];

  const systemItems = [
    { href: `/${currentLocale}/dashboard/entities`, icon: <FiEdit3 />, label: 'مصنع المحتوى' },
    { href: `/${currentLocale}/dashboard/brand`, icon: <FiPenTool />, label: 'الهوية البصرية' },
    { href: `/${currentLocale}/dashboard/company`, icon: <FiShield />, label: 'البيانات المؤسسية' },
    { href: `/${currentLocale}/dashboard/messages`, icon: <FiInbox />, label: 'صندوق الوارد' },
    { href: `/${currentLocale}/dashboard/users`, icon: <FiUsers />, label: 'إدارة المستخدمين' },
    { href: `/${currentLocale}/dashboard/preferences`, icon: <FiSettings />, label: 'إعدادات النظام' },
    { href: `/${currentLocale}/dashboard/settings`, icon: <FiSearch />, label: 'إعدادات الـ SEO' },
    { href: `/${currentLocale}/dashboard/tracking`, icon: <FiTrendingUp />, label: 'التتبع (Pixels)' },
    { href: `/${currentLocale}/dashboard/seo-guide`, icon: <FiBookOpen />, label: 'دليل تحسين SEO' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await fetch('/api/auth/session', { method: 'DELETE' });
      router.push(`/${currentLocale}/login`);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (href: string) => {
    if (href === `/${currentLocale}/dashboard`) return pathname === href;
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-black tracking-tight text-brand-teal">لوحة التحكم</h2>
        <p className="text-[10px] text-slate-500 mt-1 font-black uppercase tracking-widest leading-tight">Al-Motaheda Admin Panel</p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 mt-2 overflow-y-auto custom-scrollbar">
        {/* Main Navigation */}
        <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 mt-2">إدارة الأعمال</p>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm group ${
              isActive(item.href)
                ? 'bg-brand-teal shadow-lg shadow-brand-teal/20 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        {/* System Section */}
        <div className="pt-4 mt-4 border-t border-slate-800">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">إعدادات النظام</p>
          {systemItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm group ${
                isActive(item.href)
                  ? 'bg-brand-navy shadow-lg text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-3 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full p-3 bg-slate-800 hover:bg-red-600 rounded-xl text-center font-bold transition-all text-sm flex items-center justify-center gap-2 group"
        >
          <FiLogOut className="group-hover:-translate-x-1 transition-transform" /> تسجيل الخروج
        </button>
      </div>
    </>
  );

  return (
    <div className="h-screen bg-gray-100 flex font-sans overflow-hidden" dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-slate-900 text-white flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-slate-900 text-white flex flex-col h-full shadow-2xl z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b p-4 flex justify-between items-center px-6 lg:px-8 shrink-0 h-16 lg:h-20">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <div className="space-y-1.5">
                <span className="block w-5 h-0.5 bg-gray-600"></span>
                <span className="block w-5 h-0.5 bg-gray-600"></span>
                <span className="block w-3 h-0.5 bg-gray-600"></span>
              </div>
            </button>

            <div className="text-xs text-gray-400 font-black font-mono tracking-tighter uppercase hidden sm:block">
              {new Date().toLocaleDateString(currentLocale === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <Link 
              href={`/${currentLocale}`} 
              className="flex items-center gap-2 bg-slate-100 hover:bg-brand-teal hover:text-white text-slate-600 px-4 py-2 rounded-full transition-all text-xs font-black"
              target="_blank"
            >
              <FiGlobe /> <span className="hidden sm:inline">عرض الموقع</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 py-2 px-4 rounded-full border border-gray-100 cursor-pointer hover:bg-white transition-colors">
            <div className="text-right hidden sm:block">
              <p className="font-black text-gray-900 text-sm leading-tight">{user.displayName || 'المدير'}</p>
              <p className="text-[10px] text-gray-400 font-bold">{user.email}</p>
            </div>
            {user.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="w-10 h-10 rounded-full border-2 border-brand-teal/20 shadow-lg" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal font-black text-lg">
                {(user.displayName || 'A')[0]}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
