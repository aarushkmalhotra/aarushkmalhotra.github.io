"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Terminal, ChevronRight, User, Calendar, MapPin, Code, ExternalLink, MoreVertical, Trash2, ChevronUp as ChevronUpIcon, ChevronDown as ChevronDownIcon, PlayCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getProjects, getAllSkills } from '@/lib/projects';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { config } from '@/lib/config';

interface Command {
  command: string;
  output: React.ReactNode;
  timestamp: Date;
}

interface TerminalProps {
  className?: string;
  heightClass?: string; // override the scrollable height, e.g., "h-[56dvh]"
}

// Helper function to detect initial theme synchronously
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark';
  
  // Check DOM class first (most reliable for hydrated state)
  const htmlClass = document.documentElement.classList.contains('dark');
  if (htmlClass) return 'dark';
  
  // Check localStorage
  const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
  if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
    return storedTheme;
  }
  
  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

export function InteractiveTerminal({ className = '', heightClass }: TerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  // Quest state (for the advanced FUN treasure hunt)
  type QuestStage = 'alpha' | 'beta' | 'gamma' | 'complete';
  const [questActive, setQuestActive] = useState(false);
  const [questStage, setQuestStage] = useState<QuestStage>('alpha');
  const [questInventory, setQuestInventory] = useState<string[]>([]); // collected fragments
  const [questCodes, setQuestCodes] = useState<{ alpha?: string; beta?: string; gamma?: string }>({});
  const [questExpected, setQuestExpected] = useState<{ alpha: string; beta: string; gamma: string } | null>(null);
  const [questLoaded, setQuestLoaded] = useState(false); // avoid overwriting storage before restore
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const typewriterTimerRef = useRef<number | null>(null);
  const entryRefs = useRef<HTMLDivElement[]>([]);
  const scrollCmdIndexRef = useRef<number | null>(null);
  const [caretIndex, setCaretIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [autoMatches, setAutoMatches] = useState<string[] | null>(null);
  const [autoIndex, setAutoIndex] = useState<number>(-1);

  // Cross-instance sync (palette terminal <-> about page terminal)
  const instanceIdRef = useRef<string>('inst-' + Math.random().toString(36).slice(2));
  const channelRef = useRef<BroadcastChannel | null>(null);
  const applyingRemoteRef = useRef(false);
  const router = useRouter();
  // Tailwind dark: variant classes handle theming instantly based on html.dark

  // Lightweight XOR + base64 obfuscation for localStorage persistence of expected quest codes
  const secretKey = (typeof window !== 'undefined' && typeof location !== 'undefined'
    ? location.host
    : 'local') + '|AAR-TERM-v1';
  const xorBytes = (data: Uint8Array, key: string) => {
    const out = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      out[i] = data[i] ^ key.charCodeAt(i % key.length);
    }
    return out;
  };
  const toB64 = (bytes: Uint8Array) => {
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return typeof btoa !== 'undefined' ? btoa(bin) : '';
  };
  const fromB64 = (b64: string) => {
    const bin = typeof atob !== 'undefined' ? atob(b64) : '';
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  };
  const encExpected = (obj: { alpha: string; beta: string; gamma: string } | null) => {
    try {
      if (!obj) return '';
      const json = JSON.stringify(obj);
      const data = new TextEncoder().encode(json);
      const x = xorBytes(data, secretKey);
      return 'v1.' + toB64(x);
    } catch { return ''; }
  };
  const decExpected = (txt: string | null): { alpha: string; beta: string; gamma: string } | null => {
    try {
      if (!txt) return null;
      const parts = txt.split('.');
      const payload = parts.length === 2 ? parts[1] : parts[0];
      const bytes = fromB64(payload);
      const x = xorBytes(bytes, secretKey);
      const json = new TextDecoder().decode(x);
      const obj = JSON.parse(json);
      if (obj && typeof obj.alpha === 'string' && typeof obj.beta === 'string' && typeof obj.gamma === 'string') return obj;
      return null;
    } catch { return null; }
  };

  const projects = getProjects();
  // Precompute allowed navigation paths
  const allowedPaths = useRef<Set<string>>();
  if (!allowedPaths.current) {
    const base = new Set<string>(['/', '/about', '/projects', '/blog', '/contact']);
    // Project detail pages
    projects.forEach(p => base.add(`/projects/${p.id}`.toLowerCase()));
    // Skill pages from library
    try {
      const skills = getAllSkills();
      skills.forEach(s => {
        const slug = encodeURIComponent(s.toLowerCase().replace(/\s/g, '-').replace(/\./g, ''));
        base.add(`/skill/${slug}`);
      });
    } catch {}
    allowedPaths.current = base;
  }

  // Click-to-focus only inside terminal container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleMouseDown = (e: MouseEvent) => {
      // Only focus when clicking inside the terminal area
      inputRef.current?.focus();
    };
    el.addEventListener('mousedown', handleMouseDown);
    return () => el.removeEventListener('mousedown', handleMouseDown);
  }, []);

  // Scroll to bottom on new command
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Setup BroadcastChannel for syncing
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    const ch = new BroadcastChannel('interactive-terminal');
    channelRef.current = ch;
    const onMessage = (ev: MessageEvent) => {
      const msg = ev.data;
      if (!msg || msg.instanceId === instanceIdRef.current) return;
      switch (msg.type) {
        case 'hello': {
          // Provide current snapshot
          ch.postMessage({
            type: 'state:snapshot',
            instanceId: instanceIdRef.current,
            payload: {
              input, caretIndex, history, commandHistory, historyIndex,
              questActive, questStage, questInventory, questCodes, questExpected
            }
          });
          break;
        }
        case 'state:snapshot': {
          applyingRemoteRef.current = true;
          try {
            const s = msg.payload;
            setInput(s.input);
            setCaretIndex(s.caretIndex);
            setHistory(s.history);
            setCommandHistory(s.commandHistory);
            setHistoryIndex(s.historyIndex);
            setQuestActive(s.questActive);
            setQuestStage(s.questStage);
            setQuestInventory(s.questInventory);
            setQuestCodes(s.questCodes);
            setQuestExpected(s.questExpected);
          } finally {
            applyingRemoteRef.current = false;
          }
          break;
        }
        case 'state:input': {
          applyingRemoteRef.current = true;
          try {
            setInput(msg.payload.input);
            setCaretIndex(msg.payload.caretIndex);
          } finally {
            applyingRemoteRef.current = false;
          }
          break;
        }
        case 'state:exec': {
          // Execute remotely without rebroadcast
          applyingRemoteRef.current = true;
          try {
            executeCommand(msg.payload.command);
          } finally {
            applyingRemoteRef.current = false;
          }
          break;
        }
        case 'state:clear': {
          applyingRemoteRef.current = true;
          try {
            setHistory([]);
          } finally {
            applyingRemoteRef.current = false;
          }
          break;
        }
        default:
          break;
      }
    };
    ch.addEventListener('message', onMessage);
    // announce self
    ch.postMessage({ type: 'hello', instanceId: instanceIdRef.current });
    return () => {
      ch.removeEventListener('message', onMessage);
      ch.close();
    };
  }, [input, caretIndex, history, commandHistory, historyIndex, questActive, questStage, questInventory, questCodes, questExpected]);

  // Initialize with a one-time boot sequence then welcome message
  useEffect(() => {
    
    // Restore quest state from localStorage
    try {
      const saved = localStorage.getItem('terminalQuestState');
      if (saved) {
        const s = JSON.parse(saved);
        const hasProgress = s.questCodes && (s.questCodes.alpha || s.questCodes.beta || s.questCodes.gamma);
        setQuestActive(Boolean(s.questActive) || Boolean(hasProgress));
        if (s.questStage) setQuestStage(s.questStage);
        if (Array.isArray(s.questInventory)) setQuestInventory(s.questInventory);
        if (s.questCodes) setQuestCodes(s.questCodes);
        // Backward compatibility: if plain expected present
        if (s.questExpected) setQuestExpected(s.questExpected);
      }
      // New encrypted expected storage
      const enc = localStorage.getItem('terminalQuestExpectedEnc');
      const dec = decExpected(enc);
      if (dec) setQuestExpected(dec);
    } catch {}

    const hasBooted = sessionStorage.getItem('terminalBooted');
    if (!hasBooted) {
      setIsBooting(true);
      const steps = [
        'Initializing shell environment…',
        'Loading projects and skills…',
        'Polishing pixels…',
        'Warming up animations…',
        'All systems go!'
      ];
      const duration = 2200;
      setHistory([{ command: '', output: <BootSequence steps={steps} duration={duration} />, timestamp: new Date() }]);
      const t = window.setTimeout(() => {
        setIsBooting(false);
        sessionStorage.setItem('terminalBooted', '1');
        const welcomeMessage = (
          <div className="space-y-2">
            <div className="text-green-600 dark:text-green-400">{config.terminal.welcome}</div>
            <div className="text-yellow-700 font-medium block dark:hidden">⚠️ Bro at least don't flashbang yourself while coding 🥀</div>
            <div className="text-gray-600 dark:text-gray-400">Type 'help' to see available commands</div>
            <div className="text-gray-600 dark:text-gray-400">Type 'fun' for something special...</div>
          </div>
        );
        setHistory([{ command: '', output: welcomeMessage, timestamp: new Date() }]);
        try {
          window.dispatchEvent(new CustomEvent('terminal:ready'));
        } catch {}
      }, duration);
      return () => clearTimeout(t);
    } else {
      const welcomeMessage = (
        <div className="space-y-2">
          <div className="text-green-600 dark:text-green-400">{config.terminal.welcome}</div>
          <div className="text-yellow-700 font-medium block dark:hidden">⚠️ Bro at least don't flashbang yourself while coding 🥀</div>
          <div className="text-gray-600 dark:text-gray-400">Type 'help' to see available commands</div>
          <div className="text-gray-600 dark:text-gray-400">Type 'fun' for something special...</div>
        </div>
      );
      setHistory([{ command: '', output: welcomeMessage, timestamp: new Date() }]);
    }
    setQuestLoaded(true);
  }, []);

  // No theme sync effect needed; Tailwind dark: classes handle it instantly.

  // Persist quest state to localStorage whenever it changes
  useEffect(() => {
    try {
      const data = {
        questActive,
        questStage,
        questInventory,
        questCodes,
        // Do NOT store questExpected here in plaintext
      };
      if (questLoaded) {
        localStorage.setItem('terminalQuestState', JSON.stringify(data));
        const enc = encExpected(questExpected);
        if (enc) localStorage.setItem('terminalQuestExpectedEnc', enc);
      }
    } catch {}
  }, [questActive, questStage, questInventory, questCodes, questExpected, questLoaded]);

    // --- Quest helpers (derived from portfolio data, deterministic and explicit) ---
    const computeAlpha = () => {
      const mostRecent = projects[0];
      const name = mostRecent?.name ?? '';
      const id = mostRecent?.id ?? '';
      const firstLetter = (name.replace(/[^a-zA-Z]/g, '').charAt(0) || 'X').toUpperCase();
      const lastIdChar = (id.match(/[a-zA-Z0-9]/g)?.pop() || '0').toUpperCase();
      const wordCount = (name.trim().split(/\s+/).filter(Boolean).length || 1)
        .toString()
        .padStart(2, '0');
      return `${firstLetter}${lastIdChar}${wordCount}`;
    };

    const computeSkillCounts = () => {
      const counts: Record<string, number> = {};
      projects.forEach(p => {
        p.techStack.split(',').map(s => s.trim()).forEach(s => {
          if (!s) return;
          counts[s] = (counts[s] || 0) + 1;
        });
      });
      return counts;
    };

    const computeBeta = () => {
      const counts = computeSkillCounts();
      const entries = Object.entries(counts);
      if (entries.length === 0) return 'SKL00';
      entries.sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0]);
      });
      const [topSkill, topCount] = entries[0];
      return `${topSkill.slice(0, 3).toUpperCase()}${String(topCount).padStart(2, '0')}`;
    };

    const computeGamma = () => {
      const demoCount = projects.filter(p => !!p.demoUrl).length;
      const keywordSet = new Set<string>();
      projects.forEach(p => (p.keywords || []).forEach(k => keywordSet.add(k)));
      return `${String(demoCount).padStart(2, '0')}${String(keywordSet.size).padStart(2, '0')}`;
    };

    const startQuest = () => {
      const alpha = computeAlpha();
      const beta = computeBeta();
      const gamma = computeGamma();
      setQuestExpected({ alpha, beta, gamma });
      setQuestActive(true);
      setQuestStage('alpha');
      setQuestInventory([]);
      setQuestCodes({});
    };

    const questHelpNode = () => {
      const mostRecent = projects[0];
      const skillCounts = computeSkillCounts();
      const top3 = Object.entries(skillCounts)
        .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]))
        .slice(0, 3);
      return (
        <div className="space-y-2 text-sm">
          <div className="text-green-400 font-semibold">Quest: The Portfolio Cipher</div>
          <div className="text-gray-300">Collect three fragments: ALPHA, BETA, GAMMA. Each is computed from facts shown to you. No guessing needed.</div>
          <div className="space-y-2 ml-4">
            <div>
              <span className="text-blue-400">ALPHA</span> — Formula: First letter of the most recent project's name + last alphanumeric of its id + two-digit word count of its name. Example: N?W? → N W 03 → NW03.
              <div className="text-xs text-gray-400 mt-1">Most recent detected: <span className="text-gray-200">{mostRecent?.name}</span> (id: <span className="text-gray-200">{mostRecent?.id}</span>)</div>
            </div>
            <div>
              <span className="text-blue-400">BETA</span> — Take the skill used in the most projects. Code = first 3 letters of that skill (uppercased) + two-digit project count for that skill.
              <div className="text-xs text-gray-400 mt-1">Top skills preview: {top3.map(([s, c]) => `${s}(${c})`).join(', ')}</div>
            </div>
            <div>
              <span className="text-blue-400">GAMMA</span> — Two numbers concatenated: [projects with a demo URL (2 digits)] + [unique keyword count across all projects (2 digits)].
            </div>
          </div>
          <div className="text-gray-300">Commands: <span className="text-blue-400">scan</span>, <span className="text-blue-400">inspect skills</span>, <span className="text-blue-400">inspect keywords</span>, <span className="text-blue-400">unlock alpha|beta|gamma &lt;code&gt;</span>, <span className="text-blue-400">inventory</span>, <span className="text-blue-400">quest status</span>, <span className="text-blue-400">synthesize</span>, <span className="text-blue-400">abort quest</span>.</div>
        </div>
      );
    };

    const questIntroNode = () => (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
        <div className="text-green-400 font-semibold">Anomaly detected: Portfolio Cipher online</div>
        <div className="text-gray-300">Welcome, explorer. Decode three fragments hidden in this portfolio's data.</div>
        <div className="text-gray-300">Type <span className="text-blue-400">quest help</span> to see exact formulas and tools. Nothing is random. Everything is derivable.</div>
        <div className="text-xs text-gray-400">Stage: ALPHA → BETA → GAMMA → synthesize</div>
      </motion.div>
    );

  // Blink the block cursor (opaque flash on/off)
  useEffect(() => {
    const id = setInterval(() => setCursorVisible(v => !v), 650);
    return () => clearInterval(id);
  }, []);

  // Position custom block cursor to mimic INS-style flashing block
  const updateCursor = () => {
    const mirror = mirrorRef.current;
    const cursor = cursorRef.current;
    if (!mirror || !cursor) return;
    // Find the marker span inside mirror
    const marker = mirror.querySelector('#caret-marker') as HTMLSpanElement | null;
    if (!marker) return;
    const mirrorRect = mirror.getBoundingClientRect();
    const markerRect = marker.getBoundingClientRect();
    const left = markerRect.left - mirrorRect.left;
    const top = markerRect.top - mirrorRect.top;
    cursor.style.transform = `translate(${left}px, ${top}px)`;
  };

  useEffect(() => {
    updateCursor();
    const onResize = () => updateCursor();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [input, caretIndex]);

  const typeWriter = (text: string, callback?: () => void) => {
    setIsTyping(true);
    let index = 0;
    const timer = window.setInterval(() => {
      setInput(text.slice(0, index));
      index++;
      if (index > text.length) {
        clearInterval(timer);
        typewriterTimerRef.current = null;
        setIsTyping(false);
        setTimeout(() => {
          if (callback) callback();
        }, 500);
      }
    }, 50);
    typewriterTimerRef.current = timer;
  };

  const commands = {
    help: () => (
      <div className="space-y-1 text-sm">
        <div className={`text-green-600 dark:text-green-400 font-semibold`}>Available Commands:</div>
        <div className="ml-4 space-y-1">
          <div><span className="text-blue-600 dark:text-blue-300">about</span> - Learn about {config.firstName}</div>
          <div><span className="text-blue-600 dark:text-blue-300">projects</span> - List all projects</div>
          <div><span className="text-blue-600 dark:text-blue-300">skills</span> - Show technical skills</div>
          <div><span className="text-blue-600 dark:text-blue-300">contact</span> - Get contact information</div>
          <div><span className="text-blue-600 dark:text-blue-300">resume</span> - View resume</div>
          <div><span className="text-blue-600 dark:text-blue-300">fun</span> - Try it and see!</div>
          <div><span className="text-blue-600 dark:text-blue-300">clear</span>/<span className="text-blue-600 dark:text-blue-300">cls</span> - Clear terminal</div>
          <div><span className="text-blue-600 dark:text-blue-300">matrix</span> - Enter the matrix...</div>
          <div><span className="text-blue-600 dark:text-blue-300">joke</span> - Random programming joke</div>
          <div><span className="text-blue-600 dark:text-blue-300">fortune</span> - A random dev quote</div>
          <div><span className="text-blue-600 dark:text-blue-300">ascii</span> - Show a banner</div>
          <div><span className="text-blue-600 dark:text-blue-300">cowsay &lt;text&gt;</span> - Cow has something to say</div>
          <div><span className="text-blue-600 dark:text-blue-300">cd projects</span> - Go to projects</div>
          <div><span className="text-blue-600 dark:text-blue-300">cd blog</span> - Go to blog</div>
          <div><span className="text-blue-600 dark:text-blue-300">cd contact</span> - Go to contact</div>
          <div><span className="text-blue-600 dark:text-blue-300">cd about</span> - Go to about</div>
          <div><span className="text-blue-600 dark:text-blue-300">cd ..</span> - Go home</div>
        </div>
      </div>
    ),

    about: () => (
      <div className="space-y-2">
        <div className={`flex items-center gap-2 text-green-600 dark:text-green-400`}>
          <User className="w-4 h-4" />
          <span className="font-semibold">{config.fullName}</span>
        </div>
        <div className="ml-6 space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>Student Founder</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span>New York, NY</span>
          </div>
          <div className="flex items-center gap-2">
            <Code className="w-3 h-3" />
            <span>Full-Stack Developer & AI Enthusiast</span>
          </div>
          <div className={`mt-2 text-gray-600 dark:text-gray-300`}>
            I see problems, then I build solutions. Currently studying Computer Science 
            at Macaulay Honors College while building innovative tech projects.
          </div>
        </div>
      </div>
    ),

    projects: () => (
      <div className="space-y-3">
        <div className={`text-green-600 dark:text-green-400 font-semibold`}>Recent Projects:</div>
        {projects.slice(0, 5).map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="ml-4 p-2 border-l-2 border-blue-400 pl-3"
          >
            <div className="flex items-center gap-2">
              <span className={`text-blue-600 dark:text-blue-300 font-medium`}>{project.name}</span>
              {project.demoUrl && (
                <Link href={project.demoUrl} target="_blank" className="text-xs">
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
            <div className={`text-xs text-gray-600 dark:text-gray-400`}>{project.tagline}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {project.techStack.split(',').slice(0, 3).map(tech => (
                <Badge key={tech} variant="outline" className="text-xs h-4">
                  {tech.trim()}
                </Badge>
              ))}
            </div>
          </motion.div>
        ))}
        <div className={`text-xs text-gray-600 dark:text-gray-400 ml-4`}>
          Type 'cd projects' to explore more...
        </div>
      </div>
    ),

    skills: () => {
      const allSkills = new Set<string>();
      projects.forEach(project => {
        project.techStack.split(',').forEach(skill => {
          allSkills.add(skill.trim());
        });
      });
      
      const skillArray = Array.from(allSkills);
      
      return (
        <div className="space-y-2">
          <div className={`text-green-600 dark:text-green-400 font-semibold`}>Technical Skills:</div>
          <div className="ml-4 grid grid-cols-2 md:grid-cols-3 gap-2">
            {skillArray.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Badge variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      );
    },

    contact: () => (
      <div className="space-y-2">
        <div className={`text-green-600 dark:text-green-400 font-semibold`}>Contact Information:</div>
        <div className="ml-4 space-y-1 text-sm">
          <div>📧 Email: Available on resume</div>
          <div>🌐 Portfolio: {config.portfolioDomain}</div>
          <div>💼 LinkedIn: /in/{config.linkedinUsername}</div>
          <div>🐙 GitHub: /{config.githubUsername}</div>
          <div className={`text-xs text-gray-600 dark:text-gray-400 mt-2`}>
            Use 'resume' command to view full contact details
          </div>
        </div>
      </div>
    ),

    resume: () => (
      <div className="space-y-2">
        <div className={`text-green-600 dark:text-green-400 font-semibold`}>Resume Access:</div>
        <div className="ml-4">
          <Link 
            href="/resume-09-25.pdf" 
            target="_blank"
            className={`text-blue-600 dark:text-blue-300 hover:underline flex items-center gap-1`}
          >
            📄 View Resume (PDF) <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    ),

    clear: () => {
      setHistory([]);
      return null;
    },

    joke: () => {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
        "Why don't programmers like nature? It has too many bugs! 🌿",
        "What's a programmer's favorite hangout place? Foo Bar! 🍺",
        "Why did the programmer quit his job? He didn't get arrays! 📊",
        "What do you call a programmer from Finland? Nerdic! 🇫🇮"
      ];
      
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-yellow-300"
        >
          {randomJoke}
        </motion.div>
      );
    },

    fun: () => {
      if (!questActive) {
        // Attempt to resume from localStorage before starting a new quest
        const resumed = (() => {
          try {
            const saved = localStorage.getItem('terminalQuestState');
            const enc = localStorage.getItem('terminalQuestExpectedEnc');
            const dec = decExpected(enc);
            if (saved) {
              const s = JSON.parse(saved);
              const hasProgress = (s.questCodes && (s.questCodes.alpha || s.questCodes.beta || s.questCodes.gamma)) || s.questActive;
              if (hasProgress) {
                setQuestActive(true);
                if (s.questStage) setQuestStage(s.questStage);
                if (Array.isArray(s.questInventory)) setQuestInventory(s.questInventory);
                if (s.questCodes) setQuestCodes(s.questCodes);
                if (dec) setQuestExpected(dec);
                return true;
              }
            }
          } catch {}
          return false;
        })();
        if (resumed) {
          return (
            <div className="space-y-2">
              <div className="text-green-400">Resumed your quest progress.</div>
              {questHelpNode()}
            </div>
          );
        }
        startQuest();
        return (
          <div className="space-y-3">
            {questIntroNode()}
            {questHelpNode()}
          </div>
        );
      }
      return (
        <div className="space-y-2">
          <div className="text-green-400">Quest already running.</div>
          <div className="text-gray-300">Type <span className="text-blue-400">quest status</span> or <span className="text-blue-400">quest help</span>.</div>
        </div>
      );
    },

    matrix: () => {
      // This will trigger a matrix effect
      return (
        <div className="space-y-1">
          <div className="text-green-400">Entering the Matrix...</div>
          <div className="text-green-300 font-mono text-xs">
            {Array.from({ length: 10 }, (_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ 
                  duration: 2, 
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                {Math.random().toString(36).substring(2, 15)}
              </motion.div>
            ))}
          </div>
          <div className="text-red-400 text-sm mt-2">
            Wake up, Neo... The portfolio has you. 💊
          </div>
        </div>
      );
    }
  };

  const broadcast = (type: string, payload: any) => {
    if (applyingRemoteRef.current) return;
    const ch = channelRef.current;
    if (!ch) return;
    ch.postMessage({ type, payload, instanceId: instanceIdRef.current });
  };

  // Helper to run only the cd command and return success (for && support)
  const runCdOnly = (cmd: string): boolean => {
    const trimmedCmd = cmd.trim();
    const arg = trimmedCmd.slice(2).trim();
    const targetRaw = arg.toLowerCase();
    let targetPath = '';
    if (!targetRaw || targetRaw === '~' || targetRaw === '/' || targetRaw === '..' || targetRaw === 'home') {
      targetPath = '/';
    } else if (targetRaw.startsWith('/')) {
      targetPath = targetRaw;
    } else {
      targetPath = `/${targetRaw}`;
    }
    const allowed = allowedPaths.current ?? new Set<string>();
    if (!allowed.has(targetPath)) {
      const node = (
        <div className="text-red-400">Page not found: {targetPath}</div>
      );
      setHistory(prev => [...prev, { command: trimmedCmd, output: node, timestamp: new Date() }]);
      setInput('');
      return false;
    }
    // Close palette proactively
    try {
      window.dispatchEvent(new CustomEvent('command-palette:close'));
      const ev = new CustomEvent('command-palette:closeOnNavigate', { detail: { source: 'terminal', path: targetPath } });
      window.dispatchEvent(ev);
    } catch {}
    router.push(targetPath);
    try {
      window.dispatchEvent(new CustomEvent('command-palette:close'));
      const ev2 = new CustomEvent('command-palette:closeOnNavigate', { detail: { source: 'terminal', path: targetPath } });
      window.dispatchEvent(ev2);
    } catch {}
    const node = (
      <div className="text-gray-400">Navigating to {targetPath} ...</div>
    );
    setHistory(prev => [...prev, { command: trimmedCmd, output: node, timestamp: new Date() }]);
    setInput('');
    return true;
  };

  // Batch executor with ';' and '&&' support
  const executeBatch = (line: string) => {
    const andParts = line.split('&&');
    for (let i = 0; i < andParts.length; i++) {
      const part = andParts[i];
      const semiParts = part.split(';');
      let segmentSuccess = true;
      for (const sp of semiParts) {
        const c = sp.trim();
        if (!c) continue;
        // Restrict unsafe commands if needed
        const lower = c.toLowerCase();
        if (lower === 'matrix' || lower === 'fun') {
          setHistory(prev => [...prev, { command: c, output: <div className="text-yellow-300">Command not allowed in chained mode: {lower}</div>, timestamp: new Date() }]);
          continue;
        }
        if (lower === 'clear' || lower === 'cls') {
          setHistory([]);
          continue;
        }
        if (lower === 'cd' || lower.startsWith('cd ')) {
          // Disallow cd in chained mode
          setHistory(prev => [...prev, { command: c, output: <div className="text-yellow-300">cd cannot be chained. Run it separately.</div>, timestamp: new Date() }]);
          segmentSuccess = false; // stop subsequent && groups
          continue;
        }
        // Fallback to single execute
        executeCommand(c);
      }
      if (i < andParts.length - 1 && !segmentSuccess) {
        // short-circuit remaining && parts
        break;
      }
    }
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (!trimmedCmd) return;

    // Add to command history
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    // broadcast the execution to peer instances
    broadcast('state:exec', { command: cmd });

    // Special case for clear
    if (trimmedCmd === 'clear' || trimmedCmd === 'cls') {
      setHistory([]);
      setInput('');
      broadcast('state:clear', {});
      return;
    }

    // Quest command handling (takes precedence except for clear/cls above)
    const questEcho = (node: React.ReactNode) => {
      setHistory(prev => [...prev, { command: cmd, output: node, timestamp: new Date() }]);
      setInput('');
    };

    const showStatus = () => {
      const pieces = [
        questCodes.alpha ? 'ALPHA✓' : 'ALPHA…',
        questCodes.beta ? 'BETA✓' : 'BETA…',
        questCodes.gamma ? 'GAMMA✓' : 'GAMMA…',
      ].join('  ');
      return (
        <div className="text-sm">
          <div className="text-green-400">Quest Status</div>
          <div className="text-gray-300">Stage: {questStage.toUpperCase()}</div>
          <div className="text-gray-400">Inventory: {pieces}</div>
        </div>
      );
    };

    // Start quest implicitly if user types quest commands before 'fun'
    const questCmds = ['quest help', 'quest status', 'scan', 'inspect skills', 'inspect keywords', 'inventory', 'synthesize'];
    if (!questActive && (questCmds.includes(trimmedCmd) || trimmedCmd.startsWith('unlock ') || trimmedCmd.startsWith('abort quest'))) {
      // Try resuming first
      let resumed = false;
      try {
        const saved = localStorage.getItem('terminalQuestState');
        const enc = localStorage.getItem('terminalQuestExpectedEnc');
        const dec = decExpected(enc);
        if (saved) {
          const s = JSON.parse(saved);
          const hasProgress = (s.questCodes && (s.questCodes.alpha || s.questCodes.beta || s.questCodes.gamma)) || s.questActive;
          if (hasProgress) {
            setQuestActive(true);
            if (s.questStage) setQuestStage(s.questStage);
            if (Array.isArray(s.questInventory)) setQuestInventory(s.questInventory);
            if (s.questCodes) setQuestCodes(s.questCodes);
            if (dec) setQuestExpected(dec);
            resumed = true;
          }
        }
      } catch {}
      if (!resumed) startQuest();
      questEcho(
        <div className="space-y-2">
          {questIntroNode()}
          <div className="text-gray-300">You jumped right in — quest initialized.</div>
        </div>
      );
      return;
    }

    if (questActive) {
      // quest help
      if (trimmedCmd === 'quest help') {
        questEcho(questHelpNode());
        return;
      }
      if (trimmedCmd === 'quest status' || trimmedCmd === 'inventory') {
        questEcho(showStatus());
        return;
      }
      if (trimmedCmd === 'abort quest') {
        setQuestActive(false);
        setQuestCodes({});
        setQuestInventory([]);
        setQuestStage('alpha');
        setQuestExpected(null);
        questEcho(<div className="text-red-400">Quest aborted. Type 'fun' to start again.</div>);
        return;
      }
      if (trimmedCmd === 'scan') {
        const mostRecent = projects[0];
        questEcho(
          <div className="space-y-2 text-sm">
            <div className="text-green-400">Scan complete</div>
            <div className="text-gray-300">Most recent project: <span className="text-gray-100">{mostRecent?.name}</span> (id: <span className="text-gray-100">{mostRecent?.id}</span>)</div>
            <div className="text-gray-400">Words in name: {(mostRecent?.name || '').trim().split(/\s+/).filter(Boolean).length}</div>
            <div className="text-xs text-gray-500">Use formula in quest help to compute ALPHA, then <span className="text-blue-400">unlock alpha &lt;code&gt;</span>.</div>
          </div>
        );
        return;
      }
      if (trimmedCmd === 'inspect skills') {
        const counts = computeSkillCounts();
        const top = Object.entries(counts).sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0])).slice(0, 10);
        questEcho(
          <div className="space-y-2 text-sm">
            <div className="text-green-400">Skills overview (top 10)</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
              {top.map(([s, c]) => (
                <Badge key={s} variant="secondary" className="justify-between">
                  <span>{s}</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-300">{c}</span>
                </Badge>
              ))}
            </div>
            <div className="text-xs text-gray-500">Find the most frequent skill to build BETA.</div>
          </div>
        );
        return;
      }
      if (trimmedCmd === 'inspect keywords') {
        const keywordSet = new Set<string>();
        projects.forEach(p => (p.keywords || []).forEach(k => keywordSet.add(k)));
        const demoCount = projects.filter(p => !!p.demoUrl).length;
        questEcho(
          <div className="space-y-1 text-sm">
            <div className="text-green-400">Keywords overview</div>
            <div className="text-gray-300">Projects with demo URL: <span className="text-gray-100">{demoCount}</span></div>
            <div className="text-gray-300">Unique keywords across all projects: <span className="text-gray-100">{keywordSet.size}</span></div>
            <div className="text-xs text-gray-500">GAMMA = [demo count 2 digits][unique keyword count 2 digits]</div>
          </div>
        );
        return;
      }
      if (trimmedCmd.startsWith('unlock ')) {
        const parts = cmd.trim().split(/\s+/);
        // expecting: unlock alpha CODE
        if (parts.length < 3) {
          questEcho(<div className="text-red-400">Usage: unlock alpha|beta|gamma &lt;code&gt;</div>);
          return;
        }
        const frag = parts[1].toLowerCase() as 'alpha' | 'beta' | 'gamma';
        const code = parts.slice(2).join('');
        if (!['alpha', 'beta', 'gamma'].includes(frag)) {
          questEcho(<div className="text-red-400">Unknown fragment. Use alpha, beta, or gamma.</div>);
          return;
        }
        const expected = questExpected?.[frag];
        if (!expected) {
          questEcho(<div className="text-red-400">Quest not initialized properly. Type 'fun' to restart.</div>);
          return;
        }
        if (code.toUpperCase() === expected.toUpperCase()) {
          if ((frag === 'alpha' && questCodes.alpha) || (frag === 'beta' && questCodes.beta) || (frag === 'gamma' && questCodes.gamma)) {
            questEcho(<div className="text-yellow-300">{frag.toUpperCase()} already unlocked.</div>);
            return;
          }
          setQuestCodes(prev => ({ ...prev, [frag]: expected }));
          setQuestInventory(prev => [...prev, frag.toUpperCase()]);
          // advance stage if matching current
          setQuestStage(prev => {
            if (prev === 'alpha' && frag === 'alpha') return 'beta';
            if (prev === 'beta' && frag === 'beta') return 'gamma';
            if (prev === 'gamma' && frag === 'gamma') return 'complete';
            // otherwise keep current (allows out-of-order unlocks but stage moves once aligned)
            if (!['alpha', 'beta', 'gamma'].includes(prev)) return prev;
            // if out-of-order leads to completion
            const now = { ...questCodes, [frag]: expected };
            if (now.alpha && now.beta && now.gamma) return 'complete';
            return prev;
          });
          questEcho(
            <div className="space-y-1 text-sm">
              <div className="text-green-400">{frag.toUpperCase()} unlocked ✓</div>
              <div className="text-gray-400">Code accepted.</div>
              <div className="text-xs text-gray-500">{frag === 'gamma' ? 'Type synthesize to finalize.' : 'Proceed to the next fragment.'}</div>
            </div>
          );
          return;
        }
        questEcho(
          <div className="text-red-400">Incorrect code for {frag.toUpperCase()}. Re-check the formula in 'quest help'.</div>
        );
        return;
      }
      if (trimmedCmd === 'synthesize') {
        if (questStage !== 'complete' || !questCodes.alpha || !questCodes.beta || !questCodes.gamma) {
          questEcho(<div className="text-yellow-300">You need ALPHA, BETA, and GAMMA unlocked before synthesizing.</div>);
          return;
        }
        // Celebration + unlock a secret warp command
        setQuestActive(false);
        questEcho(
          <div className="space-y-2">
            <pre className="text-cyan-300 whitespace-pre leading-tight">{String.raw`
  ____                        _             _           
 |  _ \ ___  ___ ___  _ __  | |_ _   _  __| | ___ _ __ 
 | |_) / _ \/ __/ _ \| '_ \ | __| | | |/ _\` |/ _ \ '__|
 |  _ <  __/ (_| (_) | | | || |_| |_| | (_| |  __/ |   
 |_| \_\___|\___\___/|_| |_| \__|\__,_|\__,_|\___|_|   
`}</pre>
            <div className="text-green-400 font-semibold">Portfolio Cipher complete. You are now a Terminal Explorer.</div>
            <div className="text-gray-300">Unlocked command: <span className="text-blue-400">warp</span></div>
            <div className="text-xs text-gray-400">Try: warp random — or warp projects to browse a random project instantly.</div>
          </div>
        );
        return;
      }
    }

    // Post-quest secret: warp navigation
    if (trimmedCmd.startsWith('warp ')) {
      const arg = cmd.slice(5).trim().toLowerCase();
      if (!questCodes.alpha || !questCodes.beta || !questCodes.gamma) {
        questEcho(<div className="text-red-400">Warp is locked. Finish the quest and synthesize first.</div>);
        return;
      }
      if (arg === 'random' || arg === 'projects') {
        const pick = projects[Math.floor(Math.random() * projects.length)];
        const targetPath = `/projects/${pick.id}`.toLowerCase();
        // Proactively request palette close before navigating
        try {
          window.dispatchEvent(new CustomEvent('command-palette:close'));
          const ev = new CustomEvent('command-palette:closeOnNavigate', { detail: { source: 'terminal', path: targetPath } });
          window.dispatchEvent(ev);
        } catch {}
        router.push(targetPath);
        // Also dispatch after navigation kicks off (belt and suspenders)
        try {
          window.dispatchEvent(new CustomEvent('command-palette:close'));
          const ev2 = new CustomEvent('command-palette:closeOnNavigate', { detail: { source: 'terminal', path: targetPath } });
          window.dispatchEvent(ev2);
        } catch {}
        questEcho(<div className="text-gray-300">Warping to <span className="text-blue-400">{pick.name}</span>…</div>);
        return;
      }
      // support warping to known top-level routes
      const allowedWarp = new Set(['/', '/about', '/projects', '/blog', '/contact']);
      const target = arg.startsWith('/') ? arg : `/${arg}`;
      if (allowedWarp.has(target)) {
        try {
          window.dispatchEvent(new CustomEvent('command-palette:close'));
          const ev = new CustomEvent('command-palette:closeOnNavigate', { detail: { source: 'terminal', path: target } });
          window.dispatchEvent(ev);
        } catch {}
        router.push(target);
        try {
          window.dispatchEvent(new CustomEvent('command-palette:close'));
          const ev2 = new CustomEvent('command-palette:closeOnNavigate', { detail: { source: 'terminal', path: target } });
          window.dispatchEvent(ev2);
        } catch {}
        questEcho(<div className="text-gray-300">Warping to <span className="text-blue-400">{target}</span>…</div>);
        return;
      }
      questEcho(<div className="text-red-400">Unknown warp target. Try 'warp random' or a top route like /about.</div>);
      return;
    }

    // Chained commands support
    if (cmd.includes('&&') || cmd.includes(';')) {
      executeBatch(cmd);
      return;
    }

    // cd navigation (validated)
    if (trimmedCmd === 'cd' || trimmedCmd.startsWith('cd ')) {
      const arg = cmd.slice(2).trim();
      const targetRaw = arg.toLowerCase();
      let targetPath = '';
      if (!targetRaw || targetRaw === '~' || targetRaw === '/' || targetRaw === '..' || targetRaw === 'home') {
        targetPath = '/';
      } else if (targetRaw.startsWith('/')) {
        targetPath = targetRaw;
      } else {
        // Normalize to top-level path
        targetPath = `/${targetRaw}`;
      }
      const allowed = allowedPaths.current ?? new Set<string>();
      if (!allowed.has(targetPath)) {
        const node = (
          <div className="text-red-400">
            Page not found: {targetPath}
          </div>
        );
        setHistory(prev => [...prev, { command: cmd, output: node, timestamp: new Date() }]);
        setInput('');
        return;
      }
      // Proactively request palette close before and after navigation
      try {
        window.dispatchEvent(new CustomEvent('command-palette:close'));
        const ev = new CustomEvent('command-palette:closeOnNavigate', { detail: { source: 'terminal', path: targetPath } });
        window.dispatchEvent(ev);
      } catch {}
      router.push(targetPath);
      try {
        window.dispatchEvent(new CustomEvent('command-palette:close'));
        const ev2 = new CustomEvent('command-palette:closeOnNavigate', { detail: { source: 'terminal', path: targetPath } });
        window.dispatchEvent(ev2);
      } catch {}
      const node = (
        <div className="text-gray-400">
          Navigating to {targetPath} ...
        </div>
      );
      setHistory(prev => [...prev, { command: cmd, output: node, timestamp: new Date() }]);
      setInput('');
      return;
    }

    // Dynamic commands with args
    if (trimmedCmd.startsWith('cowsay ')) {
      const text = cmd.slice(7).trim() || 'Moo!';
      const bubble = ` ${'_'.repeat(Math.min(text.length, 40))}\n< ${text} >\n ${'-'.repeat(Math.min(text.length, 40))}`;
      const cow = String.raw`
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
      `;
      const node = (
        <pre className="text-green-300 whitespace-pre leading-snug">
{bubble + '\n' + cow}
        </pre>
      );
      const newCommand: Command = { command: cmd, output: node, timestamp: new Date() };
      setHistory(prev => [...prev, newCommand]);
      setInput('');
      return;
    }

    if (trimmedCmd === 'fortune') {
      const quotes = [
        'Talk is cheap. Show me the code. — Linus Torvalds',
        'Programs must be written for people to read, and only incidentally for machines to execute. — Harold Abelson',
        'Simplicity is the soul of efficiency. — Austin Freeman',
        'First, solve the problem. Then, write the code. — John Johnson',
        'Deleted code is debugged code. — Jeff Sickel',
        'Premature optimization is the root of all evil. — Donald Knuth',
        'Make it work, make it right, make it fast. — Kent Beck',
        'The best error message is the one that never shows up. — Thomas Fuchs',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand. — Martin Fowler',
        'Weeks of coding can save you hours of planning. — Unknown'
      ];
      const q = quotes[Math.floor(Math.random() * quotes.length)];
      const node = <div className="text-purple-300">{q}</div>;
      setHistory(prev => [...prev, { command: cmd, output: node, timestamp: new Date() }]);
      setInput('');
      return;
    }

    if (trimmedCmd === 'ascii') {
      const banner = String.raw`
 █████╗  █████╗ ██████╗ ██╗   ██╗███████╗██╗  ██╗
██╔══██╗██╔══██╗██╔══██╗██║   ██║██╔════╝██║  ██║
███████║███████║██████╔╝██║   ██║███████╗███████║
██╔══██║██╔══██║██╔══██╗██║   ██║╚════██║██╔══██║
██║  ██║██║  ██║██║  ██║╚██████╔╝███████║██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
      `;
      const node = <pre className="text-cyan-300 whitespace-pre leading-tight">{banner}</pre>;
      setHistory(prev => [...prev, { command: cmd, output: node, timestamp: new Date() }]);
      setInput('');
      return;
    }

    const output = commands[trimmedCmd as keyof typeof commands]?.() || (
      <div className="text-red-400">
        Command not found: {cmd}. Type 'help' for available commands.
      </div>
    );

    const newCommand: Command = {
      command: cmd,
      output,
      timestamp: new Date()
    };

    setHistory(prev => [...prev, newCommand]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
      // Cancel any ongoing typewriter
      if (typewriterTimerRef.current) {
        clearInterval(typewriterTimerRef.current);
        typewriterTimerRef.current = null;
      }
      setIsTyping(false);
      // Echo ^C and reset line
      setHistory(prev => [
        ...prev,
        { command: '', output: <span className="text-red-400">^C</span>, timestamp: new Date() }
      ]);
      setInput('');
      setCaretIndex(0);
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isBooting) return; // ignore input during boot
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      // Enhanced autocomplete with cycling and common prefix
      const getCompletions = (raw: string): string[] => {
        const trimmed = raw.toLowerCase();
        const words = trimmed.split(/\s+/);
        const first = words[0] || '';
        const rest = words.slice(1).join(' ');
        const base = Object.keys(commands);
        // Argument suggestions for known verbs
        if (first === 'cd') {
          const opts = ['/', 'about', 'projects', 'blog', 'contact'];
          return opts.filter(o => (rest ? (`${o}`.startsWith(rest)) : true)).map(o => `cd ${o}`);
        }
        if (first === 'unlock') {
          const opts = ['alpha', 'beta', 'gamma'];
          const next = rest.split(/\s+/)[0] || '';
          return opts.filter(o => o.startsWith(next)).map(o => `unlock ${o} `);
        }
        if (first === 'inspect') {
          const opts = ['skills', 'keywords'];
          return opts.filter(o => o.startsWith(rest)).map(o => `inspect ${o}`);
        }
        if (first === 'quest') {
          const opts = ['help', 'status'];
          return opts.filter(o => o.startsWith(rest)).map(o => `quest ${o}`);
        }
        if (first === 'warp') {
          const opts = ['random', '/about', '/projects', '/blog', '/contact'];
          return opts.filter(o => (rest ? o.toLowerCase().startsWith(rest) : true)).map(o => `warp ${o}`);
        }
        // Default to command names
        return base.filter(c => c.startsWith(trimmed));
      };
      const matches = getCompletions(input);
      const commonPrefix = (arr: string[]) => {
        if (arr.length === 0) return '';
        let prefix = arr[0];
        for (let i = 1; i < arr.length; i++) {
          while (!arr[i].startsWith(prefix)) {
            prefix = prefix.slice(0, -1);
            if (!prefix) return '';
          }
        }
        return prefix;
      };
      if (matches.length === 0) return;
      const cp = commonPrefix(matches);
      if (cp && cp !== input) {
        setInput(cp);
        setCaretIndex(cp.length);
        setAutoMatches(matches);
        setAutoIndex(-1);
      } else {
        // cycle
        const nextIndex = (autoIndex + 1) % matches.length;
        const next = matches[nextIndex];
        setInput(next);
        setCaretIndex(next.length);
        setAutoMatches(matches);
        setAutoIndex(nextIndex);
      }
    }
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    setCaretIndex(ta.selectionStart || 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    setCaretIndex(e.target.selectionStart || val.length);
    // broadcast input changes to keep instances in sync
    broadcast('state:input', { input: val, caretIndex: e.target.selectionStart || val.length });
  };

  const scrollToCommandIndex = (idx: number) => {
    const el = entryRefs.current[idx];
    if (el && terminalRef.current) {
      const container = terminalRef.current;
      const header = container.previousElementSibling as HTMLElement;
      const headerHeight = header?.offsetHeight || 0;
      const gap = 1;
      const offsetTop = el.offsetTop;
      container.scrollTo({
        top: offsetTop - headerHeight - gap,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollPrev = () => {
    if (history.length === 0) return;
    const idx = history.length - 1;
    scrollCmdIndexRef.current = idx;
    scrollToCommandIndex(idx);
  };

  const handleScrollNext = () => {
    if (history.length === 0) return;
    let idx = scrollCmdIndexRef.current ?? 0;
    idx = Math.min(history.length - 1, idx + 1);
    scrollCmdIndexRef.current = idx;
    scrollToCommandIndex(idx);
  };

  const handleRunRecent = () => {
    const last = commandHistory[commandHistory.length - 1];
    if (last) executeCommand(last);
  };

  return (
    <Card ref={containerRef} className={`bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-green-400 font-mono text-sm ${className}`}>
      <div className={`flex items-center justify-between p-3 border-b border-gray-300 dark:border-gray-700`}>
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span>{config.terminalPrompt}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button aria-label="Terminal menu" className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800`}>
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 z-[1001]" sideOffset={5}>
              <DropdownMenuItem onClick={() => { setHistory([]); broadcast('state:clear', {}); }} className="cursor-pointer hover:bg-accent focus:bg-accent data-[highlighted]:bg-accent">
                <Trash2 className="w-4 h-4 mr-2" /> Clear Terminal
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleScrollPrev} className="cursor-pointer hover:bg-accent focus:bg-accent data-[highlighted]:bg-accent">
                <ChevronUpIcon className="w-4 h-4 mr-2" /> Scroll to Last Command
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleScrollNext} className="cursor-pointer hover:bg-accent focus:bg-accent data-[highlighted]:bg-accent">
                <ChevronDownIcon className="w-4 h-4 mr-2" /> Scroll to Next Command
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleRunRecent} className="cursor-pointer hover:bg-accent focus:bg-accent data-[highlighted]:bg-accent">
                <PlayCircle className="w-4 h-4 mr-2" /> Run Recent Command
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className={`${heightClass ?? 'h-96'} overflow-y-auto p-4 space-y-2`}
      >
        <AnimatePresence>
          {history.map((entry, index) => (
            <motion.div
              key={index}
              ref={(el) => { if (el) entryRefs.current[index] = el; }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1"
            >
              {entry.command && (
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-blue-600 dark:text-blue-300">{entry.command}</span>
                </div>
              )}
              <div className={`ml-5 text-gray-700 dark:text-gray-100`}>{entry.output}</div>
            </motion.div>
          ))}
        </AnimatePresence>
        {!isBooting && (
          <div className="flex items-start gap-2 relative">
            <ChevronRight className="w-3 h-3 mt-1" />
            <div className="relative flex-1">
              {/* Hidden mirror to measure caret position */}
              <div
                ref={mirrorRef}
                aria-hidden
                className="absolute top-0 left-0 whitespace-pre-wrap break-words pointer-events-none invisible select-none"
                style={{
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  lineHeight: '1.25rem',
                  padding: 0,
                  width: '100%'
                }}
              >
                {input.slice(0, caretIndex)}
                <span id="caret-marker">​</span>
                {input.slice(caretIndex)}
              </div>
              {/* Textarea input */}
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleChange}
                onSelect={handleSelect}
                onKeyDown={handleKeyDown}
                rows={1}
                className={`w-full bg-transparent outline-none text-blue-600 dark:text-blue-300 resize-none overflow-hidden caret-transparent`}
                placeholder={isTyping ? "" : "Type a command... (Shift+Enter for newline)"}
                disabled={isTyping}
                spellCheck={false}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = 'auto';
                  el.style.height = el.scrollHeight + 'px';
                }}
              />
              {/* Blinking block cursor */}
              {!isTyping && (
                <div
                  ref={cursorRef}
                  className={`absolute w-2 h-5 bg-gray-800 dark:bg-green-400`}
                  style={{ top: 0, left: 0, opacity: cursorVisible ? 1 : 0 }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// Boot sequence inline component
function BootSequence({ steps, duration }: { steps: string[]; duration: number }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const interval = duration / steps.length;
    const timers: number[] = [];
    steps.forEach((_, i) => {
      timers.push(window.setTimeout(() => setIdx(i), Math.min(duration - 200, i * interval)));
    });
    return () => timers.forEach(clearTimeout);
  }, [steps, duration]);

  return (
    <div className="space-y-2">
      <div className="text-green-400 dark:text-green-400 text-green-600">Setting up terminal for you…</div>
      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
        {steps.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: i <= idx ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <span className={`inline-block w-2 h-2 rounded-full ${i < idx ? 'bg-green-500' : i === idx ? 'bg-yellow-400 animate-pulse' : 'bg-gray-600'}`} />
            <span>{s}</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="h-1 bg-gray-700 rounded overflow-hidden"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration, ease: 'linear' }}
      />
    </div>
  );
}