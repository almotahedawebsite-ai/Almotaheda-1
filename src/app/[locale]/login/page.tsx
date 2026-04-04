'use client';

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/infrastructure/firebase/config';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiUsers, FiLock } from 'react-icons/fi';

const SUPER_ADMIN = 'gemeslaim10@gmail.com';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  // If already logged in, redirect accordingly
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // If we have a user but might be missing a session cookie, sync it
          const idToken = await user.getIdToken();
          const sessionRes = await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
          });

          if (!sessionRes.ok) {
            const errorData = await sessionRes.json().catch(() => ({}));
            console.error('Server session not created:', errorData);
            await auth.signOut();
            setError(`فشل تسجيل الدخول من الخادم الدلالية: ${errorData.details || 'تأكد من إعدادات Firebase Admin'}`);
            setChecking(false);
            return;
          }

          const email = user.email || '';
          const isAdmin = email === SUPER_ADMIN || (await getDoc(doc(db, 'admins', email))).exists();
          const currentLocale = window.location.pathname.split('/')[1] || 'ar';
          
          // Only auto-redirect if there's no explicit error showing (to avoid looping on real auth errors)
          if (!searchParams.get('error')) {
            router.push(isAdmin ? `/${currentLocale}/dashboard` : `/${currentLocale}/profile`);
          } else {
            setChecking(false);
          }
        } catch (error) {
          console.error('Session sync error:', error);
          setChecking(false);
        }
      } else {
        setChecking(false);
      }
    });
    return () => unsubscribe();
  }, [router, searchParams]);

  // Show unauthorized error from dashboard redirect
  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setError('ليس لديك صلاحية الوصول للداشبورد. يمكنك تسجيل الدخول كعميل.');
    }
  }, [searchParams]);

  const handleGoogleLogin = async (intent: 'admin' | 'client') => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email || '';

      // Check if admin
      const isSuperAdmin = email === SUPER_ADMIN;
      const adminDoc = isSuperAdmin ? null : await getDoc(doc(db, 'admins', email));
      const isAdmin = isSuperAdmin || adminDoc?.exists();

      if (intent === 'admin' && !isAdmin) {
        await auth.signOut();
        setError('هذا البريد الإلكتروني غير مصرح له بالوصول كمشرف.');
        setLoading(false);
        return;
      }

      // Create Server Session
      const idToken = await user.getIdToken();
      const sessionRes = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      if (!sessionRes.ok) {
        throw new Error('Failed to create server session');
      }

      // Extract locale from current pathname or searchParams if needed
      const currentLocale = window.location.pathname.split('/')[1] || 'ar';

      if (isAdmin) {
        router.push(`/${currentLocale}/dashboard`);
        return;
      }

      // Save client to Firestore
      await setDoc(doc(db, 'clients', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }, { merge: true }); // merge: true to update lastLogin without overwriting createdAt

      router.push(`/${currentLocale}/profile`);
    } catch (err: any) {
      setError('حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col justify-center items-center p-4" dir="rtl">
      <div className="w-full max-w-md space-y-6">

        {/* Logo / Brand */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-lg shadow-blue-500/30">
            A
          </div>
          <h1 className="text-3xl font-black text-white">Agency Portal</h1>
          <p className="text-slate-400 mt-2">اختر نوع دخولك للمتابعة</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {/* Client Login Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-white font-bold text-lg flex items-center gap-2"><FiUsers /> دخول العملاء</h2>
            <p className="text-slate-400 text-sm mt-1">للاطلاع على حسابك ومتابعة طلباتك</p>
          </div>
          <button
            onClick={() => handleGoogleLogin('client')}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 text-gray-800 font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول بجوجل'}
          </button>
        </div>

        {/* Admin Login Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-white font-bold text-lg flex items-center gap-2"><FiLock /> دخول المشرفين</h2>
            <p className="text-slate-400 text-sm mt-1">للوصول لإدارة المحتوى ولوحة التحكم</p>
          </div>
          <button
            onClick={() => handleGoogleLogin('admin')}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="rgba(255,255,255,0.7)" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="rgba(255,255,255,0.85)" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'جاري التحقق...' : 'دخول المشرفين بجوجل'}
          </button>
        </div>

        <p className="text-center text-slate-500 text-xs">
          بتسجيل دخولك توافق على سياسة الخصوصية وشروط الاستخدام
        </p>
      </div>
    </div>
  );
}
