import { useState } from "react";
import { z } from "zod";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  role: z.string().trim().max(120).optional(),
  quote: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters")
    .max(1000, "Please keep it under 1000 characters"),
  rating: z.number().min(1).max(5),
});

const TestimonialForm = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName("");
    setRole("");
    setQuote("");
    setRating(5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, role, quote, rating });
    if (!parsed.success) {
      toast({
        title: "Please check the form",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("testimonials").insert({
      name: parsed.data.name,
      role: parsed.data.role || null,
      quote: parsed.data.quote,
      rating: parsed.data.rating,
      status: "pending",
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: "Something went wrong",
        description: "Your testimonial could not be submitted. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thank you!",
      description: "Your testimonial was submitted and will appear once approved.",
    });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          Share your experience
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your experience</DialogTitle>
          <DialogDescription>
            Tell us about working together. Submissions are reviewed before they
            go live.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="t-name">Name</Label>
            <Input
              id="t-name"
              value={name}
              maxLength={100}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="t-role">Role / Company (optional)</Label>
            <Input
              id="t-role"
              value={role}
              maxLength={120}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Marketing Director, Novatek"
            />
          </div>
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      (hover || rating) >= n
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="t-quote">Your testimonial</Label>
            <Textarea
              id="t-quote"
              value={quote}
              maxLength={1000}
              rows={4}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="What was your experience like?"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit testimonial"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialForm;
