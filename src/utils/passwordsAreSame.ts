import { timingSafeEqual } from 'node:crypto';

/**
 * Compare secret values without leaking their matching prefix through timing.
 */
export const passwordsAreSame = (a: string, b: string): boolean => {
  const first = Buffer.from(a);
  const second = Buffer.from(b);

  if (first.length !== second.length) {
    return false;
  }

  return timingSafeEqual(first, second);
};
