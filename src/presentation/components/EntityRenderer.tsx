import React from 'react';
import { BaseEntity, EntityType } from '../../domain/types/entity';
import { tField, TranslatableString } from '../../domain/types/settings';
import { FieldFactory } from './FieldFactory';
import { cookies } from 'next/headers';

interface EntityRendererProps {
  entity: BaseEntity;
  typeDefinition: EntityType | null;
  locale?: string;
}

export const EntityRenderer = async ({ entity, typeDefinition, locale = 'ar' }: EntityRendererProps) => {
  return (
    <article className="max-w-4xl mx-auto py-12 px-6">
      <header className="mb-10 text-center">
        <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
          {typeDefinition?.label || entity.type}
        </span>
        <h1 className="text-5xl font-black mt-2 text-gray-900">
          {tField(entity.title, locale)}
        </h1>
      </header>

      <section className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">
          {locale === 'ar' ? 'التفاصيل' : 'Details'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {entity.customFields.map((field) => {
            const def = typeDefinition?.fields.find(f => f.id === field.fieldId);
            return (
              <FieldFactory
                key={field.fieldId}
                type={def?.type || 'text'}
                label={def?.label || field.fieldId}
                value={field.value as string | TranslatableString}
                locale={locale}
              />
            );
          })}
        </div>
      </section>
    </article>
  );
};

