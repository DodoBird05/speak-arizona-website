import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "https://speakarizona.com/legal",
  },
};

export default function Legal() {
  const sections = [
    { id: "terms", label: "Terms of Use" },
    { id: "privacy", label: "Privacy Policy" },
    { id: "copyright", label: "Copyright Notice" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-blue py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 text-center text-white">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-6">
            Legal
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            Terms of use, privacy policy, and copyright notice for
            speakarizona.com.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6">
          {/* Jump links */}
          <nav className="mb-16 pb-8 border-b border-gray-200">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-text-light hover:text-blue hover:underline transition-colors text-sm"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Terms of Use ── */}
          <section id="terms" className="mb-20 scroll-mt-24">
            <h2 className="legal-heading">Terms of Use</h2>
            <p className="legal-meta">Last Updated: March 14, 2026</p>

            <h3 className="legal-subheading">Acceptance of Terms</h3>
            <p className="legal-text">
              By accessing and using this website (speakarizona.com), you accept
              and agree to be bound by the terms and provisions of this
              agreement. If you do not agree to abide by these terms, please do
              not use this website.
            </p>

            <h3 className="legal-subheading">Website Use</h3>
            <p className="legal-text">
              This website is operated by the Speak Arizona podcast team,
              powered by District 3 Toastmasters International. It is provided
              for informational and promotional purposes related to the Speak
              Arizona podcast. Under this license you may not:
            </p>
            <ul className="legal-list">
              <li>
                Use any website content for commercial purposes without
                permission
              </li>
              <li>
                Reproduce, distribute, or republish website content without
                attribution
              </li>
              <li>Remove any copyright or proprietary notices</li>
              <li>
                Scrape, crawl, or use automated tools to extract content from
                this website
              </li>
            </ul>

            <h3 className="legal-subheading">Podcast Content</h3>
            <p className="legal-text">
              Podcast episodes, show notes, and related materials are provided
              for personal, non-commercial use. Opinions expressed by guests on
              the podcast are their own and do not necessarily reflect the views
              of Speak Arizona, its team, or District 3 Toastmasters
              International.
            </p>

            <h3 className="legal-subheading">Website Content</h3>
            <p className="legal-text">
              The materials on our website are provided on an &quot;as is&quot;
              basis. We make no warranties, expressed or implied, regarding the
              accuracy, completeness, or reliability of any content on this
              website.
            </p>

            <h3 className="legal-subheading">Links to Third-Party Sites</h3>
            <p className="legal-text">
              Our website contains links to third-party platforms including
              YouTube, Spotify, Apple Podcasts, Podbean, and social media
              channels. We do not endorse or assume responsibility for the
              content, privacy practices, or policies of these external sites.
              Your use of third-party platforms is governed by their respective
              terms and privacy policies.
            </p>

            <h3 className="legal-subheading">Contact Form</h3>
            <ul className="legal-list">
              <li>
                Information submitted through the contact form is used solely
                for communication related to the podcast
              </li>
              <li>
                Submission of a guest inquiry does not guarantee a podcast
                appearance
              </li>
              <li>
                We respond to inquiries as time permits; response times may vary
              </li>
            </ul>

            <h3 className="legal-subheading">Indemnification</h3>
            <p className="legal-text">
              You agree to indemnify, defend, and hold harmless Speak Arizona,
              its team members, and District 3 Toastmasters International from
              any claims, damages, losses, or expenses arising from your use of
              this website or violation of these terms.
            </p>

            <h3 className="legal-subheading">Severability</h3>
            <p className="legal-text">
              If any provision of these terms is found to be unenforceable, the
              remaining provisions will continue in full force and effect.
            </p>

            <h3 className="legal-subheading">Modifications</h3>
            <p className="legal-text">
              We may revise these terms of use at any time without notice. By
              continuing to use this website after changes are posted, you agree
              to be bound by the updated terms.
            </p>

            <h3 className="legal-subheading">Governing Law</h3>
            <p className="legal-text">
              These terms are governed by the laws of the State of Arizona. Any
              disputes arising under these terms shall be resolved exclusively
              in the state or federal courts located in Maricopa County, Arizona.
            </p>
          </section>

          {/* ── Privacy Policy ── */}
          <section id="privacy" className="mb-20 scroll-mt-24">
            <h2 className="legal-heading">Privacy Policy</h2>
            <p className="legal-meta">Effective Date: March 14, 2026</p>
            <p className="legal-text">
              This privacy policy describes how Speak Arizona (&quot;we,&quot;
              &quot;us,&quot; or &quot;our&quot;) collects, uses, and protects
              your personal information when you visit speakarizona.com.
            </p>

            <h3 className="legal-subheading">Information Collection</h3>

            <h4 className="legal-sub-subheading">Information You Provide</h4>
            <ul className="legal-list">
              <li>
                Name and email address submitted through the contact form
              </li>
              <li>Subject selection and message content from inquiries</li>
            </ul>

            <h4 className="legal-sub-subheading">
              Information Collected Automatically
            </h4>
            <p className="legal-text">
              Our website currently does not use analytics tracking. However,
              third-party services embedded on this site may collect data
              independently:
            </p>
            <ul className="legal-list">
              <li>
                <strong>YouTube embeds:</strong> When you watch embedded podcast
                episodes, YouTube (Google) may collect usage data, set cookies,
                and track viewing activity in accordance with{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue hover:underline"
                >
                  Google&apos;s Privacy Policy
                </a>
              </li>
              <li>
                <strong>Vercel hosting:</strong> Our hosting provider may
                collect standard server logs (IP address, browser type, pages
                requested) for security and performance purposes
              </li>
            </ul>

            <h3 className="legal-subheading">How We Use Your Information</h3>
            <ul className="legal-list">
              <li>Respond to inquiries and guest requests</li>
              <li>Communicate about the podcast and upcoming episodes</li>
              <li>Improve our website and content</li>
            </ul>

            <h3 className="legal-subheading">Information Sharing</h3>
            <p className="legal-text">
              We do not sell, trade, or rent your personal information to third
              parties.
            </p>
            <p className="legal-text">
              Information submitted through the contact form may be shared among
              Speak Arizona team members for the purpose of responding to your
              inquiry. We may also share information with legal authorities when
              required by law.
            </p>

            <h3 className="legal-subheading">Third-Party Services</h3>
            <p className="legal-text">
              Our website links to or embeds content from the following
              third-party services, each governed by their own privacy policies:
            </p>
            <ul className="legal-list">
              <li>
                <strong>YouTube:</strong> Podcast episode playback and video
                content
              </li>
              <li>
                <strong>Spotify:</strong> Podcast episode streaming
              </li>
              <li>
                <strong>Apple Podcasts:</strong> Podcast episode streaming
              </li>
              <li>
                <strong>Podbean:</strong> Podcast hosting and distribution
              </li>
              <li>
                <strong>Instagram, LinkedIn, Facebook, TikTok:</strong> Social
                media presence and content sharing
              </li>
            </ul>
            <p className="legal-text">
              We are not responsible for the privacy practices of these
              third-party platforms. We encourage you to review their privacy
              policies before using their services.
            </p>

            <h3 className="legal-subheading">Cookies</h3>
            <p className="legal-text">
              Our website itself does not set cookies. However, embedded YouTube
              videos may set third-party cookies from Google. You can manage
              cookie preferences through your browser settings.
            </p>

            <h3 className="legal-subheading">Data Security</h3>
            <p className="legal-text">
              We implement reasonable measures to protect information submitted
              through our website, including SSL/TLS encryption for all website
              traffic. However, no method of transmission over the Internet is
              100% secure, and we cannot guarantee absolute security.
            </p>

            <h3 className="legal-subheading">Your Rights</h3>
            <p className="legal-text">You have the right to:</p>
            <ul className="legal-list">
              <li>Request access to any personal information we hold</li>
              <li>Request correction or deletion of your information</li>
              <li>Opt out of any future communications</li>
            </ul>
            <p className="legal-text">
              To exercise these rights, contact us through the{" "}
              <a href="/contact" className="text-blue hover:underline">
                contact page
              </a>
              .
            </p>

            <h3 className="legal-subheading">Children&apos;s Privacy</h3>
            <p className="legal-text">
              Our website is not directed to individuals under 13. We do not
              knowingly collect personal information from children under 13. If
              we learn that we have collected personal information from a child
              under 13, we will delete that information promptly.
            </p>

            <h3 className="legal-subheading">Changes to Privacy Policy</h3>
            <p className="legal-text">
              We may update this policy periodically. Changes will be posted on
              this page with an updated effective date. Your continued use of
              the website after changes are posted constitutes acceptance of the
              updated policy.
            </p>
          </section>

          {/* ── Copyright Notice ── */}
          <section id="copyright" className="mb-20 scroll-mt-24">
            <h2 className="legal-heading">Copyright Notice</h2>

            <h3 className="legal-subheading">Content Ownership</h3>
            <p className="legal-text">
              Copyright &copy; 2025&ndash;{new Date().getFullYear()} Speak
              Arizona. All rights reserved.
            </p>
            <p className="legal-text">
              All original content on this website &mdash; including text,
              graphics, logos, episode descriptions, show notes, and branding
              &mdash; is the property of Speak Arizona and is protected by
              United States copyright law.
            </p>

            <h3 className="legal-subheading">Podcast Episode Content</h3>
            <ul className="legal-list">
              <li>
                Podcast episodes and recordings are the property of Speak
                Arizona
              </li>
              <li>
                Guest contributions remain the intellectual property of the
                respective guests
              </li>
              <li>
                Brief quotations with proper attribution are permitted for
                review, commentary, or promotional purposes
              </li>
              <li>
                Full reproduction or redistribution of episodes requires written
                permission
              </li>
            </ul>

            <h3 className="legal-subheading">Permitted Uses</h3>
            <ul className="legal-list">
              <li>
                Sharing links to episodes or the website on social media and
                personal blogs
              </li>
              <li>
                Brief quotations with attribution (e.g., &quot;As discussed on
                Speak Arizona...&quot;)
              </li>
              <li>
                Embedding episodes using official embed codes from YouTube,
                Spotify, or Apple Podcasts
              </li>
            </ul>

            <h3 className="legal-subheading">Prohibited Uses</h3>
            <ul className="legal-list">
              <li>
                Downloading, re-uploading, or redistributing episodes without
                permission
              </li>
              <li>
                Using Speak Arizona branding or logos for unauthorized purposes
              </li>
              <li>
                Modifying or creating derivative works from podcast content
                without permission
              </li>
              <li>
                Scraping, crawling, or automated extraction of website content
              </li>
            </ul>

            <h3 className="legal-subheading">Toastmasters International</h3>
            <p className="legal-text">
              Speak Arizona is powered by District 3 Toastmasters International.
              The Toastmasters International name and logo are trademarks of
              Toastmasters International and are used with permission. All
              Toastmasters-related trademarks remain the property of
              Toastmasters International.
            </p>

            <h3 className="legal-subheading">Contact</h3>
            <p className="legal-text">
              For copyright questions or permission requests, contact us through
              the{" "}
              <a href="/contact" className="text-blue hover:underline">
                contact page
              </a>
              .
            </p>
          </section>
        </div>
      </section>

      <style>{`
        .legal-heading {
          font-family: var(--font-heading), system-ui, sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
          color: #004165;
          margin-bottom: 0.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e5e5e5;
        }
        .legal-meta {
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 2rem;
        }
        .legal-subheading {
          font-family: var(--font-heading), system-ui, sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .legal-sub-subheading {
          font-family: var(--font-heading), system-ui, sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #444;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .legal-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #333;
          margin-bottom: 1rem;
        }
        .legal-list {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #333;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
          list-style-type: disc;
        }
        .legal-list li {
          margin-bottom: 0.4rem;
        }
      `}</style>
    </>
  );
}
