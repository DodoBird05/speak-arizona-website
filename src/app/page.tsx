import Image from "next/image";
import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";
import LatestVideo from "@/components/LatestVideo";
import EpisodeCarousel from "@/components/EpisodeCarousel";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const YOUTUBE_CHANNEL_ID = "UCZG0h9pQsTHWuo2Z_EkCDJA";
const UPLOADS_PLAYLIST_ID = "UUZG0h9pQsTHWuo2Z_EkCDJA"; // UC → UU
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";

type Video = {
  videoId: string;
  title: string;
  published: string;
  description: string;
  thumbnail: string;
};

type YouTubePlaylistItem = {
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    resourceId: { videoId: string };
    thumbnails: { medium?: { url: string }; high?: { url: string } };
  };
};

type YouTubeVideoItem = {
  id: string;
  contentDetails: { duration: string };
};

async function getVideos(): Promise<{ latest: Video | null; recent: Video[] }> {
  // Try YouTube Data API first
  if (YOUTUBE_API_KEY) {
    try {
      // Fetch latest 50 uploads
      const listRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=50&key=${YOUTUBE_API_KEY}`,
        { next: { revalidate: 3600 } }
      );
      const listData = await listRes.json();
      const items: YouTubePlaylistItem[] = listData.items || [];

      // Get video IDs to check duration (filter Shorts)
      const videoIds = items.map((i) => i.snippet.resourceId.videoId).join(",");
      const detailRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`,
        { next: { revalidate: 3600 } }
      );
      const detailData = await detailRes.json();
      const details: YouTubeVideoItem[] = detailData.items || [];

      // Build duration map — Shorts are under 61 seconds (PT1M or less)
      const durationMap = new Map<string, boolean>();
      for (const d of details) {
        const dur = d.contentDetails.duration; // e.g. PT1M30S, PT45S, PT1H2M
        const isShort = /^PT(\d+S|[0-5]?\dS|1M)$/.test(dur);
        durationMap.set(d.id, !isShort);
      }

      const fullVideos: Video[] = [];
      for (const item of items) {
        const vid = item.snippet.resourceId.videoId;
        if (!durationMap.get(vid)) continue; // skip Shorts
        fullVideos.push({
          videoId: vid,
          title: item.snippet.title,
          published: item.snippet.publishedAt,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || `https://i.ytimg.com/vi/${vid}/mqdefault.jpg`,
        });
      }

      return {
        latest: fullVideos[0] || null,
        recent: fullVideos.slice(1, 7),
      };
    } catch {
      // Fall through to RSS fallback
    }
  }

  // RSS fallback (no API key)
  try {
    const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
    const res = await fetch(RSS_URL, { next: { revalidate: 3600 } });
    const xml = await res.text();
    const entries = xml.split("<entry>").slice(1);

    const fullVideos: Video[] = [];
    for (const entry of entries) {
      const linkMatch = entry.match(/<link rel="alternate" href="([^"]+)"/);
      const href = linkMatch?.[1] || "";
      if (href.includes("/shorts/")) continue;
      const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
      const descMatch = entry.match(/<media:description>([^<]*)<\/media:description>/);
      if (idMatch) {
        fullVideos.push({
          videoId: idMatch[1],
          title: (titleMatch?.[1] || "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
          published: publishedMatch?.[1] || "",
          description: (descMatch?.[1] || "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
          thumbnail: `https://i.ytimg.com/vi/${idMatch[1]}/mqdefault.jpg`,
        });
      }
    }

    return {
      latest: fullVideos[0] || null,
      recent: fullVideos.slice(1, 5),
    };
  } catch {
    return { latest: null, recent: [] };
  }
}

export default async function Home() {
  const { latest, recent } = await getVideos();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What is Speak Arizona?", acceptedAnswer: { "@type": "Answer", text: "Speak Arizona is a weekly podcast about public speaking, leadership, and communication skills. Hosted by Rupesh Parbhoo and powered by District 3 Toastmasters International, each episode features courageous conversations with world-class speakers, authors, coaches, and leaders." } },
      { "@type": "Question", name: "Who hosts the Speak Arizona podcast?", acceptedAnswer: { "@type": "Answer", text: "Speak Arizona is hosted by Rupesh Parbhoo, an Arizona-based speaker and communication coach. Rupesh is a Toastmasters leader who believes that the best conversations happen when people are willing to be courageous." } },
      { "@type": "Question", name: "How often are new episodes released?", acceptedAnswer: { "@type": "Answer", text: "New episodes are released every week. You can subscribe on Spotify, Apple Podcasts, or YouTube to get notified when a new episode drops." } },
      { "@type": "Question", name: "Where can I listen to Speak Arizona?", acceptedAnswer: { "@type": "Answer", text: "Speak Arizona is available on Spotify, Apple Podcasts, YouTube, and most major podcast platforms. You can also watch full video episodes on the Speak Arizona YouTube channel." } },
      { "@type": "Question", name: "Do I need to be a Toastmasters member to listen?", acceptedAnswer: { "@type": "Answer", text: "Not at all. While Speak Arizona is powered by District 3 Toastmasters, the podcast is for everyone — whether you're a seasoned speaker, a first-time presenter, or someone who just wants to communicate better at work and in life." } },
      { "@type": "Question", name: "What topics does Speak Arizona cover?", acceptedAnswer: { "@type": "Answer", text: "Episodes cover public speaking techniques, leadership development, interview and career communication, team management, confidence building, networking strategies, and personal branding through communication." } },
      { "@type": "Question", name: "Can I be a guest on Speak Arizona?", acceptedAnswer: { "@type": "Answer", text: "Yes! Speak Arizona is always looking for guests with compelling stories and expertise in public speaking, leadership, or communication. Reach out through the contact page to pitch your story." } },
      { "@type": "Question", name: "What is Toastmasters International?", acceptedAnswer: { "@type": "Answer", text: "Toastmasters International is the world's leading organization for developing public speaking and leadership skills. With over 16,800 clubs in 143 countries, Toastmasters provides a supportive environment where members practice communication, build confidence, and grow as leaders. District 3 serves Arizona, New Mexico, and West Texas." } },
      { "@type": "Question", name: "Is Speak Arizona only about public speaking?", acceptedAnswer: { "@type": "Answer", text: "Not at all. While public speaking is a core topic, Speak Arizona covers a wide range of communication and leadership skills — including how to lead meetings effectively, navigate difficult workplace conversations, build confidence in interviews, network authentically, and develop your personal brand through better communication." } },
      { "@type": "Question", name: "Who are some notable guests on Speak Arizona?", acceptedAnswer: { "@type": "Answer", text: "Speak Arizona has featured World Champions of Public Speaking Darren LaCroix and Mark Brown, leadership coach Kelly Soifer, and William Miller — a 10-year-old world-renowned public speaker on leadership. Every guest brings a unique perspective on what it means to communicate with courage and purpose." } },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Hero */}
      <section className="overflow-hidden">
        {/* Desktop hero with overlay */}
        <div className="hidden md:block relative">
          <Image
            src="/images/hero.png"
            alt="Rupesh Parbhoo, host of Speak Arizona podcast"
            width={1400}
            height={600}
            priority
            className="w-full h-auto"
          />
          {/* Text overlay on right — desktop only */}
          <div className="absolute inset-0 flex items-center justify-end">
            <div className="pr-6 md:pr-12 lg:pr-20 max-w-[55%] text-center">
              <h1
                className="font-heading font-bold text-white text-3xl md:text-4xl lg:text-5xl uppercase"
              >
                {["COURAGEOUS", "CONVERSATIONS", "FOR"].map((word) => (
                  <span key={word} className="inline-block transition-transform duration-200 ease-out hover:scale-110 cursor-default mr-[0.3em]">{word}</span>
                ))}
                <span className="inline-block transition-transform duration-200 ease-out hover:scale-110 cursor-default mr-[0.3em]" style={{ backgroundColor: "#F2DF74", color: "#000", padding: "0 4px" }}>BETTER COMMUNICATORS</span>
                <span className="inline-block transition-transform duration-200 ease-out hover:scale-110 cursor-default mr-[0.3em]">AND</span>
                <span className="inline-block transition-transform duration-200 ease-out hover:scale-110 cursor-default mr-[0.3em]" style={{ backgroundColor: "#F2DF74", color: "#000", padding: "0 4px" }}>LEADERS</span>
              </h1>
            </div>
          </div>
        </div>
        {/* Mobile hero */}
        <div className="md:hidden relative">
          <Image
            src="/images/hero-mobile.png"
            alt="Rupesh Parbhoo, host of Speak Arizona podcast"
            width={800}
            height={900}
            priority
            className="w-full h-auto"
          />
          <div className="absolute top-6 left-0 right-0 px-6 flex items-center justify-between">
            <span
              className="font-heading font-black text-white text-2xl uppercase"
              style={{ letterSpacing: "-0.06em" }}
            >
              SPEAK ARIZONA
            </span>
            <MobileMenu />
          </div>
        </div>
        {/* Mobile tagline */}
        <div className="md:hidden bg-white px-6 py-8 text-center">
          <h1
            className="font-heading font-bold text-black text-3xl md:text-4xl uppercase"
          >
            COURAGEOUS CONVERSATIONS FOR <span style={{ backgroundColor: "#F2DF74", padding: "0 4px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>BETTER COMMUNICATORS AND LEADERS</span>
          </h1>
        </div>
        {/* Description — visible on all devices */}
        <div className="bg-white px-6 py-10 md:py-16">
          <div className="max-w-6xl mx-auto md:grid md:grid-cols-2 md:gap-12 md:items-start">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-black leading-snug mb-6 md:mb-0 md:transition-transform md:duration-300 md:ease-out md:hover:scale-105 md:cursor-default" style={{ transformOrigin: "left center" }}>
              Your space to grow your voice, sharpen your leadership, and connect with people — one conversation at a time.
            </h2>
            <div>
              <p className="text-text-light text-base md:text-lg leading-relaxed mb-4">
                Whether you&apos;re stepping into a job interview, leading a team meeting, or standing on a stage for the first time, how you communicate changes everything.
              </p>
              <p className="text-text-light text-base md:text-lg leading-relaxed mb-4">
                Speak Arizona is the podcast where host Rupesh Parbhoo has courageous conversations about leadership, communication, and confidence — the skills that turn everyday moments into career-changing ones. Each episode brings you practical tips, honest stories, and real-world strategies from professionals who&apos;ve been in the trenches, not just on the stage.
              </p>
              <p className="text-text-light text-base md:text-lg leading-relaxed mb-4">
                No fluff. No corporate jargon. Just two friends (and the occasional guest) having the conversations that actually make a difference.
              </p>
              <p className="text-black/50 text-sm leading-relaxed">
                Speak Arizona is powered by District 3 Toastmasters International, serving Arizona, New Mexico, and West Texas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Episode */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll className="mb-12">
            <p className="text-text-light text-sm uppercase tracking-wide">
              newest episode
            </p>
          </AnimateOnScroll>

          <LatestVideo video={latest} />

          {recent.length > 0 && (
            <div className="mt-16">
              <p className="text-text-light text-sm uppercase tracking-wide mb-8">
                more episodes
              </p>
              <EpisodeCarousel episodes={recent} />
            </div>
          )}
        </div>
      </section>

      {/* About preview */}
      <section className="py-20" style={{ backgroundImage: "url('/images/gradient-square.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="overflow-hidden rounded-3xl shadow-lg">
              <Image
                src="/images/rupesh-yellow.jpg"
                alt="Rupesh Parbhoo"
                width={600}
                height={750}
                className="w-full h-auto transition-transform duration-500 ease-out hover:scale-110"
              />
            </div>
            <div>
              <AnimateOnScroll>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-black mb-6">
                  HOSTED BY RUPESH PARBHOO, ARIZONA SPEAKER &amp; COMMUNICATION COACH
                </h2>
              </AnimateOnScroll>
              <p className="text-black text-lg leading-relaxed mb-4">
                Rupesh Parbhoo is a speaker, leader, and storyteller who
                believes that the best conversations happen when people are
                willing to be courageous. As a Toastmasters leader in Arizona, he has spent years helping professionals find their voice, own their message, and step into leadership roles with confidence.
              </p>
              <p className="text-black text-lg leading-relaxed mb-4">
                Through Speak Arizona, he brings together voices from across the
                state to explore what it means to communicate with purpose,
                lead with empathy, and show up authentically.
              </p>
              <p className="text-black text-lg leading-relaxed mb-8">
                From World Champions of Public Speaking to 10-year-old leadership prodigies, Rupesh&apos;s guest list reflects his belief that great communication can come from anywhere — and that everyone has a story worth sharing.
              </p>
              <Link
                href="/about"
                className="inline-block bg-yellow text-black font-heading font-bold text-sm px-6 py-3 rounded-full hover:bg-yellow-light transition-colors"
              >
                LEARN MORE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-black mb-8">
              A WEEKLY PODCAST ON PUBLIC SPEAKING, LEADERSHIP &amp; COMMUNICATION
            </h2>
          </AnimateOnScroll>
          <p className="text-text-light text-lg leading-relaxed mb-8">
            Each week, Speak Arizona brings you conversations on
          </p>
          <div className="topic-cards-grid">
            <div className="bg-gray-light rounded-2xl p-4 flex flex-col items-center text-center card-hover" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="w-10 h-10 bg-yellow rounded-full flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-sm text-black mb-1">Public Speaking Tips</h3>
              <p className="text-text-light text-xs leading-relaxed">Practical techniques to improve your presentations, speeches, and everyday communication.</p>
            </div>
            <div className="bg-gray-light rounded-2xl p-4 flex flex-col items-center text-center card-hover" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="w-10 h-10 bg-yellow rounded-full flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-sm text-black mb-1">Interview &amp; Career Communication</h3>
              <p className="text-text-light text-xs leading-relaxed">Strategies to stand out in job interviews, sell yourself authentically, and navigate career transitions.</p>
            </div>
            <div className="bg-gray-light rounded-2xl p-4 flex flex-col items-center text-center card-hover" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="w-10 h-10 bg-yellow rounded-full flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-sm text-black mb-1">Leadership in Practice</h3>
              <p className="text-text-light text-xs leading-relaxed">Real-world leadership skills for managing teams, navigating conflict, and building influence.</p>
            </div>
            <div className="bg-gray-light rounded-2xl p-4 flex flex-col items-center text-center card-hover" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="w-10 h-10 bg-yellow rounded-full flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-sm text-black mb-1">Communication for Impact</h3>
              <p className="text-text-light text-xs leading-relaxed">How to use your voice to grow your business, strengthen your brand, and connect with any audience.</p>
            </div>
          </div>
          <p className="text-text-light text-base leading-relaxed mt-8">
            Whether you&apos;re looking for actionable public speaking tips you can use before your next presentation, strategies to ace your next job interview, or insights on how to lead your team with more empathy and clarity — Speak Arizona has an episode for you. New episodes drop every week, so subscribe and never miss a conversation that could change the way you communicate.
          </p>
        </div>
      </section>

      {/* Expert Guests */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-black mb-8">
              LEARN FROM WORLD-CLASS SPEAKERS &amp; LEADERSHIP EXPERTS
            </h2>
          </AnimateOnScroll>
          <div className="overflow-hidden rounded-2xl shadow-lg mb-8">
            <Image
              src="/images/guests-interview.png"
              alt="Darren LaCroix and Mark Brown interviewed by Rupesh Parbhoo and Serban Mare for Speak Arizona"
              width={1200}
              height={675}
              className="w-full h-auto transition-transform duration-500 ease-out hover:scale-110"
            />
          </div>
          <p className="text-text-light text-lg leading-relaxed">
            Every episode features guests who&apos;ve earned their place at the top — from World Champions of Public Speaking like Darren LaCroix and Mark Brown, to leadership coach Kelly Soifer, to William Miller, a 10-year-old world-renowned speaker on leadership. We don&apos;t chase trends. We bring you the people who set them.
          </p>
        </div>
      </section>

      {/* Who Is This Podcast For */}
      <section className="bg-gray-light py-20">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-black mb-4">
              WHO IS SPEAK ARIZONA FOR?
            </h2>
          </AnimateOnScroll>
          <p className="text-text-light text-lg leading-relaxed mb-8">
            Whether you&apos;re just getting started or looking to level up, Speak Arizona is for anyone who wants to communicate with more confidence and lead with more purpose.
          </p>
        </div>
        <div className="max-w-6xl mx-auto pl-6">
          <div
            className="flex gap-4 overflow-x-auto pb-4 pr-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Job Interviews */}
            <div
              className="flex-shrink-0 rounded-2xl p-6 flex flex-col justify-between card-hover"
              style={{ width: "260px", minHeight: "300px", background: "linear-gradient(135deg, #004165 0%, #005a8c 100%)" }}
            >
              <div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2">
                  Professionals Preparing for Job Interviews
                </h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Learn how to introduce yourself with confidence, answer tough questions authentically, and leave a lasting impression in any interview setting.
              </p>
            </div>

            {/* Managers */}
            <div
              className="flex-shrink-0 rounded-2xl p-6 flex flex-col justify-between card-hover"
              style={{ width: "260px", minHeight: "300px", background: "#F2DF74" }}
            >
              <div>
                <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-lg text-black mb-2">
                  Managers &amp; Team Leaders
                </h3>
              </div>
              <p className="text-black/70 text-sm leading-relaxed">
                Discover how to lead meetings that people actually want to attend, navigate difficult conversations with empathy, and build a culture where every voice matters.
              </p>
            </div>

            {/* Entrepreneurs */}
            <div
              className="flex-shrink-0 rounded-2xl p-6 flex flex-col justify-between card-hover"
              style={{ width: "260px", minHeight: "300px", background: "linear-gradient(135deg, #003350 0%, #004165 100%)" }}
            >
              <div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2">
                  Entrepreneurs &amp; Business Owners
                </h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Your business grows when your message is clear. Learn how to pitch with conviction, network with purpose, and use your voice to build a brand people trust.
              </p>
            </div>

            {/* First-Time Speakers */}
            <div
              className="flex-shrink-0 rounded-2xl p-6 flex flex-col justify-between card-hover"
              style={{ width: "260px", minHeight: "300px", background: "#F2DF74" }}
            >
              <div>
                <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-lg text-black mb-2">
                  First-Time &amp; Aspiring Speakers
                </h3>
              </div>
              <p className="text-black/70 text-sm leading-relaxed">
                Stepping onto a stage for the first time can be terrifying. Speak Arizona gives you the practical tips, mindset shifts, and real stories you need to go from nervous to natural.
              </p>
            </div>

            {/* Introverts */}
            <div
              className="flex-shrink-0 rounded-2xl p-6 flex flex-col justify-between card-hover"
              style={{ width: "260px", minHeight: "300px", background: "linear-gradient(135deg, #004165 0%, #005a8c 100%)" }}
            >
              <div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2">
                  Introverts Who Want to Be Heard
                </h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Being quiet doesn&apos;t mean you have nothing to say. Learn how to communicate powerfully without changing who you are — in meetings, on stage, and in everyday conversations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Toastmasters */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-black mb-8">
              POWERED BY DISTRICT 3 TOASTMASTERS INTERNATIONAL
            </h2>
          </AnimateOnScroll>
          <p className="text-text-light text-lg leading-relaxed mb-4">
            Speak Arizona is proudly produced by District 3 of Toastmasters International, serving over 125 clubs across Arizona, New Mexico, and West Texas. Toastmasters is the world&apos;s leading organization for developing public speaking, communication, and leadership skills through a supportive, peer-driven community.
          </p>
          <p className="text-text-light text-lg leading-relaxed mb-4">
            With nearly 100 years of history, Toastmasters has helped millions of people around the world find their voice and grow as leaders. District 3 carries that mission forward in the Southwest — and Speak Arizona extends it beyond the meeting room to anyone with an internet connection and a desire to grow.
          </p>
          <p className="text-text-light text-lg leading-relaxed">
            Whether you&apos;re a Toastmasters member or you&apos;ve never heard of the organization, this podcast is for you. Every episode is designed to give you something you can use right away — in your next meeting, your next presentation, or your next conversation.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-light py-20">
        <div className="max-w-4xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-black mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </AnimateOnScroll>
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-bold text-lg text-black mb-1">What is Speak Arizona?</h3>
              <p className="text-text-light leading-relaxed">Speak Arizona is a weekly podcast about public speaking, leadership, and communication skills. Hosted by Rupesh Parbhoo and powered by District 3 Toastmasters International, each episode features courageous conversations with world-class speakers, authors, coaches, and leaders.</p>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-black mb-1">Who hosts the Speak Arizona podcast?</h3>
              <p className="text-text-light leading-relaxed">Speak Arizona is hosted by Rupesh Parbhoo, an Arizona-based speaker and communication coach. Rupesh is a Toastmasters leader who believes that the best conversations happen when people are willing to be courageous.</p>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-black mb-1">How often are new episodes released?</h3>
              <p className="text-text-light leading-relaxed">New episodes are released every week. You can subscribe on Spotify, Apple Podcasts, or YouTube to get notified when a new episode drops.</p>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-black mb-1">Where can I listen to Speak Arizona?</h3>
              <p className="text-text-light leading-relaxed">Speak Arizona is available on Spotify, Apple Podcasts, YouTube, and most major podcast platforms. You can also watch full video episodes on the Speak Arizona YouTube channel.</p>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-black mb-1">Do I need to be a Toastmasters member to listen?</h3>
              <p className="text-text-light leading-relaxed">Not at all. While Speak Arizona is powered by District 3 Toastmasters, the podcast is for everyone — whether you&apos;re a seasoned speaker, a first-time presenter, or someone who just wants to communicate better at work and in life.</p>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-black mb-1">What topics does Speak Arizona cover?</h3>
              <p className="text-text-light leading-relaxed">Episodes cover a wide range of topics including public speaking techniques, leadership development, interview and career communication, team management, confidence building, networking strategies, and personal branding through communication.</p>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-black mb-1">Can I be a guest on Speak Arizona?</h3>
              <p className="text-text-light leading-relaxed">Yes! Speak Arizona is always looking for guests with compelling stories and expertise in public speaking, leadership, or communication. Reach out through our contact page to pitch your story.</p>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-black mb-1">What is Toastmasters International?</h3>
              <p className="text-text-light leading-relaxed">Toastmasters International is the world&apos;s leading organization for developing public speaking and leadership skills. With over 16,800 clubs in 143 countries, Toastmasters provides a supportive environment where members practice communication, build confidence, and grow as leaders. District 3 serves Arizona, New Mexico, and West Texas.</p>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-black mb-1">Is Speak Arizona only about public speaking?</h3>
              <p className="text-text-light leading-relaxed">Not at all. While public speaking is a core topic, Speak Arizona covers a wide range of communication and leadership skills — including how to lead meetings effectively, navigate difficult workplace conversations, build confidence in interviews, network authentically, and develop your personal brand through better communication.</p>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-black mb-1">Who are some notable guests on Speak Arizona?</h3>
              <p className="text-text-light leading-relaxed">Speak Arizona has featured World Champions of Public Speaking Darren LaCroix and Mark Brown, leadership coach Kelly Soifer, and William Miller — a 10-year-old world-renowned public speaker on leadership. Every guest brings a unique perspective on what it means to communicate with courage and purpose.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-light py-20">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-black mb-4 text-center">
              EVERY EPISODE MAKES YOU A STRONGER COMMUNICATOR
            </h2>
          </AnimateOnScroll>
          <p className="text-text-light text-lg mb-10 text-center">
            Subscribe on your favorite platform and join the conversation.
          </p>
          <p className="font-heading font-bold text-black mb-4">
            Listen, watch, or subscribe:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }} className="md:grid-cols-3">
            <a
              href="https://open.spotify.com/show/speak-arizona"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black rounded-2xl p-4 flex items-center justify-center gap-3 hover:bg-black/80 card-hover"
            >
              <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="#1DB954">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <div>
                <span className="text-white/70 text-xs block">Listen on</span>
                <span className="text-white font-heading font-bold text-lg">Spotify</span>
              </div>
            </a>
            <a
              href="https://podcasts.apple.com/us/podcast/speak-arizona"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black rounded-2xl p-4 flex items-center justify-center gap-3 hover:bg-black/80 card-hover"
            >
              <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="#9933FF">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6a8.4 8.4 0 018.4 8.4c0 2.607-1.194 4.937-3.063 6.474a.9.9 0 01-1.254-.144.9.9 0 01.144-1.254A6.6 6.6 0 0018.6 12 6.6 6.6 0 0012 5.4 6.6 6.6 0 005.4 12c0 2.1.984 3.972 2.514 5.178a.9.9 0 01-.99 1.503C4.98 17.1 3.6 14.7 3.6 12A8.4 8.4 0 0112 3.6zm0 3.6a4.8 4.8 0 014.8 4.8c0 1.47-.663 2.787-1.707 3.666a.9.9 0 01-1.188-1.35A3.003 3.003 0 0015 12a3 3 0 00-6 0c0 .924.42 1.752 1.08 2.304a.9.9 0 11-1.14 1.392A4.8 4.8 0 017.2 12 4.8 4.8 0 0112 7.2zm0 3.6a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zm-.6 3.6h1.2c.331 0 .6.269.6.6v4.2c0 .993-.806 1.8-1.8 1.8h.6c-.994 0-1.8-.807-1.8-1.8V15c0-.331.269-.6.6-.6z"/>
              </svg>
              <div>
                <span className="text-white/70 text-xs block">Listen on</span>
                <span className="text-white font-heading font-bold text-lg">Apple Podcasts</span>
              </div>
            </a>
            <a
              href="https://www.youtube.com/@speakarizona"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black rounded-2xl p-4 flex items-center justify-center gap-3 hover:bg-black/80 card-hover col-span-2 md:col-span-1"
            >
              <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <div>
                <span className="text-white/70 text-xs block">Watch on</span>
                <span className="text-white font-heading font-bold text-lg">YouTube</span>
              </div>
            </a>
          </div>
          <p className="font-heading font-bold text-black mb-4 mt-10">
            Follow us on social media:
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.instagram.com/speakarizona/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label="Follow Speak Arizona on Instagram"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/showcase/speak-arizona/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label="Follow Speak Arizona on LinkedIn"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://www.facebook.com/people/Speak-Arizona/61587110443189/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label="Follow Speak Arizona on Facebook"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@speakarizona"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label="Follow Speak Arizona on TikTok"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>
          <p className="text-text-light text-sm leading-relaxed mt-6">
            Join the Speak Arizona community on social media for daily public speaking tips, behind-the-scenes clips, and highlights from our latest episodes. Whether you prefer short-form video on TikTok and Instagram or professional insights on LinkedIn, we&apos;re sharing content that helps you become a better communicator every day.
          </p>
        </div>
      </section>
    </>
  );
}
