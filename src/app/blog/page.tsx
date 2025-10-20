
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons/ArrowUpRightIcon";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Metadata } from 'next';
import { Button } from "@/components/ui/button";
// Client-side fetching is handled in BlogClient to avoid rebuilds for updates
import { BlogClient } from "./BlogClient";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: `Blog – ${config.siteName}`,
  description: "My thoughts on technology, development, and everything in between.",
  openGraph: {
    title: `Blog – ${config.siteName}`,
    description: "My thoughts on technology, development, and everything in between.",
    images: [
      {
        url: 'https://picsum.photos/seed/blog/1200/630',
        width: 1200,
        height: 630,
        alt: 'Blog Page'
      }
    ]
  }
};

function EmptyState() {
  return (
    <div className="text-center py-28 px-6 bg-card border rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">No Posts Found</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        It seems there are no blog posts available at the moment. Please check back later or try refreshing.
      </p>
      <Button asChild>
        <a href="/blog">Try Again</a>
      </Button>
    </div>
  );
}


export default async function BlogPage() {

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Blog</h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
          My thoughts on technology, development, and everything in between, pulled directly from my Hashnode blogs.
        </p>
      </div>

      {/* Client-side fetched list to keep GitHub Pages static but fresh */}
      <BlogClient />
    </div>
  );
}
