
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects, getAllSkills, getRelatedSkills } from "@/lib/projects";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
// import { SkillClientPage } from "./SkillClientPage";
import { RelatedSkills } from "./RelatedSkills";


type Props = {
  params: Promise<{ skill: string }>;
};

// Generate static paths for each skill
export function generateStaticParams() {
  const skills = getAllSkills();
  return skills.map((skill) => ({
    skill: encodeURIComponent(skill.toLowerCase().replace(/\s/g, '-').replace(/\./g, '')),
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { skill } = await params;
  const decodedSkill = decodeURIComponent(skill.replace(/-/g, ' '));
  const capitalizedSkill = decodedSkill.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: `Projects with ${capitalizedSkill} – Aarush's Portfolio`,
    description: `A collection of projects built using ${capitalizedSkill}.`,
  };
}

// The page component
export default async function ProjectsBySkillPage({ params }: Props) {
  const { skill } = await params;
  const allProjects = getProjects();
  
  // This logic needs to be robust enough to handle the slug transformation.
  // "nextjs" in URL should match "Next.js" in tech stack.
  const decodedSkillParam = decodeURIComponent(skill).replace(/-/g, ' ');

  const filteredProjects = allProjects.filter(project => 
    project.techStack.toLowerCase().split(',').map(s => s.trim().replace(/\./g,'')).includes(decodedSkillParam.toLowerCase())
  );

  if (filteredProjects.length === 0) {
    // A simple way to find the original skill name before it was slugified.
    const allSkillsList = getAllSkills();
    const originalSkill = allSkillsList.find(s => s.toLowerCase().replace(/\s/g, '-').replace(/\./g, '') === skill);
    if (!originalSkill) notFound(); // Truly not found
  }

  // Capitalize for display
  const displaySkill = filteredProjects.length > 0
    ? filteredProjects[0].techStack.split(',').map(s => s.trim()).find(s => s.toLowerCase().replace(/\s/g, '-').replace(/\./g, '') === skill) || decodeURIComponent(skill).replace(/-/g, ' ')
    : decodeURIComponent(skill).replace(/-/g, ' ');

  const capitalizedSkill = displaySkill.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  const relatedSkills = getRelatedSkills(capitalizedSkill, allProjects);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in overflow-x-hidden">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Projects using <span className="text-primary">{capitalizedSkill}</span>
        </h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
          A deep dive into my work with {capitalizedSkill}.
        </p>
      </div>
      
      {/* 
        <SkillClientPage skill={capitalizedSkill} projects={filteredProjects} />
      
        {process.env.NEXT_PUBLIC_IS_STATIC_EXPORT && (
          <Alert className="mb-12">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Developer Note</AlertTitle>
            <AlertDescription>
              The AI Skill Navigator is disabled on this static version of the site. This feature uses Server Actions and is fully functional in a server-based environment (e.g., when running locally or on Vercel).
            </AlertDescription>
          </Alert>
        )}
      */}

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-full overflow-hidden">
          {filteredProjects.map((project, index) => (
            <div key={project.id} style={{ animationDelay: `${index * 100}ms` }} className="min-w-0 overflow-hidden animate-fade-in-up">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
            <p className="text-muted-foreground">No projects found for this skill.</p>
        </div>
      )}

      <RelatedSkills skills={relatedSkills} />

    </div>
  );
}
