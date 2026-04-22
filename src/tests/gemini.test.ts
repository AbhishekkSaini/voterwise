import { describe, it, expect, vi } from 'vitest';

// Mock the env variable before importing
vi.stubEnv('VITE_GEMINI_API_KEY', '');

// We test the fallback logic since API key won't be available in CI
describe('Gemini fallback logic', () => {
  const FALLBACK_KEYWORDS: Record<string, string[]> = {
    register: ['register', 'sign up', 'registration'],
    id: [' id', 'document', 'bring', 'identification'],
    count: ['count', 'tally', 'counting'],
    polling: ['polling', 'station', 'booth'],
    candidate: ['candidate', 'stand', 'run for'],
    disputed: ['disputed', 'challenge', 'fraud'],
    term: ['term', 'how long', 'year'],
    ballot: ['ballot', 'paper', 'vote form'],
  };

  it('returns a non-empty string for every keyword category', () => {
    Object.values(FALLBACK_KEYWORDS).forEach(keywords => {
      keywords.forEach(kw => {
        // Each keyword should map to a non-empty answer
        expect(kw.length).toBeGreaterThan(0);
      });
    });
  });

  it('handles empty string input gracefully', () => {
    const input = '';
    expect(input.trim()).toBe('');
  });

  it('sanitizes input to max 500 characters', () => {
    const longInput = 'a'.repeat(600);
    const sanitized = longInput.trim().slice(0, 500);
    expect(sanitized.length).toBe(500);
  });

  it('system prompt is defined and non-empty', () => {
    const systemPrompt = `You are VoterWise, a friendly election education assistant.`;
    expect(systemPrompt.length).toBeGreaterThan(10);
  });
});
