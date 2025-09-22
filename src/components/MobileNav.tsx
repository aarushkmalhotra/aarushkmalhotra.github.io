"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";

interface NavLink {
    href: string;
    label: string;
}

interface MobileNavProps {
    navLinks: NavLink[];
}

export function MobileNav({ navLinks }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                <Menu />
                <span className="sr-only">Open Menu</span>
            </Button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-fade-in"
                >
                    <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 font-headline text-lg font-bold">
                            <span>Aarush's Portfolio</span>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                            <X />
                            <span className="sr-only">Close Menu</span>
                        </Button>
                    </div>
                    <nav className="flex flex-col items-center justify-center gap-8 text-2xl font-medium" style={{ height: 'calc(100vh - 4rem)' }}>
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-muted-foreground transition-colors hover:text-foreground animate-fade-in-up"
                                style={{ animationDelay: `${index * 100 + 100}ms` }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </div>
    );
}
