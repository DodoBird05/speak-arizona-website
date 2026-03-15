import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Public Speaking & Leadership News",
  description:
    "Tips, stories, and strategies on public speaking, communication skills, and leadership from the Speak Arizona podcast.",
  alternates: {
    canonical: "https://speakarizona.com/news",
  },
};

export default function Blog() {
  const posts = getAllPosts();

  return (
    <>
      {/* Hero */}
      <section className="bg-blue py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 text-center text-white">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-6">
            News
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            Stories, insights, and updates from Speak Arizona.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          {posts.length === 0 ? (
            <div className="text-center text-text-light">
              <p>No posts yet. Stay tuned!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-gray-light rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-yellow text-black text-xs font-heading font-bold px-3 py-1 rounded-full">
                      {post.tag}
                    </span>
                    <span className="text-text-light text-sm">{post.date}</span>
                  </div>
                  <h2 className="font-heading font-bold text-xl text-black mb-3">
                    <Link
                      href={`/news/${post.slug}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-text-light leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  {post.guest && (
                    <p className="text-text-light text-sm">
                      Guest: {post.guest}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
