'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { StoreRepository } from '@/modules/ecom/repositories/StoreRepository';
import { StoreConfig } from '@/domain/types/store';
import { TranslatableField } from '@/presentation/components/Dashboard/TranslatableField';
import { TranslatableString } from '@/domain/types/settings';
import { FiShoppingBag, FiHome, FiCheckCircle, FiXCircle, FiTool, FiDollarSign } from 'react-icons/fi';

export default function StoreSettingsPage() {
  const [config, setConfig] = useState<StoreConfig>({
    currency: 'EGP',
    taxPercentage: 0,
    shippingFee: 0,
    minOrderAmount: 0,
    storeName: { ar: 'متجرنا', en: 'Our Store' },
    storeStatus: 'open'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const repo = new StoreRepository(db);

  useEffect(() => {
    repo.getStoreConfig().then(data => {
      if (data) setConfig(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await repo.saveStoreConfig(config);
      alert('تم حفظ إعدادات المتجر بنجاح!');
    } catch (e) {
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-gray-400 font-bold">جاري تحميل بيانات المتجر...</div>;

  return (
    <div className="p-8 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <span className="p-3 bg-purple-50 text-purple-600 rounded-2xl text-2xl"><FiShoppingBag /></span> بيانات المتجر الأساسية
          </h1>
          <p className="text-gray-500 mt-2 text-lg">تحكم في العملة، الضرائب، وحالة المتجر العامة</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-purple-100 disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* General Info */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-bold border-b pb-4 flex items-center gap-2"><FiHome className="text-purple-600" /> معلومات عامة</h2>
          
          <TranslatableField 
            label="اسم المتجر" 
            value={config.storeName as TranslatableString} 
            onChange={val => setConfig({ ...config, storeName: val })} 
            enableMultiLanguage={true}
          />

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">حالة المتجر</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'open', label: 'مفتوح', icon: <FiCheckCircle />, color: 'peer-checked:bg-green-500 peer-checked:border-green-500' },
                { id: 'closed', label: 'مغلق', icon: <FiXCircle />, color: 'peer-checked:bg-red-500 peer-checked:border-red-500' },
                { id: 'maintenance', label: 'صيانة', icon: <FiTool />, color: 'peer-checked:bg-amber-500 peer-checked:border-amber-500' },
              ].map(status => (
                <label key={status.id} className="cursor-pointer">
                  <input 
                    type="radio" 
                    name="status" 
                    className="sr-only peer" 
                    checked={config.storeStatus === status.id}
                    onChange={() => setConfig({ ...config, storeStatus: status.id as any })}
                  />
                  <div className={`p-4 border-2 rounded-2xl text-center transition-all bg-gray-50 border-gray-100 text-gray-400 font-bold peer-checked:text-white ${status.color}`}>
                    <span className="block text-xl mb-1">{status.icon}</span>
                    {status.label}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Financial Info */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-bold border-b pb-4 flex items-center gap-2"><FiDollarSign className="text-purple-600" /> الإعدادات المالية والخدمات</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">العملة الرومزية</label>
              <input 
                type="text" 
                className="w-full p-4 bg-gray-50 border rounded-2xl font-bold text-purple-600 focus:ring-2 focus:ring-purple-200 outline-none"
                value={config.currency}
                onChange={e => setConfig({ ...config, currency: e.target.value })}
                placeholder="EGP"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">نسبة الضريبة (%)</label>
              <input 
                type="number" 
                className="w-full p-4 bg-gray-50 border rounded-2xl font-bold focus:ring-2 focus:ring-purple-200 outline-none"
                value={config.taxPercentage}
                onChange={e => setConfig({ ...config, taxPercentage: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">رسوم الشحن الثابتة</label>
              <input 
                type="number" 
                className="w-full p-4 bg-gray-50 border rounded-2xl font-bold focus:ring-2 focus:ring-purple-200 outline-none"
                value={config.shippingFee}
                onChange={e => setConfig({ ...config, shippingFee: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الحد الأدنى للطلب</label>
              <input 
                type="number" 
                className="w-full p-4 bg-gray-50 border rounded-2xl font-bold focus:ring-2 focus:ring-purple-200 outline-none"
                value={config.minOrderAmount}
                onChange={e => setConfig({ ...config, minOrderAmount: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

