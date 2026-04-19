import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export interface DashboardSection {
  id: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface DashboardPageTemplateProps {
  title: string;
  description?: string;
  headerActions?: React.ReactNode;
  sections: DashboardSection[];
}

export default function DashboardPageTemplate({
  title,
  description,
  headerActions,
  sections,
}: DashboardPageTemplateProps) {
  // Track active tab
  const [activeTabId, setActiveTabId] = useState<string>('');

  useEffect(() => {
    if (sections.length > 0 && !activeTabId) {
      setActiveTabId(sections[0].id);
    }
  }, [sections]);

  const activeSection = sections.find((s) => s.id === activeTabId) || sections[0];

  const handleTabClick = (id: string) => {
    setActiveTabId(id);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{title}</h1>
          {description && <p className="text-gray-500 mt-1">{description}</p>}
        </div>
        {headerActions && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {headerActions}
          </div>
        )}
      </div>

      {/* Internal Navigation (Tabs) */}
      <div className="sticky top-0 lg:top-0 z-30 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-2 overflow-x-auto flex items-center gap-2 custom-scrollbar">
        {sections.map((section) => {
          const isActive = activeTabId === section.id;
          return (
            <button
              key={`nav-${section.id}`}
              onClick={() => handleTabClick(section.id)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl font-bold text-sm transition-all outline-none ${
                isActive
                  ? 'bg-brand-navy text-white shadow-md shadow-brand-navy/20'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
              }`}
            >
              {section.icon && <span className="text-lg">{section.icon}</span>}
              {section.title}
            </button>
          );
        })}
      </div>

      {/* Active Section Content Container */}
      <div className="space-y-6 animate-fade-in">
        {activeSection && activeSection.content}
      </div>
    </div>
  );
}
