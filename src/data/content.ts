import {
  Video,
  Film,
  Store,
  Package,
  Clapperboard,
  Rotate3d,
  Camera,

} from "lucide-react";
import DroneCamera from "@/components/icons/DroneCamera";

/**
 * Central content file.
 * Swap image imports and video URLs here to replace all placeholder media
 * without touching any layout code.
 */
export const drivePhotoThumb = (id: string, size = 400): string =>
  `https://lh3.googleusercontent.com/d/${id}=w${size}-h${size}-p`;

export const BRAND = {
  name: "ADPRISM",
  owner: "ADPRISM Studio",
  tagline: "NEXT-GENERATION CREATIVE STUDIO",
  email: "adprism2@gmail.com",
  phone: "+92 345 2592084",
  whatsappUrl: "https://wa.me/923452592084",
  location: "Serving across Pakistan",
  socials: {
    instagram: "https://www.instagram.com/adprism.marketing/",
    facebook: "https://www.facebook.com/profile.php?id=61578195896195",
    linkedin: "https://www.linkedin.com/in/ramiz-ahmed-68274497/",
  },
  // Main hero showreel. Supports YouTube/Vimeo embed URLs or a direct .mp4 URL.
  // Leave empty ("") to show the placeholder poster with a play prompt.
  showreelUrl: "https://drive.google.com/file/d/183OK7LyDeWmGGKzHKCcATBHeh9fCzjPc/preview",
};

export const SERVICES = [
  {
    icon: Camera,
    title: "Photography",
    desc: "Professional photography across events, brands, and portraits — sharp, striking imagery crafted with an editorial eye.",
  },
  {
    icon: Video,
    title: "Videography",
    desc: "Cinematic event and brand videography that captures energy, emotion, and detail in motion.",
  },
  {
    icon: Film,
    title: "Corporate Documentary",
    desc: "Story-driven documentaries that give companies a voice and turn milestones into films.",
  },
  {
    icon: Store,
    title: "Exhibition & Stall Coverage",
    desc: "Full trade show and exhibition coverage — booths, keynotes, and the buzz of the floor.",
  },
  {
    icon: Package,
    title: "Product Photography",
    desc: "High-end product imagery with dramatic lighting that makes brands look premium.",
  },
  {
    icon: Clapperboard,
    title: "Filmmaking",
    desc: "End-to-end film production — from concept and direction to the final color-graded cut.",
  },
  {
    icon: DroneCamera,
    title: "Aerial Filming & Drone Coverage",
    desc: "Capture breathtaking overhead shots, sweeping venue views, and cinematic perspectives that elevate your event story. From dynamic aerial footage for exhibitions, corporate events, and promotional reels to immersive 360° panoramas for virtual tours, our drone videography adds scale, drama, and a complete view of your space.",
  },
  {
    icon: Rotate3d,
    title: "360° Virtual Tours",
    desc: "Deliver immersive, interactive panoramas that showcase every angle of your venue, showroom, or event space. Our 360° content lets clients explore environments remotely with a true sense of scale and detail.",
  },
];

export type Category =
  | "All"
  | "Corporate"
  | "Product"
  | "Documentary"
  | "Exhibitions"
  | "Films";

const portfolioModules = import.meta.glob(
  "@/assets/portfolio/*.asset.json",
  { eager: true },
);


const PORTFOLIO_CATEGORIES: Exclude<Category, "All">[] = [
  "Exhibitions",
  "Corporate",
  "Product",
];

export const PORTFOLIO: {
  img: string;
  title: string;
  category: Exclude<Category, "All">;
}[] = Object.entries(portfolioModules)
  .map(([path, mod]) => {
    const url = (mod as { default: { url: string } }).default.url;
    const file = path.split("/").pop() || "";
    // Filenames look like "photo-07.jpg.asset.json" — use the number to
    // spread images evenly across category tabs.
    const num = parseInt(file.replace(/\D/g, ""), 10) || 0;
    const category =
      PORTFOLIO_CATEGORIES[num % PORTFOLIO_CATEGORIES.length];
    const title = `${category} Coverage`;
    return { img: url, title, category };
  });



const filmThumbs = import.meta.glob("@/assets/films/*.asset.json", {
  eager: true,
});
const thumbUrl = (slug: string): string => {
  const key = Object.keys(filmThumbs).find((k) => k.includes(`/${slug}.jpg`));
  return key
    ? (filmThumbs[key] as { default: { url: string } }).default.url
    : "";
};
const driveVideo = (id: string) => `https://drive.google.com/file/d/${id}/preview`;
// Real auto-generated thumbnail straight from the Drive video file.
const driveThumb = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;


export const FILM_CATEGORIES = [
  "Exhibitions",
  "Corporate",
  "Documentaries",
  "Product Launch",
  "Interviews",
  "Solar",
  "Solar Sites",
  "Office & Retail",
] as const;

export const FILMS: {
  img: string;
  url: string;
  title: string;
  meta: string;
  category: string;
  summary?: string;
  credits?: string;
}[] = [
  { category: "Exhibitions", slug: "3p-pakistan", title: "3P Pakistan", meta: "Exhibition Coverage", id: "108_PIZSTbBz4aEB5cmTWwbX2700QJx19" },
  { category: "Exhibitions", slug: "health-asia", title: "Health Asia", meta: "Exhibition Coverage", id: "1mIbvs1GWVWPc4LhQERVUAKnepJSXHTJQ" },
  { category: "Exhibitions", slug: "itcn-2025", title: "ITCN 2025", meta: "Exhibition Coverage", id: "1AQySfMJ0BD5AU0kK1BV2v7WftStiQLR-" },
  { category: "Corporate", slug: "sufi-promo", title: "Sufi Group Promo", meta: "Brand Film", id: "1QFSivEA1WrHcPjPF0ajwe3lVCvZK0O2M" },
  { category: "Corporate", slug: "zindagi-pride", title: "Zindagi Pride", meta: "Corporate Film", id: "1rKypg_d37j5IB64HFISHhHoq7tF4oJdP" },
  { category: "Corporate", slug: "dreams-picnic", title: "Dreams Network Picnic", meta: "Corporate Event", id: "1P6kvZy_YM1BB0lfslF3DQICgdPd8Ts5x" },
  { category: "Documentaries", slug: "aflex-industries", title: "Aflex Industries", meta: "Industrial Documentary", summary: "A behind-the-scenes look at Aflex Industries' manufacturing operations, capturing the scale and precision of their production line.", credits: "Direction, Cinematography & Editing — ADPRISM Studio", id: "1AIoRhruHRD7T-nEwdwJ8mzV20fBffmH1" },
  { category: "Documentaries", slug: "al-momin-2025", title: "Al Momin 2025", meta: "Corporate Documentary", summary: "Al Momin's 2025 corporate story — showcasing the company's vision, people, and milestones across the year.", credits: "Direction, Cinematography & Editing — ADPRISM Studio", id: "183OK7LyDeWmGGKzHKCcATBHeh9fCzjPc" },
  { category: "Documentaries", slug: "al-momin-packages", title: "Al Momin Packages", meta: "Packaging Documentary", summary: "An inside view of Al Momin Packages' facility, highlighting their packaging processes, quality control, and craftsmanship.", credits: "Direction, Cinematography & Editing — ADPRISM Studio", id: "1Fz4D86UG7vahTk9HLgQBcJJLV-CjIMyy" },
  { category: "Documentaries", slug: "atzaa", title: "Atzaa Dispersion", meta: "Industrial Documentary", summary: "Documenting Atzaa Dispersion's industrial capabilities, from raw material handling to finished chemical products.", credits: "Direction, Cinematography & Editing — ADPRISM Studio", id: "1FBGGbstJGuTsOitaKH_yY_FWyIjsi91_" },
  { category: "Documentaries", slug: "ict", title: "ICT Port Qasim", meta: "Facility Documentary", summary: "A facility documentary covering ICT Port Qasim's logistics and terminal operations at one of Pakistan's key ports.", credits: "Direction, Cinematography & Editing — ADPRISM Studio", id: "1RAnr75-zg1R4q1jqIkU1eJApRvAyfCAf" },
  { category: "Documentaries", slug: "sam-industries", title: "Sam Industries", meta: "Industrial Documentary", summary: "An industrial documentary presenting Sam Industries' production strengths, workforce, and manufacturing excellence.", credits: "Direction, Cinematography & Editing — ADPRISM Studio", id: "1TDtgln6SDFpEOzvBGfgvRcXARuPYmZH2" },
  { category: "Documentaries", slug: "super-international", title: "Super International", meta: "Corporate Documentary", summary: "Super International's corporate profile — telling the brand's journey, values, and market presence through film.", credits: "Direction, Cinematography & Editing — ADPRISM Studio", id: "1ZaQIKbLPNO_PwsYABz2WRPP9Gq4KbH1Z" },
  { category: "Product Launch", slug: "byd-diwan", title: "BYD & Diwan International", meta: "Product Launch", id: "12jQmjZBvpZ2eoETLk_qFAWf0wnvMiQ7D" },
  { category: "Product Launch", slug: "byd-shark6", title: "BYD Shark 6", meta: "Product Launch", id: "11f_M2kwpPYwPU4PO7J3ndkoUBMlvGOcF" },
  { category: "Product Launch", slug: "gold-leaf", title: "Gold Leaf", meta: "Product Launch", id: "1lcItx6UDsUaqgbILYcn2x25NIepKYFdL" },
  { category: "Interviews", slug: "habib-metro", title: "Habib Metro Bank", meta: "Corporate Interview", id: "1jTWSvowPNa0u4mLPqs0-Dp_Gm3EFzzfq" },
  { category: "Interviews", slug: "samba-bank", title: "Samba Bank", meta: "Corporate Interview", id: "1dxJtlbRa-0CfQdcsZ-yCzhdNx2inumVW" },
  { category: "Interviews", slug: "tcs", title: "TCS", meta: "Corporate Interview", id: "1VtKa2k_1VNl8fr5WqlZdd7d9bOr4aQGn" },
  { category: "Solar", slug: "fusion-solar", title: "Fusion Solar", meta: "Solar Project", id: "1K3-SRuDq4MXDPNyaMD2F7VWD17vkdNBm" },
  { category: "Solar", slug: "diwan-huawei", title: "Diwan Huawei FSD", meta: "Solar Training", id: "1RlJP71n43cEG6rlouJE0c8oBaqf8r2yt" },
  { category: "Office & Retail", slug: "diwan-isl", title: "Diwan ISL Launch", meta: "Outlet Launch", id: "1JWZFFF8jcr1jeeFh2jB-pbvCxqBstPbZ" },
  { category: "Office & Retail", slug: "karachi-uni", title: "Karachi University", meta: "Campus Coverage", id: "1jJKYPRGP_q7DqOuHJZHLqZ-3IAhpQQF-" },
  { category: "Office & Retail", slug: "match-office", title: "Match Office Karachi", meta: "Office Launch", id: "1z6srBtyHzmTUsgCa4IWcvuoeQJcdNiFH" },
  { category: "Solar Sites", slug: "solarsite-al-asad-rice-mill-diwan-international-pv", title: "Al Asad Rice Mill, Diwan International 250KW Solar System", meta: "Solar Site Project", id: "1A9Se-hkBkqRVy39YdyUrjTMCCGyyUUj3" },
  { category: "Solar Sites", slug: "solarsite-al-hadi-texteile", title: "Al Hadi Textile", meta: "Solar Site Project", id: "1sYMAw3IebFwtMf9M2ZWQTNLOLi9S3N0w" },
  { category: "Solar Sites", slug: "solarsite-banuri-masjid", title: "Banuri Masjid", meta: "Solar Site Project", id: "1AoPdZ4IkJhy6NNlULdB9zIFPlvt5t3oQ" },
  { category: "Solar Sites", slug: "solarsite-combine-spinning-mill-f", title: "Combine Spinning Mill", meta: "Solar Site Project", id: "1fwyl7FaO1oIkXDkAGMbdm4jsqM8zp71s" },
  { category: "Solar Sites", slug: "solarsite-diamond-international", title: "Diamond International", meta: "Solar Site Project", id: "1cKCjj5QgM7yF12O33alzePxScq-AWzQw" },
  { category: "Solar Sites", slug: "solarsite-10-mw-solar-power-project-at-eni-pakista", title: "10 MW Solar Power Project at Eni Pakistan", meta: "Solar Site Project", id: "1ayc9PhH373JwvCO4S3zaR-gA-nobAdLc" },
  { category: "Solar Sites", slug: "solarsite-3-73-mw-solar-power-project-at-g-and-t-g", title: "3.73 MW Solar Power Project at G and T Group", meta: "Solar Site Project", id: "1W0Meo6KFtEqyXyucKMqtx9UhTTX9tmsl" },
  { category: "Solar Sites", slug: "solarsite-ihsan-cotton-products-2", title: "Ihsan Cotton Products", meta: "Solar Site Project", id: "1rZZ3CLA6myrUnnohc9Sr4DG2BoIHfRjm" },
  { category: "Solar Sites", slug: "solarsite-khalid-shafiq-f", title: "Khalid Shafiq", meta: "Solar Site Project", id: "1-aSL6Vv5zFbUYqdZVRa_C0w5tdf10Fg7" },
  { category: "Solar Sites", slug: "solarsite-northstar-f", title: "Northstar", meta: "Solar Site Project", id: "1hT2VSFGs4JPmgrCxux5m1twZzATpT4mV" },
  { category: "Solar Sites", slug: "solarsite-spincot-textile", title: "Spincot Textile", meta: "Solar Site Project", id: "1v1r94BiUC4ixVFinLuqEQAx_Fm17o9YE" },
  { category: "Solar Sites", slug: "solarsite-white-pearl-f", title: "White Pearl", meta: "Solar Site Project", id: "1YkhbK9rpx2NhKsKHzvJqi_gJAd307m_I" },
].map((f) => ({
  img: thumbUrl(f.slug) || driveThumb(f.id),
  url: driveVideo(f.id),
  title: f.title,
  meta: f.meta,
  category: f.category,
  summary: (f as { summary?: string }).summary,
  credits: (f as { credits?: string }).credits,
}));


// Exhibitions & events covered on the floor. Each links to its Drive video.
const exhThumbs = import.meta.glob("@/assets/exhibitions/*.asset.json", {
  eager: true,
});
const exhThumb = (slug: string): string => {
  const key = Object.keys(exhThumbs).find((k) => k.includes(`/${slug}.jpg`));
  return key
    ? (exhThumbs[key] as { default: { url: string } }).default.url
    : "";
};

export const EXHIBITIONS: {
  name: string;
  img: string;
  url: string;
  caption: string;
}[] = [
  { name: "3P Pakistan", slug: "exh-3p-pakistan", id: "108_PIZSTbBz4aEB5cmTWwbX2700QJx19", caption: "Trade show booth walkthrough & brand highlights" },
  { name: "Ambiance Hotel", slug: "exh-ambiance-hotel", id: "1tzV6zcIPLTL58ric59RMj41GKG_9cKvC", caption: "Hospitality stall coverage & guest experience" },
  { name: "Angel Yeast", slug: "exh-angel-yeast", id: "1pX-70mnqrBjbktSky9YovqyLWOBPxEhJ", caption: "Product showcase & live booth activation" },
  { name: "Ashraf Group", slug: "exh-ashraf-group", id: "1M_O_Lu73yZinNUxDBkBU_Mj1CpVYIujb", caption: "Corporate exhibition presence & networking" },
  { name: "Azarbaijan Booth", slug: "exh-azarbaijan-booth", id: "1VUBYNzg-vaOuR-zo33kuoybmzrrV7ZBy", caption: "International pavilion coverage" },
  { name: "Dulzer", slug: "exh-dulzer", id: "13xxSIceiy3ZY6iqnewLjUgX8t_jGdVHZ", caption: "Brand stall reel & product display" },
  { name: "FEI 2026 IFTECH", slug: "exh-fei-2026-iftech", id: "1W7XgkDGy9GtQzuuse5Q0s1Vrqkqc3C6C", caption: "IFTECH expo booth highlights" },
  { name: "Food Agri 2025", slug: "exh-food-agri-2025", id: "1iNtpF2GbjjBCkNtdXuE8Zg1LRryJ7w_x", caption: "Food & agriculture expo coverage" },
  { name: "Gold Packages", slug: "exh-gold-packages", id: "1UGyLfm7TiEkTRYuDIlPHl_BP6lrSqtZ5", caption: "Packaging brand stall showcase" },
  { name: "Graceware", slug: "exh-graceware", id: "1cUgcM9HdLh1ujlEHJfxbSpTUrC-j6BRy", caption: "Product display & booth activation" },
  { name: "Health Asia - DREAMS", slug: "exh-health-asia-dreams", id: "1mIbvs1GWVWPc4LhQERVUAKnepJSXHTJQ", caption: "Healthcare expo booth coverage" },
  { name: "HVACR 2025", slug: "exh-hvacr-2025", id: "188Dg_mHdyG7TkqEz09xV8jeNWzqWXT-Q", caption: "HVACR industry expo highlights" },
  { name: "HVACR 2026", slug: "exh-hvacr-2026", id: "1Q_bBCWSMoJ4sVFcxH9QLwxOuaQcwmkOF", caption: "HVACR industry expo highlights" },
  { name: "IAPEX 2026", slug: "exh-iapex-2026", id: "1mnmWuWCaVtgLrzeuEm1-w6Da3TnL7JaH", caption: "Auto parts expo booth reel" },
  { name: "ITCN 2025 DREAMS", slug: "exh-itcn-2025-dreams-network", id: "1AQySfMJ0BD5AU0kK1BV2v7WftStiQLR-", caption: "Tech & IT expo booth coverage" },
  { name: "ITCN 2026 LHR", slug: "exh-itcn-2026-lhr", id: "1DjKKPqH2HwjvBQJUrynwsONoEueubERc", caption: "Tech expo Lahore booth highlights" },
  { name: "Malaysia Booth", slug: "exh-malaysia-booth", id: "1nDStLiHhqInCgFarLCIGQAYFElt4ctzE", caption: "International pavilion coverage" },
  { name: "Mars Power Solutions", slug: "exh-mars-power-solutions", id: "1WyBBCiVD9cT1JuGUSZtRTW4l9-VyT_hL", caption: "Energy solutions booth showcase" },
  { name: "Nippon Energy KHI", slug: "exh-nippon-energy-khi", id: "1BDmM47UrBw7pHLPr6FjTBazb8UCM4xiF", caption: "Energy expo Karachi booth reel" },
  { name: "Nippon Energy MUX", slug: "exh-nippon-energy-mux", id: "1bwCwQdYSI2T3BTqmRndBsdoaTpFNKhAG", caption: "Energy expo Multan booth reel" },
  { name: "Pak Energy", slug: "exh-pak-energy", id: "1dCdbd-VoTJxTk0ci6dXjYKcs-gpQPXr9", caption: "Energy sector stall coverage" },
  { name: "PIMEC 2025", slug: "exh-pimec-2025", id: "18ZH5C6_KB3kPlQ03Et_v-LQrY-0WwyTd", caption: "Marine & engineering expo highlights" },
  { name: "Power House", slug: "exh-power-house", id: "1LE2Bn8mrGR5glLrLUneaDOhtG2jCNDNz", caption: "Power solutions booth showcase" },
  { name: "Pro Fabrication", slug: "exh-pro-fabrication", id: "1i09dm5jqlDgWNWM2CbVptognWJb3_jK7", caption: "Industrial fabrication stall reel" },
  { name: "PTM 2026", slug: "exh-ptm-2026", id: "1NsDHIEV_l0XeWUzMkSMBU8i_cSeqyT_T", caption: "Textile machinery expo coverage" },
  { name: "Reon Energy", slug: "exh-reon-energy", id: "1mkqzWCNqujU28OTaVd6XB2Be9WUsAMvI", caption: "Solar & energy booth showcase" },
  { name: "Solar Citizen", slug: "exh-solar-citizen", id: "1Us1j51_3ZnrbefEakj6c-vn2BtP1aNEX", caption: "Solar brand stall activation" },
  { name: "Solis Pakistan", slug: "exh-solis-pakistan", id: "1XVDhUtlYDnCITIYruSKyMz7ySSYXW_z6", caption: "Solar inverter booth showcase" },
  { name: "Super International", slug: "exh-super-international", id: "1CylrCqPY3U4JLbwNk5ODliSiDVkvYzkg", caption: "Corporate exhibition coverage" },
  { name: "TMI 3P 2025", slug: "exh-tmi-3p-2025", id: "1yUV3Lhr0s-f5DjtW-6vjg4AnrF-6i5vL", caption: "Industrial expo booth highlights" },
  { name: "TMI 2026 IFTECH", slug: "exh-tmi-2026-iftech", id: "1IXBhhvRp4Ne9MFcSEEAx8lNFp48QYoSV", caption: "IFTECH expo booth reel" },
  { name: "Universal Cables", slug: "exh-universal-cables", id: "18X-VljZaoDnny8II-QKR60sv9VyYrOou", caption: "Cable manufacturer stall showcase" },
  { name: "Urooj Plastic", slug: "exh-urooj-plastic", id: "1uJyR9mQd15eRKa3K4S-IMuxfnggtbdwZ", caption: "Plastics industry booth coverage" },
].map((e) => ({
  name: e.name,
  img: exhThumb(e.slug) || driveThumb(e.id),
  url: driveVideo(e.id),
  caption: e.caption,
}));


export const TESTIMONIALS = [
  {
    quote:
      "The brand film they produced captured our vision perfectly. Every frame felt intentional and cinematic.",
    name: "Sana Malik",
    role: "Brand Manager, Lumen Co.",
    tag: "Brand Film",
  },
  {
    quote:
      "Our corporate documentary reshaped how the market sees us. Professional, patient, and wildly talented.",
    name: "Priya Nair",
    role: "Marketing Director, Novatek",
    tag: "Corporate Documentary",
  },
  {
    quote:
      "The exhibition coverage was flawless — the highlight reel drove real leads to our booth for weeks.",
    name: "Daniel Okoro",
    role: "Events Lead, Expo Group",
    tag: "Exhibition Coverage",
  },
];

// Video testimonials sourced from the "CLIENT TESTIMONIALS" Drive folder.
import iftechThumb from "@/assets/testimonial-iftech.jpg.asset.json";

export const VIDEO_TESTIMONIALS = [
  {
    name: "Far Eastern Impex",
    role: "IFTECH Exhibition",
    tag: "Exhibition Coverage",
    poster: iftechThumb.url,
    url: "https://drive.google.com/file/d/1SZt8AUFruWF-YfghvuNLMDrllLEkOyxs/preview",
    transcript:
      "ADPRISM captured our IFTECH exhibition booth beautifully. The team was professional, understood our brand, and delivered a highlight film that showcased our products and the energy of the event. We received great feedback from clients and would gladly work with them again.",
  },

];



