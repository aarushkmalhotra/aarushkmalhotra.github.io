
import AboutClientPage from "./AboutClientPage";
import { Metadata } from "next";
import { getSkills } from "@/lib/projects";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: `About – ${config.siteName}`,
  description: "Learn more about my journey, skills, and the story behind my work.",
  openGraph: {
    title: `About – ${config.siteName}`,
    description: "Learn more about my journey, skills, and the story behind my work.",
    images: [
      {
        url: 'https://picsum.photos/seed/about/1200/630',
        width: 1200,
        height: 630,
        alt: 'About Page'
      }
    ]
  }
};

export default function AboutPage() {
  const { allSkills, activeSkills, skillProjectMap } = getSkills();
  return <AboutClientPage allSkills={allSkills} activeSkills={activeSkills} skillProjectMap={skillProjectMap} />;
}
