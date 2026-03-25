import Link from "next/link";
import Image from "next/image";
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
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <>
      {/* Hero with Featured Post */}
      {featuredPost ? (
        <section className="py-8 md:py-12 pb-16 md:pb-12" style={{ backgroundImage: "url('/images/gradient-square.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-8 md:hidden">
              News
            </h1>
            <Link href={`/news/${featuredPost.slug}`} className="block group">
              <div className="grid md:grid-cols-2 gap-8 md:items-center">
                {(featuredPost.cardImage || featuredPost.image) && (
                  <div className="overflow-hidden rounded-2xl shadow-lg aspect-[16/9] md:aspect-[5/4]">
                    <Image
                      src={featuredPost.cardImage || featuredPost.image!}
                      alt={featuredPost.cardImageAlt || featuredPost.imageAlt || featuredPost.title}
                      width={1200}
                      height={675}
                      className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                )}
                <div>
                  <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-8 hidden md:block">
                    News
                  </h1>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-yellow text-black text-xs font-heading font-bold px-3 py-1 rounded-full">
                      {featuredPost.tag}
                    </span>
                    <span className="text-white/70 text-sm">{featuredPost.date}</span>
                  </div>
                  <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mb-4 group-hover:underline">
                    {featuredPost.title}
                  </h2>
                  <p className="text-white/80 text-lg leading-relaxed mb-4">
                    {featuredPost.excerpt}
                  </p>
                  {featuredPost.guest && (
                    <p className="text-white/60 text-sm">
                      Guest: {featuredPost.guest}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </section>
      ) : (
        <section className="py-16 md:py-24" style={{ backgroundImage: "url('/images/gradient-square.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="max-w-6xl mx-auto px-6 text-center text-white">
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-6">
              News
            </h1>
            <p className="text-white/80 text-lg">No posts yet. Stay tuned!</p>
          </div>
        </section>
      )}

      {remainingPosts.length > 0 && (
        <section className="bg-white py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-black mb-10">
              More on Public Speaking, Leadership &amp; Communication
            </h2>
            <div className="space-y-8">
              {remainingPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-gray-light rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] md:flex md:gap-8 md:items-center"
                >
                  {(post.cardImage || post.image) && (
                    <div className="hidden md:block md:flex-shrink-0 md:w-48 overflow-hidden rounded-xl">
                      <Image
                        src={post.cardImage || post.image!}
                        alt={post.cardImageAlt || post.imageAlt || post.title}
                        width={400}
                        height={320}
                        className="w-full h-full object-cover"
                        style={{ aspectRatio: "5/4" }}
                      />
                    </div>
                  )}
                  <div>
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
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
