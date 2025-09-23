
import projectsData from './data/projects.json';
import { compareDesc, parseISO } from 'date-fns';

export interface AudioFile {
  id: string;
  title: string;
  file: string;
  originalArtist: string;
  originalLabel: string;
  originalComposer: string;
  originalLyricist: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  keyFeatures?: string[];
  techStack: string;
  outcomes: string;
  repoUrl: string | null;
  demoUrl: string | null;
  images: string[];
  theme: {
    primary: string;
    secondary: string;
  };
  startDate: string;
  endDate: string | null;
  type?: 'project' | 'contribution';
  audioFiles?: AudioFile[];
}

// In a real app, you might fetch this from a CMS or API
export async function getProjects(): Promise<Project[]> {
  const projects = projectsData as Project[];
  
  // Sort projects by end date (nulls first for "Present"), then by start date
  projects.sort((a, b) => {
    const aEndDate = a.endDate ? parseISO(a.endDate) : new Date();
    const bEndDate = b.endDate ? parseISO(b.endDate) : new Date();

    if(a.endDate === null && b.endDate !== null) return -1;
    if(a.endDate !== null && b.endDate === null) return 1;

    const endDateComparison = compareDesc(aEndDate, bEndDate);
    if(endDateComparison !== 0) return endDateComparison;

    return compareDesc(parseISO(a.startDate), parseISO(b.startDate));
  });

  return projects;
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id);
}

export async function getSkills() {
    const projects = await getProjects();
    const skillSet = new Set<string>();
    const skillProjectMap: Record<string, Project[]> = {};
    
    projects.forEach(project => {
        project.techStack.split(',').forEach(skillName => {
            const skill = skillName.trim();
            skillSet.add(skill);
            if (!skillProjectMap[skill]) {
                skillProjectMap[skill] = [];
            }
            skillProjectMap[skill].push(project);
        });
    });

    const activeSkills = Array.from(skillSet).sort();
    
    const allSkills = [
        ...activeSkills,
        "Swift", "C++" // Add skills without projects here
    ].sort((a, b) => a.localeCompare(b));

    // Deduplicate allSkills
    const uniqueAllSkills = [...new Set(allSkills)];

    return { allSkills: uniqueAllSkills, activeSkills, skillProjectMap };
}
