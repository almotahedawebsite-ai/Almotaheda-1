'use client';

import React, { useEffect, useState, useRef } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { BeforeAfterRepository } from '@/infrastructure/repositories/BeforeAfterRepository';
import { CloudinaryService } from '@/infrastructure/services/CloudinaryService';
import { BeforeAfterImage } from '@/domain/types/beforeAfter';
import { triggerRevalidation } from '@/app/actions/revalidate';
import { FiImage, FiUploadCloud, FiTrash2, FiLoader } from 'react-icons/fi';

export default function DashboardBeforeAfterPage() {
  const [images, setImages] = useState<BeforeAfterImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const repo = new BeforeAfterRepository(db);

  const fetchImages = async () => {
    setLoading(true);
    const data = await repo.getAll();
    setImages(data);
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    const total = files.length;
    let uploadedCount = 0;

    try {
      const uploadPromises = Array.from(files).map(async (file, i) => {
        try {
          const url = await CloudinaryService.uploadImage(file);
          const newImage: BeforeAfterImage = {
            id: `ba-${Date.now()}-${i}`,
            imageUrl: url,
            isActive: true,
            order: images.length + i + 1,
            createdAt: Date.now(),
          };
          await repo.create(newImage.id, newImage);
        } catch (error) {
          console.error("Failed to upload image:", error);
        } finally {
          uploadedCount++;
          setUploadProgress(Math.round((uploadedCount / total) * 100));
        }
      });

      await Promise.all(uploadPromises);
      await triggerRevalidation('before_after_images');
      await fetchImages();
    } catch (err) {
      alert('حدث خطأ غير متوقع أثناء المعالجة.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;
    await repo.delete(id);
    await triggerRevalidation('before_after_images');
    await fetchImages();
  };

  if (loading) return <div className="p-10 font-bold text-gray-400 text-center flex flex-col items-center justify-center gap-4 min-h-[400px]"><FiLoader className="animate-spin text-4xl text-brand-teal" /> <span>جاري تحميل الصور...</span></div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><FiImage className="text-brand-teal" /> معرض الصور</h1>
          <p className="text-gray-500 mt-2 font-bold text-sm">رفع وإدارة صور الأعمال لعرضها في الرئيسية (يمكنك تحديد صور متعددة)</p>
        </div>
        <div>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleBulkUpload} 
            disabled={uploading}
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={uploading}
            className="w-full sm:w-auto bg-brand-teal hover:bg-brand-navy text-white px-8 py-4 rounded-xl font-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex justify-center items-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {uploading ? (
              <><FiLoader className="animate-spin text-xl" /> جاري الرفع ({uploadProgress}%)</>
            ) : (
              <><FiUploadCloud className="text-xl" /> إضافة صور دفعة واحدة</>
            )}
          </button>
        </div>
      </div>

      {uploading && (
        <div className="w-full bg-brand-teal/10 rounded-full h-3 mb-4 overflow-hidden border border-brand-teal/20">
          <div className="bg-brand-teal h-3 rounded-full transition-all duration-300 relative overflow-hidden" style={{ width: `${uploadProgress}%` }}>
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {images.map((img) => (
          <div key={img.id} className="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm hover:shadow-xl transition-all duration-300 group relative">
            <div className="w-full aspect-[7/10] bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center relative">
              {img.imageUrl ? (
                <img src={img.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <span className="text-xs text-gray-400 font-bold">بدون صورة</span>
              )}
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button 
                  onClick={() => handleDelete(img.id)} 
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-2xl transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"
                  title="حذف الصورة"
                >
                  <FiTrash2 className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && !uploading && (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 hover:border-brand-teal/50 transition-colors">
          <span className="text-6xl mb-6 block text-gray-300 flex justify-center"><FiUploadCloud /></span>
          <p className="text-gray-400 font-black text-xl mb-6">لا يوجد أي صور في المعرض حالياً</p>
          <button onClick={() => fileInputRef.current?.click()} className="text-white bg-brand-navy hover:bg-brand-teal px-8 py-3 rounded-xl font-bold shadow-lg transition-colors">
            تصفح ملفاتك لرفع الصور
          </button>
        </div>
      )}
    </div>
  );
}
