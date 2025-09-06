import { describe, it, expect } from 'vitest';
import { DomainError } from '../../../src/domain/errors';

describe('DomainError', () => {
  it('should be an instance of Error', () => {
    const error = new DomainError('test');
    expect(error).toBeInstanceOf(Error);
  });

  it('should have the correct name', () => {
    const error = new DomainError('test');
    expect(error.name).toBe('DomainError');
  });

  it('should have the correct message', () => {
    const message = 'This is a test error message.';
    const error = new DomainError(message);
    expect(error.message).toBe(message);
  });
});
