import projectsData from './data/projects.json';

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  techStack: string;
  outcomes: string;
  repoUrl: string | null;
  demoUrl: string | null;
  images: string[];
  theme: {
    primary: string;
    secondary: string;
  };
}

// In a real app, you might fetch this from a CMS or API
export async function getProjects(): Promise<Project[]> {
  // We can add validation here with Zod in a real project
  return projectsData as Project[];
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id);
}
