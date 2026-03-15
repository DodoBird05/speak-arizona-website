import Image from "next/image";
import type { Metadata } from "next";
import StickyTeamCards from "@/components/StickyTeamCards";
import ListenSubscribe from "@/components/ListenSubscribe";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "The Story Behind Arizona's Public Speaking Podcast",
  description:
    "How Speak Arizona became Arizona's only podcast dedicated to public speaking, communication, and leadership. Meet host Rupesh Parbhoo and the team powered by District 3 Toastmasters.",
  alternates: {
    canonical: "https://speakarizona.com/about",
  },
  openGraph: {
    title: "The Story Behind Arizona's Public Speaking Podcast",
    description:
      "How Speak Arizona became Arizona's only podcast dedicated to public speaking, communication, and leadership. Meet host Rupesh Parbhoo and the team.",
    url: "https://speakarizona.com/about",
    siteName: "Speak Arizona",
    type: "website",
    images: [
      {
        url: "https://speakarizona.com/images/rupesh-parbhoo-speak-arizona-host-by-marie-feutrier.webp",
        width: 800,
        height: 800,
        alt: "Rupesh Parbhoo, host of Speak Arizona podcast",
      },
    ],
  },
};

export default function About() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rupesh Parbhoo",
    jobTitle: "Podcast Host & Communication Coach",
    description:
      "Arizona-based speaker, storyteller, and community leader. Host of Speak Arizona, the public speaking and leadership podcast powered by District 3 Toastmasters.",
    url: "https://speakarizona.com/about",
    image:
      "https://speakarizona.com/images/rupesh-parbhoo-portrait-speak-arizona-by-marie-feutrier.webp",
    worksFor: {
      "@type": "Organization",
      name: "Speak Arizona",
      url: "https://speakarizona.com",
    },
    memberOf: {
      "@type": "Organization",
      name: "District 3 Toastmasters",
      url: "https://d3toastmasters.org",
    },
    knowsAbout: [
      "Public Speaking",
      "Leadership",
      "Communication Skills",
      "Toastmasters",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      {/* How It Started */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-black mb-12">
              The Story Behind Arizona&apos;s Public Speaking Podcast
            </h1>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <AnimateOnScroll>
                <h2 className="font-heading font-bold text-3xl text-black mb-6">
                  From a Toastmasters Project to Arizona&apos;s Public Speaking Podcast
                </h2>
              </AnimateOnScroll>
              <p className="text-text-light text-lg leading-relaxed mb-4">
                Speak Arizona was created by Sara Mayer, then District Director
                of District 3 Toastmasters, alongside cohost
                Serban Mare. Their vision was simple: take the powerful
                conversations happening inside Toastmasters meetings and bring
                them to a wider audience — anyone in Arizona and beyond who
                wanted to become a better communicator and leader.
              </p>
              <p className="text-text-light text-lg leading-relaxed mb-4">
                When Sara and Serban moved on from the project, the podcast
                could have ended there.
              </p>
              <p className="text-text-light text-lg leading-relaxed">
                It didn&apos;t.
              </p>
            </div>
            <div className="flex justify-center">
              <div>
                <div className="overflow-hidden rounded-3xl shadow-lg">
                  <Image
                    src="/images/speak-arizona-original-2024-podcast-cover.webp"
                    alt="Speak Arizona original 2024 podcast cover featuring Sara Mayer and Serban Mare"
                    width={450}
                    height={450}
                    className="w-full h-auto transition-transform duration-500 ease-out hover:scale-110"
                  />
                </div>
                <p className="text-text-light text-sm text-center mt-3">
                  The original Speak Arizona cover
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Grew */}
      <section className="bg-white pt-0 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 flex justify-center">
              <div className="overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src="/images/rupesh-parbhoo-hosting-speak-arizona-by-marie-feutrier.webp"
                  alt="Rupesh Parbhoo hosting Speak Arizona podcast"
                  width={800}
                  height={534}
                  className="w-full h-auto transition-transform duration-500 ease-out hover:scale-110"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <AnimateOnScroll>
                <h2 className="font-heading font-bold text-3xl text-black mb-6">
                  How Speak Arizona Became Arizona&apos;s Only Public Speaking
                  Podcast
                </h2>
              </AnimateOnScroll>
              <p className="text-text-light text-lg leading-relaxed mb-4">
                Rupesh Parbhoo stepped in as host and brought a new energy to
                the microphone. Under his leadership, Speak Arizona evolved from
                a district project into Arizona&apos;s only podcast dedicated to
                public speaking, communication, and leadership.
              </p>
              <p className="text-text-light text-lg leading-relaxed mb-4">
                The guests got bigger. The conversations got bolder. And the
                audience grew — because it turns out, people are hungry for
                honest, courageous conversations about what it really takes to
                find your voice and lead with purpose.
              </p>
              <p className="text-text-light text-lg leading-relaxed">
                Today, Speak Arizona features everyone from World Champions of
                Public Speaking to first-time storytellers, delivering weekly
                episodes packed with real strategies and lessons you can use
                immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Host */}
      <section className="bg-gray-light py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <AnimateOnScroll>
                <h2 className="font-heading font-bold text-3xl text-black mb-6">
                  Meet Rupesh Parbhoo — Arizona Speaker &amp; Communication Coach
                </h2>
              </AnimateOnScroll>
              <p className="text-text-light text-lg leading-relaxed mb-4">
                Rupesh Parbhoo is a speaker, storyteller, and community leader
                based in Arizona. As a dedicated Toastmaster and District 3
                leader, he understands that great communication isn&apos;t about
                perfection — it&apos;s about connection. Every episode reflects
                that philosophy.
              </p>
              <p className="text-text-light text-lg leading-relaxed mb-4 bg-yellow/20 rounded-xl p-4 border border-yellow/40">
                <strong>[RUPESH&apos;S PERSONAL STORY — to be added]</strong>{" "}
                Rupesh, add a few sentences here about what brought you to
                Toastmasters and what drives you to host this podcast. What was
                the turning point? Why does this work matter to you personally?
                This is the part readers connect with the most.
              </p>
              <p className="text-text-light text-lg leading-relaxed">
                When he&apos;s not behind the microphone, you&apos;ll find
                Rupesh mentoring emerging speakers, organizing community events,
                and looking for the next great conversation.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-yellow rounded-full opacity-30" />
                <div className="relative overflow-hidden rounded-3xl shadow-lg">
                  <Image
                    src="/images/rupesh-parbhoo-portrait-speak-arizona-by-marie-feutrier.webp"
                    alt="Rupesh Parbhoo, host of Speak Arizona podcast"
                    width={800}
                    height={1000}
                    className="w-full h-auto transition-transform duration-500 ease-out hover:scale-110"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <AnimateOnScroll>
            <h2 className="font-heading font-bold text-3xl text-black text-center">
              The Team Behind the #1 Communication &amp; Leadership Podcast in
              Arizona
            </h2>
          </AnimateOnScroll>
        </div>
        <StickyTeamCards />
      </section>

      {/* District 3 */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="font-heading font-bold text-3xl text-black mb-8">
              Powered by District 3 Toastmasters — Arizona&apos;s Public Speaking Community
            </h2>
          </AnimateOnScroll>
          <p className="text-text-light text-lg leading-relaxed mb-4">
            Speak Arizona is proudly produced by{" "}
            <a
              href="https://d3toastmasters.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue underline hover:text-blue-light transition-colors"
            >
              District 3 Toastmasters
            </a>
            , serving over 125 clubs across Arizona, New Mexico, and West Texas.
            Toastmasters is the world&apos;s leading organization for developing
            public speaking, communication, and leadership skills through a
            supportive, peer-driven community.
          </p>
          <p className="text-text-light text-lg leading-relaxed mb-4">
            With nearly 100 years of history, Toastmasters has helped millions
            of people around the world find their voice and grow as leaders.
            District 3 carries that mission forward in the Southwest — and Speak
            Arizona extends it beyond the meeting room to anyone with an
            internet connection and a desire to grow.
          </p>
          <p className="text-text-light text-lg leading-relaxed">
            Whether you&apos;re a Toastmasters member or you&apos;ve never
            heard of the organization, this podcast is for you.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-light py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimateOnScroll>
            <h2 className="font-heading font-bold text-3xl text-black mb-6">
              Listen to Speak Arizona — Weekly Public Speaking Podcast
            </h2>
          </AnimateOnScroll>
          <p className="text-text-light text-lg leading-relaxed mb-10">
            Speak Arizona is available wherever you listen to podcasts. New
            episodes drop weekly — subscribe so you never miss a courageous
            conversation.
          </p>
          <ListenSubscribe />
        </div>
      </section>
    </>
  );
}
