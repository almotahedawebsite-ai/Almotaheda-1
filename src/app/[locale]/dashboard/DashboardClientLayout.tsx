'use client';

import React, { useState } from 'react';
import { auth } from '@/infrastructure/firebase/config';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import DashboardSidebar from '@/presentation/components/Dashboard/Layout/DashboardSidebar';
import DashboardTopbar from '@/presentation/components/Dashboard/Layout/DashboardTopbar';

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await fetch('/api/auth/session', { method: 'DELETE' });
      router.push(`/${currentLocale}/login`);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex font-sans overflow-hidden" dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
      <DashboardSidebar 
        currentLocale={currentLocale} 
        handleLogout={handleLogout} 
        setSidebarOpen={setSidebarOpen} 
        sidebarOpen={sidebarOpen} 
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen">
        <DashboardTopbar 
          currentLocale={currentLocale} 
          setSidebarOpen={setSidebarOpen} 
          user={user} 
        />

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
