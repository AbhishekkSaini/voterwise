import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { TIMELINE } from '../data';

const spring: Transition = { type: 'spring', stiffness: 320, damping: 28 };

const COLORS: Record<string, string> = {
  'Pre-Election': '#007AFF',
  'Campaign':     '#AF52DE',
  'Voting':       '#34C759',
  'Post-Election':'#FF9500',
};

export default function TimelineSection() {
  return (
    <section id="section-timeline" aria-labelledby="timeline-heading" className="section-wrap" style={{ maxWidth: '720px' }}>

      {/* Section header */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{
          fontSize: '13px', fontWeight: 600,
          color: 'rgba(60,60,67,0.6)',
          letterSpacing: '0.02em', textTransform: 'uppercase',
          marginBottom: '6px',
        }}>Calendar</p>
        <h1 id="timeline-heading" className="font-display"
          style={{
            fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 800,
            color: '#000', letterSpacing: '-0.03em', marginBottom: '6px',
          }}>
          Election Timeline
        </h1>
        <p style={{ color: 'rgba(60,60,67,0.6)', fontSize: '15px', letterSpacing: '-0.01em' }}>
          Exactly what happens — and when — in the election cycle.
        </p>
      </div>

      {/* Phase legend — iOS pill badges */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {Object.entries(COLORS).map(([phase, color]) => (
          <span key={phase} style={{
            fontSize: '12px', fontWeight: 600,
            background: `${color}15`, color,
            border: `1px solid ${color}30`,
            padding: '4px 12px', borderRadius: '100px',
            letterSpacing: '-0.01em',
          }}>{phase}</span>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: '32px' }} role="list" aria-label="Election timeline">
        {/* Vertical gradient line */}
        <div aria-hidden="true" style={{
          position: 'absolute', left: '10px', top: '8px', bottom: '8px',
          width: '2px',
          background: 'linear-gradient(180deg, #007AFF, #AF52DE, #34C759, #FF9500)',
          borderRadius: '2px', opacity: 0.4,
        }} />

        {TIMELINE.map((ev, i) => {
          const col = COLORS[ev.phase] ?? '#007AFF';
          return (
            <motion.div key={i} role="listitem"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ ...spring, delay: i * 0.06 }}
              style={{ position: 'relative', marginBottom: '14px' }}>

              {/* Dot */}
              <div aria-hidden="true" style={{
                position: 'absolute', left: '-23px', top: '18px',
                width: '10px', height: '10px', borderRadius: '50%',
                background: col,
                border: '2.5px solid #F2F2F7',
                boxShadow: `0 0 0 2px ${col}50`,
                zIndex: 1,
              }} />

              {/* Card — iOS grouped cell */}
              <div style={{
                background: '#fff',
                borderRadius: '14px',
                padding: '16px 18px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                transition: 'transform 0.15s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.15s ease',
                cursor: 'default',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateX(4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 18px rgba(0,0,0,0.09)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)';
                }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.01em', textTransform: 'uppercase',
                    color: col, background: `${col}12`,
                    padding: '2px 10px', borderRadius: '100px',
                    letterSpacing: '0.02em',
                  }}>{ev.phase}</span>
                  <span style={{
                    fontSize: '12px', color: 'rgba(60,60,67,0.5)',
                    letterSpacing: '-0.01em',
                  }}>⏰ {ev.when}</span>
                </div>

                <h2 style={{
                  fontSize: '15px', fontWeight: 600,
                  color: '#000', marginBottom: '5px',
                  letterSpacing: '-0.015em',
                }}>{ev.title}</h2>
                <p style={{
                  fontSize: '13px', color: 'rgba(60,60,67,0.7)',
                  lineHeight: 1.55, letterSpacing: '-0.01em',
                }}>{ev.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
