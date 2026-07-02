import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const GATEWAY = "https://connector-gateway.lovable.dev/google_drive/drive/v3";

// The exhibitions parent folder in the studio's Google Drive.
const EXHIBITIONS_FOLDER_ID = "1ZMOsV89hL11AWOh7AYUowdi35DB2TjSo";

const VIDEO_MIME = "video/";
const FOLDER_MIME = "application/vnd.google-apps.folder";

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
};

async function driveList(params: Record<string, string>): Promise<DriveFile[]> {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const driveKey = Deno.env.get("GOOGLE_DRIVE_API_KEY");
  if (!lovableKey || !driveKey) {
    throw new Error(
      "Google Drive is not connected. Link the Google Drive connector first.",
    );
  }

  const files: DriveFile[] = [];
  let pageToken: string | undefined;
  do {
    const qs = new URLSearchParams({
      ...params,
      fields: "nextPageToken, files(id,name,mimeType,thumbnailLink)",
      pageSize: "1000",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true",
      ...(pageToken ? { pageToken } : {}),
    });
    const res = await fetch(`${GATEWAY}/files?${qs}`, {
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": driveKey,
      },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Drive API error ${res.status}: ${body}`);
    }
    const data = await res.json();
    files.push(...(data.files ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);
  return files;
}

const thumbFor = (file: DriveFile) =>
  file.thumbnailLink ||
  `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify the caller is an authenticated admin.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabase.auth.getUser(token);
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Collect exhibition videos. Each project may be a subfolder containing a
    // video, or a video file placed directly in the parent folder.
    const children = await driveList({
      q: `'${EXHIBITIONS_FOLDER_ID}' in parents and trashed = false`,
    });

    const rows: {
      name: string;
      drive_file_id: string;
      video_url: string;
      thumbnail_url: string;
      sort_order: number;
    }[] = [];

    let order = 0;
    for (const child of children) {
      if (child.mimeType === FOLDER_MIME) {
        // Find the first video inside this project subfolder.
        const inner = await driveList({
          q: `'${child.id}' in parents and trashed = false`,
        });
        const video = inner.find((f) => f.mimeType.startsWith(VIDEO_MIME));
        if (video) {
          rows.push({
            name: child.name,
            drive_file_id: video.id,
            video_url: `https://drive.google.com/file/d/${video.id}/preview`,
            thumbnail_url: thumbFor(video),
            sort_order: order++,
          });
        }
      } else if (child.mimeType.startsWith(VIDEO_MIME)) {
        rows.push({
          name: child.name.replace(/\.[^.]+$/, ""),
          drive_file_id: child.id,
          video_url: `https://drive.google.com/file/d/${child.id}/preview`,
          thumbnail_url: thumbFor(child),
          sort_order: order++,
        });
      }
    }

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "No videos found in the Drive folder." }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Upsert on drive_file_id so re-syncing updates instead of duplicating.
    const { error: upsertError } = await supabase
      .from("exhibitions")
      .upsert(
        rows.map((r) => ({ ...r, synced_at: new Date().toISOString() })),
        { onConflict: "drive_file_id" },
      );
    if (upsertError) throw upsertError;

    // Remove exhibitions that no longer exist in the Drive folder.
    const keepIds = rows.map((r) => r.drive_file_id);
    const { error: deleteError } = await supabase
      .from("exhibitions")
      .delete()
      .not("drive_file_id", "in", `(${keepIds.map((id) => `"${id}"`).join(",")})`);
    if (deleteError) throw deleteError;

    return new Response(
      JSON.stringify({ success: true, count: rows.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("sync-exhibitions error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
