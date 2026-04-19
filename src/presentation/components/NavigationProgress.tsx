'use client';

import React, { useEffect, useState, useTransition, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Inner component that reads search params (must be inside Suspense)
function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prevPath, setPrevPath] = useState('');

  const currentPath = `${pathname}?${searchParams}`;

  useEffect(() => {
    if (prevPath && prevPath !== currentPath) {
      // Route changed — show bar briefly then hide
      setLoading(true);
      setProgress(30);

      const t1 = setTimeout(() => setProgress(70), 80);
      const t2 = setTimeout(() => setProgress(95), 200);
      const t3 = setTimeout(() => {
        setProgress(100);
        const t4 = setTimeout(() => {
          setLoading(false);
          setProgress(0);
        }, 250);
        return () => clearTimeout(t4);
      }, 400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
    setPrevPath(currentPath);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[10000] h-[3px] bg-transparent pointer-events-none"
      role="progressbar"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-blue-600 shadow-[0_0_8px_rgba(62,146,204,0.8)] transition-all duration-300 ease-out"
        style={{ width: `${progress}%`, opacity: loading ? 1 : 0 }}
      />
    </div>
  );
}

// Exported wrapper with Suspense boundary (required for useSearchParams)
export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}
