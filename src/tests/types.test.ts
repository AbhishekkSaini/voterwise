import { describe, it, expect } from 'vitest';
import type { ElectionStep, TimelineEvent, QuizQuestion, ChatMessage, SectionId } from '../types';

describe('TypeScript type contracts', () => {
  it('ElectionStep has all required fields', () => {
    const step: ElectionStep = {
      id: 1, emoji: '📋', color: '#007AFF',
      title: 'Test Step', preview: 'Preview text',
      desc: 'Description', bullets: ['Point 1'], tip: 'A tip',
    };
    expect(step.id).toBe(1);
    expect(Array.isArray(step.bullets)).toBe(true);
    expect(step.color).toMatch(/^#/);
  });

  it('TimelineEvent has all required fields', () => {
    const ev: TimelineEvent = {
      phase: 'Pre-Election', color: '#007AFF',
      when: '6 Months Before', title: 'Test Event', desc: 'Description',
    };
    expect(ev.phase).toBeTruthy();
    expect(ev.when).toBeTruthy();
  });

  it('QuizQuestion has valid structure', () => {
    const q: QuizQuestion = {
      q: 'What is democracy?',
      opts: ['Option A', 'Option B', 'Option C', 'Option D'],
      ans: 0,
      exp: 'Explanation here',
    };
    expect(q.ans).toBeGreaterThanOrEqual(0);
    expect(q.ans).toBeLessThan(q.opts.length);
    expect(q.opts.length).toBeGreaterThanOrEqual(2);
  });

  it('ChatMessage role is strictly user | bot', () => {
    const userMsg: ChatMessage = { id: 'u1', role: 'user', text: 'Hello', timestamp: new Date() };
    const botMsg: ChatMessage = { id: 'b1', role: 'bot', text: 'Hi there!', timestamp: new Date() };
    expect(['user', 'bot']).toContain(userMsg.role);
    expect(['user', 'bot']).toContain(botMsg.role);
  });

  it('SectionId covers all 6 valid sections', () => {
    const sections: SectionId[] = ['home', 'guide', 'timeline', 'quiz', 'chat', 'map'];
    expect(sections.length).toBe(6);
    sections.forEach(s => expect(typeof s).toBe('string'));
  });

  it('ChatMessage timestamp is a Date object', () => {
    const msg: ChatMessage = { id: 'x1', role: 'user', text: 'test', timestamp: new Date() };
    expect(msg.timestamp).toBeInstanceOf(Date);
  });
});
