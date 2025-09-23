
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
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface ProjectsClientPageProps {
  allProjects: Project[];
  allKeywords: string[];
}

type SortOption = "newest" | "oldest" | "alphabetical";

export function ProjectsClientPage({ allProjects, allKeywords }: ProjectsClientPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [selectedKeywords, setSelectedKeywords] = useState<Record<string, boolean>>(() => {
    const keywordsParam = searchParams.get('keywords');
    if (!keywordsParam) return {};
    return keywordsParam.split(',').reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
  });
  const [sortOrder, setSortOrder] = useState<SortOption>((searchParams.get('sort') as SortOption) || "newest");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) {
      params.set('search', searchTerm);
    }
    const activeKeywords = Object.keys(selectedKeywords).filter(key => selectedKeywords[key]);
    if (activeKeywords.length > 0) {
      params.set('keywords', activeKeywords.join(','));
    }
    if (sortOrder !== 'newest') {
      params.set('sort', sortOrder);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    
    // Use replace to avoid adding to browser history for every filter change
    router.replace(newUrl, { scroll: false });

  }, [searchTerm, selectedKeywords, sortOrder, pathname, router]);

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
    // Prevent hydration mismatch by rendering a skeleton or nothing on the server.
    return (
       <div>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
                <div className="h-10 w-full bg-muted rounded-md" />
            </div>
            <div className="flex flex-row gap-4">
                <div className="w-1/2 md:w-auto">
                    <div className="h-10 w-full md:w-32 bg-muted rounded-md" />
                </div>
                <div className="w-1/2 md:w-[180px]">
                    <div className="h-10 w-full bg-muted rounded-md" />
                </div>
            </div>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border bg-card rounded-lg p-6 space-y-4">
                    <div className="aspect-video bg-muted rounded-lg" />
                    <div className="h-5 w-3/4 bg-muted rounded" />
                    <div className="h-4 w-1/2 bg-muted rounded" />
                    <div className="h-8 w-full bg-muted rounded" />
                </div>
            ))}
        </div>
      </div>
    );
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

        <div className="flex flex-row gap-4">
          <div className="w-1/2 md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center">
                    Filter
                    {activeFilterCount > 0 && (
                      <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {activeFilterCount}
                      </span>
                    )}
                  </span>
                  <ListFilter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
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
          </div>
          <div className="w-1/2 md:w-[180px]">
            <Select onValueChange={(value: SortOption) => setSortOrder(value)} value={sortOrder}>
              <SelectTrigger className="w-full">
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
