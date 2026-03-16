import Image from "next/image";
import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";
import LatestVideo from "@/components/LatestVideo";
import EpisodeCarousel from "@/components/EpisodeCarousel";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import FaqAccordion from "@/components/FaqAccordion";
import ListenSubscribe from "@/components/ListenSubscribe";

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
            src="/images/speak-arizona-podcast-public-speaking-leadership-by-marie-feutrier.webp"
            alt="Rupesh Parbhoo, host of Speak Arizona podcast"
            width={1400}
            height={600}
            priority
            className="w-full h-auto"
          />
          {/* Text overlay on right — desktop only */}
          <div className="absolute inset-0 flex items-center justify-end">
            <div className="pr-6 md:pr-12 lg:pr-20 max-w-[55%] text-center">
              <h1 className="font-heading font-medium text-white/80 text-sm md:text-base lg:text-lg mb-4 tracking-wide">
                Speak Arizona Podcast — Public Speaking, Leadership &amp; Communication
              </h1>
              <p
                className="font-heading font-bold text-white text-3xl md:text-4xl lg:text-5xl uppercase"
              >
                {["COURAGEOUS", "CONVERSATIONS", "TO"].map((word) => (
                  <span key={word} className="inline-block transition-transform duration-200 ease-out hover:scale-110 cursor-default mr-[0.3em]">{word}</span>
                ))}
                <span className="inline-block transition-transform duration-200 ease-out hover:scale-110 cursor-default mr-[0.3em]" style={{ backgroundColor: "#F2DF74", color: "#000", padding: "0 4px" }}>LEAD AUTHENTICALLY</span>
                <span className="inline-block transition-transform duration-200 ease-out hover:scale-110 cursor-default mr-[0.3em]" style={{ backgroundColor: "#F2DF74", color: "#000", padding: "0 4px" }}>INSPIRE ACTION</span>
                <span className="inline-block transition-transform duration-200 ease-out hover:scale-110 cursor-default mr-[0.3em]">AND</span>
                <span className="inline-block transition-transform duration-200 ease-out hover:scale-110 cursor-default mr-[0.3em]" style={{ backgroundColor: "#F2DF74", color: "#000", padding: "0 4px" }}>FIND YOUR VOICE</span>
              </p>
            </div>
          </div>
        </div>
        {/* Mobile hero */}
        <div className="md:hidden relative">
          <Image
            src="/images/speak-arizona-podcast-mobile-by-marie-feutrier.webp"
            alt="Rupesh Parbhoo, host of Speak Arizona podcast"
            width={800}
            height={900}
            priority
            className="w-full h-auto"
          />
          <div className="absolute top-6 left-0 right-0 px-6 flex items-center justify-between">
            <Link
              href="/"
              className="font-heading font-black text-white text-2xl uppercase"
              style={{ letterSpacing: "-0.06em" }}
            >
              SPEAK ARIZONA
            </Link>
            <MobileMenu />
          </div>
        </div>
        {/* Mobile tagline */}
        <div className="md:hidden bg-white px-6 py-8 text-center">
          <h1 className="font-heading font-medium text-text-light text-sm mb-3 tracking-wide">
            Speak Arizona Podcast — Public Speaking, Leadership &amp; Communication
          </h1>
          <p
            className="font-heading font-bold text-black text-3xl uppercase"
          >
            COURAGEOUS CONVERSATIONS TO <span style={{ backgroundColor: "#F2DF74", padding: "0 4px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>LEAD AUTHENTICALLY, INSPIRE ACTION, AND FIND YOUR VOICE</span>
          </p>
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
                Speak Arizona is the podcast where host Rupesh Parbhoo sits down with speakers, coaches, and leaders who&apos;ve mastered the craft of communication — and learned it the hard way. Each episode delivers honest conversations, real strategies, and lessons you can use immediately.
              </p>
              <p className="text-text-light text-base md:text-lg leading-relaxed mb-4">
                No fluff. No corporate jargon. Just courageous conversations that actually make a difference.
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
            <h2 className="text-text-light text-sm uppercase tracking-wide">
              Newest Episode
            </h2>
          </AnimateOnScroll>

          <LatestVideo video={latest} />

          {recent.length > 0 && (
            <div className="mt-16">
              <h2 className="text-text-light text-sm uppercase tracking-wide mb-8">
                More Episodes
              </h2>
              <EpisodeCarousel episodes={recent} />
            </div>
          )}
        </div>
      </section>

      {/* About preview */}
      <section className="py-20" style={{ backgroundImage: "url('/images/gradient-square.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src="/images/rupesh-parbhoo-speak-arizona-host-by-marie-feutrier.webp"
                  alt="Rupesh Parbhoo, speaker and host of Speak Arizona podcast"
                  width={600}
                  height={750}
                  className="w-full h-auto transition-transform duration-500 ease-out hover:scale-110"
                />
              </div>
              <p className="text-black/30 text-xs mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M8.5 6L10 3h4l1.5 3" /><circle cx="12" cy="13" r="3.5" /></svg>
                <a href="https://headshotsbymarie.com" target="_blank" rel="noopener noreferrer" className="hover:text-black/50 transition-colors">Marie Feutrier — headshotsbymarie.com</a>
              </p>
            </div>
            <div>
              <AnimateOnScroll>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-black mb-6">
                  HOSTED BY RUPESH PARBHOO, ARIZONA SPEAKER &amp; COMMUNICATION COACH
                </h2>
              </AnimateOnScroll>
              <p className="text-black text-lg leading-relaxed mb-4">
                Rupesh Parbhoo is a speaker, communication coach, and yoga instructor who believes that great communication is not about sounding perfect — it&apos;s about being real. With more than 15 years across corporate and startup environments, he has seen firsthand that communication is often the difference between simply managing work and truly inspiring people.
              </p>
              <p className="text-black text-lg leading-relaxed mb-4">
                Through Speak Arizona, he creates space for meaningful conversations that help people become stronger communicators, more confident leaders, and more authentic versions of themselves.
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
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-black mb-8">
              A WEEKLY PODCAST ON PUBLIC SPEAKING, LEADERSHIP &amp; COMMUNICATION
            </h2>
          </AnimateOnScroll>
          <p className="text-text-light text-lg leading-relaxed mb-8">
            Each week, Speak Arizona brings you conversations on
          </p>
          <div className="topic-cards-grid">
            <div className="bg-gray-light rounded-2xl p-4 flex flex-col items-center text-center card-hover" style={{ aspectRatio: "1/1" }}>
              <div className="w-10 h-10 bg-yellow rounded-full flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-sm text-black mb-1">Public Speaking Tips</h3>
              <p className="text-text-light text-xs leading-relaxed">Practical techniques to improve your presentations, speeches, and everyday communication.</p>
            </div>
            <div className="bg-gray-light rounded-2xl p-4 flex flex-col items-center text-center card-hover" style={{ aspectRatio: "1/1" }}>
              <div className="w-10 h-10 bg-yellow rounded-full flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-sm text-black mb-1">Interview &amp; Career Communication</h3>
              <p className="text-text-light text-xs leading-relaxed">Strategies to stand out in job interviews, sell yourself authentically, and navigate career transitions.</p>
            </div>
            <div className="bg-gray-light rounded-2xl p-4 flex flex-col items-center text-center card-hover" style={{ aspectRatio: "1/1" }}>
              <div className="w-10 h-10 bg-yellow rounded-full flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-sm text-black mb-1">Leadership in Practice</h3>
              <p className="text-text-light text-xs leading-relaxed">Real-world leadership skills for managing teams, navigating conflict, and building influence.</p>
            </div>
            <div className="bg-gray-light rounded-2xl p-4 flex flex-col items-center text-center card-hover" style={{ aspectRatio: "1/1" }}>
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
            From public speaking tips for your next presentation to leadership strategies for your next promotion, Speak Arizona has an episode for you. New episodes drop every week — subscribe and never miss a conversation that could change the way you communicate.
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
              src="/images/darren-lacroix-mark-brown-speak-arizona-interview.webp"
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
        <div className="max-w-6xl mx-auto pl-6 md:px-6">
          <div
            className="flex gap-4 overflow-x-auto pb-4 pr-6 md:grid md:grid-cols-3 md:overflow-visible md:pr-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Job Interviews */}
            <div
              className="audience-card flex-shrink-0 rounded-2xl p-6 flex flex-col justify-between card-hover"
              style={{ width: "260px", minHeight: "300px", backgroundImage: "url('/images/gradient-card.webp')", backgroundSize: "cover", backgroundPosition: "center" }}
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
              className="audience-card flex-shrink-0 rounded-2xl p-6 flex flex-col justify-between card-hover"
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
              className="audience-card flex-shrink-0 rounded-2xl p-6 flex flex-col justify-between card-hover"
              style={{ width: "260px", minHeight: "300px", backgroundImage: "url('/images/gradient-card.webp')", backgroundSize: "cover", backgroundPosition: "center" }}
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
              className="audience-card flex-shrink-0 rounded-2xl p-6 flex flex-col justify-between card-hover"
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
              className="audience-card flex-shrink-0 rounded-2xl p-6 flex flex-col justify-between card-hover"
              style={{ width: "260px", minHeight: "300px", backgroundImage: "url('/images/gradient-card.webp')", backgroundSize: "cover", backgroundPosition: "center" }}
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

            {/* Content Creators */}
            <div
              className="audience-card flex-shrink-0 rounded-2xl p-6 flex flex-col justify-between card-hover"
              style={{ width: "260px", minHeight: "300px", background: "#F2DF74" }}
            >
              <div>
                <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-lg text-black mb-2">
                  Aspiring Content Creators &amp; Video Hosts
                </h3>
              </div>
              <p className="text-black/70 text-sm leading-relaxed">
                Want to start a YouTube channel, podcast, or build your presence on camera? Learn how to speak naturally on video, engage an audience, and develop the on-screen confidence that sets great creators apart.
              </p>
            </div>
          </div>
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
          <FaqAccordion items={[
            { question: "What is Speak Arizona?", answer: "Speak Arizona is a weekly podcast about public speaking, leadership, and communication skills. Hosted by Rupesh Parbhoo and powered by District 3 Toastmasters International, each episode features courageous conversations with world-class speakers, authors, coaches, and leaders." },
            { question: "Who hosts the Speak Arizona podcast?", answer: "Speak Arizona is hosted by Rupesh Parbhoo, an Arizona-based speaker and communication coach. Rupesh is a Toastmasters leader who believes that the best conversations happen when people are willing to be courageous." },
            { question: "How often are new episodes released?", answer: "New episodes are released every week. You can subscribe on Spotify, Apple Podcasts, or YouTube to get notified when a new episode drops." },
            { question: "Where can I listen to Speak Arizona?", answer: "Speak Arizona is available on Spotify, Apple Podcasts, YouTube, and most major podcast platforms. You can also watch full video episodes on the Speak Arizona YouTube channel." },
            { question: "Do I need to be a Toastmasters member to listen?", answer: "Not at all. While Speak Arizona is powered by District 3 Toastmasters, the podcast is for everyone — whether you're a seasoned speaker, a first-time presenter, or someone who just wants to communicate better at work and in life." },
            { question: "What topics does Speak Arizona cover?", answer: "Episodes cover a wide range of topics including public speaking techniques, leadership development, interview and career communication, team management, confidence building, networking strategies, and personal branding through communication." },
            { question: "Can I be a guest on Speak Arizona?", answer: "Yes! Speak Arizona is always looking for guests with compelling stories and expertise in public speaking, leadership, or communication. Reach out through our contact page to pitch your story." },
            { question: "What is Toastmasters International?", answer: "Toastmasters International is the world's leading organization for developing public speaking and leadership skills. With over 16,800 clubs in 143 countries, Toastmasters provides a supportive environment where members practice communication, build confidence, and grow as leaders. District 3 serves Arizona, New Mexico, and West Texas." },
            { question: "Is Speak Arizona only about public speaking?", answer: "Not at all. While public speaking is a core topic, Speak Arizona covers a wide range of communication and leadership skills — including how to lead meetings effectively, navigate difficult workplace conversations, build confidence in interviews, network authentically, and develop your personal brand through better communication." },
            { question: "Who are some notable guests on Speak Arizona?", answer: "Speak Arizona has featured World Champions of Public Speaking Darren LaCroix and Mark Brown, leadership coach Kelly Soifer, and William Miller — a 10-year-old world-renowned public speaker on leadership. Every guest brings a unique perspective on what it means to communicate with courage and purpose." },
          ]} />
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
          <ListenSubscribe />
          <p className="text-text-light text-sm leading-relaxed mt-6">
            Join the Speak Arizona community on social media for daily public speaking tips, behind-the-scenes clips, and highlights from our latest episodes. Whether you prefer short-form video on TikTok and Instagram or professional insights on LinkedIn, we&apos;re sharing content that helps you become a better communicator every day.
          </p>
        </div>
      </section>
    </>
  );
}
