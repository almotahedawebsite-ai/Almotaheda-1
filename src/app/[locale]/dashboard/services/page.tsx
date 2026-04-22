'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { ServiceRepository } from '@/infrastructure/repositories/ServiceRepository';
import { CloudinaryService } from '@/infrastructure/services/CloudinaryService';
import { Service } from '@/domain/types/service';
import { tField } from '@/domain/types/settings';
import { FiLayers, FiPlus, FiCheck, FiPauseCircle, FiEdit2, FiTrash2, FiSave, FiX, FiArrowLeft, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

export default function DashboardServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const repo = new ServiceRepository(db);

  const fetchServices = async () => {
    setLoading(true);
    const data = await repo.getAll();
    setServices(data);
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, []);

  const handleNew = () => {
    setIsNew(true);
    setEditingService({
      id: `service-${Date.now()}`,
      name: { ar: '', en: '' },
      slug: '',
      description: { ar: '', en: '' },
      image: '',
      video: '',
      icon: '',
      category: 'cleaning',
      order: services.length + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  };

  const handleEdit = (service: Service) => {
    setIsNew(false);
    setEditingService({ ...service });
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingService) return;
    setUploadingImage(true);
    try {
      const url = await CloudinaryService.uploadImage(file);
      setEditingService({ ...editingService, image: url });
    } catch (err) {
      alert('فشل رفع الصورة. تأكد من إعداد Cloudinary.');
    }
    setUploadingImage(false);
  };

  const handleSave = async () => {
    if (!editingService || !editingService.id) return;
    setSaving(true);
    try {
      const nameAr = typeof editingService.name === 'object' ? (editingService.name as any).ar : editingService.name;
      if (!editingService.slug && nameAr) {
        editingService.slug = generateSlug(nameAr);
      }
      editingService.updatedAt = new Date().toISOString();

      if (isNew) {
        await repo.create(editingService.id, editingService as Service);
      } else {
        await repo.update(editingService.id, editingService);
      }
      setEditingService(null);
      await fetchServices();
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ');
      console.error(err);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
    try {
      await repo.delete(id);
      await fetchServices();
    } catch (err) {
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await repo.update(service.id, { isActive: !service.isActive });
      await fetchServices();
    } catch (err) {
      alert('حدث خطأ');
    }
  };

  const updateSubService = (idx: number, lang: string, value: string) => {
    if (!editingService) return;
    const subs: any[] = [...((editingService as any).subServices ?? [])];
    subs[idx] = { ...subs[idx], [lang]: value };
    setEditingService({ ...editingService, subServices: subs } as any);
  };

  const addSubService = () => {
    if (!editingService) return;
    const subs: any[] = [...((editingService as any).subServices ?? []), { ar: '', en: '' }];
    setEditingService({ ...editingService, subServices: subs } as any);
  };

  const removeSubService = (idx: number) => {
    if (!editingService) return;
    const subs = ((editingService as any).subServices ?? []).filter((_: any, i: number) => i !== idx);
    setEditingService({ ...editingService, subServices: subs } as any);
  };

  const updateField = (field: string, value: any) => {
    if (!editingService) return;
    setEditingService({ ...editingService, [field]: value });
  };

  const updateTranslatable = (field: string, lang: string, value: string) => {
    if (!editingService) return;
    const current = (editingService as any)[field] || { ar: '', en: '' };
    const updatedField = typeof current === 'string' ? { ar: current, en: '' } : { ...current };
    updatedField[lang] = value;
    setEditingService({ ...editingService, [field]: updatedField });
  };

  if (loading) return <div className="p-10 font-bold text-gray-400 text-center">جاري تحميل الخدمات...</div>;

  return (
    <>
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><FiLayers className="text-brand-teal" /> إدارة الخدمات</h1>
            <p className="text-gray-500 mt-1">إضافة وتعديل وحذف خدمات الشركة</p>
          </div>
          <button onClick={handleNew} className="bg-brand-teal hover:bg-brand-navy text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
            <FiPlus /> إضافة خدمة
          </button>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right px-6 py-4 text-sm font-black text-gray-500">#</th>
                  <th className="text-right px-6 py-4 text-sm font-black text-gray-500">الخدمة</th>
                  <th className="text-right px-6 py-4 text-sm font-black text-gray-500">التصنيف</th>
                  <th className="text-right px-6 py-4 text-sm font-black text-gray-500">الحالة</th>
                  <th className="text-right px-6 py-4 text-sm font-black text-gray-500">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.map((service, idx) => (
                  <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-400 font-bold">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {service.image ? (
                          <img src={service.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-brand-teal/10 flex items-center justify-center text-xl text-brand-teal"><FiLayers /></div>
                        )}
                        <div>
                          <p className="font-black text-gray-900 text-sm">{tField(service.name, 'ar')}</p>
                          <p className="text-gray-400 text-xs font-mono" dir="ltr">/{service.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold">{service.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(service)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex w-fit items-center gap-1 transition-colors ${
                          service.isActive
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-red-50 text-red-500 hover:bg-red-100'
                        }`}
                        title={service.isActive ? 'اضغط لتعطيل' : 'اضغط لتفعيل'}
                      >
                        {service.isActive
                          ? <><FiToggleRight className="text-base" /> مفعّلة</>
                          : <><FiToggleLeft className="text-base" /> معطّلة</>}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(service)} className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"><FiEdit2 /> تعديل</button>
                        <button onClick={() => handleDelete(service.id)} className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"><FiTrash2 /> حذف</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {services.length === 0 && (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4 text-gray-300"><FiLayers className="w-16 h-16" /></div>
              <p className="text-gray-400 font-bold">لا توجد خدمات حالياً</p>
              <button onClick={handleNew} className="mt-4 text-brand-teal font-bold hover:underline"><span className="flex items-center gap-1">أضف خدمة جديدة <FiArrowLeft /></span></button>
            </div>
          )}
        </div>
      </div>

      {/* Premium Edit Drawer */}
      {editingService && (
        <div className="fixed inset-y-0 left-0 right-0 z-[100] flex justify-end">
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={() => setEditingService(null)} />
          
          <div className="relative w-full max-w-md md:max-w-lg bg-white h-full shadow-2xl flex flex-col border-r border-gray-100 animate-slide-in-left">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white shrink-0">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">{isNew ? <><FiPlus className="text-brand-teal" /> إضافة خدمة جديدة</> : <><FiEdit2 className="text-brand-teal" /> تعديل الخدمة</>}</h2>
              <button onClick={() => setEditingService(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors font-bold"><FiX /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1.5">اسم الخدمة (عربي) *</label>
                  <input
                    type="text"
                    value={typeof editingService.name === 'object' ? (editingService.name as any).ar : ''}
                    onChange={(e) => updateTranslatable('name', 'ar', e.target.value)}
                    className="w-full border-none shadow-inner rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-teal outline-none text-sm transition-all"
                    placeholder="مثال: النظافة الداخلية"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1.5">اسم الخدمة (إنجليزي)</label>
                  <input
                    type="text"
                    value={typeof editingService.name === 'object' ? (editingService.name as any).en : ''}
                    onChange={(e) => updateTranslatable('name', 'en', e.target.value)}
                    className="w-full border-none shadow-inner rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-teal outline-none text-sm transition-all"
                    dir="ltr"
                    placeholder="e.g. Internal Cleaning"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1.5">الرابط (Slug)</label>
                  <input
                    type="text"
                    value={editingService.slug || ''}
                    onChange={(e) => updateField('slug', e.target.value)}
                    className="w-full border-none shadow-inner bg-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-teal outline-none font-mono text-xs transition-all"
                    dir="ltr"
                    placeholder="auto-generated-from-english-name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-1.5">وصف الخدمة (عربي)</label>
                <textarea
                  value={typeof editingService.description === 'object' ? (editingService.description as any).ar : ''}
                  onChange={(e) => updateTranslatable('description', 'ar', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none text-sm transition-all"
                  rows={4}
                  placeholder="وصف تفصيلي للخدمة..."
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-1.5">وصف الخدمة (إنجليزي)</label>
                <textarea
                  value={typeof editingService.description === 'object' ? (editingService.description as any).en : ''}
                  onChange={(e) => updateTranslatable('description', 'en', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none text-sm transition-all"
                  rows={4}
                  dir="ltr"
                  placeholder="Detailed service description..."
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <label className="block text-xs font-black text-gray-700 mb-2">صورة الخدمة</label>
                {editingService.image && (
                  <img src={editingService.image} alt="Preview" className="w-full h-32 object-cover rounded-xl mb-3 shadow-sm" />
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs w-full text-gray-500 mb-2 cursor-pointer" />
                {uploadingImage && <p className="text-brand-teal text-xs font-bold mb-2">جاري رفع الصورة...</p>}
                <input
                  type="text"
                  value={editingService.image || ''}
                  onChange={(e) => updateField('image', e.target.value)}
                  className="w-full border-none shadow-inner bg-white rounded-lg px-3 py-2 text-xs"
                  dir="ltr"
                  placeholder="أو ألصق رابط الصورة هنا"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-1.5">رابط الفيديو الترويجي</label>
                <input
                  type="text"
                  value={editingService.video || ''}
                  onChange={(e) => updateField('video', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none text-sm transition-all"
                  dir="ltr"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1.5">التصنيف</label>
                  <select
                    value={editingService.category || 'cleaning'}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
                  >
                    <option value="cleaning">نظافة</option>
                    <option value="sanitization">تعقيم</option>
                    <option value="pest-control">مكافحة حشرات</option>
                    <option value="restaurant">مطاعم</option>
                    <option value="maintenance">صيانة</option>
                    <option value="landscaping">لاند سكيب</option>
                    <option value="corporate">شركات</option>
                    <option value="labor">عمالة</option>
                    <option value="contracts">تعاقدات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1.5">الترتيب</label>
                  <input
                    type="number"
                    value={editingService.order || 1}
                    onChange={(e) => updateField('order', parseInt(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-center focus:ring-2 focus:ring-brand-teal outline-none"
                  />
                </div>
              </div>

              {/* Sub-services */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black text-gray-700">الخدمات الفرعية</label>
                  <button
                    type="button"
                    onClick={addSubService}
                    className="text-xs bg-brand-teal text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-brand-navy transition-colors"
                  >
                    <FiPlus /> إضافة
                  </button>
                </div>
                {((editingService as any).subServices ?? []).length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-2">لا توجد خدمات فرعية</p>
                )}
                {((editingService as any).subServices ?? []).map((sub: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={sub.ar}
                      onChange={e => updateSubService(idx, 'ar', e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs"
                      placeholder="الاسم بالعربي"
                      dir="rtl"
                    />
                    <input
                      type="text"
                      value={sub.en}
                      onChange={e => updateSubService(idx, 'en', e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs"
                      placeholder="English name"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubService(idx)}
                      className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>

              <label className="flex items-center gap-3 p-4 bg-brand-teal/5 rounded-xl border border-brand-teal/20 cursor-pointer hover:bg-brand-teal/10 transition-colors">
                <input
                  type="checkbox"
                  checked={editingService.isActive !== false}
                  onChange={(e) => updateField('isActive', e.target.checked)}
                  className="w-5 h-5 rounded text-brand-teal focus:ring-brand-teal"
                />
                <span className="font-black text-brand-teal text-sm">مفعّلة (تظهر في الموقع للعملاء)</span>
              </label>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white shrink-0">
               <button
                 onClick={handleSave}
                 disabled={saving}
                 className="w-full bg-brand-teal hover:bg-brand-navy text-white py-4 rounded-xl font-black transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
               >
                 {saving ? 'جاري الحفظ...' : <><FiSave className="w-5 h-5" /> حفظ بيانات الخدمة</>}
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
