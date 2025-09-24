"use client";

import { Loader2 } from "lucide-react";

export default function ProjectsLoading() {
  // Minimal fallback: keep page chrome; only show a centered spinner where projects would render.
  return (
    <div className="py-12 flex items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" aria-label="Loading projects" />
    </div>
  );
}
