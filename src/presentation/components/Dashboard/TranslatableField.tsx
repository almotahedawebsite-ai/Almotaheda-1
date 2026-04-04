'use client';

import React from 'react';
import { TranslatableString } from '@/domain/types/settings';
import { FiType, FiGlobe } from 'react-icons/fi';

interface TranslatableFieldProps {
  label: string;
  value: TranslatableString | undefined;
  onChange: (newValue: TranslatableString) => void;
  enableMultiLanguage: boolean;
  isTextArea?: boolean;
  placeholder?: string;
}

export const TranslatableField = ({
  label,
  value,
  onChange,
  enableMultiLanguage,
  isTextArea = false,
  placeholder = ''
}: TranslatableFieldProps) => {
  
  // Normalize internal state mapping to {ar, en} uniformly regardless of input type
  const arVal = typeof value === 'string' ? value : (value?.ar || '');
  const enVal = typeof value === 'string' ? '' : (value?.en || '');

  const handleChange = (lang: 'ar' | 'en', text: string) => {
    if (enableMultiLanguage) {
      onChange({ ar: lang === 'ar' ? text : arVal, en: lang === 'en' ? text : enVal });
    } else {
      onChange(text); // Save as raw string if lang is disabled to keep db clean
    }
  };

  const inputClasses = "w-full p-4 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400";
  const textAreaClasses = "w-full min-h-[150px] p-4 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed placeholder-gray-400";

  if (!enableMultiLanguage) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
        {isTextArea ? (
          <textarea 
            className={textAreaClasses} 
            value={arVal} 
            onChange={(e) => handleChange('ar', e.target.value)} 
            placeholder={placeholder}
          />
        ) : (
          <input 
            className={inputClasses} 
            value={arVal} 
            onChange={(e) => handleChange('ar', e.target.value)} 
            placeholder={placeholder}
          />
        )}
      </div>
    );
  }

  return (
    <div className="mb-6 border-l-4 border-blue-500 pl-4 py-2 opacity-95">
      <label className="block text-sm font-black text-gray-800 mb-4">{label} <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded ml-2">مترجم</span></label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Arabic Field */}
        <div>
          <span className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><FiType /> العربية (AR)</span>
          {isTextArea ? (
            <textarea 
              className={textAreaClasses} 
              value={arVal} 
              dir="rtl"
              onChange={(e) => handleChange('ar', e.target.value)} 
              placeholder={placeholder}
            />
          ) : (
            <input 
              className={inputClasses} 
              value={arVal} 
              dir="rtl"
              onChange={(e) => handleChange('ar', e.target.value)} 
              placeholder={placeholder}
            />
          )}
        </div>
        {/* English Field */}
        <div>
          <span className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><FiGlobe /> English (EN)</span>
          {isTextArea ? (
            <textarea 
               className={textAreaClasses} 
               value={enVal} 
               dir="ltr"
               onChange={(e) => handleChange('en', e.target.value)} 
               placeholder={placeholder + " (English)"}
             />
          ) : (
             <input 
               className={inputClasses} 
               value={enVal} 
               dir="ltr"
               onChange={(e) => handleChange('en', e.target.value)} 
               placeholder={placeholder + " (English)"}
             />
          )}
        </div>
      </div>
    </div>
  );
};
