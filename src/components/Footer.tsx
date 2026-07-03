import { Instagram, Facebook, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { BRAND } from "@/data/content";
import { CITIES } from "@/data/cities";
import WhatsApp from "@/components/icons/WhatsApp";
import { trackWhatsAppClick } from "@/lib/trackWhatsApp";
import logo from "@/assets/adprism-logo.png.asset.json";

// ... keep all your other imports ...

const Footer = () => {
  return (
    <footer className="relative border-t border-border py-12">
      {/* ... keep the CITIES section as is ... */}

      <div className="container flex flex-col items-center justify-between gap-8 md:flex-row">
        <a href="#top" className="flex items-center gap-3">
          {/* UPDATED THIS LINE: */}
          <img src="/adprism-logo.png" alt="ADPRISM logo" className="h-16 w-auto" />
        </a>

        {/* ... keep the social icons and copyright section as is ... */}
      </div>
    </footer>
  );
};

export default Footer;
