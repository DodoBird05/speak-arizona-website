import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public Speaking & Leadership News",
  description:
    "Tips, stories, and strategies on public speaking, communication skills, and leadership from the Speak Arizona podcast.",
  alternates: {
    canonical: "https://speakarizona.com/news",
  },
};

// Placeholder blog posts — replace with real content or a CMS later
const posts = [
  {
    slug: "welcome-to-speak-arizona",
    title: "Welcome to Speak Arizona",
    date: "March 2026",
    excerpt:
      "Introducing our podcast and what you can expect from Courageous Conversations.",
    tag: "Announcement",
  },
  {
    slug: "why-public-speaking-matters",
    title: "Why Public Speaking Still Matters in 2026",
    date: "March 2026",
    excerpt:
      "In an age of AI and automation, the ability to connect with a live audience is more valuable than ever.",
    tag: "Communication",
  },
  {
    slug: "finding-your-voice",
    title: "Finding Your Voice: Lessons from Toastmasters",
    date: "March 2026",
    excerpt:
      "What I learned about authentic communication through years of Toastmasters.",
    tag: "Leadership",
  },
];

export default function Blog() {
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
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-gray-light rounded-2xl p-8 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-yellow text-black text-xs font-heading font-bold px-3 py-1 rounded-full">
                    {post.tag}
                  </span>
                  <span className="text-text-light text-sm">{post.date}</span>
                </div>
                <h2 className="font-heading font-bold text-xl text-black mb-3">
                  <Link href={`/news/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-text-light leading-relaxed">
                  {post.excerpt}
                </p>
              </article>
            ))}
          </div>

          <div className="text-center mt-12 text-text-light">
            <p>More posts coming soon. Stay tuned!</p>
          </div>
        </div>
      </section>
    </>
  );
}
