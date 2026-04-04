import { EntityTypeDefinition } from '../../core/registry/ModuleRegistry';

export const CoursesSchema: EntityTypeDefinition = {
  version: 1,
  type: 'courses',
  label: 'Online Courses',
  fields: [
    { id: 'price', label: 'Price', type: 'number', required: true },
    { id: 'duration', label: 'Duration', type: 'text', required: true },
    { id: 'lessons', label: 'Lesson Count', type: 'number', required: false },
    { id: 'instructor', label: 'Instructor Name', type: 'text', required: true },
  ]
};
