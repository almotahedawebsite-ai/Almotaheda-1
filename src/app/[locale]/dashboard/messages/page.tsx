'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { MessageRepository } from '@/infrastructure/repositories/MessageRepository';
import { ContactMessage } from '@/domain/types/message';
import { FiInbox, FiPhone, FiMail, FiTrash2 } from 'react-icons/fi';

export default function InboxPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const repo = new MessageRepository(db);

  const fetchMessages = async () => {
    setLoading(true);
    const data = await repo.getAllMessages();
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: string, currentlyRead: boolean) => {
    if (currentlyRead) return;
    await repo.markAsRead(id);
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة نهائياً؟')) return;
    await repo.deleteMessage(id);
    fetchMessages();
  };

  if (loading) return <div className="p-10 font-bold text-gray-500">جاري تحميل رسائل الزوار...</div>;

  return (
    <div className="animate-fade-in-up pb-20">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 border-b-4 border-indigo-600 inline-flex items-center gap-2 pb-2">صندوق الوارد <FiInbox className="text-indigo-600" /></h1>
          <p className="text-gray-500 mt-2 font-medium">متابعة رسائل واستفسارات العملاء من نموذج (تواصل معنا).</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl shadow-sm border border-gray-100 text-center">
          <span className="text-6xl mb-4 text-gray-300 flex justify-center"><FiInbox /></span>
          <h2 className="text-2xl font-bold text-gray-400">صندوق الوارد فارغ.</h2>
          <p className="text-gray-400 mt-2">لم يقم أحد بمراسلتك بعد.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              onClick={() => handleMarkAsRead(msg.id, msg.isRead)}
              className={`bg-white rounded-2xl border p-6 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md cursor-pointer ${msg.isRead ? 'border-gray-100 opacity-75' : 'border-indigo-300 shadow-sm'}`}
            >
              
              <div className="shrink-0 flex flex-col items-center justify-center gap-2">
                 <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white ${msg.isRead ? 'bg-gray-300' : 'bg-indigo-600'}`}>
                   {msg.name.substring(0, 1).toUpperCase()}
                 </div>
                 {!msg.isRead && <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">جديدة</span>}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className={`text-lg transition-colors ${msg.isRead ? 'font-bold text-gray-800' : 'font-black text-indigo-900'}`}>{msg.name}</h3>
                  <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
                    {new Date(msg.createdAt).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                
                <div className="flex gap-4 text-sm font-mono text-gray-500 mb-2">
                  {msg.phone && <span className="flex items-center gap-1"><FiPhone /> {msg.phone}</span>}
                  {msg.email && <span className="flex items-center gap-1"><FiMail /> {msg.email}</span>}
                </div>
                
                <div className={`p-4 rounded-xl mt-4 leading-relaxed ${msg.isRead ? 'bg-gray-50 text-gray-600' : 'bg-indigo-50 text-indigo-900 border border-indigo-100'}`}>
                  {msg.message}
                </div>
              </div>

              <div className="shrink-0 flex md:flex-col justify-center items-center gap-2">
                 <button onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }} className="w-10 h-10 rounded-full hover:bg-red-50 text-red-500 flex items-center justify-center text-lg" title="حذف الرسالة"><FiTrash2 /></button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
