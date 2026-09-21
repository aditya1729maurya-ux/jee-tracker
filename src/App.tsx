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

function renderInlineMarkdown(str) {
  if (!str) return null;
  const tokens = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  let lastIdx = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIdx) {
      tokens.push(str.slice(lastIdx, match.index));
    }
    const m = match[0];
    if (m.startsWith('**') && m.endsWith('**')) {
      tokens.push(<strong key={key++} className="font-bold text-cyan-300">{m.slice(2, -2)}</strong>);
    } else if (m.startsWith('*') && m.endsWith('*')) {
      tokens.push(<em key={key++} className="italic text-slate-300">{m.slice(1, -1)}</em>);
    } else if (m.startsWith('`') && m.endsWith('`')) {
      tokens.push(
        <code key={key++} className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded font-mono text-[11px] border border-slate-800">
          {m.slice(1, -1)}
        </code>
      );
    }
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < str.length) {
    tokens.push(str.slice(lastIdx));
  }
  return tokens;
}

function FormattedMessage({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let currentList = null;

  const flushList = (keyPrefix) => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      elements.push(
        <ul key={`${keyPrefix}-ul`} className="my-1.5 pl-5 list-disc space-y-1 text-slate-200">
          {currentList.items.map((it, idx) => (
            <li key={idx} className="text-xs leading-relaxed">{renderInlineMarkdown(it)}</li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={`${keyPrefix}-ol`} className="my-1.5 pl-5 list-decimal space-y-1 text-slate-200">
          {currentList.items.map((it, idx) => (
            <li key={idx} className="text-xs leading-relaxed">{renderInlineMarkdown(it)}</li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (/^[-*]\s+/.test(trimmed)) {
      const itemContent = trimmed.replace(/^[-*]\s+/, '');
      if (!currentList || currentList.type !== 'ul') {
        flushList(`flush-${idx}`);
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(itemContent);
      return;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const itemContent = trimmed.replace(/^\d+\.\s+/, '');
      if (!currentList || currentList.type !== 'ol') {
        flushList(`flush-${idx}`);
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(itemContent);
      return;
    }

    flushList(`flush-${idx}`);

    if (!trimmed) {
      elements.push(<div key={`sp-${idx}`} className="h-1.5" />);
      return;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(<h4 key={`h3-${idx}`} className="font-bold text-cyan-300 text-xs mt-2 mb-0.5">{renderInlineMarkdown(trimmed.slice(4))}</h4>);
    } else if (trimmed.startsWith('## ')) {
      elements.push(<h3 key={`h2-${idx}`} className="font-extrabold text-white text-sm mt-2.5 mb-1 border-b border-slate-700/60 pb-0.5">{renderInlineMarkdown(trimmed.slice(3))}</h3>);
    } else if (trimmed.startsWith('# ')) {
      elements.push(<h2 key={`h1-${idx}`} className="font-black text-white text-base mt-3 mb-1 border-b border-indigo-500/50 pb-1">{renderInlineMarkdown(trimmed.slice(2))}</h2>);
    } else {
      elements.push(
        <p key={`p-${idx}`} className="leading-relaxed text-xs text-slate-200">
          {renderInlineMarkdown(trimmed)}
        </p>
      );
    }
  });

  flushList('final-flush');
  return <div className="space-y-1">{elements}</div>;
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
        ✨Welcome ARJUNA 🎓
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
        Made with ❤️‍🩹 by ADITYA MAURYA
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
      title: 'बातचीत 1 (Main Session)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg_welcome',
          sender: 'ai',
          text: 'नमस्ते छोटे! मैं हूँ तुम्हारा "बड़े भैया".\n\nयाद रखना: मैं केवल तुम्हारे वास्तविक दर्ज किए गए डेटा पर बात करूँगा—कोई फर्ज़ी प्रोग्रेस या काल्पनिक अंक नहीं. अपना बैकलाग, आज की PW क्लास, कोई सवाल या टेस्ट का स्क्रीनशॉट यहाँ शेयर करो!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }
  ],
  activeSessionId: 'sess_1'
};

const SUBJECT_PRESETS = {
  Physics: {
    nameHindi: 'भौतिकी',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10'
  },
  Chemistry: {
    nameHindi: 'रसायन',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10'
  },
  Mathematics: {
    nameHindi: 'गणित',
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
            <h2 className="text-base font-bold text-white">तकनीकी समस्या आई है</h2>
            <p className="text-xs text-slate-400">
              छोटे, ऐप लोड करने में समस्या हुई: {this.state.error?.message || "Unknown error"}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition"
            >
              दोबारा लोड करें (Reload)
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
            showToast(`⏰ टास्क अलर्ट: "${t.title}" (${t.time}) का समय हो गया!`, 'info');
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
            showToast('शाबाश छोटे! 25 मिनट का फोकस सेशन पूरा हुआ! 🎯', 'success');
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
      chapter: timerTopic || 'सेल्फ स्टडी',
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
    let levelName = 'Level 1: Backlog Reset (शुरुआत)';
    if (calculatedXP >= 1500) {
      currentLevel = 5;
      levelName = 'Level 5: IIT JEE Main + Adv Ready 👑';
    } else if (calculatedXP >= 900) {
      currentLevel = 4;
      levelName = 'Level 4: Advanced Problem Solver 🔥';
    } else if (calculatedXP >= 450) {
      currentLevel = 3;
      levelName = 'Level 3: Live Class Consistent 🚀';
    } else if (calculatedXP >= 150) {
      currentLevel = 2;
      levelName = 'Level 2: Foundation Builder ⚡';
    }

    // Authentic streak calculation based strictly on real activity timestamps
    const activeDates = new Set([
      ...appData.focusSessions.map(s => s.timestamp.split('T')[0]),
      ...appData.tasks.filter(t => t.completed && t.date).map(t => t.date),
      ...appData.backlogLectures.filter(l => l.completedAt).map(l => l.completedAt.split('T')[0])
    ]);
    
    let realStreak = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (activeDates.has(dateStr)) {
        realStreak++;
      } else if (i === 0) {
        continue;
      } else {
        break;
      }
    }

    // Backlog coverage percentage strictly calculated
    const totalBacklog = appData.backlogLectures.length;
    const backlogPct = totalBacklog > 0 ? Math.round((completedBacklogCount / totalBacklog) * 100) : 0;

    return {
      totalXP: calculatedXP,
      level: currentLevel,
      levelName,
      streak: realStreak,
      totalBacklog,
      completedBacklogCount,
      pendingBacklogCount: totalBacklog - completedBacklogCount,
      backlogPct,
      totalFocusMinutes,
      testsTaken
    };
  }, [appData]);

  const comebackStats = useMemo(() => {
    const pendingBacklog = userStats.pendingBacklogCount;
    const days = appData.comebackSettings.targetDays || 21;
    
    // NO hardcoded 12 classes/week assumption!
    // We only calculate incoming classes if the user has provided a real PW schedule.
    const scheduleCount = appData.pwSchedule.length;
    const hasSchedule = scheduleCount > 0;

    let incomingClasses = null;
    let totalWorkload = null;
    let requiredDailyBacklogRate = pendingBacklog > 0 ? (pendingBacklog / days).toFixed(1) : '0.0';
    let totalDailyLecturesNeeded = null;

    if (hasSchedule) {
      // Scale from actual schedule weekly count
      const weeksInPlan = days / 7;
      incomingClasses = Math.round(weeksInPlan * scheduleCount);
      totalWorkload = pendingBacklog + incomingClasses;
      totalDailyLecturesNeeded = (totalWorkload / days).toFixed(1);
    }

    return {
      targetDays: days,
      pendingBacklog,
      hasSchedule,
      scheduleCount,
      incomingClasses,
      totalWorkload,
      requiredDailyBacklogRate,
      totalDailyLecturesNeeded
    };
  }, [userStats.pendingBacklogCount, appData.pwSchedule, appData.comebackSettings]);

  const [searchQuery, setSearchQuery] = useState('');
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    
    return {
      backlog: appData.backlogLectures.filter(b => 
        (b.subject || '').toLowerCase().includes(q) || 
        (b.chapter || '').toLowerCase().includes(q) || 
        (b.lectureTitle || '').toLowerCase().includes(q)
      ),
      errors: appData.errorBook.filter(e => 
        (e.subject || '').toLowerCase().includes(q) || 
        (e.chapter || '').toLowerCase().includes(q) || 
        (e.questionDesc || '').toLowerCase().includes(q) || 
        (e.myMistake || '').toLowerCase().includes(q)
      ),
      doubts: appData.doubts.filter(d => 
        (d.subject || '').toLowerCase().includes(q) || 
        (d.chapter || '').toLowerCase().includes(q) || 
        (d.question || '').toLowerCase().includes(q)
      ),
      notes: appData.notes.filter(n => 
        (n.subject || '').toLowerCase().includes(q) || 
        (n.chapter || '').toLowerCase().includes(q) || 
        (n.content || '').toLowerCase().includes(q)
      ),
      tests: appData.tests.filter(t => 
        (t.testName || '').toLowerCase().includes(q)
      )
    };
  }, [searchQuery, appData]);

  const navigationItems = [
    { id: 'home', label: 'Home / Today', icon: Target },
    { id: 'backlog', label: 'Backlog Tracker', icon: RotateCcw, count: userStats.pendingBacklogCount },
    { id: 'comeback', label: '21-Day Comeback', icon: TrendingUp },
    { id: 'ai', label: 'बड़े भैया (AI)', isBhaiya: true, highlight: true },
    { id: 'schedule', label: 'PW Live Schedule', icon: Calendar, count: appData.pwSchedule.length },
    { id: 'errorbook', label: 'Error Book', icon: AlertTriangle, count: appData.errorBook.length },
    { id: 'doubts', label: 'Doubt Tracker', icon: HelpCircle, count: appData.doubts.filter(d => d.status === 'pending').length },
    { id: 'revision', label: 'Revision', icon: RefreshCw },
    { id: 'tests', label: 'Test Center', icon: Award, count: appData.tests.length },
    { id: 'timer', label: 'Focus Timer', icon: Timer },
    { id: 'pyq', label: 'PYQ & Modules', icon: BookOpen },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'notifications', label: 'Tasks & Alerts', icon: Bell, count: appData.tasks.filter(t => !t.completed).length },
    { id: 'settings', label: 'Settings & Data', icon: Settings }
  ];

  const handleApplyChatAction = (action) => {
    if (!action || !action.type || !action.data) return;
    const { type, data } = action;

    if (type === 'add-backlog') {
      const newLec = {
        id: 'bl_' + Date.now(),
        subject: data.subject || 'Physics',
        chapter: data.chapter || 'Untitled Chapter',
        lectureTitle: data.lectureTitle || 'Lecture',
        durationMin: Number(data.durationMin) || null,
        addedDate: new Date().toISOString(),
        status: 'pending'
      };
      setAppData(prev => ({ ...prev, backlogLectures: [newLec, ...prev.backlogLectures] }));
      showToast('बैकलाग लेक्चर जोड़ा गया!', 'success');
    } else if (type === 'complete-backlog') {
      setAppData(prev => ({
        ...prev,
        backlogLectures: prev.backlogLectures.map(l => {
          if (l.id === data.id || (data.chapter && l.chapter.toLowerCase().includes(data.chapter.toLowerCase()))) {
            return { ...l, status: 'completed', completedAt: new Date().toISOString() };
          }
          return l;
        })
      }));
      showToast('लेक्चर पूर्ण मार्क किया गया! 🎯', 'success');
    } else if (type === 'add-error') {
      const newErr = {
        id: 'err_' + Date.now(),
        subject: data.subject || 'Physics',
        chapter: data.chapter || 'General',
        source: data.source || 'PW Test',
        questionDesc: data.questionDesc || 'Mistake Entry',
        myMistake: data.myMistake || '',
        correctConcept: data.correctConcept || '',
        reason: data.reason || 'Conceptual',
        date: new Date().toISOString(),
        status: 'needs_review'
      };
      setAppData(prev => ({ ...prev, errorBook: [newErr, ...prev.errorBook] }));
      showToast('Error Book में गलती दर्ज की गई!', 'success');
    } else if (type === 'add-doubt') {
      const newDoubt = {
        id: 'dbt_' + Date.now(),
        subject: data.subject || 'Physics',
        chapter: data.chapter || 'General',
        question: data.question || 'Doubt',
        status: 'pending',
        date: new Date().toISOString()
      };
      setAppData(prev => ({ ...prev, doubts: [newDoubt, ...prev.doubts] }));
      showToast('डाउट दर्ज हुआ!', 'success');
    } else if (type === 'add-task') {
      const newTask = {
        id: 'tsk_' + Date.now(),
        title: data.title || 'Task',
        subject: data.subject || 'General',
        chapter: data.chapter || '',
        date: data.date || new Date().toISOString().split('T')[0],
        time: data.time || '',
        completed: false
      };
      setAppData(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
      showToast('टास्क जोड़ा गया!', 'success');
    } else if (type === 'add-test') {
      const newTest = {
        id: 'tst_' + Date.now(),
        testName: data.testName || 'PW Test',
        subject: data.subject || 'Full Test',
        marksObtained: Number(data.marksObtained) || 0,
        totalMarks: Number(data.totalMarks) || 300,
        attempted: Number(data.attempted) || 0,
        correct: Number(data.correct) || 0,
        incorrect: (Number(data.attempted) || 0) - (Number(data.correct) || 0),
        date: new Date().toISOString().split('T')[0]
      };
      setAppData(prev => ({ ...prev, tests: [newTest, ...prev.tests] }));
      showToast('टेस्ट रिजल्ट सेव हुआ!', 'success');
    } else if (type === 'add-schedule') {
      const newSched = {
        id: 'sch_' + Date.now(),
        day: data.day || 'Day not specified',
        time: data.time || 'Time not specified',
        subject: data.subject || 'Physics',
        topic: data.topic || 'Class'
      };
      setAppData(prev => ({ ...prev, pwSchedule: [newSched, ...prev.pwSchedule] }));
      showToast('PW क्लास शेड्यूल में जोड़ी गई!', 'success');
    } else if (type === 'add-note') {
      const newNote = {
        id: 'nt_' + Date.now(),
        subject: data.subject || 'Physics',
        chapter: data.chapter || 'General',
        topic: data.topic || 'Quick Note',
        content: data.content || '',
        date: new Date().toISOString().split('T')[0]
      };
      setAppData(prev => ({ ...prev, notes: [newNote, ...prev.notes] }));
      showToast('नोट्स सेव हुए!', 'success');
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      
      {/* 2-3s Initial Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 animate-fade-in ${
          toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200' :
          toast.type === 'error' ? 'bg-rose-950/90 border-rose-500 text-rose-200' :
          'bg-cyan-950/90 border-cyan-500 text-cyan-200'
        }`}>
          <Sparkles className="w-5 h-5 shrink-0" />
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Portrait / Tablet Backdrop for Drawer */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar / Collapsible Drawer in Portrait */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col shrink-0 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎓</span>
            <div>
              <h1 className="font-extrabold text-base tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                JEE TRACKER
              </h1>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">
                PW Class 11 Command
              </span>
            </div>
          </div>
          {/* Close button for drawer on portrait screens */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Level & Streak Mini-Card (Zero Fake Values) */}
        <div className="mx-3 my-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
              L{userStats.level}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200 truncate w-24" title={userStats.levelName}>
                {userStats.levelName.split(':')[1] || userStats.levelName}
              </div>
              <div className="text-[11px] text-cyan-400 font-medium">{userStats.totalXP} Real XP</div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{userStats.streak}d</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-1 py-1 custom-scrollbar">
          {navigationItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all text-left ${
                  isActive 
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm' 
                    : item.highlight 
                      ? 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 font-medium'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.isBhaiya ? (
                    <BadeBhaiyaLogo className="w-4 h-4" glow={false} />
                  ) : (
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  )}
                  <span>{item.label}</span>
                </div>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info showing persistent storage status */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Local DB Active</span>
          </span>
          <span className="text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-400 font-mono">
            PW हिन्दी
          </span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-hidden">
        
        {/* Top Bar with Responsive Hamburger Menu */}
        <header className="h-14 border-b border-slate-800/80 px-3.5 sm:px-6 flex items-center justify-between bg-slate-900/40 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 -ml-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="hidden md:inline text-slate-400 text-xs uppercase tracking-wider font-semibold truncate">Command Center</span>
            <span className="hidden md:inline text-slate-600">/</span>
            <h2 className="font-bold text-slate-100 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 truncate">
              {activeTab === 'ai' && <BadeBhaiyaLogo className="w-4 h-4 shrink-0" />}
              <span className="truncate">{navigationItems.find(n => n.id === activeTab)?.label}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('ai')}
              className="flex items-center gap-1.5 sm:gap-2 bg-indigo-600/25 border border-indigo-500/40 hover:bg-indigo-600/40 text-indigo-200 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg transition font-medium"
            >
              <BadeBhaiyaLogo className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" glow={false} />
              <span className="hidden sm:inline">बड़े भैया से पूछें</span>
              <span className="sm:hidden">भैया</span>
            </button>
            
            <button
              onClick={() => setModalType('add-backlog')}
              className="flex items-center gap-1 sm:gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg transition shadow-md shadow-cyan-900/30"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">+ बैकलाग जोड़ें</span>
              <span className="sm:hidden">+ बैकलाग</span>
            </button>
          </div>
        </header>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-5 sm:space-y-6 custom-scrollbar">
          {activeTab === 'home' && (
            <HomeDashboard 
              appData={appData} 
              userStats={userStats} 
              comebackStats={comebackStats} 
              setActiveTab={setActiveTab}
              setModalType={setModalType}
              setAppData={setAppData}
              showToast={showToast}
            />
          )}

          {activeTab === 'backlog' && (
            <BacklogManager 
              appData={appData} 
              setAppData={setAppData} 
              setModalType={setModalType}
              showToast={showToast}
            />
          )}

          {activeTab === 'comeback' && (
            <ComebackView 
              appData={appData} 
              setAppData={setAppData} 
              comebackStats={comebackStats} 
              userStats={userStats}
              showToast={showToast}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'ai' && (
            <BadeBhaiyaChat 
              appData={appData}
              setAppData={setAppData}
              userStats={userStats}
              comebackStats={comebackStats}
              onApplyAction={handleApplyChatAction}
              showToast={showToast}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleManager 
              appData={appData} 
              setAppData={setAppData} 
              setModalType={setModalType}
              showToast={showToast}
            />
          )}

          {activeTab === 'errorbook' && (
            <ErrorBookView 
              appData={appData} 
              setAppData={setAppData} 
              setModalType={setModalType}
              showToast={showToast}
            />
          )}

          {activeTab === 'doubts' && (
            <DoubtTrackerView 
              appData={appData} 
              setAppData={setAppData} 
              setModalType={setModalType}
              showToast={showToast}
              onAskBhaiya={(q) => {
                setActiveTab('ai');
              }}
            />
          )}

          {activeTab === 'revision' && (
            <RevisionView 
              appData={appData} 
              setAppData={setAppData} 
              setModalType={setModalType}
              showToast={showToast}
            />
          )}

          {activeTab === 'tests' && (
            <TestCenterView 
              appData={appData} 
              setAppData={setAppData} 
              setModalType={setModalType}
              showToast={showToast}
            />
          )}

          {activeTab === 'timer' && (
            <FocusTimerView 
              timerSeconds={timerSeconds}
              setTimerSeconds={setTimerSeconds}
              timerRunning={timerRunning}
              setTimerRunning={setTimerRunning}
              timerMode={timerMode}
              setTimerMode={setTimerMode}
              timerSubject={timerSubject}
              setTimerSubject={setTimerSubject}
              timerTopic={timerTopic}
              setTimerTopic={setTimerTopic}
              logCompletedSession={logCompletedSession}
              showToast={showToast}
              focusSessions={appData.focusSessions}
            />
          )}

          {activeTab === 'pyq' && (
            <PyqModuleView 
              appData={appData} 
              setAppData={setAppData} 
              setModalType={setModalType}
              showToast={showToast}
            />
          )}

          {activeTab === 'notes' && (
            <NotesView 
              appData={appData} 
              setAppData={setAppData} 
              setModalType={setModalType}
              showToast={showToast}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView 
              appData={appData} 
              userStats={userStats} 
              comebackStats={comebackStats}
            />
          )}

          {activeTab === 'search' && (
            <GlobalSearchView 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              results={searchResults} 
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'notifications' && (
            <TasksAndAlertsView 
              appData={appData} 
              setAppData={setAppData} 
              setModalType={setModalType}
              showToast={showToast}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView 
              appData={appData} 
              setAppData={setAppData} 
              showToast={showToast}
            />
          )}
        </div>
      </main>

      {/* Global Modals without fake pre-filled defaults */}
      {modalType && (
        <ModalContainer 
          type={modalType} 
          onClose={() => setModalType(null)} 
          appData={appData} 
          setAppData={setAppData} 
          showToast={showToast} 
        />
      )}
    </div>
  );
}

function HomeDashboard({ appData, userStats, comebackStats, setActiveTab, setModalType, setAppData, showToast }) {
  const todayDateStr = new Date().toISOString().split('T')[0];
  const overdueTasks = appData.tasks.filter(t => !t.completed && t.date && t.date < todayDateStr);
  const todaysTasks = appData.tasks.filter(t => t.date === todayDateStr || !t.date);

  const toggleTask = (taskId) => {
    setAppData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null } : t)
    }));
    showToast('टास्क अपडेट हुआ', 'success');
  };

  const markOverdueCompleted = (taskId) => {
    setAppData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? {
        ...t,
        completed: true,
        completedAt: new Date().toISOString(),
        resolutionNote: 'कल ही कर लिया'
      } : t)
    }));
    showToast('टास्क पूर्ण मार्क किया गया!', 'success');
  };

  const rescheduleOverdueToToday = (taskId) => {
    setAppData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? {
        ...t,
        date: todayDateStr,
        originalDate: t.originalDate || t.date
      } : t)
    }));
    showToast('टास्क आज के लिए रीशेड्यूल किया गया!', 'success');
  };

  const deleteOverdueTask = (taskId) => {
    setAppData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
    showToast('टास्क हटाया गया', 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
              <Target className="w-3.5 h-3.5" />
              <span>Current Mission: Backlog Reset & Live Comeback</span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              कक्षा 11 JEE Main + Advanced (PW बैच)
            </h2>
            <p className="text-slate-400 text-xs mt-1 max-w-xl">
              सच्चा हिसाब, शून्य फर्ज़ीवाड़ा. हर एक लेक्चर, टेस्ट और गलती का असली हिसाब.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('comeback')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>21-दिन कमबैक</span>
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-900/40 flex items-center gap-2"
            >
              <BadeBhaiyaLogo className="w-4 h-4" glow={false} />
              <span>बड़े भैया से पूछें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real Key Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Backlog Coverage Circular */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Backlog Covered</div>
            <div className="text-2xl font-extrabold text-cyan-400 mt-1">
              {userStats.backlogPct}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {userStats.totalBacklog === 0 ? "Data not provided yet" : `${userStats.completedBacklogCount} / ${userStats.totalBacklog} लेक्चर्स`}
            </div>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400 transition-all duration-700 ease-out"
                strokeDasharray={`${userStats.backlogPct}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-slate-200">
              {userStats.backlogPct}%
            </span>
          </div>
        </div>

        {/* Pending Backlog */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">पेंडिंग बैकलाग</div>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">
              {userStats.totalBacklog === 0 ? (
                <span className="text-sm font-normal text-slate-400">Data not provided yet</span>
              ) : (
                <>{userStats.pendingBacklogCount} <span className="text-sm font-normal text-slate-400">लेक्चर्स</span></>
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {userStats.totalBacklog > 0 ? `कोटा: ~${comebackStats.requiredDailyBacklogRate}/दिन` : 'दर्ज बैकलाग 0 है'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <RotateCcw className="w-6 h-6" />
          </div>
        </div>

        {/* Focus Study Time */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">दर्ज पढ़ाई समय (Focus Time)</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">
              {userStats.totalFocusMinutes === 0 ? (
                <span className="text-sm font-normal text-slate-400">0 घंटा</span>
              ) : (
                <>{(userStats.totalFocusMinutes / 60).toFixed(1)} <span className="text-sm font-normal text-slate-400">घंटे</span></>
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {appData.focusSessions.length} सेशन्स पूरे किए
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Timer className="w-6 h-6" />
          </div>
        </div>

        {/* Error Book Count */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Error Book गलतियाँ</div>
            <div className="text-2xl font-extrabold text-rose-400 mt-1">
              {appData.errorBook.length} <span className="text-sm font-normal text-slate-400">प्रश्न</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {appData.errorBook.filter(e => e.status === 'mastered').length} सुधारी गई
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Grid: Tasks & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          
          {/* Overdue Tasks Notice if Any */}
          {overdueTasks.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-xs text-amber-300">
                    कल के पेंडिंग टास्क्स ({overdueTasks.length} Overdue)
                  </h3>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                  निर्णय लें
                </span>
              </div>

              <div className="space-y-2">
                {overdueTasks.map(task => (
                  <div key={task.id} className="p-2.5 rounded-lg bg-slate-900/90 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{task.title}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-amber-400">तारीख: {task.date}</span>
                        {task.time && <span>• ⏰ {task.time}</span>}
                        {task.subject && <span>• {task.subject}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => markOverdueCompleted(task.id)}
                        className="px-2.5 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition"
                      >
                        कल ही कर लिया
                      </button>
                      <button
                        onClick={() => rescheduleOverdueToToday(task.id)}
                        className="px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold transition"
                      >
                        आज करेंगे
                      </button>
                      <button
                        onClick={() => deleteOverdueTask(task.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded"
                        title="हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Daily Tasks */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-xs text-slate-200">आज के असली टास्क्स (Daily Tasks)</h3>
              </div>
              <button
                onClick={() => setModalType('add-task')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>टास्क जोड़ें</span>
              </button>
            </div>

            {todaysTasks.length === 0 ? (
              <div className="p-6 rounded-lg bg-slate-950/60 border border-dashed border-slate-800 text-center">
                <p className="text-xs text-amber-300/80 font-medium">Data not provided yet</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  आज के लिए कोई टास्क सेट नहीं किया गया है. ऊपर "+ टास्क जोड़ें" पर क्लिक करके लक्ष्य दर्ज करो.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {todaysTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`p-3 rounded-lg border flex items-center justify-between transition ${
                      task.completed 
                        ? 'bg-slate-950/40 border-slate-800/80 text-slate-500' 
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                          task.completed 
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                            : 'border-slate-600 hover:border-cyan-400'
                        }`}
                      >
                        {task.completed && <CheckCircle className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                      <div>
                        <div className={`text-xs font-semibold ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          {task.time && (
                            <span className="text-cyan-400 font-mono font-semibold bg-cyan-500/10 px-1 rounded border border-cyan-500/20">
                              ⏰ {task.time}
                            </span>
                          )}
                          <span>{task.subject}</span>
                          {task.chapter && <span>• {task.chapter}</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setAppData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== task.id) }));
                        showToast('टास्क हटाया गया', 'info');
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PW Live Schedule View */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-xs text-slate-200">PW लाइव क्लासेज (Current PW Schedule)</h3>
              </div>
              <button
                onClick={() => setActiveTab('schedule')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                शेड्यूल जोड़ें / देखें →
              </button>
            </div>

            {appData.pwSchedule.length === 0 ? (
              <div className="p-6 rounded-lg bg-slate-950/60 border border-dashed border-slate-800 text-center">
                <ShieldAlert className="w-7 h-7 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-amber-300/80 font-medium">PW schedule not provided yet</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                  हम कोई मनगढ़ंत लाइव क्लास नहीं दिखाते. अपना वास्तविक PW टाइमटेबल जोड़ो.
                </p>
                <button
                  onClick={() => setModalType('add-schedule')}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  + PW टाइमटेबल दर्ज करें
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {appData.pwSchedule.slice(0, 3).map(item => (
                  <div key={item.id} className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        {item.day || 'Day not provided'} • {item.time || 'Time not provided'}
                      </span>
                      <h4 className="text-xs font-bold text-slate-200 mt-1">{item.subject}: {item.topic}</h4>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">PW Batch</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Bade Bhaiya Message & Weak Topics */}
        <div className="space-y-6">
          
          <div className="p-5 rounded-xl bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-500/30">
            <div className="flex items-center gap-2.5 mb-3">
              <BadeBhaiyaLogo className="w-7 h-7" />
              <div>
                <h3 className="font-bold text-xs text-indigo-200">बड़े भैया का आज का संदेश</h3>
                <span className="text-[10px] text-slate-400">Personal Mentor</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {userStats.totalBacklog === 0 ? (
                "छोटे, अभी तुमने कोई बैकलाग लेक्चर दर्ज नहीं किया है. अपने छूटे हुए लेक्चर्स जोड़ो ताकि हम सटीक कमबैक प्लान बना सकें."
              ) : userStats.backlogPct === 0 ? (
                `छोटे, तुम्हारे पास कुल ${userStats.totalBacklog} बैकलाग लेक्चर्स हैं. आज कोई एक लेक्चर चुनकर उसके नोट्स बनाकर खत्म करो.`
              ) : (
                `शाबाश छोटे! तुमने ${userStats.backlogPct}% बैकलाग खत्म कर लिया है. बस इसी अनुशासन के साथ आगे बढ़ो.`
              )}
            </p>

            <button
              onClick={() => setActiveTab('ai')}
              className="mt-4 w-full py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-bold border border-indigo-500/40 transition flex items-center justify-center gap-1.5"
            >
              <span>भैया से बात करें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Real Weak Topics from Error Book / Tests Only */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="font-bold text-xs text-slate-200">कमजोर टॉपिक्स (Weak Topics)</h3>
            </div>

            {appData.errorBook.length === 0 && appData.tests.length === 0 ? (
              <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
                <p className="text-xs text-amber-300/80">Data not provided yet</p>
                <p className="text-[10px] text-slate-500 mt-1">
                  जब तुम टेस्ट या एरर बुक में गलतियाँ दर्ज करोगे, कमजोर टॉपिक्स अपने-आप यहाँ चिन्हित होंगे.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(
                  appData.errorBook.reduce((acc, err) => {
                    const key = `${err.subject} - ${err.chapter}`;
                    acc[key] = (acc[key] || 0) + 1;
                    return acc;
                  }, {})
                ).slice(0, 4).map(([chapterName, count]) => (
                  <div key={chapterName} className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 flex items-center justify-between text-xs">
                    <span className="font-medium text-rose-200 truncate">{chapterName}</span>
                    <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">
                      {count} गलतियाँ
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

function BacklogManager({ appData, setAppData, setModalType, showToast }) {
  const [filterSubject, setFilterSubject] = useState('All');

  const filteredLectures = useMemo(() => {
    return appData.backlogLectures.filter(l => {
      if (filterSubject !== 'All' && l.subject !== filterSubject) return false;
      return true;
    });
  }, [appData.backlogLectures, filterSubject]);

  const confirmCompletion = (lectureId) => {
    setAppData(prev => ({
      ...prev,
      backlogLectures: prev.backlogLectures.map(l => {
        if (l.id === lectureId) {
          const nextStatus = l.status === 'completed' ? 'pending' : 'completed';
          return {
            ...l,
            status: nextStatus,
            completedAt: nextStatus === 'completed' ? new Date().toISOString() : null
          };
        }
        return l;
      })
    }));
    showToast('लेक्चर स्टेटस अपडेट हुआ! 🎯', 'success');
  };

  const deleteLecture = (lectureId) => {
    setAppData(prev => ({
      ...prev,
      backlogLectures: prev.backlogLectures.filter(l => l.id !== lectureId)
    }));
    showToast('बैकलाग लेक्चर हटाया गया', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100">Level 1: Backlog Reset</h2>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
              कक्षा 11 PW
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            बैकलाग प्रतिशत = (पूर्ण बैकलाग लेक्चर्स ÷ कुल दर्ज बैकलाग लेक्चर्स). केवल तुम्हारी पुष्टि पर ही पूर्ण माना जाएगा.
          </p>
        </div>

        <button
          onClick={() => setModalType('add-backlog')}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>+ बैकलाग लेक्चर दर्ज करें</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {['All', 'Physics', 'Chemistry', 'Mathematics'].map(subj => (
          <button
            key={subj}
            onClick={() => setFilterSubject(subj)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterSubject === subj 
                ? 'bg-cyan-500 text-slate-950 shadow-md' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {subj === 'All' ? 'सभी विषय (All)' : `${subj} (${SUBJECT_PRESETS[subj]?.nameHindi || ''})`}
          </button>
        ))}
      </div>

      {filteredLectures.length === 0 ? (
        <div className="p-12 rounded-xl bg-slate-900/60 border border-dashed border-slate-800 text-center">
          <RotateCcw className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">Data not provided yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            इस विषय में अभी कोई बैकलाग लेक्चर दर्ज नहीं किया गया है. अपने PW बैच से छूटे हुए लेक्चर्स यहाँ जोड़ो.
          </p>
          <button
            onClick={() => setModalType('add-backlog')}
            className="mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>बैकलाग लेक्चर जोड़ें</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLectures.map((lec) => (
            <div 
              key={lec.id}
              className={`p-4 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                lec.status === 'completed'
                  ? 'bg-slate-900/40 border-slate-800 text-slate-500'
                  : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => confirmCompletion(lec.id)}
                  className={`w-6 h-6 mt-0.5 rounded-lg border flex items-center justify-center transition shrink-0 ${
                    lec.status === 'completed'
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'border-slate-600 hover:border-cyan-400 text-transparent'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                </button>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                      lec.subject === 'Physics' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                      lec.subject === 'Chemistry' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {lec.subject}
                    </span>
                    <span className="text-xs font-bold text-slate-400">• {lec.chapter}</span>
                  </div>
                  <h4 className={`text-xs font-bold mt-1 ${lec.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                    {lec.lectureTitle}
                  </h4>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                    {lec.durationMin ? <span>अवधि: {lec.durationMin} मिनट</span> : <span>अवधि: Data not provided</span>}
                    {lec.completedAt && (
                      <span className="text-emerald-400">पूर्ण: {new Date(lec.completedAt).toLocaleDateString('hi-IN')}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => confirmCompletion(lec.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                    lec.status === 'completed'
                      ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 border-emerald-500'
                  }`}
                >
                  {lec.status === 'completed' ? 'वापस पेंडिंग करें' : 'पूरा हुआ (Confirm)'}
                </button>
                <button
                  onClick={() => deleteLecture(lec.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ComebackView({ appData, setAppData, comebackStats, showToast, setActiveTab }) {
  const [customDays, setCustomDays] = useState(appData.comebackSettings.targetDays || 21);

  const saveComebackSettings = () => {
    setAppData(prev => ({
      ...prev,
      comebackSettings: {
        ...prev.comebackSettings,
        targetDays: Number(customDays) || 21
      }
    }));
    showToast('कमबैक सेटिंग्स अपडेट की गईं', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <TrendingUp className="w-4 h-4" />
          <span>The 21-Day Comeback Calculation</span>
        </div>
        <h2 className="text-lg font-extrabold text-white">
          21-दिन का मिशन: बैकलाग खत्म कर लाइव क्लासेज में वापसी
        </h2>
        <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
          हम कोई काल्पनिक 12 क्लासेज/हफ्ता नहीं मानेंगे. यह गणना केवल आपके द्वारा अपलोड किए गए वास्तविक PW टाइमटेबल पर आधारित होगी.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">वर्तमान पेंडिंग बैकलाग</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">
            {comebackStats.pendingBacklog} लेक्चर्स
          </div>
          <span className="text-[11px] text-slate-500">आपके द्वारा दर्ज किया गया</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">{comebackStats.targetDays} दिनों में आने वाले लेक्चर्स</span>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">
            {comebackStats.hasSchedule ? (
              `+${comebackStats.incomingClasses} लेक्चर्स`
            ) : (
              <span className="text-xs text-amber-300">PW schedule not provided yet</span>
            )}
          </div>
          <span className="text-[11px] text-slate-500">
            {comebackStats.hasSchedule ? `अपलोड किए गए ${comebackStats.scheduleCount} साप्ताहिक शेड्यूल से` : 'शेड्यूल जोड़ना आवश्यक'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">कुल वर्कलोड</span>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">
            {comebackStats.hasSchedule ? (
              `${comebackStats.totalWorkload} लेक्चर्स`
            ) : (
              `${comebackStats.pendingBacklog} (केवल बैकलाग)`
            )}
          </div>
          <span className="text-[11px] text-slate-500">
            {comebackStats.hasSchedule ? 'बैकलाग + नए लेक्चर्स' : 'शेड्यूल डेटा पेंडिंग'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">दैनिक आवश्यक कोटा</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {comebackStats.hasSchedule ? (
              `${comebackStats.totalDailyLecturesNeeded} / दिन`
            ) : (
              `~${comebackStats.requiredDailyBacklogRate} / दिन`
            )}
          </div>
          <span className="text-[11px] text-slate-500">
            {comebackStats.hasSchedule ? 'बैकलाग + लाइव' : 'केवल बैकलाग कोटा'}
          </span>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="font-bold text-xs text-slate-200">कमबैक अवधि कस्टमाइज़ करें</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">कमबैक अवधि (दिन)</label>
            <input 
              type="number"
              min="7"
              max="60"
              value={customDays}
              onChange={(e) => setCustomDays(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">वर्तमान PW शेड्यूल स्थिति</label>
            <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300">
              {appData.pwSchedule.length > 0 ? (
                <span className="text-emerald-400 font-semibold">{appData.pwSchedule.length} लेक्चर्स / सप्ताह दर्ज हैं</span>
              ) : (
                <span className="text-amber-400 font-semibold">PW schedule not provided yet</span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={saveComebackSettings}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition"
        >
          कैलकुलेशन अपडेट करें
        </button>
      </div>
    </div>
  );
}

function BadeBhaiyaChat({ appData, setAppData, userStats, comebackStats, onApplyAction, showToast }) {
  const [chatInput, setChatInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null); // { base64, mimeType, name }
  const [showSessionDrawer, setShowSessionDrawer] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const fileInputRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Active session resolution
  const activeSession = useMemo(() => {
    return appData.chatSessions.find(s => s.id === appData.activeSessionId) || appData.chatSessions[0];
  }, [appData.chatSessions, appData.activeSessionId]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, aiLoading]);

  // Create new conversation
  const createNewSession = () => {
    const newId = 'sess_' + Date.now();
    const newSess = {
      id: newId,
      title: `बातचीत ${appData.chatSessions.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg_' + Date.now(),
          sender: 'ai',
          text: 'नमस्ते छोटे! नई बातचीत शुरू हुई है. बताओ आज किस चीज़ पर काम करना है?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setAppData(prev => ({
      ...prev,
      chatSessions: [newSess, ...prev.chatSessions],
      activeSessionId: newId
    }));
    setShowSessionDrawer(false);
    showToast('नया चैट सेशन शुरू हुआ', 'info');
  };

  const deleteSession = (sessId) => {
    if (appData.chatSessions.length <= 1) {
      showToast('कम से कम एक चैट सेशन होना आवश्यक है', 'error');
      return;
    }
    const filtered = appData.chatSessions.filter(s => s.id !== sessId);
    setAppData(prev => ({
      ...prev,
      chatSessions: filtered,
      activeSessionId: prev.activeSessionId === sessId ? filtered[0].id : prev.activeSessionId
    }));
    showToast('चैट सेशन हटाया गया', 'info');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      showToast('केवल इमेज (JPG, PNG) या PDF सपोर्टेड हैं', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const base64Data = dataUrl.split(',')[1];
      setAttachedImage({
        base64: base64Data,
        mimeType: file.type || 'image/jpeg',
        name: file.name
      });
      showToast('फ़ाइल अटैच हो गई', 'success');
    };
    reader.readAsDataURL(file);
  };

  const sendToBadeBhaiya = async (customPrompt) => {
    const query = customPrompt || chatInput;
    if (!query.trim() && !attachedImage) return;

    const currentImg = attachedImage;
    const userMsgId = 'usr_' + Date.now();
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedImage: currentImg ? { name: currentImg.name, mimeType: currentImg.mimeType, base64: currentImg.base64 } : null
    };

    // Append to active session
    const updatedSessions = appData.chatSessions.map(sess => {
      if (sess.id === activeSession.id) {
        return {
          ...sess,
          updatedAt: new Date().toISOString(),
          messages: [...sess.messages, userMsg]
        };
      }
      return sess;
    });

    setAppData(prev => ({ ...prev, chatSessions: updatedSessions }));
    setChatInput('');
    setAttachedImage(null);
    setAiLoading(true);

    try {
      // Snapshot of actual data
      const appContextSnapshot = {
        student_level: userStats.levelName,
        real_xp: userStats.totalXP,
        real_streak: userStats.streak,
        backlog: {
          total: userStats.totalBacklog,
          completed: userStats.completedBacklogCount,
          pending: userStats.pendingBacklogCount,
          percentage_covered: `${userStats.backlogPct}%`,
          lectures: appData.backlogLectures.map(b => ({
            id: b.id,
            subject: b.subject,
            chapter: b.chapter,
            title: b.lectureTitle,
            status: b.status
          }))
        },
        pw_schedule: appData.pwSchedule.length > 0 ? appData.pwSchedule : "PW schedule not provided yet",
        error_book_count: appData.errorBook.length,
        error_samples: appData.errorBook.slice(0, 5).map(e => ({
          subject: e.subject,
          chapter: e.chapter,
          mistake: e.myMistake,
          reason: e.reason
        })),
        doubts: appData.doubts.filter(d => d.status === 'pending').map(d => ({
          subject: d.subject,
          chapter: d.chapter,
          question: d.question
        })),
        tests_recorded: appData.tests.map(t => ({
          name: t.testName,
          marks: `${t.marksObtained}/${t.totalMarks}`,
          accuracy: t.attempted > 0 ? `${Math.round((t.correct/t.attempted)*100)}%` : 'N/A'
        }))
      };

      const systemPrompt = `You are "बड़े भैया" (Bade Bhaiya), a warm, supportive, disciplined elder brother and IITian mentor for a Class 11 Hindi-medium student preparing for JEE Main + Advanced in a Physics Wallah (PW) batch.

SPEAKING STYLE RULES:
1. Speak in simple, friendly Hindi / Hinglish. Address the student naturally as "छोटे" or "छोटे भाई".
2. DO NOT use overly formal or difficult shuddh Hindi words (like "संकल्पनात्मक", "काल्पनिक", "यथार्थवादी", "पुनरावृत्ति"). Use natural everyday terms: "concept", "revision", "mistake", "bhaiya", "chote", "schedule".
3. Answer the actual question FIRST. Do not turn every answer into a lecture or motivational speech.
4. ZERO FAKE DATA: You have full access to the student's ACTUAL app database below. If data is 0 or missing (e.g., no backlog or schedule), clearly say so in simple Hindi. NEVER invent fake lectures or scores.

DATA ACTIONS (VERY IMPORTANT):
When the user tells you about:
- a new backlog lecture
- a completed lecture
- an error/mistake from test/dpp
- a doubt
- a daily task
- a test score
- a PW class schedule
- a note
You MUST prepare the structured action in this EXACT format at the VERY END of your message:
<<<ACTION:{"type":"add-backlog"|"complete-backlog"|"add-error"|"add-doubt"|"add-task"|"add-test"|"add-schedule"|"add-note","data":{...}}>>>

Examples of data schemas:
- add-backlog: {"subject":"Physics","chapter":"NLM","lectureTitle":"Lecture 03","durationMin":90}
- complete-backlog: {"chapter":"NLM","lectureTitle":"Lecture 03"}
- add-error: {"subject":"Physics","chapter":"Kinematics","source":"PW Test","questionDesc":"Projectiles","myMistake":"Cos theta instead of sin theta","correctConcept":"Resolve along plane","reason":"Conceptual"}
- add-doubt: {"subject":"Chemistry","chapter":"Mole Concept","question":"Limiting reagent confusion"}
- add-task: {"title":"Solve 15 questions of Kinematics","subject":"Physics","chapter":"Kinematics"}
- add-test: {"testName":"PW Test 01","subject":"Full Test","marksObtained":120,"totalMarks":300,"attempted":40,"correct":32}
- add-schedule: {"day":"Monday","time":"10:30 AM","subject":"Physics","topic":"Rotation"}
- add-note: {"subject":"Physics","chapter":"NLM","topic":"Friction formulas","content":"fs <= mu_s * N"}

In your message text, naturally tell the user: "छोटे, मैंने इसे [Section Name] में जोड़ने के लिए तैयार किया है. Save कर दूँ?"

LIVE APP STATE (REAL DATA ONLY):
${JSON.stringify(appContextSnapshot, null, 2)}`;

      // Gemini is accessed through the secure Cloudflare Worker proxy.
      // The Gemini API key is never shipped inside the app/APK.
      const apiUrl = "https://jee-tracker-ai.adityajenral05.workers.dev";

      // Build conversation history for the model
      const contents = activeSession.messages.map(m => {
        const parts = [{ text: m.text || '' }];
        if (m.attachedImage?.base64) {
          parts.push({
            inlineData: {
              mimeType: m.attachedImage.mimeType || 'image/jpeg',
              data: m.attachedImage.base64
            }
          });
        }
        return {
          role: m.sender === 'user' ? 'user' : 'model',
          parts
        };
      });

      // Add latest query
      const latestParts = [{ text: query || "इस अटैचमेंट को देखकर बताओ छोटे को क्या करना चाहिए." }];
      if (currentImg) {
        latestParts.push({
          inlineData: {
            mimeType: currentImg.mimeType,
            data: currentImg.base64
          }
        });
      }
      contents.push({ role: 'user', parts: latestParts });

      const payload = {
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let detail = "";
        try {
          detail = await response.text();
        } catch {
          detail = "";
        }
        throw new Error(`AI service HTTP ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ""}`);
      }

      const result = await response.json();
      let aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiText) {
        throw new Error("No text candidate received from AI service");
      }

      // Parse Action Tag if present
      let proposedAction = null;
      const actionMatch = aiText.match(/<<<ACTION:(.*?)>>>/);
      if (actionMatch && actionMatch[1]) {
        try {
          const parsed = JSON.parse(actionMatch[1]);
          proposedAction = {
            id: 'act_' + Date.now(),
            type: parsed.type,
            data: parsed.data,
            status: 'pending'
          };
          aiText = aiText.replace(/<<<ACTION:(.*?)>>>/, '').trim();
        } catch (pe) {
          console.warn("Could not parse AI action JSON:", pe);
        }
      }

      const aiMsg = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        proposedAction
      };

      setAppData(prev => ({
        ...prev,
        chatSessions: prev.chatSessions.map(s => {
          if (s.id === activeSession.id) {
            return {
              ...s,
              updatedAt: new Date().toISOString(),
              messages: [...s.messages, aiMsg]
            };
          }
          return s;
        })
      }));

    } catch (err) {
      console.warn("Real AI connection error:", err);
      // Strictly NO fake replies! Show genuine error message
      const errorMsg = {
        id: 'err_' + Date.now(),
        sender: 'ai',
        isError: true,
        text: "बड़े भैया अभी AI service से connect नहीं हो पा रहे हैं. थोड़ी देर बाद फिर कोशिश करो.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setAppData(prev => ({
        ...prev,
        chatSessions: prev.chatSessions.map(s => {
          if (s.id === activeSession.id) {
            return {
              ...s,
              messages: [...s.messages, errorMsg]
            };
          }
          return s;
        })
      }));
    } finally {
      setAiLoading(false);
    }
  };

  const handleConfirmActionCard = (msgId, action) => {
    onApplyAction(action);
    // Mark as applied in state
    setAppData(prev => ({
      ...prev,
      chatSessions: prev.chatSessions.map(s => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            messages: s.messages.map(m => {
              if (m.id === msgId && m.proposedAction) {
                return { ...m, proposedAction: { ...m.proposedAction, status: 'applied' } };
              }
              return m;
            })
          };
        }
        return s;
      })
    }));
  };

  const handleRejectActionCard = (msgId) => {
    setAppData(prev => ({
      ...prev,
      chatSessions: prev.chatSessions.map(s => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            messages: s.messages.map(m => {
              if (m.id === msgId && m.proposedAction) {
                return { ...m, proposedAction: { ...m.proposedAction, status: 'rejected' } };
              }
              return m;
            })
          };
        }
        return s;
      })
    }));
    showToast('कार्रवाई रद्द की गई', 'info');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl relative">
      
      {/* Top Bhaiya Status Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BadeBhaiyaLogo className="w-10 h-10" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs text-slate-100">बड़े भैया (IITian Mentor)</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-400">
              JEE Main + Advanced • वास्तविक डेटा आधारित यथार्थवादी मार्गदर्शन
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSessionDrawer(!showSessionDrawer)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span className="max-w-[120px] truncate">{activeSession.title}</span>
          </button>
          <button
            onClick={createNewSession}
            className="p-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 transition"
            title="नया चैट सेशन"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Session Drawer Modal / Overlay */}
      {showSessionDrawer && (
        <div className="absolute inset-y-0 right-0 w-72 bg-slate-900 border-l border-slate-800 z-30 flex flex-col shadow-2xl animate-fade-in">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200">पिछली बातचीत (Chat Sessions)</h4>
            <button onClick={() => setShowSessionDrawer(false)} className="text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2 border-b border-slate-800">
            <button
              onClick={createNewSession}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Chat Session</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {appData.chatSessions.map(sess => (
              <div
                key={sess.id}
                className={`p-2.5 rounded-lg border transition text-xs flex items-center justify-between ${
                  sess.id === activeSession.id
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-200'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div 
                  className="flex-1 truncate cursor-pointer mr-2"
                  onClick={() => {
                    setAppData(prev => ({ ...prev, activeSessionId: sess.id }));
                    setShowSessionDrawer(false);
                  }}
                >
                  <div className="font-semibold truncate">{sess.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {new Date(sess.updatedAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      const renamed = prompt('चैट का नया नाम दर्ज करें:', sess.title);
                      if (renamed && renamed.trim()) {
                        setAppData(prev => ({
                          ...prev,
                          chatSessions: prev.chatSessions.map(s => s.id === sess.id ? { ...s, title: renamed.trim() } : s)
                        }));
                      }
                    }}
                    className="p-1 text-slate-500 hover:text-slate-300"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteSession(sess.id)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {activeSession.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start gap-2 max-w-[88%] sm:max-w-[78%]">
              {msg.sender === 'ai' && (
                <BadeBhaiyaLogo className="w-7 h-7 mt-0.5" glow={false} />
              )}
              
              <div className={`rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-slate-950 font-medium rounded-tr-none shadow-md'
                  : msg.isError
                    ? 'bg-rose-950/40 border border-rose-500/50 text-rose-200 rounded-tl-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none shadow-md'
              }`}>
                {/* Attached Image Thumbnail */}
                {msg.attachedImage?.base64 && (
                  <div className="mb-2">
                    <img 
                      src={`data:${msg.attachedImage.mimeType || 'image/jpeg'};base64,${msg.attachedImage.base64}`} 
                      alt="attachment" 
                      className="max-h-48 rounded-lg border border-slate-700 object-cover"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">📎 {msg.attachedImage.name || 'Screenshot'}</span>
                  </div>
                )}

                {/* Proper Markdown Rendering for AI & User Messages */}
                {msg.sender === 'ai' ? (
                  <FormattedMessage text={msg.text} />
                ) : (
                  msg.text
                )}

                {/* Structured Action Proposal Card */}
                {msg.proposedAction && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                        प्रस्तावित बदलाव ({msg.proposedAction.type})
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        msg.proposedAction.status === 'applied' ? 'bg-emerald-500/20 text-emerald-400' :
                        msg.proposedAction.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {msg.proposedAction.status === 'applied' ? '✓ Saved into App' :
                         msg.proposedAction.status === 'rejected' ? 'रद्द' : 'पुष्टि बाकी (Confirmation Needed)'}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-300 bg-slate-950/80 p-2 rounded border border-slate-800">
                      {Object.entries(msg.proposedAction.data).map(([k, v]) => (
                        <div key={k}><strong className="text-cyan-400">{k}:</strong> {String(v)}</div>
                      ))}
                    </div>

                    {msg.proposedAction.status === 'pending' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleConfirmActionCard(msg.id, msg.proposedAction)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition flex items-center gap-1 shadow"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>हाँ, Save कर दो</span>
                        </button>
                        <button
                          onClick={() => handleRejectActionCard(msg.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold transition flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>नहीं</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className={`text-[9px] mt-2 font-mono ${
                  msg.sender === 'user' ? 'text-slate-800 text-right' : 'text-slate-500'
                }`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          </div>
        ))}

        {aiLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2 max-w-[85%]">
              <BadeBhaiyaLogo className="w-7 h-7" />
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl rounded-tl-none p-4 text-xs text-cyan-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                <span>बड़े भैया सोच रहे हैं और तुम्हारा असली डेटा देख रहे हैं...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Attachment Preview if any */}
      {attachedImage && (
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-cyan-300">
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span className="truncate max-w-xs">{attachedImage.name} (तैयार है)</span>
          </div>
          <button onClick={() => setAttachedImage(null)} className="text-slate-400 hover:text-rose-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          accept="image/*,application/pdf" 
          className="hidden" 
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition"
          title="प्रश्न, टेस्ट या शेड्यूल का स्क्रीनशॉट जोड़ें"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <textarea
          rows={1}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendToBadeBhaiya();
            }
          }}
          placeholder="छोटे, सवाल पूछो या लिखो 'NLM का 1 backlog जुड़ गया'..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
        />
        <button
          onClick={() => sendToBadeBhaiya()}
          disabled={aiLoading || (!chatInput.trim() && !attachedImage)}
          className="w-10 h-10 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 flex items-center justify-center font-bold transition shadow"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}

function ScheduleManager({ appData, setAppData, setModalType, showToast }) {
  const deleteScheduleItem = (id) => {
    setAppData(prev => ({
      ...prev,
      pwSchedule: prev.pwSchedule.filter(s => s.id !== id)
    }));
    showToast('टाइमटेबल एंट्री हटाई गई', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100">PW Live Batch Schedule</h2>
          <p className="text-xs text-slate-400 mt-1">
            केवल तुम्हारे द्वारा प्रदान किया गया वास्तविक टाइमटेबल मान्य होगा. कोई काल्पनिक क्लास नहीं.
          </p>
        </div>
        <button
          onClick={() => setModalType('add-schedule')}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ PW क्लास शेड्यूल जोड़ें</span>
        </button>
      </div>

      {appData.pwSchedule.length === 0 ? (
        <div className="p-12 rounded-xl bg-slate-900/60 border border-dashed border-slate-800 text-center">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-amber-300/80">PW schedule not provided yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            इस सप्ताह का PW शेड्यूल अभी दर्ज नहीं किया गया है. अपने PW ऐप से टाइमटेबल देखकर यहाँ जोड़ो.
          </p>
          <button
            onClick={() => setModalType('add-schedule')}
            className="mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>शेड्यूल दर्ज करें</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appData.pwSchedule.map(item => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    {item.day || 'Day not provided'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{item.time || 'Time not provided'}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 mt-2">{item.subject}</h4>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">{item.topic}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">PW Batch Lecture</span>
                <button
                  onClick={() => deleteScheduleItem(item.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ErrorBookView({ appData, setAppData, setModalType, showToast }) {
  const [filterReason, setFilterReason] = useState('All');

  const filteredErrors = useMemo(() => {
    return appData.errorBook.filter(err => {
      if (filterReason !== 'All' && err.reason !== filterReason) return false;
      return true;
    });
  }, [appData.errorBook, filterReason]);

  const toggleMastery = (id) => {
    setAppData(prev => ({
      ...prev,
      errorBook: prev.errorBook.map(e => e.id === id ? {
        ...e,
        status: e.status === 'mastered' ? 'needs_review' : 'mastered'
      } : e)
    }));
    showToast('एरर स्टेटस अपडेट हुआ!', 'success');
  };

  const deleteError = (id) => {
    setAppData(prev => ({
      ...prev,
      errorBook: prev.errorBook.filter(e => e.id !== id)
    }));
    showToast('एरर बुक से प्रश्न हटाया गया', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100">JEE Error Book (गलतियों की डायरी)</h2>
            <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-bold">
              {appData.errorBook.length} रिकॉर्डेड
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            टेस्ट, DPP, PYQ और मॉड्यूल में हुई गलतियों को यहाँ सहेजो.
          </p>
        </div>

        <button
          onClick={() => setModalType('add-error')}
          className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>+ गलती दर्ज करें</span>
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {['All', 'Conceptual', 'Calculation', 'Silly Mistake', 'Time Pressure'].map(r => (
          <button
            key={r}
            onClick={() => setFilterReason(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterReason === r
                ? 'bg-rose-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {filteredErrors.length === 0 ? (
        <div className="p-12 rounded-xl bg-slate-900/60 border border-dashed border-slate-800 text-center">
          <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">Data not provided yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            अभी तक कोई गलती दर्ज नहीं की गई है. टेस्ट या DPP में जो सवाल गलत हो, उसे तुरंत यहाँ जोड़ो!
          </p>
          <button
            onClick={() => setModalType('add-error')}
            className="mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 text-rose-400" />
            <span>पहली गलती दर्ज करें</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredErrors.map(err => (
            <div key={err.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700">
                      {err.source}
                    </span>
                    <span className="text-xs font-bold text-cyan-400">{err.subject}</span>
                    <span className="text-xs text-slate-400">• {err.chapter}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 mt-2">{err.questionDesc}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase border bg-rose-500/10 text-rose-400 border-rose-500/30">
                    {err.reason}
                  </span>
                  <button
                    onClick={() => deleteError(err.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                    मेरी गलती:
                  </span>
                  <p className="text-slate-300">{err.myMistake}</p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    सही Concept / उपाय:
                  </span>
                  <p className="text-slate-300">{err.correctConcept || "Concept review required"}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                <span className="text-[11px] text-slate-500">
                  तारीख: {new Date(err.date || Date.now()).toLocaleDateString('hi-IN')}
                </span>
                <button
                  onClick={() => toggleMastery(err.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                    err.status === 'mastered'
                      ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  {err.status === 'mastered' ? '✓ सुधारा गया (Mastered)' : 'सुधारना बाकी'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DoubtTrackerView({ appData, setAppData, setModalType, showToast, onAskBhaiya }) {
  const toggleDoubtStatus = (id) => {
    setAppData(prev => ({
      ...prev,
      doubts: prev.doubts.map(d => d.id === id ? {
        ...d,
        status: d.status === 'solved' ? 'pending' : 'solved'
      } : d)
    }));
    showToast('डाउट स्टेटस अपडेट हुआ', 'success');
  };

  const deleteDoubt = (id) => {
    setAppData(prev => ({
      ...prev,
      doubts: prev.doubts.filter(d => d.id !== id)
    }));
    showToast('डाउट हटाया गया', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100">Doubt Tracker</h2>
          <p className="text-xs text-slate-400 mt-1">
            संदेह नोट करो और सीधे बड़े भैया से पूछो.
          </p>
        </div>
        <button
          onClick={() => setModalType('add-doubt')}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ नया डाउट जोड़ें</span>
        </button>
      </div>

      {appData.doubts.length === 0 ? (
        <div className="p-12 rounded-xl bg-slate-900/60 border border-dashed border-slate-800 text-center">
          <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">Data not provided yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            अभी कोई डाउट दर्ज नहीं है.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {appData.doubts.map(d => (
            <div key={d.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase bg-slate-800 px-2 py-0.5 rounded text-cyan-400 border border-slate-700">
                    {d.subject}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">• {d.chapter}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    d.status === 'solved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {d.status === 'solved' ? 'Solved' : 'Pending'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 mt-2">{d.question}</h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onAskBhaiya(d.question)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <BadeBhaiyaLogo className="w-3.5 h-3.5" glow={false} />
                  <span>भैया से समझें</span>
                </button>
                <button
                  onClick={() => toggleDoubtStatus(d.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition"
                >
                  {d.status === 'solved' ? 'पेंडिंग करें' : 'सॉल्व हुआ'}
                </button>
                <button
                  onClick={() => deleteDoubt(d.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RevisionView({ appData, setAppData, setModalType, showToast }) {
  const logRevision = (id) => {
    setAppData(prev => ({
      ...prev,
      revisions: prev.revisions.map(r => r.id === id ? {
        ...r,
        revisionCount: (r.revisionCount || 0) + 1,
        lastRevisedDate: new Date().toISOString().split('T')[0]
      } : r)
    }));
    showToast('रिवीज़न दर्ज हुआ!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100">Revision Tracker</h2>
          <p className="text-xs text-slate-400 mt-1">
            पूर्ण किए गए अध्यायों का समयबद्ध रिवीज़न.
          </p>
        </div>
        <button
          onClick={() => setModalType('add-revision')}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ नया रिवीज़न चैप्टर जोड़ें</span>
        </button>
      </div>

      {appData.revisions.length === 0 ? (
        <div className="p-12 rounded-xl bg-slate-900/60 border border-dashed border-slate-800 text-center">
          <RefreshCw className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">Data not provided yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            अभी कोई रिवीज़न शेड्यूल नहीं है. जो चैप्टर्स पढ़ चुके हो उन्हें यहाँ जोड़ो.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appData.revisions.map(rev => (
            <div key={rev.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                  {rev.subject}
                </span>
                <h4 className="text-xs font-bold text-slate-100 mt-2">{rev.chapter}</h4>
                <div className="text-xs text-slate-400 mt-2 space-y-1">
                  <div>कुल रिवीज़न: <strong className="text-slate-200">{rev.revisionCount || 0} बार</strong></div>
                  <div>अंतिम रिवीज़न: <span className="text-slate-300">{rev.lastRevisedDate || 'अभी तक नहीं'}</span></div>
                </div>
              </div>

              <button
                onClick={() => logRevision(rev.id)}
                className="mt-4 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>आज रिवीज़न पूरा किया (+1)</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TestCenterView({ appData, setAppData, setModalType }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100">JEE Test Center & Performance</h2>
          <p className="text-xs text-slate-400 mt-1">
            PW टेस्ट सीरीज के वास्तविक अंक. कोई फर्जी स्कोर नहीं.
          </p>
        </div>
        <button
          onClick={() => setModalType('add-test')}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ टेस्ट रिजल्ट दर्ज करें</span>
        </button>
      </div>

      {appData.tests.length === 0 ? (
        <div className="p-12 rounded-xl bg-slate-900/60 border border-dashed border-slate-800 text-center">
          <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">Data not provided yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            अभी तक कोई टेस्ट रिजल्ट दर्ज नहीं किया गया है. जब भी टेस्ट दो, अपने असली अंक यहाँ जोड़ो.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {appData.tests.map(test => {
            const accuracy = test.attempted > 0 ? Math.round((test.correct / test.attempted) * 100) : 0;
            return (
              <div key={test.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-slate-800 px-2 py-0.5 rounded text-indigo-400 border border-slate-700">
                      {test.subject || 'Full Test'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{test.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 mt-1">{test.testName}</h4>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">अंक (Marks)</span>
                    <strong className="text-sm text-cyan-400">{test.marksObtained} / {test.totalMarks}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Accuracy</span>
                    <strong className="text-sm text-emerald-400">{accuracy}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">सही / गलत</span>
                    <span className="text-slate-300 font-medium">{test.correct} / {test.incorrect}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FocusTimerView({ 
  timerSeconds, setTimerSeconds, timerRunning, setTimerRunning, 
  timerMode, setTimerMode, timerSubject, setTimerSubject, 
  timerTopic, setTimerTopic, logCompletedSession, showToast, focusSessions 
}) {
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleManualLog = () => {
    if (timerMode === 'stopwatch' && timerSeconds >= 60) {
      const minutes = Math.floor(timerSeconds / 60);
      logCompletedSession(minutes);
      setTimerSeconds(0);
      setTimerRunning(false);
      showToast(`${minutes} मिनट का फोकस सेशन दर्ज हुआ! 🎯`, 'success');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-5 sm:space-y-6 shadow-2xl">
        
        <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setTimerMode('pomodoro');
              setTimerRunning(false);
              setTimerSeconds(25 * 60);
            }}
            className={`px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              timerMode === 'pomodoro' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            पोमोडोरो (25m)
          </button>
          <button
            onClick={() => {
              setTimerMode('stopwatch');
              setTimerRunning(false);
              setTimerSeconds(0);
            }}
            className={`px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              timerMode === 'stopwatch' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            स्टॉपवॉच (फ्री स्टडी)
          </button>
        </div>

        <div className="font-mono text-5xl sm:text-6xl font-extrabold tracking-tight text-cyan-400 my-4 select-text">
          {formatTime(timerSeconds)}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <select
            value={timerSubject}
            onChange={(e) => setTimerSubject(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
          >
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Mathematics">Mathematics</option>
          </select>
          <input
            type="text"
            placeholder="चैप्टर / टॉपिक..."
            value={timerTopic}
            onChange={(e) => setTimerTopic(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none w-44 sm:w-48"
          />
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => setTimerRunning(!timerRunning)}
            className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-extrabold text-xs transition shadow-lg flex items-center gap-2 ${
              timerRunning 
                ? 'bg-rose-600 hover:bg-rose-500 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
            }`}
          >
            {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{timerRunning ? 'रोकें' : 'शुरू करें'}</span>
          </button>

          {timerMode === 'stopwatch' && (
            <button
              onClick={handleManualLog}
              disabled={timerSeconds < 60}
              className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              सत्र सहेजें
            </button>
          )}

          <button
            onClick={() => {
              setTimerRunning(false);
              setTimerSeconds(timerMode === 'pomodoro' ? 25 * 60 : 0);
            }}
            className="p-2.5 sm:p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>

      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="font-bold text-xs text-slate-200 mb-3">हाल के स्टडी सेशन्स (Real Logged Study)</h3>
        {focusSessions.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">Data not provided yet (अभी कोई सत्र दर्ज नहीं हुआ)</p>
        ) : (
          <div className="space-y-2">
            {focusSessions.slice(0, 5).map(s => (
              <div key={s.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-cyan-400">{s.subject}</span>
                  <span className="text-slate-400 ml-2">• {s.chapter}</span>
                </div>
                <div className="text-slate-300 font-mono font-bold">
                  {s.durationMin} मिनट
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

function PyqModuleView({ appData, setModalType }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100">PYQ & PW Modules Practice</h2>
          <p className="text-xs text-slate-400 mt-1">
            प्रैक्टिस सवालों का वास्तविक रिकॉर्ड.
          </p>
        </div>
        <button
          onClick={() => setModalType('add-pyq')}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ प्रैक्टिस रिकॉर्ड जोड़ें</span>
        </button>
      </div>

      {appData.pyqModules.length === 0 ? (
        <div className="p-12 rounded-xl bg-slate-900/60 border border-dashed border-slate-800 text-center">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">Data not provided yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            अभी कोई PYQ या मॉड्यूल रिकॉर्ड नहीं जोड़ा गया है.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appData.pyqModules.map(item => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                  {item.type}
                </span>
                <span className="text-xs text-slate-400">{item.subject}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-100">{item.chapter}</h4>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">सॉल्व किए:</span>
                <strong className="text-emerald-400">{item.completedCount} / {item.totalTarget} सवाल</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NotesView({ appData, setModalType }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100">JEE Quick Notes & Formulas</h2>
          <p className="text-xs text-slate-400 mt-1">
            अपने नोट्स, सूत्र और शॉर्ट ट्रिक्स विषयवार सहेजो.
          </p>
        </div>
        <button
          onClick={() => setModalType('add-note')}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ नया नोट जोड़ें</span>
        </button>
      </div>

      {appData.notes.length === 0 ? (
        <div className="p-12 rounded-xl bg-slate-900/60 border border-dashed border-slate-800 text-center">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">Data not provided yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            अभी कोई नोट्स सहेजे नहीं गए हैं.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appData.notes.map(note => (
            <div key={note.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  {note.subject}
                </span>
                <span className="text-xs text-slate-400">{note.chapter}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-200">{note.topic}</h4>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                {note.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsView({ appData, userStats, comebackStats }) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
        <h2 className="text-base font-bold text-slate-100">वास्तविक विश्लेषिकी (Real Analytics)</h2>
        <p className="text-xs text-slate-400 mt-1">
          कोई फर्ज़ी ग्राफ़ नहीं. केवल तुम्हारे इनपुट्स से निकला हुआ वास्तविक डेटा.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">बैकलाग पूरा होने का प्रतिशत</span>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">{userStats.backlogPct}%</div>
          <span className="text-[11px] text-slate-500">
            {userStats.completedBacklogCount} / {userStats.totalBacklog} लेक्चर्स
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">कुल सेल्फ-स्टडी समय</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {(userStats.totalFocusMinutes / 60).toFixed(1)} घंटे
          </div>
          <span className="text-[11px] text-slate-500">{appData.focusSessions.length} सेशन्स</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Error Book Mastery</span>
          <div className="text-2xl font-extrabold text-rose-400 mt-1">
            {appData.errorBook.filter(e => e.status === 'mastered').length} / {appData.errorBook.length}
          </div>
          <span className="text-[11px] text-slate-500">सुलझाई गई गलतियाँ</span>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="font-bold text-xs text-slate-200 mb-3">कमजोर टॉपिक्स (Data-Grounded)</h3>
        {appData.errorBook.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">Data not provided yet (कोई गलती दर्ज नहीं है)</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(
              appData.errorBook.reduce((acc, err) => {
                const key = `${err.subject} : ${err.chapter}`;
                acc[key] = (acc[key] || 0) + 1;
                return acc;
              }, {})
            ).map(([topic, count]) => (
              <div key={topic} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">{topic}</span>
                <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  {count} गलतियाँ दर्ज
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GlobalSearchView({ searchQuery, setSearchQuery, results }) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ग्लोबल सर्च: लेक्चर्स, गलतियाँ, नोट्स, डाउट्स खोजें..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 shadow-lg"
          autoFocus
        />
      </div>

      {searchQuery.trim() && results && (
        <div className="space-y-4">
          {results.backlog.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase">बैकलाग लेक्चर्स ({results.backlog.length})</h4>
              {results.backlog.map(b => (
                <div key={b.id} className="text-xs p-2 rounded bg-slate-950 flex justify-between">
                  <span>{b.subject} - {b.chapter}: <strong>{b.lectureTitle}</strong></span>
                  <span className="text-slate-400">{b.status}</span>
                </div>
              ))}
            </div>
          )}

          {results.errors.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-rose-400 uppercase">Error Book ({results.errors.length})</h4>
              {results.errors.map(e => (
                <div key={e.id} className="text-xs p-2 rounded bg-slate-950 flex justify-between">
                  <span>{e.chapter}: <strong>{e.questionDesc}</strong></span>
                  <span className="text-rose-300">{e.reason}</span>
                </div>
              ))}
            </div>
          )}

          {results.backlog.length === 0 && results.errors.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-6">कोई मेल खाता हुआ रिकॉर्ड नहीं मिला.</p>
          )}
        </div>
      )}
    </div>
  );
}

function TasksAndAlertsView({ appData, setAppData, setModalType, showToast }) {
  const todayDateStr = new Date().toISOString().split('T')[0];
  const overdueTasks = appData.tasks.filter(t => !t.completed && t.date && t.date < todayDateStr);
  const activeTasks = appData.tasks.filter(t => t.date === todayDateStr || !t.date || t.date > todayDateStr);

  const toggleTask = (id) => {
    setAppData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null } : t)
    }));
    showToast('टास्क अपडेट हुआ', 'success');
  };

  const markOverdueCompleted = (taskId) => {
    setAppData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? {
        ...t,
        completed: true,
        completedAt: new Date().toISOString(),
        resolutionNote: 'कल ही कर लिया'
      } : t)
    }));
    showToast('टास्क पूर्ण मार्क किया गया!', 'success');
  };

  const rescheduleOverdueToToday = (taskId) => {
    setAppData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? {
        ...t,
        date: todayDateStr,
        originalDate: t.originalDate || t.date
      } : t)
    }));
    showToast('टास्क आज के लिए रीशेड्यूल किया गया!', 'success');
  };

  const deleteTask = (id) => {
    setAppData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
    showToast('टास्क हटाया गया', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100">Tasks & Study Alerts</h2>
          <p className="text-xs text-slate-400 mt-1">तय समय पर इन-ऐप अलर्ट और छूटे हुए कार्यों का प्रबंधन.</p>
        </div>
        <button
          onClick={() => setModalType('add-task')}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ नया टास्क जोड़ें</span>
        </button>
      </div>

      {/* Overdue / Pending Tasks Section */}
      {overdueTasks.length > 0 && (
        <div className="p-5 rounded-xl bg-amber-950/25 border border-amber-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-xs text-amber-300">
                छूटे हुए टास्क्स (Overdue Tasks: {overdueTasks.length})
              </h3>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
              कार्रवाई आवश्यक
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            ये कार्य पिछले दिनों पूरे नहीं हुए थे. आप इन्हें अभी पूर्ण मार्क कर सकते हैं या आज की सूची में ले सकते हैं:
          </p>

          <div className="space-y-2">
            {overdueTasks.map(t => (
              <div key={t.id} className="p-3 rounded-lg bg-slate-900 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-slate-200">{t.title}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-1">
                    <span className="text-amber-400 font-mono font-semibold">तारीख: {t.date}</span>
                    {t.time && <span className="text-cyan-400 font-mono">⏰ {t.time}</span>}
                    {t.subject && <span>• {t.subject}</span>}
                    {t.chapter && <span>• {t.chapter}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => markOverdueCompleted(t.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>कल ही कर लिया</span>
                  </button>
                  <button
                    onClick={() => rescheduleOverdueToToday(t.id)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>आज करेंगे</span>
                  </button>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition"
                    title="स्थायी रूप से हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active & Scheduled Tasks */}
      {activeTasks.length === 0 && overdueTasks.length === 0 ? (
        <div className="p-12 rounded-xl bg-slate-900/60 border border-dashed border-slate-800 text-center">
          <CheckSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">Data not provided yet</h3>
          <p className="text-xs text-slate-500 mt-1">कोई टास्क सेट नहीं किया गया है.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activeTasks.map(t => (
            <div key={t.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTask(t.id)}
                  className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                    t.completed ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600'
                  }`}
                >
                  {t.completed && <CheckCircle className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <div>
                  <span className={`text-xs font-semibold ${t.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {t.title}
                  </span>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                    {t.time && (
                      <span className="text-cyan-400 font-mono font-semibold bg-cyan-500/10 px-1 rounded border border-cyan-500/20">
                        ⏰ {t.time}
                      </span>
                    )}
                    {t.date && <span className="font-mono">{t.date}</span>}
                    {t.chapter && <span>• {t.chapter}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">{t.subject}</span>
                <button
                  onClick={() => deleteTask(t.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition"
                  title="हटाएं"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsView({ appData, setAppData, showToast }) {
  const exportData = () => {
    const jsonStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JEE_TRACKER_DATA_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('बैकअप डाउनलोड हो गया!', 'success');
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.backlogLectures && Array.isArray(parsed.backlogLectures)) {
          setAppData(parsed);
          showToast('डेटा सफलतापूर्वक रीस्टोर हुआ!', 'success');
        } else {
          showToast('अमान्य फ़ाइल फॉर्मेट!', 'error');
        }
      } catch (err) {
        showToast('फ़ाइल पढ़ने में त्रुटि!', 'error');
      }
    };
    reader.readAsText(file);
  };

  const resetAllData = () => {
    if (confirm("क्या आप वाकई सारा डेटा रीसेट करना चाहते हैं?")) {
      setAppData(INITIAL_STATE);
      showToast('सभी डेटा रीसेट कर दिया गया', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
        <h2 className="text-base font-bold text-slate-100">Settings & Storage Status</h2>
        <p className="text-xs text-slate-400 mt-1">डेटा बैकअप, रीस्टोर और सिस्टम कॉन्फ़िगरेशन.</p>
      </div>

      {/* Storage Status Info */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>लोकल स्टोरेज इंजन (Persistent Storage)</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          आपका डेटा ब्राउज़र/Capacitor के परसिस्टेंट स्टोरेज (IndexedDB) में सुरक्षित रहता है. ऐप बंद करने या रीलोड करने पर डेटा डिलीट नहीं होगा.
        </p>
        <div className="text-[11px] text-amber-400/90 font-mono pt-1">
          नोट: क्लाउड सिंक अभी कॉन्फ़िगर नहीं है (Cloud sync not configured). डेटा केवल इसी डिवाइस पर सुरक्षित है.
        </div>
      </div>

      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="font-bold text-xs text-slate-200">डेटा बैकअप एवं रीस्टोर (JSON Backup)</h3>
        <p className="text-xs text-slate-400">
          अपने पूरे JEE ट्रैकर डेटा को सुरक्षित रखने के लिए JSON फाइल डाउनलोड करें.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportData}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>डेटा एक्सपोर्ट करें (Download JSON)</span>
          </button>

          <label className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>डेटा इम्पोर्ट करें (Restore JSON)</span>
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-3">
        <h3 className="font-bold text-xs text-rose-300">डेटा रीसेट (Factory Reset)</h3>
        <p className="text-xs text-slate-400">
          सावधानी: यह आपके सभी दर्ज बैकलाग, एरर बुक और टेस्ट रिकॉर्ड को शून्य कर देगा.
        </p>
        <button
          onClick={resetAllData}
          className="px-4 py-2 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white font-bold text-xs border border-rose-500/40 transition"
        >
          पूरा डेटा रीसेट करें
        </button>
      </div>
    </div>
  );
}

function ModalContainer({ type, onClose, setAppData, showToast }) {
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(''); // Zero hardcoded 110m!
  
  // Task specific date and time fields
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskTime, setTaskTime] = useState('');

  const [source, setSource] = useState('PW Test');
  const [myMistake, setMyMistake] = useState('');
  const [correctConcept, setCorrectConcept] = useState('');
  const [reason, setReason] = useState('Conceptual');

  // Zero hardcoded test numbers (180/300/45/35 removed)
  const [testName, setTestName] = useState('');
  const [marks, setMarks] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [attempted, setAttempted] = useState('');
  const [correct, setCorrect] = useState('');

  // Zero hardcoded Monday/10:30 AM
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [topic, setTopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (type === 'add-backlog') {
      if (!chapter.trim() || !title.trim()) return;
      const newLec = {
        id: 'bl_' + Date.now(),
        subject,
        chapter: chapter.trim(),
        lectureTitle: title.trim(),
        durationMin: duration ? Number(duration) : null,
        addedDate: new Date().toISOString(),
        status: 'pending'
      };
      setAppData(prev => ({
        ...prev,
        backlogLectures: [newLec, ...prev.backlogLectures]
      }));
      showToast('बैकलाग लेक्चर जोड़ा गया!', 'success');
    }

    if (type === 'add-error') {
      if (!chapter.trim() || !title.trim() || !myMistake.trim()) return;
      const newErr = {
        id: 'err_' + Date.now(),
        subject,
        chapter: chapter.trim(),
        source,
        questionDesc: title.trim(),
        myMistake: myMistake.trim(),
        correctConcept: correctConcept.trim(),
        reason,
        date: new Date().toISOString(),
        status: 'needs_review'
      };
      setAppData(prev => ({
        ...prev,
        errorBook: [newErr, ...prev.errorBook]
      }));
      showToast('गलती सहेजी गई!', 'success');
    }

    if (type === 'add-doubt') {
      if (!chapter.trim() || !title.trim()) return;
      const newDoubt = {
        id: 'dbt_' + Date.now(),
        subject,
        chapter: chapter.trim(),
        question: title.trim(),
        status: 'pending',
        date: new Date().toISOString()
      };
      setAppData(prev => ({
        ...prev,
        doubts: [newDoubt, ...prev.doubts]
      }));
      showToast('डाउट दर्ज किया गया!', 'success');
    }

    if (type === 'add-schedule') {
      if (!topic.trim()) return;
      const newSched = {
        id: 'sch_' + Date.now(),
        day: day.trim() || 'Unspecified Day',
        time: time.trim() || 'Unspecified Time',
        subject,
        topic: topic.trim()
      };
      setAppData(prev => ({
        ...prev,
        pwSchedule: [newSched, ...prev.pwSchedule]
      }));
      showToast('PW क्लास टाइमटेबल में जोड़ी गई!', 'success');
    }

    if (type === 'add-test') {
      if (!testName.trim()) return;
      const newTest = {
        id: 'tst_' + Date.now(),
        testName: testName.trim(),
        subject,
        marksObtained: Number(marks) || 0,
        totalMarks: Number(totalMarks) || 300,
        attempted: Number(attempted) || 0,
        correct: Number(correct) || 0,
        incorrect: (Number(attempted) || 0) - (Number(correct) || 0),
        date: new Date().toISOString().split('T')[0]
      };
      setAppData(prev => ({
        ...prev,
        tests: [newTest, ...prev.tests]
      }));
      showToast('टेस्ट स्कोर दर्ज किया गया!', 'success');
    }

    if (type === 'add-task') {
      if (!title.trim()) return;
      const newTask = {
        id: 'tsk_' + Date.now(),
        title: title.trim(),
        subject,
        chapter: chapter.trim(),
        date: taskDate || new Date().toISOString().split('T')[0],
        time: taskTime || '',
        completed: false
      };
      setAppData(prev => ({
        ...prev,
        tasks: [newTask, ...prev.tasks]
      }));
      showToast('टास्क जोड़ा गया!', 'success');
    }

    if (type === 'add-note') {
      if (!chapter.trim() || !title.trim() || !myMistake.trim()) return;
      const newNote = {
        id: 'nt_' + Date.now(),
        subject,
        chapter: chapter.trim(),
        topic: title.trim(),
        content: myMistake.trim(),
        date: new Date().toISOString().split('T')[0]
      };
      setAppData(prev => ({
        ...prev,
        notes: [newNote, ...prev.notes]
      }));
      showToast('नोट्स सहेजे गए!', 'success');
    }

    if (type === 'add-revision') {
      if (!chapter.trim()) return;
      const newRev = {
        id: 'rev_' + Date.now(),
        subject,
        chapter: chapter.trim(),
        revisionCount: 0,
        lastRevisedDate: null
      };
      setAppData(prev => ({
        ...prev,
        revisions: [newRev, ...prev.revisions]
      }));
      showToast('रिवीज़न सूची में चैप्टर जुड़ा!', 'success');
    }

    if (type === 'add-pyq') {
      if (!chapter.trim() || !title.trim()) return;
      const newPyq = {
        id: 'pyq_' + Date.now(),
        subject,
        chapter: chapter.trim(),
        type: 'PYQ & Module',
        totalTarget: Number(duration) || 0,
        completedCount: Number(title) || 0
      };
      setAppData(prev => ({
        ...prev,
        pyqModules: [newPyq, ...prev.pyqModules]
      }));
      showToast('प्रैक्टिस रिकॉर्ड सहेजा गया!', 'success');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scale-up max-h-[92vh] flex flex-col">
        
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <h3 className="font-bold text-xs text-slate-100">
            {type === 'add-backlog' && 'नया बैकलाग लेक्चर जोड़ें'}
            {type === 'add-error' && 'Error Book में गलती दर्ज करें'}
            {type === 'add-doubt' && 'नया डाउट जोड़ें'}
            {type === 'add-schedule' && 'PW क्लास टाइमटेबल जोड़ें'}
            {type === 'add-test' && 'टेस्ट रिजल्ट दर्ज करें'}
            {type === 'add-task' && 'आज का टास्क जोड़ें'}
            {type === 'add-note' && 'नया नोट जोड़ें'}
            {type === 'add-revision' && 'रिवीज़न हेतु चैप्टर जोड़ें'}
            {type === 'add-pyq' && 'PYQ / मॉड्यूल प्रैक्टिस रिकॉर्ड जोड़ें'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-xs overflow-y-auto custom-scrollbar flex-1">
          
          <div>
            <label className="block text-slate-400 mb-1">विषय (Subject)</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="Physics">Physics (भौतिकी)</option>
              <option value="Chemistry">Chemistry (रसायन)</option>
              <option value="Mathematics">Mathematics (गणित)</option>
            </select>
          </div>

          {type !== 'add-schedule' && type !== 'add-test' && (
            <div>
              <label className="block text-slate-400 mb-1">चैप्टर का नाम (Chapter)</label>
              <input
                type="text"
                required
                placeholder="चैप्टर का वास्तविक नाम दर्ज करें..."
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          )}

          {type === 'add-backlog' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1">लेक्चर का शीर्षक / नंबर</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. Lecture 03: Friction"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">अवधि (मिनट में, यदि ज्ञात हो)</label>
                <input
                  type="number"
                  placeholder="खाली छोड़ सकते हैं या मिनट दर्ज करें..."
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </>
          )}

          {type === 'add-error' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1">प्रश्न का विवरण / सवाल संक्षेप में</label>
                <input
                  type="text"
                  required
                  placeholder="सवाल क्या था..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">स्त्रोत (Source)</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="PW Test">PW Test</option>
                    <option value="PW DPP">PW DPP</option>
                    <option value="PYQ">PYQ</option>
                    <option value="PW Module">PW Module</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">गलती का कारण</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="Conceptual">Conceptual (कॉन्सेप्ट भूल)</option>
                    <option value="Calculation">Calculation (कैलकुलेशन मिस्टेक)</option>
                    <option value="Silly Mistake">Silly Mistake (जल्दबाजी)</option>
                    <option value="Time Pressure">Time Pressure (समय कमी)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">मेरी क्या गलती हुई थी?</label>
                <textarea
                  rows={2}
                  required
                  placeholder="यहाँ वास्तविक गलती लिखें..."
                  value={myMistake}
                  onChange={(e) => setMyMistake(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">सही कॉन्सेप्ट या उपाय</label>
                <textarea
                  rows={2}
                  placeholder="सही तरीका क्या है..."
                  value={correctConcept}
                  onChange={(e) => setCorrectConcept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>
            </>
          )}

          {type === 'add-schedule' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">वार (Day)</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. Monday, Tuesday..."
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">समय (Time)</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. 04:00 PM..."
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">टॉपिक / चैप्टर</label>
                <input
                  type="text"
                  required
                  placeholder="क्लास का टॉपिक..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </>
          )}

          {type === 'add-test' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1">टेस्ट का नाम</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. PW Arjuna Minor Test 01..."
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">प्राप्त अंक</label>
                  <input
                    type="number"
                    required
                    placeholder="उदा. 120"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">कुल अंक</label>
                  <input
                    type="number"
                    required
                    placeholder="उदा. 300"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">प्रयास किए (Attempted)</label>
                  <input
                    type="number"
                    placeholder="कितने प्रश्न किए..."
                    value={attempted}
                    onChange={(e) => setAttempted(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">सही प्रश्न (Correct)</label>
                  <input
                    type="number"
                    placeholder="कितने सही हुए..."
                    value={correct}
                    onChange={(e) => setCorrect(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {type === 'add-task' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1">टास्क शीर्षक</label>
                <input
                  type="text"
                  required
                  placeholder="आज क्या पूरा करना है..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">तारीख (Date)</label>
                  <input
                    type="date"
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">समय (Time - वैकल्पिक)</label>
                  <input
                    type="time"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </>
          )}

          {type === 'add-doubt' && (
            <div>
              <label className="block text-slate-400 mb-1">डाउट / सवाल</label>
              <textarea
                rows={3}
                required
                placeholder="अपना सवाल यहाँ लिखें..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>
          )}

          {type === 'add-note' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1">टॉपिक</label>
                <input
                  type="text"
                  required
                  placeholder="नोट्स का टॉपिक..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">सामग्री</label>
                <textarea
                  rows={4}
                  required
                  placeholder="सूत्र, संकल्पना, या ट्रिक्स यहाँ लिखें..."
                  value={myMistake}
                  onChange={(e) => setMyMistake(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400 resize-none font-mono"
                />
              </div>
            </>
          )}

          {type === 'add-pyq' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1">सॉल्व किए गए सवाल</label>
                <input
                  type="number"
                  placeholder="उदा. 15"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">कुल लक्ष्य (Target)</label>
                <input
                  type="number"
                  placeholder="उदा. 30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </>
          )}

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold transition shadow"
            >
              सहेजें (Save)
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}