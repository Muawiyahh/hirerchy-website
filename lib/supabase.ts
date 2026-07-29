import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client for the marketing site.
 *
 * Only used to INSERT into the `leads` table (resume-review + contact form
 * submissions). The anon key is safe to expose — row-level security on `leads`
 * allows anonymous inserts only, with no read access (see supabase/leads.sql).
 *
 * Set these in `.env.local` (and in your Vercel/Netlify project env):
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!client) {
    client = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}

export const supabaseConfigured = Boolean(url && anonKey);

export type LeadType = "resume_review" | "contact";

export interface LeadInput {
  type: LeadType;
  name?: string;
  email?: string;
  phone?: string;
  target_role?: string;
  linkedin_url?: string;
  resume_url?: string;
  message?: string;
}

/**
 * Insert a lead. Returns `{ ok: true }` on success or `{ ok: false, error }`.
 * If Supabase env vars are missing (e.g. local dev without a key) it returns a
 * clear, non-throwing result so forms degrade gracefully.
 */
export async function submitLead(
  lead: LeadInput
): Promise<{ ok: boolean; error?: string }> {
  const sb = getSupabase();
  if (!sb) {
    return {
      ok: false,
      error:
        "Form is not connected yet. Add your Supabase keys to .env.local to enable submissions.",
    };
  }
  const { error } = await sb.from("leads").insert({ source: "website", ...lead });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
