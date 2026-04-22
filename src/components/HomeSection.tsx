import { motion } from 'framer-motion';
import type { SectionId } from '../types';
import { h } from '../lib/haptics';

interface Props { onNavigate: (id: SectionId) => void; }

const FEATURES = [
  { icon: '📋', title: 'Step-by-Step Guide',   desc: 'All 6 phases explained simply — registration, voting, counting, and more.', section: 'guide'    as SectionId },
  { icon: '📅', title: 'Election Timeline',     desc: 'See exactly when each phase happens — months before and after election day.', section: 'timeline' as SectionId },
  { icon: '🧠', title: 'Knowledge Quiz',        desc: '10 questions with instant feedback to test and reinforce what you\'ve learned.', section: 'quiz'     as SectionId },
  { icon: '💬', title: 'Ask Gemini AI',         desc: 'Powered by Google Gemini — clear, beginner-friendly answers instantly.', section: 'chat'     as SectionId },
  { icon: '📍', title: 'Find Polling Booth',    desc: 'Google Maps locates official polling stations nearest to you.', section: 'map'      as SectionId },
];

const STATS = [
  { num: '6',  label: 'Steps' },
  { num: '8',  label: 'Timeline Events' },
  { num: '10', label: 'Quiz Questions' },
  { num: 'AI', label: 'Gemini Powered' },
];

const GOOGLE = [
  { icon: '🤖', label: 'Gemini AI',       sub: 'Smart Q&A assistant' },
  { icon: '🗺️', label: 'Google Maps',    sub: 'Polling booth finder' },
  { icon: '🔤', label: 'Google Fonts',    sub: 'Clean typography'    },
  { icon: '📊', label: 'Analytics (GA4)', sub: 'Usage tracking'      },
];

// Apple spring transition
const spring = { type: 'spring', stiffness: 320, damping: 28 };

export default function HomeSection({ onNavigate }: Props) {
  return (
    <div style={{ background: '#F2F2F7' }}>

      {/* ── HERO — Large Title style ── */}
      <section aria-labelledby="home-heading" style={{
        background: '#fff',
        padding: '72px 24px 60px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0 }}>
            <span className="badge-blue">🏛️ Election Education</span>
          </motion.div>

          {/* Large Title — like iOS "Settings" or "App Store" header */}
          <motion.h1 id="home-heading" className="font-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.08 }}
            style={{
              fontSize: 'clamp(2.2rem, 6vw, 3.4rem)',
              fontWeight: 800,
              color: '#000',
              marginTop: '20px',
              marginBottom: '14px',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}>
            Understand Elections,{' '}
            <span style={{ color: '#007AFF' }}>Step by Step</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.14 }}
            style={{
              fontSize: '17px',
              color: 'rgba(60,60,67,0.75)',
              marginBottom: '36px',
              lineHeight: 1.6,
              letterSpacing: '-0.01em',
              maxWidth: '460px',
              margin: '0 auto 36px',
            }}>
            No jargon. No confusion. Interactive guides, timelines,
            quizzes, and AI-powered answers — all in one place.
          </motion.p>

          {/* CTA buttons — Apple pill style */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '52px' }}>
            <button className="btn-primary"
              onClick={() => { h.press(); onNavigate('guide'); }}
              style={{ fontSize: '15px' }}
              aria-label="Start the step-by-step election guide">
              Start Learning →
            </button>
            <button className="btn-outline"
              onClick={() => { h.press(); onNavigate('chat'); }}
              style={{ fontSize: '15px' }}
              aria-label="Ask the AI a question">
              Ask AI
            </button>
          </motion.div>

          {/* Stats — iOS-style rounded rect tiles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...spring, delay: 0.28 }}
            role="list"
            style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {STATS.map(s => (
              <div key={s.label} role="listitem" style={{
                background: '#F2F2F7',
                borderRadius: '14px',
                padding: '14px 20px',
                textAlign: 'center',
                minWidth: '88px',
              }}>
                <div className="font-display" style={{
                  fontSize: '1.65rem', fontWeight: 800,
                  color: '#007AFF', letterSpacing: '-0.03em',
                }}>{s.num}</div>
                <div style={{
                  fontSize: '11px', color: 'rgba(60,60,67,0.6)',
                  marginTop: '3px', fontWeight: 500, letterSpacing: '-0.01em',
                }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES — iOS grouped table style ── */}
      <section aria-labelledby="features-heading"
        style={{ maxWidth: '1080px', margin: '0 auto', padding: '48px 20px' }}>

        <div style={{ marginBottom: '20px', paddingLeft: '4px' }}>
          {/* iOS section header label */}
          <p style={{
            fontSize: '13px', fontWeight: 600,
            color: 'rgba(60,60,67,0.6)',
            letterSpacing: '0.02em', textTransform: 'uppercase',
            marginBottom: '8px',
          }}>What's Inside</p>
          <h2 id="features-heading" className="font-display"
            style={{ fontSize: '1.5rem', fontWeight: 700, color: '#000', letterSpacing: '-0.025em' }}>
            Everything You Need
          </h2>
        </div>

        {/* iOS-style card grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '12px' }}>
          {FEATURES.map((f, i) => (
            <motion.article key={f.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.06 }}
              className="card pressable-card"
              style={{ padding: '22px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
              onClick={() => { h.select(); onNavigate(f.section); }}
              onKeyDown={e => (e.key==='Enter'||e.key===' ') && (h.select(), onNavigate(f.section))}
              tabIndex={0} role="button"
              aria-label={`${f.title}: ${f.desc}`}
            >
              {/* Icon — iOS app icon style */}
              <div style={{
                width: '44px', height: '44px', borderRadius: '11px',
                background: 'rgba(0,122,255,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', marginBottom: '14px',
              }} aria-hidden="true">{f.icon}</div>

              <h3 style={{
                fontSize: '15px', fontWeight: 600,
                color: '#000', marginBottom: '6px', letterSpacing: '-0.015em',
              }}>{f.title}</h3>
              <p style={{
                fontSize: '13px', color: 'rgba(60,60,67,0.7)',
                lineHeight: 1.55, marginBottom: '14px', letterSpacing: '-0.01em',
              }}>{f.desc}</p>
              <span style={{
                fontSize: '13px', color: '#007AFF',
                fontWeight: 590, letterSpacing: '-0.01em',
              }}>Open →</span>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── GOOGLE SERVICES — iOS grouped list ── */}
      <section aria-labelledby="google-heading"
        style={{ background: '#fff', padding: '44px 20px' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>

          <div style={{ marginBottom: '20px', paddingLeft: '4px' }}>
            <p style={{
              fontSize: '13px', fontWeight: 600,
              color: 'rgba(60,60,67,0.6)',
              letterSpacing: '0.02em', textTransform: 'uppercase',
              marginBottom: '8px',
            }}>Integrations</p>
            <h2 id="google-heading" style={{
              fontSize: '1.3rem', fontWeight: 700,
              color: '#000', letterSpacing: '-0.02em',
            }}>Powered by Google</h2>
          </div>

          {/* iOS grouped table rows */}
          <div style={{
            background: '#F2F2F7', borderRadius: '14px', overflow: 'hidden',
          }}>
            {GOOGLE.map((g, i) => (
              <div key={g.label}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px',
                  background: '#fff',
                }}>
                  <span style={{ fontSize: '1.5rem', width: '32px', textAlign: 'center' }} aria-hidden="true">{g.icon}</span>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 500, color: '#000', letterSpacing: '-0.015em' }}>{g.label}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(60,60,67,0.6)', letterSpacing: '-0.01em' }}>{g.sub}</div>
                  </div>
                </div>
                {i < GOOGLE.length - 1 && (
                  <div style={{ height: '0.5px', background: 'rgba(60,60,67,0.13)', marginLeft: '62px' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: '48px' }} />
    </div>
  );
}
