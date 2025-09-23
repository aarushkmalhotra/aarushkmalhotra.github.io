"use client";

import { useState } from "react";
import { Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { summarizeSkillExperience } from "@/ai/flows/summarize-skill-flow";
import type { Project } from "@/lib/projects";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface SkillClientPageProps {
  skill: string;
  projects: Project[];
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="pt-4 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-full" />
      </div>
  </div>
);

export function SkillClientPage({ skill, projects }: SkillClientPageProps) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const simplyLogo = PlaceHolderImages.find(img => img.id === 'simply-logo');

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
      <Card 
        className="mb-12 overflow-hidden" 
        style={{
            '--simply--primary': '#E76CFE',
            '--simply-bg': 'rgba(231, 108, 254, 0.05)',
            '--simply-border': 'rgba(231, 108, 254, 0.2)',
            '--simply-hover': 'rgba(231, 108, 254, 0.15)'
        } as React.CSSProperties}
      >
        <div 
            className="p-6"
            style={{
                backgroundColor: 'var(--simply-bg)',
                borderBottom: '1px solid var(--simply-border)'
            }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="font-headline text-2xl flex items-center gap-3" style={{color: 'var(--simply--primary)'}}>
                {simplyLogo && (
                    <Image src={simplyLogo.imageUrl} alt="Simply Logo" width={32} height={32} className="rounded-md" />
                )}
              AI-powered with Simply
            </CardTitle>
            <Button 
              onClick={handleGenerateSummary} 
              disabled={isLoading}
              className="w-full sm:w-auto bg-[var(--simply--primary)] text-white hover:bg-opacity-80"
              style={{
                  backgroundColor: 'var(--simply--primary)'
              }}
            >
              {isLoading ? "Generating..." : `Analyze my ${skill} experience`}
            </Button>
          </div>
        </div>
        { (isLoading || summary || error) && (
            <CardContent className="p-6">
                {isLoading && <LoadingSkeleton />}
                {error && <p className="text-destructive">{error}</p>}
                {summary && (
                    <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                        {summary}
                    </div>
                )}
            </CardContent>
        )}
        <CardFooter className="p-4" style={{ backgroundColor: 'var(--simply-bg)', borderTop: '1px solid var(--simply-border)'}}>
            <Link href="https://simplifyme.org/simply/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                Powered by Simply <ExternalLink className="w-3 h-3" />
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
