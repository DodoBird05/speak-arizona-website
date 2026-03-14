import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-blue text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.png"
                alt="Speak Arizona"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="font-heading font-bold text-lg">
                Speak Arizona
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Courageous conversations for better communicators and leaders.
              Powered by District 3 Toastmasters.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-heading font-bold mb-4">Pages</h3>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-white/70 hover:text-yellow transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block text-white/70 hover:text-yellow transition-colors"
              >
                About
              </Link>
              <Link
                href="/news"
                className="block text-white/70 hover:text-yellow transition-colors"
              >
                News
              </Link>
              <Link
                href="/contact"
                className="block text-white/70 hover:text-yellow transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Listen */}
          <div>
            <h3 className="font-heading font-bold mb-4">Listen On</h3>
            <div className="space-y-2">
              <a
                href="https://open.spotify.com/show/speak-arizona"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white/70 hover:text-yellow transition-colors"
              >
                Spotify
              </a>
              <a
                href="https://podcasts.apple.com/us/podcast/speak-arizona"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white/70 hover:text-yellow transition-colors"
              >
                Apple Podcasts
              </a>
              <a
                href="https://www.youtube.com/@speakarizona"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white/70 hover:text-yellow transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-heading font-bold mb-4">Follow Us</h3>
            <div className="space-y-2">
              <a
                href="https://www.instagram.com/speakarizona/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white/70 hover:text-yellow transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/showcase/speak-arizona/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white/70 hover:text-yellow transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://www.facebook.com/people/Speak-Arizona/61587110443189/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white/70 hover:text-yellow transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://www.tiktok.com/@speakarizona"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white/70 hover:text-yellow transition-colors"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-10 pt-6 text-center text-white/50 text-sm">
          &copy; {new Date().getFullYear()} Speak Arizona. Powered by District
          3 Toastmasters.
        </div>
      </div>
    </footer>
  );
}
