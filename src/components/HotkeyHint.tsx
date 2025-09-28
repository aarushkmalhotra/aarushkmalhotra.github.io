"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  className?: string;
};

// Small bottom-right hint for desktop users on first visit.
export function HotkeyHint({ className = "" }: Props) {
  const [visible, setVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [modKey, setModKey] = useState<'⌘' | 'Ctrl'>('Ctrl');

  useEffect(() => {
    // Detect desktop via pointer precision + viewport width
    const mq = window.matchMedia("(pointer:fine)");
    setIsDesktop(mq.matches && window.innerWidth >= 1024);

    const hasSeen = localStorage.getItem("hasSeenHotkeyHint");
    setModKey(navigator.platform.toUpperCase().includes('MAC') ? '⌘' : 'Ctrl');
    if (!hasSeen) {
      // Show after a small delay for a friendly entrance
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  // Dismiss on Mod+K if visible, without preventing the palette from opening
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      const isModK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
      if (isModK) {
        dismiss();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible]);

  const dismiss = () => {
    localStorage.setItem("hasSeenHotkeyHint", "true");
    setVisible(false);
  };

  if (!isDesktop) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 24, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 16, y: 16, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24, mass: 0.7 }}
          className={`fixed bottom-4 right-4 z-50`}
        >
          <div className={`group relative px-3 py-2 rounded-lg border bg-background/90 backdrop-blur shadow-lg text-sm text-muted-foreground ${className}`}>
            <div className="flex items-center gap-2">
              <span className="hidden md:inline">Press</span>
              <kbd className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted text-foreground text-xs border">
                {/* mac symbol on mac, else Ctrl */}
                <span className="hidden md:inline" suppressHydrationWarning>{modKey}</span>
                <span>+</span>
                <span>K</span>
              </kbd>
              <span className="hidden md:inline">to open the command palette & terminal</span>
            </div>
            <div className="flex justify-end mt-2">
              <button onClick={dismiss} className="text-xs underline hover:no-underline">Got it</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default HotkeyHint;
