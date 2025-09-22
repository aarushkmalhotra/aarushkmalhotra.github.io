
"use client";

import { ProjectShare } from "@/components/ProjectShare";
import { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ProjectHeaderProps {
    project: Project;
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
    const animationProgress = Math.min(scrolled / 100, 1);

    return (
        <header 
            className="sticky top-[64px] z-40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border-b"
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
                    <div className="flex-shrink-0">
                         <ProjectShare project={project} />
                    </div>
                </div>
            </div>
      </header>
    );
}
