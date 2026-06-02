'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/infrastructure/firebase/config';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FiCalendar, FiClock, FiHome, FiPhone, FiLogOut, FiUser, FiMail } from 'react-icons/fi';

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
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        // Include locale in redirect so user lands on correct localized login page
        router.push(`/${locale}/login`);
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
  }, [router, locale]);

  const handleSignOut = async () => {
    await signOut(auth);
    // Also clear server session cookie
    await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {});
    router.push(`/${locale}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const initials = (user?.displayName || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir="rtl">
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Gradient Cover */}
          <div className="h-32 bg-gradient-to-r from-primary via-blue-600 to-secondary relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-2 right-8 w-20 h-20 rounded-full border-4 border-white/30" />
              <div className="absolute -bottom-4 left-4 w-32 h-32 rounded-full border-4 border-white/20" />
            </div>
          </div>

          {/* Avatar + Info */}
          <div className="px-8 pb-8">
            <div className="-mt-14 mb-5">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover"
                  referrerPolicy="no-referrer"
                  alt="avatar"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-black">
                  {initials}
                </div>
              )}
            </div>

            <h1 className="text-2xl font-black text-gray-900">{user?.displayName || 'مستخدم'}</h1>

            <div className="flex items-center gap-2 text-gray-500 font-mono text-sm mt-1">
              <FiMail className="shrink-0" />
              <span>{user?.email}</span>
            </div>

            {/* Stats Row */}
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="bg-blue-50 border border-blue-100 text-blue-700 rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-medium">
                <FiUser className="shrink-0" /> عميل مسجّل
              </span>
              {clientData?.createdAt && (
                <span className="bg-gray-50 border border-gray-100 text-gray-600 rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
                  <FiCalendar className="shrink-0 text-primary" />
                  عضو منذ {new Date(clientData.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}
                </span>
              )}
              {clientData?.lastLogin && (
                <span className="bg-gray-50 border border-gray-100 text-gray-600 rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
                  <FiClock className="shrink-0 text-primary" />
                  آخر دخول {new Date(clientData.lastLogin).toLocaleDateString('ar-EG')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="font-bold text-gray-900">الإجراءات السريعة</h2>
          </div>
          <div className="divide-y divide-gray-50">
            <Link
              href={`/${locale}`}
              className="group flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors text-gray-700"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <FiHome className="text-lg" />
              </div>
              <div>
                <p className="font-bold text-gray-800">الصفحة الرئيسية</p>
                <p className="text-xs text-gray-400">العودة لموقع المتحدة</p>
              </div>
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="group flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors text-gray-700"
            >
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <FiPhone className="text-lg" />
              </div>
              <div>
                <p className="font-bold text-gray-800">تواصل معنا</p>
                <p className="text-xs text-gray-400">للاستفسارات والحجوزات</p>
              </div>
            </Link>

            <button
              onClick={handleSignOut}
              className="group w-full flex items-center gap-4 p-5 hover:bg-red-50 transition-colors text-gray-700"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                <FiLogOut className="text-lg" />
              </div>
              <div className="text-right">
                <p className="font-bold text-red-600">تسجيل الخروج</p>
                <p className="text-xs text-gray-400">سيتم إنهاء جلستك</p>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
