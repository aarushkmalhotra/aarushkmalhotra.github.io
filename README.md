# Hey there! I'm Aarush Kumar 👋

Welcome to my corner of the internet! I'm a passionate developer who loves building things that actually matter. Whether it's creating AI-powered tools that help people learn pronunciation or designing apps that make subway commutes less stressful, I'm always chasing projects that blend cool technology with real human needs.

![Aarush Kumar](https://aarushkmalhotra.github.io/portrait.jpg)
_That's me! Building, learning, and probably overthinking some code somewhere._

## What I'm About

Right now, I'm diving deep into the intersection of AI and human experience. You know how sometimes technology feels cold and disconnected? I'm working to change that. My projects range from machine learning experiments that actually solve problems to web apps that feel intuitive from the first click.

I've got this thing for taking complex ideas and making them accessible. Whether that's building a Discord bot that explains legal jargon in plain English or creating pronunciation tools that give you real feedback you can act on, I love bridging the gap between what's possible and what's practical.

## What You'll Find Here

This portfolio showcases the projects I'm most excited about. Each one taught me something new, whether it was wrestling with audio processing algorithms, figuring out how to make real-time data actually feel real-time, or just learning that sometimes the simplest solution is the best one.

**The Tech Behind This Site:**
- Built with Next.js because it just works
- TypeScript keeps me honest with my code
- Tailwind CSS for styling that doesn't fight me
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

2.  **Get the dependencies:**
    ```bash
    npm install
    # or if you prefer yarn or pnpm, those work too
    ```

3.  **Fire it up:**
    ```bash
    npm run dev
    ```
    Then head to [http://localhost:9002](http://localhost:9002) and you should see everything running!

## Making It Your Own

The beauty of this setup is how easy it is to customize. Everything's organized so you can find what you need without digging through a maze of files.

### Adding Your Projects

Head over to `src/lib/data/projects.json` and you'll see how I've structured mine. Just follow the same pattern and add your own! Don't forget to drop your project images in the `public` folder and reference them properly.

### Writing Blog Posts

I keep things simple with Markdown files. Create a new `.md` file in the blog directory, add some frontmatter at the top (title, date, description), and write away. The site handles the rest automatically.

### Contact Form Setup

The contact form uses Formspree, which is honestly the easiest way to handle form submissions without setting up your own backend. Just create an account there, get your form endpoint, and update the contact page with your URL.

## Getting It Live

I've set this up to deploy automatically to GitHub Pages because, honestly, it's the path of least resistance. Every time you push to the main branch, GitHub Actions takes care of building and deploying everything for you.

Just make sure to enable GitHub Pages in your repository settings and choose "GitHub Actions" as your source. That's it!

**Deployment Notes:**
- The site's configured for root domain deployment (like `https://yourusername.github.io`)
- If you need it in a subdirectory, there are some config tweaks you can make in `next.config.ts`
- Everything's optimized for static generation, so it loads fast and works reliably

---

Thanks for checking out my work! If you've got questions about any of these projects or just want to chat about tech, feel free to reach out. I'm always up for a good conversation about code, design, or whatever interesting problem you're trying to solve.

