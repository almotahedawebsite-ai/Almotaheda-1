import React from 'react';
import { ServerSettingsRepository } from '@/infrastructure/repositories/server/ServerSettingsRepository';
import { tField } from '@/domain/types/settings';
import { FiPhone, FiMail, FiMapPin, FiGlobe, FiExternalLink } from 'react-icons/fi';
import { FaWhatsapp, FaFacebook, FaInstagram, FaTiktok, FaSnapchatGhost, FaYoutube, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  facebook: <FaFacebook />,
  instagram: <FaInstagram />,
  tiktok: <FaTiktok />,
  snapchat: <FaSnapchatGhost />,
  youtube: <FaYoutube />,
  linkedin: <FaLinkedin />,
  twitter: <FaTwitter />,
  whatsapp: <FaWhatsapp />,
};

const SOCIAL_COLORS: Record<string, string> = {
  facebook: 'bg-blue-600 hover:bg-blue-700',
  instagram: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500',
  tiktok: 'bg-black hover:bg-gray-900',
  snapchat: 'bg-yellow-400 hover:bg-yellow-500 text-black',
  youtube: 'bg-red-600 hover:bg-red-700',
  linkedin: 'bg-blue-700 hover:bg-blue-800',
  twitter: 'bg-sky-500 hover:bg-sky-600',
  whatsapp: 'bg-green-500 hover:bg-green-600',
};

export default async function QRLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const settingsRepo = new ServerSettingsRepository();
  const settings = await settingsRepo.getGlobalSettings();

  const whatsappNumber = (settings.contactWhatsapp || settings.whatsappCta || '').replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-dark to-slate-900 flex flex-col items-center justify-center px-4 py-12">

      {/* Card */}
      <div className="w-full max-w-md animate-fade-in-up">

        {/* Header — Logo & Name */}
        <div className="text-center mb-8">
          {settings.logoUrl && (
            <div className="w-24 h-24 mx-auto mb-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-3 shadow-2xl">
              <img
                src={settings.logoUrl}
                alt={tField(settings.siteName, locale) || 'Al-Motaheda'}
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
          )}
          <h1 className="text-3xl font-black text-white mb-1">
            {tField(settings.siteName, locale) || 'المتحدة'}
          </h1>
          <p className="text-white/40 text-sm font-bold tracking-wider uppercase">
            Cleaning & Maintenance Services
          </p>
        </div>

        {/* Contact Links */}
        <div className="space-y-3 mb-6">

          {/* WhatsApp — Primary CTA */}
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/20 active:scale-[0.98]"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                <FaWhatsapp />
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/70 font-bold">واتساب</p>
                <p className="font-black text-lg" dir="ltr">{settings.contactWhatsapp || settings.whatsappCta}</p>
              </div>
              <FiExternalLink className="text-white/50" />
            </a>
          )}

          {/* Phone */}
          {settings.contactPhone && (
            <a
              href={`tel:${settings.contactPhone}`}
              className="flex items-center gap-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-4 rounded-2xl border border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="w-12 h-12 bg-brand-teal/20 text-brand-teal rounded-xl flex items-center justify-center text-2xl">
                <FiPhone />
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/50 font-bold">اتصل بنا</p>
                <p className="font-black text-lg" dir="ltr">{settings.contactPhone}</p>
              </div>
              <FiExternalLink className="text-white/30" />
            </a>
          )}

          {/* Email */}
          {settings.contactEmail && (
            <a
              href={`mailto:${settings.contactEmail}`}
              className="flex items-center gap-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-4 rounded-2xl border border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center text-2xl">
                <FiMail />
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/50 font-bold">البريد الإلكتروني</p>
                <p className="font-black text-sm">{settings.contactEmail}</p>
              </div>
              <FiExternalLink className="text-white/30" />
            </a>
          )}

          {/* Address */}
          {settings.contactAddress && (
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm text-white p-4 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center text-2xl shrink-0">
                <FiMapPin />
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/50 font-bold">العنوان الرئيسي</p>
                <p className="font-bold text-sm text-white/80 leading-relaxed">
                  {tField(settings.contactAddress, locale)}
                </p>
              </div>
            </div>
          )}

          {/* Website */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-4 rounded-2xl border border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center text-2xl">
              <FiGlobe />
            </div>
            <div className="flex-1">
              <p className="text-xs text-white/50 font-bold">الموقع الإلكتروني</p>
              <p className="font-black text-sm">زيارة الموقع</p>
            </div>
            <FiExternalLink className="text-white/30" />
          </Link>
        </div>

        {/* Social Media */}
        {settings.socialLinks && settings.socialLinks.length > 0 && (
          <div className="mb-8">
            <p className="text-center text-white/30 text-xs font-bold uppercase tracking-widest mb-4">تابعنا على</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {settings.socialLinks.map((link: { platform: string; url: string }, idx: number) => {
                const platform = link.platform?.toLowerCase() || '';
                return (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-14 h-14 ${SOCIAL_COLORS[platform] || 'bg-white/10 hover:bg-white/20'} text-white rounded-2xl flex items-center justify-center text-2xl transition-all hover:scale-110 hover:shadow-lg active:scale-95`}
                    title={link.platform}
                  >
                    {SOCIAL_ICONS[platform] || platform.charAt(0).toUpperCase()}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Book Now CTA */}
        <Link
          href={`/${locale}/booking`}
          className="block w-full bg-gradient-to-r from-brand-teal to-green-500 text-white text-center py-4 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-brand-teal/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          احجز خدمتك الآن
        </Link>

        {/* Footer */}
        <p className="text-center text-white/20 text-xs mt-8 font-bold">
          © {new Date().getFullYear()} {tField(settings.siteName, locale) || 'المتحدة'} — جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}
