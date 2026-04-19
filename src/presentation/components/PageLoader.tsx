'use client';

import React from 'react';

export default function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
      aria-label="Loading"
    >
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center gap-8">
        {/* Spinner ring only */}
        <svg
          className="animate-spin"
          style={{ width: 80, height: 80, animationDuration: '1.2s' }}
          viewBox="0 0 80 80"
          fill="none"
        >
          <circle cx="40" cy="40" r="36" stroke="rgba(62,146,204,0.15)" strokeWidth="5" />
          <path
            d="M40 4 A36 36 0 0 1 76 40"
            stroke="#3E92CC"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>

        <p className="text-slate-400 text-sm">جاري التحميل...</p>

        {/* Animated dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.18}s`, animationDuration: '0.9s' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
