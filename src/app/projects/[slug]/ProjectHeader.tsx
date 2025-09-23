
"use client";

import { ProjectShare } from "@/components/ProjectShare";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/projects";
import { YoutubeIcon } from "@/components/icons/YoutubeIcon";
import Link from "next/link";
import { useRef } from "react";

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
        return 'View Demo';
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

// Inline SVG icons to avoid external icon packs
const Icon = {
    Back: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
            <path d="M15 18l-6-6 6-6" />
        </svg>
    ),
    Arrow: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
        </svg>
    ),
    Github: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
            <path d="M12 .5a12 12 0 00-3.79 23.39c.6.11.82-.26.82-.58 0-.29-.01-1.06-.02-2.07-3.34.73-4.04-1.61-4.04-1.61-.54-1.39-1.32-1.76-1.32-1.76-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.77-1.6-2.67-.3-5.47-1.34-5.47-5.97 0-1.32.47-2.39 1.23-3.23-.12-.3-.53-1.52.12-3.17 0 0 1.01-.32 3.31 1.23a11.5 11.5 0 016.02 0c2.3-1.55 3.31-1.23 3.31-1.23.65 1.65.24 2.87.12 3.17.76.84 1.23 1.91 1.23 3.23 0 4.64-2.8 5.66-5.48 5.96.43.37.82 1.1.82 2.22 0 1.6-.02 2.89-.02 3.29 0 .32.21.69.83.57A12 12 0 0012 .5z" />
        </svg>
    ),
    Music: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
        </svg>
    )
};

const getDemoIcon = (project: Project) => {
    if (project.id === 'youtube-thumbnails') {
        return <YoutubeIcon />;
    }
    return <Icon.Arrow />;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
    const headerRef = useRef<HTMLElement>(null);
    
    const handleScrollToSamples = () => {
        let elementId = 'ai-samples';
        if (project.id === 'album-tracks') {
            elementId = 'original-tracks';
        }

        const element = document.getElementById(elementId);
        if (element && headerRef.current) {
            // Main site header is 64px (h-16)
            const siteHeaderHeight = 64; 
            // This project header's height
            const projectHeaderHeight = headerRef.current.offsetHeight;
            const offset = siteHeaderHeight + projectHeaderHeight + 20;

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
            className="z-30"
        >
            <div className="max-w-7xl mx-auto px-4 xl:px-0 pt-4">
                <div 
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border bg-background"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex-grow">
                            <h1 
                                className="font-headline font-bold tracking-tight text-xl sm:text-2xl"
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
                        </div>
                    </div>
                    <div className="hidden sm:flex flex-shrink-0 items-center gap-2">
                        {(project.id === 'rvc-ui' || project.id === 'album-tracks') && (
                            <Button onClick={handleScrollToSamples} variant="secondary" size="sm">
                                <Icon.Music className="w-4 h-4" />
                                {project.id === 'rvc-ui' ? 'Song Covers' : 'Original Tracks'}
                            </Button>
                        )}
                        {project.repoUrl && (
                            <Button asChild size="sm">
                                <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                                    <Icon.Github className="w-4 h-4" />
                                    GitHub
                                </Link>
                            </Button>
                        )}
                        {project.demoUrl && (
                            <Button asChild variant="secondary" size="sm">
                                <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                    {getDemoCallToAction(project)}
                                    {getDemoIcon(project)}
                                </Link>
                            </Button>
                        )}
                         <ProjectShare project={project} />
                    </div>
                    <div className="sm:hidden flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-2 flex-shrink-0">
                             {(project.id === 'rvc-ui' || project.id === 'album-tracks') && (
                                <Button onClick={handleScrollToSamples} variant="secondary" size="sm">
                                    <Icon.Music className="w-4 h-4" />
                                     {project.id === 'rvc-ui' ? 'Song Covers' : 'Original Tracks'}
                                </Button>
                            )}
                            {project.repoUrl && (
                                <Button asChild size="sm">
                                    <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                                        <Icon.Github className="w-4 h-4" />
                                        GitHub
                                    </Link>
                                </Button>
                            )}
                            {project.demoUrl && project.id !== 'album-tracks' && (
                                <Button asChild variant="secondary" size="sm">
                                    <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                        {getDemoCallToAction(project)}
                                        {getDemoIcon(project)}
                                    </Link>
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                            <ProjectShare project={project} />
                        </div>
                    </div>
                </div>
            </div>
      </header>
    );
}
