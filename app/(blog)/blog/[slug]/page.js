import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug, getRelatedPosts, getAllPosts } from '@/app/lib/blog-data';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found | Gravitiq' };
  return {
    title: `${post.title} | Gravitiq Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug);

  return (
    <>
      <style>{`
        .article-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: var(--foreground);
          line-height: 1.3;
        }
        .article-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: var(--foreground);
          line-height: 1.4;
        }
        .article-content p {
          font-size: 1rem;
          line-height: 1.75;
          margin-bottom: 1.5rem;
          color: var(--muted);
        }
        .article-content ul,
        .article-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
          color: var(--muted);
        }
        .article-content ul {
          list-style-type: disc;
        }
        .article-content ol {
          list-style-type: decimal;
        }
        .article-content li {
          margin-bottom: 0.5rem;
          line-height: 1.75;
        }
        .article-content blockquote {
          border-left: 4px solid var(--primary);
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: var(--muted);
          background-color: var(--surface-elevated);
          border-radius: 0 0.5rem 0.5rem 0;
        }
        .article-content a {
          color: var(--primary);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .article-content a:hover {
          opacity: 0.8;
        }
        .article-content img {
          border-radius: 0.75rem;
          width: 100%;
          margin: 1.5rem 0;
        }
        .article-content code {
          background-color: var(--surface-elevated);
          padding: 0.15rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: var(--font-geist-mono), monospace;
        }
        .article-content pre {
          background-color: var(--surface-elevated);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 1.25rem;
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }
        .article-content pre code {
          background: none;
          padding: 0;
        }
        .article-content strong {
          color: var(--foreground);
          font-weight: 600;
        }
      `}</style>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        {/* Meta row */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {post.category}
          </span>
          <span className="text-sm text-muted">{post.readTime}</span>
          <span className="text-sm text-muted">&middot;</span>
          <span className="text-sm text-muted">{post.publishedAt}</span>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        {/* Author card */}
        <div className="mt-6 flex items-center gap-4 border-b pb-8" style={{ borderColor: 'var(--border)' }}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {post.author?.avatar || '??'}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {post.author?.name}
            </p>
            <p className="text-sm text-muted">{post.author?.role}</p>
          </div>
        </div>

        {/* Article content */}
        <div
          className="article-content mt-10"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t pt-8" style={{ borderColor: 'var(--border)' }}>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-3 py-1 text-xs font-medium text-muted"
                style={{ borderColor: 'var(--border)' }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-foreground">
              Related Articles
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.slice(0, 3).map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="relative aspect-video overflow-hidden">
                    {related.coverImage ? (
                      <Image
                        src={related.coverImage}
                        alt={related.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="inline-flex self-start rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {related.category}
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {related.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted line-clamp-2">
                      {related.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section className="mt-16 mb-4">
          <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-14 text-center sm:px-16">
            <div className="absolute inset-0 -z-0" aria-hidden="true">
              <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Ready to transform your business?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-base text-white/80">
                Join thousands of teams using Gravitiq to work smarter with AI-powered automation.
              </p>
              <Link
                href="/signup"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-sm font-semibold shadow-lg transition-all duration-200 hover:bg-white/90"
                style={{ color: 'var(--primary)' }}
              >
                Start your free trial
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
