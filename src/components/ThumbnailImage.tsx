import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  posterCandidates,
  loadedPosters,
  failedPosters,
  markPosterLoaded,
  markPosterFailed,
} from "@/lib/driveThumbnails";

type ThumbnailImageProps = {
  src?: string;
  alt: string;
  className?: string;
  /** Optional fallback rendered when there is no src or all sources fail. */
  fallback?: React.ReactNode;
};

/**
 * Lazy-loading thumbnail with an animated skeleton placeholder.
 *
 * - Steps through fallback poster sizes (see posterCandidates) when a frame
 *   can't be retrieved, only giving up once every candidate has failed.
 * - Caches loaded/failed URLs for the session so remounts skip the skeleton
 *   for known-good images and immediately show the placeholder for known-bad
 *   ones.
 */
const ThumbnailImage = ({ src, alt, className, fallback }: ThumbnailImageProps) => {
  const candidates = posterCandidates(src);

  // Start at the first candidate that isn't already known to have failed.
  const initialIndex = Math.max(
    0,
    candidates.findIndex((c) => !failedPosters.has(c)),
  );
  const firstUsable = candidates[initialIndex];

  const [index, setIndex] = useState(initialIndex === -1 ? 0 : initialIndex);
  const [loaded, setLoaded] = useState(
    firstUsable ? loadedPosters.has(firstUsable) : false,
  );
  const [failed, setFailed] = useState(
    candidates.length > 0 && candidates.every((c) => failedPosters.has(c)),
  );

  // Reset internal state if the source changes (e.g. list reorder/filter).
  const prevSrc = useRef(src);
  useEffect(() => {
    if (prevSrc.current !== src) {
      prevSrc.current = src;
      const next = Math.max(0, candidates.findIndex((c) => !failedPosters.has(c)));
      setIndex(next === -1 ? 0 : next);
      const usable = candidates[next === -1 ? 0 : next];
      setLoaded(usable ? loadedPosters.has(usable) : false);
      setFailed(candidates.length > 0 && candidates.every((c) => failedPosters.has(c)));
    }
  }, [src, candidates]);

  const currentSrc = candidates[index];
  const showFallback = !currentSrc || failed;

  const handleLoad = () => {
    if (currentSrc) markPosterLoaded(currentSrc);
    setLoaded(true);
  };

  const handleError = () => {
    if (currentSrc) markPosterFailed(currentSrc);

    if (index < candidates.length - 1) {
      // Retry the next (smaller) candidate size.
      setIndex((i) => i + 1);
      setLoaded(false);
    } else {
      setFailed(true);
    }
  };

  return (
    <>
      {/* Skeleton shimmer while the image loads */}
      {!loaded && !showFallback && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/40 via-muted/20 to-muted/40" />
      )}

      {showFallback ? (
        fallback ?? (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        )
      ) : (
        <img
          key={currentSrc}
          src={currentSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
            className,
          )}
        />
      )}
    </>
  );
};

export default ThumbnailImage;
