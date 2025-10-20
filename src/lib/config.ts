// Portfolio configuration - centralized settings
export const config = {
  // Personal Information
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Your Portfolio",
  fullName: process.env.NEXT_PUBLIC_FULL_NAME || "Your Full Name",
  firstName: process.env.NEXT_PUBLIC_FIRST_NAME || "Your First Name",
  email: process.env.NEXT_PUBLIC_EMAIL || "your.email@example.com",
  portfolioUrl: process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://yourusername.github.io",
  terminalUsername: process.env.NEXT_PUBLIC_TERMINAL_USERNAME || "yourusername",

  // Site Content
  hero: {
    tagline: process.env.NEXT_PUBLIC_HERO_TAGLINE || "I see problems, then I build solutions.",
    description: process.env.NEXT_PUBLIC_HERO_DESCRIPTION || "I'm a CS student who builds things that fix whatever's bothering me. Usually that means making complicated stuff actually make sense.",
  },

  about: {
    title: process.env.NEXT_PUBLIC_ABOUT_TITLE || "Hey, I'm [Your Name].",
    description: process.env.NEXT_PUBLIC_ABOUT_DESCRIPTION?.split('|') || [
      "I'm studying Computer Science at [Your University], but honestly, most of what I know comes from building stuff that annoys me less than whatever already exists. I've moved around a lot - way too many countries, way too many school systems. Each move taught me that things are usually more complicated than they need to be.",
      "I get bothered by broken things. Not just code that doesn't work, but experiences that make people feel stupid or frustrated. So I end up building tools to fix whatever's driving me crazy. I'm always down to chat with people who think technology should actually help instead of just being impressive."
    ],
  },

  // External Services
  formspreeUrl: process.env.NEXT_PUBLIC_FORMSPREE_URL || "https://formspree.io/f/YOUR_FORM_ID",
  // Back-compat single host (still used by some components)
  hashnodeHost: process.env.NEXT_PUBLIC_HASHNODE_HOST || "yourusername.hashnode.dev",
  // Preferred: multiple Hashnode hosts, comma-separated in NEXT_PUBLIC_HASHNODE_HOSTS
  // Fallback order: env list -> single host -> sensible defaults for this portfolio
  hashnodeHosts: (() => {
    const list = process.env.NEXT_PUBLIC_HASHNODE_HOSTS
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (list && list.length) return list;
    const single = process.env.NEXT_PUBLIC_HASHNODE_HOST;
    const defaults = ["aarushkumar.hashnode.dev", "vernato.hashnode.dev"];
    return Array.from(new Set([...
      defaults,
      ...(single ? [single] : []),
    ]));
  })(),

  // Social Media Links
  social: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/yourusername",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/yourusername",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/yourusername",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/yourusername",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com/@yourusername",
  },

  // Terminal Configuration
  terminal: {
    welcome: process.env.NEXT_PUBLIC_TERMINAL_WELCOME || "Welcome to Your Portfolio Terminal v1.0",
  },

  // Derived values
  get siteTitle() {
    return `${this.siteName} – Developer Portfolio`;
  },

  get terminalPrompt() {
    return `${this.terminalUsername}@portfolio:~$`;
  },

  get githubUsername() {
    return this.social.github.split('/').pop() || 'yourusername';
  },

  get linkedinUsername() {
    return this.social.linkedin.split('/in/').pop() || 'yourusername';
  },

  get portfolioDomain() {
    return this.portfolioUrl.replace('https://', '').replace('http://', '');
  },
};