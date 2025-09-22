
"use client";

import { ProjectShare } from "@/components/ProjectShare";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/projects";
import { ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    return 'Live Demo';
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
    const [scrolled, setScrolled] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Animate between 0 and 1 based on scroll position up to 100px
    const animationProgress = Math.max(0, Math.min(scrolled / 100, 1));

    return (
        <header 
            className="sticky top-[64px] z-40 border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80"
            style={{ 
                // py-8 (32px) -> py-3 (12px)
                paddingTop: `${32 - (20 * animationProgress)}px`,
                paddingBottom: `${32 - (20 * animationProgress)}px`,
                transition: 'padding 0.2s ease-out',
            }}
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-grow">
                        <h1 
                            className="font-headline font-bold tracking-tight"
                            style={{ 
                                // text-4xl/5xl -> text-2xl
                                fontSize: `${(2.25 - 0.75 * animationProgress)}rem`,
                                lineHeight: `${(2.5 - 0.75 * animationProgress)}rem`,
                                transition: 'font-size 0.2s ease-out, line-height 0.2s ease-out',
                                color: 'hsl(var(--project-primary))'
                            }}
                        >
                            {project.name}
                        </h1>
                        <p 
                            className="text-muted-foreground max-w-3xl"
                            style={{
                                // text-lg/xl -> text-sm
                                fontSize: `${(1.125 - 0.25 * animationProgress)}rem`,
                                lineHeight: `${(1.75 - 0.5 * animationProgress)}rem`,
                                marginTop: `${12 - (8 * animationProgress)}px`,
                                transition: 'font-size 0.2s ease-out, line-height 0.2s ease-out, margin-top 0.2s ease-out',
                            }}
                        >
                            {project.tagline}
                        </p>
                    </div>
                    <div className="flex-shrink-0 hidden sm:flex items-center gap-2">
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
                </div>
                 <div className="sm:hidden flex items-center justify-between gap-4 mt-4">
                    <div className="flex items-center gap-2 flex-grow">
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
      </header>
    );
}
