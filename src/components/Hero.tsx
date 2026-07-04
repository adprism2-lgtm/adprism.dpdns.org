import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronDown, Sparkles } from "lucide-react";
import { BRAND } from "@/data/content";
import VideoModal from "./VideoModal";

// ... (WORDS constant remains the same)

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
      {/* 1. UPDATED BACKGROUND IMAGE PATH */}
      <img
        src="/hero-reel.jpg" 
        alt="Videographer filming a cinematic event"
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      {/* ... (overlays remain the same) */}

      <div className="container relative z-10 pt-24">
        {/* ... (Headline and content remain the same) */}
      </div>

      {/* 2. UPDATED FLOATING LOGO PATH */}
      <motion.img
        src="/adprism-logo.png"
        alt=""
        aria-hidden
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="pointer-events-none absolute right-[6%] top-1/2 hidden w-[34%] max-w-lg -translate-y-1/2 animate-float drop-shadow-[0_0_60px_hsl(158_80%_45%/0.35)] lg:block"
      />

      {/* ... (rest of code) */}
      <VideoModal open={open} onOpenChange={setOpen} url={BRAND.showreelUrl} />
    </section>
  );
};

export default Hero;
