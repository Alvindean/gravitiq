'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/app/lib/blog-data';

const categories = [
  'All',
  'AI & Automation',
  'Client Management',
  'Analytics',
  'Business Growth',
  'Product Updates',
];

function BlogCard({ post, featured = false }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col rounded-2xl border bg-surface overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        featured ? 'md:flex-row' : ''
      }`}
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Cover image */}
      <div
        className={`relative overflow-hidden ${
          featured
            ? 'md:w-1/2 aspect-video md:aspect-auto md:min-h-[280px]'
            : 'aspect-video'
        }`}
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-1 flex-col p-6 ${featured ? 'md:p-8' : ''}`}>
        {/* Category badge */}
        <span className="inline-flex self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {post.category}
        </span>

        {/* Title */}
        <h3
          className={`mt-3 font-bold text-foreground group-hover:text-primary transition-colors ${
            featured ? 'text-xl md:text-2xl' : 'text-lg'
          }`}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        {/* Author + meta */}
        <div className="mt-auto pt-5 flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            {post.author?.avatar || '??'}
          </div>
          <div className="flex flex-col text-xs text-muted">
            <span className="font-medium text-foreground">
              {post.author?.name}
            </span>
            <span>
              {post.publishedAt} &middot; {post.readTime}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const allPosts = getAllPosts();
  const filteredPosts =
    activeCategory === 'All'
      ? allPosts
      : allPosts.filter((p) => p.category === activeCategory);

  const pillarPosts = filteredPosts.filter((p) => p.isPillar);
  const regularPosts = filteredPosts.filter((p) => !p.isPillar);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        {/* Background accents */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute top-0 left-1/4 h-96 w-96 rounded-full blur-3xl"
            style={{
              backgroundColor:
                'color-mix(in srgb, var(--primary) 15%, transparent)',
            }}
          />
          <div
            className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full blur-3xl"
            style={{
              backgroundColor:
                'color-mix(in srgb, var(--accent) 10%, transparent)',
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Blog
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Gravitiq Blog
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Insights on AI, business automation, and growth strategies
          </p>
        </div>
      </section>

      {/* Category filter pills */}
      <section className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-foreground hover:bg-muted-light'
                }`}
                style={
                  activeCategory !== cat
                    ? {
                        backgroundColor: 'var(--surface-elevated)',
                      }
                    : undefined
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <div className="py-20 text-center">
            <svg
              className="mx-auto h-12 w-12 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No posts yet
            </h3>
            <p className="mt-2 text-sm text-muted">
              Check back soon for new content.
            </p>
          </div>
        )}

        {/* Featured / Pillar posts */}
        {pillarPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {pillarPosts.map((post) => (
                <BlogCard key={post.slug} post={post} featured />
              ))}
            </div>
          </section>
        )}

        {/* Regular posts grid */}
        {regularPosts.length > 0 && (
          <section>
            {pillarPosts.length > 0 && (
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                Latest Posts
              </h2>
            )}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {regularPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
