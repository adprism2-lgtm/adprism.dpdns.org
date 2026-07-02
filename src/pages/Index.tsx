import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Films from "@/components/Films";
import Exhibitions from "@/components/Exhibitions";
import Testimonials from "@/components/Testimonials";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { BRAND } from "@/data/content";

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: BRAND.name,
    description:
      "Videography, corporate documentary, exhibition coverage, product photography and filmmaking.",
    email: BRAND.email,
    telephone: BRAND.phone,
    areaServed: ["Karachi", "Lahore", "Islamabad", "Multan", "Faisalabad", "Pakistan"],
  };


  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="ADPRISM — Futuristic Photography & Videography Studio"
        description="ADPRISM crafts next-generation visuals: videography, corporate documentaries, exhibition coverage, product photography, drone coverage, and filmmaking."
        path="/"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Exhibitions />
        <Films />
        <About />
        <Clients />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
