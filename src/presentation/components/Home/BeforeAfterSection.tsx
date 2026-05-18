import { BeforeAfterImage } from '@/domain/types/beforeAfter';

interface Props {
  images: BeforeAfterImage[];
  locale: string;
}

export default function BeforeAfterSection({ images }: Props) {
  if (!images || images.length === 0) {
    return (
      <section className="py-24 bg-gray-50 flex items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold text-gray-400">لا يوجد صور لعرضها في الكاروسيل 3D. تأكد من الرفع.</h2>
      </section>
    );
  }

  // For a 2D slider, we want enough images to create a seamless infinite loop
  let displayImages = [...images];
  if (displayImages.length < 10) {
    // Duplicate the array until we have enough images to fill the screen width
    displayImages = Array(Math.ceil(10 / displayImages.length)).fill(displayImages).flat();
  }
  
  return (
    <div className="w-full overflow-hidden bg-white py-12 relative flex items-center group">
      {/* Gradient Fades for edges */}
      <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

      <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused] gap-6 px-3">
        {/* First set of images */}
        {displayImages.map((img, index) => {
          const highResUrl = img.imageUrl.replace('q_auto', 'q_100');
          return (
            <div key={`first-${img.id}-${index}`} className="w-[90vw] sm:w-[500px] md:w-[600px] lg:w-[700px] shrink-0 transition-transform duration-500 hover:scale-[1.02]">
              <img 
                src={highResUrl} 
                alt="Before After" 
                className="w-full h-auto max-h-[800px] object-contain rounded-2xl shadow-sm border border-gray-100 bg-gray-50"
              />
            </div>
          );
        })}
        {/* Second set of images (for seamless looping) */}
        {displayImages.map((img, index) => {
          const highResUrl = img.imageUrl.replace('q_auto', 'q_100');
          return (
            <div key={`second-${img.id}-${index}`} className="w-[90vw] sm:w-[500px] md:w-[600px] lg:w-[700px] shrink-0 transition-transform duration-500 hover:scale-[1.02]">
              <img 
                src={highResUrl} 
                alt="Before After" 
                className="w-full h-auto max-h-[800px] object-contain rounded-2xl shadow-sm border border-gray-100 bg-gray-50"
              />
            </div>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes infinite-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 0.75rem)); } /* -50% because we duplicated the array, -0.75rem for half the gap */
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
        [dir="rtl"] .animate-infinite-scroll {
          animation: infinite-scroll-rtl 40s linear infinite;
        }
        @keyframes infinite-scroll-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(50% + 0.75rem)); }
        }
      `}} />
    </div>
  );
}
