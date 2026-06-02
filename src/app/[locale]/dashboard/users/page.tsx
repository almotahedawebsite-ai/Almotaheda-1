'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { doc, getDocs, collection, deleteDoc, setDoc, query, orderBy } from 'firebase/firestore';
import { getSuperAdminEmails } from '@/app/actions/auth';
import {
  FiUsers, FiUser, FiTrash2, FiPlus,
  FiShield, FiAward, FiSearch, FiRefreshCw,
  FiMail, FiCalendar, FiClock, FiAlertCircle,
  FiCheck, FiX
} from 'react-icons/fi';

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

type Tab = 'admins' | 'clients';

type ToastType = 'success' | 'error';
interface Toast {
  message: string;
  type: ToastType;
}

export default function UsersManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [superAdminEmails, setSuperAdminEmails] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('admins');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<Toast | null>(null);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = useCallback(async () => {
    setLoading(true);

    // Fetch super admin emails securely from server action
    const rootAdmins = await getSuperAdminEmails();
    setSuperAdminEmails(rootAdmins);

    // Load admins from Firestore
    const adminsSnap = await getDocs(collection(db, 'admins'));
    const firestoreAdmins = adminsSnap.docs.map(d => ({
      ...d.data(),
      email: d.data().email || d.id,
    } as AdminUser));

    // Build unique admin map — super admins pinned at top
    const uniqueAdmins = new Map<string, AdminUser>();
    for (const email of rootAdmins) {
      uniqueAdmins.set(email, { email, addedAt: 'مدير النظام الأساسي', addedBy: 'system' });
    }
    for (const admin of firestoreAdmins) {
      if (!rootAdmins.includes(admin.email.toLowerCase())) {
        uniqueAdmins.set(admin.email, admin);
      }
    }

    setAdmins(Array.from(uniqueAdmins.values()));

    // Load clients
    try {
      const clientsSnap = await getDocs(query(collection(db, 'clients'), orderBy('lastLogin', 'desc')));
      setClients(clientsSnap.docs.map(d => d.data() as ClientUser));
    } catch {
      setClients([]);
    }

    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAddAdmin = async () => {
    const email = newAdminEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      showToast('أدخل بريد إلكتروني صحيح', 'error');
      return;
    }
    if (superAdminEmails.includes(email)) {
      showToast('هذا الإيميل مدير نظام أساسي بالفعل', 'error');
      return;
    }
    if (admins.some(a => a.email === email)) {
      showToast('هذا المشرف مضاف مسبقاً', 'error');
      return;
    }

    setAdding(true);
    try {
      await setDoc(doc(db, 'admins', email), {
        email,
        addedAt: new Date().toISOString(),
        addedBy: superAdminEmails[0] || 'system',
      });
      setNewAdminEmail('');
      await loadData();
      showToast(`تم إضافة ${email} كمشرف بنجاح ✓`);
    } catch {
      showToast('حدث خطأ أثناء الإضافة. تأكد من صلاحياتك.', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (superAdminEmails.includes(email.toLowerCase())) {
      showToast('لا يمكن حذف مدير النظام الأساسي', 'error');
      return;
    }
    setDeletingEmail(email);
    try {
      await deleteDoc(doc(db, 'admins', email));
      await loadData();
      showToast(`تم حذف ${email} من قائمة المشرفين`);
    } catch {
      showToast('حدث خطأ أثناء الحذف', 'error');
    } finally {
      setDeletingEmail(null);
    }
  };

  const handleRemoveClient = async (uid: string, name: string) => {
    setDeletingEmail(uid);
    try {
      await deleteDoc(doc(db, 'clients', uid));
      await loadData();
      showToast(`تم حذف بيانات ${name || 'العميل'}`);
    } catch {
      showToast('حدث خطأ أثناء الحذف', 'error');
    } finally {
      setDeletingEmail(null);
    }
  };

  const filteredAdmins = admins.filter(a =>
    a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredClients = clients.filter(c =>
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSuperAdmin = (email: string) => superAdminEmails.includes(email.toLowerCase());

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 font-medium">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up" dir="rtl">

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm transition-all ${toast.type === 'success'
            ? 'bg-emerald-600 text-white'
            : 'bg-red-600 text-white'
          }`}>
          {toast.type === 'success' ? <FiCheck className="text-lg" /> : <FiX className="text-lg" />}
          {toast.message}
        </div>
      )}

      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl backdrop-blur-sm shrink-0">
            <FiUsers />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black">إدارة المستخدمين</h1>
            <p className="text-slate-400 mt-1 text-sm">التحكم في مشرفي لوحة التحكم وعرض عملاء الموقع</p>
          </div>
          <div className="flex items-center gap-4 text-center">
            <div className="bg-white/10 rounded-xl px-4 py-3 border border-white/10">
              <p className="text-2xl font-black">{admins.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">مشرف</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-3 border border-white/10">
              <p className="text-2xl font-black">{clients.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">عميل</p>
            </div>
            <button
              onClick={loadData}
              title="تحديث البيانات"
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10"
            >
              <FiRefreshCw className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
        <button
          onClick={() => setActiveTab('admins')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'admins'
              ? 'bg-slate-800 text-white shadow-lg'
              : 'text-gray-500 hover:bg-gray-50'
            }`}
        >
          <FiShield />
          <span>المشرفون ({admins.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('clients')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'clients'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-gray-500 hover:bg-gray-50'
            }`}
        >
          <FiUser />
          <span>عملاء الموقع ({clients.length})</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400" />
        <input
          className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pr-11 pl-5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm text-gray-700 shadow-sm"
          placeholder={activeTab === 'admins' ? 'ابحث عن مشرف بالبريد الإلكتروني...' : 'ابحث عن عميل بالاسم أو البريد...'}
          value={searchQuery}
          dir="rtl"
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 hover:text-gray-600">
            <FiX />
          </button>
        )}
      </div>

      {/* ===== ADMINS TAB ===== */}
      {activeTab === 'admins' && (
        <div className="space-y-5">

          {/* Add Admin Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiPlus className="text-primary" /> إضافة مشرف جديد
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <FiMail className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 text-sm" />
                <input
                  className="w-full pr-10 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono text-sm"
                  placeholder="البريد الإلكتروني للمشرف الجديد..."
                  value={newAdminEmail}
                  dir="ltr"
                  onChange={e => setNewAdminEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddAdmin()}
                />
              </div>
              <button
                onClick={handleAddAdmin}
                disabled={adding || !newAdminEmail.trim()}
                className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3.5 rounded-xl transition-all shrink-0 flex items-center gap-2 shadow-lg"
              >
                {adding ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> جاري الإضافة...</>
                ) : (
                  <><FiPlus /> إضافة مشرف</>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
              <FiAlertCircle className="shrink-0" />
              المشرف المضاف سيتمكن من الوصول لكامل لوحة التحكم عند تسجيل دخوله بجوجل
            </p>
          </div>

          {/* Admins List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">قائمة المشرفين</h3>
              <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border">
                {filteredAdmins.length} {filteredAdmins.length === 1 ? 'مشرف' : 'مشرفين'}
              </span>
            </div>

            {filteredAdmins.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <FiUsers className="text-4xl mx-auto mb-3 opacity-30" />
                <p className="font-medium">لا توجد نتائج مطابقة</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredAdmins.map(admin => (
                  <div
                    key={admin.email}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors group"
                  >
                    {/* Avatar */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black shrink-0 ${isSuperAdmin(admin.email)
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                        : 'bg-slate-100 text-slate-600'
                      }`}>
                      {isSuperAdmin(admin.email) ? <FiAward /> : <FiShield />}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-gray-800 text-sm truncate">{admin.email}</span>
                        {isSuperAdmin(admin.email) && (
                          <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wide shrink-0">
                            Super Admin
                          </span>
                        )}
                        {!isSuperAdmin(admin.email) && (
                          <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0">
                            مشرف
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <FiCalendar className="shrink-0" />
                        {admin.addedAt === 'مدير النظام الأساسي'
                          ? 'مدير النظام الأساسي'
                          : `أُضيف في ${new Date(admin.addedAt).toLocaleDateString('ar-EG')}`
                        }
                      </div>
                    </div>

                    {/* Delete Button */}
                    {!isSuperAdmin(admin.email) && (
                      <button
                        onClick={() => handleRemoveAdmin(admin.email)}
                        disabled={deletingEmail === admin.email}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border border-transparent hover:border-red-200 disabled:opacity-50"
                      >
                        {deletingEmail === admin.email
                          ? <div className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                          : <FiTrash2 />
                        }
                        حذف
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== CLIENTS TAB ===== */}
      {activeTab === 'clients' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">عملاء الموقع المسجلون</h3>
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border">
              {filteredClients.length} عميل
            </span>
          </div>

          {filteredClients.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <FiUsers className="text-5xl mx-auto mb-4 opacity-20" />
              <p className="font-bold text-gray-500 mb-1">
                {searchQuery ? 'لا توجد نتائج مطابقة' : 'لا يوجد عملاء مسجلون بعد'}
              </p>
              <p className="text-sm">
                {!searchQuery && 'سيظهر العملاء هنا بعد تسجيل دخولهم للموقع'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredClients.map(client => (
                <div
                  key={client.uid}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors group"
                >
                  {/* Avatar */}
                  {client.photoURL ? (
                    <img
                      src={client.photoURL}
                      className="w-11 h-11 rounded-xl object-cover border border-gray-100 shadow-sm shrink-0"
                      alt={client.displayName}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
                      {(client.displayName || 'C').charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate">{client.displayName || 'مستخدم'}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <FiMail className="shrink-0" />
                      <span className="font-mono truncate">{client.email}</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="hidden sm:flex flex-col items-end gap-1 text-xs text-gray-400 shrink-0">
                    {client.lastLogin && (
                      <span className="flex items-center gap-1">
                        <FiClock className="shrink-0" />
                        {new Date(client.lastLogin).toLocaleDateString('ar-EG')}
                      </span>
                    )}
                    {client.createdAt && (
                      <span className="flex items-center gap-1">
                        <FiCalendar className="shrink-0" />
                        {new Date(client.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    )}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleRemoveClient(client.uid, client.displayName)}
                    disabled={deletingEmail === client.uid}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border border-transparent hover:border-red-200 disabled:opacity-50 shrink-0"
                  >
                    {deletingEmail === client.uid
                      ? <div className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                      : <FiTrash2 />
                    }
                    حذف
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
