"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Terminal, ChevronRight, User, Calendar, MapPin, Code, ExternalLink } from 'lucide-react';
import { getProjects } from '@/lib/projects';
import Link from 'next/link';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const projects = getProjects();

  // Auto-focus input
  useEffect(() => {
    const handleClick = () => {
      inputRef.current?.focus();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
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

  const typeWriter = (text: string, callback?: () => void) => {
    setIsTyping(true);
    let index = 0;
    const timer = setInterval(() => {
      setInput(text.slice(0, index));
      index++;
      if (index > text.length) {
        clearInterval(timer);
        setIsTyping(false);
        setTimeout(() => {
          if (callback) callback();
        }, 500);
      }
    }, 50);
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
          <div><span className="text-blue-400">clear</span> - Clear terminal</div>
          <div><span className="text-blue-400">matrix</span> - Enter the matrix...</div>
          <div><span className="text-blue-400">joke</span> - Random programming joke</div>
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
    if (trimmedCmd === 'clear') {
      setHistory([]);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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

  return (
    <Card className={`bg-gray-900 text-green-400 font-mono text-sm ${className}`}>
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
        
        <div className="flex items-center gap-2">
          <ChevronRight className="w-3 h-3" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-blue-300"
            placeholder={isTyping ? "" : "Type a command..."}
            disabled={isTyping}
            spellCheck={false}
          />
          {isTyping && (
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-2 h-4 bg-green-400"
            />
          )}
        </div>
      </div>
    </Card>
  );
}