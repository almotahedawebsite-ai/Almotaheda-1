import React from 'react';
import { FiInstagram, FiFacebook, FiTwitter, FiLinkedin, FiYoutube, FiLink } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';

const getIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('facebook')) return <FiFacebook />;
  if (p.includes('instagram')) return <FiInstagram />;
  if (p.includes('twitter') || p.includes('x')) return <FiTwitter />;
  if (p.includes('linkedin')) return <FiLinkedin />;
  if (p.includes('youtube')) return <FiYoutube />;
  if (p.includes('tiktok')) return <FaTiktok />;
  return <FiLink />;
};

export default function SocialMediaSection({ settings, locale }: { settings: any; locale: string }) {
  return (
    <section className="py-20 bg-gradient-to-br from-brand-navy to-brand-dark text-white text-center relative overflow-hidden border-b border-white/10 relative z-10">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-teal rounded-full blur-[120px]" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-3xl md:text-4xl font-black mb-12">
          {locale === 'ar' ? 'تابعنا على مواقع التواصل الاجتماعي' : 'Follow Us on Social Media'}
        </h2>
        
        {(!settings.socialLinks || settings.socialLinks.length === 0) ? (
          <div className="text-center py-4">
            <p className="text-white/50 text-lg font-bold">
              {locale === 'ar' ? 'المرجو ربط حسابات التواصل من لوحة التحكم' : 'Please link social accounts from the dashboard'}
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {settings.socialLinks.map((link: any, idx: number) => {
            if (!link.url) return null;
            return (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center w-24 h-24 bg-white/5 hover:bg-brand-teal rounded-2xl backdrop-blur-sm border border-white/10 hover:border-brand-teal transition-all shadow-xl hover:-translate-y-2 hover:shadow-brand-teal/20"
              >
                <div className="text-3xl mb-2 transition-transform group-hover:scale-110">
                  {getIcon(link.platform)}
                </div>
                <span className="text-xs font-bold opacity-70 group-hover:opacity-100 uppercase tracking-wider">
                  {link.platform}
                </span>
              </a>
            );
          })}
          </div>
        )}
      </div>
    </section>
  );
}
