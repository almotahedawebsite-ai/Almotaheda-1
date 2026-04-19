import React from 'react';
import Link from 'next/link';
import { FiGlobe } from 'react-icons/fi';

interface DashboardTopbarProps {
  setSidebarOpen: (v: boolean) => void;
  currentLocale: string;
  user: {
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  };
}

export default function DashboardTopbar({ setSidebarOpen, currentLocale, user }: DashboardTopbarProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b p-4 flex justify-between items-center px-6 lg:px-8 shrink-0 h-16 lg:h-20">
      <div className="flex items-center gap-4">
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
  );
}
