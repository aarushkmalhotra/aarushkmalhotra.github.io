import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailLoading() {
  return (
    <div className="animate-pulse">
      {/* Project Header Skeleton */}
      <div className="sticky top-[64px] z-40">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 pt-4">
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
      <div className="max-w-7xl mx-auto px-4 xl:px-0 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Overview Skeleton */}
            <div>
              <Skeleton className="h-8 w-1/3 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>

            {/* Outcomes Skeleton */}
            <div>
              <Skeleton className="h-8 w-1/3 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>

            {/* Gallery Skeleton */}
            <div>
              <Skeleton className="h-8 w-1/4 mb-6" />
              <Skeleton className="aspect-video w-full rounded-lg" />
            </div>
          </div>

          {/* Aside Skeleton */}
          <aside className="hidden lg:block lg:col-span-1 space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </aside>
        </div>
      </div>
    </div>
  );
}
