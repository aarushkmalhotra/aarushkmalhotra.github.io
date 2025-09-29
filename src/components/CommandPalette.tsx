"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getProjects, getAllSkills } from "@/lib/projects";
import placeholderImagesData from "@/lib/placeholder-images.json";
import { useRouter, usePathname } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";

type ItemType = "page" | "project" | "skill" | "action";
type Item = {
  label: string;
  href: string;
  type: ItemType;
  // Optional data for richer preview and search
  id?: string;
  keywords?: string[];
  tagline?: string;
  image?: string | null;
};

type FilterType = "all" | "page" | "project" | "skill" | "recent" | "favorites";
type Recent = { href: string; label: string; type: ItemType; ts: number };

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isMac, setIsMac] = useState(false);
  const [showSkeletons, setShowSkeletons] = useState(false);
  const [activeTab, setActiveTab] = useState<"search" | "terminal">("search");
  const [filter, setFilter] = useState<FilterType>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [favorites, setFavorites] = useState<Record<string, true>>({});
  const [recents, setRecents] = useState<Recent[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Detect macOS
    const platform = navigator.platform.toUpperCase();
    setIsMac(platform.includes('MAC'));
  }, []);

  // Load favorites and recents once
  useEffect(() => {
    try {
      const fav = JSON.parse(localStorage.getItem('commandPalette:favorites') || '{}');
      if (fav && typeof fav === 'object') setFavorites(fav);
    } catch {}
    try {
      const r: Recent[] = JSON.parse(localStorage.getItem('commandPalette:recents') || '[]');
      if (Array.isArray(r)) setRecents(r);
    } catch {}
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
      const booted = typeof window !== 'undefined' && !!sessionStorage.getItem('terminalBooted');
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
    const booted = typeof window !== 'undefined' && !!sessionStorage.getItem('terminalBooted');
    const target = e.target as HTMLElement | null;
    if (!booted) {
      // While booting, keep focus off any element
      target?.blur?.();
      setTimeout(() => (document.activeElement as HTMLElement | null)?.blur?.(), 0);
      return;
    }
    // Allow interactions with dropdowns/buttons/links etc. Don't force focus to textarea in those cases.
    if (target && target.tagName !== 'TEXTAREA') {
      const interactive = target.closest('[data-radix-popper-content-wrapper], [role="menu"], [role="menuitem"], button, a, [contenteditable], input, select, textarea');
      if (interactive) return;
      const textarea = document.querySelector('.command-palette-terminal textarea') as HTMLTextAreaElement | null;
      if (textarea) {
        requestAnimationFrame(() => textarea.focus());
      }
    }
  };

  const items: Item[] = useMemo(() => {
    const allProjects = getProjects();
    // Build placeholder image lookup
    const imageMap: Record<string, string> = {};
    try {
      const arr = (placeholderImagesData as any)?.placeholderImages as Array<{ id: string; imageUrl: string }>; 
      if (Array.isArray(arr)) {
        for (const it of arr) imageMap[it.id] = it.imageUrl;
      }
    } catch {}
    const projects = allProjects.map((p) => ({
      label: `${p.name}`,
      href: `/projects/${p.id}`,
      type: "project" as const,
      id: p.id,
      tagline: p.tagline,
      keywords: p.keywords,
      image: (() => {
        const key = p.images?.[0];
        if (!key) return null;
        return imageMap[key] ?? null;
      })(),
    }));
    const skillCounts: Record<string, number> = {};
    allProjects.forEach((p) => {
      p.techStack.split(',').map(s => s.trim()).forEach((s) => {
        skillCounts[s] = (skillCounts[s] || 0) + 1;
      });
    });
    const skills = getAllSkills().map((s) => ({
      label: `${s}`,
      href: `/skill/${encodeURIComponent(s.toLowerCase().replace(/\s/g, '-').replace(/\./g, ''))}`,
      type: "skill" as const,
      tagline: skillCounts[s] ? `${skillCounts[s]} project${skillCounts[s] > 1 ? 's' : ''}` : undefined,
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

  // Parse query tokens: type:project|page|skill|action, is:starred
  const parsed = useMemo(() => {
    const raw = query.trim();
    const tokens = raw.split(/\s+/).filter(Boolean);
    let q = [] as string[];
    let forcedFilter: FilterType | null = null;
    let onlyStarred = false;
    for (const t of tokens) {
      const m = /^type:(.+)$/i.exec(t);
      if (m) {
        const val = m[1].toLowerCase();
  if (val === 'page' || val === 'project' || val === 'skill') forcedFilter = val as FilterType;
  if (val === 'action') forcedFilter = null; // unsupported as a filter pill
        if (val === 'recent') forcedFilter = 'recent' as any;
        if (val === 'favorites' || val === 'starred' || val === 'favorite') forcedFilter = 'favorites' as any;
        if (val === 'all') forcedFilter = 'all';
        continue;
      }
      if (/^is:(star|starred|fav|favorite)$/i.test(t)) { onlyStarred = true; continue; }
      q.push(t);
    }
    return { text: q.join(' '), forcedFilter, onlyStarred };
  }, [query]);

  const effectiveFilter: FilterType = (parsed.forcedFilter ?? filter) as FilterType;

  // Simple fuzzy matcher returning score and highlight ranges
  function fuzzyMatch(label: string, q: string): { score: number; ranges: Array<[number, number]> } | null {
    if (!q) return { score: 0, ranges: [] };
    const s = label.toLowerCase();
    const needle = q.toLowerCase();
    let si = 0;
    let score = 0;
    const hits: number[] = [];
    for (let i = 0; i < needle.length; i++) {
      const ch = needle[i];
      const idx = s.indexOf(ch, si);
      if (idx === -1) return null;
      // reward consecutive and early matches
      score += (si === idx ? 2 : 1) + Math.max(0, 5 - idx * 0.05);
      hits.push(idx);
      si = idx + 1;
    }
    // Build ranges from hits (merge consecutive)
    hits.sort((a, b) => a - b);
    const ranges: Array<[number, number]> = [];
    for (let i = 0; i < hits.length; i++) {
      const start = hits[i];
      let end = start + 1;
      while (i + 1 < hits.length && hits[i + 1] === end) { end = hits[i + 1] + 1; i++; }
      ranges.push([start, end]);
    }
    // Prefer full-prefix hits slightly
    if (s.startsWith(needle)) score += 10;
    return { score, ranges };
  }

  const filtered = useMemo(() => {
    const q = parsed.text;
    // Build base pool by filter
    let basePool: Item[];
    if (effectiveFilter === 'all') {
      basePool = items;
    } else if (effectiveFilter === 'recent') {
      const seen: Record<string, true> = {};
      const rec: Item[] = [];
      for (const r of [...recents].sort((a,b)=>b.ts-a.ts)) {
        if (!seen[r.href]) {
          const it = items.find(i => i.href === r.href);
          if (it) { rec.push(it); seen[r.href] = true; }
        }
      }
      basePool = rec;
    } else if (effectiveFilter === 'favorites') {
      basePool = items.filter((it) => !!favorites[it.href]);
    } else {
      basePool = items.filter((it) => it.type === effectiveFilter);
    }
    // Filter favorites if requested
    const byFav = parsed.onlyStarred ? basePool.filter(it => favorites[it.href]) : basePool;
    // If no query, return:
    // - Recent: the deduped recents list
    // - Favorites: the favorites list
    // - All: all items
    // - Page/Project/Skill: include favorites of that type at the top, then the base pool (deduped)
    if (!q) {
      if (effectiveFilter === 'recent') return byFav;
      if (effectiveFilter === 'favorites') return byFav;
      if (effectiveFilter === 'all') return items;
      if (effectiveFilter === 'page' || effectiveFilter === 'project' || effectiveFilter === 'skill') {
        const favOfType = items.filter(i => i.type === effectiveFilter && favorites[i.href]);
        const seen: Record<string, true> = {};
        const merged: Item[] = [];
        const push = (ar: Item[]) => ar.forEach(it => { if (!seen[it.href]) { merged.push(it); seen[it.href] = true; } });
        push(favOfType);
        push(byFav.length ? byFav : basePool);
        return merged;
      }
      return byFav;
    }
    // Score via fuzzy
    return byFav
      .map((it) => {
        const altText = [it.label, ...(it.keywords || []), it.tagline || ""].join(" ");
        const m = fuzzyMatch(altText, q);
        return m ? { it, score: m.score, ranges: m.ranges } : null;
      })
      .filter((r): r is { it: Item; score: number; ranges: Array<[number, number]> } => !!r)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.it);
  }, [items, parsed, effectiveFilter, favorites, recents]);

  // Counts for filter pills
  const counts = useMemo(() => {
    const c: Record<FilterType, number> = { all: items.length, page: 0, project: 0, skill: 0, recent: 0, favorites: 0 };
    for (const it of items) {
      if (it.type === 'page') c.page++;
      else if (it.type === 'project') c.project++;
      else if (it.type === 'skill') c.skill++;
    }
    // Recent count is deduped
    const seen: Record<string, true> = {};
    for (const r of recents) {
      if (!seen[r.href] && items.some(i => i.href === r.href)) { c.recent++; seen[r.href] = true; }
    }
    // Favorites count based on starred items present
    for (const href of Object.keys(favorites)) {
      if (items.some(i => i.href === href)) c.favorites++;
    }
    return c;
  }, [items, recents, favorites]);

  // If the Recent/Favorites pill becomes empty while selected, fall back to All
  useEffect(() => {
    if (filter === 'recent' && counts.recent === 0) setFilter('all');
    if (filter === 'favorites' && counts.favorites === 0) setFilter('all');
  }, [counts.recent, counts.favorites, filter]);

  // Keep active index in bounds and auto-scroll selection into view
  useEffect(() => {
    setActiveIndex((i) => Math.min(Math.max(0, i), Math.max(0, filtered.length - 1)));
  }, [filtered.length]);
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const rows = list.querySelectorAll('li > div');
    const el = rows[activeIndex] as HTMLElement | undefined;
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, filtered]);

  const skeletonCount = query.trim() ? (filtered.length || 10) : 10;

  const persistRecent = (item: Item) => {
    if (item.type === 'action') return;
    try {
      const now = Date.now();
      const r: Recent = { href: item.href, label: item.label, type: item.type, ts: now };
      const next = [r, ...recents.filter(x => x.href !== item.href)].slice(0, 40);
      setRecents(next);
      localStorage.setItem('commandPalette:recents', JSON.stringify(next));
    } catch {}
  };

  const onSelect = (item: Item, opts?: { newTab?: boolean }) => {
    if (item.type === "action" && item.href === "#action:terminal") {
      // Switch to terminal tab inside the palette and focus its textarea
      setActiveTab("terminal");
      setQuery("");
      setShowSkeletons(false);
      // Defer focus until terminal is mounted in DOM
      const booted = typeof window !== 'undefined' && !!sessionStorage.getItem('terminalBooted');
      if (booted) {
        requestAnimationFrame(() => {
          const textarea = document.querySelector('.command-palette-terminal textarea') as HTMLTextAreaElement | null;
          textarea?.focus();
        });
      }
      return;
    }
    persistRecent(item);
    if (opts?.newTab) {
      // Open in new tab and keep palette open so user can continue
      window.open(item.href, "_blank");
    } else {
      setOpen(false);
      router.push(item.href);
    }
  };

  const toggleFavorite = (item: Item) => {
    const next = { ...favorites };
    if (next[item.href]) delete next[item.href]; else next[item.href] = true;
    setFavorites(next);
    try { localStorage.setItem('commandPalette:favorites', JSON.stringify(next)); } catch {}
  };

  // Active preview item
  const activeItem = filtered[activeIndex] || filtered[0];

  const handleListKey = (e: React.KeyboardEvent) => {
    if (activeTab !== 'search') return;
    if (!filtered.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onSelect(activeItem, { newTab: e.ctrlKey || e.metaKey });
    } else if (e.key.toLowerCase() === 'f' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      toggleFavorite(activeItem);
    }
  };

  // Highlight helper constrained to single-line label
  const renderHighlighted = (label: string) => {
    const q = parsed.text;
    if (!q) return <span className="truncate">{label}</span>;
    const m = fuzzyMatch(label, q);
    if (!m || !m.ranges.length) return <span className="truncate">{label}</span>;
    const parts: React.ReactNode[] = [];
    let last = 0;
    for (const [start, end] of m.ranges) {
      if (start > last) parts.push(<span key={parts.length}>{label.slice(last, start)}</span>);
      parts.push(<span key={parts.length} className="bg-yellow-200/60 dark:bg-yellow-500/30 rounded px-0.5">{label.slice(start, end)}</span>);
      last = end;
    }
    if (last < label.length) parts.push(<span key={parts.length}>{label.slice(last)}</span>);
    return <span className="truncate inline-block max-w-full align-middle">{parts}</span>;
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
            const booted = typeof window !== 'undefined' && !!sessionStorage.getItem('terminalBooted');
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
        className="fixed gap-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96vw] max-w-3xl p-0 overflow-hidden"
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
                  onKeyDown={handleListKey}
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
            {/* Filters */}
            <div className="px-2 py-1 flex items-center gap-1 border-b text-xs text-muted-foreground">
              {/* Order: All, Recent (if any), Favorites (if any), Pages, Projects, Skills */}
              {(['all'] as FilterType[]).map((ft) => (
                <button
                  key={ft}
                  type="button"
                  onClick={() => setFilter(ft)}
                  className={`px-2 py-1 rounded border ${ft===filter ? 'bg-muted text-foreground' : ''}`}
                >
                  All <span className="opacity-70">{counts[ft]}</span>
                </button>
              ))}
              {counts.recent > 0 && (
                <button
                  key="recent"
                  type="button"
                  onClick={() => setFilter('recent')}
                  className={`px-2 py-1 rounded border ${filter==='recent' ? 'bg-muted text-foreground' : ''}`}
                >
                  Recent <span className="opacity-70">{counts.recent}</span>
                </button>
              )}
              {counts.favorites > 0 && (
                <button
                  key="favorites"
                  type="button"
                  onClick={() => setFilter('favorites')}
                  className={`px-2 py-1 rounded border ${filter==='favorites' ? 'bg-muted text-foreground' : ''}`}
                >
                  Favorites <span className="opacity-70">{counts.favorites}</span>
                </button>
              )}
              {(['page','project','skill'] as FilterType[]).map((ft) => (
                <button
                  key={ft}
                  type="button"
                  onClick={() => setFilter(ft)}
                  className={`px-2 py-1 rounded border ${ft===filter ? 'bg-muted text-foreground' : ''}`}
                >
                  {ft === 'page' ? 'Pages' : ft === 'project' ? 'Projects' : 'Skills'} <span className="opacity-70">{counts[ft]}</span>
                </button>
              ))}
              <div className="ml-auto">Use "type:project" or "is:starred" in query</div>
            </div>
            <div className="grid grid-cols-2 gap-0">
              <ul ref={listRef} className="h-[39dvh] overflow-y-auto p-1" tabIndex={-1} onKeyDown={handleListKey}>
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
                <li className="flex mx-6 flex-col items-center justify-center text-sm text-muted-foreground h-[38dvh]">
                  <div className="mb-2 font-medium">No results found</div>
                  <div className="text-xs text-center max-w-sm">
                    Unfortunately, I can’t look up the internet for you. Maybe try fewer letters or, you know, real words.
                  </div>
                </li>
              ) : (
                filtered.map((item, idx) => (
                  <li key={item.href}>
                    <div
                      className={`w-full h-10 px-3 py-2 rounded-md flex items-center gap-2 ${idx===activeIndex ? 'bg-muted' : 'hover:bg-muted'}`}
                      role="button"
                      tabIndex={-1}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={(e) => onSelect(item, { newTab: e.ctrlKey || e.metaKey })}
                    >
                      <span className="text-[10px] uppercase text-muted-foreground w-14 shrink-0">{item.type}</span>
                      <div className="flex-1 min-w-0 text-sm truncate">{renderHighlighted(item.label)}</div>
                      <div className="flex items-center gap-2 opacity-80">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }}
                          className={`text-xs ${favorites[item.href] ? 'text-yellow-500' : 'text-muted-foreground'} hover:text-yellow-500`}
                          title={favorites[item.href] ? 'Unstar' : 'Star'}
                          aria-label={favorites[item.href] ? 'Unstar' : 'Star'}
                        >★</button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onSelect(item, { newTab: true }); }}
                          className="text-xs underline hover:no-underline"
                          title="Open in new tab"
                          aria-label="Open in new tab"
                        >↗</button>
                      </div>
                    </div>
                  </li>
                ))
              )}
              </ul>
              {/* Right side preview */}
              <div className="h-[39dvh] border-l p-3 hidden md:block">
                {!activeItem ? (
                  <div className="text-sm text-muted-foreground h-full flex items-center justify-center">No selection</div>
                ) : activeItem.type === 'project' ? (
                  <div className="flex flex-col h-full">
                    {activeItem.image ? (
                      <div className="relative w-full aspect-video rounded overflow-hidden border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={activeItem.image} alt="preview" className="object-cover w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-full aspect-video rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">No image</div>
                    )}
                    <div className="mt-2">
                      <div className="font-medium text-sm">{activeItem.label}</div>
                      {activeItem.tagline && <div className="text-xs text-muted-foreground mt-1">{activeItem.tagline}</div>}
                    </div>
                  </div>
                ) : activeItem.type === 'skill' ? (
                  <div>
                    <div className="font-medium text-sm">{activeItem.label}</div>
                    {activeItem.tagline && <div className="text-xs text-muted-foreground mt-1">{activeItem.tagline}</div>}
                    <div className="text-xs text-muted-foreground mt-2">Press Enter to open, {isMac ? '⌘' : 'Ctrl'}+Enter to open in new tab. {isMac ? '⌘' : 'Ctrl'}+F to star.</div>
                  </div>
                ) : (
                  <div>
                    <div className="font-medium text-sm">{activeItem.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">Type: {activeItem.type}</div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="terminal" className="mt-0" tabIndex={-1}>
            <div
              className="h-[43dvh] p-2 overflow-hidden"
              tabIndex={-1}
              onFocusCapture={handleTerminalFocusCapture}
            >
              <InteractiveTerminal className="command-palette-terminal [&_.cursor-pointer]:cursor-pointer [&_[role=menuitem]]:cursor-pointer" heightClass="h-[calc(39dvh-56px)]" />
            </div>
          </TabsContent>
        </Tabs>

        <div className="px-3 py-2 border-t text-[11px] text-muted-foreground flex items-center justify-between">
          <div>Tip: Press {isMac ? '⌘' : 'Ctrl'}+K to open anywhere.</div>
          {activeTab === 'search' && (
            <div className="ml-2 text-[11px] text-muted-foreground hidden sm:block">
              Use ↑/↓ to navigate • Enter to open • {isMac ? '⌘' : 'Ctrl'}+Enter new tab • {isMac ? '⌘' : 'Ctrl'}+F star
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
