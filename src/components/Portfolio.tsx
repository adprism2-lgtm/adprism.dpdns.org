import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PORTFOLIO, type Category } from "@/data/content";

const PREVIEW_COUNT = 30;


const CATEGORIES: Category[] = [
  "All",
  ...(Array.from(new Set(PORTFOLIO.map((p) => p.category))) as Category[]),
];

// Fisher-Yates shuffle so every visit shows the images in a fresh order.
const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const Portfolio = () => {
  const [active, setActive] = useState<Category>("All");

  // Shuffle once per mount so the gallery order feels random and varied.
  const shuffled = useMemo(() => shuffle(PORTFOLIO), []);

  const items = (
    active === "All"
      ? shuffled
      : shuffled.filter((p) => p.category === active)
  ).slice(0, PREVIEW_COUNT);




  return (
    <section id="portfolio" className="py-20 md:py-28">
      <div className="container">
        <div className="mb-12 flex flex-col items-center gap-6 text-center">
          <div>
            <p className="mb-4 text-sm uppercase tracking-widest-xl text-primary">
              Selected work
            </p>
            <h2 className="mx-auto max-w-xl text-balance font-display text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              A Portfolio Across Every Kind of Story
            </h2>
          </div>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full border px-5 py-2 text-xs uppercase tracking-widest transition-colors ${
                active === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.figure
                key={item.img}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-sm"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent opacity-60 transition-opacity group-hover:opacity-90" />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[10px] uppercase tracking-widest text-primary">
                    {item.category}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2 rounded-full border border-primary bg-primary px-8 py-3 text-xs uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View More Photos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>



      </div>
    </section>
  );
};

export default Portfolio;
