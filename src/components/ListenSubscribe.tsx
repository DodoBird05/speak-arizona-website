export default function ListenSubscribe() {
  return (
    <div>
      <p className="font-heading font-bold text-black mb-4">
        Listen, watch, or subscribe:
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
        className="md:grid-cols-3"
      >
        <a
          href="https://open.spotify.com/show/speak-arizona"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black rounded-2xl p-4 flex items-center justify-center gap-3 hover:bg-black/80 card-hover"
        >
          <svg
            className="w-7 h-7 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="#1DB954"
          >
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <div>
            <span className="text-white/70 text-xs block">Listen on</span>
            <span className="text-white font-heading font-bold text-lg">
              Spotify
            </span>
          </div>
        </a>
        <a
          href="https://podcasts.apple.com/us/podcast/speak-arizona"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black rounded-2xl p-4 flex items-center justify-center gap-3 hover:bg-black/80 card-hover"
        >
          <svg
            className="w-7 h-7 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="#9933FF"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6a8.4 8.4 0 018.4 8.4c0 2.607-1.194 4.937-3.063 6.474a.9.9 0 01-1.254-.144.9.9 0 01.144-1.254A6.6 6.6 0 0018.6 12 6.6 6.6 0 0012 5.4 6.6 6.6 0 005.4 12c0 2.1.984 3.972 2.514 5.178a.9.9 0 01-.99 1.503C4.98 17.1 3.6 14.7 3.6 12A8.4 8.4 0 0112 3.6zm0 3.6a4.8 4.8 0 014.8 4.8c0 1.47-.663 2.787-1.707 3.666a.9.9 0 01-1.188-1.35A3.003 3.003 0 0015 12a3 3 0 00-6 0c0 .924.42 1.752 1.08 2.304a.9.9 0 11-1.14 1.392A4.8 4.8 0 017.2 12 4.8 4.8 0 0112 7.2zm0 3.6a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zm-.6 3.6h1.2c.331 0 .6.269.6.6v4.2c0 .993-.806 1.8-1.8 1.8h.6c-.994 0-1.8-.807-1.8-1.8V15c0-.331.269-.6.6-.6z" />
          </svg>
          <div>
            <span className="text-white/70 text-xs block">Listen on</span>
            <span className="text-white font-heading font-bold text-lg">
              Apple Podcasts
            </span>
          </div>
        </a>
        <a
          href="https://www.youtube.com/@speakarizona"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black rounded-2xl p-4 flex items-center justify-center gap-3 hover:bg-black/80 card-hover col-span-2 md:col-span-1"
        >
          <svg
            className="w-7 h-7 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="#FF0000"
          >
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <div>
            <span className="text-white/70 text-xs block">Watch on</span>
            <span className="text-white font-heading font-bold text-lg">
              YouTube
            </span>
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
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/showcase/speak-arizona/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/80 transition-colors"
          aria-label="Follow Speak Arizona on LinkedIn"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        <a
          href="https://www.facebook.com/people/Speak-Arizona/61587110443189/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/80 transition-colors"
          aria-label="Follow Speak Arizona on Facebook"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
        <a
          href="https://www.tiktok.com/@speakarizona"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/80 transition-colors"
          aria-label="Follow Speak Arizona on TikTok"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
