import { describe, it, expect } from 'vitest';
import { generateRandomId } from '../../../src/domain/utils/id.generator';

describe('generateRandomId', () => {
  it('should return a string', () => {
    const id = generateRandomId();
    expect(typeof id).toBe('string');
  });

  it('should not return an empty string', () => {
    const id = generateRandomId();
    expect(id.length).toBeGreaterThan(0);
  });

  it('should return different IDs on consecutive calls', () => {
    const id1 = generateRandomId();
    const id2 = generateRandomId();
    expect(id1).not.toBe(id2);
  });
});
