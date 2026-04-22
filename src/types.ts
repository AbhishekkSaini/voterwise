// Election Step type
export interface ElectionStep {
  id: number;
  emoji: string;
  title: string;
  preview: string;
  desc: string;
  bullets: string[];
  tip: string;
  color: string;
}

// Timeline event type
export interface TimelineEvent {
  phase: string;
  color: string;
  when: string;
  title: string;
  desc: string;
}

// Quiz question type
export interface QuizQuestion {
  q: string;
  opts: string[];
  ans: number;
  exp: string;
}

// Chat message type
export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

// Nav section type
export type SectionId = 'home' | 'guide' | 'timeline' | 'quiz' | 'chat' | 'map';
