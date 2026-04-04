'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { StoreRepository } from '@/modules/ecom/repositories/StoreRepository';
import { Product, Category } from '@/domain/types/store';
import { TranslatableField } from '@/presentation/components/Dashboard/TranslatableField';
import { SiteSettings, tField, TranslatableString } from '@/domain/types/settings';
import { triggerRevalidation } from '@/app/actions/revalidate';
import { CloudinaryService } from '@/infrastructure/services/CloudinaryService';
import { FiGift, FiPlus, FiPackage, FiTrash2, FiSave, FiX } from 'react-icons/fi';

export default function StoreProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Product Form State
  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: { ar: '', en: '' },
    description: { ar: '', en: '' },
    price: 0,
    stock: 0,
    images: [],
    categoryId: '',
    slug: ''
  });

  const repo = new StoreRepository(db);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [prodData, catData] = await Promise.all([
      repo.getProducts(),
      repo.getCategories()
    ]);
    setProducts(prodData);
    setCategories(catData);
    setLoading(false);
  };

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    setSaving(true);
    try {
      const urls = await Promise.all(
        Array.from(files).map(file => CloudinaryService.uploadImage(file))
      );
      setNewProd(p => ({ ...p, images: [...(p.images || []), ...urls] }));
    } catch (err) {
      alert('فشل رفع بعض الصور');
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    if (!newProd.name || !newProd.categoryId || !newProd.price) {
      alert('الرجاء إكمال كافة البيانات الأساسية (الاسم، التصنيف، السعر)');
      return;
    }
    setSaving(true);
    try {
      const slugBase = typeof newProd.name === 'string' ? newProd.name : (newProd.name as any).ar;
      const finalSlug = newProd.slug || slugBase.toLowerCase().replace(/ /g, '-');
      
      await repo.saveProduct({ ...newProd, slug: finalSlug });
      
      // On-Demand Revalidation
      await triggerRevalidation('products');

      setShowAddModal(false);
      setNewProd({ name: { ar: '', en: '' }, description: { ar: '', en: '' }, price: 0, stock: 0, images: [], categoryId: '', slug: '' });
      await fetchData();
    } catch (e) {
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    await repo.deleteProduct(id);
    
    // On-Demand Revalidation
    await triggerRevalidation('products');

    await fetchData();
  };

  return (
    <>
      <div className="p-8 space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <span className="p-3 bg-purple-50 text-purple-600 rounded-2xl text-2xl"><FiGift /></span> إدارة المنتجات
          </h1>
            <p className="text-gray-500 mt-2 text-lg">أضف منتجاتك الجديدة وقم بتحديث المخزون</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-purple-100 flex items-center gap-2"
        >
          <FiPlus /> إضافة منتج جديد
        </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">جاري تحميل المنتجات...</div>
        ) : products.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl border-2 border-dashed text-center text-gray-400 flex flex-col items-center gap-4">
           <FiPackage className="w-16 h-16 text-gray-200" />
           لا توجد منتجات حالياً. ابدأ بإضافة أول منتج لمتجرك.
        </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(prod => (
              <div key={prod.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all">
                <div className="relative h-56 bg-gray-50">
                  {prod.images?.[0] ? (
                    <img src={prod.images[0]} alt="prod" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-purple-300 opacity-20"><FiPackage /></div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-purple-600 shadow-sm border">
                     {tField(categories.find(c => c.id === prod.categoryId)?.name, 'ar') || 'بدون تصنيف'}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 text-xl truncate">
                     {typeof prod.name === 'string' ? prod.name : (prod.name.ar || prod.name.en)}
                  </h3>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-2xl font-black text-purple-600">{prod.price} <span className="text-sm">EGP</span></p>
                      <p className={`text-xs font-bold mt-1 ${prod.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        المخزون: {prod.stock}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDelete(prod.id)}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD PRODUCT DRAWER */}
      {showAddModal && (
        <div className="fixed inset-y-0 left-0 right-0 z-[100] flex justify-end">
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={() => setShowAddModal(false)} />
          
          <div className="relative w-full max-w-md md:max-w-xl bg-white h-full shadow-2xl flex flex-col border-r border-gray-100 animate-slide-in-left">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white shrink-0">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><FiPlus className="text-purple-600" /> إضافة منتج جديد</h2>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors font-bold"><FiX /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              <div className="space-y-6">
                <TranslatableField 
                  label="اسم المنتج" 
                  value={newProd.name as TranslatableString} 
                  onChange={val => setNewProd({ ...newProd, name: val })} 
                  enableMultiLanguage={true}
                />
                <TranslatableField 
                  label="وصف المنتج" 
                  value={newProd.description as TranslatableString} 
                  onChange={val => setNewProd({ ...newProd, description: val })} 
                  enableMultiLanguage={true}
                  isTextArea={true}
                />
              </div>
              
              <div className="space-y-6 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">التصنيف</label>
                  <select 
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 text-sm"
                    value={newProd.categoryId}
                    onChange={e => setNewProd({ ...newProd, categoryId: e.target.value })}
                  >
                    <option value="">اختر التصنيف...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{(c.name as any).ar}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2">السعر (EGP)</label>
                    <input 
                      type="number" 
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 text-sm text-center"
                      value={newProd.price}
                      onChange={e => setNewProd({ ...newProd, price: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2">الكمية بالمخزن</label>
                    <input 
                      type="number" 
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 text-sm text-center"
                      value={newProd.stock}
                      onChange={e => setNewProd({ ...newProd, stock: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">صور المنتج</label>
                  <input type="file" multiple onChange={handleUploadImages} className="text-xs w-full text-gray-500 mb-2 cursor-pointer" />
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {newProd.images?.map((img, i) => (
                      <img key={i} src={img} className="w-full h-16 object-cover rounded-lg border border-gray-200 shadow-sm" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white shrink-0">
               <button 
                 onClick={handleAdd}
                 disabled={saving}
                 className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-black shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
               >
                 {saving ? 'جاري الحفظ...' : <><FiSave /> حفظ المنتج والمخزون</>}
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

