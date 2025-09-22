import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const skills = [
  "TypeScript", "React", "Next.js", "Node.js", "Python", "Go",
  "Tailwind CSS", "Firebase", "PostgreSQL", "MongoDB", "Docker", "Kubernetes",
  "Google Cloud", "AWS", "Git", "CI/CD"
];

const experience = [
  {
    role: "Senior Software Engineer",
    company: "Tech Solutions Inc.",
    period: "2020 - Present",
    description: "Lead developer on a new cloud-native platform. Responsible for architecting backend services, mentoring junior developers, and implementing CI/CD pipelines.",
  },
  {
    role: "Full Stack Developer",
    company: "Innovate Co.",
    period: "2018 - 2020",
    description: "Developed and maintained features for a large-scale e-commerce application. Worked across the stack from React frontend to Node.js backend.",
  },
  {
    role: "Junior Developer",
    company: "Digital Starters",
    period: "2016 - 2018",
    description: "Built responsive websites and internal tools for various clients. Gained foundational experience in web development and agile methodologies.",
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
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-4">About Me</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
            <p>
              I am a passionate software engineer with a knack for building elegant, efficient, and scalable solutions. My journey in technology began with a fascination for how things work, which quickly evolved into a career dedicated to crafting high-quality software.
            </p>
            <p>
              With over 8 years of experience, I've had the opportunity to work on a diverse range of projects, from nimble startups to large-scale enterprise systems. I thrive in collaborative environments and am always eager to learn new technologies and tackle complex challenges.
            </p>
            <p>
              When I'm not coding, you can find me exploring the great outdoors, contributing to open-source projects, or experimenting with new recipes in the kitchen.
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
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-16">Career Journey</h2>
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-border"></div>
          {experience.map((item, index) => (
            <div key={index} className="relative mb-12 flex items-center justify-between w-full">
              <div className={`w-5/12 ${index % 2 === 0 ? 'order-1' : 'order-3 text-right'}`}>
                <p className="text-sm text-muted-foreground">{item.period}</p>
                <h3 className="font-headline text-xl font-bold text-primary">{item.role}</h3>
                <h4 className="font-semibold">{item.company}</h4>
                <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
              </div>
              <div className="order-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center z-10">
                <div className="w-3 h-3 bg-primary-foreground rounded-full"></div>
              </div>
              <div className="w-5/12"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
