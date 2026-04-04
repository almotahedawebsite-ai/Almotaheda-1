import React from 'react';

export const CTABlock = ({ data }: { data: any }) => (
  <section className="py-12 bg-indigo-600">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-white">
      <h2 className="text-3xl font-bold mb-4 md:mb-0">{data.text}</h2>
      <button className="bg-yellow-400 text-indigo-900 px-10 py-4 rounded font-black hover:scale-105 transition">
        {data.buttonLabel}
      </button>
    </div>
  </section>
);

export default CTABlock;
