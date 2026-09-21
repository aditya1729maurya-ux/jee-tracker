import React, { useState, useEffect, useMemo, useRef, Component } from 'react';
import {
  BookOpen, CheckCircle, AlertTriangle, HelpCircle, RotateCcw,
  BarChart2, Brain, Timer, Search, Bell, Settings, Plus,
  Trash2, Edit3, ArrowRight, Play, Pause, RefreshCw, Award,
  Flame, Calendar, FileText, CheckSquare, Target, ChevronRight,
  TrendingUp, AlertCircle, ShieldAlert, Sparkles, Send, X,
  Download, Upload, Clock, BookMarked, Layers, Eye, Paperclip,
  Image as ImageIcon, MessageSquare, Check, XCircle, Database, Menu
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem'; // enables \ce{...} chemistry equations

function BadeBhaiyaLogo({ className = "w-6 h-6", glow = true }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {glow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/30 to-indigo-500/30 blur-sm pointer-events-none" />
      )}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-md"
      >
        <defs>
          <linearGradient id="bb-grad-bg" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0f172a" />
            <stop offset="0.5" stopColor="#1e1b4b" />
            <stop offset="1" stopColor="#090d16" />
          </linearGradient>
          <linearGradient id="bb-grad-border" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22d3ee" />
            <stop offset="0.5" stopColor="#818cf8" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="bb-grad-mentor" x1="14" y1="12" x2="34" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        {/* Hexagonal Shield */}
        <polygon
          points="24,3 43,13.5 43,34.5 24,45 5,34.5 5,13.5"
          fill="url(#bb-grad-bg)"
          stroke="url(#bb-grad-border)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Mentor Cap / Crown Line */}
        <path
          d="M13 18.5L24 13L35 18.5L24 24L13 18.5Z"
          fill="url(#bb-grad-mentor)"
          fillOpacity="0.85"
        />
        <path
          d="M35 18.5V25"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Approachable Mentor Crest / Face Node */}
        <circle cx="24" cy="27" r="4.2" fill="#e0e7ff" />
        {/* Shoulders / Foundation */}
        <path
          d="M16 38C16 33 19.5 31.5 24 31.5C28.5 31.5 32 33 32 38"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Guiding Star / Spark */}
        <circle cx="36" cy="13" r="1.5" fill="#22d3ee" className="animate-pulse" />
      </svg>
    </div>
  );
}

// Gemini sometimes emits \( ... \) and \[ ... \] instead of $...$ and $$...$$.
// remark-math only understands the dollar form, so convert the bracket forms.
// This only rewrites math delimiters; all other text is left untouched.
function normalizeMathDelimiters(input: string): string {
  if (!input) return '';
  let out = input;
  // \[ ... \]  ->  $$ ... $$   (display math)
  out = out.replace(/\\\[([\s\S]*?)\\\]/g, (_m, inner: string) => `\n$$\n${inner.trim()}\n$$\n`);
  // \( ... \)  ->  $ ... $     (inline math)
  out = out.replace(/\\\(([\s\S]*?)\\\)/g, (_m, inner: string) => `$${inner.trim()}$`);
  return out;
}

// Styling maps 1:1 onto the previous look (same colors / sizes).
// No raw HTML is ever rendered: react-markdown does not parse HTML by
// default (no rehype-raw), and we never use dangerouslySetInnerHTML.
const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="font-black text-white text-base mt-3 mb-1 border-b border-indigo-500/50 pb-1">{children}</h2>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="font-extrabold text-white text-sm mt-2.5 mb-1 border-b border-slate-700/60 pb-0.5">{children}</h3>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="font-bold text-cyan-300 text-xs mt-2 mb-0.5">{children}</h4>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="font-bold text-cyan-300 text-xs mt-2 mb-0.5">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="leading-relaxed text-xs text-slate-200 break-words">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-bold text-cyan-300">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-slate-300">{children}</em>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-1.5 pl-5 list-disc space-y-1 text-slate-200">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-1.5 pl-5 list-decimal space-y-1 text-slate-200">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-xs leading-relaxed break-words">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="my-1.5 pl-3 border-l-2 border-indigo-500/50 text-slate-300">{children}</blockquote>
  ),
  hr: () => <hr className="my-2 border-slate-700/60" />,
  a: ({ children }: { children?: React.ReactNode }) => (
    // Links from AI output are shown as plain styled text (not clickable),
    // which avoids any navigation surprises inside the Capacitor WebView.
    <span className="text-cyan-300 underline">{children}</span>
  ),
  // Inline code vs fenced code block.
  code: ({ className, children }: { className?: string; children?: React.ReactNode }) => {
    const isBlock = /language-/.test(className || '');
    if (isBlock) {
      return <code className="font-mono text-[11px] text-amber-300">{children}</code>;
    }
    return (
      <code className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded font-mono text-[11px] border border-slate-800">
        {children}
      </code>
    );
  },
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="my-1.5 p-2 rounded-lg bg-slate-950 border border-slate-800 overflow-x-auto max-w-full whitespace-pre">{children}</pre>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-1.5 overflow-x-auto max-w-full">
      <table className="text-xs border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="border border-slate-700 px-2 py-1 text-left font-bold text-cyan-300">{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="border border-slate-700 px-2 py-1">{children}</td>
  ),
};

// Single source of truth for rendering AI messages.
// Markdown + KaTeX math, safe by default (no raw HTML, no dangerouslySetInnerHTML).
function FormattedMessage({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="ai-markdown space-y-1 min-w-0 max-w-full whitespace-normal">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        // throwOnError:false  -> a malformed formula shows the source text in
        //                        red instead of crashing the whole message.
        // strict:'ignore'     -> don't spam the console for harmless LaTeX quirks.
        // trust is left at its safe default (false): \href / \url style
        // commands that could inject links or run code are disabled.
        rehypePlugins={[[rehypeKatex, { throwOnError: false, errorColor: '#fda4af', strict: 'ignore' }]]}
        components={markdownComponents}
      >
        {normalizeMathDelimiters(text)}
      </ReactMarkdown>
    </div>
  );
}

function SplashScreen({ onFinish }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 2200);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-slate-950 text-slate-100 font-mono flex flex-col justify-between items-center py-10 px-6 transition-opacity duration-500 select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-xs tracking-wider text-cyan-400 font-bold animate-pulse text-center">
        âœ¨Welcome ARJUNA ðŸŽ“
      </div>

      <div className="flex flex-col items-center gap-3 transform transition-all duration-700">
        <BadeBhaiyaLogo className="w-16 h-16 shadow-2xl" glow={true} />
        <div className="text-center mt-2">
          <h1 className="text-2xl font-black tracking-widest bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            JEE TRACKER
          </h1>
          <p className="text-[11px] text-slate-400 tracking-widest uppercase mt-1">
            PW Class 11 Command Center
          </p>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 tracking-wider text-center">
        Made with â¤ï¸â€ðŸ©¹ by ADITYA MAURYA
      </div>
    </div>
  );
}

const DB_NAME = 'JEE_COMMAND_CENTER_STORAGE_V2';
const DB_STORE = 'app_data_store';
const DB_KEY = 'user_jee_data';

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

async function loadPersistedState() {
  try {
    const db = await openDB();
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction(DB_STORE, 'readonly');
        const store = tx.objectStore(DB_STORE);
        const req = store.get(DB_KEY);
        req.onsuccess = () => {
          if (req.result) {
            resolve(req.result);
          } else {
            // Check fallback
            try {
              const raw = localStorage.getItem(DB_KEY);
              resolve(raw ? JSON.parse(raw) : null);
            } catch {
              resolve(null);
            }
          }
        };
        req.onerror = () => resolve(null);
      });
    } else {
      const raw = localStorage.getItem(DB_KEY);
      return raw ? JSON.parse(raw) : null;
    }
  } catch (e) {
    console.warn("Storage load exception:", e);
    return null;
  }
}

async function savePersistedState(data) {
  try {
    // Local backup
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch {}
    // IndexedDB
    const db = await openDB();
    if (db) {
      const tx = db.transaction(DB_STORE, 'readwrite');
      const store = tx.objectStore(DB_STORE);
      store.put(data, DB_KEY);
    }
  } catch (e) {
    console.warn("Storage save exception:", e);
  }
}

const INITIAL_STATE = {
  backlogLectures: [],
  pwSchedule: [],
  tasks: [],
  dpps: [],
  errorBook: [],
  doubts: [],
  revisions: [],
  tests: [],
  pyqModules: [],
  notes: [],
  focusSessions: [],
  reminders: [],
  comebackSettings: {
    targetDays: 21
    // Zero hardcoded assumptions. No fixed classesPerWeek default!
  },
  chatSessions: [
    {
      id: 'sess_1',
      title: 'à¤¬à¤¾à¤¤à¤šà¥€à¤¤ 1 (Main Session)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg_welcome',
          sender: 'ai',
          text: 'à¤¨à¤®à¤¸à¥à¤¤à¥‡ à¤›à¥‹à¤Ÿà¥‡! à¤®à¥ˆà¤‚ à¤¹à¥‚à¤ à¤¤à¥à¤®à¥à¤¹à¤¾à¤°à¤¾ "à¤¬à¤¡à¤¼à¥‡ à¤­à¥ˆà¤¯à¤¾".\n\nà¤¯à¤¾à¤¦ à¤°à¤–à¤¨à¤¾: à¤®à¥ˆà¤‚ à¤•à¥‡à¤µà¤² à¤¤à¥à¤®à¥à¤¹à¤¾à¤°à¥‡ à¤µà¤¾à¤¸à¥à¤¤à¤µà¤¿à¤• à¤¦à¤°à¥à¤œ à¤•à¤¿à¤ à¤—à¤ à¤¡à¥‡à¤Ÿà¤¾ à¤ªà¤° à¤¬à¤¾à¤¤ à¤•à¤°à¥‚à¤à¤—à¤¾â€”à¤•à¥‹à¤ˆ à¤«à¤°à¥à¤œà¤¼à¥€ à¤ªà¥à¤°à¥‹à¤—à¥à¤°à¥‡à¤¸ à¤¯à¤¾ à¤•à¤¾à¤²à¥à¤ªà¤¨à¤¿à¤• à¤…à¤‚à¤• à¤¨à¤¹à¥€à¤‚. à¤…à¤ªà¤¨à¤¾ à¤¬à¥ˆà¤•à¤²à¤¾à¤—, à¤†à¤œ à¤•à¥€ PW à¤•à¥à¤²à¤¾à¤¸, à¤•à¥‹à¤ˆ à¤¸à¤µà¤¾à¤² à¤¯à¤¾ à¤Ÿà¥‡à¤¸à¥à¤Ÿ à¤•à¤¾ à¤¸à¥à¤•à¥à¤°à¥€à¤¨à¤¶à¥‰à¤Ÿ à¤¯à¤¹à¤¾à¤ à¤¶à¥‡à¤¯à¤° à¤•à¤°à¥‹!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }
  ],
  activeSessionId: 'sess_1'
};

const SUBJECT_PRESETS = {
  Physics: {
    nameHindi: 'à¤­à¥Œà¤¤à¤¿à¤•à¥€',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10'
  },
  Chemistry: {
    nameHindi: 'à¤°à¤¸à¤¾à¤¯à¤¨',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10'
  },
  Mathematics: {
    nameHindi: 'à¤—à¤£à¤¿à¤¤',
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10'
  }
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("JEE Command Center Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-slate-100 p-6">
          <div className="max-w-md w-full bg-slate-900 border border-rose-500/40 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-base font-bold text-white">à¤¤à¤•à¤¨à¥€à¤•à¥€ à¤¸à¤®à¤¸à¥à¤¯à¤¾ à¤†à¤ˆ à¤¹à¥ˆ</h2>
            <p className="text-xs text-slate-400">
              à¤›à¥‹à¤Ÿà¥‡, à¤à¤ª à¤²à¥‹à¤¡ à¤•à¤°à¤¨à¥‡ à¤®à¥‡à¤‚ à¤¸à¤®à¤¸à¥à¤¯à¤¾ à¤¹à¥à¤ˆ: {this.state.error?.message || "Unknown error"}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition"
            >
              à¤¦à¥‹à¤¬à¤¾à¤°à¤¾ à¤²à¥‹à¤¡ à¤•à¤°à¥‡à¤‚ (Reload)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainAppContent />
    </ErrorBoundary>
  );
}

function MainAppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [modalType, setModalType] = useState(null);
  const [appData, setAppData] = useState(INITIAL_STATE);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // In-app Notification Banner
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  const alertedTasksRef = useRef(new Set());
  useEffect(() => {
    const checkTaskAlerts = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${hours}:${minutes}`;

      appData.tasks.forEach(t => {
        if (!t.completed && t.date === todayStr && t.time && !alertedTasksRef.current.has(t.id)) {
          if (t.time <= currentTimeStr) {
            alertedTasksRef.current.add(t.id);
            showToast(`â° à¤Ÿà¤¾à¤¸à¥à¤• à¤…à¤²à¤°à¥à¤Ÿ: "${t.title}" (${t.time}) à¤•à¤¾ à¤¸à¤®à¤¯ à¤¹à¥‹ à¤—à¤¯à¤¾!`, 'info');
          }
        }
      });
    };

    const alertInterval = setInterval(checkTaskAlerts, 15000);
    checkTaskAlerts();
    return () => clearInterval(alertInterval);
  }, [appData.tasks]);

  // Restore on mount
  useEffect(() => {
    async function initStorage() {
      const stored = await loadPersistedState();
      if (stored) {
        setAppData(prev => ({
          ...prev,
          ...stored,
          comebackSettings: {
            ...prev.comebackSettings,
            ...(stored.comebackSettings || {})
          }
        }));
      }
      setIsStorageReady(true);
    }
    initStorage();
  }, []);

  // Save whenever appData changes
  useEffect(() => {
    if (isStorageReady) {
      savePersistedState(appData);
    }
  }, [appData, isStorageReady]);

  const [timerMode, setTimerMode] = useState('pomodoro');
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSubject, setTimerSubject] = useState('Physics');
  const [timerTopic, setTimerTopic] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (timerMode === 'pomodoro' && prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            logCompletedSession(25);
            showToast('à¤¶à¤¾à¤¬à¤¾à¤¶ à¤›à¥‹à¤Ÿà¥‡! 25 à¤®à¤¿à¤¨à¤Ÿ à¤•à¤¾ à¤«à¥‹à¤•à¤¸ à¤¸à¥‡à¤¶à¤¨ à¤ªà¥‚à¤°à¤¾ à¤¹à¥à¤†! ðŸŽ¯', 'success');
            return 25 * 60;
          }
          return timerMode === 'pomodoro' ? prev - 1 : prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timerMode]);

  const logCompletedSession = (minutes) => {
    const session = {
      id: 'sess_' + Date.now(),
      durationMin: minutes,
      subject: timerSubject,
      chapter: timerTopic || 'à¤¸à¥‡à¤²à¥à¤« à¤¸à¥à¤Ÿà¤¡à¥€',
      timestamp: new Date().toISOString(),
      mode: timerMode
    };
    setAppData(prev => ({
      ...prev,
      focusSessions: [session, ...prev.focusSessions]
    }));
  };

  const userStats = useMemo(() => {
    const completedBacklogCount = appData.backlogLectures.filter(l => l.status === 'completed').length;
    const completedDpps = appData.dpps.filter(d => d.status === 'completed').length;
    const errorsReviewed = appData.errorBook.filter(e => e.status === 'mastered').length;
    const totalFocusMinutes = appData.focusSessions.reduce((acc, s) => acc + (s.durationMin || 0), 0);
    const testsTaken = appData.tests.length;

    // Real mathematical XP derived strictly from actual verified inputs
    const calculatedXP = (completedBacklogCount * 50) +
                         (completedDpps * 25) +
                         (errorsReviewed * 15) +
                         (Math.floor(totalFocusMinutes / 30) * 20) +
                         (testsTaken * 100);

    let currentLevel = 1;
    let levelName = 'Level 1: Backlog Reset (à¤¶à¥à¤°à¥à¤†à¤¤)';
    if (calculatedXP >= 1500) {
      currentLevel = 5;
      levelName = 'Level 5: IIT JEE Main + Adv Ready ðŸ‘‘';
    } else if (calculatedXP >= 900) {
      currentLevel = 4;
      levelName = 'Level 4: Advanced Problem Solver ðŸ”¥';
    } else if (calculatedXP >= 450) {
      currentLevel = 3;
      levelName = 'Level 
