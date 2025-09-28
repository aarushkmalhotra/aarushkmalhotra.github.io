"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Link as LinkIcon } from "lucide-react";

type SectionHeadingProps = {
  sectionId: string;
  title: string;
  className?: string;
};

export function SectionHeading({ sectionId, title, className }: SectionHeadingProps) {
  const [copied, setCopied] = useState(false);
  const [timerId, setTimerId] = useState<number | null>(null);

  // Reset copied state on section change
  useEffect(() => {
    setCopied(false);
    if (timerId) window.clearTimeout(timerId);
  }, [sectionId]);

  // Listen for other sections being copied to clear this one immediately
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const ce = e as CustomEvent<string>;
        if (ce.detail !== sectionId) {
          setCopied(false);
          if (timerId) window.clearTimeout(timerId);
        }
      } catch {}
    };
    window.addEventListener('section-link-copied', handler as EventListener);
    return () => window.removeEventListener('section-link-copied', handler as EventListener);
  }, [sectionId, timerId]);

  const copyLink = () => {
    try {
      const base = new URL(window.location.origin + window.location.pathname);
      base.hash = sectionId;
      navigator.clipboard.writeText(base.toString());
      // Inform others to hide their copied state
      try { window.dispatchEvent(new CustomEvent('section-link-copied', { detail: sectionId })); } catch {}
      setCopied(true);
      const id = window.setTimeout(() => setCopied(false), 2000);
      setTimerId(id as unknown as number);
    } catch {}
  };

  const visibilityClasses = copied
    ? "opacity-100 lg:opacity-100 lg:pointer-events-auto"
    : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:pointer-events-none lg:group-hover:pointer-events-auto";

  return (
    <div className={cn("mb-6 flex items-center gap-2 group", className)}>
      <h2 className="font-headline text-3xl prose prose-lg dark:prose-invert max-w-none m-0">
        {title}
      </h2>
      <button
        type="button"
        aria-label={`Copy link to ${title}`}
        onClick={copyLink}
        className={cn(
          "shrink-0 w-9 h-9 grid place-items-center rounded-full transition-opacity duration-300 ease-out",
          visibilityClasses,
          copied
            ? "bg-emerald-600/90 text-white"
            : "bg-muted text-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default SectionHeading;
