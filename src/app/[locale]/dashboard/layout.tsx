import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, adminDb } from '@/infrastructure/firebase/admin';
import { ServerSettingsRepository } from '@/infrastructure/repositories/server/ServerSettingsRepository';
import DashboardClientLayout from './DashboardClientLayout';

/**
 * All super admin emails. Must match .env.local SUPER_ADMIN_EMAIL(s).
 * These have full access without needing a document in the 'admins' collection.
 * This is a local helper — not a server action export.
 */
function getSuperAdminEmailsList(): string[] {
  const emails: string[] = [];
  const primary = process.env.SUPER_ADMIN_EMAIL;
  const secondary = process.env.SUPER_ADMIN_EMAIL_2;
  if (primary) emails.push(primary.toLowerCase());
  if (secondary) emails.push(secondary.toLowerCase());
  return emails;
}

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
    const email = (decodedToken.email || '').toLowerCase();

    // 3. Check for admin permissions — super admins or those in 'admins' collection
    const superAdmins = getSuperAdminEmailsList();
    let isAdmin = superAdmins.includes(email);

    if (!isAdmin) {
      const adminDoc = await adminDb.collection('admins').doc(email).get();
      isAdmin = adminDoc.exists;
    }

    if (!isAdmin) {
      // Valid session but not an admin — redirect to profile
      redirect(`/${locale}/profile?notice=dashboard_restricted`);
    }

    // 4. Fetch settings for the client layout
    const repo = new ServerSettingsRepository();
    await repo.getGlobalSettings();

    // 5. Prepare user data for the client layout
    const user = {
      email: decodedToken.email || null,
      displayName: decodedToken.name || decodedToken.email?.split('@')[0] || 'Admin',
      photoURL: decodedToken.picture || null,
    };

    return (
      <DashboardClientLayout 
        user={user} 
        currentLocale={locale}
      >
        {children}
      </DashboardClientLayout>
    );

  } catch (error: any) {
    // If it's just an expired cookie, don't spam the server logs with a huge stack trace
    if (error?.code !== 'auth/session-cookie-expired' && error?.code !== 'auth/session-cookie-revoked') {
      console.error('Dashboard Auth Error:', error);
    }
    redirect(`/${locale}/login`);
  }
}
