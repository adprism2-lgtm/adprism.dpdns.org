import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Store } from "lucide-react";
import { useExhibitions, type ExhibitionItem } from "@/hooks/useExhibitions";
import VideoModal from "./VideoModal";
import ThumbnailImage from "./ThumbnailImage";


const Exhibitions = () => {
  const { items: EXHIBITIONS } = useExhibitions();
  const [active, setActive] = useState<ExhibitionItem | null>(null);


  return (
    <section id="exhibitions" className="relative py-28">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-4 text-sm uppercase tracking-widest-xl text-primary">
            Exhibition &amp; Stall Coverage
          </p>
          <h2 className="text-balance font-display text-4xl font-semibold md:text-5xl">
            Booths &amp; Events we've covered
          </h2>
          <p className="mt-4 text-muted-foreground">
            {EXHIBITIONS.length}+ trade shows, expos and brand activations — hover a card and tap to play the reel.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {EXHIBITIONS.map((e, i) => (
            <motion.button
              key={e.name}
              onClick={() => setActive(e)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
              className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-card/40 text-left backdrop-blur transition-colors hover:border-primary/60"
            >
              <ThumbnailImage
                src={e.img}
                alt={e.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                fallback={
                  <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary/20 via-background to-accent/20">
                    <Store className="h-6 w-6 text-primary/60" />
                  </div>
                }
              />


              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent transition-colors group-hover:from-background/70" />

              <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 scale-75 items-center justify-center rounded-full bg-primary/90 text-primary-foreground opacity-0 shadow-glow transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <Play className="h-5 w-5 fill-current" />
              </span>

              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="font-display text-sm leading-tight">{e.name}</p>
                {e.caption && (
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                    {e.caption}
                  </p>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <VideoModal
        open={active !== null}
        onOpenChange={(v) => !v && setActive(null)}
        url={active?.url ?? ""}
        poster={active?.img}
      />
    </section>
  );
};

export default Exhibitions;
