"use client";

import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, FileText, ExternalLink } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { SkillVisualization } from "@/components/SkillVisualization";
import { useRouter } from "next/navigation";
import { config } from "@/lib/config";
import { ResumeDialogTrigger } from "@/components/ResumeDialog";
import { AnchorScrollHandler } from "@/components/AnchorScrollHandler";

const experience = [
	{
		role: "B.S. in Computer Science",
		company: "Macaulay Honors College at CCNY",
		period: "2025 - 2029 (Expected)",
		description:
			"Pursuing a degree in Computer Science while building and managing my own tech projects. Based in Manhattan, New York.",
		icon: <GraduationCap className="w-5 h-5 text-primary" />,
	},
	{
		role: "Founder & Developer",
		company: "Vernato",
		period: "June 2025 - Present",
		description:
			"Vernato is an AI-powered pronunciation improvement platform helping learners speak with clarity and confidence. Our PronScore™ model combines accuracy, fluency, and completeness into a single score, giving users actionable feedback that actually drives progress.",
		icon: <Briefcase className="w-5 h-5 text-primary" />,
	},
	{
		role: "Lead Developer and App Designer",
		company: "EMTY Commuting App",
		period: "Aug 2024 – April 2025",
		description:
			"Designed UX in Figma to display real-time subway car occupancy; built secure real-time backend with Firebase Auth and Realtime Database. Presented EMTY at the U.S. Capitol and to Congressman Adriano Espaillat’s office.",
		icon: <Briefcase className="w-5 h-5 text-primary" />,
	},
	{
		role: "Founder & Developer",
		company: "Simplify Me.",
		period: "Jan 2023 - May 2025",
		description:
			"You know when you sign up for a new website or download a shiny new app, and you’re hit with a wall of text that seems to go on forever? Yeah, that’s the Terms of Service. Our mission is simple: to help you make informed decisions about your privacy.",
		icon: <Briefcase className="w-5 h-5 text-primary" />,
	},
];

interface AboutClientPageProps {
	allSkills: string[];
	activeSkills: string[];
	skillProjectMap: Record<string, Project[]>;
}

// Simple badge with hover/click handlers
const SkillBadge = ({
	skill,
	isClickable,
	onHover,
	onLeave,
	onClick,
}: {
	skill: string;
	isClickable: boolean;
	onHover: (skill: string) => void;
	onLeave: () => void;
	onClick: (skill: string, e: React.MouseEvent) => void;
}) => {
	const skillSlug = encodeURIComponent(
		skill.toLowerCase().replace(/\s/g, "-").replace(/\./g, "")
	);
	const badge = (
		<Badge
			className={cn(
				"text-lg px-6 py-3 transition-colors duration-300 ease-in-out",
				isClickable
					? "hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
					: "opacity-50 cursor-not-allowed"
			)}
			variant="default"
		>
			{skill}
		</Badge>
	);
	return (
		<div
			className="mx-4 flex-shrink-0"
			onMouseEnter={() => isClickable && onHover(skill)}
			onMouseLeave={onLeave}
			onClick={(e) => isClickable && onClick(skill, e)}
		>
			{isClickable ? (
				<div aria-label={`View projects for ${skill}`}>{badge}</div>
			) : (
				<div>{badge}</div>
			)}
		</div>
	);
};

const ExperienceItem = ({
	item,
	index,
}: {
	item: typeof experience[0];
	index: number;
}) => {
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "center center"],
	});

	const y = useTransform(scrollYProgress, [0, 1], [20, 0]);

	return (
		<div ref={ref} className="relative mx-4 pl-12 md:pl-0 mb-12">
			<div className="absolute top-0 left-4 md:left-1/2 -translate-x-1/2 -translate-y-1 bg-background border-2 border-primary w-10 h-10 rounded-full flex items-center justify-center z-10">
				{item.icon}
			</div>
			<motion.div
				style={{ opacity: scrollYProgress, y }}
				className={`md:flex items-center w-full ${
					index % 2 !== 0 ? "md:flex-row-reverse" : ""
				}`}
			>
				<div className="md:w-1/2"></div>
				<div className="md:w-1/2 md:px-8">
					<div
						className={`p-4 rounded-lg border bg-card shadow-sm ${
							index % 2 !== 0 ? "md:text-right" : ""
						}`}
					>
						<p className="text-sm text-muted-foreground">{item.period}</p>
						<h3 className="font-headline text-xl font-bold text-primary">
							{item.role}
						</h3>
						<h4 className="font-semibold">{item.company}</h4>
						<p className="text-sm text-muted-foreground mt-2">
							{item.description}
						</p>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default function AboutClientPage({
	allSkills,
	activeSkills,
	skillProjectMap,
}: AboutClientPageProps) {
	const journeyRef = useRef(null);
	const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
	const [isTouch, setIsTouch] = useState(false);
	const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const router = useRouter();

	const { scrollYProgress } = useScroll({
		target: journeyRef,
		offset: ["start end", "end start"],
	});

	useEffect(() => {
		if (typeof window !== "undefined") {
			setIsTouch(
				window.matchMedia && window.matchMedia("(hover: none)").matches
			);
		}
	}, []);

	const handleSkillHover = (skill: string) => {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
			closeTimeoutRef.current = null;
		}
		setHoveredSkill(skill);
	};

	const handleSkillLeave = () => {
		if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
		closeTimeoutRef.current = setTimeout(() => {
			setHoveredSkill(null);
		}, 300);
	};

	const handleSkillClick = (skill: string, e: React.MouseEvent) => {
		e.preventDefault();
		if (isTouch) {
			if (hoveredSkill === skill) {
				// Navigate to skill page
				const skillSlug = encodeURIComponent(
					skill.toLowerCase().replace(/\s/g, "-").replace(/\./g, "")
				);
				router.push(`/skill/${skillSlug}`);
			} else {
				setHoveredSkill(skill);
			}
			return;
		}
		// For desktop, always show tooltip on click, navigate on second click or via button
		if (hoveredSkill === skill) {
			const skillSlug = encodeURIComponent(
				skill.toLowerCase().replace(/\s/g, "-").replace(/\./g, "")
			);
			router.push(`/skill/${skillSlug}`);
		} else {
			setHoveredSkill(skill);
		}
	};

	const cancelScheduledClose = () => {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
			closeTimeoutRef.current = null;
		}
	};

	return (
		<div className="animate-fade-in">
			{/* Enable smooth scroll to #skills via hash navigation with extra offset */}
			<AnchorScrollHandler offset={64} />
			<section className="flex flex-col justify-center min-h-[calc(100dvh-65px)] container mx-auto px-4 py-8 md:py-16">
				<div className="max-w-6xl mx-auto text-center">
					<h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-4">
						{config.about.title}
					</h1>
					<div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-4 text-left md:text-center">
						{config.about.description.map((paragraph, index) => (
							<p key={index}>{paragraph}</p>
						))}
					</div>
					<div className="flex flex-col justify-center w-full sm:flex-row gap-4 mt-8">
						<ResumeDialogTrigger>
							<Button size="lg" className="w-full md:w-auto">
								<FileText className="mr-2 h-5 w-5" />
								View My Resume
							</Button>
						</ResumeDialogTrigger>
						<Button asChild size="lg">
                <Link href="/projects" target="_blank">
										<ExternalLink className="mr-2 h-5 w-5" />
										View My Work</Link>
              </Button>
					</div>
				</div>
			</section>

			<section id="skills" className="py-16 md:py-24 border-t">
				<h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">
					My Skillset
				</h2>

				{/* Skills marquee */}
				<div className="relative w-full overflow-hidden mb-8">
					<div
						className={cn(
							"relative w-full group flex overflow-hidden",
							hoveredSkill && "[&_.marquee-content]:[animation-play-state:paused]"
						)}
					>
						<div
							className={cn(
								"flex animate-marquee group-hover:[animation-play-state:paused] marquee-content whitespace-nowrap",
								hoveredSkill && "[animation-play-state:paused]"
							)}
						>
							{allSkills.map((skill, index) => {
								const isClickable = activeSkills.some(
									(s) => s.toLowerCase() === skill.toLowerCase()
								);
								return (
									<SkillBadge
										key={`${skill}-${index}-1`}
										skill={skill}
										isClickable={isClickable}
										onHover={handleSkillHover}
										onLeave={handleSkillLeave}
										onClick={handleSkillClick}
									/>
								);
							})}
							{allSkills.map((skill, index) => {
								const isClickable = activeSkills.some(
									(s) => s.toLowerCase() === skill.toLowerCase()
								);
								return (
									<SkillBadge
										key={`${skill}-${index}-2`}
										skill={skill}
										isClickable={isClickable}
										onHover={handleSkillHover}
										onLeave={handleSkillLeave}
										onClick={handleSkillClick}
									/>
								);
							})}
						</div>
					</div>
					<div className="absolute inset-y-0 left-0 w-1/12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
					<div className="absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
				</div>

				{/* Fixed tooltip area */}
				<div className="min-h-[200px] md:min-h-[160px] flex items-center justify-center px-4">
					{hoveredSkill ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.2 }}
							className="w-full max-w-md mx-auto bg-card text-card-foreground border border-border rounded-lg shadow-lg p-4 md:p-6"
							onMouseEnter={cancelScheduledClose}
							onMouseLeave={handleSkillLeave}
						>
							<div className="text-center mb-4">
								<h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
									{hoveredSkill}
								</h3>
								<p className="text-sm text-muted-foreground">
									{(skillProjectMap[hoveredSkill] || []).length}{" "}
									{(skillProjectMap[hoveredSkill] || []).length === 1
										? "Project"
										: "Projects"}
								</p>
							</div>

							{(skillProjectMap[hoveredSkill] || []).length > 0 && (
								<div className="mb-4">
									<h4 className="text-sm font-semibold text-foreground mb-3">
										Recent Projects:
									</h4>
									<ul className="space-y-2">
										{(skillProjectMap[hoveredSkill] || [])
											.slice(0, 3)
											.map((p) => (
												<li key={p.id} className="flex items-center gap-3">
													<div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
													<Link
														href={`/projects/${p.id}`}
														className="text-sm text-foreground hover:text-primary transition-colors truncate"
														title={p.name}
													>
														{p.name}
													</Link>
												</li>
											))}
										{(skillProjectMap[hoveredSkill] || []).length > 3 && (
											<li className="flex items-center gap-3">
												<div className="w-2 h-2 bg-muted-foreground rounded-full flex-shrink-0" />
												<span className="text-sm text-muted-foreground">
													+
													{(skillProjectMap[hoveredSkill] || []).length - 3} more
													project{((skillProjectMap[hoveredSkill] || []).length - 3) !==
													1
														? "s"
														: ""}
												</span>
											</li>
										)}
									</ul>
								</div>
							)}

							<div className="text-center pt-4 border-t border-border">
								<Link
									href={`/skill/${encodeURIComponent(
										hoveredSkill.toLowerCase().replace(/\s/g, "-").replace(/\./g, "")
									)}`}
									className="inline-flex items-center gap-2 px-3 py-2 md:px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
									onMouseEnter={cancelScheduledClose}
								>
									<span>View All Projects</span>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</Link>
							</div>
						</motion.div>
					) : (
						<div className="text-center text-muted-foreground px-4">
							<p className="text-base md:text-lg">
								Click a skill to see its details
							</p>
						</div>
					)}
				</div>
			</section>

			<section className="pt-16 md:pt-24 border-t">
				<h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-16">
					My Journey
				</h2>
				<div ref={journeyRef} className="relative max-w-3xl mx-auto">
					<div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 h-full w-0.5 bg-border"></div>
					<motion.div
						className="absolute left-8 md:left-1/2 md:-translate-x-1/2 h-full w-0.5 bg-primary origin-top"
						style={{ scaleY: scrollYProgress }}
					/>
					{experience.map((item, index) => (
						<ExperienceItem key={index} item={item} index={index} />
					))}
				</div>
			</section>
		</div>
	);
}

