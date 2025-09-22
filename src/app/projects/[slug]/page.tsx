
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { getProjectById, getProjects } from "@/lib/projects";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProjectDetailsClient } from "./ProjectDetailsClient";
import { Metadata } from 'next';
import { Check } from "lucide-react";
import { ProjectHeader } from "./ProjectHeader";

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

  const firstImage = PlaceHolderImages.find(img => img.id === project.images[0]);

  return {
    title: `${project.name} | Aarush's Portfolio`,
    description: project.tagline,
    openGraph: {
        title: `${project.name} | Aarush's Portfolio`,
        description: project.tagline,
        images: firstImage ? [
            {
                url: firstImage.imageUrl,
                width: 1200,
                height: 630,
                alt: project.name,
            }
        ] : [],
    }
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
    <div className="animate-fade-in" style={{ '--project-primary': project.theme.primary, '--project-secondary': project.theme.secondary, '--project-accent': project.theme.secondary } as React.CSSProperties}>
      <ProjectHeader project={project} />

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="font-headline text-3xl">Overview</h2>
              <p>{project.description}</p>
            </div>
            
            {project.keyFeatures && project.keyFeatures.length > 0 && (
              <div>
                <h2 className="font-headline text-3xl prose prose-lg dark:prose-invert max-w-none mb-6">Key Features</h2>
                <ul className="space-y-4">
                  {project.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-accent mr-4 mt-1 flex-shrink-0" style={{ color: 'hsl(var(--project-accent))' }} />
                      <span className="text-base text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="font-headline text-3xl">Outcomes</h2>
                <p>{project.outcomes}</p>
            </div>
            
            <ProjectDetailsClient project={project} />
            
            {projectImages.length > 0 && (
              <div>
                <h2 className="font-headline text-3xl mb-6 prose prose-lg dark:prose-invert max-w-none">Gallery</h2>
                <div className="grid grid-cols-1 gap-6">
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
          <aside className="lg:col-span-1 space-y-8 sticky top-[230px] self-start">
             <div className="p-6 rounded-lg bg-card border">
                <h3 className="font-headline text-xl mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                    {project.techStack.split(',').map(tech => (
                        <Badge key={tech.trim()} variant="secondary">{tech.trim()}</Badge>

                    ))}
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
