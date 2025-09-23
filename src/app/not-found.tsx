
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container mx-auto flex h-[calc(100dvh-129px)] items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center text-center">
        <h1 className="font-headline text-8xl font-bold tracking-tighter text-primary">
          404
        </h1>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Oops! Page Not Found.
        </h2>
        <p className="mt-4 max-w-md text-muted-foreground">
          It seems you've wandered off the beaten path. The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Go to Homepage
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/projects">
              View My Projects
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
