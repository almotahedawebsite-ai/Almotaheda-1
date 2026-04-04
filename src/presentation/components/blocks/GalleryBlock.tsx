import React from 'react';

export const GalleryBlock = ({ data }: { data: any }) => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold mb-8 text-center">{data.title}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.images?.map((url: string, idx: number) => (
          <img key={idx} src={url} alt={`Gallery ${idx}`} className="w-full h-64 object-cover rounded-lg shadow-md" />
        ))}
      </div>
    </div>
  </section>
);

export default GalleryBlock;
