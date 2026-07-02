import { supabase } from "@/integrations/supabase/client";

/**
 * Prefilled WhatsApp message variants.
 * Each variant maps to a distinct inquiry type so we can measure which converts best.
 */
export const WHATSAPP_VARIANTS = {
  general: "Hi ADPRISM! I'd like to discuss a photography/videography project.",
  video: "Hi ADPRISM! I'm interested in your videography & film production services.",
  exhibition: "Hi ADPRISM! I'd like a quote for exhibition / booth coverage.",
  product: "Hi ADPRISM! I'd like to discuss product photography for my brand.",
} as const;

export type WhatsAppVariant = keyof typeof WHATSAPP_VARIANTS;

/** Builds a wa.me URL with the prefilled message for the given variant. */
export function whatsappUrlFor(baseUrl: string, variant: WhatsAppVariant) {
  return `${baseUrl}?text=${encodeURIComponent(WHATSAPP_VARIANTS[variant])}`;
}

/**
 * Builds a wa.me URL, appending the visitor's name/email to the prefilled message
 * when provided. Inputs are trimmed and the whole message is URL-encoded.
 */
export function whatsappUrlWithContact(
  baseUrl: string,
  variant: WhatsAppVariant,
  contact?: { name?: string; email?: string },
) {
  let message = WHATSAPP_VARIANTS[variant];
  const name = contact?.name?.trim();
  const email = contact?.email?.trim();
  if (name) message += `\n\nName: ${name}`;
  if (email) message += `\nEmail: ${email}`;
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}

/**
 * Records a WhatsApp CTA click for analytics.
 * Fires a dataLayer/gtag event (if present) and logs the click to the backend.
 * Never blocks navigation — failures are swallowed silently.
 */
export function trackWhatsAppClick(location: string, variant?: WhatsAppVariant) {
  const path = typeof window !== "undefined" ? window.location.pathname : null;
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : null;

  // Push to analytics layers if available
  try {
    const w = window as unknown as {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };
    w.dataLayer?.push({ event: "whatsapp_click", location, variant, path });
    w.gtag?.("event", "whatsapp_click", { location, variant, page_path: path });
  } catch {
    /* no-op */
  }

  // Persist to backend (fire-and-forget)
  void supabase
    .from("whatsapp_clicks")
    .insert({ location, path, user_agent: userAgent, variant: variant ?? null })
    .then(({ error }) => {
      if (error) console.warn("whatsapp click log failed", error.message);
    });
}

/**
 * Records a *successful* WhatsApp link open (the chat window actually opened).
 * Fires a distinct `whatsapp_open` analytics event and logs to the backend.
 * Call this only after window.open returns a live window handle.
 */
export function trackWhatsAppOpen(location: string, variant?: WhatsAppVariant) {
  const path = typeof window !== "undefined" ? window.location.pathname : null;
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : null;

  // Push to analytics layers if available
  try {
    const w = window as unknown as {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };
    w.dataLayer?.push({ event: "whatsapp_open", location, variant, path });
    w.gtag?.("event", "whatsapp_open", { location, variant, page_path: path });
  } catch {
    /* no-op */
  }

  // Persist to backend (fire-and-forget)
  void supabase
    .from("whatsapp_clicks")
    .insert({ location: `${location}:open`, path, user_agent: userAgent, variant: variant ?? null })
    .then(({ error }) => {
      if (error) console.warn("whatsapp open log failed", error.message);
    });
}
