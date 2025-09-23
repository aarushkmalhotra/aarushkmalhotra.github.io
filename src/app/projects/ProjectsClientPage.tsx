
"use client";

import { useState, useMemo, useEffect } from "react";
import type { Project } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ListFilter, Search } from "lucide-react";
import { useSearchParams } from 'next/navigation';

interface ProjectsClientPageProps {
  allProjects: Project[];
  allKeywords: string[];
}

type SortOption = "newest" | "oldest" | "alphabetical";

export function ProjectsClientPage({ allProjects, allKeywords }: ProjectsClientPageProps) {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get('keyword');

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<Record<string, boolean>>({});
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (initialKeyword) {
      setSelectedKeywords({ [initialKeyword]: true });
    }
  }, [initialKeyword]);

  const handleKeywordChange = (keyword: string) => {
    setSelectedKeywords(prev => ({
      ...prev,
      [keyword]: !prev[keyword],
    }));
  };

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = allProjects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.techStack.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by keywords
    const activeKeywords = Object.keys(selectedKeywords).filter(key => selectedKeywords[key]);
    if (activeKeywords.length > 0) {
      filtered = filtered.filter(project =>
        activeKeywords.every(keyword => project.keywords.includes(keyword))
      );
    }

    // Sort
    switch (sortOrder) {
      case "oldest":
        // getProjects already sorts by newest, so we can just reverse
        return [...filtered].reverse();
      case "alphabetical":
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case "newest":
      default:
        return filtered;
    }
  }, [allProjects, searchTerm, selectedKeywords, sortOrder]);
  
  if (!isMounted) {
    // Prevent hydration mismatch by rendering nothing on the server for this client component.
    return null;
  }

  const activeFilterCount = Object.values(selectedKeywords).filter(Boolean).length;

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-1/2 md:w-auto flex-grow sm:flex-grow-0">
                <ListFilter className="mr-2 h-4 w-4" />
                Filter
                {activeFilterCount > 0 && (
                   <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Keyword</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allKeywords.map(keyword => (
                <DropdownMenuCheckboxItem
                  key={keyword}
                  checked={!!selectedKeywords[keyword]}
                  onCheckedChange={() => handleKeywordChange(keyword)}
                >
                  {keyword}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select onValueChange={(value: SortOption) => setSortOrder(value)} value={sortOrder}>
            <SelectTrigger className="w-1/2 md:w-[180px] flex-grow sm:flex-grow-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedProjects.map((project, index) => (
            <div key={project.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-card border rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">No Projects Found</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
                No projects matched your search criteria. Try adjusting your search or filters.
            </p>
        </div>
      )}
    </div>
  );
}
