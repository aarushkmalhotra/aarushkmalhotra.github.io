"use client";

import { ProjectShare } from "@/components/ProjectShare";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/projects";
import { YoutubeIcon } from "@/components/icons/YoutubeIcon";
import { ArrowUpRight, Github, Music, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

interface ProjectHeaderProps {
    project: Project;
}

const getDemoCallToAction = (project: Project) => {
    if (project.id === 'cifar-10-cnn') {
      return 'View Slides';
    }
    if (project.id === 'youtube-thumbnails') {
        return 'View Channel';
    }
    if (project.id === 'simplify-me' || project.id === 'vernato' || project.id === 'imdb-top-1000') {
        return 'Try Now';
    }
    if (project.id === 'emty') {
        return 'View Linktree';
    }
    if (project.id === 'album-tracks') {
        return 'All Tracks';
    }
    // A sensible fallback
    if (project.demoUrl) {
        return 'View Project';
    }
}

const getDemoIcon = (project: Project) => {
    if (project.id === 'youtube-thumbnails') {
        return <YoutubeIcon />;
    }
    return <ArrowUpRight />;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
    const headerRef = useRef<HTMLElement>(null);
    const searchParams = useSearchParams();
    const [isFavorite, setIsFavorite] = useState(false);

    const formatRange = (start: string, end: string | null) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const format = (s: string) => {
            const [y, m] = s.split('-');
            const mi = Math.max(1, Math.min(12, parseInt(m, 10))) - 1;
            return `${months[mi]} ${y}`;
        };
        const startStr = format(start);
        const endStr = end ? format(end) : 'Present';
        return `${startStr} — ${endStr}`;
    };

    // Hydrate favorite state for this project
    useEffect(() => {
        try {
            const raw = localStorage.getItem('portfolio:favorites');
            const ids = raw ? (JSON.parse(raw) as string[]) : [];
            setIsFavorite(ids.includes(project.id));
        } catch {}
    }, [project.id]);

    // React to favorites updates elsewhere
    useEffect(() => {
        const handler = (e: Event) => {
            try {
                const custom = e as CustomEvent<string[]>;
                const list = custom.detail ?? JSON.parse(localStorage.getItem('portfolio:favorites') || '[]');
                setIsFavorite(Array.isArray(list) && list.includes(project.id));
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
                setIsFavorite(false);
            } else {
                next = [...ids, project.id];
                setIsFavorite(true);
            }
            localStorage.setItem('portfolio:favorites', JSON.stringify(next));
            try { window.dispatchEvent(new CustomEvent('portfolio:favorites-updated', { detail: next })); } catch {}
        } catch {}
    };
    
    const handleScrollToSamples = () => {
        let elementId = 'ai-samples';
        if (project.id === 'album-tracks') {
            elementId = 'original-tracks';
        }

        const element = document.getElementById(elementId);
        if (element && headerRef.current) {
            // Main site header is 64px (h-16)
            const siteHeaderHeight = 64; 
            // Use same offset calculation as quick dock for consistency
            const offset = siteHeaderHeight + 20;

            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };
    
    return (
        <header 
            ref={headerRef}
            className="relative z-40"
        >
            <div className="max-w-7xl mx-auto px-4 pt-4">
                <div 
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border bg-background"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex-grow">
                                                        <h1 
                                                                className="font-headline font-bold tracking-tight text-xl sm:text-2xl flex items-center gap-2"
                                style={{ 
                                    color: 'hsl(var(--project-primary))'
                                }}
                            >
                                                                {project.name}
                            </h1>
                            <p 
                                className="text-muted-foreground text-sm max-w-3xl mt-1"
                            >
                                {project.tagline}
                            </p>
                            <div className="mt-1 text-xs text-muted-foreground inline-flex items-center gap-1 lg:hidden">
                                <CalendarDays className="h-3.5 w-3.5" />
                                <span>{formatRange(project.startDate, project.endDate)}</span>
                            </div>
                        </div>
                    </div>
                                        <div className="hidden sm:flex flex-shrink-0 items-center gap-2">
                                                <Button onClick={toggleFavorite} variant="outline" size="sm" aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill={isFavorite ? "currentColor" : "none"}
                                                            stroke="currentColor"
                                                            className={`h-4 w-4 ${isFavorite ? 'text-yellow-400' : ''}`}
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1.5}
                                                                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.062 4.178a.563.563 0 0 0 .424.308l4.61.67c.513.074.718.706.346 1.067l-3.334 3.25a.563.563 0 0 0-.162.498l.786 4.587a.562.562 0 0 1-.815.592l-4.121-2.167a.563.563 0 0 0-.523 0l-4.12 2.167a.562.562 0 0 1-.816-.592l.787-4.587a.563.563 0 0 0-.163-.498L3.04 9.722a.562.562 0 0 1 .346-1.067l4.61-.67a.563.563 0 0 0 .424-.308l2.06-4.178Z"
                                                            />
                                                        </svg>
                                                </Button>
                        {(project.id === 'rvc-ui' || project.id === 'album-tracks') && (
                            <Button onClick={handleScrollToSamples} variant="secondary" size="sm">
                                <Music />
                                {project.id === 'rvc-ui' ? 'Song Covers' : 'Original Tracks'}
                            </Button>
                        )}
                        {project.repoUrl && (
                            <Button asChild size="sm">
                                <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                                    <Github />
                                    GitHub
                                </Link>
                            </Button>
                        )}
                        {project.demoUrl && (
                            <Button asChild variant="secondary" size="sm" className="w-full">
                                <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                    {getDemoCallToAction(project)}
                                    {getDemoIcon(project)}
                                </Link>
                            </Button>
                        )}
                        {/* Share in desktop header */}
                        <ProjectShare project={project} />
                    </div>
                                        <div className="sm:hidden flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-2 w-full">
                                                        <Button onClick={toggleFavorite} variant="outline" size="sm" aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    fill={isFavorite ? "currentColor" : "none"}
                                                                    stroke="currentColor"
                                                                    className={`h-4 w-4 ${isFavorite ? 'text-yellow-400' : ''}`}
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={1.5}
                                                                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.062 4.178a.563.563 0 0 0 .424.308l4.61.67c.513.074.718.706.346 1.067l-3.334 3.25a.563.563 0 0 0-.162.498l.786 4.587a.562.562 0 0 1-.815.592l-4.121-2.167a.563.563 0 0 0-.523 0l-4.12 2.167a.562.562 0 0 1-.816-.592l.787-4.587a.563.563 0 0 0-.163-.498L3.04 9.722a.562.562 0 0 1 .346-1.067l4.61-.67a.563.563 0 0 0 .424-.308l2.06-4.178Z"
                                                                    />
                                                                </svg>
                                                        </Button>
                             {(project.id === 'rvc-ui' || project.id === 'album-tracks') && (
                                <Button onClick={handleScrollToSamples} variant="secondary" size="sm" className="flex-1">
                                    <Music />
                                     {project.id === 'rvc-ui' ? 'Song Covers' : 'Original Tracks'}
                                </Button>
                            )}
                            {project.repoUrl && (
                                <Button asChild size="sm" className="flex-1">
                                    <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                                        <Github />
                                        GitHub
                                    </Link>
                                </Button>
                            )}
                            {project.demoUrl && project.id !== 'album-tracks' && (
                                <Button asChild variant="secondary" size="sm" className="flex-1">
                                    <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                        {getDemoCallToAction(project)}
                                        {getDemoIcon(project)}
                                    </Link>
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <ProjectShare project={project} />
                        </div>
                    </div>
                </div>
            </div>
      </header>
    );
}
