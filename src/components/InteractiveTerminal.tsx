"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Terminal, ChevronRight, User, Calendar, MapPin, Code, ExternalLink } from 'lucide-react';
import { getProjects } from '@/lib/projects';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Command {
  command: string;
  output: React.ReactNode;
  timestamp: Date;
}

interface TerminalProps {
  className?: string;
}

export function InteractiveTerminal({ className = '' }: TerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const typewriterTimerRef = useRef<number | null>(null);
  const [caretIndex, setCaretIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const router = useRouter();

  const projects = getProjects();

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

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = (
      <div className="space-y-2">
        <div className="text-green-400">Welcome to Aarush's Portfolio Terminal v2.0</div>
        <div className="text-gray-400">Type 'help' to see available commands</div>
        <div className="text-gray-400">Type 'fun' for something special...</div>
      </div>
    );
    
    setHistory([{
      command: '',
      output: welcomeMessage,
      timestamp: new Date()
    }]);
  }, []);

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
        <div className="text-green-400 font-semibold">Available Commands:</div>
        <div className="ml-4 space-y-1">
          <div><span className="text-blue-400">about</span> - Learn about Aarush</div>
          <div><span className="text-blue-400">projects</span> - List all projects</div>
          <div><span className="text-blue-400">skills</span> - Show technical skills</div>
          <div><span className="text-blue-400">contact</span> - Get contact information</div>
          <div><span className="text-blue-400">resume</span> - View resume</div>
          <div><span className="text-blue-400">fun</span> - Try it and see!</div>
          <div><span className="text-blue-400">clear</span>/<span className="text-blue-400">cls</span> - Clear terminal</div>
          <div><span className="text-blue-400">matrix</span> - Enter the matrix...</div>
          <div><span className="text-blue-400">joke</span> - Random programming joke</div>
          <div><span className="text-blue-400">fortune</span> - A random dev quote</div>
          <div><span className="text-blue-400">ascii</span> - Show a banner</div>
          <div><span className="text-blue-400">cowsay &lt;text&gt;</span> - Cow has something to say</div>
          <div><span className="text-blue-400">cd projects</span> - Go to projects</div>
          <div><span className="text-blue-400">cd blog</span> - Go to blog</div>
          <div><span className="text-blue-400">cd contact</span> - Go to contact</div>
          <div><span className="text-blue-400">cd about</span> - Go to about</div>
          <div><span className="text-blue-400">cd ..</span> - Go home</div>
        </div>
      </div>
    ),

    about: () => (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-green-400">
          <User className="w-4 h-4" />
          <span className="font-semibold">Aarush Kumar</span>
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
          <div className="mt-2 text-gray-300">
            I see problems, then I build solutions. Currently studying Computer Science 
            at Macaulay Honors College while building innovative tech projects.
          </div>
        </div>
      </div>
    ),

    projects: () => (
      <div className="space-y-3">
        <div className="text-green-400 font-semibold">Recent Projects:</div>
        {projects.slice(0, 5).map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="ml-4 p-2 border-l-2 border-blue-400 pl-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-medium">{project.name}</span>
              {project.demoUrl && (
                <Link href={project.demoUrl} target="_blank" className="text-xs">
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
            <div className="text-xs text-gray-400">{project.tagline}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {project.techStack.split(',').slice(0, 3).map(tech => (
                <Badge key={tech} variant="outline" className="text-xs h-4">
                  {tech.trim()}
                </Badge>
              ))}
            </div>
          </motion.div>
        ))}
        <div className="text-xs text-gray-400 ml-4">
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
          <div className="text-green-400 font-semibold">Technical Skills:</div>
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
        <div className="text-green-400 font-semibold">Contact Information:</div>
        <div className="ml-4 space-y-1 text-sm">
          <div>📧 Email: Available on resume</div>
          <div>🌐 Portfolio: aarushkmalhotra.github.io</div>
          <div>💼 LinkedIn: /in/kumaraarush</div>
          <div>🐙 GitHub: /aarushkmalhotra</div>
          <div className="text-xs text-gray-400 mt-2">
            Use 'resume' command to view full contact details
          </div>
        </div>
      </div>
    ),

    resume: () => (
      <div className="space-y-2">
        <div className="text-green-400 font-semibold">Resume Access:</div>
        <div className="ml-4">
          <Link 
            href="/resume-09-25.pdf" 
            target="_blank"
            className="text-blue-400 hover:underline flex items-center gap-1"
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

    fun: () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-2"
      >
        <div className="text-rainbow">
          🎉 You found the easter egg! 🎉
        </div>
        <div className="text-sm text-gray-300">
          Thanks for exploring my portfolio in terminal style!
        </div>
        <div className="text-xs text-gray-400">
          Pro tip: Try typing 'matrix' for another surprise...
        </div>
      </motion.div>
    ),

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

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (!trimmedCmd) return;

    // Add to command history
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    // Special case for clear
    if (trimmedCmd === 'clear' || trimmedCmd === 'cls') {
      setHistory([]);
      setInput('');
      return;
    }

    // cd navigation (generic)
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
      // Known top-level pages for a nicer message
      const known = new Set(['/', '/about', '/projects', '/blog', '/contact']);
      router.push(targetPath);
      const node = (
        <div className="text-gray-400">
          Navigating to {known.has(targetPath) ? targetPath : targetPath} ...
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
        'Programs must be written for people to read. — Harold Abelson',
        'Simplicity is the soul of efficiency. — Austin Freeman',
        'First, solve the problem. Then, write the code. — John Johnson',
        'Deleted code is debugged code. — Jeff Sickel'
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
      // Simple auto-complete
      const availableCommands = Object.keys(commands);
      const matches = availableCommands.filter(cmd => cmd.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      }
    }
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    setCaretIndex(ta.selectionStart || 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setCaretIndex(e.target.selectionStart || e.target.value.length);
  };

  return (
    <Card ref={containerRef} className={`bg-gray-900 text-green-400 font-mono text-sm ${className}`}>
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span>aarush@portfolio:~$</span>
        </div>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="h-96 overflow-y-auto p-4 space-y-2"
      >
        <AnimatePresence>
          {history.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1"
            >
              {entry.command && (
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-blue-300">{entry.command}</span>
                </div>
              )}
              <div className="ml-5 text-gray-100">{entry.output}</div>
            </motion.div>
          ))}
        </AnimatePresence>
        
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
              className="w-full bg-transparent outline-none text-blue-300 resize-none overflow-hidden caret-transparent"
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
                className="absolute w-2 h-5 bg-green-400"
                style={{ top: 0, left: 0, opacity: cursorVisible ? 1 : 0 }}
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}