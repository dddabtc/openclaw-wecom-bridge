import { describe, expect, it } from 'vitest';
import { IdempotencyStore } from '../src/idempotency';

describe('IdempotencyStore', () => {
  it('should reject duplicate ids', () => {
    const store = new IdempotencyStore(1000);
    expect(store.isDuplicate('m1')).toBe(false);
    expect(store.isDuplicate('m1')).toBe(true);
  });
});
