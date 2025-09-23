
"use client";

import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Project } from "@/lib/projects";
import { Button } from "@/components/ui/button";

const experience = [
  {
    role: "B.S. in Computer Science",
    company: "Macaulay Honors College at CCNY",
    period: "2025 - 2029 (Expected)",
    description: "Pursuing a degree in Computer Science while building and managing my own tech projects. Based in Manhattan, New York.",
    icon: <GraduationCap className="w-5 h-5 text-primary" />
  },
  {
    role: "Founder & Developer",
    company: "Vernato",
    period: "June 2025 - Present",
    description: "Vernato is an AI-powered pronunciation improvement platform helping learners speak with clarity and confidence. Our PronScore™ model combines accuracy, fluency, and completeness into a single score, giving users actionable feedback that actually drives progress.",
    icon: <Briefcase className="w-5 h-5 text-primary" />
  },
  {
    role: "Lead Developer and App Designer",
    company: "EMTY Commuting App",
    period: "Aug 2024 – April 2025",
    description: "Designed UX in Figma to display real-time subway car occupancy; built secure real-time backend with Firebase Auth and Realtime Database. Presented EMTY at the U.S. Capitol and to Congressman Adriano Espaillat’s office.",
    icon: <Briefcase className="w-5 h-5 text-primary" />
  },
  {
    role: "Founder & Developer",
    company: "Simplify Me.",
    period: "Jan 2023 - May 2025",
    description: "You know when you sign up for a new website or download a shiny new app, and you’re hit with a wall of text that seems to go on forever? Yeah, that’s the Terms of Service. Our mission is simple: to help you make informed decisions about your privacy.",
    icon: <Briefcase className="w-5 h-5 text-primary" />
  },
];

interface AboutClientPageProps {
  allSkills: string[];
  activeSkills: string[];
  skillProjectMap: Record<string, Project[]>;
}

const ExperienceItem = ({ item, index }: { item: typeof experience[0], index: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [20, 0]);

  return (
    <div ref={ref} className="relative pl-12 md:pl-0 mb-12">
        <div className="absolute top-0 left-4 md:left-1/2 -translate-x-1/2 -translate-y-1 bg-background border-2 border-primary w-10 h-10 rounded-full flex items-center justify-center z-10">
            {item.icon}
        </div>
        <motion.div 
            style={{ opacity: scrollYProgress, y }}
            className={`md:flex items-center w-full ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
        >
            <div className="md:w-1/2"></div>
            <div className="md:w-1/2 md:px-8">
                <div className={`p-4 rounded-lg border bg-card shadow-sm ${index % 2 !== 0 ? 'md:text-right' : ''}`}>
                <p className="text-sm text-muted-foreground">{item.period}</p>
                <h3 className="font-headline text-xl font-bold text-primary">{item.role}</h3>
                <h4 className="font-semibold">{item.company}</h4>
                <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                </div>
            </div>
        </motion.div>
    </div>
  );
};

export function AboutClientPage({ allSkills, activeSkills, skillProjectMap }: AboutClientPageProps) {
    const journeyRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: journeyRef,
        offset: ["start center", "end end"]
    });
    
  return (
    <div className="animate-fade-in">
      <section className="flex flex-col justify-center min-h-[calc(100dvh-65px)] container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-4">I build tools to fix what's broken.</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-4 text-left md:text-center">
            <p>
                I'm a student founder based in Manhattan, currently studying Computer Science at Macaulay Honors College at CCNY (expected graduation May 2029). I've lived in way too many countries and been through way too many school systems. CBSE, IGCSE, APs, and now college. You name it, I've probably been confused by it at some point.
            </p>
            <p>
                All that moving around taught me that most things are way more complicated than they need to be. Like, why do privacy policies sound like they were written by robots for other robots? I got so annoyed reading those endless terms and conditions that I built <Link href="/projects/simplify-me">Simplify Me.</Link> It turns all that legal nonsense into actual English so people are informed about what companies are doing with their data.
            </p>
            <p>
                Then there's <Link href="/projects/vernato">Vernato</Link>. Moving around so much, I noticed that people speak the same language completely differently depending on where they're from. A British accent isn't more "correct" than an American one, and Spanish from Mexico isn't wrong just because it's different from Spanish from Spain. I got tired of apps that could mark you wrong for sounding different, so I built Vernato to actually recognize and teach these regional differences. It focuses on those tiny pronunciation details that other apps are too lazy to care about.
            </p>
            <p>
                The truth is, I just get really bothered when things don't work well. I end up building tools to fix whatever's driving me crazy. I'm always down to chat with people who also think technology should actually help people instead of just being impressive.
            </p>
          </div>
        </div>
      </section>

      <TooltipProvider delayDuration={100}>
        <section className="py-16 md:py-24 border-t">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">My Skillset</h2>
          <div className="relative w-full overflow-hidden group [mask-image:linear-gradient(to-right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
                  {[...allSkills, ...allSkills].map((skill, index) => {
                      const isClickable = activeSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                      const skillSlug = encodeURIComponent(skill.toLowerCase().replace(/\s/g, '-').replace(/\./g, ''));
                      const projectsForSkill = skillProjectMap[skill] || [];
                      const projectCount = projectsForSkill.length;

                      const badge = (
                          <Badge 
                              className={cn(
                                  "text-lg px-6 py-3 transition-colors duration-300 ease-in-out",
                                  isClickable ? "hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" : "opacity-50 cursor-not-allowed",
                              )}
                              variant="default"
                          >
                             {skill}
                          </Badge>
                      );

                      return (
                          <div key={index} className="mx-4 flex-shrink-0">
                             {isClickable ? (
                                  <Tooltip>
                                      <TooltipTrigger asChild>
                                          <Link href={`/skill/${skillSlug}`} aria-label={`View projects for ${skill}`}>
                                              {badge}
                                          </Link>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                          <div className="text-center p-2">
                                              <p className="font-bold text-base mb-2">
                                                  {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
                                              </p>
                                              <ul className="text-sm text-muted-foreground list-none p-0 m-0 space-y-1">
                                                  {projectsForSkill.map(p => <li key={p.id}>{p.name}</li>)}
                                              </ul>
                                              <Button variant="link" size="sm" className="mt-2 text-accent p-0 h-auto">View Projects</Button>
                                          </div>
                                      </TooltipContent>
                                  </Tooltip>
                              ) : (
                                  <div>{badge}</div>
                              )}
                          </div>
                      );
                  })}
              </div>
          </div>
        </section>
      </TooltipProvider>
      
      <section className="pt-16 md:pt-24 border-t">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-16">My Journey</h2>
        <div ref={journeyRef} className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 h-full w-0.5 bg-border"></div>
          <motion.div
            className="absolute left-4 md:left-1/2 md:-translate-x-1/2 h-full w-0.5 bg-primary origin-top"
            style={{ scaleY: scrollYProgress }}
          />
          {experience.map((item, index) => (
            <ExperienceItem key={index} item={item} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
