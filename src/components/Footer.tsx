
import { GithubIcon } from "./icons/GithubIcon";
import { LinkedinIcon } from "./icons/LinkedinIcon";
import { InstagramIcon } from "./icons/InstagramIcon";
import Link from "next/link";
import { Mail } from "lucide-react";
import { config } from "@/lib/config";

export function Footer() {
    return (
      <footer className="border-t relative z-50 bg-background">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {config.fullName}. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {config.email && config.email !== "" && (
              <a href={`mailto:${config.email}`} aria-label="Email" target="_blank" rel="noopener noreferrer">
                <Mail className="h-6 w-6 text-secondary-foreground/60 transition-colors hover:text-primary" />
              </a>
            )}
            {config.social?.github && config.social.github !== "" && (
              <a href={config.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GithubIcon className="h-6 w-6 text-secondary-foreground/60 transition-colors hover:text-[#181717] dark:hover:text-white" />
              </a>
            )}
            {config.social?.linkedin && config.social.linkedin !== "" && (
              <a href={config.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedinIcon className="h-6 w-6 text-secondary-foreground/60 transition-colors hover:text-[#0A66C2]" />
              </a>
            )}
            {config.social?.instagram && config.social.instagram !== "" && (
              <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon className="h-6 w-6 text-secondary-foreground/60 transition-colors hover:text-[#E1306C]" />
              </a>
            )}
          </div>
        </div>
      </footer>
    );
  }
  
