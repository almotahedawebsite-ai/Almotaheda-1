import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, adminDb } from '@/infrastructure/firebase/admin';
import { ServerSettingsRepository } from '@/infrastructure/repositories/server/ServerSettingsRepository';
import DashboardClientLayout from './DashboardClientLayout';

// The primary super-admin email from environment or fallback
const SUPER_ADMIN = process.env.FIREBASE_SUPER_ADMIN || 'gemeslaim10@gmail.com';

export default async function DashboardLayout({ 
  children,
  params 
}: { 
  children: React.ReactNode,
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  // 1. If no session cookie, redirect to login
  if (!sessionCookie) {
    redirect(`/${locale}/login`);
  }

  try {
    // 2. Verify the session cookie
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const email = decodedToken.email || '';

    // 3. Check for admin permissions
    let isAdmin = email === SUPER_ADMIN;
    
    if (!isAdmin) {
      const adminDoc = await adminDb.collection('admins').doc(email).get();
      isAdmin = adminDoc.exists;
    }

    if (!isAdmin) {
      // Valid session but not an admin
      redirect(`/${locale}/login?error=unauthorized`);
    }

    // 4. Fetch settings for the client layout
    const settingsRepo = new ServerSettingsRepository();
    const settings = await settingsRepo.getGlobalSettings();

    // 5. Prepare user data for the client layout
    const user = {
      email: decodedToken.email || null,
      displayName: decodedToken.name || decodedToken.email?.split('@')[0] || 'Admin',
      photoURL: decodedToken.picture || null,
    };

    return (
      <DashboardClientLayout 
        user={user} 
        settings={settings} 
        currentLocale={locale}
      >
        {children}
      </DashboardClientLayout>
    );

  } catch (error) {
    console.error('Dashboard Auth Error:', error);
    redirect(`/${locale}/login`);
  }
}
