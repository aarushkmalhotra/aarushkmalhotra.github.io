
import { Badge } from "@/components/ui/badge";
import { getProjectById, getProjects } from "@/lib/projects";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import { Check, ExternalLink, CalendarDays } from "lucide-react";
import { ProjectHeader } from "./ProjectHeader";
import { AudioPlayer } from "@/components/AudioPlayer";
import { DownloadableAudioPlayer } from "@/components/DownloadableAudioPlayer";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ProjectGallery } from "./ProjectGallery";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ProjectDetailClientPage } from "./ProjectDetailClientPage";
import ProjectQuickDock from "./ProjectQuickDock";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectById(slug);

  if (!project) {
    return {
      title: 'Project Not Found'
    }
  }

  const firstImage = PlaceHolderImages.find(img => img.id === project.images[0]);

  return {
    title: `${project.name} – Aarush's Portfolio`,
    description: project.tagline,
    openGraph: {
        title: `${project.name} – Aarush's Portfolio`,
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

export function generateStaticParams() {
  const projects = getProjects();
  return projects.map((project) => ({
    slug: project.id,
  }));
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectById(slug);

  if (!project) {
    notFound();
  }
  
  const allProjects = getProjects();
  
  const formatRange = (start: string, end: string | null) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const format = (s: string) => {
      const [y, m] = s.split('-');
      const mi = Math.max(1, Math.min(12, parseInt(m, 10))) - 1;
      return `${months[mi]} ${y}`;
    };
    const startStr = format(start);
    const endStr = end ? format(end) : 'Present';
    return `${startStr} — ${endStr}`;
  };
    
  const TechStackAside = () => (
    <div className="p-6 rounded-lg bg-card border">
        <h3 className="font-headline text-xl mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2">
            {project.techStack.split(',').map(tech => {
                const skillSlug = encodeURIComponent(tech.trim().toLowerCase().replace(/\s/g, '-').replace(/\./g, ''));
                return (
                    <Link key={tech.trim()} href={`/skill/${skillSlug}`}>
                        <Badge variant="secondary" className="transition-colors hover:bg-primary/20 hover:text-primary">{tech.trim()}</Badge>
                    </Link>
                )
            })}
        </div>
    </div>
  );

  const KeyFeaturesAside = () => (
    <div className="p-6 rounded-lg bg-card border">
        <h3 className="font-headline text-xl mb-4">Key Features</h3>
        <ul className="space-y-4">
          {project.keyFeatures?.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="w-5 h-5 text-accent mr-4 mt-1 flex-shrink-0" style={{ color: 'hsl(var(--project-accent))' }} />
              <span className="text-base text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
    </div>
  );

  const DatesAside = () => (
    <div className="p-6 rounded-lg bg-card border">
      <h3 className="font-headline text-xl mb-4">Timeline</h3>
      <div className="text-sm text-muted-foreground inline-flex items-center gap-2">
        <CalendarDays className="w-4 h-4" />
        <span>{formatRange(project.startDate, project.endDate)}</span>
      </div>
    </div>
  );

  const createMarkup = (htmlString: string) => {
    // Split by one or more newlines, filter out empty strings, and wrap in <p> tags
    const paragraphs = htmlString.split(/\n+/).filter(p => p.trim() !== '').map(p => `<p>${p}</p>`).join('');
    return { __html: paragraphs };
  };

  return (
    <div className="animate-fade-in" style={{ '--project-primary': project.theme.primary, '--project-secondary': project.theme.secondary, '--project-accent': project.theme.secondary } as React.CSSProperties}>
      <ProjectHeader project={project} />
      {/* Floating quick dock (desktop right rail + mobile bottom bar) */}
      <ProjectQuickDock project={project} backHref="/projects" />

      <div className="max-w-7xl mx-auto px-4 xl:px-0 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div id="overview">
              <h2 className="font-headline text-3xl prose prose-lg dark:prose-invert max-w-none mb-6">Overview</h2>
              <div 
                className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={createMarkup(project.description)}
              />
            </div>
            
            {project.keyFeatures && project.keyFeatures.length > 0 && (
              <div className="lg:hidden">
                <KeyFeaturesAside />
              </div>
            )}

            <div className="lg:hidden">
              <TechStackAside />
            </div>
            
      <div id="outcomes">
                <h2 className="font-headline text-3xl prose prose-lg dark:prose-invert max-w-none mb-6">Outcomes</h2>
                <div 
                    className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={createMarkup(project.outcomes)}
                />
            </div>
            
            {project.audioFiles && project.audioFiles.length > 0 && (
              <div id="ai-samples">
                <h2 className="font-headline text-3xl prose prose-lg dark:prose-invert max-w-none mb-6">AI Generated Samples</h2>
                <div className="space-y-4">
                  {project.audioFiles.map((audioFile) => (
                    <AudioPlayer key={audioFile.id} audioFile={audioFile} themeColor={project.theme.primary}/>
                  ))}
                </div>
              </div>
            )}
            
            {project.downloadableAudioFiles && project.downloadableAudioFiles.length > 0 && (
              <div id="original-tracks">
                 <h2 className="font-headline text-3xl prose prose-lg dark:prose-invert max-w-none mb-6">Original Tracks</h2>
                 <div className="space-y-4">
                  {project.downloadableAudioFiles.map((audioFile) => (
                    <DownloadableAudioPlayer key={audioFile.id} audioFile={audioFile} themeColor={project.theme.primary} />
                  ))}
                   <Card className="p-4 sm:p-6">
                      <Link href="https://drive.google.com/drive/folders/1DrceaX2DRv2ve6mYF7210ikESgcIUKOd" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group">
                        <span className="font-semibold text-lg text-muted-foreground group-hover:text-primary transition-colors">Want to listen to more? Access all songs here.</span>
                        <ExternalLink className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                   </Card>
                 </div>
              </div>
            )}

            <ProjectGallery project={project} />

          </div>
          <aside className="hidden lg:block lg:col-span-1 space-y-4 sticky top-[80px] self-start">
            <DatesAside />
            <TechStackAside />
            {project.keyFeatures && project.keyFeatures.length > 0 && (
              <KeyFeaturesAside />
            )}
          </aside>
        </div>
        
        <ProjectDetailClientPage project={project} allProjects={allProjects} />
      </div>
    </div>
  );
}
