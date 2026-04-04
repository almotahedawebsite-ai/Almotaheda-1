'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { ContractRepository } from '@/infrastructure/repositories/ContractRepository';
import { ServiceRepository } from '@/infrastructure/repositories/ServiceRepository';
import { Contract } from '@/domain/types/contract';
import { Service } from '@/domain/types/service';
import { tField } from '@/domain/types/settings';
import { FiCheckCircle, FiClock, FiXCircle, FiFileText, FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiArrowLeft } from 'react-icons/fi';

const statusLabels: Record<string, { label: React.ReactNode; color: string }> = {
  active: { label: <span className="flex items-center gap-1"><FiCheckCircle /> ساري</span>, color: 'bg-green-50 text-green-700' },
  expired: { label: <span className="flex items-center gap-1"><FiClock /> منتهي</span>, color: 'bg-gray-100 text-gray-600' },
  pending: { label: <span className="flex items-center gap-1"><FiClock /> قيد التفعيل</span>, color: 'bg-amber-50 text-amber-700' },
  cancelled: { label: <span className="flex items-center gap-1"><FiXCircle /> ملغي</span>, color: 'bg-red-50 text-red-700' },
};

export default function DashboardContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Contract> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');

  const contractRepo = new ContractRepository(db);
  const serviceRepo = new ServiceRepository(db);

  const fetchData = async () => {
    setLoading(true);
    const [contractsData, servicesData] = await Promise.all([
      contractRepo.getAll(),
      serviceRepo.getAll()
    ]);
    setContracts(contractsData);
    setServices(servicesData);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleNew = () => {
    setIsNew(true);
    setEditing({
      id: `contract-${Date.now()}`,
      clientName: '',
      clientPhone: '',
      serviceId: '',
      serviceName: '',
      startDate: '',
      endDate: '',
      status: 'pending',
      notes: '',
      value: '',
      createdAt: new Date().toISOString(),
    });
  };

  const handleEdit = (contract: Contract) => {
    setIsNew(false);
    setEditing({ ...contract });
  };

  const handleSave = async () => {
    if (!editing || !editing.id) return;
    setSaving(true);
    try {
      // Auto-fill service name
      if (editing.serviceId) {
        const svc = services.find(s => s.id === editing.serviceId);
        if (svc) editing.serviceName = tField(svc.name, 'ar') || '';
      }
      editing.updatedAt = new Date().toISOString();
      if (isNew) {
        await contractRepo.create(editing.id, editing as Contract);
      } else {
        await contractRepo.update(editing.id, editing);
      }
      setEditing(null);
      await fetchData();
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العقد؟')) return;
    await contractRepo.delete(id);
    await fetchData();
  };

  const filteredContracts = filter === 'all' ? contracts : contracts.filter(c => c.status === filter);

  // Calculate days remaining
  const daysRemaining = (endDate: string) => {
    if (!endDate) return null;
    const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) return <div className="p-10 font-bold text-gray-400 text-center">جاري تحميل التعاقدات...</div>;

  return (
    <>
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><FiFileText className="text-brand-teal" /> إدارة التعاقدات</h1>
            <p className="text-gray-500 mt-1">إدارة عقود الصيانة والنظافة مع العملاء</p>
          </div>
          <button onClick={handleNew} className="bg-brand-teal hover:bg-brand-navy text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
            <FiPlus /> عقد جديد
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'إجمالي العقود', count: contracts.length, icon: <FiFileText />, color: 'bg-blue-50 text-blue-700' },
            { label: 'عقود سارية', count: contracts.filter(c => c.status === 'active').length, icon: <FiCheckCircle />, color: 'bg-green-50 text-green-700' },
            { label: 'قيد التفعيل', count: contracts.filter(c => c.status === 'pending').length, icon: <FiClock />, color: 'bg-amber-50 text-amber-700' },
            { label: 'عقود منتهية', count: contracts.filter(c => c.status === 'expired').length, icon: <FiClock />, color: 'bg-gray-100 text-gray-600' },
          ].map((card, idx) => (
            <div key={idx} className={`${card.color} p-4 rounded-2xl`}>
              <span className="text-2xl">{card.icon}</span>
              <p className="text-2xl font-black mt-2">{card.count}</p>
              <p className="text-xs font-bold opacity-70">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'active', 'pending', 'expired', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === f ? 'bg-brand-teal text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'الكل' : (statusLabels[f]?.label || f)}
            </button>
          ))}
        </div>

        {/* Contracts Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">العميل</th>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">الخدمة</th>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">المدة</th>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">القيمة</th>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">الحالة</th>
                  <th className="text-right px-4 py-4 text-xs font-black text-gray-500">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredContracts.map(contract => {
                  const remaining = daysRemaining(contract.endDate);
                  return (
                    <tr key={contract.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-bold text-gray-900 text-sm">{contract.clientName}</p>
                        <p className="text-gray-400 text-xs" dir="ltr">{contract.clientPhone}</p>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-brand-teal">{contract.serviceName}</td>
                      <td className="px-4 py-4">
                        <p className="text-xs text-gray-500">{contract.startDate || '—'}</p>
                        <p className="text-xs text-gray-500">إلى {contract.endDate || '—'}</p>
                        {remaining !== null && contract.status === 'active' && (
                          <span className={`text-xs font-bold ${remaining <= 30 ? 'text-red-500' : remaining <= 90 ? 'text-amber-500' : 'text-green-500'}`}>
                            {remaining > 0 ? `متبقي ${remaining} يوم` : 'منتهي'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 font-bold text-sm text-gray-900">{contract.value || '—'}</td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusLabels[contract.status]?.color}`}>
                          {statusLabels[contract.status]?.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(contract)} className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center"><FiEdit2 /></button>
                          <button onClick={() => handleDelete(contract.id)} className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center"><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredContracts.length === 0 && (
            <div className="text-center py-16">
              <span className="text-5xl mb-4 block text-gray-300 flex justify-center"><FiFileText /></span>
              <p className="text-gray-400 font-bold">لا توجد تعاقدات {filter !== 'all' ? 'بهذه الحالة ' : ''}حالياً</p>
              <button onClick={handleNew} className="mt-4 text-brand-teal font-bold hover:underline"><span className="flex items-center gap-1">أضف عقد جديد <FiArrowLeft /></span></button>
            </div>
          )}
        </div>
      </div>

      {/* Premium Edit Drawer */}
      {editing && (
        <div className="fixed inset-y-0 left-0 right-0 z-[100] flex justify-end">
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={() => setEditing(null)} />
          
          <div className="relative w-full max-w-md md:max-w-lg bg-white h-full shadow-2xl flex flex-col border-r border-gray-100 animate-slide-in-left">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white shrink-0">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">{isNew ? <><FiPlus className="text-brand-teal" /> عقد جديد</> : <><FiEdit2 className="text-brand-teal" /> تعديل العقد</>}</h2>
              <button onClick={() => setEditing(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors font-bold"><FiX /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1.5">اسم العميل *</label>
                  <input type="text" value={editing.clientName || ''} onChange={(e) => setEditing({ ...editing, clientName: e.target.value })} className="w-full border-none shadow-inner rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-teal outline-none" placeholder="اسم العميل أو الشركة" />
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1.5">رقم التواصل</label>
                  <input type="text" value={editing.clientPhone || ''} onChange={(e) => setEditing({ ...editing, clientPhone: e.target.value })} className="w-full border-none shadow-inner rounded-xl px-4 py-3 text-sm" dir="ltr" placeholder="+20..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-1.5">الخدمة *</label>
                <select
                  value={editing.serviceId || ''}
                  onChange={(e) => setEditing({ ...editing, serviceId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
                >
                  <option value="">— اختر الخدمة —</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{tField(s.name, 'ar')}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <label className="block text-xs font-black text-gray-700 mb-1.5">تاريخ البداية</label>
                  <input type="date" value={editing.startDate || ''} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} className="w-full border-none shadow-inner rounded-lg px-3 py-2 text-sm" />
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <label className="block text-xs font-black text-gray-700 mb-1.5">تاريخ الانتهاء</label>
                  <input type="date" value={editing.endDate || ''} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} className="w-full border-none shadow-inner rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1.5">قيمة العقد</label>
                  <input type="text" value={editing.value || ''} onChange={(e) => setEditing({ ...editing, value: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-teal outline-none" placeholder="مثال: 50,000 ج.م" />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1.5">الحالة</label>
                  <select
                    value={editing.status || 'pending'}
                    onChange={(e) => setEditing({ ...editing, status: e.target.value as any })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
                  >
                    <option value="pending">قيد التفعيل</option>
                    <option value="active">ساري</option>
                    <option value="expired">منتهي</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-1.5">ملاحظات إضافية</label>
                <textarea value={editing.notes || ''} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-teal outline-none" rows={3} placeholder="أي ملاحظات إضافية بخصوص العقد..." />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white shrink-0">
               <button onClick={handleSave} disabled={saving} className="w-full bg-brand-teal hover:bg-brand-navy text-white py-4 rounded-xl font-black transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                 {saving ? 'جاري الحفظ...' : <><FiSave /> حفظ بيانات العقد</>}
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
