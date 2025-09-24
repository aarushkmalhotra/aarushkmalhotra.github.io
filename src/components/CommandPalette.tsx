"use client";

import { useEffect, useMemo, useState } from "react";
import { getProjects, getAllSkills } from "@/lib/projects";
import { useRouter, usePathname } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Item = {
  label: string;
  href: string;
  type: "page" | "project" | "skill" | "action";
};

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isMac, setIsMac] = useState(false);
  const [showSkeletons, setShowSkeletons] = useState(false);

  useEffect(() => {
    // Detect macOS
    const platform = navigator.platform.toUpperCase();
    setIsMac(platform.includes('MAC'));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isModK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if (isModK) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setShowSkeletons(true);
      const timer = setTimeout(() => setShowSkeletons(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (query.trim()) {
      setShowSkeletons(true);
      const timer = setTimeout(() => setShowSkeletons(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [query]);

  const items: Item[] = useMemo(() => {
    const projects = getProjects().map((p) => ({
      label: `${p.name}`,
      href: `/projects/${p.id}`,
      type: "project" as const,
    }));
    const skills = getAllSkills().map((s) => ({
      label: `${s}`,
      href: `/skill/${encodeURIComponent(s.toLowerCase().replace(/\s/g, '-').replace(/\./g, ''))}`,
      type: "skill" as const,
    }));
    const pages: Item[] = [
      { label: "Home", href: "/", type: "page" },
      { label: "Projects", href: "/projects", type: "page" },
      { label: "Blog", href: "/blog", type: "page" },
      { label: "About", href: "/about", type: "page" },
      { label: "Contact", href: "/contact", type: "page" },
    ];
    const actions: Item[] = [
      { label: "Open Terminal", href: "#action:terminal", type: "action" },
    ];
    return [...pages, ...projects, ...skills, ...actions].filter(item => item.href !== pathname);
  }, [pathname]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 10);
    return items
      .map((it) => ({ it, score: it.label.toLowerCase().indexOf(q) }))
      .filter((r) => r.score !== -1)
      .sort((a, b) => a.score - b.score)
      .slice(0, 12)
      .map((r) => r.it);
  }, [items, query]);

  const skeletonCount = query.trim() ? (filtered.length || 10) : 10;

  const onSelect = (item: Item) => {
    setOpen(false);
    if (item.type === "action" && item.href === "#action:terminal") {
      // Focus the first InteractiveTerminal if present
      const el = document.querySelector('textarea[placeholder*="Type a command" ]') as HTMLTextAreaElement | null;
      el?.focus();
      return;
    }
    router.push(item.href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-xl p-0 overflow-hidden" aria-describedby={undefined}>
        <div className="border-b p-2">
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, projects, skills..."
          />
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-1">
          {showSkeletons ? (
            Array.from({ length: skeletonCount }, (_, i) => ({ label: 'placeholder' })).map((item, index) => (
              <li key={`skeleton-${index}`}>
                <div className="w-full px-3 py-2 flex items-center gap-2">
                  <div className="h-3 w-8 bg-muted rounded animate-pulse" />
                  <div className={`h-3 bg-muted rounded animate-pulse ${
                    item.label.length > 20 ? 'w-3/4' : item.label.length > 10 ? 'w-1/2' : 'w-1/3'
                  }`} />
                </div>
              </li>
            ))
          ) : filtered.length === 0 ? (
            <li className="flex flex-col items-center justify-center py-16 text-sm text-muted-foreground">
              <div className="mb-2 font-medium">No results found</div>
              <div className="text-xs text-center max-w-sm">
                We can’t look up the internet for you. Maybe try fewer letters or, you know, real words.
              </div>
            </li>
          ) : (
            filtered.map((item) => (
              <li key={item.href}>
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded-md flex items-center gap-2"
                >
                  <span className="text-xs uppercase text-muted-foreground">{item.type}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="px-3 py-2 border-t text-[11px] text-muted-foreground">
          Tip: Press {isMac ? '⌘' : 'Ctrl'}+K to open anywhere.
        </div>
      </DialogContent>
    </Dialog>
  );
}
