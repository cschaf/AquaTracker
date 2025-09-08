/**
 * @file A simple, typed event bus for cross-component communication.
 * @licence MIT
 */

import type { EventMap } from './event.types';

type EventName = keyof EventMap;

/**
 * A simple event emitter class.
 */
class EventEmitter {
  private listeners = new Map<EventName, Array<(payload: any) => void>>();

  /**
   * Subscribes to an event.
   * @param event - The name of the event.
   * @param callback - The function to call when the event is emitted.
   */
  on<K extends EventName>(event: K, callback: (payload: EventMap[K]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Unsubscribes from an event.
   * @param event - The name of the event.
   * @param callback - The callback function to remove.
   */
  off<K extends EventName>(event: K, callback: (payload: EventMap[K]) => void): void {
    if (!this.listeners.has(event)) {
      return;
    }
    const eventListeners = this.listeners.get(event)!.filter(
      (listener) => listener !== callback
    );
    this.listeners.set(event, eventListeners);
  }

  /**
   * Emits an event.
   * @param event - The name of the event to emit.
   * @param payload - The data to pass to the listeners.
   */
  emit<K extends EventName>(event: K, payload: EventMap[K]): void {
    if (!this.listeners.has(event)) {
      return;
    }
    this.listeners.get(event)!.forEach((callback) => {
      try {
        callback(payload);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }
}

/**
 * A singleton instance of the EventEmitter.
 */
export const eventBus = new EventEmitter();
