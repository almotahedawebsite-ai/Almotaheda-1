import { eventBus } from './events/EventBus';
import { Logger } from './observability_and_cache';
import { queueService } from './infrastructure/QueueService';

/**
 * 6. SEARCH & CACHE PIPELINE (ORCHESTRATOR)
 * 
 * Logic:
 * - Listen for critical entity changes via EventBus.
 * - Trigger parallel background jobs for downstream systems.
 * - Ensure minimal latency for the Admin Dashboard.
 */

export class PipelineManager {
  static init() {
    console.log("[PipelineManager] Initializing production pipelines...");

    eventBus.subscribe('entity.updated', async (payload) => {
      Logger.info(`[Pipeline] Entity updated: ${payload.id}. Triggering sync jobs.`);

      // Parallel execution via QueueService for maximum reliability
      await Promise.allSettled([
        // 1. Sync to Search Index (Algolia)
        queueService.enqueue({
          type: 'search_sync',
          priority: 'high',
          payload: { id: payload.id }
        }),
        
        // 2. Invalidate Edge Cache (Vercel ISR)
        queueService.enqueue({
          type: 'notification', 
          priority: 'normal',
          payload: { action: 'purge_cache', slug: payload.slug }
        })
      ]);
    });
  }
}
