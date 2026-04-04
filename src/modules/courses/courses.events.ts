import { eventBus } from '../../core/events/EventBus';
import { Logger } from '../../core/observability_and_cache';

export const initCoursesEvents = () => {
  eventBus.subscribe('entity.created', async (payload) => {
    if (payload.type === 'courses') {
      Logger.info(`[CoursesModule] New course created: ${payload.id}`);
      // Custom logic: e.g., send welcome email to instructor
    }
  });

  eventBus.subscribe('entity.deleted', async (payload) => {
    if (payload.type === 'courses') {
      Logger.info(`[CoursesModule] Course deleted: ${payload.id}`);
      // Custom logic: cleanup related resources
    }
  });
};
