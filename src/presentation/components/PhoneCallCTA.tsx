'use client';

import { FiPhoneCall } from 'react-icons/fi';

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
      className="fixed bottom-[76px] right-4 md:bottom-[96px] md:right-6 z-[9999] w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full bg-brand-navy text-white flex items-center justify-center shadow-[0_4px_20px_rgba(10,36,99,0.45),0_0_0_2px_rgba(255,255,255,0.5)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_30px_rgba(10,36,99,0.65),0_0_0_2px_rgba(255,255,255,0.8)] hover:bg-brand-teal hover:z-[10000] cursor-pointer group no-underline"
      aria-label={label}
      id="phone-cta-float"
    >
      {/* Phone icon */}
      <FiPhoneCall className="w-[24px] h-[24px] md:w-8 md:h-8 transition-transform group-hover:scale-110 group-hover:rotate-12" />

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
