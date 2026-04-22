import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { STEPS } from '../data';
import type { ElectionStep } from '../types';
import { trackEvent } from '../lib/analytics';
import { h } from '../lib/haptics';

const spring: Transition = { type: 'spring', stiffness: 320, damping: 28 };

function ProgressBar({ explored }: { explored: Set<number> }) {
  const pct = (explored.size / STEPS.length) * 100;
  return (
    <div style={{ marginBottom: '28px' }}
      role="progressbar" aria-valuenow={explored.size} aria-valuemin={0} aria-valuemax={STEPS.length}
      aria-label={`${explored.size} of ${STEPS.length} steps explored`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: 'rgba(60,60,67,0.6)', fontWeight: 500, letterSpacing: '-0.01em' }}>
          {explored.size} of {STEPS.length} steps explored
        </span>
        <span style={{
          fontSize: '13px', fontWeight: 700, color: '#007AFF',
          background: 'rgba(0,122,255,0.10)', padding: '2px 9px',
          borderRadius: '100px', letterSpacing: '-0.01em',
        }}>{Math.round(pct)}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StepCard({ step, explored, onClick }: { step: ElectionStep; explored: boolean; onClick: () => void }) {
  const [pressed, setPressed] = useState(false);
  return (
    <motion.article
      layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      role="button" tabIndex={0}
      aria-label={`Step ${step.id}: ${step.title}. ${explored ? 'Explored.' : 'Tap to explore.'}`}
      onClick={onClick}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        background: '#fff',
        borderRadius: '18px',
        padding: '22px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: pressed
          ? '0 1px 4px rgba(0,0,0,0.06)'
          : '0 2px 10px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform 0.13s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.13s ease',
        border: explored ? '1.5px solid rgba(52,199,89,0.30)' : '1.5px solid transparent',
      }}>
      {/* Colored top strip */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: explored ? '#34C759' : step.color,
        borderRadius: '18px 18px 0 0',
        opacity: explored ? 1 : 0.7,
      }} />

      {explored && (
        <span aria-hidden="true" style={{
          position: 'absolute', top: '14px', right: '14px',
          background: 'rgba(52,199,89,0.12)', color: '#34C759',
          borderRadius: '100px', padding: '3px 10px',
          fontSize: '11px', fontWeight: 700, letterSpacing: '-0.005em',
          display: 'inline-flex', alignItems: 'center', gap: '4px',
        }}>✓ Done</span>
      )}

      {/* Step number circle */}
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: step.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '12px',
        boxShadow: `0 2px 8px ${step.color}44`,
      }} aria-hidden="true">{step.id}</div>

      <div style={{ fontSize: '1.8rem', marginBottom: '10px' }} aria-hidden="true">{step.emoji}</div>
      <h2 style={{
        fontSize: '15px', fontWeight: 600,
        color: '#000', marginBottom: '6px', letterSpacing: '-0.015em',
      }}>{step.title}</h2>
      <p style={{
        fontSize: '13px', color: 'rgba(60,60,67,0.7)',
        lineHeight: 1.55, marginBottom: '14px', letterSpacing: '-0.01em',
      }}>{step.preview}</p>
      <span style={{ fontSize: '13px', color: '#007AFF', fontWeight: 590, letterSpacing: '-0.01em' }}>
        Learn more →
      </span>
    </motion.article>
  );
}

function DetailPanel({ step, onClose }: { step: ElectionStep; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.99 }}
      transition={spring}
      style={{
        marginTop: '20px',
        background: '#fff',
        borderRadius: '20px',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 8px 40px rgba(0,0,0,0.10), 0 2px 10px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}
      role="region" aria-label={`Details: ${step.title}`} aria-live="polite">

      {/* Top color strip */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
        background: `linear-gradient(90deg, ${step.color}, ${step.color}88)`,
        borderRadius: '20px 20px 0 0',
      }} />

      {/* Close — iOS "Done" button style */}
      <button onClick={() => { h.tap(); onClose(); }} aria-label="Close step details"
        style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'rgba(0,122,255,0.10)', border: 'none',
          color: '#007AFF', padding: '6px 14px', borderRadius: '100px',
          fontSize: '14px', fontWeight: 600, cursor: 'pointer',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif',
          letterSpacing: '-0.01em',
          transition: 'background 0.14s, transform 0.12s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,122,255,0.18)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,122,255,0.10)'; }}
        onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.93)'; }}
        onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
      >Done</button>

      <div style={{ fontSize: '3rem', marginBottom: '10px' }} aria-hidden="true">{step.emoji}</div>
      <h2 className="font-display" style={{
        fontSize: '1.5rem', fontWeight: 700,
        color: '#000', marginBottom: '10px', letterSpacing: '-0.03em',
      }}>
        Step {step.id}: {step.title}
      </h2>
      <p style={{
        color: 'rgba(60,60,67,0.75)', lineHeight: 1.7,
        marginBottom: '22px', fontSize: '15px', letterSpacing: '-0.01em',
      }}>{step.desc}</p>

      {/* iOS-style bullet list */}
      <div style={{
        background: '#F2F2F7', borderRadius: '14px',
        overflow: 'hidden', marginBottom: '20px',
      }} aria-label="Key points">
        {step.bullets.map((b, i) => (
          <div key={i}>
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              padding: '13px 16px',
            }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                background: step.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 800, color: '#fff', marginTop: '1px',
              }} aria-hidden="true">✓</div>
              <span style={{
                fontSize: '14px', color: 'rgba(60,60,67,0.85)',
                lineHeight: 1.5, letterSpacing: '-0.01em',
              }}>{b}</span>
            </div>
            {i < step.bullets.length - 1 && (
              <div style={{ height: '0.5px', background: 'rgba(60,60,67,0.13)', marginLeft: '48px' }} />
            )}
          </div>
        ))}
      </div>

      {/* Tip callout — iOS blue info box */}
      <div style={{
        background: 'rgba(0,122,255,0.08)',
        borderLeft: '4px solid #007AFF',
        borderRadius: '0 12px 12px 0',
        padding: '13px 16px',
        fontSize: '14px', color: '#007AFF',
        lineHeight: 1.65, letterSpacing: '-0.01em',
      }} role="note">{step.tip}</div>
    </motion.div>
  );
}

export default function GuideSection() {
  const [explored, setExplored] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<ElectionStep | null>(null);

  function open(step: ElectionStep) {
    h.select();
    setActive(step);
    setExplored(p => new Set([...p, step.id]));
    trackEvent('Guide', 'step_viewed', step.title);
    setTimeout(() => document.getElementById('step-detail')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  }

  return (
    <section id="section-guide" aria-labelledby="guide-heading" className="section-wrap">
      <div style={{ marginBottom: '36px' }}>
        <p style={{
          fontSize: '13px', fontWeight: 600,
          color: 'rgba(60,60,67,0.6)',
          letterSpacing: '0.02em', textTransform: 'uppercase',
          marginBottom: '6px',
        }}>Interactive</p>
        <h1 id="guide-heading" className="font-display"
          style={{
            fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 800,
            color: '#000', letterSpacing: '-0.03em', marginBottom: '6px',
          }}>
          Election Process
        </h1>
        <p style={{ color: 'rgba(60,60,67,0.6)', fontSize: '15px', letterSpacing: '-0.01em' }}>
          Tap a step to learn more. Complete all 6!
        </p>
      </div>

      <ProgressBar explored={explored} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '14px' }}>
        {STEPS.map(s => (
          <StepCard key={s.id} step={s} explored={explored.has(s.id)} onClick={() => open(s)} />
        ))}
      </div>

      <div id="step-detail">
        <AnimatePresence mode="wait">
          {active && <DetailPanel key={active.id} step={active} onClose={() => setActive(null)} />}
        </AnimatePresence>
      </div>
    </section>
  );
}
