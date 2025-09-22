import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
        <SheetContent side="left">
          <div className="flex flex-col h-full">
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
            <nav className="flex flex-col gap-6 p-4 text-lg font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
