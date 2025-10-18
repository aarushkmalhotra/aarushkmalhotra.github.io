import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground md:hover:bg-accent md:hover:text-accent-foreground md:hover:shadow-md md:hover:shadow-primary/20",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground md:hover:bg-accent md:hover:text-accent-foreground md:hover:shadow-md",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground md:hover:bg-destructive/80 md:hover:shadow-md md:hover:shadow-destructive/20",
        outline: "text-foreground border-2 md:hover:bg-accent md:hover:text-accent-foreground md:hover:border-accent md:hover:shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
