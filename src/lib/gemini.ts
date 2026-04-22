import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

// Fallback answers when API key not configured
const FALLBACK: Record<string, string> = {
  register: '📋 To register to vote, visit your local government\'s official website or nearest election office. You\'ll need proof of identity, address, and citizenship. Registration deadlines vary — check your local rules!',
  id: '🪪 On voting day, bring a valid government-issued ID such as a passport, national ID card, or driver\'s licence. Requirements vary by country — always check official guidelines.',
  count: '🔢 After polls close, sealed ballot boxes go to counting centres. Official counters tally each ballot by hand or machine, watched by party agents and independent observers to ensure fairness.',
  polling: '🏫 A polling station is an official location (usually a school or community centre) where voters cast their ballots. Your registered address determines which station you\'re assigned to.',
  candidate: '🏛️ To stand as a candidate, you typically need citizenship, minimum age (18–25), no serious criminal record, nomination signatures, or a deposit. Requirements vary by country.',
  disputed: '⚖️ Disputed results can be challenged in an electoral court. An investigation reviews evidence. If irregularities are confirmed, a recount or re-election may be ordered.',
  term: '📅 Terms vary by position: Presidents typically serve 4–5 years, MPs 4–5 years, local councillors 2–4 years. Most democracies have term limits to prevent power concentration.',
  ballot: '🗳️ A ballot is your official voting form. It lists all candidates (and parties). You mark your choice privately and deposit it in the ballot box. Your vote is completely secret!',
  default: '🗳️ Great question! The election process follows 6 key steps: 1️⃣ Voter Registration → 2️⃣ Campaign Period → 3️⃣ Election Day → 4️⃣ Vote Counting → 5️⃣ Results Announcement → 6️⃣ Inauguration. Explore the Step Guide for details on each phase!'
};

function getFallbackAnswer(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('register') || lower.includes('sign up')) return FALLBACK.register;
  if (lower.includes(' id') || lower.includes('document') || lower.includes('bring') || lower.includes('identification')) return FALLBACK.id;
  if (lower.includes('count') || lower.includes('tally') || lower.includes('counting')) return FALLBACK.count;
  if (lower.includes('polling') || lower.includes('station') || lower.includes('booth')) return FALLBACK.polling;
  if (lower.includes('candidate') || lower.includes('stand') || lower.includes('run for')) return FALLBACK.candidate;
  if (lower.includes('disput') || lower.includes('challenge') || lower.includes('fraud')) return FALLBACK.disputed;
  if (lower.includes('term') || lower.includes('how long') || lower.includes('year')) return FALLBACK.term;
  if (lower.includes('ballot') || lower.includes('paper') || lower.includes('vote form')) return FALLBACK.ballot;
  return FALLBACK.default;
}

const SYSTEM_PROMPT = `You are VoterWise, a friendly election education assistant. Your role is to explain the election process to beginners in simple, clear language — like explaining to a 10-year-old but respectfully.

Always:
- Keep answers concise (3–5 sentences max)
- Use simple, everyday language — no jargon
- Add 1–2 relevant emojis to make responses friendly
- Focus only on election/democracy/voting topics
- If asked about something unrelated, politely redirect to elections

Context: You help users understand voter registration, campaign periods, election day procedures, vote counting, result announcements, and inaugurations.`;

export async function askGemini(userMessage: string): Promise<string> {
  // Validate input
  const sanitized = userMessage.trim().slice(0, 500);
  if (!sanitized) return FALLBACK.default;

  // Check for API key
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    // Graceful fallback
    return getFallbackAnswer(sanitized);
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(sanitized);
    const response = result.response.text();
    return response || getFallbackAnswer(sanitized);
  } catch (error: unknown) {
    console.error('Gemini API error:', error);
    // Always fallback gracefully — never crash
    return getFallbackAnswer(sanitized);
  }
}
