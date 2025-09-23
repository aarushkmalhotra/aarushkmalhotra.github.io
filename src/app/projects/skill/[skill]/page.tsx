
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects, Project } from "@/lib/projects";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
  params: { skill: string };
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
    skill: encodeURIComponent(skill.toLowerCase().replace(/\s/g, '-')),
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const decodedSkill = decodeURIComponent(params.skill).replace(/-/g, ' ');
  const capitalizedSkill = decodedSkill.charAt(0).toUpperCase() + decodedSkill.slice(1);

  return {
    title: `Projects with ${capitalizedSkill} | Aarush's Portfolio`,
    description: `A collection of projects built using ${capitalizedSkill}.`,
  };
}

// The page component
export default async function ProjectsBySkillPage({ params }: Props) {
  const allProjects = await getProjects();
  const decodedSkill = decodeURIComponent(params.skill).replace(/-/g, ' ');

  const filteredProjects = allProjects.filter(project => 
    project.techStack.toLowerCase().split(',').map(s => s.trim()).includes(decodedSkill.toLowerCase())
  );

  if (filteredProjects.length === 0) {
    // Or render a "No projects found" message
    notFound();
  }

  const capitalizedSkill = decodedSkill.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Projects using <span className="text-primary">{capitalizedSkill}</span>
        </h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
          Here's a collection of my work where I've utilized {capitalizedSkill}.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <div key={project.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
