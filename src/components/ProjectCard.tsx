
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/lib/projects";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowUpRightIcon } from "./icons/ArrowUpRightIcon";
import { format, parseISO } from "date-fns";
import { useState } from "react";

interface ProjectCardProps {
  project: Project;
}

const formatDateRange = (startDate: string, endDate: string | null) => {
    const start = parseISO(startDate);
    if (!endDate) {
        return `${format(start, 'MMM yyyy')} - Present`;
    }
    const end = parseISO(endDate);
    if (format(start, 'yyyy') === format(end, 'yyyy')) {
        return `${format(start, 'MMM')} - ${format(end, 'MMM yyyy')}`;
    }
    return `${format(start, 'MMM yyyy')} - ${format(end, 'MMM yyyy')}`;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const firstImageId = project.images[0];
  const image = PlaceHolderImages.find((img) => img.id === firstImageId);
  const allSkills = project.techStack.split(",").map(s => s.trim());
  const skillsToShow = allSkills.slice(0, 4);
  const remainingSkillsCount = allSkills.length - skillsToShow.length;

  const getCallToAction = () => {
    if (project.id === 'cifar-10-cnn') {
      return 'View Slides';
    }
    if (project.id === 'simplify-me' || project.id === 'vernato' || project.id === 'imdb-top-1000') {
      return 'View Demo';
    }
    if (project.id === 'emty') {
      return 'View Linktree';
    }
    if(project.demoUrl) {
      return 'View Project';
    }
    if(project.repoUrl) {
        return 'View on GitHub';
    }
    return 'View Details';
  }

  return (
    <Link 
      href={`/projects/${project.id}`} 
      className="group block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
        <CardHeader className="p-6">
          <div className="aspect-video relative overflow-hidden rounded-lg mb-4 bg-muted">
            {image && (
                <>
                    {/* Desktop: Video on hover */}
                    {project.videoPreview && (
                        <video
                            src={project.videoPreview}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 hidden md:block ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                    
                    {/* Fallback Image */}
                    <Image
                        src={image.imageUrl}
                        alt={project.name}
                        fill
                        className={`object-cover transition-transform duration-300 ${!project.videoPreview && 'group-hover:scale-105'}`}
                        data-ai-hint={image.imageHint}
                    />
                </>
            )}
          </div>
          <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">
            {project.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{formatDateRange(project.startDate, project.endDate)}</p>
          <CardDescription>{project.tagline}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow p-6 pt-0">
            <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex-col items-start gap-4">
            <div className="flex flex-wrap gap-2">
                {skillsToShow.map((tech) => (
                    <Badge key={tech} variant="secondary">
                        {tech}
                    </Badge>
                ))}
                {remainingSkillsCount > 0 && (
                    <Badge variant="secondary">
                        +{remainingSkillsCount}
                    </Badge>
                )}
            </div>
             <span className="text-sm text-accent flex items-center gap-1">
                {getCallToAction()} <ArrowUpRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
