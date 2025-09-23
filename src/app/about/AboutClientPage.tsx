
"use client";

import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, FileText } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { SkillVisualization } from "@/components/SkillVisualization";
import { createPortal } from "react-dom";

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

// Custom skill popover component that renders above everything
const SkillPopover = ({ 
    skill, 
    isClickable, 
    skillProjectMap, 
    onHoverChange 
}: { 
    skill: string; 
    isClickable: boolean; 
    skillProjectMap: Record<string, Project[]>;
    onHoverChange: (hovered: boolean) => void;
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();
    
    const skillSlug = encodeURIComponent(skill.toLowerCase().replace(/\s/g, '-').replace(/\./g, ''));
    const projectsForSkill = skillProjectMap[skill] || [];
    const projectCount = projectsForSkill.length;

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsHovered(true);
        onHoverChange(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsHovered(false);
            onHoverChange(false);
        }, 200); // Longer delay to allow movement to popover
    };

    const updatePosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const popoverWidth = 320; // max-width of popover
            const popoverHeight = 240; // approximate height
            
            // Calculate center of the badge
            const badgeCenter = rect.left + rect.width / 2;
            let x = badgeCenter;
            let y = rect.top - popoverHeight - 20; // Position above the badge with more gap
            
            // Ensure popover doesn't go off-screen horizontally
            const halfPopoverWidth = popoverWidth / 2;
            if (x - halfPopoverWidth < 15) {
                x = halfPopoverWidth + 15;
            } else if (x + halfPopoverWidth > viewportWidth - 15) {
                x = viewportWidth - halfPopoverWidth - 15;
            }
            
            // If not enough space above, show below
            if (y < 15) {
                y = rect.bottom + 20;
            }
            
            setPosition({ x, y });
        }
    };

    useEffect(() => {
        if (isHovered) {
            updatePosition();
            const handleResize = () => updatePosition();
            const handlePositionUpdate = () => updatePosition();
            
            // Update position more frequently while hovered to handle marquee movement
            const positionInterval = setInterval(updatePosition, 16); // ~60fps
            
            window.addEventListener('resize', handleResize);
            window.addEventListener('scroll', handlePositionUpdate);
            
            return () => {
                window.removeEventListener('resize', handleResize);
                window.removeEventListener('scroll', handlePositionUpdate);
                clearInterval(positionInterval);
            };
        }
    }, [isHovered]);

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

    const popoverContent = isHovered && isClickable && typeof window !== 'undefined' ? createPortal(
        <>
            {/* Invisible hover bridge */}
            <div
                className="fixed z-[9998] pointer-events-auto"
                style={{
                    left: position.x - 50,
                    top: position.y + 240,
                    width: 100,
                    height: 30,
                    transform: 'translateX(-50%)'
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="fixed z-[9999] bg-card text-card-foreground border border-border rounded-lg shadow-xl backdrop-blur-sm min-w-[280px] max-w-[320px] skill-popover"
                style={{
                    left: position.x,
                    top: position.y,
                    transform: 'translateX(-50%)',
                    pointerEvents: 'auto'
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
            <div className="p-6">
                {/* Header */}
                <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-foreground mb-1">{skill}</h3>
                    <p className="text-sm text-muted-foreground">
                        {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
                    </p>
                </div>
                
                {/* Projects List */}
                {projectsForSkill.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-foreground mb-2">Recent Projects:</h4>
                        <ul className="space-y-2">
                            {projectsForSkill.slice(0, 3).map(p => (
                                <li key={p.id} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                                    <span className="text-sm text-foreground truncate">{p.name}</span>
                                </li>
                            ))}
                            {projectsForSkill.length > 3 && (
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full flex-shrink-0" />
                                    <span className="text-xs text-muted-foreground">
                                        +{projectsForSkill.length - 3} more project{projectsForSkill.length - 3 !== 1 ? 's' : ''}
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
                
                {/* Call to Action */}
                <div className="text-center pt-2 border-t border-border">
                    <Link 
                        href={`/skill/${skillSlug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors cursor-pointer"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <span>Explore all projects</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
            
            {/* Enhanced Arrow pointing down */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-border" />
                <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-card absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-[-1px]" />
            </div>
        </motion.div>
        </>,
        document.body
    ) : null;

    return (
        <div className="mx-4 flex-shrink-0">
            <div
                ref={triggerRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isClickable ? (
                    <Link href={`/skill/${skillSlug}`} aria-label={`View projects for ${skill}`}>
                        {badge}
                    </Link>
                ) : (
                    <div>{badge}</div>
                )}
            </div>
            {popoverContent}
        </div>
    );
};

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

export default function AboutClientPage({ allSkills, activeSkills, skillProjectMap }: AboutClientPageProps) {
  const journeyRef = useRef(null);
  const [isSkillHovered, setIsSkillHovered] = useState(false);
  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ["start end", "end start"]
  });  return (
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
          <div className="mt-8">
            <Button asChild size="lg">
                <Link href="/resume-09-25.pdf" target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-5 w-5" />
                    View My Resume
                </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 border-t">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">My Skillset</h2>
        
        <div id="skill-carousel-wrapper" className="relative w-full overflow-hidden">
            <div id="skill-carousel" className={cn("relative w-full group flex overflow-hidden", isSkillHovered && "[&_.marquee-content]:[animation-play-state:paused]")}>
                <div className={cn("flex animate-marquee group-hover:[animation-play-state:paused] marquee-content whitespace-nowrap", isSkillHovered && "[animation-play-state:paused]")}>
                    {allSkills.map((skill, index) => {
                        const isClickable = activeSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                        return <SkillPopover key={`${skill}-${index}-1`} skill={skill} isClickable={isClickable} skillProjectMap={skillProjectMap} onHoverChange={setIsSkillHovered} />
                    })}
                    {allSkills.map((skill, index) => {
                        const isClickable = activeSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                        return <SkillPopover key={`${skill}-${index}-2`} skill={skill} isClickable={isClickable} skillProjectMap={skillProjectMap} onHoverChange={setIsSkillHovered} />
                    })}
                </div>
            </div>
            <div className="absolute inset-y-0 left-0 w-1/12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
        </div>
      </section>
      
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

    