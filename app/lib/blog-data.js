// Blog data store — aggregates all blog post content.
import { posts1 } from './blog-posts-1';
import { posts2 } from './blog-posts-2';

const posts = [...posts1, ...posts2];

/**
 * Returns all posts sorted by date descending.
 */
export function getAllPosts() {
  return [...posts].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
  );
}

/**
 * Returns a single post by its slug, or undefined if not found.
 */
export function getPostBySlug(slug) {
  return posts.find((p) => p.slug === slug);
}

/**
 * Returns posts that match the given category, sorted by date descending.
 */
export function getPostsByCategory(category) {
  return posts
    .filter((p) => p.category === category)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

/**
 * Returns related posts for a given post slug based on its relatedSlugs field.
 */
export function getRelatedPosts(slug) {
  const post = getPostBySlug(slug);
  if (!post || !post.relatedSlugs || post.relatedSlugs.length === 0) return [];
  return post.relatedSlugs
    .map((s) => getPostBySlug(s))
    .filter(Boolean);
}

/*
  Post shape reference:
  {
    slug: 'string',
    title: 'string',
    excerpt: 'string (150-200 chars)',
    content: 'string (full article HTML)',
    category: 'string',
    tags: ['array'],
    author: { name: 'string', role: 'string', avatar: 'string (initials)' },
    publishedAt: 'string (date)',
    readTime: 'string',
    isPillar: boolean,
    coverImage: 'string (unsplash URL)',
    relatedSlugs: ['array of related post slugs'],
  }
*/
