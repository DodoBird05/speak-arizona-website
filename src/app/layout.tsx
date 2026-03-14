import type { Metadata } from "next";
import { Inter, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Speak Arizona | Public Speaking & Communication Skills Podcast",
    template: "%s | Speak Arizona Podcast",
  },
  description:
    "Weekly podcast on public speaking, leadership, and communication skills. Hosted by Rupesh Parbhoo with World Champions of Public Speaking, bestselling authors, and executive coaches. Powered by District 3 Toastmasters.",
  keywords: [
    "public speaking podcast",
    "communication skills podcast",
    "leadership podcast",
    "public speaking tips",
    "Arizona public speaking",
    "Toastmasters podcast",
    "workplace communication",
    "Speak Arizona",
    "Rupesh Parbhoo",
  ],
  openGraph: {
    title: "Speak Arizona | Public Speaking & Communication Skills Podcast",
    description:
      "Weekly podcast on public speaking, leadership, and communication. Courageous conversations with World Champions of Public Speaking, bestselling authors, and executive coaches.",
    url: "https://speakarizona.com",
    siteName: "Speak Arizona",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Speak Arizona | Public Speaking & Communication Skills Podcast",
    description:
      "Weekly podcast on public speaking, leadership, and communication. Hosted by Rupesh Parbhoo.",
  },
  alternates: {
    canonical: "https://speakarizona.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "PodcastSeries",
              name: "Speak Arizona",
              description:
                "Weekly podcast on public speaking, leadership, and communication skills. Hosted by Rupesh Parbhoo with World Champions of Public Speaking, bestselling authors, and executive coaches.",
              url: "https://speakarizona.com",
              webFeed: "https://feed.podbean.com/speakarizona/feed.xml",
              author: {
                "@type": "Person",
                name: "Rupesh Parbhoo",
              },
              publisher: {
                "@type": "Organization",
                name: "District 3 Toastmasters International",
                url: "https://d3toastmasters.org",
              },
              inLanguage: "en-US",
              genre: ["Public Speaking", "Leadership", "Communication"],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${sourceSans.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
