<div align="center">

# 🗳️ VoterWise

### *Making Democracy Understandable for Everyone*

An intelligent, interactive election education assistant powered by **Google Gemini AI** — designed to help first-time voters understand the complete election process through guided steps, timelines, quizzes, and real-time AI answers.

<br />

[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Gemini AI](https://img.shields.io/badge/Gemini_1.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Google Maps](https://img.shields.io/badge/Google_Maps-34A853?style=for-the-badge&logo=google-maps&logoColor=white)](https://developers.google.com/maps)
[![Analytics](https://img.shields.io/badge/Google_Analytics_4-E37400?style=for-the-badge&logo=google-analytics&logoColor=white)](https://analytics.google.com)

</div>

---

## 📌 Challenge Vertical

> **Civic & Democracy Education**

VoterWise addresses a critical real-world problem: millions of eligible citizens — especially first-time voters — don't participate in elections because the process feels confusing, intimidating, or inaccessible. VoterWise solves this by making every step of the election journey clear, interactive, and approachable for anyone.

---

## ✨ Features at a Glance

| # | Feature | Description |
|---|---|---|
| 1 | 📋 **Step-by-Step Guide** | 6 interactive phases from registration to inauguration — tap any step to expand it |
| 2 | 📅 **Election Timeline** | Visual colour-coded timeline showing when each phase happens in the election cycle |
| 3 | 🧠 **Knowledge Quiz** | 10 questions with instant right/wrong feedback, explanations, and a final score |
| 4 | 💬 **Gemini AI Chat** | Real-time Q&A powered by Google Gemini 1.5 Flash with a custom election-focused system prompt |
| 5 | 📍 **Polling Booth Finder** | Google Maps + Places API to locate the nearest official polling stations |
| 6 | 📳 **Haptic Feedback** | iOS Taptic Engine-style vibration patterns on every interaction |

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────┐
│                     VoterWise SPA                       │
│                   (React 19 + Vite)                     │
├──────────┬──────────┬──────────┬───────────┬────────────┤
│  Guide   │ Timeline │   Quiz   │  AI Chat  │    Map     │
│ Section  │ Section  │ Section  │  Section  │  Section   │
├──────────┴──────────┴──────────┼───────────┼────────────┤
│         Local Data (data.ts)   │  Gemini   │  Google    │
│  steps · timeline · quiz · Q&A │  1.5 Flash│  Maps API  │
├────────────────────────────────┼───────────┼────────────┤
│         lib/analytics.ts       │  GA4      │  Places    │
│   (Google Analytics 4 events)  │  Events   │  API       │
└────────────────────────────────┴───────────┴────────────┘
```

### AI Decision Flow

```
User Question
     │
     ▼
Input validation (trim, max 500 chars)
     │
     ├─── No API key? ──→ Keyword-matched fallback answer (8 patterns)
     │
     ▼
Google Gemini 1.5 Flash
     │  System prompt:
     │  · Election topics only
     │  · Beginner-friendly language
     │  · Max 3–5 sentences
     │  · Friendly emoji tone
     │
     ├─── API error? ──→ Keyword-matched fallback answer
     │
     ▼
Response displayed as iMessage-style chat bubble
     + haptic "confirm" feedback pattern
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React 19 + TypeScript | Component architecture, strict typing |
| **Build Tool** | Vite 8 | Ultra-fast HMR, tree-shaking, optimised bundles |
| **Styling** | Custom CSS Design System | Apple-inspired tokens, SF Pro font stack |
| **Animation** | Framer Motion | Spring physics (stiffness: 320, damping: 28) |
| **Haptics** | Web Vibration API | iOS Taptic Engine-inspired patterns |
| **AI** | Google Gemini 1.5 Flash | Natural language election Q&A |
| **Maps** | Google Maps JS API + Places API | Polling booth location |
| **Analytics** | Google Analytics 4 | Behaviour tracking with `anonymize_ip` |
| **Fonts** | SF Pro system stack + Inter | Native feel on Apple devices |
| **Linting** | ESLint + TypeScript-ESLint | Code quality enforcement |

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in your keys:

```env
# Google Gemini AI — Required for live AI chat
# Get yours free at: https://aistudio.google.com
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Google Maps — Optional (embedded demo map shown without it)
# Enable: Maps JavaScript API + Places API
# Get yours at: https://console.cloud.google.com
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Google Analytics 4 — Optional (skipped gracefully if missing)
# Get yours at: https://analytics.google.com → Create Property
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

> ⚠️ **Security**: `.env` is in `.gitignore` and will **never** be committed. Only `.env.example` (with placeholder values) is tracked in Git.

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/voterwise.git
cd voterwise

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Open .env and add your API keys

# 4. Start development server
npm run dev
# → App runs at http://localhost:5173

# 5. Build for production
npm run build
npm run preview
```

---

## 🏆 Evaluation Criteria — Full Coverage

### 1. 🤖 Smart, Dynamic Assistant

- **Gemini 1.5 Flash** with a custom system prompt tuned specifically for election education
- Persona: "VoterWise" — friendly, beginner-focused, emoji-enhanced, 3–5 sentence answers
- **8-pattern keyword fallback** — works even without an API key:
  - `register` → voter registration guide
  - `id / bring / document` → ID requirements
  - `count / tally` → vote counting process
  - `polling / booth / station` → polling station info
  - `candidate / stand / run` → candidacy requirements
  - `disput / challenge / fraud` → result disputes
  - `term / how long` → term lengths
  - `ballot / paper` → ballot explanation
- **Haptic intelligence** — correct answer → `success` pattern, wrong → `error` pattern, response received → `confirm` pattern

---

### 2. 🧠 Logical Decision Making

| Scenario | Response |
|---|---|
| No Gemini API key | Keyword-matched local fallback — never crashes |
| No Maps API key | Real Google Maps embed always visible |
| No GA4 ID | Analytics silently skipped |
| Input > 500 chars | Truncated before any API call |
| Empty input | Send button disabled, no API call made |
| Network failure | Error toast + `error` haptic pattern |
| Quiz correct | `confirm` haptic + green feedback card |
| Quiz wrong | `error` haptic + red feedback + correct answer shown |

---

### 3. 🌐 Google Services Integration

| Service | Integration | Where |
|---|---|---|
| **Gemini 1.5 Flash** | `@google/generative-ai` SDK | AI Chat section |
| **Maps JavaScript API** | Dynamic script injection | Find Booth (with key) |
| **Places API** | `nearbySearch` — `keyword: 'polling booth election'` | Find Booth (with key) |
| **Maps Embed API** | `<iframe>` — no key required | Find Booth (always visible) |
| **Google Analytics 4** | `gtag.js` dynamically loaded | All sections |
| **Google Fonts** | `fonts.googleapis.com` preconnect | Body typography |

**GA4 Events tracked:**

```
Navigation → section_view       (every section switch)
Guide      → step_viewed        (each step expanded)
Quiz       → quiz_started       (quiz begins)
Quiz       → correct_answer     (right answer selected)
Quiz       → wrong_answer       (wrong answer selected)
Quiz       → quiz_completed     (score_N)
Chat       → message_sent       (every question asked)
```

---

### 4. ✅ Code Quality

```
voterwise/
├── src/
│   ├── components/          # One file per UI section — single responsibility
│   │   ├── Header.tsx       # iOS-style sticky navigation bar
│   │   ├── HomeSection.tsx  # Hero + feature cards + Google services list
│   │   ├── GuideSection.tsx # 6-step expandable guide with progress tracker
│   │   ├── TimelineSection.tsx  # Colour-coded election timeline
│   │   ├── QuizSection.tsx  # 10-question quiz with scoring engine
│   │   ├── ChatSection.tsx  # iMessage-style Gemini AI chat
│   │   └── MapSection.tsx   # Google Maps polling booth finder
│   ├── lib/
│   │   ├── gemini.ts        # Gemini API + 8-pattern keyword fallback
│   │   ├── analytics.ts     # GA4 dynamic loader + trackEvent()
│   │   └── haptics.ts       # Web Vibration API — iOS Taptic patterns
│   ├── data.ts              # All election content — steps, quiz, timeline, suggestions
│   ├── types.ts             # TypeScript interfaces — ElectionStep, ChatMessage, etc.
│   ├── index.css            # Apple design system tokens (CSS custom properties)
│   ├── App.tsx              # Root — section routing + scroll-to-top FAB
│   └── main.tsx             # React 19 entry point
├── index.html               # Full SEO + Apple PWA + schema.org markup
├── .env.example             # Safe key template (committed)
├── .gitignore               # Excludes .env, node_modules, dist
├── vite.config.ts           # Vite + React + Tailwind plugins
└── README.md
```

**Code standards enforced:**
- ✅ TypeScript strict mode — zero `any` types
- ✅ `unknown` in all catch blocks
- ✅ Named exports throughout
- ✅ `useCallback` on all event handlers (Quiz, Chat)
- ✅ ESLint + TypeScript-ESLint configured

---

### 5. 🔒 Security

| Measure | Implementation |
|---|---|
| API key protection | All keys in `.env` — explicitly gitignored, never hardcoded |
| Input sanitisation | `userMessage.trim().slice(0, 500)` before any API call |
| XSS prevention | No `dangerouslySetInnerHTML` used anywhere |
| External link safety | `rel="noopener noreferrer"` on all `target="_blank"` links |
| iframe security | `referrerPolicy="no-referrer-when-downgrade"` on Maps embed |
| Analytics privacy | `anonymize_ip: true` in GA4 config |
| Graceful degradation | All API failures caught — never exposed to user as raw errors |

---

### 6. ⚡ Efficiency

| Optimisation | How |
|---|---|
| Build speed | Vite — instant HMR, native ES modules |
| Bundle size | Tree-shaking, no unused imports |
| Animation cost | `viewport: { once: true }` — Framer Motion fires once per element |
| Script loading | Maps API script injected only if API key exists |
| Analytics loading | GA4 script loaded only if a real Measurement ID is present |
| Re-render prevention | `useCallback` on all handlers in Quiz and Chat |
| Font loading | `<link rel="preconnect">` to Google Fonts for faster FOUT resolution |

---

### 7. ♿ Accessibility — WCAG 2.1 AA

| Feature | Implementation |
|---|---|
| Landmarks | `role="banner"` · `role="main"` · `role="navigation"` · `role="contentinfo"` |
| Skip link | `.skip-link` — jumps to `#main-content` for keyboard users |
| Headings | Single `<h1>` per section with `aria-labelledby` pairing |
| Live regions | `aria-live="polite"` on chat log, quiz question, feedback |
| Progress | `role="progressbar"` + `aria-valuenow/min/max` on quiz & guide |
| Current page | `aria-current="page"` on active nav item |
| Pressed state | `aria-pressed` on quiz answer buttons |
| Icon buttons | `aria-label` on all icon-only buttons |
| Focus ring | 3.5px Apple-blue `:focus-visible` outline |
| Keyboard nav | Enter/Space activates all card elements |
| Screen readers | `aria-hidden="true"` on decorative emoji |
| Tap delay | `touch-action: manipulation` — eliminates 300ms mobile delay |
| Tap highlight | `-webkit-tap-highlight-color: transparent` — no blue flash |

---

## 📱 Design System

VoterWise uses an **Apple Human Interface Guidelines-inspired** design system:

```css
/* Font — Real SF Pro on Apple devices, Inter on others */
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif;

/* iOS System Colors */
--apple-blue:   #007AFF;   /* Primary accent            */
--apple-green:  #34C759;   /* Success / correct          */
--apple-red:    #FF3B30;   /* Error / wrong              */
--apple-orange: #FF9500;   /* Warning / post-election    */

/* iOS Grouped Backgrounds */
--bg-primary:   #F2F2F7;   /* Page background (iOS grey) */
--bg-secondary: #FFFFFF;   /* Card surface               */

/* Separator */
--separator:    rgba(60,60,67,0.13);   /* 0.5px hairline */
```

**Interaction physics:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — Apple's standard easing  
**Spring animations:** `stiffness: 320, damping: 28` — snappy like iOS  
**Button shape:** `border-radius: 980px` — Apple's pill buttons  
**Press feedback:** `scale(0.94–0.97)` on `:active` — simulates physical press

---

## 🧩 Assumptions Made

1. **Target users** are first-time voters with basic smartphone literacy
2. **Election context** defaults to India (New Delhi map centre) — adaptable for any country
3. **Internet required** for Gemini AI and Maps features; core content works offline
4. **English language** — primary interface (ready for i18n expansion)
5. **No login/auth** — anonymous-first to reduce friction for new users
6. **Simplified legal** — educational content only, not official government advice

---

## 📄 Licence

This project was built for the **Google Antigravity Hackathon** — Civic Technology Challenge.

---

<div align="center">

**VoterWise** — empowering every citizen to participate in democracy with confidence.

*Built with ❤️ using Google Gemini · Maps · Analytics · Vite · React · TypeScript*

</div>
