import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EXHIBITIONS as STATIC_EXHIBITIONS } from "@/data/content";

export type ExhibitionItem = {
  name: string;
  img: string;
  url: string;
  caption?: string;
};

/**
 * Loads exhibitions from the database (populated by the Drive sync).
 * Falls back to the bundled static list until the first sync has run.
 */
export const useExhibitions = () => {
  const [items, setItems] = useState<ExhibitionItem[]>(STATIC_EXHIBITIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("exhibitions")
        .select("name, video_url, thumbnail_url")
        .order("sort_order", { ascending: true });
      if (!active) return;
      if (!error && data && data.length > 0) {
        setItems(
          data.map((e) => ({
            name: e.name,
            img: e.thumbnail_url ?? "",
            url: e.video_url,
          })),
        );
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { items, loading };
};
