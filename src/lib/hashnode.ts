
export interface Post {
    id: string;
    title: string;
    brief: string;
    url: string;
    slug: string;
    publishedAt: string;
    readTimeInMinutes: number;
    coverImage?: {
      url: string;
    };
    author: {
      name: string;
      profilePicture?: string;
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
  
export async function getHashnodePosts(username: string): Promise<Post[]> {
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
                readTimeInMinutes
                coverImage {
                  url
                }
                author {
                  name
                  profilePicture
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
