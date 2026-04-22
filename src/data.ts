import type { ElectionStep, TimelineEvent, QuizQuestion } from './types';

export const STEPS: ElectionStep[] = [
  {
    id: 1, emoji: '📋', color: '#4f8ef7',
    title: 'Voter Registration',
    preview: 'Sign up to be eligible to vote.',
    desc: 'Voter registration is the very first step. Citizens must register with their local government to confirm they are eligible to vote. This ensures only qualified citizens participate.',
    bullets: ['Provide name, address, and valid ID', 'Check eligibility: age 18+, citizenship', 'Register before the official deadline', 'Update registration if you move homes'],
    tip: '💡 Most countries allow online registration. Visit your government\'s official website!'
  },
  {
    id: 2, emoji: '📣', color: '#a78bfa',
    title: 'Campaign Period',
    preview: 'Candidates share their vision with voters.',
    desc: 'During the campaign period, candidates travel, give speeches, hold debates, and run advertisements to convince voters to choose them. This is your chance to learn about each candidate.',
    bullets: ['Candidates announce their policies', 'Public debates are broadcast on TV/online', 'Political advertisements appear everywhere', 'Voters research and evaluate each candidate'],
    tip: '💡 Watch official debates and read candidate manifestos to make an informed, educated vote!'
  },
  {
    id: 3, emoji: '🗓️', color: '#34d399',
    title: 'Election Day',
    preview: 'Citizens cast their votes at polling stations.',
    desc: 'Election Day is the big day! Registered voters go to their assigned polling station, verify their identity, receive a ballot, and privately mark their choice before depositing it in the ballot box.',
    bullets: ['Bring valid government-issued ID', 'Go to your assigned polling station', 'Mark your ballot privately in a booth', 'Deposit ballot in the sealed box'],
    tip: '💡 Polls are usually open 7am–8pm. Check your local schedule and plan ahead!'
  },
  {
    id: 4, emoji: '🔢', color: '#f472b6',
    title: 'Vote Counting',
    preview: 'Officials tally every single ballot carefully.',
    desc: 'After polls close, sealed ballot boxes are taken to counting centres. Election officials count every ballot under strict observation by representatives from all political parties.',
    bullets: ['Ballot boxes are sealed and transported', 'Counting happens in certified centres', 'Party agents observe the entire process', 'Each vote is recorded and verified'],
    tip: '💡 Counting can take hours or even days in large elections. Patience is key!'
  },
  {
    id: 5, emoji: '📊', color: '#fbbf24',
    title: 'Result Announcement',
    preview: 'Winners are declared based on final vote totals.',
    desc: 'Once all votes are counted, the Election Commission publicly announces the official results. The candidate who meets the required vote threshold wins the election.',
    bullets: ['Results published on official channels', 'Winning candidate is formally declared', 'Losing candidates may concede or challenge', 'Media broadcasts results nationwide'],
    tip: '💡 Results can be legally challenged in electoral court if irregularities are suspected.'
  },
  {
    id: 6, emoji: '🏛️', color: '#34d399',
    title: 'Inauguration',
    preview: 'The winner is officially sworn into power.',
    desc: 'The elected official takes a formal oath of office during a public inauguration ceremony. This marks the peaceful transfer or continuation of power — democracy in action!',
    bullets: ['Official oath of office ceremony held', 'New government cabinet is formed', 'Policy implementation begins', 'Democratic cycle continues peacefully'],
    tip: '💡 The inauguration is a public celebration of democracy — a milestone for every citizen!'
  }
];

export const TIMELINE: TimelineEvent[] = [
  { phase: 'Pre-Election', color: '#4f8ef7', when: '12+ Months Before', title: 'Election Date Announced', desc: 'The government or election commission officially announces the upcoming election date and begins administrative preparations.' },
  { phase: 'Pre-Election', color: '#4f8ef7', when: '6–12 Months Before', title: 'Voter Registration Opens', desc: 'Citizens can register or update their voter details. Candidates begin forming their campaign teams informally.' },
  { phase: 'Campaign', color: '#a78bfa', when: '3–6 Months Before', title: 'Official Campaign Period Begins', desc: 'Candidates officially declare their candidacy. Parties nominate representatives and active public campaigning starts.' },
  { phase: 'Campaign', color: '#a78bfa', when: '1–2 Months Before', title: 'Debates & Final Push', desc: 'Major televised debates take place. Candidates focus on undecided voters with rallies, ads, and social media campaigns.' },
  { phase: 'Voting', color: '#34d399', when: 'Election Day 🗳️', title: 'Polls Open — Cast Your Vote!', desc: 'Polling stations open nationwide. Registered voters cast their secret ballots throughout the designated voting hours.' },
  { phase: 'Voting', color: '#34d399', when: 'Election Night', title: 'Polls Close — Counting Begins', desc: 'All ballot boxes are sealed and transported to counting centres. The official count begins under party observation.' },
  { phase: 'Post-Election', color: '#f472b6', when: '1–7 Days After', title: 'Official Results Declared', desc: 'The Election Commission announces verified results. Winners and losers are officially notified and results published.' },
  { phase: 'Post-Election', color: '#f472b6', when: 'Weeks After', title: 'Inauguration & New Term Begins', desc: 'The winning candidate takes their oath of office and officially assumes their role. The new government is formed.' }
];

export const QUIZ: QuizQuestion[] = [
  { q: 'What must you do BEFORE you can vote in an election?', opts: ['Pay a voting fee', 'Register as a voter', 'Pass a written test', 'None of the above'], ans: 1, exp: 'You must register as a voter before election day. This confirms your eligibility and adds your name to the official voters\' list.' },
  { q: 'Where do registered voters go to cast their ballot?', opts: ['City Hall', 'The candidate\'s headquarters', 'A polling station', 'An online website'], ans: 2, exp: 'Voters go to their assigned polling station — an official location where voting takes place on election day.' },
  { q: 'What happens immediately after all polls close on election day?', opts: ['Results are immediately posted online', 'Votes are counted by officials', 'The election is cancelled', 'Candidates give victory speeches'], ans: 1, exp: 'After polls close, election officials begin the careful counting process, observed by party representatives to ensure fairness.' },
  { q: 'During the campaign period, what do candidates mainly do?', opts: ['Count votes early', 'Take their oath of office', 'Present ideas and seek voter support', 'Register new voters'], ans: 2, exp: 'During campaigns, candidates travel, debate opponents, and present their policies to persuade voters to support them.' },
  { q: 'What ceremony marks the official start of an elected official\'s term?', opts: ['The Election Debate', 'The Inauguration', 'The Voter Registration', 'The Campaign Launch'], ans: 1, exp: 'The inauguration is where the winning candidate takes an official oath of office and formally begins their term.' },
  { q: 'Who observes vote counting to ensure it is fair?', opts: ['Only senior government officials', 'Only TV journalists', 'Party agents and independent observers', 'The winning candidate\'s team only'], ans: 2, exp: 'Representatives from all parties and independent observers monitor counting to ensure it is fair, transparent, and accurate.' },
  { q: 'What is a "ballot"?', opts: ['A voting station building', 'The form used to cast your vote', 'A political party advertisement', 'A voter registration document'], ans: 1, exp: 'A ballot is the official form or card you mark to record your vote. It lists all candidates and is kept completely private.' },
  { q: 'What does the principle "one person, one vote" mean?', opts: ['Only one political party can run', 'Every registered voter gets exactly one equal vote', 'You can vote once per calendar year', 'Candidates vote before citizens'], ans: 1, exp: '"One person, one vote" ensures every eligible citizen has exactly equal voting power — a core principle of democracy.' },
  { q: 'How long before election day does voter registration typically close?', opts: ['On election day itself', 'A few weeks to months before', 'The day before only', 'After the election results'], ans: 1, exp: 'Registration closes weeks or months before election day to give officials time to verify and process all voter information.' },
  { q: 'If an election result is disputed, what can a candidate do?', opts: ['Start campaigning again immediately', 'File a legal challenge in electoral court', 'Simply ignore the results', 'Demand an immediate re-vote'], ans: 1, exp: 'Candidates can legally challenge results in court if they believe irregularities occurred. An investigation is then conducted.' }
];

export const SUGGESTIONS = [
  'How do I register to vote?',
  'What ID do I need on voting day?',
  'How are votes counted fairly?',
  'What is a polling station?',
  'Who can stand as a candidate?',
  'What happens if results are disputed?',
  'How long is an election term?',
  'What is a ballot paper?',
  'What is the campaign period?',
  'Why is voting important?'
];
