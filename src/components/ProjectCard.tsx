
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
import { useState, useRef, useEffect } from "react";
import { YoutubeIcon } from "./icons/YoutubeIcon";
import { cn } from "@/lib/utils";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const firstImageId = project.images[0];
  const image = PlaceHolderImages.find((img) => img.id === firstImageId);
  const allSkills = project.techStack.split(",").map(s => s.trim());
  const skillsToShow = allSkills.slice(0, 4);
  const remainingSkillsCount = allSkills.length - skillsToShow.length;

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);


  const getCallToAction = () => {
    if (project.id === 'cifar-10-cnn') {
      return 'View Slides';
    }
    if (project.id === 'youtube-thumbnails') {
        return 'View Channel';
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
  
  const getCallToActionIcon = () => {
    if (project.id === 'youtube-thumbnails') {
        return <YoutubeIcon className="w-4 h-4" />;
    }
    return <ArrowUpRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />;
  }

  return (
    <Link 
      href={`/projects/${project.id}`} 
      className="group block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="h-full flex flex-col transition-all duration-300 ease-in-out md:group-hover:shadow-xl md:group-hover:-translate-y-1">
        <CardHeader className="p-6">
          <div className="aspect-video relative overflow-hidden rounded-lg mb-4 bg-muted">
            {image && (
                <>
                    {project.videoPreview && project.videoPreview.endsWith('.mp4') && (
                        <video
                            ref={videoRef}
                            src={project.videoPreview}
                            loop
                            muted
                            playsInline
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 hidden md:block ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                    
                    <Image
                        src={image.imageUrl}
                        alt={project.name}
                        fill
                        className={`object-cover transition-transform duration-300 ${!project.videoPreview ? 'group-hover:scale-105' : ''} ${project.videoPreview && project.videoPreview.endsWith('.mp4') && isHovered ? 'md:opacity-0' : 'opacity-100'}`}
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
                {skillsToShow.map((tech) => {
                  const skillSlug = encodeURIComponent(tech.toLowerCase().replace(/\s/g, '-').replace(/\./g, ''));
                  return (
                    <Link key={tech} href={`/skill/${skillSlug}`} onClick={(e) => e.stopPropagation()} className="z-10">
                        <Badge variant="secondary" className="transition-colors hover:bg-primary/20 hover:text-primary">
                            {tech}
                        </Badge>
                    </Link>
                  )
                })}
                {remainingSkillsCount > 0 && (
                    <Badge variant="secondary">
                        +{remainingSkillsCount}
                    </Badge>
                )}
            </div>
             <span className={cn(
                "text-sm text-accent flex items-center gap-1",
                project.id === 'simply' && 'hidden md:flex'
              )}>
                {getCallToAction()} {getCallToActionIcon()}
            </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
