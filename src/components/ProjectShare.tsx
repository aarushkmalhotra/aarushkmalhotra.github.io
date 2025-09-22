
"use client";

import { Project } from "@/lib/projects";
import { Button } from "./ui/button";
import { Twitter, Linkedin } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface ProjectShareProps {
    project: Project;
}

export function ProjectShare({ project }: ProjectShareProps) {
    const pathname = usePathname();
    const [pageUrl, setPageUrl] = useState("");

    useEffect(() => {
        setPageUrl(window.location.href);
    }, [pathname]);

    if(!pageUrl) return null;

    const shareText = `Check out this project: ${project.name} - ${project.tagline}`;

    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
    const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;

    return (
        <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="icon">
                <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
                    <Twitter className="w-4 h-4" />
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
