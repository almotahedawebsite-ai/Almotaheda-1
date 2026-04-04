import React from 'react';
import { BaseEntity, CustomFieldDefinition } from '@/domain/types';
import { tField } from '@/domain/types/settings';
import { FiCheck, FiX } from 'react-icons/fi';

interface EntityRendererProps {
  entity: BaseEntity;
  definitions: CustomFieldDefinition[];
  locale: string;
}

export const EntityRenderer: React.FC<EntityRendererProps> = ({ entity, definitions, locale }) => {
  return (
    <article className="p-6 border rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold mb-4">{tField(entity.title, locale)}</h1>
      <p className="text-gray-600 mb-6">{tField(entity.description, locale)}</p>
      
      {entity.media && entity.media.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {entity.media.map((url: string, index: number) => (
            <img key={index} src={url} alt={`${tField(entity.title, locale)} media ${index}`} className="rounded-md" />
          ))}
        </div>
      )}

      <div className="space-y-4">
        {definitions.map((def) => {
          const fieldVal = entity.customFields.find(f => f.fieldId === def.id);
          if (!fieldVal) return null;

          return (
            <div key={def.id} className="flex flex-col">
              <span className="text-sm font-semibold text-gray-500 uppercase">{def.label}</span>
              <span className="text-lg flex items-center mt-1">
                {def.type === 'boolean' ? (fieldVal.value ? <FiCheck className="text-green-500 text-2xl animate-pulse" /> : <FiX className="text-red-500 text-2xl" />) : tField(fieldVal.value as any, locale)}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
};
