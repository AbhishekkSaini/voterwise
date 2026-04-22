import { useState, useRef, useCallback, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { askGemini } from '../lib/gemini';
import { SUGGESTIONS } from '../data';
import type { ChatMessage } from '../types';
import { trackEvent } from '../lib/analytics';
import { h } from '../lib/haptics';

const spring: Transition = { type: 'spring', stiffness: 320, damping: 28 };
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif';

function TypingDots() {
  return (
    <div style={{
      background: 'rgba(120,120,128,0.14)',
      borderRadius: '18px 18px 18px 4px',
      padding: '12px 16px',
      display: 'flex', alignItems: 'center', gap: '5px',
      width: 'fit-content',
    }} aria-label="Assistant is typing">
      {[1, 2, 3].map(i => (
        <span key={i} className={`dot-${i}`} style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: 'rgba(60,60,67,0.45)', display: 'block',
        }} aria-hidden="true" />
      ))}
    </div>
  );
}

export default function ChatSection() {
  const [msgs, setMsgs] = useState<ChatMessage[]>([{
    id: 'welcome', role: 'bot',
    text: '👋 Hi! I\'m your Election Guide powered by Gemini AI. Ask me anything about registering to vote, election day, how votes are counted, and more!',
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chars, setChars] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);

  const send = useCallback(async (text: string) => {
    const t = text.trim().slice(0, 500);
    if (!t || loading) return;
    h.press();
    const userMsg: ChatMessage = { id: `u${Date.now()}`, role: 'user', text: t, timestamp: new Date() };
    setMsgs(p => [...p, userMsg]); setInput(''); setChars(0); setLoading(true);
    trackEvent('Chat', 'message_sent', 'user_query');
    try {
      const reply = await askGemini(t);
      h.confirm();
      setMsgs(p => [...p, { id: `b${Date.now()}`, role: 'bot', text: reply, timestamp: new Date() }]);
    } catch {
      h.error();
      setMsgs(p => [...p, { id: `e${Date.now()}`, role: 'bot', text: '⚠️ Something went wrong. Please try again.', timestamp: new Date() }]);
    } finally { setLoading(false); inputRef.current?.focus(); }
  }, [loading]);

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  }
  const fmt = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <section id="section-chat" aria-labelledby="chat-heading" className="section-wrap">

      {/* Section header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{
          fontSize: '13px', fontWeight: 600,
          color: 'rgba(60,60,67,0.6)',
          letterSpacing: '0.02em', textTransform: 'uppercase',
          marginBottom: '6px',
        }}>Gemini AI</p>
        <h1 id="chat-heading" className="font-display"
          style={{
            fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 800,
            color: '#000', letterSpacing: '-0.03em', marginBottom: '6px',
          }}>
          Ask the AI Assistant
        </h1>
        <p style={{
          color: 'rgba(60,60,67,0.6)', fontSize: '15px',
          display: 'flex', alignItems: 'center', gap: '7px', letterSpacing: '-0.01em',
        }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#34C759', display: 'inline-block',
            animation: 'pulse 2s infinite',
          }} aria-hidden="true" />
          Powered by Google Gemini
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '16px', alignItems: 'start' }}
        className="chat-grid">

        {/* Suggestions sidebar — iOS grouped table */}
        <aside aria-labelledby="suggestions-label" style={{
          background: '#fff', borderRadius: '18px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
          overflow: 'hidden',
          position: 'sticky', top: '72px',
        }}>
          <div style={{ padding: '12px 16px 6px', borderBottom: '0.5px solid rgba(60,60,67,0.12)' }}>
            <h2 id="suggestions-label" style={{
              fontSize: '12px', fontWeight: 700,
              color: 'rgba(60,60,67,0.6)',
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>Questions</h2>
          </div>
          <ul style={{ listStyle: 'none' }}>
            {SUGGESTIONS.map((s, i) => (
              <li key={s}>
                <button onClick={() => { h.tap(); send(s); }} disabled={loading}
                  style={{
                    width: '100%', textAlign: 'left', fontSize: '13px',
                    color: loading ? 'rgba(60,60,67,0.3)' : '#007AFF',
                    background: 'transparent', border: 'none',
                    padding: '11px 16px', cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: SF, lineHeight: 1.4, letterSpacing: '-0.01em',
                    transition: 'background 0.13s ease',
                  }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,122,255,0.06)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  aria-label={`Ask: ${s}`}
                >{s}</button>
                {i < SUGGESTIONS.length - 1 && (
                  <div style={{ height: '0.5px', background: 'rgba(60,60,67,0.10)', marginLeft: '16px' }} />
                )}
              </li>
            ))}
          </ul>
        </aside>

        {/* Chat window — iMessage style */}
        <div style={{
          background: '#fff', borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
          display: 'flex', flexDirection: 'column', minHeight: '520px',
        }}>
          {/* iMessage-style nav bar */}
          <div style={{
            padding: '12px 18px',
            borderBottom: '0.5px solid rgba(60,60,67,0.12)',
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(242,242,247,0.8)',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(145deg, #007AFF, #5AC8FA)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
            }} aria-hidden="true">🗳️</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#000', letterSpacing: '-0.015em', fontFamily: SF }}>
                VoterWise AI
              </div>
              <div style={{ fontSize: '11px', color: '#34C759', fontWeight: 500, letterSpacing: '-0.005em' }}>
                ● Online
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '380px',
            background: '#F2F2F7',
          }}
            role="log" aria-live="polite" aria-label="Chat conversation" aria-relevant="additions">
            <AnimatePresence initial={false}>
              {msgs.map(m => (
                <motion.div key={m.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={spring}
                  style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '78%', display: 'flex',
                    flexDirection: 'column', gap: '3px',
                    alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
                  }}>
                    <div className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}
                      aria-label={`${m.role === 'user' ? 'You' : 'Assistant'}: ${m.text}`}>
                      {m.text}
                    </div>
                    <span style={{
                      fontSize: '10px', color: 'rgba(60,60,67,0.4)',
                      padding: '0 4px', fontFamily: SF,
                    }} aria-hidden="true">{fmt(m.timestamp)}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && <div style={{ display: 'flex' }}><TypingDots /></div>}
            <div ref={bottomRef} />
          </div>

          {/* Input bar — iMessage composer */}
          <div role="form" aria-label="Send message"
            style={{
              borderTop: '0.5px solid rgba(60,60,67,0.12)',
              padding: '12px 14px',
              display: 'flex', alignItems: 'flex-end', gap: '10px',
              background: '#fff',
            }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea ref={inputRef} value={input} rows={1} maxLength={500}
                disabled={loading}
                onChange={e => { if (e.target.value.length <= 500) { setInput(e.target.value); setChars(e.target.value.length); } }}
                onKeyDown={handleKey}
                placeholder="Ask anything about elections…"
                aria-label="Your question" aria-describedby="char-count"
                style={{
                  width: '100%',
                  background: '#F2F2F7',
                  border: '1.5px solid transparent',
                  borderRadius: '22px', padding: '10px 44px 10px 16px',
                  fontSize: '15px', color: '#000', resize: 'none',
                  outline: 'none', fontFamily: SF, lineHeight: 1.4,
                  maxHeight: '96px', letterSpacing: '-0.01em',
                  transition: 'border-color 0.16s, box-shadow 0.16s',
                }}
                onFocus={e => {
                  (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(0,122,255,0.40)';
                  (e.target as HTMLTextAreaElement).style.boxShadow = '0 0 0 3px rgba(0,122,255,0.12)';
                }}
                onBlur={e => {
                  (e.target as HTMLTextAreaElement).style.borderColor = 'transparent';
                  (e.target as HTMLTextAreaElement).style.boxShadow = 'none';
                }}
              />
              <span id="char-count" style={{
                position: 'absolute', bottom: '10px', right: '14px',
                fontSize: '10px', color: 'rgba(60,60,67,0.35)',
                fontFamily: SF,
              }} aria-live="polite">{chars > 400 ? `${chars}/500` : ''}</span>
            </div>

            {/* Send button — iMessage style circular */}
            <button onClick={() => send(input)} disabled={loading || !input.trim()}
              style={{
                width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                background: input.trim() && !loading ? '#007AFF' : 'rgba(120,120,128,0.18)',
                border: 'none',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.16s cubic-bezier(0.25,0.46,0.45,0.94)',
                transform: 'scale(1)',
                boxShadow: input.trim() && !loading ? '0 2px 8px rgba(0,122,255,0.35)' : 'none',
              }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.88)'; }}
              onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
              aria-label="Send message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={input.trim() && !loading ? '#fff' : 'rgba(60,60,67,0.35)'}
                strokeWidth="2.5" aria-hidden="true">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .chat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
