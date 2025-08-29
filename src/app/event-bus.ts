// src/app/event-bus.ts
import mitt, { Emitter } from 'mitt';
import type { ApplicationEvents } from './event.types';

// Create a new mitt emitter with the defined events
const emitter: Emitter<ApplicationEvents> = mitt<ApplicationEvents>();

// Export the emitter as a singleton.
// We can still call it eventBus to minimize changes in consuming code.
export const eventBus = {
  on: emitter.on,
  off: emitter.off,
  emit: emitter.emit,
};
