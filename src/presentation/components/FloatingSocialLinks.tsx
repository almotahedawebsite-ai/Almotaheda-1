'use client';

import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiYoutube, FiGlobe } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

interface FloatingSocialLinksProps {
  socialLinks: SocialLink[];
}

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook': return <FiFacebook className="w-5 h-5" />;
    case 'instagram': return <FiInstagram className="w-5 h-5" />;
    case 'twitter': return <FiTwitter className="w-5 h-5" />;
    case 'linkedin': return <FiLinkedin className="w-5 h-5" />;
    case 'youtube': return <FiYoutube className="w-5 h-5" />;
    case 'tiktok': return <FaTiktok className="w-5 h-5" />;
    default: return <FiGlobe className="w-5 h-5" />;
  }
};

export default function FloatingSocialLinks({ socialLinks }: FloatingSocialLinksProps) {
  if (!socialLinks || socialLinks.length === 0) return null;

  return (
    <div className="flex flex-col md:flex-row fixed bottom-4 left-4 md:bottom-8 md:left-auto md:right-[96px] z-[9998] gap-2 md:gap-3 items-center">
      {socialLinks.map((link, idx) => (
        <a
          key={idx}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-[38px] h-[38px] md:w-[44px] md:h-[44px] rounded-full bg-white text-brand-navy flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] border-2 border-black transition-all duration-300 hover:-translate-y-1 hover:bg-brand-teal hover:text-white hover:shadow-[0_6px_20px_rgba(62,146,204,0.4)] hover:border-black"
          aria-label={link.platform}
        >
          <div className="scale-75 md:scale-100">{getPlatformIcon(link.platform)}</div>
        </a>
      ))}
    </div>
  );
}
