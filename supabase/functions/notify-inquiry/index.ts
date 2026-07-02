import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";
const NOTIFY_TO = "adprism2@gmail.com";

const BodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  service: z.string().trim().max(120).nullish(),
  budget: z.string().trim().max(60).nullish(),
  projectDate: z.string().trim().max(20).nullish(),
  message: z.string().trim().max(1000).nullish(),
});

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildRawEmail(to: string, subject: string, html: string): string {
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    html,
  ].join("\r\n");
  return base64UrlEncode(message);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GOOGLE_MAIL_API_KEY = Deno.env.get("GOOGLE_MAIL_API_KEY");
    if (!LOVABLE_API_KEY || !GOOGLE_MAIL_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Email connection is not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { name, email, service, budget, projectDate, message } = parsed.data;

    const row = (label: string, value?: string | null) =>
      value
        ? `<tr><td style="padding:6px 12px;font-weight:600;color:#0b3d2e;">${label}</td><td style="padding:6px 12px;color:#111;">${value}</td></tr>`
        : "";

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6f5;padding:24px;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8e5;">
          <div style="background:#062b20;color:#34d399;padding:20px 24px;font-size:18px;font-weight:700;letter-spacing:1px;">
            ADPRISM — New Contact Inquiry
          </div>
          <div style="padding:20px 24px;">
            <p style="margin:0 0 14px;color:#334155;">You received a new inquiry from your website:</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              ${row("Name", name)}
              ${row("Email", email)}
              ${row("Service", service)}
              ${row("Budget", budget)}
              ${row("Project date", projectDate)}
              ${row("Message", message)}
            </table>
            <p style="margin:20px 0 0;font-size:12px;color:#94a3b8;">Reply directly to ${email} to respond.</p>
          </div>
        </div>
      </div>`;

    const raw = buildRawEmail(NOTIFY_TO, `New inquiry from ${name}`, html);

    const res = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_MAIL_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Gmail send failed:", res.status, text);
      return new Response(
        JSON.stringify({ error: `Gmail send failed: ${res.status}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("notify-inquiry error:", err);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
