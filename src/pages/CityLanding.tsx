import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Seo from "@/components/Seo";
import NotFound from "@/pages/NotFound";
import { CITIES, getCity } from "@/data/cities";
import { BRAND, PORTFOLIO } from "@/data/content";

type Service = "videography" | "photography";

const CityLanding = ({
  slug,
  service = "videography",
}: {
  slug: string;
  service?: Service;
}) => {
  const city = getCity(slug);

  if (!city) return <NotFound />;

  // Use photography-specific copy when available, otherwise fall back to the default (videography) copy.
  const copy =
    service === "photography" && city.photography ? city.photography : city;

  const others = CITIES.filter((c) => c.slug !== city.slug);

  // A rotating, deterministic slice of portfolio work shown as local highlights.
  const highlights = (() => {
    if (!PORTFOLIO.length) return [];
    const offset =
      city.slug.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) %
      PORTFOLIO.length;
    return Array.from({ length: Math.min(6, PORTFOLIO.length) }, (_, i) =>
      PORTFOLIO[(offset + i) % PORTFOLIO.length],
    );
  })();

  const keywords =
    service === "photography"
      ? `${city.name.toLowerCase()} photography, product photography ${city.name.toLowerCase()}, corporate photography ${city.name.toLowerCase()}, exhibition photography ${city.name.toLowerCase()}${
          city.slug === "lahore" ? ", da artist photography lahore" : ""
        }${city.slug === "karachi" ? ", event photography karachi" : ""}`
      : `videographer ${city.name.toLowerCase()}, corporate video ${city.name.toLowerCase()}, exhibition coverage ${city.name.toLowerCase()}`;

  const canonical = `https://frame-stories-film.lovable.app/${service}-${city.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": canonical,
    name: `${BRAND.name} — ${city.name}`,
    description: copy.description,
    url: canonical,
    email: BRAND.email,
    telephone: BRAND.phone,
    areaServed: city.name,
    keywords,
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: city.region,
      addressCountry: "PK",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "10:00",
      closes: "19:00",
    },
    sameAs: [
      BRAND.socials.instagram,
      BRAND.socials.facebook,
      BRAND.socials.linkedin,
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: city.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={copy.title}
        description={copy.description}
        path={`/${service}-${city.slug}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />

      <main>
        {/* City hero */}
        <section className="relative overflow-hidden pt-40 pb-20">
          <div className="pointer-events-none absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl text-center"
            >
              <p className="mb-4 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-primary">
                <MapPin className="h-4 w-4" /> {city.name}, Pakistan
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
                {copy.headline}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {copy.intro}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#contact"
                  className="rounded-full bg-primary px-7 py-3 text-sm font-medium uppercase tracking-widest text-primary-foreground shadow-glow transition-transform hover:scale-105"
                >
                  Book in {city.name}
                </a>
                <a
                  href={BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border px-7 py-3 text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  WhatsApp us
                </a>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mx-auto mt-14 max-w-3xl text-center text-base leading-relaxed text-muted-foreground"
            >
              {copy.blurb}
            </motion.p>
          </div>
        </section>

        <Services />

        {/* Gallery highlights */}
        {highlights.length > 0 && (
          <section className="py-20">
            <div className="container">
              <h2 className="mb-3 text-center font-display text-2xl font-bold md:text-3xl">
                {city.name} Work Highlights
              </h2>
              <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
                A glimpse of the {service === "photography" ? "photography" : "videography"} and coverage we deliver for brands and events in {city.name}.
              </p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {highlights.map((item, i) => (
                  <motion.div
                    key={`${item.img}-${i}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg"
                  >
                    <img
                      src={item.img}
                      alt={`${item.title} in ${city.name} — ${BRAND.name}`}
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={600}
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                      <span className="text-xs font-medium uppercase tracking-widest text-foreground/90">
                        {item.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link
                  to="/gallery"
                  className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-primary hover:underline"
                >
                  View full gallery <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Local CTA */}
        <section className="py-16">
          <div className="container">
            <div className="glass mx-auto max-w-3xl rounded-2xl px-6 py-12 text-center">
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Planning a shoot in {city.name}?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Tell us about your event, brand, or exhibition and we'll send a tailored quote in PKR — with availability across {city.name} and nearby areas.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#contact"
                  className="rounded-full bg-primary px-7 py-3 text-sm font-medium uppercase tracking-widest text-primary-foreground shadow-glow transition-transform hover:scale-105"
                >
                  Get a quote in {city.name}
                </a>
                <a
                  href={BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border px-7 py-3 text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  WhatsApp us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container">
            <h2 className="mb-8 text-center font-display text-2xl font-bold md:text-3xl">
              {city.name} — Frequently Asked Questions
            </h2>
            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {city.faqs.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Other cities */}
        <section className="py-20">
          <div className="container">
            <h2 className="mb-8 text-center font-display text-2xl font-bold md:text-3xl">
              We also cover
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {others.map((c) => (
                <Link
                  key={c.slug}
                  to={`/videography-${c.slug}`}
                  className="glass group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors hover:text-primary"
                >
                  <MapPin className="h-4 w-4" /> {c.name}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default CityLanding;
