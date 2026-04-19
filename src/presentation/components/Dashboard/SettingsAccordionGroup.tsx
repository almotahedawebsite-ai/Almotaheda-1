import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export interface SettingsAccordionGroupProps {
  id?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function SettingsAccordionGroup({
  id,
  title,
  description,
  icon,
  children,
  defaultOpen = true,
}: SettingsAccordionGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      id={id ? `settings-group-${id}` : undefined}
      className={`bg-white rounded-2xl shadow-sm border transition-colors ${
        isOpen ? 'border-brand-teal/30' : 'border-gray-100'
      } overflow-hidden`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 sm:p-6 bg-white hover:bg-gray-50 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-4">
          {icon && (
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors ${
                isOpen
                  ? 'bg-brand-teal text-white shadow-md shadow-brand-teal/20'
                  : 'bg-gray-50 text-gray-500 border'
              }`}
            >
              {icon}
            </div>
          )}
          <div className="text-right">
            <h2 className="text-lg sm:text-xl font-black text-gray-900">{title}</h2>
            {description && <p className="text-sm text-gray-400 font-medium mt-1">{description}</p>}
          </div>
        </div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform shrink-0 ${
            isOpen ? 'bg-brand-teal/10 text-brand-teal' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {isOpen ? <FiChevronUp className="text-xl" /> : <FiChevronDown className="text-xl" />}
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
        }`}
      >
        <div className="p-5 sm:p-6 pt-2 border-t border-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
}
