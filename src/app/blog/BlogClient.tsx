"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { ArrowUpRightIcon } from "@/components/icons/ArrowUpRightIcon";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { config } from "@/lib/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Post = {
  id: string;
  title: string;
  subtitle?: string | null;
  brief: string;
  slug: string;
  url: string;
  publishedAt: string;
  readTimeInMinutes: number;
  coverImage?: { url: string } | null;
  author: { name: string; profilePicture?: string | null; username?: string | null };
  // added at runtime to distinguish source
  sourceHost?: string;
};

export function BlogClient() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHost, setSelectedHost] = useState<string | "all">("all");

  const hosts = useMemo(() => config.hashnodeHosts ?? [config.hashnodeHost], []);

  useEffect(() => {
    let cancelled = false;

    const queryWithSubtitleUsername = `
      query Publication($host: String!) {
        publication(host: $host) {
          posts(first: 12) {
            edges {
              node {
                id
                title
                subtitle
                brief
                slug
                url
                publishedAt
                readTimeInMinutes
                coverImage { url }
                author { name username profilePicture }
              }
            }
          }
        }
      }
    `;

    const queryWithUsernameNoSubtitle = `
      query Publication($host: String!) {
        publication(host: $host) {
          posts(first: 12) {
            edges {
              node {
                id
                title
                brief
                slug
                url
                publishedAt
                readTimeInMinutes
                coverImage { url }
                author { name username profilePicture }
              }
            }
          }
        }
      }
    `;
    const queryNoSubtitleNoUsername = `
      query Publication($host: String!) {
        publication(host: $host) {
          posts(first: 12) {
            edges {
              node {
                id
                title
                brief
                slug
                url
                publishedAt
                readTimeInMinutes
                coverImage { url }
                author { name profilePicture }
              }
            }
          }
        }
      }
    `;

    (async () => {
      try {
        setLoading(true);
        const runForHost = async (host: string, query: string) =>
          fetch("https://gql.hashnode.com/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // avoid staleness from intermediate caches
            cache: "no-store",
            body: JSON.stringify({ query, variables: { host } }),
          });

        const fetchForSingleHost = async (host: string) => {
          let res = await runForHost(host, queryWithSubtitleUsername);
          let json = await res.json();
          if (!res.ok || json?.errors) {
            res = await runForHost(host, queryWithUsernameNoSubtitle);
            json = await res.json();
            if (!res.ok || json?.errors) {
              res = await runForHost(host, queryNoSubtitleNoUsername);
              if (!res.ok) {
                console.error("Failed to fetch posts from Hashnode:", host, await res.text());
                return [] as Post[];
              }
              json = await res.json();
            }
          }
          const edges = json?.data?.publication?.posts?.edges ?? [];
          const mapped: Post[] = edges.map((e: any) => e.node);
          // Attach source host to each post for later filtering
          return mapped.map((p) => ({ ...p, url: p.url, sourceHost: host } as any));
        };

        const hostsToFetch = selectedHost === "all" ? hosts : [selectedHost];
        const results = await Promise.all(hostsToFetch.map((h) => fetchForSingleHost(h)));
        const combined = results.flat();

        // Sort by publishedAt desc
        combined.sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        if (!cancelled) setPosts(combined as Post[]);
      } catch (err) {
        console.error("Error fetching from Hashnode:", err);
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hosts, selectedHost]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" aria-label="Loading projects" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
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

  // Simple wrapper to support fallback when image fails
  const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    const [error, setError] = useState(false);
    const finalSrc = !src || error ? "/image-unavailable.svg" : src;
    return (
      // Using unoptimized images per next.config.js
      <Image
        src={finalSrc}
        alt={alt}
        fill
        className={className}
        onError={() => setError(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  };

  const getSourceMeta = (host: string | undefined) => {
    if (!host) return { label: "Unknown", icon: "/portrait.jpg", shortLabel: "Unknown" };
    if (host.includes("vernato")) return { label: "Vernato Blog", icon: "/vernato-logo.png", shortLabel: "Vernato" };
    return { label: "Personal Blog", icon: "/portrait.jpg", shortLabel: "Personal Blog" };
  };

  const hasMultipleHosts = hosts.length > 1;

  const headingTitle = hasMultipleHosts
    ? (selectedHost === "all"
        ? "All Blog Posts"
        : `${getSourceMeta(selectedHost as string).label} Posts`)
    : "Blog Posts";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{headingTitle}</h2>
        {hasMultipleHosts && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {selectedHost === "all" ? (
                  <>
                    <Image src="/vernato-logo.png" alt="Vernato" width={16} height={16} className="rounded-full bg-white p-0.5" />
                    <Image src="/portrait.jpg" alt="Personal" width={16} height={16} className="rounded-full" />
                    <span>All Sources</span>
                  </>
                ) : (
                  (() => {
                    const meta = getSourceMeta(selectedHost as string);
                    const isVernato = meta.shortLabel === "Vernato";
                    return (
                      <>
                        <Image 
                          src={meta.icon} 
                          alt={meta.label} 
                          width={16} 
                          height={16} 
                          className={isVernato ? "rounded-full bg-white p-0.5" : "rounded-full"} 
                        />
                        <span>{meta.label}</span>
                      </>
                    );
                  })()
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by source</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setSelectedHost("all")} className="gap-2">
                <Image src="/portrait.jpg" alt="Personal" width={16} height={16} className="rounded-full" />
                <Image src="/vernato-logo.png" alt="Vernato" width={16} height={16} className="rounded-full bg-white p-0.5" />
                <span>All Sources</span>
              </DropdownMenuItem>
              {hosts.map((h) => {
                const meta = getSourceMeta(h);
                const isVernato = meta.shortLabel === "Vernato";
                return (
                  <DropdownMenuItem key={h} onSelect={() => setSelectedHost(h)} className="gap-2">
                    <Image 
                      src={meta.icon} 
                      alt={meta.label} 
                      width={16} 
                      height={16} 
                      className={isVernato ? "rounded-full bg-white p-0.5" : "rounded-full"} 
                    />
                    <span>{meta.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <div key={post.id} className="group block" style={{ animationDelay: `${index * 100}ms` }}>
          <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1 animate-fade-in-up">
            {post.coverImage ? (
              <CardHeader className="p-0">
                <div className="aspect-[40/21] relative overflow-hidden rounded-t-lg">
                  <Link href={post.url} target="_blank" rel="noopener noreferrer" aria-label={`Open post: ${post.title}`}>
                    <ImageWithFallback
                      src={post.coverImage.url}
                      alt={post.title}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                </div>
              </CardHeader>
            ) : (
              <CardHeader className="p-0">
                <div className="aspect-[40/21] relative overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src={""}
                    alt={post.title}
                    className="object-cover"
                  />
                </div>
              </CardHeader>
            )}
            <div className="p-6 flex flex-col flex-grow">
              <CardTitle className="font-headline text-2xl hover:text-primary transition-colors">
                <Link href={post.url} target="_blank" rel="noopener noreferrer">{post.title}</Link>
              </CardTitle>
              <CardDescription className="mt-2 text-xs">
                {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · {post.readTimeInMinutes} min read
              </CardDescription>
              <CardContent className="p-0 flex-grow pt-4">
                <p className="text-muted-foreground line-clamp-3">{post.subtitle || post.brief}</p>
              </CardContent>
              <CardFooter className="p-0 pt-6 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Link
                    href={post.author?.username ? `https://hashnode.com/@${post.author.username}` : post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 group/author"
                    aria-label={`Open author profile: ${post.author.name}`}
                  >
                    <Avatar className={`h-8 w-8 ${getSourceMeta((post as any).sourceHost).shortLabel !== "Vernato" ? "ring-1 ring-border" : ""}`}>
                      {(() => {
                        const sourceMeta = getSourceMeta((post as any).sourceHost);
                        const isVernato = sourceMeta.shortLabel === "Vernato";
                        const avatarSrc = isVernato ? "/vernato-logo.png" : post.author.profilePicture;
                        return (
                          <>
                            {avatarSrc && <AvatarImage src={avatarSrc} alt={post.author.name} />}
                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                          </>
                        );
                      })()}
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium transition-colors group-hover/author:text-primary group-hover/author:underline">
                        {post.author.name}
                      </span>
                      {hasMultipleHosts && (
                        <span className="text-xs text-muted-foreground">
                          {getSourceMeta((post as any).sourceHost).shortLabel}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
                <Link href={post.url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent flex items-center gap-1">
                  Read on Hashnode <ArrowUpRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </CardFooter>
            </div>
          </Card>
        </div>
      ))}
      </div>
    </div>
  );
}
