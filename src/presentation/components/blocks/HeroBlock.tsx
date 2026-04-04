import React from 'react';

export const HeroBlock = ({ data }: { data: any }) => (
  <section className="relative py-20 bg-blue-900 text-white text-center">
    <div className="container mx-auto px-6">
      <h1 className="text-5xl font-extrabold mb-4">{data.title}</h1>
      <p className="text-xl mb-8 opacity-90">{data.subtitle}</p>
      {data.ctaLink && (
        <a href={data.ctaLink} className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
          {data.ctaLabel}
        </a>
      )}
    </div>
  </section>
);

export default HeroBlock;
