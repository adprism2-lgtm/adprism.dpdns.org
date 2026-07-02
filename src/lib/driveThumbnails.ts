/**
 * Helpers for working with Google Drive auto-generated video poster frames.
 *
 * Drive thumbnails occasionally fail for a given size (transcoding not ready,
 * rate limiting, large files). We cache which URLs have loaded/failed for the
 * session and expose a chain of fallback sizes so a poster can be retried at a
 * smaller resolution before we give up and show a placeholder.
 */

// Caches keyed by URL. Persist across component remounts (in-memory) and across
// visits (localStorage) so we don't re-show the skeleton for an image we've
// already fetched, and don't retry a URL we already know is broken.
const LOADED_KEY = "adprism.posterCache.loaded";
const FAILED_KEY = "adprism.posterCache.failed";
// Cap persisted entries so localStorage can't grow unbounded.
const MAX_PERSISTED = 500;

function readPersisted(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export const loadedPosters = new Set<string>(readPersisted(LOADED_KEY));
export const failedPosters = new Set<string>(readPersisted(FAILED_KEY));

function persist(key: string, set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    // Keep only the most recent entries if we exceed the cap.
    const arr = Array.from(set);
    const trimmed = arr.length > MAX_PERSISTED ? arr.slice(arr.length - MAX_PERSISTED) : arr;
    window.localStorage.setItem(key, JSON.stringify(trimmed));
  } catch {
    // Ignore quota / serialization errors — cache is best-effort.
  }
}

/** Record a poster URL as successfully loaded and persist the cache. */
export function markPosterLoaded(src: string) {
  loadedPosters.add(src);
  failedPosters.delete(src);
  persist(LOADED_KEY, loadedPosters);
  persist(FAILED_KEY, failedPosters);
}

/** Record a poster URL as failed and persist the cache. */
export function markPosterFailed(src: string) {
  failedPosters.add(src);
  persist(FAILED_KEY, failedPosters);
}

const DRIVE_THUMB_RE = /drive\.google\.com\/thumbnail\?id=([^&]+)/;

/**
 * Given a poster URL, return an ordered list of candidate URLs to try.
 * For Drive thumbnails this steps down through smaller sizes on failure;
 * for any other URL it just returns the single source.
 */
export function posterCandidates(src?: string): string[] {
  if (!src) return [];
  const match = src.match(DRIVE_THUMB_RE);
  if (!match) return [src];
  const id = match[1];
  return [
    `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
    `https://drive.google.com/thumbnail?id=${id}&sz=w640`,
    `https://drive.google.com/thumbnail?id=${id}&sz=w320`,
  ];
}
