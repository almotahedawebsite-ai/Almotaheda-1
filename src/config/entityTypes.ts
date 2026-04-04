import { EntityType } from '@/domain/types/entity';

export const EntityTypesConfig: EntityType[] = [
  {
    id: 'page',
    label: 'Page (صفحات عامة)',
    fields: [
      { id: 'body', label: 'محتوى الصفحة الأساسي', type: 'textarea', translatable: true },
      { id: 'coverImage', label: 'صورة الغلاف', type: 'image' }
    ]
  },
  {
    id: 'service',
    label: 'Service (خدمات المتحدة)',
    fields: [
      { id: 'icon', label: 'أيقونة الخدمة', type: 'image' },
      { id: 'details', label: 'وصف الخدمة بالتفصيل', type: 'textarea', translatable: true },
      { id: 'coverImage', label: 'صورة الخدمة', type: 'image' }
    ]
  }
];
