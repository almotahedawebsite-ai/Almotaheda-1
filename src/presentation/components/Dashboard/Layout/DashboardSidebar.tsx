import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiPieChart, FiLayers, FiStar, FiMap, FiList, FiCreditCard, FiFileText, 
  FiEdit3, FiPenTool, FiShield, FiInbox, FiUsers, FiSettings, FiSearch, 
  FiTrendingUp, FiBookOpen, FiLogOut 
} from 'react-icons/fi';

interface DashboardSidebarProps {
  currentLocale: string;
  handleLogout: () => Promise<void>;
  setSidebarOpen: (v: boolean) => void;
  sidebarOpen: boolean;
}

export default function DashboardSidebar({ currentLocale, handleLogout, setSidebarOpen, sidebarOpen }: DashboardSidebarProps) {
  const pathname = usePathname();

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
    <>
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
    </>
  );
}
