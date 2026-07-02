import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash2, Mail, Phone, Calendar, DollarSign, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  service: string | null;
  budget: string | null;
  project_date: string | null;
  message: string | null;
  created_at: string;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const AdminInquiries = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast({ title: "Could not load", description: error.message, variant: "destructive" });
      return;
    }
    setItems((data as Inquiry[]) ?? []);
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
    if (ready && isAdmin) load();
  }, [ready, isAdmin, load]);

  const remove = async (id: string) => {
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
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
          grant your account admin access to view inquiries.
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
            <h1 className="font-display text-3xl font-semibold">Inquiries</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {items.length} contact {items.length === 1 ? "submission" : "submissions"} received.
            </p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>

        <div className="mt-8 space-y-4">
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground">No inquiries yet.</p>
          ) : (
            items.map((t) => (
              <div key={t.id} className="rounded-lg border border-border bg-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-lg">{t.name}</p>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {formatDate(t.created_at)}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => remove(t.id)}>
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-foreground/90 sm:grid-cols-2">
                  <a
                    href={`mailto:${t.email}`}
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    <Mail className="h-4 w-4 text-primary" /> {t.email}
                  </a>
                  {t.service && (
                    <p className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" /> {t.service}
                    </p>
                  )}
                  {t.budget && (
                    <p className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" /> {t.budget}
                    </p>
                  )}
                  {t.project_date && (
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" /> {t.project_date}
                    </p>
                  )}
                </div>

                {t.message && (
                  <p className="mt-4 whitespace-pre-wrap leading-relaxed text-foreground/90">
                    {t.message}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInquiries;
