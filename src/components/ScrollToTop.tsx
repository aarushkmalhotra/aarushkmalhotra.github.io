"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const isMobile = useIsMobile();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Hide on mobile for projects/[slug] pages
  if (isMobile && pathname.startsWith('/projects/')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      <Button
        variant="outline"
        onClick={scrollToTop}
        className={cn(
          'bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hover:bg-primary md:hover:text-primary-foreground h-10 w-10 md:h-14 md:w-14 rounded-full shadow-lg border-2 md:border-3',
          isVisible ? 'opacity-100' : 'opacity-0',
          !isVisible && 'pointer-events-none'
        )}
        aria-label="Scroll to top"
      >
        <ArrowUpIcon className="h-4 w-4 md:h-6 md:w-6" />
      </Button>
    </div>
  );
}
