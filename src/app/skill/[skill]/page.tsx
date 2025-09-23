import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/projects";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SkillClientPage } from "./SkillClientPage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

type Props = {
  params: Promise<{ skill: string }>;
};

// Function to get all unique skills from projects for static generation
async function getAllSkills() {
    const projects = await getProjects();
    const allSkills = new Set<string>();
    projects.forEach(project => {
        project.techStack.split(',').forEach(skill => {
            allSkills.add(skill.trim());
        });
    });
    return Array.from(allSkills);
}

// Generate static paths for each skill
export async function generateStaticParams() {
  const skills = await getAllSkills();
  return skills.map((skill) => ({
    skill: encodeURIComponent(skill.toLowerCase().replace(/\s/g, '-').replace(/\./g, '')),
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { skill } = await params;
  const decodedSkill = decodeURIComponent(skill.replace(/-/g, ' '));
  const capitalizedSkill = decodedSkill.charAt(0).toUpperCase() + decodedSkill.slice(1);

  return {
    title: `Projects with ${capitalizedSkill} – Aarush's Portfolio`,
    description: `A collection of projects built using ${capitalizedSkill}.`,
  };
}

// The page component
export default async function ProjectsBySkillPage({ params }: Props) {
  const { skill } = await params;
  const allProjects = await getProjects();
  
  // This logic needs to be robust enough to handle the slug transformation.
  // "nextjs" in URL should match "Next.js" in tech stack.
  const decodedSkillParam = decodeURIComponent(skill).replace(/-/g, ' ');

  const filteredProjects = allProjects.filter(project => 
    project.techStack.toLowerCase().split(',').map(s => s.trim().replace(/\./g,'')).includes(decodedSkillParam.toLowerCase())
  );

  if (filteredProjects.length === 0) {
    // A simple way to find the original skill name before it was slugified.
    const allSkills = await getAllSkills();
    const originalSkill = allSkills.find(s => s.toLowerCase().replace(/\s/g, '-').replace(/\./g, '') === skill);
    if (!originalSkill) notFound(); // Truly not found
  }

  // Capitalize for display
  const displaySkill = filteredProjects.length > 0
    ? filteredProjects[0].techStack.split(',').map(s => s.trim()).find(s => s.toLowerCase().replace(/\s/g, '-').replace(/\./g, '') === skill) || decodeURIComponent(skill).replace(/-/g, ' ')
    : decodeURIComponent(skill).replace(/-/g, ' ');

  const capitalizedSkill = displaySkill.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const isStaticExport = process.env.NEXT_PUBLIC_IS_STATIC_EXPORT === 'true';

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
      
      {isStaticExport ? (
        <Alert className="mb-12">
          <Terminal className="h-4 w-4" />
          <AlertTitle>AI Feature Disabled</AlertTitle>
          <AlertDescription>
            The AI-powered skill analysis is unavailable in this statically-exported version of the site. Please run the project locally to use this feature.
          </AlertDescription>
        </Alert>
      ) : (
        <SkillClientPage skill={capitalizedSkill} projects={filteredProjects} />
      )}
      
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
