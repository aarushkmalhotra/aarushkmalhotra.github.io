
"use client";

import { Button } from "@/components/ui/button";
import { Project } from "@/lib/projects";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type Props = {
  project: Project;
};

// For static export, AI functionality is not available.
// We check this to disable the button, but still render the component.
const isStaticBuild = process.env.NODE_ENV === 'production';

export function ProjectDetailsClient({ project }: Props) {
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (isStaticBuild) {
        toast({
            title: "Feature Not Available",
            description: "AI features require a server and are not available on this statically hosted site.",
            variant: "destructive"
        })
    }
    // In a full-stack environment, you would call your AI flow here.
  };

  return (
    <div className="p-6 rounded-lg bg-card border">
      <div className="flex flex-col sm:flex-row flex-wrap justify-between sm:items-center gap-4">
        <div className="flex-grow">
          <h2 className="font-headline text-2xl mb-2">AI-Powered Highlights</h2>
          {(project.id === 'simplify-me' || project.id === 'simply') && (
            <Link href="https://simplifyme.org/simply" target="_blank" rel="noopener noreferrer" className="inline-flex">
              <div className="inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:bg-secondary">
                <Image src="/simplylogo.png" alt="Simply Logo" width={16} height={16} className="rounded-full" />
                Powered by Simply
              </div>
            </Link>
          )}
        </div>
        <Button onClick={handleGenerate} disabled={isStaticBuild} className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed">
          <Sparkles className="w-4 h-4 mr-2"/>
          {isStaticBuild ? "Disabled for Static Site" : "Generate with AI"}
        </Button>
      </div>

      {isStaticBuild && (
        <p className="mt-4 text-xs text-muted-foreground">
          AI generation requires a server and is disabled on this statically hosted portfolio.
        </p>
      )}
    </div>
  );
}
