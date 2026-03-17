type Video = {
  videoId: string;
  title: string;
  published: string;
  description: string;
  thumbnail: string;
} | null;

export default function LatestVideo({ video }: { video: Video }) {
  if (!video) {
    return (
      <div className="max-w-3xl mx-auto text-center text-text-light">
        <p>Check out our latest episodes on{" "}
          <a
            href="https://www.youtube.com/@SpeakArizona"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            YouTube
          </a>.
        </p>
      </div>
    );
  }

  const date = video.published
    ? new Date(video.published).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="aspect-video rounded-2xl overflow-hidden shadow-sm">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube-nocookie.com/embed/${video.videoId}`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <div className="mt-6">
        <h3 className="font-heading font-bold text-xl text-black mb-2">
          {video.title}
        </h3>
        {date && (
          <p className="text-text-light text-sm mb-3">{date}</p>
        )}
        {video.description && (
          <p className="text-text-light leading-relaxed">
            {video.description.length > 200
              ? video.description.slice(0, 200) + "..."
              : video.description}
          </p>
        )}
      </div>
    </div>
  );
}
