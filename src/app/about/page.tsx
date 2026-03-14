import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Rupesh Parbhoo — Host of Speak Arizona Podcast",
  description:
    "Meet Rupesh Parbhoo, Arizona speaker and communication coach. Host of Speak Arizona, the public speaking and leadership podcast powered by District 3 Toastmasters.",
  alternates: {
    canonical: "https://speakarizona.com/about",
  },
};

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="bg-blue py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 text-center text-white">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-6">
            About Speak Arizona
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            Courageous conversations for better communicators and leaders.
          </p>
        </div>
      </section>

      {/* The Podcast */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading font-bold text-3xl text-black mb-6">
                The Podcast
              </h2>
              <p className="text-text-light text-lg leading-relaxed mb-4">
                Speak Arizona is a podcast that celebrates the art of
                communication and leadership. Each episode features candid,
                courageous conversations with speakers, leaders, and
                changemakers from across Arizona and beyond.
              </p>
              <p className="text-text-light text-lg leading-relaxed mb-4">
                Whether you&apos;re a seasoned speaker or someone who&apos;s
                just finding their voice, this podcast is for you. We explore
                what it takes to show up, speak up, and lead with authenticity.
              </p>
              <p className="text-text-light text-lg leading-relaxed">
                Powered by District 3 Toastmasters, Speak Arizona brings the
                spirit of community-based leadership development to a wider
                audience.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/images/cover-square.jpg"
                alt="Speak Arizona podcast cover"
                width={450}
                height={450}
                className="rounded-3xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Host */}
      <section className="bg-gray-light py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 flex justify-center">
              <div className="relative">
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-yellow rounded-full opacity-30" />
                <Image
                  src="/images/rupesh-mic.jpg"
                  alt="Rupesh Parbhoo recording Speak Arizona podcast"
                  width={500}
                  height={650}
                  className="relative rounded-3xl shadow-lg"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-heading font-bold text-3xl text-black mb-6">
                Meet Rupesh Parbhoo
              </h2>
              <p className="text-text-light text-lg leading-relaxed mb-4">
                Rupesh Parbhoo is a speaker, storyteller, and community leader
                based in Arizona. With a passion for helping others find their
                voice, he created Speak Arizona to spotlight the stories and
                wisdom of communicators and leaders across the state.
              </p>
              <p className="text-text-light text-lg leading-relaxed mb-4">
                As a dedicated Toastmaster and District 3 leader, Rupesh
                understands that great communication isn&apos;t about perfection
                — it&apos;s about connection. Every episode reflects that
                philosophy.
              </p>
              <p className="text-text-light text-lg leading-relaxed">
                When he&apos;s not behind the microphone, you&apos;ll find
                Rupesh mentoring emerging speakers, organizing community events,
                and looking for the next great conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* District 3 */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-heading font-bold text-3xl text-black mb-6">
            Powered by District 3 Toastmasters
          </h2>
          <p className="text-text-light text-lg leading-relaxed mb-8">
            District 3 Toastmasters serves clubs across Arizona, helping
            members develop communication and leadership skills in a supportive,
            community-driven environment. Speak Arizona extends that mission
            beyond the club meeting room.
          </p>
          <a
            href="https://d3toastmasters.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue text-white font-heading font-bold px-6 py-3 rounded-full hover:bg-blue-light transition-colors"
          >
            Visit District 3
          </a>
        </div>
      </section>
    </>
  );
}
