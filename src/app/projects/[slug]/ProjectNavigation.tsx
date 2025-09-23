
import { Card } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Project } from "@/lib/projects";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProjectNavigationProps {
    prevProject?: Project;
    nextProject?: Project;
    searchParams?: { [key: string]: string | string[] | undefined };
}

const NavCard = ({ project, direction, searchParams }: { project: Project; direction: 'prev' | 'next', searchParams?: ProjectNavigationProps['searchParams'] }) => {
    const image = PlaceHolderImages.find(p => p.id === project.images[0]);
    
    const params = new URLSearchParams();
    if (searchParams) {
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value) {
                params.set(key, Array.isArray(value) ? value.join(',') : value);
            }
        });
    }
    const queryString = params.toString();
    const href = `/projects/${project.id}${queryString ? `?${queryString}` : ''}`;
    
    return (
        <Link href={href} className="block group">
            <Card className="relative overflow-hidden transition-all duration-300 ease-in-out md:hover:shadow-xl md:hover:-translate-y-1 h-full">
                {image && (
                    <Image 
                        src={image.imageUrl} 
                        alt={project.name} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                )}
                <div 
                    className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent",
                        direction === 'next' && 'from-black/80 via-black/50 to-transparent',
                        direction === 'prev' && 'from-black/80 via-black/50 to-transparent'
                    )}
                />
                <div className="relative h-full flex flex-col justify-end p-6 text-white">
                    <div 
                        className={cn(
                            "flex items-center gap-2 text-sm text-white/80 mb-2 transition-transform duration-300",
                            direction === 'next' && 'group-hover:translate-x-1',
                            direction === 'prev' && 'group-hover:-translate-x-1'
                        )}
                    >
                        {direction === 'prev' && <ArrowLeft className="w-4 h-4" />}
                        <span>{direction === 'prev' ? 'Previous Project' : 'Next Project'}</span>
                        {direction === 'next' && <ArrowRight className="w-4 h-4" />}
                    </div>
                    <h3 className="font-headline text-xl md:text-2xl font-bold transition-colors group-hover:text-primary-foreground/90">{project.name}</h3>
                    <p className="text-sm text-white/70 line-clamp-1">{project.tagline}</p>
                </div>
            </Card>
        </Link>
    )
}

export function ProjectNavigation({ prevProject, nextProject, searchParams }: ProjectNavigationProps) {
    return (
        <div className={cn(
            "grid grid-cols-1 gap-8",
            (prevProject && nextProject) ? 'md:grid-cols-2' : 'md:grid-cols-1'
        )}>
            {prevProject ? (
                <div className="md:min-h-[200px]">
                    <NavCard project={prevProject} direction="prev" searchParams={searchParams} />
                </div>
            ) : <div />}

            {nextProject ? (
                <div className="md:min-h-[200px]">
                    <NavCard project={nextProject} direction="next" searchParams={searchParams} />
                </div>
            ) : <div />}
        </div>
    )
}
