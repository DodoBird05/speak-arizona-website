"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

type Episode = {
  videoId: string;
  title: string;
  published: string;
  thumbnail: string;
};

export default function EpisodeCarousel({ episodes }: { episodes: Episode[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 240;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) {
        setScrollProgress(el.scrollLeft / maxScroll);
      }
    };
    el.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Scroll buttons */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute -left-5 top-[calc(50%-40px)] -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-md rounded-full items-center justify-center hover:bg-gray-light transition-colors"
        aria-label="Scroll left"
      >
        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute -right-5 top-[calc(50%-40px)] -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-md rounded-full items-center justify-center hover:bg-gray-light transition-colors"
        aria-label="Scroll right"
      >
        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {episodes.map((ep) => {
          const date = ep.published
            ? new Date(ep.published).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "";

          // Use mqdefault for cleaner 16:9 thumbnails
          const thumbnail = `https://i.ytimg.com/vi/${ep.videoId}/mqdefault.jpg`;

          return (
            <a
              key={ep.videoId}
              href={`https://www.youtube.com/watch?v=${ep.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 snap-start group"
              style={{ width: "200px" }}
            >
              <div className="relative rounded-xl overflow-hidden mb-2 aspect-video">
                <Image
                  src={thumbnail}
                  alt={ep.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                {/* Play icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 bg-black/70 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h4 className="font-heading font-semibold text-xs text-black leading-snug mb-0.5 group-hover:underline">
                {ep.title}
              </h4>
              {date && (
                <p className="text-text-light text-xs">{date}</p>
              )}
            </a>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-black rounded-full transition-all duration-150"
          style={{
            width: `${Math.max(20, 20 + scrollProgress * 80)}%`,
            marginLeft: `${scrollProgress * (80 - Math.max(20, 20))}%`,
          }}
        />
      </div>
    </div>
  );
}
