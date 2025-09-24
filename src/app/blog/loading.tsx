"use client";
import { Loader2 } from "lucide-react";

export default function BlogLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Blog</h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
          My thoughts on technology, development, and everything in between, pulled directly from my Hashnode blog.
        </p>
      </div>

      {/* Fallback: centered spinner under the header while posts load */}
      <div className="py-12 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" aria-label="Loading posts" />
      </div>
    </div>
  );
}
