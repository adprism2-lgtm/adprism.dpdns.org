import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import WhatsApp from "@/components/icons/WhatsApp";
import { BRAND } from "@/data/content";
import { trackWhatsAppClick, trackWhatsAppOpen, whatsappUrlWithContact } from "@/lib/trackWhatsApp";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const VARIANT = "general" as const;

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .max(100, { message: "Name must be less than 100 characters" })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .trim()
    .max(255, { message: "Email must be less than 255 characters" })
    .email({ message: "Please enter a valid email" })
    .optional()
    .or(z.literal("")),
});

const WhatsAppCTA = () => {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth >= 640) {
        setHidden(false);
        return;
      }
      setHidden(true);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setHidden(false), 600);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeout.current);
    };
  }, []);

  const startChat = () => {
    const parsed = contactSchema.safeParse({ name, email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setError(null);
    trackWhatsAppClick("floating_cta", VARIANT);
    const url = whatsappUrlWithContact(BRAND.whatsappUrl, VARIANT, parsed.data);
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (opened) trackWhatsAppOpen("floating_cta", VARIANT);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Chat with us on WhatsApp"
          style={{
            right: "max(1rem, env(safe-area-inset-right))",
            bottom: "max(1rem, env(safe-area-inset-bottom))",
          }}
          className={`group fixed z-40 flex items-center gap-2 rounded-full bg-[#25D366] p-3 text-white shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#25D366]/40 sm:bottom-6 sm:right-6 sm:p-0 sm:px-4 sm:py-3 ${
            hidden && !open
              ? "pointer-events-none translate-y-24 opacity-0 sm:translate-y-0 sm:opacity-100 sm:pointer-events-auto"
              : "translate-y-0 opacity-100"
          }`}
        >
          <span className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366] opacity-50 animate-ping" aria-hidden="true" />
          <WhatsApp className="relative h-5 w-5 sm:h-6 sm:w-6" />
          <span className="relative hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[140px] sm:inline">
            Chat with us
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="z-50 w-72 space-y-3"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Start a WhatsApp chat</p>
          <p className="text-xs text-muted-foreground">
            Add your details (optional) and we'll pick up right where you left off.
          </p>
        </div>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="wa-name" className="text-xs">Name</Label>
            <Input
              id="wa-name"
              value={name}
              maxLength={100}
              placeholder="Your name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="wa-email" className="text-xs">Email</Label>
            <Input
              id="wa-email"
              type="email"
              value={email}
              maxLength={255}
              placeholder="you@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <button
          type="button"
          onClick={startChat}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1fb857]"
        >
          <WhatsApp className="h-4 w-4" />
          Open WhatsApp
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default WhatsAppCTA;
