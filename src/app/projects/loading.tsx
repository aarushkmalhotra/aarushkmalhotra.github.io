"use client";

import { Loader2 } from "lucide-react";
import { Search } from "lucide-react";

export default function ProjectsLoading() {
  // Fallback keeps header and controls visible; only the grid area shows a centered spinner.
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">My Work</h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
          Here's a collection of projects I've built. Each one represents a unique
          challenge and a story of creative problem-solving.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            disabled
            type="search"
            placeholder="Search projects..."
            className="pl-10 w-full h-10 rounded-md border bg-background text-sm px-3 text-muted-foreground/70"
          />
        </div>
        <div className="flex flex-row gap-4">
          <div className="w-1/2 md:w-auto">
            <button
              disabled
              className="w-full justify-between flex items-center h-10 rounded-md border bg-background px-3 text-sm text-foreground/80"
            >
              <span className="flex items-center">Filter</span>
              <svg className="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>
            </button>
          </div>
          <div className="w-1/2 md:w-[200px]">
            <select disabled className="w-full h-10 rounded-md border bg-background px-3 text-sm text-foreground/80">
              <option>Newest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="py-12 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" aria-label="Loading projects" />
      </div>
    </div>
  );
}
