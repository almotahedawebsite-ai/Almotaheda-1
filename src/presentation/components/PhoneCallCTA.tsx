'use client';

import React from 'react';

interface PhoneCallCTAProps {
  phoneNumber: string;
  locale?: string;
}

export default function PhoneCallCTA({ phoneNumber, locale = 'ar' }: PhoneCallCTAProps) {
  if (!phoneNumber) return null;

  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
  const label = locale === 'ar' ? 'اتصل بنا الآن' : 'Call Us Now';

  return (
    <a
      href={`tel:${cleanNumber}`}
      className="phone-float group"
      aria-label={label}
      id="phone-cta-float"
    >
      {/* Phone icon */}
      <svg
        viewBox="0 0 32 32"
        className="w-8 h-8 fill-current transition-transform group-hover:scale-110 group-hover:rotate-12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M27.308 20.649c-1.01-.997-3.466-2.585-4.7-3.245-.901-.48-1.557-.373-2.124.195-.415.414-.83.838-1.227 1.268-.282.31-.576.358-.94.195-.937-.43-2.524-1.434-3.949-2.862-1.426-1.427-2.38-2.97-2.807-3.918-.157-.36-.107-.656.203-.938.43-.393.857-.806 1.271-1.22.572-.573.674-1.23.194-2.13-.664-1.242-2.25-3.697-3.244-4.7-.596-.594-1.205-.594-1.801-.17-.633.447-1.234.963-1.82 1.494-.885.802-1.404 1.788-1.475 2.986-.12 2.044.682 4.294 2.393 6.745 1.699 2.43 3.455 4.232 5.937 5.936 2.45 1.712 4.7 2.513 6.743 2.393 1.199-.07 2.185-.591 2.987-1.476.53-.586 1.048-1.187 1.493-1.82.422-.596.424-1.206-.169-1.8z"/>
      </svg>

      {/* Tooltip */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-gray-900 text-white text-xs font-bold py-2 px-4 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl flex items-center gap-2">
        {label}
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-pulse"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </span>
    </a>
  );
}
