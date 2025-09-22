import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { getProjectById, getProjects } from "@/lib/projects";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRightIcon } from "@/components/icons/ArrowUpRightIcon";
import { ProjectDetailsClient } from "./ProjectDetailsClient";
import { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectById(params.slug);

  if (!project) {
    return {
      title: 'Project Not Found'
    }
  }

  return {
    title: `${project.name} | SourceCraft`,
    description: project.tagline,
  }
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.id,
  }));
}

export default async function ProjectDetailPage({ params }: { params: { slug:string } }) {
  const project = await getProjectById(params.slug);

  if (!project) {
    notFound();
  }

  const projectImages = project.images
    .map((id) => PlaceHolderImages.find((img) => img.id === id))
    .filter(Boolean);

  return (
    <div className="animate-fade-in" style={{ '--project-primary': project.theme.primary, '--project-secondary': project.theme.secondary } as React.CSSProperties}>
      <header className="bg-card py-16 md:py-24 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight" style={{ color: 'hsl(var(--project-primary))' }}>{project.name}</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">{project.tagline}</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="font-headline text-3xl">Overview</h2>
              <p>{project.description}</p>
              
              <h2 className="font-headline text-3xl">Outcomes</h2>
              <p>{project.outcomes}</p>
            </div>
            
            <ProjectDetailsClient project={project} />
            
            {projectImages.length > 0 && (
              <div>
                <h2 className="font-headline text-3xl mb-6">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projectImages.map((image) => image && (
                        <div key={image.id} className="aspect-video relative overflow-hidden rounded-lg shadow-md">
                            <Image
                                src={image.imageUrl}
                                alt={`${project.name} screenshot`}
                                fill
                                className="object-cover"
                                data-ai-hint={image.imageHint}
                            />
                        </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          <aside className="lg:col-span-1 space-y-8">
             <div className="p-6 rounded-lg bg-card border">
                <h3 className="font-headline text-xl mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                    {project.techStack.split(',').map(tech => (
                        <Badge key={tech.trim()} variant="secondary">{tech.trim()}</Badge>
                    ))}
                </div>
             </div>
             <div className="p-6 rounded-lg bg-card border">
                <h3 className="font-headline text-xl mb-4">Project Links</h3>
                <div className="space-y-3">
                    {project.repoUrl && (
                        <Button asChild variant="outline" className="w-full justify-start gap-2">
                            <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                                <ArrowUpRightIcon className="w-4 h-4" />
                                GitHub Repository
                            </Link>
                        </Button>
                    )}
                    {project.demoUrl && (
                        <Button asChild className="w-full justify-start gap-2" style={{ backgroundColor: 'hsl(var(--project-primary))' }}>
                            <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                <ArrowUpRightIcon className="w-4 h-4" />
                                Live Demo
                            </Link>
                        </Button>
                    )}
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
