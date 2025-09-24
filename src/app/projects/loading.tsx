import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          My Work
        </h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
          Here&apos;s a collection of projects I&apos;ve built. Each one represents
          a unique challenge and a story of creative problem-solving.
        </p>
      </div>
      {/* No skeleton for controls; they render instantly in the client component */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 rounded-lg border bg-card text-card-foreground shadow-sm p-6"
          >
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full mt-2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
