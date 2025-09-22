import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/projects";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">My Work</h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
          Here's a collection of projects I've built. Each one represents a unique challenge and a story of creative problem-solving.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div key={project.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
