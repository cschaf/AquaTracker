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
  private listeners: { [K in EventName]?: Array<(payload: EventMap[K]) => void> } = {};

  /**
   * Subscribes to an event.
   * @param event - The name of the event.
   * @param callback - The function to call when the event is emitted.
   */
  on<K extends EventName>(event: K, callback: (payload: EventMap[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  /**
   * Unsubscribes from an event.
   * @param event - The name of the event.
   * @param callback - The callback function to remove.
   */
  off<K extends EventName>(event: K, callback: (payload: EventMap[K]) => void): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event]!.filter(
      (listener) => listener !== callback
    );
  }

  /**
   * Emits an event.
   * @param event - The name of the event to emit.
   * @param payload - The data to pass to the listeners.
   */
  emit<K extends EventName>(event: K, payload: EventMap[K]): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event]!.forEach((callback) => {
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
