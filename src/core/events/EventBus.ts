/**
 * 1. RESILIENT EVENT BUS (PRODUCTION GRADE)
 * 
 * Features:
 * - Exponential backoff retry for async handlers
 * - Telemetry for tracking event success/failure
 * - Error isolation
 */

export interface EventMap {
  'entity.created': { id: string; type: string };
  'entity.updated': { id: string; type: string; slug: string };
  'entity.deleted': { id: string; type: string };
  'media.uploaded': { url: string; metadata: any };
  'user.login': { userId: string; email: string };
  'cache.invalidate': { slug: string };
}

export type EventName = keyof EventMap;
type EventHandler<K extends EventName> = (payload: EventMap[K]) => Promise<void> | void;

interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
}

class EventBus {
  private static instance: EventBus;
  private listeners: Map<EventName, EventHandler<any>[]> = new Map();

  private constructor() {}

  static getInstance() {
    if (!EventBus.instance) EventBus.instance = new EventBus();
    return EventBus.instance;
  }

  subscribe<K extends EventName>(event: K, handler: EventHandler<K>) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)?.push(handler);
    
    return () => {
      const handlers = this.listeners.get(event);
      if (handlers) {
        this.listeners.set(event, handlers.filter(h => h !== handler));
      }
    };
  }

  async emit<K extends EventName>(event: K, payload: EventMap[K], retryOptions: RetryOptions = { maxRetries: 3, initialDelay: 1000 }): Promise<void> {
    const handlers = this.listeners.get(event) || [];
    
    const promises = handlers.map(async (handler) => {
      let attempts = 0;
      let success = false;

      while (attempts <= retryOptions.maxRetries && !success) {
        try {
          await handler(payload);
          success = true;
          this.logTelemetry(event, 'success', attempts);
        } catch (error) {
          attempts++;
          if (attempts > retryOptions.maxRetries) {
            console.error(`[EventBus] Permanent failure for ${event} after ${attempts} attempts:`, error);
            this.logTelemetry(event, 'failure', attempts);
          } else {
            const delay = retryOptions.initialDelay * Math.pow(2, attempts - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
    });

    await Promise.allSettled(promises);
  }

  private logTelemetry(event: EventName, status: 'success' | 'failure', attempts: number) {
    // In production: send to Sentry or internal metrics dashboard
    console.log(`[EventBus] Telemetry: ${event} | Status: ${status} | Attempts: ${attempts}`);
  }
}

export const eventBus = EventBus.getInstance();
