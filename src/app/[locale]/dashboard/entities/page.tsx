'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { BaseRepository } from '@/infrastructure/repositories/BaseRepository';
import { SettingsRepository } from '@/infrastructure/repositories/SettingsRepository';
import { CloudinaryService } from '@/infrastructure/services/CloudinaryService';
import { BaseEntity, EntityType } from '@/domain/types/entity';
import { TranslatableString } from '@/domain/types/settings';
import { EntityTypesConfig } from '@/config/entityTypes';
import { TranslatableField } from '@/presentation/components/Dashboard/TranslatableField';
import { triggerRevalidation } from '@/app/actions/revalidate';
import { FiGlobe, FiEdit3, FiSend, FiFolder, FiExternalLink } from 'react-icons/fi';

export default function EntitiesDashboard() {
  const [entities, setEntities] = useState<BaseEntity[]>([]);
  const [enableMultiLanguage, setEnableMultiLanguage] = useState(false);
  const types = EntityTypesConfig;
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState<Partial<BaseEntity>>({
    title: '',
    slug: '',
    type: '',
    customFields: []
  });
  const entityRepo = new BaseRepository<BaseEntity>(db, 'entities');
  const slugRepo = new BaseRepository<any>(db, 'slugs');
  const settingsRepo = new SettingsRepository(db);

  useEffect(() => {
    const loadData = async () => {
      const [e, settings] = await Promise.all([
        entityRepo.find([]),
        settingsRepo.getGlobalSettings()
      ]);
      setEntities(e);
      setEnableMultiLanguage(!!settings.enableMultiLanguage);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.type) return alert('يرجى ملء جميع الحقول المطلوبة');

    const id = formData.id || Math.random().toString(36).substring(7);
    const entity = {
      ...formData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as BaseEntity;

    await entityRepo.create(id, entity);

    await slugRepo.create(entity.slug, {
      id: entity.slug,
      targetId: id,
      targetType: 'entity'
    });

    // On-Demand Revalidation
    await triggerRevalidation('entities');

    alert('تم النشر بنجاح!');
    window.location.reload();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await CloudinaryService.uploadImage(file);
      const newFields = [...(formData.customFields || [])];
      const idx = newFields.findIndex(f => f.fieldId === fieldId);
      if (idx > -1) newFields[idx].value = url;
      else newFields.push({ fieldId, value: url });

      setFormData({ ...formData, customFields: newFields });
    } catch (err) {
      alert('فشل رفع الصورة');
    }
  };

  const handleFieldChange = (fieldId: string, value: string | TranslatableString) => {
    const newFields = [...(formData.customFields || [])];
    const idx = newFields.findIndex(f => f.fieldId === fieldId);
    if (idx > -1) newFields[idx].value = value;
    else newFields.push({ fieldId, value });
    setFormData({ ...formData, customFields: newFields });
  };

  const getFieldValue = (fieldId: string) => {
    return formData.customFields?.find(f => f.fieldId === fieldId)?.value || '';
  };

  // Auto-generate slug from Arabic or English title
  const handleTitleChange = (val: TranslatableString) => {
    setFormData(prev => {
      const titleStr = typeof val === 'string' ? val : (val.en || val.ar || '');
      const autoSlug = prev.slug ? prev.slug : titleStr.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return { ...prev, title: val, slug: autoSlug };
    });
  };

  if (loading) return <div className="p-10 font-mono text-gray-500">جاري تحميل البيانات...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900">مصنع المحتوى (Entity Engine)</h1>
          <p className="text-gray-500 mt-1">
            أنشئ الصفحات، المنتجات، وأي محتوى ديناميكي من هنا.
            {enableMultiLanguage && (
              <span className="mr-2 bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded font-bold flex items-center gap-1 inline-flex"><FiGlobe /> وضع الترجمة مفعّل</span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create / Edit Form */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FiEdit3 className="text-brand-teal" /> محرر المحتوى الجديد</h2>
          <div className="space-y-4">

            {/* Title - Always Translatable */}
            <TranslatableField
              label="عنوان المحتوى (Title)"
              value={formData.title as TranslatableString}
              onChange={handleTitleChange}
              enableMultiLanguage={enableMultiLanguage}
              placeholder="مثال: خدمة التصميم الداخلي"
            />

            {/* Slug */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">الرابط الدائم (Slug)</label>
              <input
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-mono text-sm text-gray-500 focus:ring-2 focus:ring-blue-500"
                placeholder="interior-design-service"
                value={typeof formData.slug === 'string' ? formData.slug : ''}
                dir="ltr"
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">* يتم توليده تلقائياً من العنوان الإنجليزي</p>
            </div>

            {/* Type Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">نوع المحتوى</label>
              <select
                className="w-full p-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.type}
                onChange={e => {
                  const type = types.find(t => t.id === e.target.value);
                  setFormData({
                    ...formData,
                    type: e.target.value,
                    customFields: type?.fields.map(f => ({ fieldId: f.id, value: '' })) || []
                  });
                }}
              >
                <option value="">اختر النوع...</option>
                {types.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>

            {/* Custom Fields - Auto-translated if field is translatable */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              {formData.customFields?.map((cf) => {
                const def = types.find(t => t.id === formData.type)?.fields.find(f => f.id === cf.fieldId);
                if (!def) return null;

                return (
                  <div key={cf.fieldId}>
                    {def.type === 'image' ? (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{def.label}</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
                          <input type="file" className="text-sm" onChange={e => handleImageUpload(e, cf.fieldId)} />
                          {cf.value && typeof cf.value === 'string' && (
                            <img src={cf.value} className="mt-4 h-32 w-auto mx-auto rounded-lg shadow-sm" alt="Uploaded" />
                          )}
                        </div>
                      </div>
                    ) : def.translatable ? (
                      // Text/Textarea fields marked as translatable → use TranslatableField
                      <TranslatableField
                        label={def.label}
                        value={getFieldValue(cf.fieldId) as TranslatableString}
                        onChange={(val: TranslatableString) => handleFieldChange(cf.fieldId, val)}
                        enableMultiLanguage={enableMultiLanguage}
                        isTextArea={def.type === 'textarea'}
                        placeholder={`أدخل ${def.label}...`}
                      />
                    ) : (
                      // Non-translatable fields (numbers, booleans, etc.)
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{def.label}</label>
                        <input
                          className="w-full p-4 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                          type={def.type === 'number' ? 'number' : 'text'}
                          value={typeof cf.value === 'string' ? cf.value : ''}
                          onChange={e => handleFieldChange(cf.fieldId, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-black transition-colors shadow-lg mt-8 flex justify-center items-center gap-2"
              onClick={handleSave}
            >
              نشر المحتوى <FiSend />
            </button>
          </div>
        </section>

        {/* List of Entities */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FiFolder className="text-brand-teal" /> الأرشيف الحالي</h2>
          <div className="space-y-3">
            {entities.length === 0 && (
              <p className="text-center text-gray-400 py-8">لا يوجد محتوى منشور بعد. ابدأ من المحرر!</p>
            )}
            {entities.map(ent => (
              <div key={ent.id} className="p-4 border rounded-xl flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-bold text-gray-900">
                    {typeof ent.title === 'string' ? ent.title : (ent.title?.ar || ent.title?.en || 'بدون عنوان')}
                  </p>
                  <p className="text-sm text-gray-400 font-mono">/{ent.slug}</p>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded mt-1 inline-block">{ent.type}</span>
                </div>
                <a
                  href={`/${ent.slug}`}
                  target="_blank"
                  className="text-blue-500 text-sm font-bold uppercase hover:text-blue-700 transition-colors flex items-center gap-1"
                >
                  عرض <FiExternalLink />
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
