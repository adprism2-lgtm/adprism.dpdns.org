import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Star, LogOut, Check, X, Trash2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";


type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  rating: number | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const TABS: { key: Testimonial["status"]; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const AdminTestimonials = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<Testimonial["status"]>("pending");
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const syncExhibitions = async () => {
    setSyncing(true);
    const { data, error } = await supabase.functions.invoke("sync-exhibitions");
    setSyncing(false);
    if (error) {
      toast({
        title: "Sync failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    if ((data as { error?: string })?.error) {
      toast({
        title: "Sync failed",
        description: (data as { error: string }).error,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Exhibitions synced",
      description: `${(data as { count: number }).count} videos pulled from Drive.`,
    });
  };


  const load = useCallback(async (status: Testimonial["status"]) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast({ title: "Could not load", description: error.message, variant: "destructive" });
      return;
    }
    setItems((data as Testimonial[]) ?? []);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/auth");
        return;
      }
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!roleData);
      setReady(true);
    };
    init();
  }, [navigate]);

  useEffect(() => {
    if (ready && isAdmin) load(tab);
  }, [ready, isAdmin, tab, load]);

  const moderate = async (id: string, status: Testimonial["status"]) => {
    const { error } = await supabase
      .from("testimonials")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setItems((prev) => prev.filter((t) => t.id !== id));
    toast({ title: `Marked as ${status}` });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    setItems((prev) => prev.filter((t) => t.id !== id));
    toast({ title: "Deleted" });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <h1 className="font-display text-2xl font-semibold">No admin access</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Your account isn't assigned the admin role yet. Ask a site owner to
          grant your account admin access to moderate testimonials.
        </p>
        <Button variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">Testimonials</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review and moderate client submissions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={syncExhibitions} disabled={syncing}>
              <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing…" : "Sync exhibitions from Drive"}
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>

        </div>

        <div className="mt-8 flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground">No {tab} testimonials.</p>
          ) : (
            items.map((t) => (
              <div
                key={t.id}
                className="rounded-lg border border-border bg-card p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-lg">{t.name}</p>
                    {t.role && (
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {t.role}
                      </p>
                    )}
                  </div>
                  {t.rating ? (
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating }).map((_, s) => (
                        <Star key={s} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  ) : null}
                </div>
                <p className="mt-4 leading-relaxed text-foreground/90">"{t.quote}"</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {tab !== "approved" && (
                    <Button size="sm" onClick={() => moderate(t.id, "approved")}>
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                  )}
                  {tab !== "rejected" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => moderate(t.id, "rejected")}
                    >
                      <X className="h-4 w-4" /> Reject
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => remove(t.id)}
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTestimonials;
