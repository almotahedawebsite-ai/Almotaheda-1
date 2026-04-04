/**
 * 3. PLUGIN SYSTEM / FEATURE MODULES
 * 
 * Example: Courses Module Registration
 * 
 * Adding a new feature takes < 5 mins because:
 * 1. Register types & fields in Registry.
 * 2. Register UI blocks if any.
 * 3. No core code (routing/rendering) needs to be touched.
 */

import { registry } from '../../core/registry/ModuleRegistry';

export const initCoursesModule = async () => {
  await registry.register({
    name: 'courses',
    entityTypes: [
      {
        version: 1,
        type: 'courses',
        label: 'Online Courses',
        fields: [
          { id: 'price', label: 'Course Price', type: 'number', required: true },
          { id: 'duration', label: 'Duration (hours)', type: 'text', required: true },
          { id: 'lessons', label: 'Number of Lessons', type: 'number', required: false },
        ]
      }
    ],
    blocks: [
      {
        type: 'course_grid',
        component: () => null // React Component implementation here
      }
    ]
  });
};
