import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { FILMS, FILM_CATEGORIES } from "@/data/content";
import VideoModal from "./VideoModal";
import ThumbnailImage from "./ThumbnailImage";


const TABS = ["All", ...FILM_CATEGORIES] as const;

const Films = () => {
  const [activeFilm, setActiveFilm] = useState<(typeof FILMS)[number] | null>(null);
  const [tab, setTab] = useState<string>("All");

  const visible = useMemo(
    () => (tab === "All" ? FILMS : FILMS.filter((f) => f.category === tab)),
    [tab],
  );

  return (
    <section id="films" className="relative py-28">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-4 text-sm uppercase tracking-widest-xl text-primary">
            Showreel &amp; Films
          </p>
          <h2 className="text-balance font-display text-4xl font-semibold md:text-5xl">
            Watch the work in motion
          </h2>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                tab === t
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {visible.map((f, i) => (
            <motion.button
              key={f.title}
              onClick={() => setActiveFilm(f)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative flex flex-col overflow-hidden rounded-sm text-left"
            >
              <div className="relative aspect-video overflow-hidden rounded-sm">
                <ThumbnailImage
                  src={f.img}
                  alt={f.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-background/40 transition-colors group-hover:bg-background/25" />
                <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-glow transition-transform group-hover:scale-110">
                  <Play className="h-4 w-4 fill-current" />
                </span>
                {!f.summary && (
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="font-display text-sm leading-tight line-clamp-2">{f.title}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                      {f.meta}
                    </p>
                  </div>
                )}
              </div>

              {f.summary && (
                <div className="p-2.5">
                  <p className="font-display text-sm leading-tight line-clamp-2">{f.title}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-widest text-primary/80">
                    {f.meta}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground line-clamp-3">
                    {f.summary}
                  </p>
                  {f.credits && (
                    <p className="mt-1.5 text-[10px] leading-snug text-muted-foreground/70">
                      {f.credits}
                    </p>
                  )}
                </div>
              )}

            </motion.button>
          ))}
        </div>
      </div>

      <VideoModal
        open={activeFilm !== null}
        onOpenChange={(v) => !v && setActiveFilm(null)}
        url={activeFilm?.url ?? ""}
        poster={activeFilm?.img}
      />
    </section>
  );
};

export default Films;
