import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllSlugs, getAllPosts, getPostBySlug } from "@/lib/blog";

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
      ...(post.image && {
        images: [
          {
            url: `https://speakarizona.com${post.image}`,
            alt: post.imageAlt || post.title,
          },
        ],
      }),
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
    ...(post.image && {
      image: `https://speakarizona.com${post.image}`,
    }),
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero */}
      <section className="bg-blue py-16 md:py-24">
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

      {/* Featured Image */}
      {post.image && (
        <section className="bg-white pt-12">
          <div className="max-w-3xl mx-auto px-6">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={post.image}
                alt={post.imageAlt || post.title}
                width={800}
                height={1000}
                className="w-full h-auto"
              />
            </div>
            <p className="text-black/30 text-xs mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M8.5 6L10 3h4l1.5 3" /><circle cx="12" cy="13" r="3.5" /></svg>
              <a href="https://headshotsbymarie.com" target="_blank" rel="noopener noreferrer" className="hover:text-black/50 transition-colors">Marie Feutrier — headshotsbymarie.com</a>
            </p>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <article
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {otherPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-200">
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
