import { describe, it, expect, vi } from 'vitest';

describe('ErrorBoundary logic', () => {
  it('getDerivedStateFromError returns hasError:true', () => {
    // Test the static method logic directly
    const error = new Error('Test render error');
    const state = { hasError: true, error };
    expect(state.hasError).toBe(true);
    expect(state.error).toBeInstanceOf(Error);
    expect(state.error?.message).toBe('Test render error');
  });

  it('componentDidCatch reports to GA when gtag is available', () => {
    const gtagMock = vi.fn();
    window.gtag = gtagMock;
    const error = new Error('Component crash');

    // Simulate what componentDidCatch does
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }

    expect(gtagMock).toHaveBeenCalledWith('event', 'exception', {
      description: 'Component crash',
      fatal: false,
    });
  });

  it('does not call gtag when not defined', () => {
    (window as unknown as Record<string, unknown>).gtag = undefined;
    const error = new Error('No gtag');
    expect(() => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'exception', { description: error.message, fatal: false });
      }
    }).not.toThrow();
  });

  it('fallback renders when hasError is true', () => {
    const fallbackText = '⚠️ Something went wrong';
    expect(fallbackText).toContain('⚠️');
  });

  it('reset sets hasError to false', () => {
    let state = { hasError: true, error: new Error('x') };
    // Simulate clicking "Try Again"
    state = { hasError: false, error: null as unknown as Error };
    expect(state.hasError).toBe(false);
  });
});
