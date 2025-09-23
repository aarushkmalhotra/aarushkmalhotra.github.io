
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/lib/projects";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getHashnodePosts, type Post } from "@/lib/hashnode";
import { ArrowUpRightIcon } from "@/components/icons/ArrowUpRightIcon";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const skills = [
  "TypeScript", "Next.js", "Tailwind CSS", "Firebase", "Google Cloud", "AWS"
];

function LatestPostCard({ post }: { post: Post }) {
    return (
        <Link href={post.url} target="_blank" rel="noopener noreferrer" className="group block h-full">
            <Card className="h-full flex flex-col lg:flex-row transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
                {post.coverImage && (
                    <div className="lg:w-1/3">
                        <div className="aspect-video relative overflow-hidden rounded-t-lg lg:rounded-l-lg lg:rounded-t-none h-full">
                            <Image
                                src={post.coverImage.url}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    </div>
                )}
                <div className="p-6 flex flex-col flex-grow lg:w-2/3">
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
    );
}

export default async function Home() {
  const allProjects = await getProjects();
  const featuredProjects = allProjects.slice(0, 3);
  const allPosts = await getHashnodePosts("aarushkumar");
  const latestPost = allPosts.length > 0 ? allPosts[0] : null;
  const name = "Aarush Kumar";

  return (
    <div className="animate-fade-in">
      <section className="border-b min-h-[calc(100dvh-65px)] flex flex-col items-center justify-center py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            
            <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <Badge variant="secondary" className="px-4 py-2 text-base">
                  Student Founder
              </Badge>
            </div>

            <div className="relative my-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter group" data-name={name}>
                    {name.split("").map((letter, index) => (
                    <span key={index} className="name-letter" style={{ animationDelay: `${400 + index * 50}ms` }}>
                        {letter === " " ? "\u00A0" : letter}
                    </span>
                    ))}
                </h1>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '450ms' }}>
                <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-muted-foreground/80 mb-8">
                    I see problems, then I <span className="animated-gradient-text">build solutions.</span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                    Welcome to my corner of the internet. I'm a full-stack developer who thrives on turning frustration into functional, high-performance web applications.
                </p>
            </div>

            <div className="flex justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <Button asChild size="lg">
                <Link href="/projects">View My Work</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-4">About Me</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-4">
                    <p>
                        I'm a student founder with a knack for building tools that fix real-world frustrations. My journey in tech is driven by a simple idea: technology should be helpful and intuitive, not just impressive.
                    </p>
                    <p>
                        From making sense of endless legal jargon with <Link href="/projects/simplify-me">Simplify Me.</Link> to teaching nuanced language dialects with <Link href="/projects/vernato">Vernato</Link>, I love diving deep into problems and building solutions that make a difference.
                    </p>
                </div>
                 <Button asChild variant="link" className="text-accent p-0 mt-4 text-base">
                    <Link href="/about">Learn more about my journey &rarr;</Link>
                </Button>
            </div>
             <div>
                <h3 className="font-headline text-2xl font-bold mb-6">Core Skillset</h3>
                <div className="flex flex-wrap gap-3">
                    {skills.map((skill) => (
                        <Badge key={skill} className="text-base px-4 py-2" variant="default">
                        {skill}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
      </section>

      <section className="py-16 md:py-24 border-t">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">Featured Projects</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                A glimpse into the solutions I've engineered.
            </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
                <div key={project.id} style={{ animationDelay: `${index * 150}ms` }} className="animate-fade-in-up">
                <ProjectCard project={project} />
                </div>
            ))}
            </div>
            <div className="text-center mt-12">
                <Button asChild variant="link" className="text-accent text-base">
                    <Link href="/projects">See all projects &rarr;</Link>
                </Button>
            </div>
        </div>
      </section>

      {latestPost && (
        <section className="py-16 md:py-24 border-t bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">From the Blog</h2>
              <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                Check out my latest thoughts on development and technology.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
                <LatestPostCard post={latestPost} />
            </div>
            <div className="text-center mt-12">
              <Button asChild variant="link" className="text-accent text-base">
                <Link href="/blog">Read more posts &rarr;</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
