"use client";

import { generateProjectHighlights, GenerateProjectHighlightsOutput } from "@/ai/flows/generate-project-highlights";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/projects";
import { useState } from "react";

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
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="font-headline text-2xl">AI-Powered Highlights</h2>
        <Button onClick={handleGenerate} disabled={isLoading} style={{ backgroundColor: 'hsl(var(--project-primary))' }}>
          {isLoading ? "Generating..." : "✨ Generate with AI"}
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
