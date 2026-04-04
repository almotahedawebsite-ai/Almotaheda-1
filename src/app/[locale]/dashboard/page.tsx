'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { collection, getCountFromServer } from 'firebase/firestore';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiSmile, FiLayers, FiStar, FiMap, FiList, FiCreditCard, FiFileText, FiInbox, FiUsers, FiBarChart2, FiZap, FiPenTool, FiSettings, FiArrowLeft } from 'react-icons/fi';

export default function DashboardHome() {
  const params = useParams();
  const currentLocale = params?.locale as string || 'ar';

  const [stats, setStats] = useState({
    services: 0,
    keyClients: 0,
    branches: 0,
    bookings: 0,
    payments: 0,
    contracts: 0,
    messages: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [svcSnap, cliSnap, brSnap, bookSnap, paySnap, contSnap, msgSnap, admSnap] = await Promise.all([
          getCountFromServer(collection(db, 'services')),
          getCountFromServer(collection(db, 'key_clients')),
          getCountFromServer(collection(db, 'branches')),
          getCountFromServer(collection(db, 'bookings')),
          getCountFromServer(collection(db, 'payments')),
          getCountFromServer(collection(db, 'contracts')),
          getCountFromServer(collection(db, 'messages')),
          getCountFromServer(collection(db, 'admins')),
        ]);

        setStats({
          services: svcSnap.data().count,
          keyClients: cliSnap.data().count,
          branches: brSnap.data().count,
          bookings: bookSnap.data().count,
          payments: paySnap.data().count,
          contracts: contSnap.data().count,
          messages: msgSnap.data().count,
          admins: admSnap.data().count + 1,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'الخدمات', icon: <FiLayers />, count: stats.services, link: `/${currentLocale}/dashboard/services`, color: 'bg-brand-teal' },
    { title: 'أهم العملاء', icon: <FiStar />, count: stats.keyClients, link: `/${currentLocale}/dashboard/key-clients`, color: 'bg-amber-500' },
    { title: 'الفروع', icon: <FiMap />, count: stats.branches, link: `/${currentLocale}/dashboard/branches`, color: 'bg-indigo-500' },
    { title: 'الحجوزات', icon: <FiList />, count: stats.bookings, link: `/${currentLocale}/dashboard/bookings`, color: 'bg-green-500' },
    { title: 'المدفوعات', icon: <FiCreditCard />, count: stats.payments, link: `/${currentLocale}/dashboard/payments`, color: 'bg-purple-500' },
    { title: 'التعاقدات', icon: <FiFileText />, count: stats.contracts, link: `/${currentLocale}/dashboard/contracts`, color: 'bg-orange-500' },
    { title: 'الرسائل', icon: <FiInbox />, count: stats.messages, link: `/${currentLocale}/dashboard/messages`, color: 'bg-rose-500' },
    { title: 'المشرفون', icon: <FiUsers />, count: stats.admins, link: `/${currentLocale}/dashboard/users`, color: 'bg-slate-600' },
  ];

  if (loading) return <div className="p-10 font-bold text-gray-400">جاري تحميل إحصائيات النظام...</div>;

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">مرحباً بك في لوحة التحكم <FiSmile className="text-brand-teal" /></h1>
          <p className="text-gray-500 mt-2 text-lg">نظرة عامة على نشاط شركة المتحدة</p>
        </div>
        <div className="hidden md:block">
          <span className="text-6xl text-gray-200 opacity-20"><FiBarChart2 /></span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <Link
            key={idx}
            href={card.link}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`${card.color} text-white p-2.5 rounded-xl text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <p className="text-2xl font-black text-gray-900">{card.count}</p>
            </div>
            <h3 className="font-bold text-gray-500 text-sm">{card.title}</h3>
            <div className="mt-3 flex items-center text-xs font-bold text-brand-teal group-hover:gap-2 transition-all opacity-0 group-hover:opacity-100">
              <span className="flex items-center gap-1">إدارة القسم <FiArrowLeft /></span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-brand-navy to-brand-dark text-white p-8 rounded-3xl shadow-xl overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">إدارة خدمات المتحدة <FiLayers /></h2>
            <p className="text-white/50 leading-relaxed max-w-sm mb-6">
              أضف خدمات جديدة، حدّث الأوصاف والصور، وتأكد من أن موقعك يعرض أحدث المعلومات لعملائك.
            </p>
            <Link href={`/${currentLocale}/dashboard/services`} className="bg-brand-teal text-white px-6 py-3 rounded-xl font-bold inline-block hover:opacity-90 transition-opacity">
              إدارة الخدمات
            </Link>
          </div>
          <div className="absolute -bottom-10 -right-10 text-[10rem] opacity-10 pointer-events-none"><FiLayers /></div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FiZap className="text-brand-teal" /> روابط الوصول السريع
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href={`/${currentLocale}/dashboard/services`} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-brand-teal/5 hover:border-brand-teal/20 transition-all font-bold text-gray-600 text-sm">
              <FiLayers className="text-brand-teal text-xl" /> إدارة الخدمات
            </Link>
            <Link href={`/${currentLocale}/dashboard/bookings`} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-brand-teal/5 hover:border-brand-teal/20 transition-all font-bold text-gray-600 text-sm">
              <FiList className="text-brand-teal text-xl" /> الحجوزات
            </Link>
            <Link href={`/${currentLocale}/dashboard/payments`} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-brand-teal/5 hover:border-brand-teal/20 transition-all font-bold text-gray-600 text-sm">
              <FiCreditCard className="text-brand-teal text-xl" /> المدفوعات
            </Link>
            <Link href={`/${currentLocale}/dashboard/key-clients`} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-brand-teal/5 hover:border-brand-teal/20 transition-all font-bold text-gray-600 text-sm">
              <FiStar className="text-amber-500 text-xl" /> أهم العملاء
            </Link>
            <Link href={`/${currentLocale}/dashboard/brand`} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-brand-teal/5 hover:border-brand-teal/20 transition-all font-bold text-gray-600 text-sm">
              <FiPenTool className="text-purple-500 text-xl" /> الهوية البصرية
            </Link>
            <Link href={`/${currentLocale}/dashboard/preferences`} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-brand-teal/5 hover:border-brand-teal/20 transition-all font-bold text-gray-600 text-sm">
              <FiSettings className="text-slate-500 text-xl" /> الإعدادات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
