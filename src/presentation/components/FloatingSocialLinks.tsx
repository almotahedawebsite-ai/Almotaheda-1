'use client';

import React from 'react';
import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiYoutube, FiGlobe } from 'react-icons/fi';

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
    default: return <FiGlobe className="w-5 h-5" />;
  }
};

export default function FloatingSocialLinks({ socialLinks }: FloatingSocialLinksProps) {
  if (!socialLinks || socialLinks.length === 0) return null;

  return (
    <div className="social-float-container">
      {socialLinks.map((link, idx) => (
        <a
          key={idx}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-float-item"
          aria-label={link.platform}
        >
          {getPlatformIcon(link.platform)}
        </a>
      ))}
    </div>
  );
}
