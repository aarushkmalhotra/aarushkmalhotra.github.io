"use client";

import { ProjectShare } from "@/components/ProjectShare";
import { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ProjectHeaderProps {
    project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={cn(
            "sticky top-[64px] z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b transition-all duration-300",
            isScrolled ? "py-3" : "py-8"
        )}>
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="flex-grow">
                    <h1 
                        className={cn(
                            "font-headline font-bold tracking-tight transition-all duration-300",
                            isScrolled ? "text-2xl" : "text-4xl md:text-5xl"
                        )}
                        style={{ color: 'hsl(var(--project-primary))' }}
                    >
                        {project.name}
                    </h1>
                    <p className={cn(
                        "text-muted-foreground max-w-3xl transition-all duration-300",
                         isScrolled ? "text-sm mt-1" : "mt-3 text-lg md:text-xl"
                    )}>
                        {project.tagline}
                    </p>
                </div>
                <div className="flex-shrink-0 ml-6">
                     <ProjectShare project={project} />
                </div>
            </div>
      </header>
    );
}
