# Hey there! I'm Aarush Kumar 👋

<table>
<tr>
<td width="40%" align="center">

<img src="https://aarushkmalhotra.github.io/portrait.jpg" alt="Aarush Kumar" width="200" height="200" style="border-radius: 50%;" />

</td>
<td width="60%">

Welcome to my corner of the internet! I'm a passionate developer who loves building things that actually matter. Whether it's creating AI-powered tools that help people learn pronunciation or designing apps that make subway commutes less stressful, I'm always chasing projects that blend cool technology with real human needs.

</td>
</tr>
</table>

## What I'm About

Right now, I'm diving deep into the intersection of AI and human experience. You know how sometimes technology feels cold and disconnected? I'm working to change that. My projects range from machine learning experiments that actually solve problems to web apps that feel intuitive from the first click.

I've got this thing for taking complex ideas and making them accessible. Whether that's building a Discord bot that explains legal jargon in plain English or creating pronunciation tools that give you real feedback you can act on, I love bridging the gap between what's possible and what's practical.

## What You'll Find Here

This portfolio showcases the projects I'm most excited about. Each one taught me something new, whether it was wrestling with audio processing algorithms, figuring out how to make real-time data actually feel real-time, or just learning that sometimes the simplest solution is the best one.

**The Tech Behind This Site:**
- Built with Next.js because it just works
- TypeScript keeps me honest with my code
- Tailwind CSS for styling that doesn't fight me
- Blog powered by Hashnode for seamless content management
- Deployed on GitHub Pages (because why complicate things?)
- Dark mode toggle because your eyes matter

## Want to Run This Locally?

If you're curious about how this portfolio works or want to use it as a starting point for your own, here's how to get it running on your machine.

### Prerequisites

- Node.js (v20.x or later)
- npm, yarn, or pnpm

### Installation

1.  **Grab the code:**
    ```bash
    git clone https://github.com/aarushkmalhotra/aarushkmalhotra.github.io.git
    cd aarushkmalhotra.github.io
    ```

2.  **Set up your environment:**
    ```bash
    cp .env.example .env.local
    ```
    Then edit `.env.local` with your actual values (see [Configuration](#configuration) section below).

3.  **Get the dependencies:**
    ```bash
    npm install
    # or if you prefer yarn or pnpm, those work too
    ```

4.  **Fire it up:**
    ```bash
    npm run dev
    ```
    Then head to [http://localhost:9002](http://localhost:9002) and you should see everything running!

## Configuration

This portfolio uses environment variables for easy customization. Copy `.env.example` to `.env.local` and update the values:

### Personal Information
- `NEXT_PUBLIC_SITE_NAME` - Your portfolio site name
- `NEXT_PUBLIC_FULL_NAME` - Your full name
- `NEXT_PUBLIC_FIRST_NAME` - Your first name
- `NEXT_PUBLIC_EMAIL` - Your email address
- `NEXT_PUBLIC_PORTFOLIO_URL` - Your portfolio URL
- `NEXT_PUBLIC_TERMINAL_USERNAME` - Username displayed in the interactive terminal

### Site Content
- `NEXT_PUBLIC_HERO_TAGLINE` - Main tagline on your homepage
- `NEXT_PUBLIC_HERO_DESCRIPTION` - Description below your tagline
- `NEXT_PUBLIC_ABOUT_TITLE` - Title for your about section
- `NEXT_PUBLIC_ABOUT_DESCRIPTION` - About section content (use `|` to separate paragraphs)

### External Services
- `NEXT_PUBLIC_FORMSPREE_URL` - Contact form endpoint from [Formspree](https://formspree.io)
- `NEXT_PUBLIC_HASHNODE_HOST` - Your Hashnode blog domain (e.g., `yourusername.hashnode.dev`)

### Social Media Links
- `NEXT_PUBLIC_GITHUB_URL` - Your GitHub profile
- `NEXT_PUBLIC_LINKEDIN_URL` - Your LinkedIn profile
- `NEXT_PUBLIC_TWITTER_URL` - Your Twitter/X profile
- `NEXT_PUBLIC_INSTAGRAM_URL` - Your Instagram profile
- `NEXT_PUBLIC_YOUTUBE_URL` - Your YouTube channel

### Terminal Configuration
- `NEXT_PUBLIC_TERMINAL_WELCOME` - Welcome message for the interactive terminal

## Making It Your Own

The beauty of this setup is how easy it is to customize. Everything's organized so you can find what you need without digging through a maze of files.

### Adding Your Projects

Head over to `src/lib/data/projects.json` and you'll see how I've structured mine. Just follow the same pattern and add your own! Don't forget to drop your project images in the `public` folder and reference them properly.

### Writing Blog Posts

The blog is powered by Hashnode, which makes content management incredibly easy. Just set up your Hashnode blog and add your domain to the `NEXT_PUBLIC_HASHNODE_HOST` environment variable. The portfolio will automatically fetch and display your latest posts with rich formatting, SEO optimization, and all the features Hashnode provides.

### Contact Form Setup

The contact form uses Formspree, which is honestly the easiest way to handle form submissions without setting up your own backend. Just create an account at [Formspree](https://formspree.io), create a new form, and add your form endpoint to the `NEXT_PUBLIC_FORMSPREE_URL` environment variable in your `.env.local` file.

## Getting It Live

I've set this up to deploy automatically to GitHub Pages because, honestly, it's the path of least resistance. Every time you push to the main branch, GitHub Actions takes care of building and deploying everything for you.

Just make sure to enable GitHub Pages in your repository settings and choose "GitHub Actions" as your source. That's it!

**Deployment Notes:**
- The site's configured for root domain deployment (like `https://yourusername.github.io`)
- If you need it in a subdirectory, there are some config tweaks you can make in `next.config.ts`
- Everything's optimized for static generation, so it loads fast and works reliably

---

Thanks for checking out my work! If you've got questions about any of these projects or just want to chat about tech, feel free to reach out. I'm always up for a good conversation about code, design, or whatever interesting problem you're trying to solve.

