import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronDown, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-reel.jpg";
import { BRAND } from "@/data/content";
import VideoModal from "./VideoModal";

// Words that rotate in the headline with a smooth fade + slide-up motion.
const WORDS = [
  "Visuals.",
  "Stories.",
  "Brands.",
  "Impact.",
  "Experiences.",
  "Films.",
  "Campaigns.",
  "Content.",
];

const Hero = () => {
  const [open, setOpen] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setWordIndex((n) => (n + 1) % WORDS.length);
    }, 2600);
    return () => clearInterval(t);
  }, []);




  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      {/* Background image + futuristic overlays */}
      <img
        src={heroImg}
        alt="Videographer filming a cinematic event"
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-background/80" />
      <div className="absolute inset-0 grid-lines opacity-70" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-amber/15 blur-[120px] animate-pulse-glow" />

      <div className="container relative z-10 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-widest text-primary"
        >
          <Sparkles className="h-3.5 w-3.5" /> {BRAND.tagline}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-4xl font-display text-5xl font-bold leading-[1.02] sm:text-6xl md:text-8xl"
        >
          <span className="block">We Create</span>
          <span className="mt-1 block h-[1.1em] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={WORDS[wordIndex]}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="block text-gradient-brand"
                translate="no"
              >
                <span>{WORDS[wordIndex]}</span>
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>


        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-8 max-w-xl text-lg text-muted-foreground"
        >
          We transform ideas into powerful visual stories through commercial photography, 
          cinematic films, documentaries, exhibition coverage, product content, 
          and corporate interviews—crafted to elevate your brand.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center gap-5"
        >
          <button
            onClick={() => setOpen(true)}
            className="group flex items-center gap-4 rounded-full bg-primary px-7 py-4 text-primary-foreground shadow-glow transition-transform hover:scale-[1.04]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15">
              <Play className="h-4 w-4 fill-current" />
            </span>
            <span className="text-sm font-medium uppercase tracking-widest">Watch Showreel</span>
          </button>
          <a
            href="/reel"
            className="rounded-full border border-border px-7 py-4 text-sm uppercase tracking-widest text-foreground/80 transition-colors hover:border-primary hover:text-primary"
          >
            Watch the Reel
          </a>
        </motion.div>
      </div>

      {/* Floating holographic logo */}
      <motion.img
        src="/adprism-logo.png"
        alt=""
        aria-hidden
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="pointer-events-none absolute right-[6%] top-1/2 hidden w-[34%] max-w-lg -translate-y-1/2 animate-float drop-shadow-[0_0_60px_hsl(158_80%_45%/0.35)] lg:block"
      />

      <a
        href="#services"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted-foreground"
        aria-label="Scroll down"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>

      <VideoModal open={open} onOpenChange={setOpen} url={BRAND.showreelUrl} />
    </section>
  );
};

export default Hero;
