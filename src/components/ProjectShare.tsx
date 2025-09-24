
"use client";

import { Project } from "@/lib/projects";
import { Button } from "./ui/button";
import { LinkedinIcon } from "./icons/LinkedinIcon";
import { usePathname } from "next/navigation";
import { XIcon } from "./icons/XIcon";

interface ProjectShareProps {
    project: Project;
}

export function ProjectShare({ project }: ProjectShareProps) {
    const pathname = usePathname();
    const SITE_ORIGIN = "https://aarushkmalhotra.github.io";
    const pageUrl = `${SITE_ORIGIN}${pathname}`;

    let shareUrl: string;
    let shareText: string;

    if (project.id === 'album-tracks' && project.demoUrl) {
        shareUrl = project.demoUrl;
        shareText = `Check out these original tracks by Aarush Kumar:`;
    } else {
        shareUrl = pageUrl;
        shareText = `Check out this project: ${project.name} - ${project.tagline}`;
    }

    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

    return (
        <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="icon">
                <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
                    <XIcon className="w-4 h-4" />
                </a>
            </Button>
            <Button asChild variant="outline" size="icon">
                <a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
                    <LinkedinIcon className="w-4 h-4" />
                </a>
            </Button>
        </div>
    );
}
