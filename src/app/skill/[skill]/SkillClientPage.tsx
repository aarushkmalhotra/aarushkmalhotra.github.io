"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { summarizeSkillExperience } from "@/ai/flows/summarize-skill-flow";
import type { Project } from "@/lib/projects";

interface SkillClientPageProps {
  skill: string;
  projects: Project[];
}

export function SkillClientPage({ skill, projects }: SkillClientPageProps) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError(null);
    setSummary("");

    try {
      // We only need to pass the relevant fields to the AI flow.
      const projectsForAI = projects.map(p => ({
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        techStack: p.techStack,
        outcomes: p.outcomes,
      }));

      const result = await summarizeSkillExperience({ skill, projects: projectsForAI });
      setSummary(result);

    } catch (e) {
      console.error("Error generating summary:", e);
      setError("Sorry, the AI summary could not be generated at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Card className="mb-12 border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              AI-Powered Skill Summary
            </CardTitle>
            <Button 
              onClick={handleGenerateSummary} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Generating..." : `Analyze my ${skill} experience`}
            </Button>
          </div>
        </CardHeader>
        { (isLoading || summary || error) && (
            <CardContent>
                {isLoading && <p className="text-muted-foreground animate-pulse">The AI is analyzing the projects...</p>}
                {error && <p className="text-destructive">{error}</p>}
                {summary && (
                    <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                        {summary}
                    </div>
                )}
            </CardContent>
        )}
      </Card>
    </div>
  );
}
