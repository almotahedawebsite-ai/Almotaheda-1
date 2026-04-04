'use client';

import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';

interface WhatsAppCTAProps {
  phoneNumber: string;
  message?: string;
}

export default function WhatsAppCTA({ phoneNumber, message = 'مرحباً، أريد الاستفسار عن خدماتكم' }: WhatsAppCTAProps) {
  if (!phoneNumber) return null;

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float group"
      aria-label="تواصل معنا عبر واتساب"
      id="whatsapp-cta-float"
    >
      <svg
        viewBox="0 0 32 32"
        className="w-8 h-8 fill-current transition-transform group-hover:rotate-12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.128 6.744 3.046 9.378L1.054 31.384l6.218-1.962c2.52 1.692 5.538 2.578 8.732 2.578C24.826 32 32 24.826 32 16.004 32 7.174 24.826 0 16.004 0zm9.53 22.606c-.396 1.118-2.318 2.138-3.236 2.236-.836.09-1.892.128-3.054-.192-.706-.196-1.612-.458-2.774-.898-4.884-1.852-8.068-6.8-8.314-7.116-.244-.316-2-2.664-2-5.082 0-2.418 1.266-3.604 1.716-4.098.45-.496.98-.62 1.308-.62.326 0 .654.002.94.018.302.014.708-.114 1.108.846.406.978 1.382 3.376 1.504 3.622.122.244.204.53.04.846-.162.318-.244.514-.488.794-.244.278-.514.622-.734.834-.244.236-.498.494-.214.97s1.264 2.088 2.716 3.384c1.866 1.664 3.438 2.18 3.93 2.424.49.244.776.204 1.062-.124.286-.326 1.224-1.428 1.55-1.918.326-.49.652-.408 1.1-.244.45.162 2.846 1.342 3.334 1.586.49.244.814.366.934.57.124.204.124 1.17-.272 2.292z"/>
      </svg>
      
      {/* Tooltip */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-gray-900 text-white text-xs font-bold py-2 px-4 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl flex items-center gap-2">
        تواصل معنا عبر واتساب <FiMessageSquare className="animate-pulse" />
      </span>
    </a>
  );
}
