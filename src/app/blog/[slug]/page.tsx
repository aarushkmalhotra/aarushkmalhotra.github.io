import { getBlogPosts, getPostBySlug } from "@/lib/blog";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = getPostBySlug(params.slug);
    return {
      title: `${post.meta.title} | SourceCraft`,
      description: post.meta.description,
    };
  } catch (error) {
    return {
      title: "Post Not Found"
    };
  }
}

export function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// A simple component to render markdown-like text to HTML
const MarkdownContent = ({ content }: { content: string }) => {
    return (
        <div
            className="prose lg:prose-xl dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
                __html: content
                    .split('\n\n')
                    .map(p => {
                        // Basic heading support
                        if (p.startsWith('# ')) return `<h1>${p.substring(2)}</h1>`;
                        if (p.startsWith('## ')) return `<h2>${p.substring(3)}</h2>`;
                        if (p.startsWith('### ')) return `<h3>${p.substring(4)}</h3>`;
                        // Basic list support
                        if (p.startsWith('* ')) {
                            const items = p.split('\n').map(item => `<li>${item.substring(2)}</li>`).join('');
                            return `<ul>${items}</ul>`;
                        }
                        // Basic bold and italic
                        let processedP = p
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>');
                        
                        return `<p>${processedP}</p>`;
                    })
                    .join(''),
            }}
        />
    );
};


export default function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    const post = getPostBySlug(params.slug);

    return (
      <article className="container mx-auto px-4 py-8 md:py-16 max-w-4xl animate-fade-in">
        <header className="mb-12 text-center">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">{post.meta.title}</h1>
          <p className="mt-4 text-muted-foreground text-lg">
            {new Date(post.meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <MarkdownContent content={post.content} />
      </article>
    );
  } catch (error) {
    notFound();
  }
}
