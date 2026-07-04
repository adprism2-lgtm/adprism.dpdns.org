import { motion } from "framer-motion";

// Auto-import every uploaded client logo asset pointer
const modules = import.meta.glob("@/assets/clients/*.asset.json", {
  eager: true,
});



  // 1. Delete the "const modules = ..." and "const clients = ..." blocks entirely.

// 2. Replace them with this static list:
const CLIENTS = [
  { name: "Al Momin", url: "/al-momin.jpg" },
  { name: "Angel", url: "/angel.jpg" },
  { name: "Ashraf Group", url: "/ashraf-group.jpg" },
  { name: "Atzaa", url: "/atzaa.jpg" },
  { name: "Byd", url: "/byd.jpg" },
  { name: "Ccl", url: "/ccl.jpg" },
  { name: "Delsol", url: "/delsol.jpg" },
  { name: "Diwan International", url: "/diwan-international.jpg" },
  { name: "Dreams Network", url: "/dreams-network.jpg" },
  { name: "Dulzer", url: "/dulzer.jpg" },
  { name: "Emerging Green Solution", url: "/emerging-green-solution.jpg" },
  { name: "Far Eastern Impex", url: "/far-eastern-impex.jpg" },
  { name: "Gear Globe", url: "/gear-globe.jpg" },
  { name: "Govt Crescent", url: "/govt-crescent.jpg" },
  { name: "Gp", url: "/gp.jpg" },
  { name: "Graceware", url: "/graceware.jpg" },
  { name: "Green House", url: "/green-house.jpg" },
  { name: "Huawei Fusionsolar", url: "/huawei-fusionsolar.jpg" },
  { name: "Jinko Solar", url: "/jinko-solar.jpg" },
  { name: "Karachi Essence House", url: "/karachi-essence-house.jpg" },
  { name: "Lion Wave Solutions", url: "/lion-wave-solutions.jpg" },
  { name: "Mars Power", url: "/mars-power.jpg" },
  { name: "Midea", url: "/midea.jpg" },
  { name: "Onerun", url: "/onerun.jpg" },
  { name: "Pakistan Tobacco", url: "/pakistan-tobacco.jpg" },
  { name: "Pelco", url: "/pelco.jpg" },
  { name: "Powerhouse", url: "/powerhouse.jpg" },
  { name: "Pro Exhibitions", url: "/pro-exhibitions.jpg" },
  { name: "Pv360", url: "/pv360.jpg" },
  { name: "Rootech Pakistan", url: "/rootech-pakistan.jpg" },
  { name: "Sindh Talent Hunt", url: "/sindh-talent-hunt.jpg" },
  { name: "Sofcom", url: "/sofcom.jpg" },
  { name: "Solar Citizen", url: "/solar-citizen.jpg" },
  { name: "Sports In Pakistan", url: "/sports-in-pakistan.jpg" },
  { name: "Sufi", url: "/sufi.jpg" },
  { name: "Super International", url: "/super-international.jpg" },
  { name: "The Trillium", url: "/the-trillium.jpg" },
  { name: "Tmi", url: "/tmi.jpg" },
  { name: "Tribuild", url: "/tribuild.jpg" },
  { name: "Urooj Plastic", url: "/urooj-plastic.jpg" },
];

// 3. Update the loop in the Clients component:
const Clients = () => {
  const loop = [...CLIENTS, ...CLIENTS];
  // ... rest of your component

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
