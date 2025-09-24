"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link as LinkIcon, Music } from "lucide-react";
import { XIcon } from "@/components/icons/XIcon";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";

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
} as const;

const getSectionIcon = (id: string) => {
  switch (id) {
    case "overview":
      return SectionIcons.overview;
    case "outcomes":
      return SectionIcons.outcomes;
    case "ai-samples":
    case "original-tracks":
      return SectionIcons.audio;
    case "gallery":
      return SectionIcons.gallery;
    default:
      return SectionIcons.overview;
  }
};

export function ProjectQuickDock({ project, backHref }: ProjectQuickDockProps) {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const activeRef = useRef<string | null>(null);
  const dockBackHref = backHref || "/projects";

  // Build sections synchronously from project data (no DOM scan) to avoid late render
  const sections: SectionDef[] = useMemo(() => {
    const defs: SectionDef[] = [
      { id: "overview", label: "Overview" },
      { id: "outcomes", label: "Outcomes" },
    ];
    if (project.audioFiles && project.audioFiles.length > 0) defs.push({ id: "ai-samples", label: "Samples" });
    if (project.downloadableAudioFiles && project.downloadableAudioFiles.length > 0) defs.push({ id: "original-tracks", label: "Tracks" });
    if ((project.images && project.images.length > 0) || project.videoPreview) defs.push({ id: "gallery", label: "Gallery" });
    return defs;
  }, [project]);

  // No DOM scanning for sections; only listen for scroll to update active and progress

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, p)));

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
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  const progressCircle = useMemo(() => {
    const size = 44;
    const stroke = 4;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    return { size, stroke, radius, circumference, offset };
  }, [progress]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Try to derive header height dynamically; fallback to 64 (h-16)
    const header = document.querySelector('header') as HTMLElement | null;
    const siteHeaderHeight = header?.offsetHeight ?? 64;
    const y = el.getBoundingClientRect().top + window.pageYOffset - siteHeaderHeight - 20;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const copyLink = (sectionId?: string) => {
    const url = new URL(window.location.href);
    if (sectionId) url.hash = sectionId;
    navigator.clipboard.writeText(url.toString());
    // Prefer friendly label for the toast description
    const sectionLabel = sectionId ? sections.find((s) => s.id === sectionId)?.label : undefined;
    const pretty = (id: string) => id.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    toast({
      title: "Link copied",
      description: sectionId ? `Jump to ${sectionLabel ?? pretty(sectionId)}` : "Page URL copied",
    });
  };

  const hasRepo = Boolean(project.repoUrl);
  const hasDemo = Boolean(project.demoUrl);
  const SITE_ORIGIN = "https://aarushkmalhotra.github.io";
  const defaultProjectUrl = `${SITE_ORIGIN}/projects/${project.id}`;
  const shareUrl = (project.id === 'album-tracks' && project.demoUrl) ? project.demoUrl : defaultProjectUrl;
  const shareText = (project.id === 'album-tracks')
    ? `Check out these original tracks by Aarush Kumar:`
    : `Check out this project: ${project.name} - ${project.tagline}`;
  const twitterShareUrl = shareUrl ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` : "";
  const linkedinShareUrl = shareUrl ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` : "";

  return (
    <>
      {/* Marker so global UI (like ScrollToTop) can adapt positioning on this page */}
      <div id="project-quick-dock-marker" data-dock-present="true" className="hidden" aria-hidden />
      {/* Desktop/right rail */}
  <div className="hidden xl:flex fixed right-4 top-[calc(64px+16px)] z-40 flex-col items-center gap-3">
        <div className="relative">
          <svg width={progressCircle.size} height={progressCircle.size} className="rotate-[-90deg]">
            <circle cx={progressCircle.size / 2} cy={progressCircle.size / 2} r={progressCircle.radius} stroke="hsl(var(--muted-foreground))" strokeWidth={progressCircle.stroke} fill="none" opacity={0.25} />
            <circle cx={progressCircle.size / 2} cy={progressCircle.size / 2} r={progressCircle.radius} stroke="hsl(var(--project-primary))" strokeWidth={progressCircle.stroke} fill="none" strokeDasharray={progressCircle.circumference} strokeDashoffset={progressCircle.offset} strokeLinecap="round" />
          </svg>
          <Button asChild variant="outline" size="icon" className="absolute inset-0 m-auto w-10 h-10 rounded-full">
            <Link href={dockBackHref} aria-label="Back to projects">
              <Icon.Back className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="bg-background border rounded-full p-1 flex flex-col items-center gap-1 shadow-sm">
          {sections.map((s) => {
            const isActive = activeRef.current === s.id;
            const IconComp = getSectionIcon(s.id);
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                aria-label={`Go to ${s.label}`}
                className={cn(
                  "relative w-8 h-8 rounded-full transition-colors grid place-items-center",
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted text-foreground md:hover:bg-accent md:hover:text-accent-foreground"
                )}
                title={s.label}
              >
                <IconComp className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        <div className="bg-background border rounded-full p-1 flex flex-col items-center gap-1 shadow-sm">
          {hasRepo && (
            <Button asChild variant="ghost" size="icon" className="w-8 h-8 rounded-full" aria-label="Open GitHub">
              <Link href={project.repoUrl!} target="_blank" rel="noopener noreferrer">
                <Icon.Github className="w-4 h-4" />
              </Link>
            </Button>
          )}
          {hasDemo && (
            <Button asChild variant="ghost" size="icon" className="w-8 h-8 rounded-full" aria-label="Open demo">
              <Link href={project.demoUrl!} target="_blank" rel="noopener noreferrer">
                <Icon.External className="w-4 h-4" />
              </Link>
            </Button>
          )}
          {shareUrl && (
            <Button asChild variant="ghost" size="icon" className="w-8 h-8 rounded-full" aria-label="Share on X">
              <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
                <XIcon className="w-4 h-4" />
              </a>
            </Button>
          )}
          {shareUrl && (
            <Button asChild variant="ghost" size="icon" className="w-8 h-8 rounded-full" aria-label="Share on LinkedIn">
              <a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={() => copyLink(activeRef.current ?? undefined)} aria-label="Copy link to section">
            <LinkIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

  {/* Mobile bottom bar */}
  <div className="xl:hidden fixed bottom-[max(env(safe-area-inset-bottom),16px)] left-1/2 -translate-x-1/2 z-40 w-[96%]">
        <div className="bg-background border rounded-2xl shadow-lg p-2 flex items-center justify-between gap-2">
          <Button asChild size="icon" variant="outline" className="shrink-0">
            <Link href={dockBackHref} aria-label="Back to projects">
              <Icon.Back className="w-4 h-4" />
            </Link>
          </Button>
          <div className="flex-1 overflow-hidden">
            <div
              className="grid gap-1 px-1"
              style={{ gridTemplateColumns: `repeat(${Math.max(1, sections.length)}, minmax(0, 1fr))` }}
            >
              {sections.map((s) => {
                const isActive = activeRef.current === s.id;
                const IconComp = getSectionIcon(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    aria-label={`Go to ${s.label}`}
                    className={cn(
                      "h-10 w-full rounded-full text-sm inline-flex items-center justify-center gap-2 transition-colors",
                      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-foreground md:hover:bg-accent md:hover:text-accent-foreground"
                    )}
                    title={s.label}
                  >
                    <IconComp className="w-4 h-4" />
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {hasRepo && (
              <Button asChild size="icon" variant="ghost" className="rounded-full" aria-label="Open GitHub">
                <Link href={project.repoUrl!} target="_blank" rel="noopener noreferrer">
                  <Icon.Github className="w-5 h-5" />
                </Link>
              </Button>
            )}
            {hasDemo && (
              <Button asChild size="icon" variant="ghost" className="rounded-full" aria-label="Open demo">
                <Link href={project.demoUrl!} target="_blank" rel="noopener noreferrer">
                  <Icon.External className="w-5 h-5" />
                </Link>
              </Button>
            )}
            <Button size="icon" variant="ghost" className="rounded-full" aria-label="Copy link" onClick={() => copyLink(activeRef.current ?? undefined)}>
              <LinkIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectQuickDock;
