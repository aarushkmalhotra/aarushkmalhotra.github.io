

import { ProjectCard } from "@/components/ProjectCard";
import { getProjects, getSkills as getAllSkillsData } from "@/lib/projects";
import { notFound } from "next/navigation";
import { Metadata } from "next";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Terminal } from "lucide-react";
// import { SkillClientPage } from "./SkillClientPage";

type Props = {
  params: { skill: string };
};

// Function to get all unique skills from projects for static generation
function getAllSkills() {
    const { allSkills } = getAllSkillsData();
    return allSkills;
}

// Generate static paths for each skill
export function generateStaticParams() {
  const skills = getAllSkills();
  return skills.map((skill) => ({
    skill: encodeURIComponent(skill.toLowerCase().replace(/\s/g, '-').replace(/\./g, '')),
  }));
}

// Generate metadata for the page
export function generateMetadata({ params }: Props): Metadata {
  const { skill } = params;
  const decodedSkill = decodeURIComponent(skill.replace(/-/g, ' '));
  const capitalizedSkill = decodedSkill.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: `Projects with ${capitalizedSkill} – Aarush's Portfolio`,
    description: `A collection of projects built using ${capitalizedSkill}.`,
  };
}

// The page component
export default function ProjectsBySkillPage({ params }: Props) {
  const { skill } = params;
  const allProjects = getProjects();
  
  // This logic needs to be robust enough to handle the slug transformation.
  // "nextjs" in URL should match "Next.js" in tech stack.
  const decodedSkillParam = decodeURIComponent(skill).replace(/-/g, ' ');

  const filteredProjects = allProjects.filter(project => 
    project.techStack.toLowerCase().split(',').map(s => s.trim().replace(/\./g,'')).includes(decodedSkillParam.toLowerCase())
  );

  if (filteredProjects.length === 0) {
    // A simple way to find the original skill name before it was slugified.
    const allSkills = getAllSkills();
    const originalSkill = allSkills.find(s => s.toLowerCase().replace(/\s/g, '-').replace(/\./g, '') === skill);
    if (!originalSkill) notFound(); // Truly not found
  }

  // Capitalize for display
  const displaySkill = filteredProjects.length > 0
    ? filteredProjects[0].techStack.split(',').map(s => s.trim()).find(s => s.toLowerCase().replace(/\s/g, '-').replace(/\./g, '') === skill) || decodeURIComponent(skill).replace(/-/g, ' ')
    : decodeURIComponent(skill).replace(/-/g, ' ');

  const capitalizedSkill = displaySkill.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Projects using <span className="text-primary">{capitalizedSkill}</span>
        </h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
          A deep dive into my work with {capitalizedSkill}. Use the AI assistant below to get a summary of my experience.
        </p>
      </div>
      
      {/* 
        NOTE FOR VERCEL/SERVER DEPLOYMENT:
        The AI Skill Navigator feature uses Server Actions, which are not compatible with static export (`output: 'export'`).
        To re-enable this feature for a server environment:
        1. Uncomment the `SkillClientPage` import at the top of this file.
        2. Uncomment the `<SkillClientPage ... />` component below.
      */}
      {/* <SkillClientPage skill={capitalizedSkill} projects={filteredProjects} /> */}
      
      {filteredProjects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div key={project.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
            <p className="text-muted-foreground">No projects found for this skill.</p>
        </div>
      )}

    </div>
  );
}
