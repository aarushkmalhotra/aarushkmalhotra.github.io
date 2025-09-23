

"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { FileText, Mail, Menu, PanelLeftClose } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { GithubIcon } from "./icons/GithubIcon";
import { LinkedinIcon } from "./icons/LinkedinIcon";
import { InstagramIcon } from "./icons/InstagramIcon";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
  isExternal?: boolean;
}

interface MobileNavProps {
  navLinks: NavLink[];
}

export function MobileNav({ navLinks }: MobileNavProps) {
  const pathname = usePathname();
  
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu />
            <span className="sr-only">Open Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <div className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-headline text-lg font-bold">
                  <Image
                      src="/portrait.jpg"
                      alt="Aarush's Portfolio Logo"
                      width={32}
                      height={32}
                      className="rounded-full"
                  />
                  <span>Aarush's Portfolio</span>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <PanelLeftClose />
                  <span className="sr-only">Close Menu</span>
                </Button>
              </SheetClose>
          </div>
          <nav className="flex-grow flex flex-col gap-6 p-4 text-lg font-medium">
            {navLinks.map((link) => (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  target={link.isExternal ? "_blank" : undefined}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                  className={cn(
                    "transition-colors hover:text-foreground flex items-center gap-2",
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                  {link.isExternal && <FileText className="w-4 h-4" />}
                </Link>
              </SheetClose>
            ))}
          </nav>
          <div className="border-t p-4">
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="mailto:aarush@vernato.org" aria-label="Email" target="_blank" rel="noopener noreferrer">
                <Mail className="h-6 w-6 text-secondary-foreground/60 transition-colors hover:text-primary" />
            </a>
            <a href="https://github.com/aarushkmalhotra" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
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
        </SheetContent>
      </Sheet>
    </div>
  );
}

    