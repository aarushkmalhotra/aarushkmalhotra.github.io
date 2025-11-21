"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Props = { skills: string[] };

export default function SkillList({ skills }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  // Filter for mobile: hide skills that are two+ words AND do not include allowed terms
  const visibleSkills = useMemo(() => {
    if (isDesktop) return skills;
    const allowedRe = /(google|api|css|learning)/i;
    return skills.filter((s) => {
      const wordCount = s.trim().split(/\s+/).filter(Boolean).length;
      const hasTwoOrMoreWords = wordCount >= 2;
      const includesAllowed = allowedRe.test(s);
      // hide only when both conditions are met
      return !(hasTwoOrMoreWords && !includesAllowed);
    });
  }, [skills, isDesktop]);

  // Desktop: first 18; Mobile: first 15 with collapsible remainder (after filtering)
  const firstChunk = isDesktop ? visibleSkills.slice(0, 18) : visibleSkills.slice(0, 15);
  const rest = isDesktop ? [] : visibleSkills.slice(15);
  const restRef = useRef<HTMLDivElement | null>(null);
  const [restHeight, setRestHeight] = useState(0);

  // detect md+ (Tailwind md breakpoint is 768px)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // measure rest height for collapse animation
  useEffect(() => {
    if (restRef.current) {
      setRestHeight(restRef.current.scrollHeight);
    }
  }, [visibleSkills, expanded, isDesktop]);

  // Reset collapse when switching to desktop
  useEffect(() => {
    if (isDesktop) setExpanded(false);
  }, [isDesktop]);

  // Layout rules:
  // - Desktop (md+): show all skills, left-aligned (justify-start), full width per row (w-full), very small gaps
  // - Mobile: show first 6 initially, 3 per row (w-1/3), centered items

  return (
    <div className="w-full">
      {/* Visible area (firstChunk) */}
      <div className={`flex flex-wrap ${isDesktop ? 'justify-start gap-2 overflow-y-auto max-h-[568px]' : 'justify-start gap-2'}`}>
        {firstChunk.map((skill) => {
          const skillSlug = encodeURIComponent(skill.toLowerCase().replace(/\s/g, '-').replace(/\./g, ''));
          // mobile: 3 per row (w-1/3). desktop: flexible items with a base width so wrapping controls columns
          return (
            <div key={skill} className={isDesktop ? 'flex-grow flex-shrink basis-48 px-0' : 'flex-initial px-1'}>
              <Link href={`/skill/${skillSlug}`} className="w-full block">
                <Badge className={`text-base px-3 py-2 ${isDesktop ? 'w-full' : 'w-auto'} flex items-center justify-center text-center whitespace-nowrap transition-colors hover:bg-primary hover:text-primary-foreground`} variant="default">
                  {skill}
                </Badge>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Mobile collapsible rest */}
      {!isDesktop && rest.length > 0 && (
        <div
          ref={restRef}
          className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
          style={{ maxHeight: expanded ? restHeight : 0 }}
          aria-hidden={!expanded}
        >
          <div className="flex flex-wrap justify-start gap-2 mt-2">
            {rest.map((skill) => {
              const skillSlug = encodeURIComponent(skill.toLowerCase().replace(/\s/g, '-').replace(/\./g, ''));
              return (
                <div key={skill} className="flex-initial px-1">
                  <Link href={`/skill/${skillSlug}`} className="w-full block">
                    <Badge className="text-base px-3 py-2 w-auto flex items-center justify-center text-center whitespace-nowrap transition-colors hover:bg-primary hover:text-primary-foreground" variant="default">
                      {skill}
                    </Badge>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!isDesktop && rest.length > 0 && (
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setExpanded(e => !e)}
            className="text-accent underline-offset-4 hover:underline"
          >
            {expanded ? 'Show less' : `Show more (${rest.length})`}
          </button>
        </div>
      )}

      {isDesktop && (
        <div className="mt-4 text-right hidden md:block">
          <Button asChild variant="link" className="text-accent p-0 text-base">
            <Link href="/about#skills">See all skills →</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
