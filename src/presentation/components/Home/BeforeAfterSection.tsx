'use client';

import { useRef } from 'react';

export default function BeforeAfterSection({ locale }: { locale: string }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const images = [
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779117780/7_hrd2dj.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779118089/8_oa7n8a.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779117779/3_xpchf1.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779118090/12_xehftp.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779118113/20_qy14t5.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779117779/2_bedm8e.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779118088/13_oaq3uu.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779118099/14_wetmge.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779117765/5_o91rxy.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779117778/4_wqt23z.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779118107/16_rtx4q3.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779117782/1_zal7cb.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779118087/9_ngtmbz.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779118088/10_exbbyr.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779118104/18_wgfrlb.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779118114/21_ka4ztq.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779118086/11_igk6jw.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779117781/6_kv9ity.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779118108/19_dcyfi5.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779118107/17_uq2h4u.jpg',
    'https://res.cloudinary.com/dsr72hebx/image/upload/c_crop,w_1.0,h_0.58,y_0.28/f_webp,q_auto:good/v1779118108/15_kiaqpx.jpg',
  ];

  const handleScroll = (direction: 'next' | 'prev'): void => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
    const isRtl = document.dir === 'rtl' || locale === 'ar';
    
    // In RTL scroll, negative left scrolls forward, positive scrolls back (in some browsers)
    // Or vice versa. Let's make it intuitive and robust by checking direction
    let scrollOffset = direction === 'next' ? scrollAmount : -scrollAmount;
    if (isRtl) {
      scrollOffset = -scrollOffset;
    }

    scrollContainerRef.current.scrollBy({
      left: scrollOffset,
      behavior: 'smooth',
    });
  };

  return (
    <div className="w-full bg-white py-16 relative group" id="before-after-section">
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-brand-navy mb-4 leading-tight">
          {locale === 'ar' ? 'سابقة الأعمال (قبل وبعد)' : 'Our Work (Before & After)'}
        </h2>
      </div>

      <button
        onClick={(): void => handleScroll('next')}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-brand-navy rounded-full p-3 shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0"
        aria-label="Next image"
      >
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          height="28"
          width="28"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <button
        onClick={(): void => handleScroll('prev')}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-brand-navy rounded-full p-3 shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0"
        aria-label="Previous image"
      >
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          height="28"
          width="28"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div
        ref={scrollContainerRef}
        className="flex w-full overflow-x-auto gap-4 px-4 pb-4 hide-scrollbar cursor-grab select-none snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', cursor: 'grab' }}
      >
        {images.map((src, idx) => (
          <div key={idx} className="snap-center shrink-0 cursor-pointer">
            <img
              src={src}
              alt={`Before After ${idx + 1}`}
              loading="lazy"
              className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-auto aspect-square object-contain rounded-2xl shadow-sm border border-gray-100 transition-transform duration-500 hover:scale-[1.01] pointer-events-none"
            />
          </div>
        ))}
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
