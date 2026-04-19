'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { doc, getDocs, collection, deleteDoc, setDoc, query, orderBy } from 'firebase/firestore';
import { FiUsers, FiLock, FiChevronDown, FiUser, FiTrash2, FiPlus } from 'react-icons/fi';
import { getSuperAdminEmail } from '@/app/actions/auth';

interface AdminUser {
  email: string;
  addedAt: string;
  addedBy?: string;
}

interface ClientUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  lastLogin: string;
  createdAt: string;
}

export default function UsersManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [superAdminEmail, setSuperAdminEmail] = useState('');

  const loadData = async () => {
    setLoading(true);
    
    // Securely fetch super admin email
    const rootAdmin = await getSuperAdminEmail();
    setSuperAdminEmail(rootAdmin);

    // Load admins
    const adminsSnap = await getDocs(collection(db, 'admins'));
    
    // Fallback to doc id if email is missing to prevent undefined errors
    const firestoreAdmins = adminsSnap.docs.map(d => ({
      ...d.data(),
      email: d.data().email || d.id,
    } as AdminUser));

    // Ensure super admin is strictly top and strictly unique
    const uniqueAdmins = new Map<string, AdminUser>();
    if (rootAdmin) {
      uniqueAdmins.set(rootAdmin, { email: rootAdmin, addedAt: 'مدير النظام الأساسي', addedBy: 'system' });
    }
    
    firestoreAdmins.forEach(admin => {
        if (admin.email !== rootAdmin) {

            uniqueAdmins.set(admin.email, admin);
        }
    });

    setAdmins(Array.from(uniqueAdmins.values()));

    // Load clients
    try {
      const clientsSnap = await getDocs(query(collection(db, 'clients'), orderBy('lastLogin', 'desc')));
      setClients(clientsSnap.docs.map(d => d.data() as ClientUser));
    } catch {
      setClients([]);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleAddAdmin = async () => {
    const email = newAdminEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) return alert('أدخل بريد إلكتروني صحيح');
    if (email === superAdminEmail) return alert('هذا هو الأدمن الرئيسي بالفعل');

    setAdding(true);
    try {
      await setDoc(doc(db, 'admins', email), {
        email,
        addedAt: new Date().toISOString(),
        addedBy: superAdminEmail,
      });
      setNewAdminEmail('');
      await loadData();
      alert('تم إضافة المشرف بنجاح');
    } catch (e) {
      alert('حدث خطأ أثناء الإضافة');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (email === superAdminEmail) return alert('لا يمكن حذف الأدمن الرئيسي');
    if (!confirm(`هل أنت متأكد من حذف ${email}؟`)) return;
    await deleteDoc(doc(db, 'admins', email));
    await loadData();
  };

  const handleRemoveClient = async (uid: string) => {
    if (!confirm('هل تريد حذف بيانات هذا العميل؟')) return;
    await deleteDoc(doc(db, 'clients', uid));
    await loadData();
  };

  if (loading) return <div className="p-10 text-gray-500">جاري التحميل...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in-up">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3"><FiUsers className="text-brand-teal" /> إدارة المستخدمين</h1>
        <p className="text-gray-500 mt-1">التحكم في المشرفين الذين يصلون للداشبورد وعرض عملاء الموقع.</p>
      </div>

      {/* ===== ADMINS SECTION ===== */}
      <details className="group bg-white rounded-2xl shadow-sm border border-gray-100" open>
        <summary className="p-6 text-xl font-bold text-primary cursor-pointer list-none flex justify-between items-center border-b group-open:mb-0 outline-none select-none">
          <span className="flex items-center gap-2"><FiLock className="text-primary" /> مشرفو لوحة التحكم ({admins.length})</span>
          <span className="transition duration-300 group-open:-rotate-180 bg-gray-50 text-gray-400 p-1.5 rounded-lg text-sm"><FiChevronDown /></span>
        </summary>
        <div className="p-6 space-y-4">
          {/* Add Admin Form */}
          <div className="flex gap-3">
            <input
              className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              placeholder="أدخل البريد الإلكتروني للمشرف الجديد..."
              value={newAdminEmail}
              dir="ltr"
              onChange={e => setNewAdminEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddAdmin()}
            />
            <button
              onClick={handleAddAdmin}
              disabled={adding}
              className="bg-primary hover:opacity-90 text-white font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 shrink-0"
            >
              {adding ? '...' : <div className="flex items-center gap-1"><FiPlus /> إضافة مشرف</div>}
            </button>
          </div>

          {/* Admins Table */}
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right p-3 font-bold text-gray-600">البريد الإلكتروني</th>
                  <th className="text-right p-3 font-bold text-gray-600">تاريخ الإضافة</th>
                  <th className="text-right p-3 font-bold text-gray-600">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(admin => (
                  <tr key={admin.email} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-mono text-gray-800 flex items-center gap-2">
                      {admin.email === superAdminEmail && (
                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded font-bold">Root</span>
                      )}
                      {admin.email}
                    </td>
                    <td className="p-3 text-gray-500 text-xs">
                      {admin.addedAt === 'مدير النظام الأساسي'
                        ? 'مدير النظام الأساسي'
                        : new Date(admin.addedAt).toLocaleDateString('ar-EG')
                      }
                    </td>
                    <td className="p-3">
                      {admin.email !== superAdminEmail && (
                        <button
                          onClick={() => handleRemoveAdmin(admin.email)}
                          className="text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                        >
                          <FiTrash2 /> حذف
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </details>

      {/* ===== CLIENTS SECTION ===== */}
      <details className="group bg-white rounded-2xl shadow-sm border border-gray-100" open>
        <summary className="p-6 text-xl font-bold text-green-700 cursor-pointer list-none flex justify-between items-center border-b group-open:mb-0 outline-none select-none">
          <span className="flex items-center gap-2"><FiUser /> عملاء الموقع ({clients.length})</span>
          <span className="transition duration-300 group-open:-rotate-180 bg-gray-50 text-gray-400 p-1.5 rounded-lg text-sm"><FiChevronDown /></span>
        </summary>
        <div className="p-6">
          {clients.length === 0 ? (
            <p className="text-center text-gray-400 py-8">لا يوجد عملاء مسجلون بعد. سيظهرون هنا بعد تسجيل دخول أول عميل من الموقع.</p>
          ) : (
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-right p-3 font-bold text-gray-600">العميل</th>
                    <th className="text-right p-3 font-bold text-gray-600">البريد الإلكتروني</th>
                    <th className="text-right p-3 font-bold text-gray-600">آخر دخول</th>
                    <th className="text-right p-3 font-bold text-gray-600">تاريخ التسجيل</th>
                    <th className="text-right p-3 font-bold text-gray-600">إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    <tr key={client.uid} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {client.photoURL ? (
                            <img src={client.photoURL} className="w-8 h-8 rounded-full" alt={client.displayName} referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">
                              {(client.displayName || 'C')[0]}
                            </div>
                          )}
                          <span className="font-medium text-gray-900">{client.displayName || 'مستخدم'}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-gray-500 text-xs">{client.email}</td>
                      <td className="p-3 text-gray-500 text-xs">{client.lastLogin ? new Date(client.lastLogin).toLocaleDateString('ar-EG') : '—'}</td>
                      <td className="p-3 text-gray-500 text-xs">{client.createdAt ? new Date(client.createdAt).toLocaleDateString('ar-EG') : '—'}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleRemoveClient(client.uid)}
                          className="text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                        >
                          <FiTrash2 /> حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
