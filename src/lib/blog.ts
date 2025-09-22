import fs from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  meta: {
    title: string;
    date: string;
    description: string;
  };
  content: string;
}

const postsDirectory = path.join(process.cwd(), 'src/lib/data/blog');

function parseFrontmatter(fileContent: string): { meta: any; content: string } {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  const frontMatterBlock = match![1];
  const content = fileContent.replace(frontmatterRegex, '').trim();
  const frontMatterLines = frontMatterBlock.trim().split('\n');
  const meta: { [key: string]: string } = {};

  frontMatterLines.forEach(line => {
    const [key, ...valueArr] = line.split(': ');
    let value = valueArr.join(': ').trim();
    value = value.replace(/^['"](.*)['"]$/, '$1');
    meta[key.trim()] = value;
  });

  return { meta, content };
}

export function getPostBySlug(slug: string): BlogPost {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { meta, content } = parseFrontmatter(fileContents);

  return {
    slug: realSlug,
    meta: meta as BlogPost['meta'],
    content,
  };
}

export function getBlogPosts(): BlogPost[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      return getPostBySlug(fileName);
    });

  return allPostsData.sort((a, b) => {
    if (new Date(a.meta.date) < new Date(b.meta.date)) {
      return 1;
    } else {
      return -1;
    }
  });
}
