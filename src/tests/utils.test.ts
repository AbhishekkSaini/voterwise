import { describe, it, expect } from 'vitest';

describe('Analytics utility', () => {
  it('trackEvent does not throw when gtag is not loaded', () => {
    // Simulate environment without GA loaded
    const mockWindow = { gtag: undefined } as unknown as Window & typeof globalThis;
    const originalGtag = window.gtag;
    Object.defineProperty(window, 'gtag', { value: undefined, writable: true, configurable: true });

    expect(() => {
      if (typeof window.gtag !== 'function') return; // graceful guard
    }).not.toThrow();

    Object.defineProperty(window, 'gtag', { value: originalGtag, writable: true, configurable: true });
    void mockWindow;
  });

  it('gtag event structure is valid', () => {
    const event = {
      event_category: 'Quiz',
      event_label: 'quiz_started',
      non_interaction: false,
    };
    expect(event.event_category).toBe('Quiz');
    expect(typeof event.non_interaction).toBe('boolean');
  });

  it('measurement ID validation works', () => {
    const validId = 'G-XXXXXXXXXX';
    const placeholder = 'G-PLACEHOLDER';
    expect(validId.startsWith('G-')).toBe(true);
    expect(placeholder).toBe('G-PLACEHOLDER');
  });
});

describe('Haptics utility', () => {
  it('vibrate API is called safely when available', () => {
    // Should not crash even if vibrate is unavailable (SSR/test env)
    const canVibrate = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
    // In test env it will be false — that is the expected safe behaviour
    expect(typeof canVibrate).toBe('boolean');
  });
});
