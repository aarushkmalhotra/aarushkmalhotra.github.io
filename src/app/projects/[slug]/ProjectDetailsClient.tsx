
"use client";

import { generateProjectHighlights, GenerateProjectHighlightsOutput } from "@/ai/flows/generate-project-highlights";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/projects";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  project: Project;
};

export function ProjectDetailsClient({ project }: Props) {
  const [highlights, setHighlights] = useState<GenerateProjectHighlightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setHighlights(null);
    try {
      const result = await generateProjectHighlights({
        projectName: project.name,
        techStack: project.techStack,
        features: project.description, // Using description as features for simplicity
        outcomes: project.outcomes,
      });
      setHighlights(result);
    } catch (e) {
      setError("Failed to generate highlights. Please try again.");
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 rounded-lg bg-card border">
      <div className="flex flex-col sm:flex-row flex-wrap justify-between sm:items-center gap-4">
        <div className="flex-grow">
          <h2 className="font-headline text-2xl mb-2">AI-Powered Highlights</h2>
          <Link href="https://simplifyme.org/meet-simply" target="_blank" rel="noopener noreferrer" className="inline-flex">
            <div className="inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:bg-secondary">
              <Image src="/simplylogo.png" alt="Simply Logo" width={16} height={16} className="rounded-full" />
              Powered by Simply
            </div>
          </Link>
        </div>
        <Button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white">
          <Sparkles className="w-4 h-4 mr-2"/>
          {isLoading ? "Generating..." : "Generate with AI"}
        </Button>
      </div>

      {isLoading && <p className="mt-4 text-muted-foreground">Analyzing project data...</p>}
      {error && <p className="mt-4 text-destructive">{error}</p>}
      {highlights && (
        <div className="mt-4 prose dark:prose-invert max-w-none">
            <p className="text-lg">{highlights.highlights}</p>
        </div>
      )}
    </div>
  );
}
