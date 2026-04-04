import { ModuleConfig, registry } from '../../core/registry/ModuleRegistry';
import { CoursesSchema } from './courses.schema';
import { initCoursesEvents } from './courses.events';

export const CoursesModule: ModuleConfig = {
  name: 'courses',
  entityTypes: [CoursesSchema],
  blocks: [
    { type: 'course_grid', component: null }, // Placeholder for actual component
    { type: 'instructor_bio', component: null }
  ],
  init: async () => {
    initCoursesEvents();
    console.log("[CoursesModule] Initialized successfully");
  }
};
