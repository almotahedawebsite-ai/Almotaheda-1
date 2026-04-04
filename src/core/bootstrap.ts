import { CoursesModule } from '../modules/courses/courses.module';
import { registry } from './registry/ModuleRegistry';
import { PipelineManager } from './PipelineManager';
import { eventBus } from './events/EventBus';

/**
 * 2. FULL APPLICATION BOOT PIPELINE
 * 
 * Logic:
 * 1. Global Core Init (EventBus, Pipeline, Logger)
 * 2. Module Discovery & Registry
 * 3. Dependency Resolution (Ordered Init)
 * 4. State Hydration
 */

export const bootstrapPlatform = async () => {
  console.log("[Platform] Executing enterprise bootstrap pipeline...");

  // 1. Core Services
  PipelineManager.init();

  // 2. Discover & Register Modules (Simulated Discovery)
  const modulesToLoad = [CoursesModule /* , EcomModule, etc. */];
  
  // Sort by dependency and order
  const sortedModules = modulesToLoad.sort((a, b) => (a.order || 0) - (b.order || 0));

  for (const mod of sortedModules) {
    await registry.register(mod);
  }

  // 3. Global Post-Init Hook
  await registry.bootstrap();
  
  await eventBus.emit('cache.invalidate', { slug: '*' });

  console.log("[Platform] Bootstrap success. Enterprise engine operational.");
};
