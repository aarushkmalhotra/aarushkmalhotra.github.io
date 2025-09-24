"use client";

import { useState, useMemo, useEffect } from "react";
import type { Project } from "@/lib/projects";
import { getProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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

// Helper function to extract all unique keywords
const getAllKeywords = (projects: Project[]): string[] => {
  const keywordSet = new Set<string>();
  projects.forEach(project => {
    if (project.keywords) {
      project.keywords.forEach((keyword: string) => keywordSet.add(keyword));
    }
  });
  return Array.from(keywordSet).sort();
};

type SortOption = "newest" | "oldest" | "alphabetical";

export function ProjectsClientPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [allKeywords, setAllKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);

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
  const [showFavorites, setShowFavorites] = useState<boolean>(() => (searchParams.get('favorites') || '').toLowerCase() === 'true');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      const projects = getProjects();
      const keywords = getAllKeywords(projects);
      setAllProjects(projects);
      setAllKeywords(keywords);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hydrate favorites from localStorage on mount
  useEffect(() => {
    if (!isMounted) return;
    try {
      const raw = localStorage.getItem('portfolio:favorites');
      setFavoriteIds(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      setFavoriteIds([]);
    }
  }, [isMounted]);

  // Listen for favorites updates from any component
  useEffect(() => {
    const handler = (e: Event) => {
      // Prefer detail if present; otherwise re-read from localStorage
      const custom = e as CustomEvent<string[]>;
      if (custom.detail && Array.isArray(custom.detail)) {
        setFavoriteIds(custom.detail);
      } else {
        try {
          const raw = localStorage.getItem('portfolio:favorites');
          setFavoriteIds(raw ? (JSON.parse(raw) as string[]) : []);
        } catch {
          setFavoriteIds([]);
        }
      }
    };
    window.addEventListener('portfolio:favorites-updated', handler as EventListener);
    return () => window.removeEventListener('portfolio:favorites-updated', handler as EventListener);
  }, []);

  // Update URL when filters change
  useEffect(() => {
    if (!isMounted) return;
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    const activeKeywords = Object.keys(selectedKeywords).filter(key => selectedKeywords[key]);
    if (activeKeywords.length > 0) params.set('keywords', activeKeywords.join(','));
    if (sortOrder !== 'newest') params.set('sort', sortOrder);
    if (showFavorites) params.set('favorites', 'true');
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newUrl, { scroll: false });
  }, [searchTerm, selectedKeywords, sortOrder, showFavorites, pathname, router, isMounted]);

  useEffect(() => {
    setFilterLoading(true);
    const timer = setTimeout(() => setFilterLoading(false), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedKeywords, sortOrder, showFavorites]);

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

  const finalProjects = useMemo(() => {
    if (!showFavorites) return filteredAndSortedProjects;
    return filteredAndSortedProjects.filter(p => favoriteIds.includes(p.id));
  }, [filteredAndSortedProjects, favoriteIds, showFavorites]);
  
  
  const activeFilterCount = Object.values(selectedKeywords).filter(Boolean).length + (showFavorites ? 1 : 0);

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
                <DropdownMenuLabel>Quick Filters</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={showFavorites}
                  onCheckedChange={() => setShowFavorites(v => !v)}
                >
                  Favorites only
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
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

      {loading || filterLoading || !isMounted ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: finalProjects.length || 3 }).map((_, index) => (
            <div key={`loading-${index}`} className="h-full flex flex-col transition-all duration-300 ease-in-out border bg-card text-card-foreground shadow-sm rounded-lg">
              <div className="p-6">
                <div className="aspect-video relative overflow-hidden rounded-lg mb-4 bg-muted" />
                <div className="flex items-start justify-between gap-3 mb-2">
                  <Skeleton className="h-8 w-3/4" />
                  <div className="shrink-0 h-8 w-8 rounded-full bg-muted" />
                </div>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-5 w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              </div>
              <div className="p-6 pt-0 flex-col items-start gap-4 mt-auto">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
                  <Skeleton className="h-6 w-18" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-18" />
                </div>
                <Skeleton className="h-5 w-24 mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : finalProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {finalProjects.map((project, index) => (
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
