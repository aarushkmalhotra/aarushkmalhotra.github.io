
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/lib/projects";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const skills = [
  "TypeScript", "React", "Next.js", "Node.js", "Python", "Go",
  "Tailwind CSS", "Firebase", "PostgreSQL", "Docker", "Kubernetes", "Google Cloud"
];

export default async function Home() {
  const allProjects = await getProjects();
  const featuredProjects = allProjects.slice(0, 3);

  return (
    <div className="animate-fade-in">
      <section className="text-center border-b min-h-[calc(100dvh-65px)] flex flex-col items-center justify-center py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-8">
              <Image
                src="/portrait.jpg"
                alt="Aarush Kumar"
                width={160}
                height={160}
                className="rounded-full object-cover border-4 border-primary shadow-lg"
                data-ai-hint="professional portrait"
                priority
              />
            </div>
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4">
              <span className="animated-gradient-text">
                Crafting Digital Experiences
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              I'm a full-stack developer specializing in building exceptional, high-performance web applications. Welcome to my corner of the internet where I showcase my work and share my thoughts on technology.
            </p>
            <div className="flex justify-center gap-4">
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
                        I'm a passionate software engineer with a knack for building elegant, efficient, and scalable solutions. With years of experience across the stack, I thrive in turning complex problems into beautiful, functional web applications.
                    </p>
                    <p>
                        My journey in tech is driven by a relentless curiosity and a desire to create things that make a difference. From architecting robust backends to designing pixel-perfect frontends, I love every aspect of the development process.
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
    </div>
  );
}
