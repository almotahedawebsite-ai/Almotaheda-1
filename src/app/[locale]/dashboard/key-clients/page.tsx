'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { KeyClientRepository } from '@/infrastructure/repositories/KeyClientRepository';
import { CloudinaryService } from '@/infrastructure/services/CloudinaryService';
import { KeyClient } from '@/domain/types/keyClient';
import { tField } from '@/domain/types/settings';
import { FiStar, FiPlus, FiBriefcase, FiCheck, FiPauseCircle, FiEdit2, FiTrash2, FiSave, FiX, FiArrowLeft } from 'react-icons/fi';

export default function DashboardKeyClientsPage() {
  const [clients, setClients] = useState<KeyClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<KeyClient> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const repo = new KeyClientRepository(db);

  const fetchClients = async () => {
    setLoading(true);
    const data = await repo.getAll();
    setClients(data);
    setLoading(false);
  };

  useEffect(() => { fetchClients(); }, []);

  const handleNew = () => {
    setIsNew(true);
    setEditing({
      id: `client-${Date.now()}`,
      name: { ar: '', en: '' },
      logo: '',
      description: { ar: '', en: '' },
      image: '',
      category: '',
      order: clients.length + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  };

  const handleEdit = (client: KeyClient) => {
    setIsNew(false);
    setEditing({ ...client });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'image') => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    try {
      const url = await CloudinaryService.uploadImage(file);
      setEditing({ ...editing, [field]: url });
    } catch (err) {
      alert('فشل رفع الصورة');
    }
  };

  const handleSave = async () => {
    if (!editing || !editing.id) return;
    setSaving(true);
    try {
      editing.updatedAt = new Date().toISOString();
      if (isNew) {
        await repo.create(editing.id, editing as KeyClient);
      } else {
        await repo.update(editing.id, editing);
      }
      setEditing(null);
      await fetchClients();
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return;
    await repo.delete(id);
    await fetchClients();
  };

  const updateTranslatable = (field: string, lang: string, value: string) => {
    if (!editing) return;
    const current = (editing as any)[field] || { ar: '', en: '' };
    const updated = typeof current === 'string' ? { ar: current, en: '' } : { ...current };
    updated[lang] = value;
    setEditing({ ...editing, [field]: updated });
  };

  if (loading) return <div className="p-10 font-bold text-gray-400 text-center">جاري تحميل العملاء...</div>;

  return (
    <>
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><FiStar className="text-brand-teal" /> أهم العملاء</h1>
            <p className="text-gray-500 mt-1">إضافة وتعديل وحذف أهم عملاء الشركة</p>
          </div>
          <button onClick={handleNew} className="bg-brand-teal hover:bg-brand-navy text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
            <FiPlus /> إضافة عميل
          </button>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                {client.logo ? (
                  <img src={client.logo} alt="" className="w-16 h-16 object-contain rounded-xl" />
                ) : (
                  <div className="w-16 h-16 bg-brand-navy/5 rounded-xl flex items-center justify-center text-3xl text-gray-300"><FiBriefcase /></div>
                )}
                <div>
                  <h3 className="font-black text-gray-900">{tField(client.name, 'ar')}</h3>
                  <span className={`text-xs font-bold flex items-center gap-1 mt-1 ${client.isActive ? 'text-green-500' : 'text-red-500'}`}>
                    {client.isActive ? <><FiCheck /> مفعّل</> : <><FiPauseCircle /> معطّل</>}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(client)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"><FiEdit2 /> تعديل</button>
                <button onClick={() => handleDelete(client.id)} className="bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-xl text-sm font-bold transition-colors flex items-center justify-center"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>

        {clients.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <span className="text-5xl mb-4 block text-gray-300 flex justify-center"><FiStar /></span>
            <p className="text-gray-400 font-bold">لا يوجد عملاء حالياً</p>
            <button onClick={handleNew} className="mt-4 text-brand-teal font-bold hover:underline"><span className="flex items-center gap-1">أضف عميل جديد <FiArrowLeft /></span></button>
          </div>
        )}
      </div>

      {/* Premium Edit Drawer */}
      {editing && (
        <div className="fixed inset-y-0 left-0 right-0 z-[100] flex justify-end">
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={() => setEditing(null)} />
          
          <div className="relative w-full max-w-md md:max-w-lg bg-white h-full shadow-2xl flex flex-col border-r border-gray-100 animate-slide-in-left">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white shrink-0">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">{isNew ? <><FiPlus className="text-brand-teal" /> إضافة عميل جديد</> : <><FiEdit2 className="text-brand-teal" /> تعديل العميل</>}</h2>
              <button onClick={() => setEditing(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors font-bold"><FiX /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1.5">اسم العميل (عربي) *</label>
                  <input
                    type="text"
                    value={typeof editing.name === 'object' ? (editing.name as any).ar : ''}
                    onChange={(e) => updateTranslatable('name', 'ar', e.target.value)}
                    className="w-full border-none shadow-inner rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-teal outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1.5">اسم العميل (إنجليزي)</label>
                  <input
                    type="text"
                    value={typeof editing.name === 'object' ? (editing.name as any).en : ''}
                    onChange={(e) => updateTranslatable('name', 'en', e.target.value)}
                    className="w-full border-none shadow-inner rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-teal outline-none text-sm"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-1.5">الوصف (عربي)</label>
                <textarea
                  value={typeof editing.description === 'object' ? (editing.description as any).ar : ''}
                  onChange={(e) => updateTranslatable('description', 'ar', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none text-sm"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <label className="block text-xs font-black text-gray-700 mb-2">شعار العميل (Logo)</label>
                  {editing.logo && <img src={editing.logo} alt="" className="w-16 h-16 object-contain rounded-lg mb-3 bg-white shadow-sm p-1" />}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} className="text-xs w-full text-gray-500 mb-2 cursor-pointer" />
                  <input type="text" value={editing.logo || ''} onChange={(e) => setEditing({ ...editing, logo: e.target.value })} className="w-full border-none shadow-inner rounded-lg px-3 py-2 text-xs" dir="ltr" placeholder="رابط خارجي" />
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <label className="block text-xs font-black text-gray-700 mb-2">صورة العميل الكبيرة</label>
                  {editing.image && <img src={editing.image} alt="" className="w-full h-16 object-cover rounded-lg mb-3 shadow-sm" />}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} className="text-xs w-full text-gray-500 mb-2 cursor-pointer" />
                  <input type="text" value={editing.image || ''} onChange={(e) => setEditing({ ...editing, image: e.target.value })} className="w-full border-none shadow-inner rounded-lg px-3 py-2 text-xs" dir="ltr" placeholder="رابط خارجي" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1.5">التصنيف</label>
                  <input type="text" value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-teal" />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1.5">الترتيب</label>
                  <input type="number" value={editing.order || 1} onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-teal text-center" />
                </div>
              </div>

              <label className="flex items-center gap-3 p-4 bg-brand-teal/5 rounded-xl border border-brand-teal/20 cursor-pointer hover:bg-brand-teal/10 transition-colors">
                <input type="checkbox" checked={editing.isActive !== false} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} className="w-5 h-5 rounded text-brand-teal focus:ring-brand-teal" />
                <span className="font-black text-brand-teal text-sm">تفعيل وإظهار العميل في الموقع</span>
              </label>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white shrink-0">
               <button onClick={handleSave} disabled={saving} className="w-full bg-brand-teal hover:bg-brand-navy text-white py-4 rounded-xl font-black transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                 {saving ? 'جاري الحفظ...' : <><FiSave /> حفظ بيانات العميل</>}
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
