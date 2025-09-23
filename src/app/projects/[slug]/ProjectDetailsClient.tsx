
"use client";

import { Button } from "@/components/ui/button";
import { Project } from "@/lib/projects";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  project: Project;
};

// For static export, AI functionality is not available.
const isStaticBuild = process.env.NEXT_PUBLIC_OUTPUT_MODE === 'export';

export function ProjectDetailsClient({ project }: Props) {

  if (isStaticBuild) {
    return null;
  }

  const handleGenerate = async () => {
    // In a full-stack environment, you would call your AI flow here.
  };

  return (
    <div className="p-6 rounded-lg bg-card border">
      <h2 className="font-headline text-2xl mb-2">AI-Powered Highlights</h2>
      {(project.id === 'simplify-me' || project.id === 'simply') && (
        <Link href="https://simplifyme.org/simply" target="_blank" rel="noopener noreferrer" className="inline-flex">
          <div className="inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:bg-secondary">
            <Image src="/simplylogo.png" alt="Simply Logo" width={16} height={16} className="rounded-full" />
            Powered by Simply
          </div>
        </Link>
      )}

      <div className="mt-4">
          <Button onClick={handleGenerate} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <Sparkles className="w-4 h-4 mr-2"/>
              Generate with AI
          </Button>
      </div>
    </div>
  );
}
