'use client';

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/infrastructure/firebase/config';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { isSuperAdminEmail } from '@/app/actions/auth';

const GoogleIcon = ({ mono = false }: { mono?: boolean }) => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill={mono ? 'currentColor' : '#4285F4'} d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill={mono ? 'currentColor' : '#34A853'} d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill={mono ? 'currentColor' : '#FBBC05'} d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill={mono ? 'currentColor' : '#EA4335'} d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  const redirectingRef = React.useRef(false);

  // If already logged in, redirect accordingly
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (redirectingRef.current) return;

        const errorParam = new URLSearchParams(window.location.search).get('error');
        if (errorParam) {
          setChecking(false);
          return;
        }

        try {
          redirectingRef.current = true;

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
            setError(`فشل تسجيل الدخول من الخادم: ${errorData.details || 'تأكد من إعدادات Firebase Admin'}`);
            redirectingRef.current = false;
            setChecking(false);
            return;
          }

          const email = user.email || '';
          const isSuper = await isSuperAdminEmail(email);
          const isAdmin = isSuper || (await getDoc(doc(db, 'admins', email))).exists();
          const currentLocale = window.location.pathname.split('/')[1] || 'ar';

          router.replace(isAdmin ? `/${currentLocale}/dashboard` : `/${currentLocale}/profile`);
        } catch (error) {
          console.error('Session sync error:', error);
          redirectingRef.current = false;
          setChecking(false);
        }
      } else {
        setChecking(false);
      }
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show unauthorized error from dashboard redirect
  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setError('ليس لديك صلاحية الوصول للداشبورد.');
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email || '';

      // Detect role automatically
      const isSuperAdminEnv = await isSuperAdminEmail(email);
      const adminDoc = isSuperAdminEnv ? null : await getDoc(doc(db, 'admins', email));
      const isAdmin = isSuperAdminEnv || adminDoc?.exists();

      // Create server session
      const idToken = await user.getIdToken();
      const sessionRes = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      if (!sessionRes.ok) {
        throw new Error('Failed to create server session');
      }

      const currentLocale = window.location.pathname.split('/')[1] || 'ar';

      if (isAdmin) {
        router.push(`/${currentLocale}/dashboard`);
        return;
      }

      // Save client profile to Firestore
      await setDoc(doc(db, 'clients', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }, { merge: true });

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
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col justify-center items-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-sm space-y-8">

        {/* Logo / Brand */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto shadow-lg shadow-blue-500/30">
            A
          </div>
          <h1 className="text-3xl font-black text-white">Agency Portal</h1>
          <p className="text-slate-400 text-sm">سجّل دخولك للمتابعة — سيتم توجيهك تلقائياً حسب صلاحياتك</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {/* Single Login Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="text-center space-y-1">
            <p className="text-slate-300 text-sm">تسجيل الدخول باستخدام حسابك</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            id="login-google-btn"
            className="w-full bg-white hover:bg-gray-50 text-gray-800 font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span>جاري التحقق...</span>
              </>
            ) : (
              <>
                <GoogleIcon />
                <span>تسجيل الدخول بجوجل</span>
              </>
            )}
          </button>

          <p className="text-center text-slate-500 text-xs leading-relaxed">
            سيتم توجيه المشرفين إلى لوحة التحكم تلقائياً
          </p>
        </div>

        <p className="text-center text-slate-600 text-xs">
          بتسجيل دخولك توافق على سياسة الخصوصية وشروط الاستخدام
        </p>
      </div>
    </div>
  );
}
