import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Play, Pause, Sparkles } from "lucide-react";
import { BRAND } from "@/data/content";
import { DRIVE_PHOTOS, drivePhotoThumb } from "@/data/drivePhotos";
import Seo from "@/components/Seo";

/** Convert a Drive preview/file URL into an embeddable src. */
const toEmbed = (url: string): string => {
  const m = url.match(/\/d\/([^/]+)/);
  if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
  return url;
};

/** A single parallax visual band. */
const ReelBand = ({
  id,
  index,
  label,
}: {
  id: string;
  index: number;
  label: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.15]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.35, 1, 1, 0.35],
  );

  return (
    <section
      ref={ref}
      className="relative flex h-[80vh] items-end overflow-hidden md:h-screen"
    >
      <motion.img
        src={drivePhotoThumb(id, 1600)}
        alt={`${label} — reel frame ${index + 1}`}
        loading="lazy"
        style={{ y, scale }}
        className="absolute inset-0 h-[124%] w-full -translate-y-[12%] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/10" />
      <div className="absolute inset-0 grid-lines opacity-30" />
      <motion.div
        style={{ opacity }}
        className="container relative z-10 pb-16 md:pb-24"
      >
        <span className="text-xs uppercase tracking-[0.4em] text-primary">
          {String(index + 1).padStart(2, "0")} — {label}
        </span>
      </motion.div>
    </section>
  );
};

const Reel = () => {
  const [playing, setPlaying] = useState(false);

  // Curate the best event visuals — favour the "Events & Coverage" batch,
  // fall back to the rest, and cap the reel so it stays punchy.
  const frames = useMemo(() => {
    const events = DRIVE_PHOTOS.filter((p) =>
      /event|coverage/i.test(p.category),
    );
    const pool = (events.length >= 24 ? events : DRIVE_PHOTOS).map((p) => p.id);
    // Deterministic spread so the reel feels curated, not random.
    const step = Math.max(1, Math.floor(pool.length / 28));
    return pool.filter((_, i) => i % step === 0).slice(0, 28);
  }, []);

  return (
    <main className="bg-background text-foreground">
      <Seo
        title="Cinematic Reel — ADPRISM Studio"
        description="Watch ADPRISM's featured showreel — a single scrolling compilation of our best event, brand, and documentary visuals in motion."
        path="/reel"
      />

      {/* Top bar */}
      <div className="fixed left-0 top-0 z-50 flex w-full items-center justify-between px-6 py-5">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-xs uppercase tracking-widest text-foreground/80 backdrop-blur transition-colors hover:border-primary hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <img src="/adprism-logo.png" alt="ADPRISM" className="h-9 w-auto" />
      </div>

      {/* Hero showreel */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-50" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
        <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-amber/15 blur-[120px] animate-pulse-glow" />

        <div className="container relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-widest text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" /> The Reel
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-4xl font-display text-5xl font-bold leading-[1.02] sm:text-6xl md:text-8xl"
          >
            Best of <span className="text-gradient-brand">Events</span>, in motion
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground"
          >
            A single scrolling showreel compiling standout frames from across
            our event coverage. Press play, then keep scrolling.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="relative mt-12 aspect-video w-full max-w-4xl overflow-hidden rounded-lg border border-border/60 shadow-deep"
          >
            {playing ? (
              <iframe
                src={`${toEmbed(BRAND.showreelUrl)}?autoplay=1`}
                title="ADPRISM Showreel"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="h-full w-full"
              />
            ) : (
              <button
                onClick={() => setPlaying(true)}
                className="group relative flex h-full w-full items-center justify-center bg-black/40"
                aria-label="Play showreel"
              >
                <img
                  src={drivePhotoThumb(frames[0], 1600)}
                  alt="Showreel poster"
                  className="absolute inset-0 h-full w-full object-cover opacity-60"
                />
                <span className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition-transform group-hover:scale-110">
                  <Play className="h-7 w-7 fill-current" />
                </span>
              </button>
            )}
          </motion.div>

          {playing && (
            <button
              onClick={() => setPlaying(false)}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-xs uppercase tracking-widest text-foreground/80 transition-colors hover:border-primary hover:text-primary"
            >
              <Pause className="h-4 w-4" /> Pause showreel
            </button>
          )}
        </div>
      </section>

      {/* Scrolling visual reel */}
      {frames.map((id, i) => (
        <ReelBand
          key={id}
          id={id}
          index={i}
          label="Event Coverage"
        />
      ))}

      {/* Outro */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden text-center">
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="container relative z-10">
          <h2 className="text-balance font-display text-4xl font-bold md:text-6xl">
            Let&apos;s make yours next.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-muted-foreground">
            Every frame here started with a brief. Bring us yours.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/#contact"
              className="rounded-full bg-primary px-7 py-4 text-sm uppercase tracking-widest text-primary-foreground shadow-glow transition-transform hover:scale-[1.04]"
            >
              Start a project
            </Link>
            <Link
              to="/gallery"
              className="rounded-full border border-border px-7 py-4 text-sm uppercase tracking-widest text-foreground/80 transition-colors hover:border-primary hover:text-primary"
            >
              Full gallery
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Reel;
