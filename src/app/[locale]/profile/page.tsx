'use client';

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/infrastructure/firebase/config';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCalendar, FiClock, FiHome, FiPhone, FiLogOut } from 'react-icons/fi';

interface ClientData {
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: string;
  lastLogin: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push('/login');
        return;
      }
      setUser(u);
      try {
        const snap = await getDoc(doc(db, 'clients', u.uid));
        if (snap.exists()) {
          setClientData(snap.data() as ClientData);
        }
      } catch {
        // Permission denied or no document — show profile from Firebase Auth only
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-2xl mx-auto py-16 px-4 space-y-6">

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Cover */}
          <div className="h-28 bg-gradient-to-r from-primary to-secondary" />
          {/* Avatar */}
          <div className="px-8 pb-8">
            <div className="-mt-12 mb-4">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  referrerPolicy="no-referrer"
                  alt="avatar"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-primary/10 flex items-center justify-center text-primary text-3xl font-black">
                  {(user?.displayName || 'U')[0]}
                </div>
              )}
            </div>
            <h1 className="text-2xl font-black text-gray-900">{user?.displayName || 'مستخدم'}</h1>
            <p className="text-gray-500 font-mono text-sm mt-1">{user?.email}</p>
            <div className="mt-4 flex gap-3 text-sm text-gray-500">
              {clientData?.createdAt && (
                <span className="bg-gray-50 border rounded-lg px-3 py-1.5 flex items-center gap-2">
                  <FiCalendar /> عضو منذ {new Date(clientData.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}
                </span>
              )}
              {clientData?.lastLogin && (
                <span className="bg-gray-50 border rounded-lg px-3 py-1.5 flex items-center gap-2">
                  <FiClock /> آخر دخول {new Date(clientData.lastLogin).toLocaleDateString('ar-EG')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
          <h2 className="font-bold text-gray-900 mb-4">الإجراءات السريعة</h2>
          <Link
            href="/"
            className="group flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium"
          >
            <FiHome className="text-xl group-hover:-translate-y-1 transition-transform" /> العودة للصفحة الرئيسية
          </Link>
          <Link
            href="/contact"
            className="group flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium"
          >
            <FiPhone className="text-xl group-hover:animate-pulse" /> تواصل معنا
          </Link>
          <button
            onClick={handleSignOut}
            className="group w-full flex items-center gap-3 p-4 rounded-xl hover:bg-red-50 transition-colors text-red-600 font-medium"
          >
            <FiLogOut className="text-xl group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" /> تسجيل الخروج
          </button>
        </div>

      </div>
    </div>
  );
}
