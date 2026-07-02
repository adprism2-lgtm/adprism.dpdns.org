import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import {
  DRIVE_PHOTOS,
  DRIVE_PHOTO_CATEGORIES,
  drivePhotoThumb,
} from "@/data/drivePhotos";
import { cn } from "@/lib/utils";
import Seo from "@/components/Seo";

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const CATEGORIES = ["All", ...DRIVE_PHOTO_CATEGORIES];

const PAGE = 120;

const Gallery = () => {
  const photos = useMemo(() => shuffle(DRIVE_PHOTOS), []);
  const [filter, setFilter] = useState<string>("All");
  const [count, setCount] = useState(PAGE);
  const [active, setActive] = useState<string | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      filter === "All"
        ? photos
        : photos.filter((p) => p.category === filter),
    [photos, filter]
  );

  useEffect(() => {
    setCount(PAGE);
  }, [filter]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCount((c) => Math.min(c + PAGE, filtered.length));
        }
      },
      { rootMargin: "600px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [filtered.length]);

  return (
    <main className="min-h-screen py-20">
      <Seo
        title="Portfolio Gallery — ADPRISM Studio"
        description="Browse ADPRISM's full photography portfolio — corporate events, product shoots, and exhibition coverage captured with an editorial, cinematic eye."
        path="/gallery"
      />

      <div className="container">
        <Link
          to="/#portfolio"
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mb-10">
          <p className="mb-4 text-sm uppercase tracking-widest-xl text-primary">
            Full gallery
          </p>
          <h1 className="max-w-xl text-balance font-display text-4xl font-semibold md:text-5xl">
            Every photo in the collection
          </h1>
          <p className="mt-4 text-muted-foreground">
            {filtered.length.toLocaleString()} images — showing{" "}
            {Math.min(count, filtered.length)}.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition-colors",
                filter === cat
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
          {filtered.slice(0, count).map(({ id }, i) => (
            <motion.figure
              key={id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: (i % PAGE) * 0.005 }}
              onClick={() => setActive(id)}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-sm bg-muted/20"
            >
              <img
                src={drivePhotoThumb(id, 400)}
                alt="Portfolio photograph"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.figure>
          ))}
        </div>

        <div ref={sentinel} className="h-10" />
      </div>

      {active && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm"
        >
          <button
            aria-label="Close"
            className="absolute right-5 top-5 rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-primary"
            onClick={() => setActive(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={drivePhotoThumb(active, 1600)}
            alt="Portfolio photograph"
            className="max-h-[90vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
};

export default Gallery;
