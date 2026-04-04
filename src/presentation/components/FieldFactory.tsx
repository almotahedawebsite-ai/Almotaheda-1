import React from 'react';
import { tField, TranslatableString } from '@/domain/types/settings';

interface FieldProps {
  type: string;
  label: string;
  value: string | TranslatableString;
  locale?: string;
}

export const FieldFactory = ({ type, label, value, locale = 'ar' }: FieldProps) => {
  const displayValue = (typeof value === 'object') ? tField(value as TranslatableString, locale) : value;

  switch (type) {
    case 'text':
    case 'textarea':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500">{label}</label>
          <p className="text-lg text-gray-900 whitespace-pre-line leading-relaxed">{displayValue}</p>
        </div>
      );
    case 'number':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500">{label}</label>
          <p className="text-lg font-mono text-blue-600">{displayValue}</p>
        </div>
      );
    case 'image':
      return (
        <div className="mb-6 col-span-full">
          <label className="block text-sm font-medium text-gray-500 mb-2">{label}</label>
          {displayValue && <img src={displayValue} alt={label} className="w-full h-auto rounded-xl shadow-sm max-h-96 object-cover" />}
        </div>
      );
    default:
      return null;
  }
};

