
import { AboutClientPage } from "./AboutClientPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Aarush's Portfolio",
  description: "Learn more about my journey, skills, and the story behind my work.",
  openGraph: {
    title: "About | Aarush's Portfolio",
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
  return <AboutClientPage />;
}
