import { describe, expect, test } from 'vitest';

import { passwordsAreSame } from './passwordsAreSame';

describe('passwordsAreSame', () => {
  test('accepts identical values', () => {
    expect(passwordsAreSame('token', 'token')).toBe(true);
  });

  test('rejects a valid token with an appended suffix', () => {
    expect(passwordsAreSame('token', 'token-attacker-controlled')).toBe(false);
  });

  test('rejects values with different lengths', () => {
    expect(passwordsAreSame('token', 'toke')).toBe(false);
  });
});
