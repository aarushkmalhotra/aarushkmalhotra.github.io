import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-1/3 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto mt-4" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-4 rounded-lg border bg-card text-card-foreground shadow-sm">
             <Skeleton className="aspect-video w-full rounded-t-lg" />
             <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-12 w-full" />
                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
