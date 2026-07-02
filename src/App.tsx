import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminInquiries from "./pages/AdminInquiries";
import Gallery from "./pages/Gallery";
import Reel from "./pages/Reel";
import CityLanding from "./pages/CityLanding";
import NotFound from "./pages/NotFound";
import WhatsAppCTA from "./components/WhatsAppCTA";
import { CITIES } from "./data/cities";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reel" element={<Reel />} />
          {CITIES.map((c) => (
            <Route
              key={c.slug}
              path={`/videography-${c.slug}`}
              element={<CityLanding slug={c.slug} />}
            />
          ))}
          {CITIES.filter((c) => c.photography).map((c) => (
            <Route
              key={`photography-${c.slug}`}
              path={`/photography-${c.slug}`}
              element={<CityLanding slug={c.slug} service="photography" />}
            />
          ))}
          <Route path="/admin/testimonials" element={<AdminTestimonials />} />
          <Route path="/admin/inquiries" element={<AdminInquiries />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppCTA />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
