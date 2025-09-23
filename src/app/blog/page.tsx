
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
import { getHashnodePosts } from "@/lib/hashnode";

export const metadata: Metadata = {
  title: "Blog – Aarush's Portfolio",
  description: "My thoughts on technology, development, and everything in between.",
  openGraph: {
    title: "Blog – Aarush's Portfolio",
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


export default async function BlogPage() {
  const posts = await getHashnodePosts("aarushkumar.hashnode.dev");

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Blog</h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
          My thoughts on technology, development, and everything in between, pulled directly from my Hashnode blog.
        </p>
      </div>

      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Link href={post.url} target="_blank" rel="noopener noreferrer" key={post.id} className="group block" style={{ animationDelay: `${index * 100}ms` }}>
              <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1 animate-fade-in-up">
                {post.coverImage && (
                  <CardHeader className="p-0">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <Image
                        src={post.coverImage.url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </CardHeader>
                )}
                <div className={`p-6 flex flex-col flex-grow`}>
                    <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                    <CardDescription className="mt-2 text-xs">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · {post.readTimeInMinutes} min read
                    </CardDescription>
                  <CardContent className="p-0 flex-grow pt-4">
                    <p className="text-muted-foreground line-clamp-3">{post.brief}</p>
                  </CardContent>
                  <CardFooter className="p-0 pt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                              {post.author.profilePicture && <AvatarImage src={post.author.profilePicture} alt={post.author.name} />}
                              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{post.author.name}</span>
                      </div>
                      <span className="text-sm text-accent flex items-center gap-1">
                        Read on Hashnode <ArrowUpRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  </CardFooter>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
