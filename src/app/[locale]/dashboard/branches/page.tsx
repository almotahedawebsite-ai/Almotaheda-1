'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { BranchRepository } from '@/infrastructure/repositories/BranchRepository';
import { CloudinaryService } from '@/infrastructure/services/CloudinaryService';
import { Branch } from '@/domain/types/branch';
import { tField } from '@/domain/types/settings';
import { FiMap, FiPlus, FiMapPin, FiPhone, FiEdit2, FiTrash2, FiCheck, FiPauseCircle, FiSave, FiX, FiArrowLeft } from 'react-icons/fi';

export default function DashboardBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Branch> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const repo = new BranchRepository(db);

  const fetchBranches = async () => {
    setLoading(true);
    const data = await repo.getAll();
    setBranches(data);
    setLoading(false);
  };

  useEffect(() => { fetchBranches(); }, []);

  const handleNew = () => {
    setIsNew(true);
    setEditing({
      id: `branch-${Date.now()}`,
      name: { ar: '', en: '' },
      image: '',
      address: { ar: '', en: '' },
      googleMapUrl: '',
      phone: '',
      workingHours: { ar: '', en: '' },
      order: branches.length + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  };

  const handleEdit = (branch: Branch) => {
    setIsNew(false);
    setEditing({ ...branch });
  };

  const handleSave = async () => {
    if (!editing || !editing.id) return;
    setSaving(true);
    try {
      editing.updatedAt = new Date().toISOString();
      if (isNew) {
        await repo.create(editing.id, editing as Branch);
      } else {
        await repo.update(editing.id, editing);
      }
      setEditing(null);
      await fetchBranches();
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الفرع؟')) return;
    await repo.delete(id);
    await fetchBranches();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    try {
      const url = await CloudinaryService.uploadImage(file);
      setEditing({ ...editing, image: url });
    } catch { alert('فشل رفع الصورة'); }
  };

  const updateTranslatable = (field: string, lang: string, value: string) => {
    if (!editing) return;
    const current = (editing as any)[field] || { ar: '', en: '' };
    const updated = typeof current === 'string' ? { ar: current, en: '' } : { ...current };
    updated[lang] = value;
    setEditing({ ...editing, [field]: updated });
  };

  if (loading) return <div className="p-10 font-bold text-gray-400 text-center">جاري تحميل الفروع...</div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><FiMap className="text-brand-teal" /> إدارة الفروع</h1>
          <p className="text-gray-500 mt-1">المقرات، أرقام التواصل لكل فرع، ومسؤولي الفروع</p>
        </div>
        <button onClick={handleNew} className="bg-brand-teal hover:bg-brand-navy text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
          <FiPlus /> إضافة فرع جديد
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black flex items-center gap-2">{isNew ? <><FiPlus className="text-brand-teal" /> إضافة فرع جديد</> : <><FiEdit2 className="text-brand-teal" /> تعديل الفرع</>}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-red-500 text-2xl"><FiX /></button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">اسم الفرع (عربي) *</label>
                <input type="text" value={typeof editing.name === 'object' ? (editing.name as any).ar : ''} onChange={(e) => updateTranslatable('name', 'ar', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none" placeholder="مثال: فرع القاهرة" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">اسم الفرع (إنجليزي)</label>
                <input type="text" value={typeof editing.name === 'object' ? (editing.name as any).en : ''} onChange={(e) => updateTranslatable('name', 'en', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none" dir="ltr" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">العنوان (عربي)</label>
                <textarea value={typeof editing.address === 'object' ? (editing.address as any).ar : ''} onChange={(e) => updateTranslatable('address', 'ar', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none" rows={2} />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">رقم التواصل</label>
                <input type="text" value={editing.phone || ''} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3" dir="ltr" placeholder="+20..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">رابط خريطة جوجل</label>
                <input type="text" value={editing.googleMapUrl || ''} onChange={(e) => setEditing({ ...editing, googleMapUrl: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3" dir="ltr" placeholder="https://maps.google.com/..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">مواعيد العمل (عربي)</label>
                <input type="text" value={typeof editing.workingHours === 'object' ? (editing.workingHours as any).ar : ''} onChange={(e) => updateTranslatable('workingHours', 'ar', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3" placeholder="مثال: السبت - الخميس: 9ص - 6م" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">صورة الفرع</label>
                {editing.image && <img src={editing.image} alt="" className="w-full h-40 object-cover rounded-xl mb-2" />}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
                <input type="text" value={editing.image || ''} onChange={(e) => setEditing({ ...editing, image: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2 mt-2 text-sm" dir="ltr" placeholder="أو ألصق رابط الصورة" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">الترتيب</label>
                  <input type="number" value={editing.order || 1} onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) })} className="w-full border border-gray-200 rounded-xl px-4 py-3" />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input type="checkbox" checked={editing.isActive !== false} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} className="w-5 h-5 rounded" id="branch-active" />
                  <label htmlFor="branch-active" className="font-bold text-gray-700">مفعّل</label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-brand-teal hover:bg-brand-navy text-white py-3 rounded-xl font-black transition-all disabled:opacity-50 flex items-center justify-center gap-2">{saving ? 'جاري الحفظ...' : <><FiSave /> حفظ</>}</button>
                <button onClick={() => setEditing(null)} className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition-all">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {branch.image ? (
              <img src={branch.image} alt="" className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-brand-navy to-brand-teal flex items-center justify-center text-5xl text-white/20"><FiMap /></div>
            )}
            <div className="p-5">
              <h3 className="font-black text-gray-900 text-lg mb-2">{tField(branch.name, 'ar')}</h3>
              {tField(branch.address, 'ar') && <p className="text-gray-500 text-sm mb-1 flex items-center gap-2"><FiMapPin /> {tField(branch.address, 'ar')}</p>}
              {branch.phone && <p className="text-gray-500 text-sm mb-1 flex items-center gap-2" dir="ltr"><FiPhone /> {branch.phone}</p>}
              <span className={`text-xs font-bold flex items-center gap-1 ${branch.isActive ? 'text-green-500' : 'text-red-500'}`}>
                {branch.isActive ? <><FiCheck /> مفعّل</> : <><FiPauseCircle /> معطّل</>}
              </span>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleEdit(branch)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"><FiEdit2 /> تعديل</button>
                <button onClick={() => handleDelete(branch.id)} className="bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-xl text-sm font-bold transition-colors"><FiTrash2 /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {branches.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
          <span className="text-5xl mb-4 block text-gray-300"><FiMap /></span>
          <p className="text-gray-400 font-bold">لا توجد فروع حالياً</p>
          <button onClick={handleNew} className="mt-4 text-brand-teal font-bold hover:underline"><span className="flex items-center gap-1">أضف فرع جديد <FiArrowLeft /></span></button>
        </div>
      )}
    </div>
  );
}
