import { ProjectsClientPage } from "./ProjectsClientPage";

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          My Work
        </h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
          Here's a collection of projects I've built. Each one represents a unique
          challenge and a story of creative problem-solving.
        </p>
      </div>
      <ProjectsClientPage />
    </div>
  );
}
