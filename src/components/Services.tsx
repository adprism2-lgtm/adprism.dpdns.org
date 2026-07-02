import { motion } from "framer-motion";
import { SERVICES } from "@/data/content";

const accents = [
  "text-primary",
  "text-amber",
  "text-brand-blue",
  "text-primary",
  "text-amber",
  "text-brand-blue",
];

const Services = () => {
  return (
    <section id="services" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />
      <div className="container relative">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-4 text-sm uppercase tracking-widest-xl text-primary">
            What we do
          </p>
          <h2 className="mx-auto text-center font-display text-4xl font-bold md:text-5xl">
            Visual Excellence Across <br />
            <span className="text-gradient-brand">Every Spectrum</span>
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="glass group relative overflow-hidden rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className={`inline-flex rounded-xl border border-border bg-background/40 p-3 ${accents[i]}`}>
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-display text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
