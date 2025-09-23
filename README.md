# Aarush's Portfolio - A Modern Developer Portfolio

Aarush's Portfolio is a multi-page developer portfolio built with Next.js, TypeScript, and Tailwind CSS. It's designed to be minimalist, modern, and easily deployable to GitHub Pages.

![SourceCraft Screenshot](https://picsum.photos/seed/readme/1200/800)
_A placeholder for your portfolio's screenshot._

## Features

- **Modern Stack:** Built with the latest Next.js App Router.
- **Static Site Generation:** Optimized for performance and security, perfect for hosting on GitHub Pages.
- **Data-Driven Content:** Projects are managed via a simple `projects.json` file, and blog posts are written in Markdown.
- **Theming:** Light and dark modes with a sleek theme toggle.
- **Responsive Design:** Mobile-friendly and responsive at all breakpoints.
- **AI-Powered Highlights:** Utilizes GenAI to generate compelling project descriptions.
- **Developer-First UX:** A clean, professional design that puts your work front and center.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v20.x or later)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/sourcecraft.git
    cd sourcecraft
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## How to Customize

### Adding a Project

1.  Open `src/lib/data/projects.json`.
2.  Add a new JSON object to the array for your project. Follow the existing structure.
3.  Add your project images to the `public/images` directory (or use a placeholder service).
4.  Reference your image `id`s from `src/lib/placeholder-images.json` in your new project entry.

### Adding a Blog Post

1.  Create a new Markdown file (e.g., `my-new-post.md`) inside the `src/lib/data/blog/` directory.
2.  Add frontmatter to the top of the file:
    ```markdown
    ---
    title: "My Awesome New Post"
    date: "YYYY-MM-DD"
    description: "A short and catchy description for the post."
    ---

    Your content starts here...
    ```

### Configuring the Contact Form

The contact form uses [Formspree](https://formspree.io/) to handle submissions without a backend.

1.  Create a new form on Formspree.
2.  Open `src/app/contact/page.tsx`.
3.  Replace the `FORMSPREE_URL` placeholder with your own Formspree form endpoint URL.

## Deployment to GitHub Pages

This project is pre-configured for deployment to GitHub Pages via GitHub Actions.

1.  **Push to your `main` branch.** The GitHub Actions workflow located in `.github/workflows/deploy.yml` will automatically trigger.

2.  **Enable GitHub Pages:** In your repository settings, go to the "Pages" tab. Under "Build and deployment", select "GitHub Actions" as the source.

### Deployment Configuration

This portfolio is configured for deployment to a root domain (e.g., `https://aarushkumar.github.io`). The configuration in `next.config.ts` has been optimized for this setup.

**For root domain deployment:** No additional configuration is needed. The current setup works out of the box.

**For subdirectory deployment:** If you need to deploy to a subdirectory (e.g., `https://<username>.github.io/<repo-name>/`), you can uncomment and configure the `basePath` and `assetPrefix` in `next.config.ts`:
    ```javascript
    const nextConfig = {
      // ...
      basePath: '/<repo-name>',
      assetPrefix: '/<repo-name>/',
      // ...
    };
    ```

