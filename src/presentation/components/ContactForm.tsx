'use client';

import React, { useState } from 'react';
import { db } from '@/infrastructure/firebase/config';
import { MessageRepository } from '@/infrastructure/repositories/MessageRepository';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      alert('يرجى ملء الاسم والرسالة كحد أدنى');
      return;
    }

    setStatus('LOADING');
    try {
      const repo = new MessageRepository(db);
      await repo.saveMessage(formData);
      setStatus('SUCCESS');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus('ERROR');
    }
  };

  if (status === 'SUCCESS') {
    return (
      <div className="p-10 text-center flex-1 flex flex-col justify-center items-center h-full">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-4">✓</div>
        <h3 className="text-2xl font-bold mb-2">تم الإرسال بنجاح!</h3>
        <p className="text-gray-500 mb-8">شكرًا لتواصلك معنا، سنقوم بالرد عليك في أقرب وقت.</p>
        <button onClick={() => setStatus('IDLE')} className="text-blue-600 font-bold hover:underline">إرسال رسالة أخرى</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-10 flex-1 flex flex-col justify-center">
      <h3 className="text-2xl font-bold mb-2 text-center">أرسل لنا رسالة مباشرة</h3>
      <p className="text-gray-500 mb-8 text-center text-sm">سيتم استلام رسالتك فوراً في لوحة التحكم الخاصة بنا.</p>
      
      <input 
        required
        value={formData.name}
        onChange={e => setFormData({...formData, name: e.target.value})}
        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-[var(--primary)] outline-none" 
        placeholder="الاسم الكريم *" 
      />
      
      <div className="flex gap-4 mb-4">
        <input 
          type="email"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          className="w-1/2 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" 
          placeholder="البريد الإلكتروني" 
        />
        <input 
          value={formData.phone}
          onChange={e => setFormData({...formData, phone: e.target.value})}
          className="w-1/2 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none" 
          placeholder="رقم الهاتف" 
        />
      </div>
      
      <textarea 
        required
        value={formData.message}
        onChange={e => setFormData({...formData, message: e.target.value})}
        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl mb-6 h-32 focus:ring-2 focus:ring-[var(--primary)] outline-none" 
        placeholder="اكتب رسالتك أو استفسارك هنا... *" 
      />
      
      <button 
        type="submit" 
        disabled={status === 'LOADING'}
        className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {status === 'LOADING' ? 'جاري الإرسال...' : 'إرسال الرسالة الآن'}
      </button>
    </form>
  );
}
