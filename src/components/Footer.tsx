import { Instagram, Facebook, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { BRAND } from "@/data/content";
import { CITIES } from "@/data/cities";
import WhatsApp from "@/components/icons/WhatsApp";
import { trackWhatsAppClick } from "@/lib/trackWhatsApp";
import logo from "@/assets/adprism-logo.png.asset.json";

const Footer = () => {
  return (
    <footer className="relative border-t border-border py-12">
      <div className="container mb-10 text-center">
        <p className="mb-3 text-xs uppercase tracking-widest text-primary">
          Serving across Pakistan
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {CITIES.map((c) => (
            <Link
              key={c.slug}
              to={`/videography-${c.slug}`}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="container flex flex-col items-center justify-between gap-8 md:flex-row">
        <a href="#top" className="flex items-center gap-3">
          <img src={logo.url} alt="ADPRISM logo" className="h-16 w-auto" />
        </a>

        <div className="flex items-center gap-6">
          <a href={BRAND.socials.instagram} aria-label="Instagram" className="text-muted-foreground hover:text-primary">
            <Instagram className="h-5 w-5" />
          </a>
          <a href={BRAND.socials.facebook} aria-label="Facebook" className="text-muted-foreground hover:text-primary">
            <Facebook className="h-5 w-5" />
          </a>
          <a href={BRAND.socials.linkedin} aria-label="LinkedIn" className="text-muted-foreground hover:text-primary">
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href={BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("footer")}
            aria-label="WhatsApp"
            className="text-muted-foreground hover:text-primary"
          >
            <WhatsApp className="h-5 w-5" />
          </a>
        </div>

        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} {BRAND.name}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
