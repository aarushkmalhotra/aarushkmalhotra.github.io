import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons/ArrowUpRightIcon";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  brief: string;
  url: string;
  slug: string;
  publishedAt: string;
  coverImage?: {
    url: string;
  };
}

interface Publication {
  posts: {
    edges: {
      node: Post;
    }[];
  };
}

interface HashnodeResponse {
  data: {
    publication: Publication;
  };
}

async function getHashnodePosts(username: string): Promise<Post[]> {
  const query = `
    query Publication {
      publication(host: "${username}.hashnode.dev") {
        posts(first: 10) {
          edges {
            node {
              id
              title
              brief
              slug
              url
              publishedAt
              coverImage {
                url
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://gql.hashnode.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      console.error("Failed to fetch posts from Hashnode:", await response.text());
      return [];
    }
    
    const jsonResponse: HashnodeResponse = await response.json();
    
    if (!jsonResponse.data || !jsonResponse.data.publication) {
        console.error("Invalid response structure from Hashnode:", jsonResponse);
        return [];
    }

    return jsonResponse.data.publication.posts.edges.map(edge => edge.node);

  } catch (error) {
    console.error("Error fetching from Hashnode:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getHashnodePosts("vernato");

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Blog</h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
          My thoughts on technology, development, and everything in between, pulled directly from my Hashnode blog.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <Link href={post.url} target="_blank" rel="noopener noreferrer" key={post.id} className="group block" style={{ animationDelay: `${index * 100}ms` }}>
            <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1 animate-fade-in-up">
              {post.coverImage && (
                <CardHeader className="p-0">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <Image
                      src={post.coverImage.url}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </CardHeader>
              )}
              <div className={`p-6 flex flex-col flex-grow`}>
                  <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </CardDescription>
                <CardContent className="p-0 flex-grow pt-4">
                  <p className="text-muted-foreground line-clamp-3">{post.brief}</p>
                </CardContent>
                <CardFooter className="p-0 pt-4">
                  <span className="text-sm text-accent flex items-center gap-1">
                      Read on Hashnode <ArrowUpRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </CardFooter>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
