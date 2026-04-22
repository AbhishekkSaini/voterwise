import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock document.head.appendChild for GA script injection
const appendChildMock = vi.fn();
Object.defineProperty(document, 'head', {
  value: { appendChild: appendChildMock },
  writable: true,
  configurable: true,
});

describe('initGA', () => {
  beforeEach(() => {
    appendChildMock.mockClear();
    // Reset gtag
    (window as unknown as Record<string, unknown>).gtag = undefined;
    (window as unknown as Record<string, unknown>).dataLayer = undefined;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does NOT inject script when measurementId is empty', async () => {
    const { initGA } = await import('../lib/analytics');
    initGA('');
    expect(appendChildMock).not.toHaveBeenCalled();
  });

  it('does NOT inject script when measurementId is G-PLACEHOLDER', async () => {
    const { initGA } = await import('../lib/analytics');
    initGA('G-PLACEHOLDER');
    expect(appendChildMock).not.toHaveBeenCalled();
  });

  it('injects GA script when valid measurement ID is provided', async () => {
    const { initGA } = await import('../lib/analytics');
    initGA('G-TESTABCDEF');
    expect(appendChildMock).toHaveBeenCalled();
    const call = appendChildMock.mock.calls[0][0] as HTMLScriptElement;
    expect(call.src).toContain('googletagmanager');
  });

  it('sets up window.dataLayer array', async () => {
    const { initGA } = await import('../lib/analytics');
    initGA('G-TESTABCDEF');
    expect(window.dataLayer).toBeDefined();
    expect(Array.isArray(window.dataLayer)).toBe(true);
  });

  it('sets up window.gtag function', async () => {
    const { initGA } = await import('../lib/analytics');
    initGA('G-TESTABCDEF');
    expect(typeof window.gtag).toBe('function');
  });
});

describe('trackEvent', () => {
  it('does NOT throw when gtag is not defined', async () => {
    (window as unknown as Record<string, unknown>).gtag = undefined;
    const { trackEvent } = await import('../lib/analytics');
    expect(() => trackEvent('Quiz', 'quiz_started', 'election')).not.toThrow();
  });

  it('calls gtag with correct event structure', async () => {
    const gtagMock = vi.fn();
    window.gtag = gtagMock;
    const { trackEvent } = await import('../lib/analytics');
    trackEvent('Quiz', 'quiz_started', 'election_quiz');
    expect(gtagMock).toHaveBeenCalledWith('event', 'quiz_started', {
      event_category: 'Quiz',
      event_label: 'election_quiz',
      non_interaction: false,
    });
  });

  it('works without optional label param', async () => {
    const gtagMock = vi.fn();
    window.gtag = gtagMock;
    const { trackEvent } = await import('../lib/analytics');
    expect(() => trackEvent('Navigation', 'section_view')).not.toThrow();
  });
});
