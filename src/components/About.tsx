import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/data/content";

const stats = [
  { value: "13+", label: "YEARS BEHIND\nTHE LENS" },
  { value: "300+", label: "PROJECTS\nDELIVERED" },
  { value: "60+", label: "HAPPY BRANDS & CLIENTS" },
];

const parseStat = (value: string) => {
  const match = value.match(/^(\d+)(.*)$/);
  return {
    target: match ? parseInt(match[1], 10) : 0,
    suffix: match ? match[2] : value,
  };
};

const CountUp = ({ value }: { value: string }) => {
  const { target, suffix } = parseStat(value);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (target === 0) {
      setDisplay(0);
      return;
    }
    let raf = 0;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <span ref={ref} aria-label={value}>
      {display}
      {suffix}
    </span>
  );
};

const About = () => {
  return (
    <section id="about" className="relative py-28">
      <div className="container grid items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative" 
          
        >
         <img
  src="/about-portrait.png"
  alt="Portrait of the photographer and filmmaker holding a camera"
  width={896}
  height={1152}
  loading="lazy"
  className="w-full rounded-sm object-cover shadow-deep"
/>
          <div className="absolute -bottom-6 -right-4 hidden rounded-sm border border-primary/40 bg-background/90 px-6 py-4 backdrop-blur sm:block">
            <p className="font-display text-lg text-primary">{BRAND.owner}</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Photographer · Filmmaker
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="mb-4 text-sm uppercase tracking-widest-xl text-primary">About</p>
          <h2 className="max-w-xl text-balance font-display text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            A storyteller with a camera and a business built on trust
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            I'm a photographer, filmmaker and studio owner helping companies and
            brands turn fleeting moments into films and photographs worth
            keeping. From boardrooms and exhibition halls to product sets, I
            bring a cinematic eye and a calm, professional presence to every set.
          </p>
          <p className="mt-4 text-muted-foreground">
            My studio handles everything end to end — direction, shooting,
            editing and color — so you get a polished result and a partner who
            actually cares about your story.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-extrabold text-gradient-brand md:text-4xl">
                  <CountUp value={s.value} />
                </p>
                <p className="mt-1 whitespace-pre-line text-xs uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
