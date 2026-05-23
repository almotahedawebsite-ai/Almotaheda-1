'use client';

import React, { useState } from 'react';
import { SiteSettings, tField } from '@/domain/types/settings';

interface FacadeCleaningSectionProps {
  settings: Partial<SiteSettings>;
  locale: string;
}

export default function FacadeCleaningSection({ settings, locale }: FacadeCleaningSectionProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const title = tField(settings.facadeCleaningTitle, locale) || (locale === 'ar' ? 'بعض اعمالنا من نظافة الواجهات' : 'Some of our work in facade cleaning');
  
  const defaultImages = [
    'https://res.cloudinary.com/dsr72hebx/image/upload/v1779117780/7_hrd2dj.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/v1779118089/8_oa7n8a.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/v1779117779/3_xpchf1.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/v1779118090/12_xehftp.jpg',
  ];

  const images = settings.facadeCleaningImages && settings.facadeCleaningImages.length > 0
    ? settings.facadeCleaningImages
    : defaultImages;

  const openLightbox = (index: number): void => {
    setActiveImageIndex(index);
  };

  const closeLightbox = (): void => {
    setActiveImageIndex(null);
  };

  const showNext = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (activeImageIndex === null) return;
    setActiveImageIndex((activeImageIndex + 1) % images.length);
  };

  const showPrev = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (activeImageIndex === null) return;
    setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length);
  };

  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800 animate-fade-in" id="facade-cleaning-section">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-5 py-2 rounded-full text-sm font-black mb-4">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> {locale === 'ar' ? 'سابقة أعمالنا' : 'Our Portfolio'}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
            {title}
          </h2>
          <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
            {locale === 'ar' 
              ? 'مجموعة من صور أعمالنا في تنظيف الواجهات الزجاجية والكلادينج لمختلف المباني والمنشآت' 
              : 'A collection of photos showing our glass and cladding facade cleaning works for various buildings.'}
          </p>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((src, idx) => (
            <div 
              key={idx}
              onClick={(): void => openLightbox(idx)}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-md hover:shadow-xl border border-gray-100 dark:border-slate-800 aspect-[4/3] cursor-pointer transition-all duration-300"
            >
              <img 
                src={src} 
                alt={`${title} - ${idx + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/20 text-white p-4 rounded-full backdrop-blur-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImageIndex !== null && (
        <div 
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          {/* Close button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-brand-teal text-3xl p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
            aria-label="Close"
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button 
                onClick={showPrev}
                className="absolute left-6 text-white hover:text-brand-teal text-4xl p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                aria-label="Previous"
              >
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <button 
                onClick={showNext}
                className="absolute right-6 text-white hover:text-brand-teal text-4xl p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                aria-label="Next"
              >
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </>
          )}

          {/* Large image */}
          <div className="max-w-4xl max-h-[80vh] relative select-none">
            <img 
              src={images[activeImageIndex]} 
              alt="Showcase detail" 
              className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-white/10"
              onClick={(e): void => e.stopPropagation()}
            />
            {/* Image counter */}
            <div className="text-white/60 text-sm text-center mt-4">
              {activeImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
