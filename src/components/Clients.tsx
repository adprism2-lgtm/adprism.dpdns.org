import { motion } from "framer-motion";

// Auto-import every uploaded client logo asset pointer
const modules = import.meta.glob("@/assets/clients/*.asset.json", {
  eager: true,
});

const clients = Object.entries(modules)
  .map(([path, mod]) => {
    const url = (mod as { default: { url: string } }).default.url;
    const file = path.split("/").pop() || "";
    const name = file
      .replace(".jpg.asset.json", "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { url, name };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const Clients = () => {
  const loop = [...clients, ...clients];

  return (
    <section id="clients" className="relative overflow-hidden py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-primary">
            Trusted By
          </p>
          <h2 className="text-balance font-display text-4xl font-bold md:text-5xl">
            Our{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Clients
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Brands and organisations we've had the privilege to work with — and many more.
          </p>
        </motion.div>
      </div>

      <div className="relative space-y-6">
        <Row items={loop} direction="left" />
        <Row items={[...loop].reverse()} direction="right" />
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </section>
  );
};

const Row = ({
  items,
  direction,
}: {
  items: { url: string; name: string }[];
  direction: "left" | "right";
}) => (
  <div className="flex w-max animate-none">
    <motion.div
      className="flex gap-6 pr-6"
      animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
      transition={{ duration: 45, ease: "linear", repeat: Infinity }}
    >
      {items.map((c, i) => (
        <div
          key={`${c.name}-${i}`}
          className="flex h-24 w-40 shrink-0 items-center justify-center rounded-xl border border-border bg-white/95 p-4 shadow-sm backdrop-blur transition-transform hover:scale-105"
        >
          <img
            src={c.url}
            alt={`${c.name} logo`}
            loading="lazy"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ))}
    </motion.div>
  </div>
);

export default Clients;
