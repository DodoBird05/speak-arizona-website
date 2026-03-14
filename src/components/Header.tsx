"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
      {/* Top banner */}
      <div className="bg-yellow text-black py-4 px-4 overflow-hidden">
        {/* Desktop: static centered */}
        <div className="hidden md:block text-center">
          <a
            href="https://www.youtube.com/@SpeakArizona"
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading font-semibold text-base"
          >
            Listen to the newest episode of <span className="underline">Speak Arizona Podcast</span>
          </a>
        </div>
        {/* Mobile: marquee scroll */}
        <div className="md:hidden whitespace-nowrap animate-marquee">
          <a
            href="https://www.youtube.com/@SpeakArizona"
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading font-semibold text-base"
          >
            Listen to the newest episode of <span className="underline">Speak Arizona Podcast</span>
          </a>
        </div>
      </div>

      <nav className="hidden md:flex max-w-6xl mx-auto px-6 py-4 items-center justify-between">
        <Link href="/" className="font-heading text-black font-black text-xl uppercase" style={{ letterSpacing: "-0.06em" }}>
          SPEAK ARIZONA
        </Link>

        {/* Desktop nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-heading font-medium text-text hover:text-black transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="font-heading font-medium text-text hover:text-black transition-colors"
          >
            About
          </Link>
          <Link
            href="/blog"
            className="font-heading font-medium text-text hover:text-black transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="font-heading font-medium text-text hover:text-black transition-colors"
          >
            Contact
          </Link>
        </div>

      </nav>
    </header>
  );
}
