import { Github, Linkedin } from "lucide-react";
import { InstagramIcon } from "./icons/InstagramIcon";
import Link from "next/link";

export function Footer() {
    return (
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Aarush Kumar. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-6 w-6 text-secondary-foreground/60 transition-colors hover:text-foreground" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6 text-secondary-foreground/60 transition-colors hover:text-[#0A66C2]" />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon className="h-6 w-6 text-secondary-foreground/60 transition-colors hover:text-[#E1306C]" />
            </Link>
          </div>
        </div>
      </footer>
    );
  }
  