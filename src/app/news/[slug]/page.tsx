import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllSlugs, getAllPosts, getPostBySlug } from "@/lib/blog";
import ListenSubscribe from "@/components/ListenSubscribe";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://speakarizona.com/news/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://speakarizona.com/news/${slug}`,
      siteName: "Speak Arizona",
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      images: [
        {
          url: post.image
            ? `https://speakarizona.com${post.image}`
            : "https://speakarizona.com/images/speak-arizona-default-og.webp",
          alt: post.imageAlt || post.title,
        },
      ],
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const otherPosts = getAllPosts().filter((p) => p.slug !== slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: new Date(post.date).toISOString(),
    image: post.image
      ? `https://speakarizona.com${post.image}`
      : "https://speakarizona.com/images/speak-arizona-default-og.webp",
    author: {
      "@type": "Organization",
      name: "Speak Arizona",
      url: "https://speakarizona.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Speak Arizona",
      url: "https://speakarizona.com",
      logo: {
        "@type": "ImageObject",
        url: "https://speakarizona.com/images/logo.png",
      },
    },
    mainEntityOfPage: `https://speakarizona.com/news/${slug}`,
  };

  // Extract YouTube embed ID from URL
  const youtubeEmbedId = post.youtubeUrl
    ? post.youtubeUrl.includes('youtu.be/')
      ? post.youtubeUrl.split('youtu.be/')[1]?.split('?')[0]
      : post.youtubeUrl.includes('v=')
        ? post.youtubeUrl.split('v=')[1]?.split('&')[0]
        : null
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero */}
      <section className="py-16 md:py-24" style={{ backgroundImage: "url('/images/gradient-square.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="max-w-4xl mx-auto px-6 text-white">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-yellow text-black text-xs font-heading font-bold px-3 py-1 rounded-full">
              {post.tag}
            </span>
            <span className="text-white/70 text-sm">{post.date}</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl md:text-5xl mb-4">
            {post.title}
          </h1>
          {post.guest && (
            <p className="text-white/80 text-lg">Guest: {post.guest}</p>
          )}
        </div>
      </section>

      {/* 1. YouTube Video Embed */}
      {youtubeEmbedId && (
        <section className="bg-white pt-12">
          <div className="max-w-3xl mx-auto px-6">
            <div className="overflow-hidden rounded-2xl shadow-lg" style={{ aspectRatio: "16/9" }}>
              <iframe
                src={`https://www.youtube.com/embed/${youtubeEmbedId}`}
                title={post.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </section>
      )}

      {/* 2. Quote */}
      {post.quote && (
        <section className="bg-white pt-12">
          <div className="max-w-3xl mx-auto px-6">
            <blockquote className="border-l-4 border-yellow pl-6 py-2">
              <p className="text-2xl md:text-3xl font-heading font-bold text-black leading-snug">
                &ldquo;{post.quote}&rdquo;
              </p>
              {post.guest && (
                <cite className="block mt-4 text-text-light text-base not-italic font-heading">
                  — {post.guest}
                </cite>
              )}
            </blockquote>
          </div>
        </section>
      )}

      {/* 3. Excerpt */}
      <section className="bg-white pt-12">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-lg leading-relaxed text-text-light">
            {post.excerpt}
          </p>
        </div>
      </section>

      {/* 4. Listen & Subscribe */}
      <section className="bg-white pt-12">
        <div className="max-w-3xl mx-auto px-6">
          <ListenSubscribe />
        </div>
      </section>

      {/* 5. Featured Image */}
      {post.image && (
        <section className="bg-white pt-12">
          <div className="max-w-3xl mx-auto px-6">
            <div className="overflow-hidden rounded-2xl shadow-lg" style={{ aspectRatio: "5/4" }}>
              <Image
                src={post.image}
                alt={post.imageAlt || post.title}
                width={800}
                height={640}
                className={`w-full h-full object-cover ${post.imagePosition === 'center' ? 'object-center' : 'object-top'}`}
              />
            </div>
            {(post.imageCredit || post.image?.includes('-by-marie-feutrier')) && (
              <p className="text-black/30 text-xs mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M8.5 6L10 3h4l1.5 3" /><circle cx="12" cy="13" r="3.5" /></svg>
                {post.imageCredit ? (
                  <span>{post.imageCredit}</span>
                ) : (
                  <a href="https://headshotsbymarie.com" target="_blank" rel="noopener noreferrer" className="hover:text-black/50 transition-colors">Marie Feutrier — headshotsbymarie.com</a>
                )}
              </p>
            )}
          </div>
        </section>
      )}

      {/* 6. Full Article */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <article
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* 7. Social Share */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="font-heading font-bold text-lg text-black mb-4">Share this episode</h2>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=https://speakarizona.com/news/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-light text-text hover:bg-blue hover:text-white px-4 py-2 rounded-full text-sm font-heading font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=https://speakarizona.com/news/${slug}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-light text-text hover:bg-blue hover:text-white px-4 py-2 rounded-full text-sm font-heading font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=https://speakarizona.com/news/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-light text-text hover:bg-blue hover:text-white px-4 py-2 rounded-full text-sm font-heading font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Check out this episode of Speak Arizona: https://speakarizona.com/news/${slug}`)}`}
                className="inline-flex items-center gap-2 bg-gray-light text-text hover:bg-blue hover:text-white px-4 py-2 rounded-full text-sm font-heading font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                Email
              </a>
            </div>
          </div>

          {/* 8. You May Also Like */}
          {otherPosts.length > 0 && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h2 className="font-heading font-bold text-2xl text-black mb-6">
                You May Also Like
              </h2>
              <div
                className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {otherPosts.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/news/${other.slug}`}
                    className="flex-shrink-0 w-[85%] md:w-auto bg-gray-light rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-yellow text-black text-xs font-heading font-bold px-3 py-1 rounded-full">
                        {other.tag}
                      </span>
                      <span className="text-text-light text-sm">
                        {other.date}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-lg text-black mb-2">
                      {other.title}
                    </h3>
                    <p className="text-text-light text-sm leading-relaxed">
                      {other.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-gray-200">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-blue font-heading font-semibold hover:underline"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to all posts
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .blog-content h2 {
          font-family: var(--font-heading), system-ui, sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }
        .blog-content h3 {
          font-family: var(--font-heading), system-ui, sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .blog-content p {
          font-size: 1.125rem;
          line-height: 1.8;
          color: #555;
          margin-bottom: 1.25rem;
        }
        .blog-content strong {
          color: #1a1a1a;
          font-weight: 600;
        }
        .blog-content em {
          font-style: italic;
        }
        .blog-content a {
          color: #004165;
          text-decoration: underline;
          transition: color 0.2s;
        }
        .blog-content a:hover {
          color: #005a8c;
        }
        .blog-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .blog-content ul li {
          font-size: 1.125rem;
          line-height: 1.8;
          color: #555;
          margin-bottom: 0.5rem;
        }
        .blog-content hr {
          border: none;
          border-top: 1px solid #e5e5e5;
          margin: 2.5rem 0;
        }
        .blog-content blockquote {
          border-left: 3px solid #F2DF74;
          padding-left: 1.25rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #444;
        }
      `}</style>
    </>
  );
}
