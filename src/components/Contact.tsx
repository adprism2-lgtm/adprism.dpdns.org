import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trackWhatsAppClick } from "@/lib/trackWhatsApp";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BRAND, SERVICES } from "@/data/content";
import WhatsApp from "@/components/icons/WhatsApp";

const BUDGET_RANGES = [
  "Under PKR 25,000",
  "PKR 25,000 – 100,000",
  "PKR 100,000 – 250,000",
  "PKR 250,000 – 500,000",
  "PKR 500,000+",
];

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  service: z.string().trim().min(1, "Please select a service").max(120),
  budget: z.string().trim().max(60).optional(),
  projectDate: z.string().trim().max(20).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a bit more about your project (at least 10 characters)")
    .max(1000),
});

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [company, setCompany] = useState(""); // honeypot — real users never see this
  const mountedAt = useRef(Date.now());

  const reset = () => {
    setName("");
    setEmail("");
    setService("");
    setBudget("");
    setProjectDate("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam protection: honeypot field + minimum time-to-submit.
    // Bots auto-fill hidden fields and submit near-instantly.
    if (company.trim() !== "" || Date.now() - mountedAt.current < 3000) {
      toast.success("Inquiry sent successfully!", {
        description:
          "Thanks for reaching out — we'll reply within 24 hours with availability and a tailored quote.",
      });
      reset();
      return;
    }

    const parsed = schema.safeParse({ name, email, service, budget, projectDate, message });
    if (!parsed.success) {
      toast.error("Please check the form", {
        description: parsed.error.issues[0].message,
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("inquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      service: parsed.data.service || null,
      budget: parsed.data.budget || null,
      project_date: parsed.data.projectDate || null,
      message: parsed.data.message || null,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Something went wrong", {
        description: "Your inquiry could not be sent. Please try again.",
      });
      return;
    }

    // Fire-and-forget email notification to the studio inbox.
    // Submission is already saved, so a failed email never blocks the user.
    supabase.functions
      .invoke("notify-inquiry", {
        body: {
          name: parsed.data.name,
          email: parsed.data.email,
          service: parsed.data.service || null,
          budget: parsed.data.budget || null,
          projectDate: parsed.data.projectDate || null,
          message: parsed.data.message || null,
        },
      })
      .catch((err) => console.error("Notification email failed:", err));

    toast.success("Inquiry sent successfully!", {
      description:
        "Thanks for reaching out — we'll reply within 24 hours with availability and a tailored quote.",
    });
    reset();
  };

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:pt-2"
        >
          <p className="mb-4 text-sm uppercase tracking-widest-xl text-primary">
            Get in touch
          </p>
          <h2 className="max-w-md text-balance font-display text-3xl font-semibold sm:text-4xl md:text-5xl">
            Let's create something unforgettable
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground">
            Tell me about your event, brand or project and I'll get back to you
            with availability and a tailored quote.
          </p>

          <div className="mt-10 space-y-5">
            <a href={`mailto:${BRAND.email}`} className="flex items-center gap-4 text-foreground/90 hover:text-primary">
              <Mail className="h-5 w-5 text-primary" /> {BRAND.email}
            </a>
            <a href={`tel:${BRAND.phone}`} className="flex items-center gap-4 text-foreground/90 hover:text-primary">
              <Phone className="h-5 w-5 text-primary" /> {BRAND.phone}
            </a>
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("contact_section")}
              className="flex items-center gap-4 text-foreground/90 hover:text-primary"
            >
              <WhatsApp className="h-5 w-5 text-primary" /> WhatsApp
            </a>
            <p className="flex items-center gap-4 text-foreground/90">
              <MapPin className="h-5 w-5 text-primary" /> {BRAND.location}
            </p>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-5 rounded-sm border border-border bg-card p-6 sm:p-8"
        >
          {/* Honeypot: hidden from users, bots tend to fill it */}
          <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
            <label htmlFor="company-website">Company website</label>
            <input
              id="company-website"
              name="company-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">

            <Input
              required
              placeholder="Your name *"
              aria-label="Your name"
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              required
              type="email"
              placeholder="Email *"
              aria-label="Email"
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Select value={service} onValueChange={setService} required>
            <SelectTrigger aria-label="Service interested in">
              <SelectValue placeholder="Service you're interested in *" />
            </SelectTrigger>
            <SelectContent>
              {SERVICES.map((s) => (
                <SelectItem key={s.title} value={s.title}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="grid gap-5 sm:grid-cols-2">
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger aria-label="Budget range">
                <SelectValue placeholder="Budget range" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_RANGES.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              aria-label="Project date"
              value={projectDate}
              onChange={(e) => setProjectDate(e.target.value)}
            />
          </div>
          <Textarea
            required
            rows={5}
            placeholder="Tell me about your project… *"
            aria-label="Message"
            maxLength={1000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-sm bg-primary py-4 text-sm font-medium uppercase tracking-widest text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send Inquiry"}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
