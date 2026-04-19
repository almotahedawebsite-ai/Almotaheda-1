'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { usePathname } from 'next/navigation';

// Module-level flag — survives React component remounts
// Set to true when user clicks a link, cleared when pathname updates
let _navPending = false;

// ─── Context ────────────────────────────────────────────────────────────────
const LoadingCtx = createContext<{ start: () => void; done: () => void }>({
  start: () => {},
  done: () => {},
});
export const useLoading = () => useContext(LoadingCtx);

// ─── Provider ────────────────────────────────────────────────────────────────
export function LoadingProvider({
  children,
  logoUrl,
}: {
  children: React.ReactNode;
  logoUrl?: string;
}) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  };

  const start = useCallback(() => {
    clearTimers();
    _navPending = true;
    setVisible(true);
    setProgress(0);
    // Fake-progress ramp
    const t1 = setTimeout(() => setProgress(20), 50);
    const t2 = setTimeout(() => setProgress(50), 300);
    const t3 = setTimeout(() => setProgress(75), 800);
    const t4 = setTimeout(() => setProgress(90), 1600);
    // Safety net: force-close after 5s if navigation fails/errors/hangs
    const t5 = setTimeout(() => {
      _navPending = false;
      setProgress(100);
      setTimeout(() => { setVisible(false); setProgress(0); }, 350);
    }, 5000);
    timerRefs.current = [t1, t2, t3, t4, t5];
  }, []);

  const done = useCallback(() => {
    clearTimers();
    _navPending = false;
    setProgress(100);
    const t = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 350);
    timerRefs.current = [t];
  }, []);

  // Runs on EVERY pathname change (including component remounts with new path).
  // Module-level _navPending survives remounts, so done() fires correctly
  // even if the component was remounted mid-navigation.
  useEffect(() => {
    if (_navPending) {
      done();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Intercept internal link clicks — use click in CAPTURE phase so we fire
  // before Next.js processes it. requestAnimationFrame shows overlay on next
  // paint without blocking the event chain (flushSync was breaking navigation).
  useEffect(() => {
    const shouldStart = (anchor: HTMLAnchorElement | null) => {
      if (!anchor) return false;
      const href = anchor.getAttribute('href');
      if (!href) return false;
      const isInternal =
        href.startsWith('/') &&
        !href.startsWith('//') &&
        !anchor.getAttribute('target');
      return isInternal && href !== window.location.pathname;
    };

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a') as HTMLAnchorElement | null;
      if (shouldStart(anchor)) {
        // Use rAF — shows overlay on next frame, does NOT block click from reaching Next.js
        requestAnimationFrame(() => start());
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      const anchor = (e.target as HTMLElement).closest('a') as HTMLAnchorElement | null;
      if (shouldStart(anchor)) {
        requestAnimationFrame(() => start());
      }
    };

    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [start]);

  return (
    <LoadingCtx.Provider value={{ start, done }}>
      {children}

      {/* ── Full-screen overlay ───────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          pointerEvents: visible ? 'all' : 'none',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #080f2e 0%, #0a1a4a 50%, #061830 100%)',
        }}
      >
        {/* Ambient glows */}
        <div style={{
          position: 'absolute', top: '20%', left: '15%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(62,146,204,0.18) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '15%',
          width: 320, height: 320,
          background: 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          {/* Spinner ring with real logo inside */}
          <div style={{ position: 'relative', width: 120, height: 120 }}>
            {/* Spinning arc ring */}
            <svg
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                animation: 'spin 1.2s linear infinite',
              }}
              viewBox="0 0 120 120"
              fill="none"
            >
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <circle cx="60" cy="60" r="56" stroke="rgba(62,146,204,0.15)" strokeWidth="5" />
              <path
                d="M60 4 A56 56 0 0 1 116 60"
                stroke="#3E92CC"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>

            {/* Real logo — centered inside ring, no A fallback */}
            {logoUrl && (
              <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 72, height: 72,
                borderRadius: 16,
                background: 'rgba(10,36,99,0.85)',
                border: '1px solid rgba(62,146,204,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <img
                  src={logoUrl}
                  alt="Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }}
                />
              </div>
            )}
          </div>

          {/* Loading label */}
          <p style={{ color: 'rgba(148,163,184,0.75)', fontSize: 13, margin: 0 }}>
            جاري التحميل...
          </p>

          {/* Bouncing dots */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#3E92CC',
                  display: 'inline-block',
                  animation: `bounce 0.9s ${i * 0.18}s ease-in-out infinite`,
                }}
              />
            ))}
            <style>{`
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
            `}</style>
          </div>
        </div>

        {/* Progress bar at top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 3, background: 'rgba(255,255,255,0.05)',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #3E92CC, #14b8a6, #3E92CC)',
            boxShadow: '0 0 10px rgba(62,146,204,0.9)',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        </div>
      </div>
    </LoadingCtx.Provider>
  );
}
