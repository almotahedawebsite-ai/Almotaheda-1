'use client';

import { FiMessageSquare } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

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
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9999] w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4),0_0_0_3px_rgba(255,255,255,0.8)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_30px_rgba(37,211,102,0.6),0_0_0_3px_rgba(255,255,255,1)] hover:z-[10000] cursor-pointer group"
      aria-label="تواصل معنا عبر واتساب"
      id="whatsapp-cta-float"
    >
        <FaWhatsapp className="w-[28px] h-[28px] md:w-9 md:h-9 transition-transform group-hover:rotate-12" />
      
      {/* Tooltip */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-gray-900 text-white text-xs font-bold py-2 px-4 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl flex items-center gap-2">
        تواصل معنا عبر واتساب <FiMessageSquare className="animate-pulse" />
      </span>
    </a>
  );
}
