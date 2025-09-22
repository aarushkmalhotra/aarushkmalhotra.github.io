
"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", "label": "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-headline text-lg font-bold mr-auto">
          <Image
            src="/portrait.jpg"
            alt="Aarush's Portfolio Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span>Aarush's Portfolio</span>
        </Link>
        
        <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      className={cn(
                        "transition-colors hover:text-foreground",
                        pathname === link.href ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                    {link.label}
                    </Link>
                ))}
            </nav>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <MobileNav navLinks={navLinks} />
            </div>
        </div>
      </div>
    </header>
  );
}
