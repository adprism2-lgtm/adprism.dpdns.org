import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TESTIMONIALS, VIDEO_TESTIMONIALS } from "@/data/content";
import TestimonialForm from "./TestimonialForm";
import VideoModal from "./VideoModal";

type DbTestimonial = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  rating: number | null;
};

type Item = {
  name: string;
  role: string;
  quote: string;
  rating: number | null;
  tag?: string;
};

const Testimonials = () => {
  const [items, setItems] = useState<Item[]>(
    TESTIMONIALS.map((t) => ({ ...t, rating: 5 })),
  );
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("id, name, role, quote, rating")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setItems(
          (data as DbTestimonial[]).map((t) => ({
            name: t.name,
            role: t.role ?? "",
            quote: t.quote,
            rating: t.rating,
          })),
        );
      }
    };
    load();
  }, []);

  return (
    <section className="bg-secondary/40 py-28">
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-4 text-sm uppercase tracking-widest-xl text-primary">
            Kind words
          </p>
          <h2 className="text-balance font-display text-4xl font-semibold md:text-5xl">
            Trusted by Brands &amp; Clients
          </h2>
        </div>

        {/* Featured video testimonials */}
        {VIDEO_TESTIMONIALS.length > 0 && (
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {VIDEO_TESTIMONIALS.map((v, i) => (
              <motion.figure
                key={`${v.name}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => setVideoUrl(v.url)}
                  className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-sm border border-primary/30 bg-card text-left shadow-glow"
                >
                  {v.poster ? (
                    <img
                      src={v.poster}
                      alt={`${v.name} — ${v.role} video testimonial`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />

                  <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-110">
                    <Play className="h-6 w-6 fill-current" />
                  </span>
                  <div className="absolute bottom-0 left-0 z-10 p-5">
                    {v.tag ? (
                      <span className="mb-2 inline-block rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs uppercase tracking-widest text-primary">
                        {v.tag}
                      </span>
                    ) : null}
                    <p className="font-display text-lg">{v.name}</p>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {v.role}
                    </p>
                  </div>
                </button>
                {v.transcript ? (
                  <figcaption className="mt-3 rounded-sm border border-border bg-card/60 p-4">
                    <span className="mb-1 block text-xs uppercase tracking-widest text-primary">
                      Transcript
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {v.transcript}
                    </p>
                  </figcaption>
                ) : null}
              </motion.figure>
            ))}
          </div>
        )}


        <div className="grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <motion.blockquote
              key={`${t.name}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="rounded-sm border border-border bg-card p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <Quote className="h-8 w-8 text-primary" />
                {t.tag ? (
                  <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs uppercase tracking-widest text-primary">
                    {t.tag}
                  </span>
                ) : null}
              </div>
              {t.rating ? (
                <div className="mt-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
              ) : null}
              <p className="mt-5 text-lg leading-relaxed text-foreground/90">
                "{t.quote}"
              </p>
              <footer className="mt-6">
                <p className="font-display text-lg">{t.name}</p>
                {t.role ? (
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {t.role}
                  </p>
                ) : null}
              </footer>
            </motion.blockquote>
          ))}
        </div>

        <div className="mt-14 text-center">
          <TestimonialForm />
        </div>
      </div>

      <VideoModal
        open={!!videoUrl}
        onOpenChange={(v) => !v && setVideoUrl(null)}
        url={videoUrl ?? ""}
      />
    </section>
  );
};

export default Testimonials;
