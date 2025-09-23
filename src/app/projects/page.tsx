
import { getProjects } from "@/lib/projects";
import { Metadata } from "next";
import { ProjectsClientPage } from "./ProjectsClientPage";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Projects – Aarush's Portfolio",
  description: "A collection of projects I've built. Each one represents a unique challenge and a story of creative problem-solving.",
};

// Helper function to extract all unique keywords
const getAllKeywords = (projects: any[]): string[] => {
  const keywordSet = new Set<string>();
  projects.forEach(project => {
    if (project.keywords) {
      project.keywords.forEach((keyword: string) => keywordSet.add(keyword));
    }
  });
  return Array.from(keywordSet).sort();
};

function ProjectsPageContent() {
  // This is a server component, so we can fetch data here
  const allProjects = getProjects();
  const allKeywords = getAllKeywords(allProjects);

  // We then pass this data to the client component
  return <ProjectsClientPage allProjects={allProjects} allKeywords={allKeywords} />;
}

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">My Work</h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
          Here's a collection of projects I've built. Each one represents a unique challenge and a story of creative problem-solving.
        </p>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <ProjectsPageContent />
      </Suspense>
    </div>
  );
}
