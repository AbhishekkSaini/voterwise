import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { haptic, h } from '../lib/haptics';
import type { HapticPattern } from '../lib/haptics';

describe('haptic() function', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, 'vibrate', {
      value: vi.fn(() => true),
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const patterns: HapticPattern[] = ['light', 'medium', 'heavy', 'success', 'warning', 'error', 'select'];

  patterns.forEach(pattern => {
    it(`fires haptic pattern: ${pattern}`, () => {
      expect(() => haptic(pattern)).not.toThrow();
    });
  });

  it('defaults to light pattern when no arg given', () => {
    expect(() => haptic()).not.toThrow();
  });

  it('debounces rapid calls within 50ms', () => {
    const vibrateSpy = vi.spyOn(navigator, 'vibrate');
    haptic('light');
    haptic('light'); // should be debounced
    // Only the first call should go through
    expect(vibrateSpy).toHaveBeenCalledTimes(1);
  });
});

describe('h convenience wrappers', () => {
  it('h.tap() does not throw', () => expect(() => h.tap()).not.toThrow());
  it('h.press() does not throw', () => expect(() => h.press()).not.toThrow());
  it('h.select() does not throw', () => expect(() => h.select()).not.toThrow());
  it('h.confirm() does not throw', () => expect(() => h.confirm()).not.toThrow());
  it('h.warn() does not throw', () => expect(() => h.warn()).not.toThrow());
  it('h.error() does not throw', () => expect(() => h.error()).not.toThrow());
  it('h has exactly 6 methods', () => expect(Object.keys(h).length).toBe(6));
});
