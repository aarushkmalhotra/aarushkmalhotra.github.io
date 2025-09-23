
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
            <a href="mailto:aarush@vernato.org" aria-label="Email" target="_blank" rel="noopener noreferrer">
                <Mail className="h-6 w-6 text-secondary-foreground/60 transition-colors hover:text-primary" />
            </a>
            <a href="https://github.com/simplifyme7" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GithubIcon className="h-6 w-6 text-secondary-foreground/60 transition-colors hover:text-[#181717] dark:hover:text-white" />
            </a>
            <a href="https://linkedin.com/in/kumaraarush" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedinIcon className="h-6 w-6 text-secondary-foreground/60 transition-colors hover:text-[#0A66C2]" />
            </a>
            <a href="https://instagram.com/aarush.nyc" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon className="h-6 w-6 text-secondary-foreground/60 transition-colors hover:text-[#E1306C]" />
            </a>
          </div>
        </div>
      </footer>
    );
  }
  
