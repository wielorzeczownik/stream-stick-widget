import { describe, expect, it } from 'vitest';

import { easeIn3, easeInOut3, easeOut3, linear } from '@/animation';

const SAMPLE_COUNT = 64;
const samples = Array.from(
  { length: SAMPLE_COUNT + 1 },
  (_value, index) => index / SAMPLE_COUNT
);
const interior = samples.slice(1, -1);

const easings = [
  ['linear', linear],
  ['easeIn3', easeIn3],
  ['easeOut3', easeOut3],
  ['easeInOut3', easeInOut3],
] as const;

describe.each(easings)('%s', (_name, ease) => {
  it('is pinned at both ends so a tween starts and finishes exactly on target', () => {
    expect(ease(0)).toBeCloseTo(0, 10);
    expect(ease(1)).toBeCloseTo(1, 10);
  });

  it('never overshoots the unit interval', () => {
    // An overshoot would drive the stick past its configured length.
    for (const progress of samples) {
      expect(ease(progress)).toBeGreaterThanOrEqual(0);
      expect(ease(progress)).toBeLessThanOrEqual(1);
    }
  });

  it('is monotonically non-decreasing so the stick never moves backwards', () => {
    for (let index = 1; index < samples.length; index++) {
      expect(ease(samples[index])).toBeGreaterThanOrEqual(
        ease(samples[index - 1])
      );
    }
  });
});

describe('easing shape', () => {
  it('easeIn3 starts slow: it lags linear across the interior', () => {
    for (const progress of interior) {
      expect(easeIn3(progress)).toBeLessThan(progress);
    }
  });

  it('easeOut3 starts fast: it leads linear across the interior', () => {
    for (const progress of interior) {
      expect(easeOut3(progress)).toBeGreaterThan(progress);
    }
  });

  it('easeInOut3 is symmetric about its midpoint', () => {
    expect(easeInOut3(0.5)).toBeCloseTo(0.5, 10);
    for (const progress of samples) {
      expect(easeInOut3(progress) + easeInOut3(1 - progress)).toBeCloseTo(
        1,
        10
      );
    }
  });

  it('easeIn3 and easeOut3 are reflections of each other', () => {
    for (const progress of samples) {
      expect(easeIn3(progress)).toBeCloseTo(1 - easeOut3(1 - progress), 10);
    }
  });

  it('linear is the identity', () => {
    for (const progress of samples) {
      expect(linear(progress)).toBe(progress);
    }
  });
});
