import { describe, it, expect } from 'vitest';
import { QUIZ, STEPS, TIMELINE, SUGGESTIONS } from '../data';

// ── Quiz ────────────────────────────────────────────────────────────────────
describe('Quiz data integrity', () => {
  it('has exactly 10 questions', () => expect(QUIZ.length).toBe(10));

  it('every question has a non-empty prompt', () => {
    QUIZ.forEach(q => expect(q.q.trim().length).toBeGreaterThan(5));
  });

  it('every question has 4 options', () => {
    QUIZ.forEach(q => expect(q.opts.length).toBe(4));
  });

  it('every option is a non-empty string', () => {
    QUIZ.forEach(q => q.opts.forEach(o => expect(o.trim().length).toBeGreaterThan(0)));
  });

  it('every answer index is within options bounds', () => {
    QUIZ.forEach(q => {
      expect(q.ans).toBeGreaterThanOrEqual(0);
      expect(q.ans).toBeLessThan(q.opts.length);
    });
  });

  it('every explanation is at least 20 characters', () => {
    QUIZ.forEach(q => expect(q.exp.trim().length).toBeGreaterThanOrEqual(20));
  });

  it('no duplicate question texts', () => {
    const texts = QUIZ.map(q => q.q);
    const unique = new Set(texts);
    expect(unique.size).toBe(texts.length);
  });
});

// ── Steps ───────────────────────────────────────────────────────────────────
describe('Election steps data integrity', () => {
  it('has exactly 6 steps', () => expect(STEPS.length).toBe(6));

  it('steps are numbered 1–6 sequentially', () => {
    STEPS.forEach((s, i) => expect(s.id).toBe(i + 1));
  });

  it('every step has a valid 6-digit hex color', () => {
    STEPS.forEach(s => expect(s.color).toMatch(/^#[0-9A-Fa-f]{6}$/));
  });

  it('every step has at least 2 bullet points', () => {
    STEPS.forEach(s => expect(s.bullets.length).toBeGreaterThanOrEqual(2));
  });

  it('every bullet is a non-empty string', () => {
    STEPS.forEach(s => s.bullets.forEach(b => expect(b.trim().length).toBeGreaterThan(0)));
  });

  it('every tip contains 💡 emoji', () => {
    STEPS.forEach(s => expect(s.tip).toContain('💡'));
  });

  it('no duplicate step titles', () => {
    const titles = STEPS.map(s => s.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});

// ── Timeline ─────────────────────────────────────────────────────────────────
describe('Timeline data integrity', () => {
  it('has exactly 8 events', () => expect(TIMELINE.length).toBe(8));

  it('all events belong to valid phases', () => {
    const valid = new Set(['Pre-Election', 'Campaign', 'Voting', 'Post-Election']);
    TIMELINE.forEach(ev => expect(valid.has(ev.phase)).toBe(true));
  });

  it('all 4 phases are represented', () => {
    const phases = new Set(TIMELINE.map(e => e.phase));
    expect(phases.size).toBe(4);
  });

  it('every event has non-empty title and desc', () => {
    TIMELINE.forEach(ev => {
      expect(ev.title.trim().length).toBeGreaterThan(0);
      expect(ev.desc.trim().length).toBeGreaterThan(10);
    });
  });
});

// ── Suggestions ───────────────────────────────────────────────────────────────
describe('Chat suggestions', () => {
  it('has exactly 10 suggestions', () => expect(SUGGESTIONS.length).toBe(10));

  it('all suggestions end with "?"', () => {
    SUGGESTIONS.forEach(s => expect(s.trim().endsWith('?')).toBe(true));
  });

  it('no duplicate suggestions', () => {
    expect(new Set(SUGGESTIONS).size).toBe(SUGGESTIONS.length);
  });

  it('all suggestions are under 60 characters', () => {
    SUGGESTIONS.forEach(s => expect(s.length).toBeLessThanOrEqual(60));
  });
});
