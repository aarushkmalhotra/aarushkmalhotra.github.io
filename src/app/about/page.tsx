
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Briefcase, GraduationCap } from "lucide-react";

const skills = [
  "TypeScript", "React", "Next.js", "Node.js", "Python", "Go",
  "Tailwind CSS", "Firebase", "PostgreSQL", "MongoDB", "Docker", "Kubernetes",
  "Google Cloud", "AWS", "Git", "CI/CD"
];

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
    role: "Founder & Developer",
    company: "Simplify Me.",
    period: "Jan 2023 - May 2025",
    description: "You know when you sign up for a new website or download a shiny new app, and you’re hit with a wall of text that seems to go on forever? Yeah, that’s the Terms of Service. Our mission is simple: to help you make informed decisions about your privacy.",
    icon: <Briefcase className="w-5 h-5 text-primary" />
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <section className="grid md:grid-cols-3 gap-12 items-center">
        <div className="md:col-span-1">
          <div className="relative aspect-square">
            <Image
              src="/portrait.jpg"
              alt="Profile Picture"
              fill
              className="rounded-lg object-cover shadow-lg"
              data-ai-hint="professional portrait"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-4">I build tools to fix what's broken.</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-4">
            <p>
              I'm a student founder based in Manhattan, currently studying Computer Science at Macaulay Honors College at CCNY (expected graduation May 2029). I've lived in way too many countries and been through way too many school systems. CBSE, IGCSE, APs, and now college. You name it, I've probably been confused by it at some point.
            </p>
            <p>
              You know when you sign up for a new website or download a shiny new app, and you’re hit with a wall of text that seems to go on forever? Yeah, that’s the Terms of Service. It’s like reading a novel written in legal jargon, and honestly, who has time for that? Our mission at <a href="/projects/simplify-me">Simplify Me.</a> is simple: to help you make informed decisions about your privacy. We’ll give you the key details you need to know, like what data is being collected, how it’s used, and who it’s shared with. We are based on the ToS;DR infrastructure and it abides their Terms of Service.
            </p>
            <p>
                At <a href="/projects/vernato">Vernato</a>, we're building an AI-powered pronunciation improvement platform to help learners speak with clarity and confidence. Our PronScore™ model combines accuracy, fluency, and completeness into a single score, giving users actionable feedback that actually drives progress. Built at the intersection of language learning and technology, Vernato is designed for individuals, educators, and organizations seeking a smarter way to master spoken language.
            </p>
            <p>
                The truth is, I just get really bothered when things don't work well. I end up building tools to fix whatever's driving me crazy. I'm always down to chat with people who also think technology should actually help people instead of just being impressive.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 border-t mt-16 md:mt-24">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">My Skillset</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {skills.map((skill) => (
            <Badge key={skill} className="text-base px-4 py-2" variant="default">
              {skill}
            </Badge>
          ))}
        </div>
      </section>
      
      <section className="py-16 md:py-24 border-t">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-16">My Journey</h2>
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 h-full w-0.5 bg-border"></div>
          {experience.map((item, index) => (
            <div key={index} className="relative pl-12 md:pl-0 mb-12">
               <div className="absolute top-0 left-4 md:left-1/2 -translate-x-1/2 -translate-y-1 bg-background border-2 border-primary w-10 h-10 rounded-full flex items-center justify-center">
                  {item.icon}
              </div>
               <div className={`md:flex items-center w-full ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="md:w-1/2"></div>
                  <div className="md:w-1/2 md:px-8">
                     <div className={`p-4 rounded-lg border bg-card shadow-sm ${index % 2 !== 0 ? 'md:text-right' : ''}`}>
                        <p className="text-sm text-muted-foreground">{item.period}</p>
                        <h3 className="font-headline text-xl font-bold text-primary">{item.role}</h3>
                        <h4 className="font-semibold">{item.company}</h4>
                        <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
