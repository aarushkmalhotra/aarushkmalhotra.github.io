import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/projects";
import { Separator } from "@/components/ui/separator";

export default async function ProjectsPage() {
  const allProjects = await getProjects();
  const featuredProjects = allProjects.filter(p => p.type !== 'contribution');
  const contributionProjects = allProjects.filter(p => p.type === 'contribution');

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">My Work</h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
          Here's a collection of projects I've built. Each one represents a unique challenge and a story of creative problem-solving.
        </p>
      </div>

      <div className="space-y-16">
        <div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-8">Featured Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProjects.map((project, index) => (
                <div key={project.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up">
                    <ProjectCard project={project} />
                </div>
                ))}
            </div>
        </div>
        
        {contributionProjects.length > 0 && (
          <div>
            <Separator className="my-12" />
             <div className="text-left mb-8">
                <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">Open Source</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl">My contributions to the developer community.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {contributionProjects.map((project, index) => (
                <div key={project.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
