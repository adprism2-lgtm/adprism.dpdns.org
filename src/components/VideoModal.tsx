import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface VideoModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  url: string;
  poster?: string;
}

/**
 * Renders an embedded player. Supports YouTube, Vimeo, or a direct video file URL.
 * Shows a poster thumbnail + loading spinner while the video buffers.
 */
const VideoModal = ({ open, onOpenChange, url, poster }: VideoModalProps) => {
  const isFile = /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
  const [loaded, setLoaded] = useState(false);

  // Reset loading state whenever a new video opens.
  useEffect(() => {
    if (open) setLoaded(false);
  }, [open, url]);

  const toEmbed = (u: string) => {
    const yt = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
    const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
    const gd = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
    if (gd) return `https://drive.google.com/file/d/${gd[1]}/preview`;
    return u;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-border bg-background p-0 overflow-hidden">
        <div className="relative aspect-video w-full bg-secondary">
          {url ? (
            <>
              {/* Poster + spinner overlay shown until the media is ready */}
              {!loaded && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  {poster && (
                    <img
                      src={poster}
                      alt="Video preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-background/40" />
                  <Loader2 className="relative h-10 w-10 animate-spin text-primary" />
                </div>
              )}

              {isFile ? (
                <video
                  src={url}
                  poster={poster}
                  controls
                  autoPlay
                  onLoadedData={() => setLoaded(true)}
                  className="h-full w-full"
                />
              ) : (
                <iframe
                  src={toEmbed(url)}
                  title="Showreel"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setLoaded(true)}
                  className="h-full w-full"
                />
              )}
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-secondary p-8 text-center">
              <p className="font-display text-2xl">Showreel coming soon</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Add your video link in <code className="text-primary">src/data/content.ts</code>{" "}
                (YouTube, Vimeo, or an uploaded file) and it will play right here.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
