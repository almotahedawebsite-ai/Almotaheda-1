'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { StoreRepository } from '@/modules/ecom/repositories/StoreRepository';
import { Category } from '@/domain/types/store';
import { TranslatableField } from '@/presentation/components/Dashboard/TranslatableField';
import { TranslatableString } from '@/domain/types/settings';
import { FiTag, FiPlus, FiList, FiTrash2 } from 'react-icons/fi';

import { triggerRevalidation } from '@/app/actions/revalidate';

export default function StoreCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  
  // New Category Form State
  const [newCat, setNewCat] = useState<Partial<Category>>({
    name: { ar: '', en: '' },
    description: { ar: '', en: '' },
    order: 0,
    slug: ''
  });

  const repo = new StoreRepository(db);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const data = await repo.getCategories();
    setCategories(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newCat.name || (typeof newCat.name !== 'string' && !newCat.name.ar)) {
      alert('الرجاء إدخال اسم التصنيف باللغة العربية على الأقل');
      return;
    }
    setAdding(true);
    try {
      // Auto-generate slug if empty
      const slugBase = typeof newCat.name === 'string' ? newCat.name : newCat.name.ar;
      const finalSlug = newCat.slug || slugBase.toLowerCase().replace(/ /g, '-');
      
      await repo.saveCategory({ ...newCat, slug: finalSlug });
      
      // On-Demand Revalidation
      await triggerRevalidation('categories');

      setNewCat({ name: { ar: '', en: '' }, description: { ar: '', en: '' }, order: 0, slug: '' });
      await fetchCategories();
    } catch (e) {
      alert('حدث خطأ أثناء الإضافة');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التصنيف؟')) return;
    await repo.deleteCategory(id);
    
    // On-Demand Revalidation
    await triggerRevalidation('categories');

    await fetchCategories();
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <span className="p-3 bg-purple-50 text-purple-600 rounded-2xl text-2xl"><FiTag /></span> إدارة التصنيفات
          </h1>
          <p className="text-gray-500 mt-2 text-lg">تحكم في فئات المنتجات المتاحة في المتجر</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ADD NEW CATEGORY FORM */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 h-fit sticky top-8">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-4">
            <FiPlus className="text-brand-teal" /> إضافة تصنيف جديد
          </h2>
          
          <TranslatableField 
            label="اسم التصنيف" 
            value={newCat.name as TranslatableString} 
            onChange={val => setNewCat({ ...newCat, name: val })} 
            enableMultiLanguage={true}
            placeholder="مثال: هواتف ذكية"
          />

          <TranslatableField 
            label="الوصف (اختياري)" 
            value={newCat.description as TranslatableString} 
            onChange={val => setNewCat({ ...newCat, description: val })} 
            enableMultiLanguage={true}
            isTextArea={true}
            placeholder="اكتب وصفاً مختصراً للقسم..."
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الترتيب</label>
              <input 
                type="number" 
                className="w-full p-3 bg-gray-50 border rounded-xl"
                value={newCat.order}
                onChange={e => setNewCat({ ...newCat, order: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Slug (الرابط)</label>
              <input 
                type="text" 
                className="w-full p-3 bg-gray-50 border rounded-xl font-mono text-xs"
                placeholder="iphones-pro"
                value={newCat.slug}
                onChange={e => setNewCat({ ...newCat, slug: e.target.value })}
              />
            </div>
          </div>

          <button 
            onClick={handleAdd}
            disabled={adding}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-purple-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {adding ? '...' : 'تأكيد إضافة التصنيف'}
          </button>
        </div>

        {/* CATEGORY LIST */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold px-2 flex items-center gap-2"><FiList className="text-brand-teal" /> جميع التصنيفات الحالية ({categories.length})</h2>
          
          {loading ? (
            <div className="p-10 text-center text-gray-400">جاري التحميل...</div>
          ) : categories.length === 0 ? (
            <div className="bg-white p-20 rounded-3xl border-2 border-dashed text-center text-gray-400">
               لا توجد تصنيفات حالياً. ابدأ بإضافة أول تصنيف من القائمة الجانبية.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-purple-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl font-bold">
                       {cat.order}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {typeof cat.name === 'string' ? cat.name : (cat.name.ar || cat.name.en)}
                        {typeof cat.name !== 'string' && cat.name.en && (
                          <span className="text-xs text-gray-400 mr-2 font-mono">({cat.name.en})</span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">/{cat.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      title="حذف"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

