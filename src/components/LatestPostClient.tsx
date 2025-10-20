"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { ArrowUpRightIcon } from "@/components/icons/ArrowUpRightIcon";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { config } from "@/lib/config";

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

export function LatestPostClient() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const hosts = useMemo(() => config.hashnodeHosts ?? [config.hashnodeHost], []);

  useEffect(() => {
    let cancelled = false;

    const queryWithSubtitleUsername = `
      query Publication($host: String!) {
        publication(host: $host) {
          posts(first: 1) {
            edges { node {
              id title subtitle brief slug url publishedAt readTimeInMinutes
              coverImage { url }
              author { name username profilePicture }
            } }
          }
        }
      }
    `;
    const queryWithUsernameNoSubtitle = `
      query Publication($host: String!) {
        publication(host: $host) {
          posts(first: 1) {
            edges { node {
              id title brief slug url publishedAt readTimeInMinutes
              coverImage { url }
              author { name username profilePicture }
            } }
          }
        }
      }
    `;
    const queryNoSubtitleNoUsername = `
      query Publication($host: String!) {
        publication(host: $host) {
          posts(first: 1) {
            edges { node {
              id title brief slug url publishedAt readTimeInMinutes
              coverImage { url }
              author { name profilePicture }
            } }
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
                console.error("Failed to fetch latest post from:", host, await res.text());
                return null;
              }
              json = await res.json();
            }
          }
          const first = json?.data?.publication?.posts?.edges?.[0]?.node ?? null;
          if (first) {
            return { ...first, sourceHost: host } as Post;
          }
          return null;
        };

        // Fetch from all hosts and pick the most recent
        const results = await Promise.all(hosts.map((h) => fetchForSingleHost(h)));
        const validPosts = results.filter((p): p is Post => p !== null);

        if (validPosts.length === 0) {
          if (!cancelled) setPost(null);
          return;
        }

        // Sort by publishedAt desc and pick the latest
        validPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        if (!cancelled) setPost(validPosts[0]);
      } catch (e) {
        console.error("Error fetching latest post:", e);
        if (!cancelled) setPost(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [hosts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" aria-label="Loading projects" />
      </div>
    );
  }

  if (!post) return null;

  // Simple wrapper to support fallback when image fails
  const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    const [error, setError] = useState(false);
    const finalSrc = !src || error ? "/image-unavailable.svg" : src;
    return (
      <Image
        src={finalSrc}
        alt={alt}
        fill
        className={className}
        onError={() => setError(true)}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );
  };

  const getSourceMeta = (host: string | undefined) => {
    if (!host) return { label: "Unknown", icon: "/portrait.jpg", shortLabel: "Unknown" };
    if (host.includes("vernato")) return { label: "Vernato Blog", icon: "/vernato-logo.png", shortLabel: "Vernato" };
    return { label: "Personal Blog", icon: "/portrait.jpg", shortLabel: "Personal Blog" };
  };

  const hasMultipleHosts = hosts.length > 1;

  const getAuthorProfileUrl = () => {
    if (post.author?.username) {
      return `https://hashnode.com/@${post.author.username}`;
    }
    try {
      const u = new URL(post.url);
      // Try to extract subdomain for @username fallback
      const m = u.hostname.match(/^([^.]+)\.hashnode\.dev$/);
      if (m && m[1]) return `https://hashnode.com/@${m[1]}`;
      return `${u.protocol}//${u.hostname}`;
    } catch {
      return "https://hashnode.com";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="group h-full flex flex-col lg:flex-row lg:items-stretch transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 overflow-hidden">
          {post.coverImage ? (
            <div className="lg:w-1/2 lg:flex lg:items-stretch">
              {/* Keep exact 40:21 on mobile; on desktop fill column height and crop nicely */}
              <div className="relative overflow-hidden aspect-[40/21] lg:aspect-auto lg:h-full w-full">
                <Link href={post.url} target="_blank" rel="noopener noreferrer" aria-label={`Open post: ${post.title}`}>
                  <ImageWithFallback
                    src={post.coverImage.url}
                    alt={post.title}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              </div>
            </div>
          ) : (
            <div className="lg:w-1/2 lg:flex lg:items-stretch">
              <div className="relative overflow-hidden aspect-[40/21] lg:aspect-auto lg:h-full w-full">
                <ImageWithFallback
                  src=""
                  alt={post.title}
                  className="object-cover"
                />
              </div>
            </div>
          )}
          <div className="p-6 flex flex-col flex-grow lg:w-1/2">
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
                <Link href={getAuthorProfileUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group/author">
                                      <Avatar className={`h-8 w-8 ${getSourceMeta((post as any).sourceHost).shortLabel !== "Vernato" ? "ring-1 ring-border" : ""}`}>
                    {(() => {
                      const sourceMeta = getSourceMeta(post.sourceHost);
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
                        {getSourceMeta(post.sourceHost).shortLabel}
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
  );
}
