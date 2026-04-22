import { useEffect, useRef, useState } from 'react';
import type { SectionId } from '../types';
import { trackEvent } from '../lib/analytics';
import { h } from '../lib/haptics';

const NAV = [
  { id: 'home'     as SectionId, label: 'Home'       },
  { id: 'guide'    as SectionId, label: 'Step Guide' },
  { id: 'timeline' as SectionId, label: 'Timeline'   },
  { id: 'quiz'     as SectionId, label: 'Quiz'       },
  { id: 'chat'     as SectionId, label: 'Ask AI'     },
  { id: 'map'      as SectionId, label: 'Find Booth' },
];

interface Props { active: SectionId; onNavigate: (id: SectionId) => void; }

export default function Header({ active, onNavigate }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 1);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  function go(id: SectionId) {
    h.tap();
    onNavigate(id); setMenuOpen(false);
    trackEvent('Navigation', 'section_view', id);
  }

  return (
    <header role="banner" style={{
      position: 'sticky', top: 0, zIndex: 100,
      /* iOS translucent nav bar */
      background: scrolled
        ? 'rgba(242,242,247,0.85)'
        : 'rgba(242,242,247,0.75)',
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      borderBottom: scrolled
        ? '0.5px solid rgba(60,60,67,0.18)'
        : '0.5px solid transparent',
      transition: 'border-color 0.3s, background 0.3s',
    }}>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <div style={{
        maxWidth: '1080px', margin: '0 auto',
        padding: '0 20px', display: 'flex',
        alignItems: 'center', height: '52px', gap: '8px',
      }}>
        {/* Logo — SF style wordmark */}
        <button onClick={() => go('home')} aria-label="VoterWise home"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 8px 6px 0', borderRadius: '8px',
            touchAction: 'manipulation',
          }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '7px',
            background: 'linear-gradient(145deg, #007AFF, #5AC8FA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px',
            boxShadow: '0 2px 6px rgba(0,122,255,0.30)',
          }} aria-hidden="true">🗳️</div>
          <span className="font-display" style={{
            fontSize: '17px', fontWeight: 700,
            color: '#000',
            letterSpacing: '-0.025em',
          }}>VoterWise</span>
        </button>

        {/* Desktop nav — iOS segmented-control style spacing */}
        <nav className="hide-mobile" role="navigation" aria-label="Primary navigation"
          style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
          {NAV.map(item => {
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => go(item.id)}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  padding: '6px 13px', borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif',
                  background: isActive ? 'rgba(0,122,255,0.10)' : 'transparent',
                  color: isActive ? '#007AFF' : 'rgba(60,60,67,0.75)',
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                  transition: 'all 0.15s ease, transform 0.12s cubic-bezier(0.25,0.46,0.45,0.94)',
                  touchAction: 'manipulation',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.05)';
                    (e.currentTarget as HTMLButtonElement).style.color = '#000';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(60,60,67,0.75)';
                  }
                }}
              >{item.label}</button>
            );
          })}
        </nav>

        {/* Mobile menu button — SF Symbols hamburger */}
        <div ref={menuRef} className="show-mobile" style={{ marginLeft: 'auto', position: 'relative' }}>
          <button onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen} aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: menuOpen ? 'rgba(0,122,255,0.12)' : 'rgba(0,0,0,0.06)',
              border: 'none',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '4px',
              transition: 'all 0.2s',
              touchAction: 'manipulation',
            }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: 'block', width: '13px', height: '1.5px',
                background: menuOpen ? '#007AFF' : 'rgba(60,60,67,0.85)',
                borderRadius: '2px', transition: 'all 0.26s cubic-bezier(0.25,0.46,0.45,0.94)',
                transform: menuOpen
                  ? (i===0 ? 'rotate(45deg) translate(3.5px,3.5px)'
                   : i===1 ? 'scaleX(0)'
                   : 'rotate(-45deg) translate(3.5px,-3.5px)')
                  : 'none',
                opacity: menuOpen && i===1 ? 0 : 1,
              }} />
            ))}
          </button>

          {menuOpen && (
            <nav id="mobile-nav" role="navigation" aria-label="Mobile navigation"
              style={{
                position: 'absolute', top: '42px', right: 0,
                width: '210px',
                /* iOS action sheet / popover style */
                background: 'rgba(242,242,247,0.92)',
                backdropFilter: 'saturate(180%) blur(20px)',
                WebkitBackdropFilter: 'saturate(180%) blur(20px)',
                borderRadius: '14px', padding: '6px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex', flexDirection: 'column', gap: '1px',
              }}>
              {NAV.map((item, idx) => (
                <>
                  <button key={item.id} onClick={() => go(item.id)}
                    aria-current={active === item.id ? 'page' : undefined}
                    style={{
                      width: '100%', textAlign: 'left', padding: '11px 14px',
                      borderRadius: '9px', fontSize: '15px',
                      fontWeight: active === item.id ? 600 : 400,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif',
                      background: active === item.id ? 'rgba(0,122,255,0.10)' : 'transparent',
                      color: active === item.id ? '#007AFF' : '#000',
                      border: 'none', cursor: 'pointer',
                      letterSpacing: '-0.01em',
                      transition: 'background 0.13s ease',
                    }}>
                    {item.label}
                  </button>
                  {idx < NAV.length - 1 && (
                    <div style={{ height: '0.5px', background: 'rgba(60,60,67,0.12)', marginLeft: '14px' }} />
                  )}
                </>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
