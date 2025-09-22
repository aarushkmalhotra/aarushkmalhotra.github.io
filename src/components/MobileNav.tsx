import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { GithubIcon } from "./icons/GithubIcon";
import { LinkedinIcon } from "./icons/LinkedinIcon";
import { InstagramIcon } from "./icons/InstagramIcon";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  navLinks: NavLink[];
}

export function MobileNav({ navLinks }: MobileNavProps) {
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
          <div className="border-b p-4">
              <Link href="/" className="flex items-center gap-2 font-headline text-lg font-bold">
                  <Image
                      src="/portrait.jpg"
                      alt="Aarush's Portfolio Logo"
                      width={32}
                      height={32}
                      className="rounded-full"
                  />
                  <span>Aarush's Portfolio</span>
              </Link>
          </div>
          <nav className="flex-grow flex flex-col gap-6 p-4 text-lg font-medium">
            {navLinks.map((link) => (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </SheetClose>
            ))}
          </nav>
          <div className="border-t p-4">
            <div className="flex justify-center gap-6">
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <GithubIcon className="h-7 w-7 text-secondary-foreground/60 transition-colors hover:text-[#181717] dark:hover:text-white" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <LinkedinIcon className="h-7 w-7 text-secondary-foreground/60 transition-colors hover:text-[#0A66C2]" />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <InstagramIcon className="h-7 w-7 text-secondary-foreground/60 transition-colors hover:text-[#E1306C]" />
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
