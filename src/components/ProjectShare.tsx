
"use client";

import { Project } from "@/lib/projects";
import { Button } from "./ui/button";
import { Linkedin } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { XIcon } from "./icons/XIcon";

interface ProjectShareProps {
    project: Project;
}

export function ProjectShare({ project }: ProjectShareProps) {
    const pathname = usePathname();
    const [pageUrl, setPageUrl] = useState("");

    useEffect(() => {
        setPageUrl(window.location.origin + pathname);
    }, [pathname]);

    if(!pageUrl) return null;

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
                    <Linkedin className="w-4 h-4" />
                </a>
            </Button>
        </div>
    );
}
