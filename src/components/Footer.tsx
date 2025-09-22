import { GithubIcon } from "./icons/GithubIcon";
import { LinkedinIcon } from "./icons/LinkedinIcon";
import { InstagramIcon } from "./icons/InstagramIcon";
import Link from "next/link";
import { Mail } from "lucide-react";

export function Footer() {
    return (
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Aarush Kumar. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="mailto:aarush@vernato.org" aria-label="Email">
                <Mail className="h-6 w-6 text-secondary-foreground/60 transition-colors hover:text-primary" />
            </Link>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GithubIcon className="h-6 w-6 text-secondary-foreground/60 transition-colors hover:text-[#181717] dark:hover:text-white" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedinIcon className="h-6 w-6 text-secondary-foreground/60 transition-colors hover:text-[#0A66C2]" />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon className="h-6 w-6 text-secondary-foreground/60 transition-colors hover:text-[#E1306C]" />
            </Link>
          </div>
        </div>
      </footer>
    );
  }
  