"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
// Removed external icon; using inline SVG + progress ring
import { cn } from '@/lib/utils';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [avoidDock, setAvoidDock] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.pageYOffset;
      setIsVisible(y > 300);
      const doc = document.documentElement;
      const docHeight = doc.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? (y / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, p)));
    };
    const detectDock = () => {
      const marker = document.getElementById('project-quick-dock-marker');
      setAvoidDock(!!marker);
    };
    onScroll();
    detectDock();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // Mutation observer in case dock mounts after this component
    const mo = new MutationObserver(detectDock);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      mo.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // If on a slug page (dock present), hide on mobile entirely; keep on md+ with adjusted position
  const wrapperClasses = cn(
    "fixed z-50",
    avoidDock ? "hidden md:block md:bottom-4 md:right-[calc(4rem+16px)]" : "bottom-4 right-4"
  );

  return (
    <div className={wrapperClasses}>
      <Button
        variant="outline"
        size="icon"
        onClick={scrollToTop}
        className={cn(
          'relative w-11 h-11 rounded-full border-0 shadow-lg bg-background/90 backdrop-blur group transition-opacity duration-300',
          isVisible ? 'opacity-100' : 'opacity-0',
          !isVisible && 'pointer-events-none'
        )}
        aria-label="Scroll to top"
      >
        {/* Progress ring */}
        {(() => {
          const size = 44; const stroke = 3; const r = (size - stroke) / 2; const C = 2 * Math.PI * r; const off = C - (progress / 100) * C;
          return (
            <svg width={size} height={size} className="absolute inset-0 m-auto text-muted-foreground">
              <circle cx={size/2} cy={size/2} r={r} stroke="currentColor" strokeWidth={stroke} fill="none" opacity={0.2} />
              <circle cx={size/2} cy={size/2} r={r} stroke="hsl(var(--project-primary, var(--primary)))" strokeWidth={stroke} fill="none" strokeDasharray={C} strokeDashoffset={off} strokeLinecap="round" />
            </svg>
          );
        })()}
        {/* Up arrow */}
        <svg viewBox="0 0 24 24" className="relative z-10 w-4 h-4 text-foreground group-hover:text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </Button>
    </div>
  );
}
