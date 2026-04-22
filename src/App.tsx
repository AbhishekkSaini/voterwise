import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import type { SectionId } from './types';
import { initGA, trackEvent } from './lib/analytics';
import { h } from './lib/haptics';

// Lazy-load heavy sections for better efficiency / code splitting
const HomeSection     = lazy(() => import('./components/HomeSection'));
const GuideSection    = lazy(() => import('./components/GuideSection'));
const TimelineSection = lazy(() => import('./components/TimelineSection'));
const QuizSection     = lazy(() => import('./components/QuizSection'));
const ChatSection     = lazy(() => import('./components/ChatSection'));
const MapSection      = lazy(() => import('./components/MapSection'));

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string;

const SectionFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <div style={{
      width: '32px', height: '32px', borderRadius: '50%',
      border: '3px solid rgba(0,122,255,0.15)',
      borderTopColor: '#007AFF',
      animation: 'spin 0.7s linear infinite',
    }} aria-label="Loading section" role="status" />
  </div>
);

export default function App() {
  const [section, setSection] = useState<SectionId>('home');
  const [showTop, setShowTop] = useState(false);

  useEffect(() => { initGA(GA_ID); }, []);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navigate = useCallback((id: SectionId) => {
    setSection(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('Navigation', 'section_view', id);
    if (id === 'chat') toast('💡 Ask anything about elections!', { duration: 2000 });
  }, []);

  const renderSection = () => {
    switch (section) {
      case 'home':     return <HomeSection onNavigate={navigate} />;
      case 'guide':    return <GuideSection />;
      case 'timeline': return <TimelineSection />;
      case 'quiz':     return <QuizSection />;
      case 'chat':     return <ChatSection />;
      case 'map':      return <MapSection />;
      default:         return <HomeSection onNavigate={navigate} />;
    }
  };

  return (
    <div style={{ background: '#F2F2F7', minHeight: '100vh' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'rgba(50,50,50,0.92)',
            color: '#fff',
            border: 'none',
            borderRadius: '14px',
            fontSize: '14px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            padding: '12px 18px',
          },
          duration: 2000,
        }}
      />

      <Header active={section} onNavigate={navigate} />

      <main id="main-content" tabIndex={-1}>
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <ErrorBoundary>
              <Suspense fallback={<SectionFallback />}>
                {renderSection()}
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer role="contentinfo" style={{
        background: '#fff',
        borderTop: '0.5px solid rgba(60,60,67,0.13)',
        padding: '32px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{
              width: '26px', height: '26px', borderRadius: '7px',
              background: 'linear-gradient(145deg, #007AFF, #5AC8FA)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px',
            }} aria-hidden="true">🗳️</div>
            <span className="font-display" style={{ fontWeight: 700, fontSize: '15px', color: '#000', letterSpacing: '-0.02em' }}>
              VoterWise
            </span>
          </div>
          <p style={{ color: 'rgba(60,60,67,0.6)', fontSize: '13px', marginBottom: '6px', letterSpacing: '-0.01em' }}>
            Making democracy understandable for everyone.
          </p>
          <p style={{ color: 'rgba(60,60,67,0.35)', fontSize: '12px', letterSpacing: '-0.005em' }}>
            Powered by Google Gemini · Google Maps · Google Analytics · Google Fonts
          </p>
        </div>
      </footer>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => { h.tap(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{
              position: 'fixed', bottom: '28px', right: '24px',
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#007AFF', color: '#fff', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '16px',
              boxShadow: '0 4px 16px rgba(0,122,255,0.35)',
              zIndex: 50,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            aria-label="Scroll to top"
          >↑</motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
