"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { config } from "@/lib/config";
import { useResumeDialog } from "@/hooks/use-resume-dialog";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", "label": "About" },
  { href: "/contact", label: "Contact" },
  { href: "#resume", label: "Resume", isResume: true },
];

export function Header() {
  const pathname = usePathname();
  const [isMac, setIsMac] = useState(false);
  const { ResumeDialogComponent, openResumeDialog } = useResumeDialog();

  useEffect(() => {
    const platform = navigator.platform.toUpperCase();
    setIsMac(platform.includes('MAC'));
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto px-4 flex h-16 items-center">
        <Link href="/" className="group flex items-center gap-2 font-headline text-lg font-bold mr-auto">
          <Image
            src="/portrait.jpg"
            alt={`${config.siteName} Logo`}
            width={32}
            height={32}
            className="rounded-full transition-transform duration-300 md:group-hover:scale-105"
          />
          <span className="hidden md:block relative overflow-hidden h-7">
            <span className="block transition-transform duration-500 ease-in-out md:group-hover:-translate-y-full">
              {config.siteName}
            </span>
            <span className="absolute top-0 left-0 block text-primary transition-transform duration-500 ease-in-out translate-y-full md:group-hover:translate-y-0">
              {config.siteName}
            </span>
          </span>
          <span className="md:hidden">{config.siteName}</span>
        </Link>
        
        <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                {navLinks.map((link) => {
                  if (link.isResume) {
                    return (
                      <button
                        key={link.href}
                        onClick={openResumeDialog}
                        className={cn(
                          "transition-colors hover:text-foreground flex items-center gap-1.5",
                          "text-muted-foreground"
                        )}
                      >
                        {link.label}
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    );
                  }
                  return (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      className={cn(
                        "transition-colors hover:text-foreground flex items-center gap-1.5",
                        pathname === link.href ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
            </nav>
            <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center text-[11px] text-muted-foreground mr-2">
                  <span className="px-1.5 py-0.5 border rounded-md bg-muted/50">{isMac ? '⌘' : 'Ctrl'}</span>
                  <span className="mx-0.5">+</span>
                  <span className="px-1.5 py-0.5 border rounded-md bg-muted/50">K</span>
                </div>
                <ThemeToggle />
                <MobileNav navLinks={navLinks} onResumeClick={openResumeDialog} />
            </div>
        </div>
      </div>

      {ResumeDialogComponent}
    </header>
  );
}

