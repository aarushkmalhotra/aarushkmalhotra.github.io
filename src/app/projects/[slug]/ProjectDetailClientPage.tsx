"use client";

import { useMemo } from "react";
import { Project, getProjectNeighbors } from "@/lib/projects";
import { ProjectNavigation } from "./ProjectNavigation";
import { useSearchParams } from 'next/navigation';

type SortOption = "newest" | "oldest" | "alphabetical";

interface ProjectDetailClientPageProps {
  project: Project;
  allProjects: Project[];
}

export function ProjectDetailClientPage({
  project,
  allProjects,
}: ProjectDetailClientPageProps) {
  const searchParams = useSearchParams();

  const searchTerm = (searchParams?.get('search') as string) || "";
  const keywordsParam = (searchParams?.get('keywords') as string) || "";
  const sortOrder = (searchParams?.get('sort') as SortOption) || "newest";

  const { prevProject, nextProject } = useMemo(() => {
    let filtered = allProjects;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.techStack.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const activeKeywords = keywordsParam ? keywordsParam.split(",") : [];
    if (activeKeywords.length > 0) {
      filtered = filtered.filter((p) =>
        activeKeywords.every((keyword) => p.keywords.includes(keyword))
      );
    }

    switch (sortOrder) {
      case "oldest":
        filtered = [...filtered].reverse();
        break;
      case "alphabetical":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        break;
    }

    return getProjectNeighbors(project.id, filtered);
  }, [project.id, allProjects, searchTerm, keywordsParam, sortOrder]);

  return (
    <>
      {(prevProject || nextProject) && (
        <div className="mt-16 md:mt-24 border-t pt-12">
          <h2 className="font-headline text-2xl md:text-3xl text-center mb-8">
            Continue Exploring
          </h2>
          <ProjectNavigation
            prevProject={prevProject}
            nextProject={nextProject}
            searchParams={searchParams}
          />
        </div>
      )}
    </>
  );
}
