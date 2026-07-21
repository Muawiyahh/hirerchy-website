import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client-portal Supabase client — auth-enabled (persisted session), separate
 * from the marketing-site lead client in lib/supabase.ts. Reads the same
 * NEXT_PUBLIC_SUPABASE_* env vars (one project powers leads, the portal, and the
 * extension). RLS restricts each client to their own row.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function portal(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error("Supabase env vars are not set (NEXT_PUBLIC_SUPABASE_*).");
  }
  if (!client) {
    client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "hirerchy-portal-auth",
      },
    });
  }
  return client;
}

export const portalConfigured = Boolean(url && anonKey);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface WorkEntry {
  title?: string; company?: string; location?: string;
  start?: string; end?: string; description?: string;
}
export interface EduEntry {
  school?: string; degree?: string; field?: string;
  start?: string; end?: string; gpa?: string;
}

export interface ClientProfile {
  id: string;
  profile_id?: string | null;
  submitted_at?: string | null;
  first_name?: string; middle_name?: string; last_name?: string;
  email?: string; phone?: string; date_of_birth?: string;
  address_line1?: string; city?: string; state?: string; zip?: string; country?: string;
  linkedin_url?: string; portfolio_url?: string; additional_links?: string;
  summary?: string;
  skills?: string[];
  work_experience?: WorkEntry[];
  education?: EduEntry[];
  is_18_plus?: string; work_authorized?: string; requires_sponsorship?: string;
  visa_type?: string; non_compete?: string; worked_for_government?: string;
  employment_type?: string; work_arrangement?: string; years_experience?: string;
  availability?: string; notice_period?: string; salary_expectation?: string;
  willing_to_relocate?: string; preferred_locations?: string;
  willing_to_travel?: string; travel_percentage?: string; has_drivers_license?: string;
  gender?: string; ethnicity?: string; veteran_status?: string; disability_status?: string;
  resume_url?: string; cover_letter_text?: string; cover_letter_url?: string;
  [key: string]: unknown;
}

export interface AppRow {
  id: string; company: string; role_title?: string; location?: string;
  job_url?: string; source?: string; status: string; applied_at: string; notes?: string;
}

// ── Auth ────────────────────────────────────────────────────────────────────

export async function signUp(email: string, password: string) {
  const { data, error } = await portal().auth.signUp({ email, password });
  if (error) throw error;
  return data;
}
export async function signIn(email: string, password: string) {
  const { data, error } = await portal().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}
export async function signOut() {
  await portal().auth.signOut();
}
export async function getSession() {
  const { data } = await portal().auth.getSession();
  return data.session;
}

// ── Profile ───────────────────────────────────────────────────────────────────

// Get-or-create the logged-in client's own row (RPC bypasses RLS to create/link).
export async function getMyProfile(): Promise<ClientProfile> {
  const { data, error } = await portal().rpc("get_or_create_my_client_profile");
  if (error) throw error;
  return (Array.isArray(data) ? data[0] : data) as ClientProfile;
}

export async function saveProfile(id: string, patch: Partial<ClientProfile>) {
  const { error } = await portal().from("clients").update(patch).eq("id", id);
  if (error) throw error;
}

// ── Storage (resumes bucket, public) ──────────────────────────────────────────

async function uploadTo(folder: string, clientId: string, file: File): Promise<string> {
  const path = folder ? `${folder}/${clientId}/${Date.now()}_${file.name}` : `${clientId}/${file.name}`;
  const { error } = await portal().storage.from("resumes").upload(path, file, {
    upsert: true, contentType: file.type || undefined,
  });
  if (error) throw error;
  return portal().storage.from("resumes").getPublicUrl(path).data.publicUrl;
}
export const uploadResume = (clientId: string, file: File) => uploadTo("", clientId, file);
export const uploadCoverLetter = (clientId: string, file: File) => uploadTo("cover-letters", clientId, file);

// ── Applications (read-only tracker) ─────────────────────────────────────────

export async function getMyApplications(clientId: string): Promise<AppRow[]> {
  const { data, error } = await portal()
    .from("applications")
    .select("*")
    .eq("client_id", clientId)
    .order("applied_at", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as AppRow[];
}

// ZIP → city/state lookup (free, no key). Returns nulls on any failure.
export async function lookupZip(country: string, zip: string, countryCode: string) {
  try {
    let z = zip.trim();
    if (country === "United States") z = z.replace(/\D/g, "").slice(0, 5);
    if (!z || !countryCode) return null;
    const res = await fetch(`https://api.zippopotam.us/${countryCode}/${encodeURIComponent(z)}`);
    if (!res.ok) return null;
    const place = (await res.json())?.places?.[0];
    if (!place) return null;
    return { city: place["place name"] as string | undefined, state: place["state"] as string | undefined };
  } catch {
    return null;
  }
}
