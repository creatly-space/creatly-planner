// /api/intake.js — Vercel serverless function
// Handles brief intake form submissions: parses with Claude, creates client + notification in Supabase

const SUPABASE_URL = "https://wkmjyzrkrquuiazomiwz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWp5enJrcnF1dWlhem9taXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDQ3MzAsImV4cCI6MjA4ODQ4MDczMH0.C1rvG9KPo2XGrN35VSyartPuZwlvrxBjpeDwUQ7_xms";

async function sbInsert(table, row) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Prefer": "return=representation",
    },
    body: JSON.stringify(row),
  });
  return res.json();
}

export default async function handler(req, res) {
  // CORS — allow the intake page to POST from anywhere
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { brand_name, contact_name, contact_email, industry, brief, tone_checkboxes, audience, references, extra } = req.body;

    if (!brand_name?.trim()) return res.status(400).json({ error: "Brand name is required" });

    // --- Ask Claude to extract structured brand context from the form data ---
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are parsing a client brief intake form for Creatly, an AI creative bureau. Extract structured brand context from this submission and return ONLY valid JSON with these exact keys: tone_of_voice, guidelines, preferences, kit_learnings.

Form data:
- Brand: ${brand_name}
- Industry: ${industry || "not specified"}
- Brief / What they need: ${brief || "not specified"}
- Tone checkboxes selected: ${tone_checkboxes?.join(", ") || "not specified"}
- Target audience: ${audience || "not specified"}
- Brand references / inspiration: ${references || "not specified"}
- Extra notes: ${extra || "none"}

Return ONLY a JSON object, no markdown, no explanation:
{
  "tone_of_voice": "synthesized tone description based on their checkboxes and brief",
  "guidelines": "key brand rules and messaging direction inferred from the brief",
  "preferences": "preferred content formats, platforms, and audience insights",
  "kit_learnings": "first-submission note — what this client is looking for and any standout details to remember"
}`
        }],
      }),
    });

    const aiData = await anthropicRes.json();
    let brandContext = { tone_of_voice: "", guidelines: "", preferences: "", kit_learnings: "" };
    try {
      const raw = aiData.content?.[0]?.text || "{}";
      brandContext = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch (e) {
      console.error("Failed to parse AI brand context:", e);
    }

    // --- Create client record ---
    const clientId = crypto.randomUUID();
    await sbInsert("clients", {
      id: clientId,
      name: brand_name.trim(),
      contact_name: contact_name?.trim() || null,
      contact_email: contact_email?.trim() || null,
      industry: industry?.trim() || null,
      brand_context: {
        tone_of_voice: brandContext.tone_of_voice || "",
        guidelines: brandContext.guidelines || "",
        preferences: brandContext.preferences || "",
        learnings: brandContext.kit_learnings || "",
      },
      notes: `Brief: ${brief || ""}${references ? `\n\nReferences: ${references}` : ""}${extra ? `\n\nExtra: ${extra}` : ""}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // --- Create notification ---
    await sbInsert("notifications", {
      id: crypto.randomUUID(),
      type: "intake",
      title: `New brief from ${brand_name.trim()}`,
      body: `${contact_name ? contact_name + " · " : ""}${contact_email || ""}${industry ? " · " + industry : ""}`,
      meta: { client_id: clientId, contact_email: contact_email || null },
      read_ludvig: false,
      read_johannes: false,
      created_at: new Date().toISOString(),
    });

    return res.status(200).json({ ok: true, client_id: clientId });
  } catch (err) {
    console.error("Intake error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
