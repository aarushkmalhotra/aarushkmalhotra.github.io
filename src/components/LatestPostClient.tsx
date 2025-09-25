"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { ArrowUpRightIcon } from "@/components/icons/ArrowUpRightIcon";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
};

const HASHNODE_HOST = "aarushkumar.hashnode.dev";

export function LatestPostClient() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

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
        const run = async (query: string) => fetch("https://gql.hashnode.com/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({ query, variables: { host: HASHNODE_HOST } }),
        });

        // try with subtitle+username, then fallback to with-username, then no-username
        let res = await run(queryWithSubtitleUsername);
        let json = await res.json();
        if (!res.ok || json?.errors) {
          res = await run(queryWithUsernameNoSubtitle);
          json = await res.json();
          if (!res.ok || json?.errors) {
            res = await run(queryNoSubtitleNoUsername);
            if (!res.ok) {
              console.error("Failed to fetch latest post:", await res.text());
              if (!cancelled) setPost(null);
              return;
            }
            json = await res.json();
          }
        }
        const first = json?.data?.publication?.posts?.edges?.[0]?.node ?? null;
        if (!cancelled) setPost(first ?? null);
      } catch (e) {
        console.error("Error fetching latest post:", e);
        if (!cancelled) setPost(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!post) return null;

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
          {post.coverImage && (
            <div className="lg:w-1/2 lg:flex lg:items-stretch">
              {/* Keep exact 40:21 on mobile; on desktop fill column height and crop nicely */}
              <div className="relative overflow-hidden aspect-[40/21] lg:aspect-auto lg:h-full w-full">
                <Link href={post.url} target="_blank" rel="noopener noreferrer" aria-label={`Open post: ${post.title}`}>
                  <Image
                    src={post.coverImage.url}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
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
              <Link href={getAuthorProfileUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group/author">
                <Avatar className="h-8 w-8 ring-1 ring-border">
                  {post.author.profilePicture && <AvatarImage src={post.author.profilePicture} alt={post.author.name} />}
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium transition-colors group-hover/author:text-primary group-hover/author:underline">
                  {post.author.name}
                </span>
              </Link>
              <Link href={post.url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent flex items-center gap-1">
                Read on Hashnode <ArrowUpRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </CardFooter>
          </div>
      </Card>
    </div>
  );
}
