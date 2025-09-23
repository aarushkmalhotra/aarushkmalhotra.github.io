
"use client";

import { ProjectShare } from "@/components/ProjectShare";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/projects";
import { ArrowLeft, ArrowUpRight, Github, Music } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

interface ProjectHeaderProps {
    project: Project;
}

const getDemoCallToAction = (project: Project) => {
    if (project.id === 'simplify-me' || project.id === 'vernato') {
        return 'Use for Free';
    }
    if (project.id === 'emty') {
        return 'View Linktree';
    }
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
    const headerRef = useRef<HTMLElement>(null);
    const handleScrollToSamples = () => {
        const element = document.getElementById('ai-samples');
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
            className="sticky top-[64px] z-40"
        >
            <div className="max-w-7xl mx-auto px-4 xl:px-0 pt-4">
                <div 
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 max-w-7xl mx-auto rounded-lg border bg-background"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <Button asChild variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                                <Link href="/projects" aria-label="Back to projects">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
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
                        {project.id === 'rvc-ui' && (
                            <Button onClick={handleScrollToSamples} variant="secondary" size="sm">
                                <Music />
                                Song Covers
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
                            <Button asChild variant="secondary" size="sm">
                                <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                    {getDemoCallToAction(project)}
                                    <ArrowUpRight />
                                </Link>
                            </Button>
                        )}
                         <ProjectShare project={project} />
                    </div>
                    <div className="sm:hidden flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-grow">
                             {project.id === 'rvc-ui' && (
                                <Button onClick={handleScrollToSamples} variant="secondary" className="flex-grow">
                                    <Music />
                                    Song Covers
                                </Button>
                            )}
                            {project.repoUrl && (
                                <Button asChild className="flex-grow">
                                    <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                                        <Github />
                                        GitHub
                                    </Link>
                                </Button>
                            )}
                            {project.demoUrl && (
                                <Button asChild variant="secondary" className="flex-grow">
                                    <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                        {getDemoCallToAction(project)}
                                        <ArrowUpRight />
                                    </Link>
                                </Button>
                            )}
                        </div>
                        <div className="flex-shrink-0">
                            <ProjectShare project={project} />
                        </div>
                    </div>
                </div>
            </div>
      </header>
    );
}
