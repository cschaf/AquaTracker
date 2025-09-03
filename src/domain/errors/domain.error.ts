/**
 * @file Defines a base error class for the domain layer.
 * @licence MIT
 */

/**
 * A custom error class for domain-specific errors.
 * This allows for distinguishing between errors originating from business logic
 * and other types of errors (e.g., network, validation).
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}
