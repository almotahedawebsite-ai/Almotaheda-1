"use client";

import { BeforeAfterImage } from '@/domain/types/beforeAfter';
import { useRef, useState } from 'react';
import { FiChevronRight, FiChevronLeft, FiX } from 'react-icons/fi';

interface Props {
  images: BeforeAfterImage[];
  locale?: string;
}

export default function BeforeAfterSection({ images }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);
  const dragDistance = useRef(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return (
      <section className="py-24 bg-gray-50 flex items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold text-gray-400">لا يوجد صور لعرضها في السلايدر. تأكد من الرفع.</h2>
      </section>
    );
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    dragDistance.current = 0;
    if (scrollRef.current) {
      scrollRef.current.classList.remove('snap-x', 'snap-mandatory', 'scroll-smooth');
      scrollRef.current.style.cursor = 'grabbing';
      startX.current = e.pageX - scrollRef.current.offsetLeft;
      scrollLeftPos.current = scrollRef.current.scrollLeft;
    }
  };

  const handleMouseLeaveOrUp = () => {
    isDown.current = false;
    if (scrollRef.current) {
      scrollRef.current.classList.add('snap-x', 'snap-mandatory', 'scroll-smooth');
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; 
    dragDistance.current += Math.abs(x - startX.current);
    scrollRef.current.scrollLeft = scrollLeftPos.current - walk;
  };

  const handleImageClick = (url: string) => {
    // Only open if the user didn't drag
    if (dragDistance.current < 10) {
      setLightboxImage(url);
    }
  };

  return (
    <div className="w-full bg-white py-12 relative group">
      {/* Navigation Arrows */}
      <button 
        onClick={scrollRight}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-primary rounded-full p-3 shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0"
        aria-label="Next image"
      >
        <FiChevronRight size={28} />
      </button>
      
      <button 
        onClick={scrollLeft}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-primary rounded-full p-3 shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0"
        aria-label="Previous image"
      >
        <FiChevronLeft size={28} />
      </button>

      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className="flex w-full overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 hide-scrollbar scroll-smooth cursor-grab select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((img, index) => {
          // Compress images on the fly to improve performance
          const optimizedUrl = img.imageUrl.replace('q_100', 'q_auto:good').replace('q_auto', 'q_auto:good');
          
          return (
            <div 
              key={`img-${img.id}-${index}`} 
              className="snap-center shrink-0 cursor-pointer"
              onClick={() => handleImageClick(img.imageUrl.replace('q_auto', 'q_100'))}
            >
              <img 
                src={optimizedUrl} 
                alt="Before After" 
                loading="lazy"
                onDragStart={(e) => e.preventDefault()}
                className="h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] w-auto object-cover rounded-2xl shadow-sm border border-gray-100 transition-transform duration-500 hover:scale-[1.01] pointer-events-none"
              />
            </div>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-[60]"
            onClick={() => setLightboxImage(null)}
          >
            <FiX size={40} />
          </button>
          <img 
            src={lightboxImage} 
            alt="Enlarged Before After" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
