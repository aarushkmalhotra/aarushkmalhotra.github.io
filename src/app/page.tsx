import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/lib/projects";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const allProjects = await getProjects();
  const featuredProjects = allProjects.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <section className="text-center py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-8">
            <Image
              src="https://picsum.photos/seed/avatar/200/200"
              alt="Developer Avatar"
              width={160}
              height={160}
              className="rounded-full object-cover border-4 border-primary shadow-lg"
              data-ai-hint="developer avatar"
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
      </section>

      <section className="py-16 md:py-24 border-t">
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
            <Button asChild variant="link" className="text-accent">
                <Link href="/projects">See all projects &rarr;</Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
