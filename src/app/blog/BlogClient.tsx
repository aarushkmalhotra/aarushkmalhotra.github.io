"use client";

import { useEffect, useState } from "react";
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

export function BlogClient() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);

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
        const run = async (query: string) => fetch("https://gql.hashnode.com/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // avoid staleness from intermediate caches
          cache: "no-store",
          body: JSON.stringify({ query, variables: { host: HASHNODE_HOST } })
        });

        // Try with subtitle+username, then fallback to with-username, then no-username
        let res = await run(queryWithSubtitleUsername);
        let json = await res.json();
        if (!res.ok || json?.errors) {
          res = await run(queryWithUsernameNoSubtitle);
          json = await res.json();
          if (!res.ok || json?.errors) {
            res = await run(queryNoSubtitleNoUsername);
            if (!res.ok) {
              console.error("Failed to fetch posts from Hashnode:", await res.text());
              if (!cancelled) setPosts([]);
              return;
            }
            json = await res.json();
          }
        }

        const edges = json?.data?.publication?.posts?.edges ?? [];
        const mapped: Post[] = edges.map((e: any) => e.node);
        if (!cancelled) setPosts(mapped);
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
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" aria-label="Loading posts" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-card border rounded-lg shadow-sm">
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

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <div key={post.id} className="group block" style={{ animationDelay: `${index * 100}ms` }}>
          <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1 animate-fade-in-up">
            {post.coverImage && (
              <CardHeader className="p-0">
                <div className="aspect-[40/21] relative overflow-hidden rounded-t-lg">
                  <Link href={post.url} target="_blank" rel="noopener noreferrer" aria-label={`Open post: ${post.title}`}>
                    <Image
                      src={post.coverImage.url}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
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
                <Link
                  href={post.author?.username ? `https://hashnode.com/@${post.author.username}` : post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group/author"
                  aria-label={`Open author profile: ${post.author.name}`}
                >
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
      ))}
    </div>
  );
}
