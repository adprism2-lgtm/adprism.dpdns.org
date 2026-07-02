/**
 * City-focused local SEO content.
 * Karachi & Lahore are primary markets; Islamabad, Multan, Faisalabad are secondary.
 * All copy lives here so the CityLanding template stays layout-only.
 */

export type CityTier = "primary" | "secondary";

export interface FaqItem {
  q: string;
  a: string;
}

export interface CityCopy {
  title: string; // SEO <title>
  description: string; // SEO meta description
  headline: string;
  intro: string;
  blurb: string;
}

export interface City extends CityCopy {
  slug: string; // used in the /videography-{slug} route
  name: string;
  region: string; // province / territory for PostalAddress
  tier: CityTier;
  faqs: FaqItem[]; // rendered on the landing page + FAQPage schema
  /** Optional photography-focused copy for the /photography-{slug} route. */
  photography?: CityCopy;
}

export const CITIES: City[] = [
  {
    slug: "karachi",
    name: "Karachi",
    region: "Sindh",
    tier: "primary",
    faqs: [
      {
        q: "How much does photography or videography cost in Karachi?",
        a: "Pricing in Karachi depends on the shoot type — product photography, corporate portraits, event coverage, or exhibition stalls. Share your brief on WhatsApp and we'll send a tailored quote in PKR.",
      },
      {
        q: "Do you cover exhibitions and stalls at the Karachi Expo Centre?",
        a: "Yes. Exhibition and stall coverage at the Karachi Expo Centre and other venues is one of our core services, with same-day highlight turnaround available.",
      },
      {
        q: "Do you offer product photography for e-commerce brands in Karachi?",
        a: "Absolutely. We shoot studio product photography and brand campaigns for Karachi e-commerce and retail brands, delivering web-ready, high-resolution images.",
      },
      {
        q: "Which areas of Karachi do you serve?",
        a: "We cover all of Karachi — including Clifton, DHA, Gulshan, and the industrial/SITE zones — plus travel across Pakistan on request.",
      },
    ],
    title:
      "Videographer in Karachi | Corporate Video & Exhibition Coverage — ADPRISM",
    description:
      "ADPRISM is a Karachi-based videography and photography studio for corporate videos, documentaries, exhibition & stall coverage, and product photography.",
    headline: "Videography & Exhibition Coverage in Karachi",
    intro:
      "ADPRISM is a Karachi-based creative studio delivering cinematic corporate videos, documentaries, exhibition coverage, and product photography for brands across the city.",
    blurb:
      "From Expo Centre trade shows and corporate launches to factory documentaries and product shoots, we cover Karachi end to end. Most of our exhibition and stall coverage happens right here — with fast turnaround and a team that knows the city's venues, timings, and pace.",
    photography: {
      title:
        "Karachi Photography | Product, Corporate & Event Photography — ADPRISM",
      description:
        "Karachi photography by ADPRISM — a studio for product photography, corporate portraits, event coverage, and exhibition stall photography in Karachi.",
      headline:
        "Karachi Photography — Product, Corporate & Event Coverage",
      intro:
        "ADPRISM is a Karachi photography studio delivering high-end product photography, corporate portraits, and event coverage crafted with an editorial eye.",
      blurb:
        "From studio product shoots and brand campaigns to on-location corporate portraits, event photography, and exhibition stall coverage, our Karachi photography covers the city end to end — with dramatic lighting and fast turnaround.",
    },
  },
  {
    slug: "lahore",
    name: "Lahore",
    region: "Punjab",
    tier: "primary",
    faqs: [
      {
        q: "How much does photography or videography cost in Lahore?",
        a: "Lahore pricing depends on the shoot — product photography, corporate portraits, event coverage, or exhibition stalls. Send your brief on WhatsApp and we'll share a tailored quote in PKR.",
      },
      {
        q: "Do you cover exhibitions and trade fairs at the Lahore Expo Centre?",
        a: "Yes. Exhibition, expo, and stall coverage at the Lahore Expo Centre and other venues is a core service, with fast highlight delivery.",
      },
      {
        q: "Do you shoot corporate and product photography for Lahore brands?",
        a: "We do. As a da artist–led studio, we deliver corporate portraits, brand campaigns, and studio product photography for Lahore businesses.",
      },
      {
        q: "Which areas of Lahore do you serve?",
        a: "We cover all of Lahore — including Gulberg, DHA, Johar Town, and the industrial estates — and travel across Pakistan on request.",
      },
    ],
    title:
      "Videographer in Lahore | Corporate Video & Exhibition Coverage — ADPRISM",
    description:
      "ADPRISM delivers professional videography, corporate documentaries, exhibition & stall coverage, and product photography in Lahore.",
    headline: "Videography & Exhibition Coverage in Lahore",
    intro:
      "ADPRISM brings next-generation visuals to Lahore — corporate videos, brand documentaries, exhibition coverage, and product photography crafted with an editorial, cinematic eye.",
    blurb:
      "We regularly cover Lahore exhibitions, expos, and corporate events. Whether it's a stall at a trade fair, a keynote, or a full brand film, our Lahore coverage is built to capture energy, detail, and story.",
    photography: {
      title:
        "Lahore Photography | Product, Corporate & Exhibition Photography — ADPRISM",
      description:
        "Lahore photography by ADPRISM — a da artist studio for product photography, corporate portraits, event coverage, and exhibition stall photography in Lahore.",
      headline:
        "Lahore Photography — Corporate, Product & Exhibition Coverage",
      intro:
        "ADPRISM is a da artist photography studio in Lahore, delivering corporate photography, product shoots, and exhibition coverage crafted with an editorial, cinematic eye.",
      blurb:
        "From brand campaigns and studio product photography to on-location corporate portraits and exhibition stall shoots, our Lahore photography is built to make brands look premium. As a da artist–led studio, we cover Lahore's trade fairs, expos, and corporate events end to end.",
    },
  },
  {
    slug: "islamabad",
    name: "Islamabad",
    region: "Islamabad Capital Territory",
    tier: "secondary",
    faqs: [
      {
        q: "Do you travel to Islamabad for shoots?",
        a: "Yes. We regularly travel to Islamabad for corporate videos, documentaries, exhibitions, and product photography, bringing a full production crew.",
      },
      {
        q: "What events do you cover in Islamabad?",
        a: "Conferences, corporate events, product launches, and exhibitions across Islamabad and Rawalpindi.",
      },
    ],
    title: "Videographer in Islamabad | Corporate Video & Coverage — ADPRISM",
    description:
      "ADPRISM offers videography, corporate documentaries, exhibition coverage, and product photography in Islamabad.",
    headline: "Videography & Corporate Coverage in Islamabad",
    intro:
      "ADPRISM travels to Islamabad for corporate videos, documentaries, exhibition coverage, and product photography — bringing the same cinematic quality to the capital.",
    blurb:
      "For conferences, corporate events, and exhibitions in Islamabad, our team delivers polished coverage and story-driven films with reliable planning and delivery.",
  },
  {
    slug: "multan",
    name: "Multan",
    region: "Punjab",
    tier: "secondary",
    faqs: [
      {
        q: "Do you travel to Multan for shoots?",
        a: "Yes. We bring a complete crew to Multan for corporate videos, industrial documentaries, exhibitions, and product photography.",
      },
      {
        q: "What do you shoot in Multan?",
        a: "Factory and industrial documentaries, exhibitions, corporate events, and product photography for local businesses.",
      },
    ],
    title: "Videographer in Multan | Corporate Video & Coverage — ADPRISM",
    description:
      "ADPRISM provides videography, corporate documentaries, exhibition coverage, and product photography in Multan.",
    headline: "Videography & Corporate Coverage in Multan",
    intro:
      "ADPRISM covers Multan for corporate videos, documentaries, exhibitions, and product photography — cinematic visuals wherever your brand needs them.",
    blurb:
      "From factory and industrial documentaries to exhibitions and corporate shoots, we bring a full production team to Multan with dependable scheduling.",
  },
  {
    slug: "faisalabad",
    name: "Faisalabad",
    region: "Punjab",
    tier: "secondary",
    faqs: [
      {
        q: "Do you travel to Faisalabad for shoots?",
        a: "Yes. We bring a full production team to Faisalabad for corporate videos, industrial documentaries, exhibitions, and product photography.",
      },
      {
        q: "What do you shoot in Faisalabad?",
        a: "Faisalabad's manufacturing base makes it ideal for documentary and product work — plus exhibitions, factory films, and corporate shoots.",
      },
    ],
    title: "Videographer in Faisalabad | Corporate Video & Coverage — ADPRISM",
    description:
      "ADPRISM provides videography, corporate documentaries, exhibition coverage, and product photography in Faisalabad.",
    headline: "Videography & Corporate Coverage in Faisalabad",
    intro:
      "ADPRISM covers Faisalabad for corporate videos, industrial documentaries, exhibitions, and product photography with a cinematic, brand-first approach.",
    blurb:
      "Faisalabad's industry and manufacturing base makes it a natural fit for our documentary and product work. We bring a complete crew for exhibitions, factory films, and corporate shoots.",
  },
  {
    slug: "peshawar",
    name: "Peshawar",
    region: "Khyber Pakhtunkhwa",
    tier: "secondary",
    faqs: [
      {
        q: "Do you travel to Peshawar for shoots?",
        a: "Yes. We bring a full production team to Peshawar for corporate videos, documentaries, exhibitions, and product photography.",
      },
      {
        q: "What do you shoot in Peshawar?",
        a: "Corporate films, industrial documentaries, exhibitions, events, and product photography for businesses across Peshawar.",
      },
    ],
    title: "Videographer in Peshawar | Corporate Video & Coverage — ADPRISM",
    description:
      "ADPRISM provides videography, corporate documentaries, exhibition coverage, and product photography in Peshawar.",
    headline: "Videography & Corporate Coverage in Peshawar",
    intro:
      "ADPRISM covers Peshawar for corporate videos, documentaries, exhibitions, and product photography with a cinematic, brand-first approach.",
    blurb:
      "From corporate films and documentaries to exhibitions and product shoots, we bring a complete production team to Peshawar with dependable scheduling.",
  },
  {
    slug: "sukkur",
    name: "Sukkur",
    region: "Sindh",
    tier: "secondary",
    faqs: [
      {
        q: "Do you travel to Sukkur for shoots?",
        a: "Yes. We bring a full production team to Sukkur for corporate videos, industrial documentaries, exhibitions, and product photography.",
      },
      {
        q: "What do you shoot in Sukkur?",
        a: "Corporate films, industrial and factory documentaries, exhibitions, events, and product photography for local businesses.",
      },
    ],
    title: "Videographer in Sukkur | Corporate Video & Coverage — ADPRISM",
    description:
      "ADPRISM provides videography, corporate documentaries, exhibition coverage, and product photography in Sukkur.",
    headline: "Videography & Corporate Coverage in Sukkur",
    intro:
      "ADPRISM covers Sukkur for corporate videos, documentaries, exhibitions, and product photography with a cinematic, brand-first approach.",
    blurb:
      "From corporate films and documentaries to exhibitions and product shoots, we bring a complete production team to Sukkur with reliable planning and delivery.",
  },
];

export const getCity = (slug?: string) =>
  CITIES.find((c) => c.slug === slug);
