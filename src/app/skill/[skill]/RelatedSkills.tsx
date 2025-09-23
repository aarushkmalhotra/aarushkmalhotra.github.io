
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface RelatedSkillsProps {
  skills: string[];
}

export function RelatedSkills({ skills }: RelatedSkillsProps) {
  if (skills.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 md:mt-24 border-t pt-12">
      <h2 className="font-headline text-2xl md:text-3xl text-center mb-8">Explore Related Skills</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {skills.map((skill) => {
          const skillSlug = encodeURIComponent(skill.toLowerCase().replace(/\s/g, '-').replace(/\./g, ''));
          return (
            <Link key={skill} href={`/skill/${skillSlug}`}>
              <Badge 
                variant="default" 
                className="text-base px-6 py-3 transition-transform hover:scale-105"
              >
                {skill}
              </Badge>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
