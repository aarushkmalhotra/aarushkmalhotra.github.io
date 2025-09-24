import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailLoading() {
  return (
    <div className="animate-pulse">
      {/* Project Header Skeleton */}
      <div className="sticky top-[64px] z-40">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border bg-background">
            <div className="flex items-center gap-4 flex-grow">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <div className="hidden sm:flex flex-shrink-0 items-center gap-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
             <div className="sm:hidden flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-grow">
                    <Skeleton className="h-9 w-full rounded-md" />
                    <Skeleton className="h-9 w-full rounded-md" />
                </div>
                 <div className="flex-shrink-0 flex items-center gap-2">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Overview Skeleton */}
            <div>
              <Skeleton className="h-8 w-1/3 mb-6" />
              <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={`ov-${i}`} className={`h-4 ${i % 3 === 2 ? 'w-5/6' : 'w-full'}`} />
                ))}
              </div>
            </div>

            {/* Outcomes Skeleton */}
            <div>
              <Skeleton className="h-8 w-1/3 mb-6" />
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={`out-${i}`} className={`h-4 ${i % 2 === 0 ? 'w-full' : 'w-4/5'}`} />
                ))}
              </div>
            </div>

            {/* Gallery Skeleton */}
            <div>
              <Skeleton className="h-8 w-1/4 mb-6" />
              <Skeleton className="aspect-video w-full rounded-lg" />
            </div>
          </div>

          {/* Aside Skeleton (Timeline, Skills, Key Features) */}
          <aside className="hidden lg:block lg:col-span-1 space-y-4">
            {/* Timeline card */}
            <Skeleton className="h-24 w-full rounded-lg" />
            {/* Skills card */}
            <Skeleton className="h-32 w-full rounded-lg" />
            {/* Key Features card */}
            <div className="p-6 rounded-lg border bg-card">
              <Skeleton className="h-6 w-1/2 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={`kf-${i}`} className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
