import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { QUIZ } from '../data';
import { trackEvent } from '../lib/analytics';
import { h } from '../lib/haptics';

type State = 'start' | 'question' | 'result';
const spring: Transition = { type: 'spring', stiffness: 320, damping: 28 };

export default function QuizSection() {
  const [state, setState] = useState<State>('start');
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const q = QUIZ[idx];
  const pct = (idx / QUIZ.length) * 100;

  const start = useCallback(() => {
    h.press();
    setIdx(0); setScore(0); setSel(null); setAnswered(false); setState('question');
    trackEvent('Quiz', 'quiz_started', 'election_quiz');
  }, []);

  const answer = useCallback((i: number) => {
    if (answered) return;
    setSel(i); setAnswered(true);
    const ok = i === q.ans;
    if (ok) { setScore(s => s + 1); h.confirm(); }
    else { h.error(); }
    trackEvent('Quiz', ok ? 'correct_answer' : 'wrong_answer', q.q);
  }, [answered, q]);

  const next = useCallback(() => {
    h.tap();
    if (idx + 1 >= QUIZ.length) { setState('result'); trackEvent('Quiz', 'quiz_completed', `score_${score}`); }
    else { setIdx(i => i + 1); setSel(null); setAnswered(false); }
  }, [idx, score]);

  const final = state === 'result' ? score : 0;
  const finalPct = Math.round((final / QUIZ.length) * 100);

  const SF: React.CSSProperties = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif',
  };

  return (
    <section id="section-quiz" aria-labelledby="quiz-heading" className="section-wrap" style={{ maxWidth: '640px' }}>

      {/* Section header */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{
          fontSize: '13px', fontWeight: 600,
          color: 'rgba(60,60,67,0.6)',
          letterSpacing: '0.02em', textTransform: 'uppercase',
          marginBottom: '6px',
        }}>Knowledge Check</p>
        <h1 id="quiz-heading" className="font-display"
          style={{
            fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 800,
            color: '#000', letterSpacing: '-0.03em', marginBottom: '6px',
          }}>
          Test Your Knowledge
        </h1>
        <p style={{ color: 'rgba(60,60,67,0.6)', fontSize: '15px', letterSpacing: '-0.01em' }}>
          10 questions · Instant feedback · Learn as you go
        </p>
      </div>

      <AnimatePresence mode="wait">

        {/* ── START ── */}
        {state === 'start' && (
          <motion.div key="start"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={spring}
            style={{
              background: '#fff', borderRadius: '22px', padding: '52px 32px',
              textAlign: 'center',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            }}>
            <div className="float" style={{ fontSize: '4rem', marginBottom: '16px' }} aria-hidden="true">🧠</div>
            <h2 className="font-display" style={{
              fontSize: '1.6rem', fontWeight: 800, color: '#000',
              marginBottom: '8px', letterSpacing: '-0.03em',
            }}>Ready to Test Yourself?</h2>
            <p style={{
              color: 'rgba(60,60,67,0.6)', marginBottom: '32px',
              fontSize: '15px', letterSpacing: '-0.01em',
            }}>10 questions · Earn your election badge!</p>
            <button className="btn-primary" onClick={start}
              style={{ fontSize: '15px' }} aria-label="Start quiz">
              Start Quiz 🚀
            </button>
          </motion.div>
        )}

        {/* ── QUESTION ── */}
        {state === 'question' && (
          <motion.div key={`q${idx}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.24 }}>

            {/* Progress header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
              <span style={{
                fontSize: '13px', color: 'rgba(60,60,67,0.6)',
                fontWeight: 500, letterSpacing: '-0.01em',
                ...SF,
              }} aria-label={`Question ${idx + 1} of ${QUIZ.length}`}>
                Question {idx + 1} of {QUIZ.length}
              </span>
              <span style={{
                fontSize: '13px', fontWeight: 700, color: '#007AFF',
                background: 'rgba(0,122,255,0.10)',
                padding: '2px 10px', borderRadius: '100px',
                letterSpacing: '-0.01em',
              }}>Score: {score}</span>
            </div>

            <div className="progress-track" style={{ marginBottom: '20px' }}
              role="progressbar" aria-valuenow={idx} aria-valuemin={0} aria-valuemax={QUIZ.length}>
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>

            {/* Question card */}
            <div style={{
              background: '#fff', borderRadius: '20px', padding: '26px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <p style={{
                fontSize: '16px', fontWeight: 600, color: '#000',
                lineHeight: 1.6, marginBottom: '20px',
                letterSpacing: '-0.015em', ...SF,
              }} aria-live="polite">{q.q}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} role="group" aria-label="Answers">
                {q.opts.map((opt, i) => {
                  const isCorr = i === q.ans, isSel = sel === i;
                  let bg = '#fff', color = 'rgba(60,60,67,0.85)';
                  if (answered) {
                    if (isCorr) { bg = 'rgba(52,199,89,0.10)'; color = '#34C759'; }
                    else if (isSel) { bg = 'rgba(255,59,48,0.10)'; color = '#FF3B30'; }
                    else { bg = '#F2F2F7'; color = 'rgba(60,60,67,0.4)'; }
                  }
                  return (
                    <button key={i} onClick={() => answer(i)} disabled={answered}
                      className="quiz-option"
                      style={{ background: bg, color }}
                      aria-label={`${String.fromCharCode(65 + i)}: ${opt}${answered && isCorr ? ' (correct)' : ''}`}
                      aria-pressed={isSel}
                      onMouseEnter={e => { if (!answered) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,122,255,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = '#007AFF'; } }}
                      onMouseLeave={e => { if (!answered) { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(60,60,67,0.85)'; } }}
                    >
                      {/* Letter badge — iOS style */}
                      <span style={{
                        width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 700,
                        background: answered && isCorr ? '#34C759'
                          : answered && isSel ? '#FF3B30'
                          : answered ? 'rgba(120,120,128,0.12)'
                          : 'rgba(0,122,255,0.10)',
                        color: answered && (isCorr || isSel) ? '#fff'
                          : answered ? 'rgba(60,60,67,0.35)'
                          : '#007AFF',
                        transition: 'all 0.18s',
                      }} aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={spring}
                    style={{
                      marginTop: '16px', padding: '14px 16px', borderRadius: '12px',
                      fontSize: '14px', lineHeight: 1.65, fontWeight: 500,
                      letterSpacing: '-0.01em',
                      background: sel === q.ans ? 'rgba(52,199,89,0.10)' : 'rgba(255,59,48,0.08)',
                      color: sel === q.ans ? '#34C759' : '#FF3B30',
                      ...SF,
                    }} role="alert" aria-live="assertive">
                    {sel === q.ans ? '✅ Correct! ' : '❌ Not quite. '}{q.exp}
                  </motion.div>
                )}
              </AnimatePresence>

              {answered && (
                <button className="btn-primary" onClick={next}
                  style={{ marginTop: '16px', width: '100%', fontSize: '15px' }}
                  aria-label={idx + 1 >= QUIZ.length ? 'See results' : 'Next question'}>
                  {idx + 1 >= QUIZ.length ? 'See Results 🏆' : 'Next Question →'}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {state === 'result' && (
          <motion.div key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={spring}
            style={{
              background: '#fff', borderRadius: '22px', padding: '52px 32px',
              textAlign: 'center',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            }} aria-live="polite">
            <div className="float" style={{ fontSize: '4rem', marginBottom: '14px' }} aria-hidden="true">
              {finalPct >= 80 ? '🏆' : finalPct >= 50 ? '🎯' : '📚'}
            </div>
            <h2 className="font-display" style={{
              fontSize: '2rem', fontWeight: 800, color: '#000',
              marginBottom: '6px', letterSpacing: '-0.03em',
            }}>
              {finalPct >= 80 ? 'Excellent!' : finalPct >= 50 ? 'Good Effort!' : 'Keep Learning!'}
            </h2>

            {/* Score pill */}
            <div style={{
              display: 'inline-block',
              fontSize: '2.2rem', fontWeight: 800,
              color: '#007AFF', letterSpacing: '-0.03em',
              background: 'rgba(0,122,255,0.09)',
              padding: '10px 28px', borderRadius: '100px',
              margin: '8px 0 16px',
            }} aria-label={`${final} out of ${QUIZ.length}`}>{final}/{QUIZ.length}</div>

            <p style={{
              color: 'rgba(60,60,67,0.6)', marginBottom: '28px',
              fontSize: '15px', maxWidth: '300px', margin: '0 auto 28px',
              lineHeight: 1.65, letterSpacing: '-0.01em', ...SF,
            }}>
              {finalPct >= 80 ? 'You clearly understand the election process!'
                : finalPct >= 50 ? 'Good start — review the Step Guide to strengthen your knowledge.'
                : 'Go through the Step Guide first, then try again. You\'ll improve!'}
            </p>

            {/* Score bar */}
            <div style={{ maxWidth: '200px', margin: '0 auto 28px' }}>
              <div className="progress-track" style={{ height: '8px' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${finalPct}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{
                    height: '100%', borderRadius: '100px',
                    background: finalPct >= 70 ? '#34C759' : finalPct >= 50 ? '#FF9500' : '#FF3B30',
                  }} />
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(60,60,67,0.5)', marginTop: '6px', letterSpacing: '-0.01em' }}>{finalPct}% correct</p>
            </div>

            <button className="btn-primary" onClick={start}
              aria-label="Try again" style={{ fontSize: '15px' }}>
              Try Again 🔄
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </section>
  );
}
