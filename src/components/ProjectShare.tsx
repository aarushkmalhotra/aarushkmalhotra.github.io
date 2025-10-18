
"use client";

import { Project } from "@/lib/projects";
import { Button } from "./ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectShareProps {
    project: Project;
}

export function ProjectShare({ project }: ProjectShareProps) {
    const { toast } = useToast();

    const shareProject = async () => {
        const shareUrl = window.location.href;
        const shareText = `Check out this project: ${project.name} - ${project.tagline}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: project.name,
                    text: shareText,
                    url: shareUrl,
                });
                return;
            } catch (err) {
                // Fall back to copy to clipboard
            }
        }

        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
            toast({ title: "Link copied", description: "Share link copied to clipboard" });
        } catch {
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={shareProject} aria-label="Share project">
                <Share2 className="w-4 h-4" />
            </Button>
        </div>
    );
}
