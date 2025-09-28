"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link as LinkIcon, Music, Share2, Menu, ArrowUp, Check, Star } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";

interface ProjectQuickDockProps {
  project: Project;
  backHref: string;
}

type SectionDef = {
  id: string;
  label: string;
};

// Minimal inline SVGs to avoid lucide/default icon packs
const Icon = {
  Back: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  Github: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5a12 12 0 00-3.79 23.39c.6.11.82-.26.82-.58 0-.29-.01-1.06-.02-2.07-3.34.73-4.04-1.61-4.04-1.61-.54-1.39-1.32-1.76-1.32-1.76-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.77-1.6-2.67-.3-5.47-1.34-5.47-5.97 0-1.32.47-2.39 1.23-3.23-.12-.3-.53-1.52.12-3.17 0 0 1.01-.32 3.31 1.23a11.5 11.5 0 016.02 0c2.3-1.55 3.31-1.23 3.31-1.23.65 1.65.24 2.87.12 3.17.76.84 1.23 1.91 1.23 3.23 0 4.64-2.8 5.66-5.48 5.96.43.37.82 1.1.82 2.22 0 1.6-.02 2.89-.02 3.29 0 .32.21.69.83.57A12 12 0 0012 .5z" />
    </svg>
  ),
  External: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14L21 3" />
    </svg>
  ),
};

// Consistent inline SVG icon set for sections
const SectionIcons = {
  overview: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  ),
  role: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  problem: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
      <path d="M12 6v6" />
      <circle cx="12" cy="17" r="1" />
    </svg>
  ),
  approach: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18c6 0 6-6 10-6" />
    </svg>
  ),
  outcomes: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  audio: (props: React.SVGProps<SVGSVGElement>) => (
    <Music width={20} height={20} {...props} />
  ),
  gallery: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  ),
  challenges: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 2l9 4-9 4-9-4 9-4z" />
      <path d="M3 10l9 4 9-4" />
      <path d="M3 16l9 4 9-4" />
    </svg>
  ),
} as const;

const getSectionIcon = (id: string) => {
  switch (id) {
    case "overview":
      return SectionIcons.overview;
    case "role":
      return SectionIcons.role;
    case "problem":
      return SectionIcons.problem;
    case "approach":
      return SectionIcons.approach;
    case "outcomes":
      return SectionIcons.outcomes;
    case "ai-samples":
    case "original-tracks":
      return SectionIcons.audio;
    case "gallery":
      return SectionIcons.gallery;
    case "challenges":
      return SectionIcons.challenges;
    default:
      return SectionIcons.overview;
  }
};

// Short descriptions for each section (used in tooltips and mobile sheet)
const sectionDescriptions: Record<string, string> = {
  overview: "Summary",
  role: "What I did",
  problem: "The challenge",
  approach: "How I solved it",
  outcomes: "Results",
  challenges: "Key hurdles",
  "ai-samples": "AI audio demos",
  "original-tracks": "Original songs",
  gallery: "Screens & media",
};

export function ProjectQuickDock({ project, backHref }: ProjectQuickDockProps) {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // Responsive breakpoint: is small (sm) and up
  const [isSmUp, setIsSmUp] = useState(false);
  const [copiedBySection, setCopiedBySection] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const activeRef = useRef<string | null>(null);
  const [favorite, setFavorite] = useState<boolean>(false);
  const dockBackHref = backHref || "/projects";
  const sp = useSearchParams();
  const dockBackHrefWithParams = useMemo(() => {
    try {
      if (!sp) return dockBackHref;
      const params = new URLSearchParams();
      (sp as any).forEach?.((value: string, key: string) => {
        if (value != null) params.set(key, value);
      });
      const qs = params.toString();
      return qs ? `${dockBackHref}?${qs}` : dockBackHref;
    } catch {
      return dockBackHref;
    }
  }, [sp, dockBackHref]);

  // Track sm breakpoint to switch sheet side responsively
  useEffect(() => {
    try {
      const mq = window.matchMedia('(min-width: 640px)');
      const onChange = (e: MediaQueryListEvent) => setIsSmUp(e.matches);
      setIsSmUp(mq.matches);
      // Support older browsers
      if (mq.addEventListener) {
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
      } else if ((mq as any).addListener) {
        (mq as any).addListener(onChange);
        return () => (mq as any).removeListener('change', onChange);
      }
    } catch {}
  }, []);

  // Lock background scroll when sheet is open (mobile)
  useEffect(() => {
    try {
      if (isSheetOpen) {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = prev;
        };
      }
    } catch {}
  }, [isSheetOpen]);

  // Favorite persistence per project using shared header key
  useEffect(() => {
    try {
      const raw = localStorage.getItem('portfolio:favorites');
      const ids = raw ? (JSON.parse(raw) as string[]) : [];
      setFavorite(ids.includes(project.id));
    } catch {}
  }, [project.id]);

  // React to favorites updates dispatched by header or elsewhere
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const custom = e as CustomEvent<string[]>;
        const list = custom.detail ?? JSON.parse(localStorage.getItem('portfolio:favorites') || '[]');
        setFavorite(Array.isArray(list) && list.includes(project.id));
      } catch {}
    };
    window.addEventListener('portfolio:favorites-updated', handler as EventListener);
    return () => window.removeEventListener('portfolio:favorites-updated', handler as EventListener);
  }, [project.id]);

  const toggleFavorite = () => {
    try {
      const raw = localStorage.getItem('portfolio:favorites');
      const ids = raw ? (JSON.parse(raw) as string[]) : [];
      let next: string[];
      if (ids.includes(project.id)) {
        next = ids.filter(id => id !== project.id);
      } else {
        next = [...ids, project.id];
      }
      localStorage.setItem('portfolio:favorites', JSON.stringify(next));
      try { window.dispatchEvent(new CustomEvent('portfolio:favorites-updated', { detail: next })); } catch {}
    } catch {}
  };

  // Build sections synchronously from project data (no DOM scan) to avoid late render
  const sections: SectionDef[] = useMemo(() => {
    const defs: SectionDef[] = [
      { id: "overview", label: "Overview" },
      ...(project.role ? [{ id: "role", label: "Role" }] : []),
      ...(project.problem ? [{ id: "problem", label: "Problem" }] : []),
      ...(project.approach ? [{ id: "approach", label: "Approach" }] : []),
      { id: "outcomes", label: "Outcomes" },
      ...(project.challenges ? [{ id: "challenges", label: "Challenges" }] : []),
    ];
    if (project.audioFiles && project.audioFiles.length > 0) defs.push({ id: "ai-samples", label: "Samples" });
    if (project.downloadableAudioFiles && project.downloadableAudioFiles.length > 0) defs.push({ id: "original-tracks", label: "Tracks" });
    if ((project.images && project.images.length > 0) || project.videoPreview) defs.push({ id: "gallery", label: "Gallery" });
    return defs;
  }, [project]);

  // Share functionality
  const shareProject = async () => {
    const shareUrl = window.location.href;
    const shareText = `Check out this project: ${project.name} - ${project.tagline}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.name,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fall back to copy to clipboard
      }
    }
    
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      toast({ title: "Link copied", description: "Share link copied to clipboard" });
    } catch {
      toast({ title: "Copy failed", description: "Couldn't access clipboard. Please copy manually.", variant: "destructive" });
    }
  };

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // No DOM scanning for sections; only listen for scroll to update visibility and active section

  useEffect(() => {
    let ticking = false;
    const calc = () => {
      const doc = document.documentElement;
      const scrollTop = window.pageYOffset || doc.scrollTop || 0;

      // Show scroll to top/back after 300px
      setIsVisible(scrollTop > 300);

      // Active section detection
      let current: string | null = null;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.3 && rect.bottom >= window.innerHeight * 0.3) {
          current = s.id;
          break;
        }
      }
      activeRef.current = current;
      setActiveSection(current);
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calc();
          ticking = false;
        });
        ticking = true;
      }
    };
    // Initial
    calc();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("orientationchange", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("orientationchange", onScroll);
    };
  }, [sections]);


  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Try to derive header height dynamically; fallback to 64 (h-16)
    const header = document.querySelector('header') as HTMLElement | null;
    const siteHeaderHeight = header?.offsetHeight ?? 64;
    const y = el.getBoundingClientRect().top + window.pageYOffset - siteHeaderHeight - 20;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // Removed global copyLink trigger (now handled inline in headings)

  const hasRepo = Boolean(project.repoUrl);
  const hasDemo = Boolean(project.demoUrl);

  // Match header's demo CTA labeling for consistency
  const getDemoCallToAction = (p: Project) => {
    if (p.id === 'cifar-10-cnn') return 'View Slides';
    if (p.id === 'youtube-thumbnails') return 'View Channel';
    if (p.id === 'simplify-me' || p.id === 'vernato' || p.id === 'imdb-top-1000') return 'Try Now';
    if (p.id === 'emty') return 'View Linktree';
    if (p.id === 'album-tracks') return 'All Tracks';
    if (p.demoUrl) return 'View Project';
    return 'View Project';
  };

  // Compute a single project link action to mirror header behavior
  const getProjectLinkAction = () => {
    if (project.id === 'rvc-ui' || project.id === 'album-tracks') {
      return { type: 'scroll' as const, targetId: project.id === 'album-tracks' ? 'original-tracks' : 'ai-samples', aria: project.id === 'album-tracks' ? 'Go to tracks' : 'Go to song covers' };
    }
    if (hasRepo) return { type: 'link' as const, href: project.repoUrl!, aria: 'Open GitHub', icon: 'github' as const };
    if (hasDemo) return { type: 'link' as const, href: project.demoUrl!, aria: 'Open demo', icon: 'external' as const };
    return { type: 'none' as const };
  };

  const projectLinkAction = getProjectLinkAction();

  return (
    <>
      {/* Marker so global UI (like ScrollToTop) can adapt positioning on this page */}
      <div id="project-quick-dock-marker" data-dock-present="true" className="hidden" aria-hidden />

      {/* Desktop left rail: back + favorite/project-link/share */}
      <div className="hidden min-[1536px]:flex fixed left-[max(calc((100vw-80rem)/3.25),8px)] top-[calc(64px+16px)] z-40 flex-col items-center gap-3">
        <Button asChild variant="outline" size="icon" className="w-10 h-10 rounded-full">
          <Link href={dockBackHrefWithParams} aria-label="Back to projects">
            <Icon.Back className="w-4 h-4" />
          </Link>
        </Button>

        <div
          className={cn(
            "bg-background border rounded-full p-1 flex flex-col items-center gap-1 shadow-sm overflow-hidden transform transition-all duration-500 ease-out",
            isVisible
              ? "opacity-100 translate-y-0 max-h-[200px]"
              : "opacity-0 -translate-y-3 max-h-0 pointer-events-none"
          )}
          aria-hidden={!isVisible}
        >
          {/* Favorite */}
          <Button
            variant={favorite ? "default" : "ghost"}
            size="icon"
            className={cn("w-8 h-8 rounded-full", favorite ? "bg-yellow-500 text-white" : "")}
            onClick={toggleFavorite}
            aria-label={favorite ? "Unfavorite" : "Favorite"}
          >
            <Star className={cn("w-4 h-4", favorite ? "fill-white" : "")} />
          </Button>

          {/* Project link (repo/demo/scroll to samples) */}
          {projectLinkAction.type === 'scroll' && (
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full"
              onClick={() => scrollTo(projectLinkAction.targetId)}
              aria-label={projectLinkAction.aria}
            >
              <Music className="w-4 h-4" />
            </Button>
          )}
          {projectLinkAction.type === 'link' && projectLinkAction.icon === 'github' && (
            <Button asChild variant="ghost" size="icon" className="w-8 h-8 rounded-full" aria-label={projectLinkAction.aria}>
              <Link href={projectLinkAction.href!} target="_blank" rel="noopener noreferrer">
                <Icon.Github className="w-4 h-4" />
              </Link>
            </Button>
          )}
          {projectLinkAction.type === 'link' && projectLinkAction.icon === 'external' && (
            <Button asChild variant="ghost" size="icon" className="w-8 h-8 rounded-full" aria-label={projectLinkAction.aria}>
              <Link href={projectLinkAction.href!} target="_blank" rel="noopener noreferrer">
                <Icon.External className="w-4 h-4" />
              </Link>
            </Button>
          )}

          {/* Share */}
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={shareProject} aria-label="Share project">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Desktop right rail: sections navigation (xl+: hug viewport right slightly inset) */}
      <div className="hidden min-[1536px]:flex fixed right-[max(calc((100vw-80rem)/3.1),8px)] top-[calc(64px+16px)] z-40 flex-col items-center gap-3">
        <TooltipProvider>
          <div
            className="bg-background border rounded-full p-1 flex flex-col items-center gap-1 shadow-sm overflow-y-auto no-scrollbar"
            style={{ maxHeight: "calc(100vh - 320px)" }}
            aria-label="Project sections navigation"
          >
            {sections.map((s) => {
              const isActive = activeSection === s.id;
              const IconComp = getSectionIcon(s.id);
              return (
                <Tooltip key={s.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => scrollTo(s.id)}
                      aria-label={`Go to ${s.label}`}
                      className={cn(
                        "relative w-8 h-8 rounded-full transition-colors grid place-items-center shrink-0",
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-foreground md:hover:bg-accent md:hover:text-accent-foreground"
                      )}
                    >
                      <IconComp className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" sideOffset={10}>
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium leading-none">{s.label}</div>
                      <div className="text-xs text-muted-foreground leading-none">{sectionDescriptions[s.id] ?? ''}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>
      {/* Mobile bottom bar with table of contents sheet */}
      <div className="min-[1536px]:hidden fixed bottom-[max(env(safe-area-inset-bottom),16px)] left-0 right-0 z-40 px-4">
        <div className="grid grid-cols-5 items-center justify-items-center gap-3 text-center sm:auto-cols-max sm:grid-cols-none sm:grid-flow-col sm:justify-center sm:gap-4 sm:w-auto sm:mx-auto">
          {/* Col 1: Share (appears after scroll) */}
          <div className="flex flex-col items-center">
            <Button
              size="icon"
              variant="default"
              className={cn(
                "rounded-full w-12 h-12 bg-primary text-primary-foreground shadow-lg transition-opacity duration-300",
                isVisible ? 'opacity-100' : 'opacity-0',
                !isVisible && 'pointer-events-none'
              )}
              onClick={shareProject}
              aria-label="Share project"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <span className={cn("mt-1 text-[10px] font-medium text-foreground/90 hidden sm:inline", isVisible ? 'opacity-100' : 'opacity-0')}>Share</span>
          </div>

          {/* Col 2: Back */}
          <div className="flex flex-col items-center">
            <Button
              asChild
              size="icon"
              variant="default"
              className="rounded-full w-12 h-12 bg-primary text-primary-foreground shadow-lg"
              aria-label="Back to projects"
            >
              <Link href={dockBackHrefWithParams}>
                <Icon.Back className="w-5 h-5" />
              </Link>
            </Button>
            <span className="mt-1 text-[10px] font-medium text-foreground/90 hidden sm:inline">Back</span>
          </div>

          {/* Col 3: Table of Contents Sheet (menu) - Center */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <div className="flex flex-col items-center">
                <Button size="icon" variant="default" className="rounded-full w-14 h-14 bg-primary text-primary-foreground shadow-lg" aria-label="Table of contents">
                  <Menu className="w-6 h-6" />
                </Button>
                <span className="mt-1 text-[10px] font-medium text-foreground/90 hidden sm:inline">Menu</span>
              </div>
            </SheetTrigger>
            <SheetContent
              side={isSmUp ? "right" : "bottom"}
              className={cn(
                "gap-0 p-4 flex flex-col",
                // Keep bottom sheet comfortable height and rounded corners on xs
                !isSmUp && "max-h-[85dvh] rounded-t-2xl"
              )}
            >
              <SheetHeader className="pb-2">
                <SheetTitle>Table of Contents</SheetTitle>
              </SheetHeader>
              {/* Scrollable sections container */}
              <div className="flex-1 overflow-y-auto pb-2 no-scrollbar">
                <div className="flex flex-col gap-2">
                  {sections.map((s) => {
                    const isActive = activeSection === s.id;
                    const IconComp = getSectionIcon(s.id);
                    const copied = copiedBySection[s.id] === true;
                    return (
                      <div
                        key={s.id}
                        onClick={() => {
                          scrollTo(s.id);
                          setIsSheetOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors group",
                          isActive
                            ? "bg-primary text-primary-foreground sm:hover:bg-primary/90"
                            : "bg-muted text-foreground sm:hover:bg-accent sm:hover:text-accent-foreground"
                        )}
                      >
                        <div className="flex items-start gap-3 grow">
                          <IconComp className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium leading-tight">{s.label}</div>
                            <div className={cn(
                              "text-xs leading-tight",
                              isActive ? "text-primary-foreground/80" : "text-muted-foreground sm:group-hover:text-accent-foreground"
                            )}>
                              {sectionDescriptions[s.id] ?? ''}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label={`Copy link to ${s.label}`}
                          className={cn(
                            "ml-2 w-8 h-8 grid place-items-center rounded-full transition-colors",
                            copied
                              ? (isActive ? "bg-emerald-600/90 text-white" : "bg-emerald-100 text-emerald-700")
                              : (isActive ? "bg-primary/40 text-primary-foreground sm:hover:bg-primary/60" : "bg-background text-foreground/80 sm:hover:bg-accent sm:hover:text-accent-foreground")
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            try {
                              const base = new URL(window.location.origin + window.location.pathname);
                              base.hash = s.id;
                              navigator.clipboard.writeText(base.toString());
                              setCopiedBySection((prev) => ({ ...prev, [s.id]: true }));
                              window.setTimeout(() => {
                                setCopiedBySection((prev) => ({ ...prev, [s.id]: false }));
                              }, 1600);
                            } catch {}
                          }}
                        >
                          {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom actions (non-scrollable) - full width equally */}
              <div className="pt-4 border-t">
                <div className={cn("grid gap-2", hasDemo && hasRepo ? "grid-cols-2" : "grid-cols-1")}> 
                  {hasDemo && (
                    <Button asChild variant="default" size="sm" className="w-full bg-primary text-primary-foreground">
                      <Link href={project.demoUrl!} target="_blank" rel="noopener noreferrer">
                        <Icon.External className="w-4 h-4 mr-2" />
                        {getDemoCallToAction(project)}
                      </Link>
                    </Button>
                  )}
                  {hasRepo && (
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={project.repoUrl!} target="_blank" rel="noopener noreferrer">
                        <Icon.External className="w-4 h-4 mr-2" />
                        Repository
                      </Link>
                    </Button>
                  )}
                  {!hasDemo && !hasRepo && project.id === 'rvc-ui' && (
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/projects/album-tracks">
                        <Icon.External className="w-4 h-4 mr-2" />
                        Music Projects
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Col 4: Favorite */}
          <div className="flex flex-col items-center">
            <Button
              size="icon"
              variant={favorite ? "default" : "default"}
              className={cn(
                "rounded-full w-12 h-12 bg-primary text-primary-foreground shadow-lg",
              )}
              aria-label={favorite ? "Unfavorite" : "Favorite"}
              onClick={toggleFavorite}
            >
              <Star className={cn("w-5 h-5", favorite ? "fill-white" : "")} />
            </Button>
            <span className="mt-1 text-[10px] font-medium text-foreground/90 hidden sm:inline">Favorite</span>
          </div>

          {/* Col 5: Scroll to top */}
          <div className="flex flex-col items-center">
            <Button
              size="icon"
              variant="default"
              className={cn(
                "rounded-full w-12 h-12 bg-primary text-primary-foreground shadow-lg transition-opacity duration-300",
                isVisible ? 'opacity-100' : 'opacity-0',
                !isVisible && 'pointer-events-none'
              )}
              onClick={scrollToTop}
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
            <span className={cn("mt-1 text-[10px] font-medium text-foreground/90 hidden sm:inline", isVisible ? 'opacity-100' : 'opacity-0')}>Top</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectQuickDock;
