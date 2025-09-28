"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getProjects, getAllSkills } from "@/lib/projects";
import { useRouter, usePathname } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";

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
  const [activeTab, setActiveTab] = useState<"search" | "terminal">("search");
  const searchInputRef = useRef<HTMLInputElement>(null);

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
        setOpen((v) => {
          const next = !v;
          if (next) {
            // Restore last tab if saved
            const last = (localStorage.getItem('commandPalette:lastTab') as "search" | "terminal" | null) ?? "search";
            setActiveTab(last);
            setQuery("");
          }
          return next;
        });
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

  // Close palette when terminal-driven navigation occurs
  useEffect(() => {
    const onClose = () => setOpen(false);
    const onCloseOnNavigate = (e: Event) => {
      setOpen(false);
    };
    window.addEventListener('command-palette:close' as any, onClose as EventListener);
    window.addEventListener('command-palette:closeOnNavigate' as any, onCloseOnNavigate as EventListener);
    return () => {
      window.removeEventListener('command-palette:close' as any, onClose as EventListener);
      window.removeEventListener('command-palette:closeOnNavigate' as any, onCloseOnNavigate as EventListener);
    };
  }, []);

  useEffect(() => {
    if (query.trim()) {
      setShowSkeletons(true);
      const timer = setTimeout(() => setShowSkeletons(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [query]);

  // Focus management & persistence
  useEffect(() => {
    if (!open) return;
    // Persist last tab while palette is open
    try { localStorage.setItem('commandPalette:lastTab', activeTab); } catch {}

    if (activeTab === 'search') {
      // Focus the search input explicitly
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    } else if (activeTab === 'terminal') {
      // If terminal has already booted this session, focus immediately; else wait for ready event
      const booted = typeof window !== 'undefined' && sessionStorage.getItem('terminalBooted') === 'true';
      if (booted) {
        requestAnimationFrame(() => {
          const textarea = document.querySelector('.command-palette-terminal textarea') as HTMLTextAreaElement | null;
          textarea?.focus();
        });
      } else {
        // Ensure nothing else gets focus
        setTimeout(() => (document.activeElement as HTMLElement | null)?.blur?.(), 0);
      }
    }
  }, [activeTab, open]);

  // Focus terminal input when it signals ready (after boot finishes)
  useEffect(() => {
    const onReady = () => {
      if (!open) return;
      if (activeTab !== 'terminal') return;
      requestAnimationFrame(() => {
        const textarea = document.querySelector('.command-palette-terminal textarea') as HTMLTextAreaElement | null;
        textarea?.focus();
      });
    };
    window.addEventListener('terminal:ready' as any, onReady as EventListener);
    return () => window.removeEventListener('terminal:ready' as any, onReady as EventListener);
  }, [open, activeTab]);

  const handleTerminalFocusCapture = (e: React.FocusEvent<HTMLDivElement>) => {
    if (activeTab !== 'terminal') return;
    const booted = typeof window !== 'undefined' && sessionStorage.getItem('terminalBooted') === 'true';
    const target = e.target as HTMLElement | null;
    if (!booted) {
      // While booting, keep focus off any element
      target?.blur?.();
      setTimeout(() => (document.activeElement as HTMLElement | null)?.blur?.(), 0);
      return;
    }
    if (target && target.tagName !== 'TEXTAREA') {
      const textarea = document.querySelector('.command-palette-terminal textarea') as HTMLTextAreaElement | null;
      if (textarea) {
        e.stopPropagation();
        requestAnimationFrame(() => textarea.focus());
      }
    }
  };

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
    if (item.type === "action" && item.href === "#action:terminal") {
      // Switch to terminal tab inside the palette and focus its textarea
      setActiveTab("terminal");
      setQuery("");
      setShowSkeletons(false);
      // Defer focus until terminal is mounted in DOM
      const booted = typeof window !== 'undefined' && sessionStorage.getItem('terminalBooted') === 'true';
      if (booted) {
        requestAnimationFrame(() => {
          const textarea = document.querySelector('.command-palette-terminal textarea') as HTMLTextAreaElement | null;
          textarea?.focus();
        });
      }
      return;
    }
    setOpen(false);
    router.push(item.href);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) { setActiveTab("search"); } }}>
      <DialogContent
        onOpenAutoFocus={(e) => {
          // Prevent default auto-focus (which can land on tab triggers or container)
          e.preventDefault();
          // Manually focus based on active tab and readiness
          if (activeTab === 'search') {
            setTimeout(() => searchInputRef.current?.focus(), 0);
          } else if (activeTab === 'terminal') {
            const booted = typeof window !== 'undefined' && sessionStorage.getItem('terminalBooted') === 'true';
            if (booted) {
              setTimeout(() => {
                const textarea = document.querySelector('.command-palette-terminal textarea') as HTMLTextAreaElement | null;
                textarea?.focus();
              }, 0);
            } else {
              // Make sure the active element is blurred so triggers/containers don't show focus
              setTimeout(() => (document.activeElement as HTMLElement | null)?.blur?.(), 0);
            }
          }
        }}
        className="fixed gap-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96vw] max-w-2xl p-0 overflow-hidden"
        aria-describedby={undefined}
      >
  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <div className="flex items-center justify-between border-b p-2">
            {activeTab === 'search' ? (
              <div className="flex-1 pr-2">
                <Input
                  ref={searchInputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pages, projects, skills..."
                />
              </div>
            ) : (
              <div className="px-2 py-2 text-sm text-muted-foreground">Interactive Terminal</div>
            )}
            <TabsList className="ml-2">
              <TabsTrigger value="search" onClick={() => localStorage.setItem('commandPalette:lastTab', 'search')}>Search</TabsTrigger>
              <TabsTrigger value="terminal" onClick={() => localStorage.setItem('commandPalette:lastTab', 'terminal')}>Terminal</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="search" className="mt-0" tabIndex={-1}>
            <ul className="h-[39dvh] overflow-y-auto p-1" tabIndex={-1}>
              {showSkeletons ? (
                Array.from({ length: skeletonCount }, (_, i) => ({ label: 'placeholder' })).map((item, index) => (
                  <li key={`skeleton-${index}`} className={index !== skeletonCount + 1 ? "mt-2" : ""}>
                    <div className="w-full px-3 py-2 flex items-center gap-2">
                      <div className="h-3 w-8 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-full bg-muted rounded animate-pulse" />
                    </div>
                  </li>
                ))
              ) : filtered.length === 0 ? (
                <li className="flex flex-col items-center justify-center text-sm text-muted-foreground h-[39dvh]">
                  <div className="mb-2 font-medium">No results found</div>
                  <div className="text-xs text-center max-w-sm">
                    Unfortunately, I can’t look up the internet for you. Maybe try fewer letters or, you know, real words.
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
          </TabsContent>

          <TabsContent value="terminal" className="mt-0" tabIndex={-1}>
            <div
              className="h-[39dvh] p-2 overflow-hidden"
              tabIndex={-1}
              onFocusCapture={handleTerminalFocusCapture}
            >
              <InteractiveTerminal className="command-palette-terminal" heightClass="h-[calc(39dvh-56px)]" />
            </div>
          </TabsContent>
        </Tabs>

        <div className="px-3 py-2 border-t text-[11px] text-muted-foreground flex items-center justify-between">
          <div>Tip: Press {isMac ? '⌘' : 'Ctrl'}+K to open anywhere.</div>
          {activeTab === 'search' && (
            <button
              type="button"
              onClick={() => onSelect({ label: 'Open Terminal', href: '#action:terminal', type: 'action' })}
              className="text-xs underline hover:no-underline"
            >
              Open terminal tab ↗
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
