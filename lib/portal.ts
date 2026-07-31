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

// ── Roles & pipeline ──────────────────────────────────────────────────────────

export type Role = "owner" | "employee" | "client";

export const CLIENT_STATUSES = [
  "Submitted", "In Review", "Contacted", "Payment Pending", "Active", "Completed", "Halted",
] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export const UPDATE_KINDS = ["Completed", "Facing an Issue", "Pending", "Other"] as const;
export type UpdateKind = (typeof UPDATE_KINDS)[number];

/** A client row as the staff dashboards need it — the pipeline fields only. */
export interface ClientRow {
  id: string;
  profile_id?: string | null;
  first_name?: string;
  last_name?: string;
  email?: string;
  status: ClientStatus;
  plan?: string | null;
  weeks_total: number;
  weeks_completed: number;
  submitted_at?: string | null;
  created_at?: string;
}

export interface MessageRow {
  id: string;
  client_id: string;
  sender_role: "client" | "owner";
  sender_id?: string | null;
  body: string;
  read_at?: string | null;
  created_at: string;
}

export interface EmployeeUpdateRow {
  id: string;
  client_id: string;
  employee_id: string;
  kind: UpdateKind;
  note?: string | null;
  acknowledged_at?: string | null;
  created_at: string;
}

export interface StaffRow {
  id: string;
  email: string;
  role: Role;
}

export interface AssignmentRow {
  id: string;
  client_id: string;
  employee_id: string;
}

const CLIENT_COLS =
  "id,profile_id,first_name,last_name,email,status,plan,weeks_total,weeks_completed,submitted_at,created_at";

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

/** Which dashboard this user gets. Defaults to "client" — the sign-up trigger
 *  creates every new profile as a client, so a missing row is never staff. */
export async function getMyRole(): Promise<Role> {
  const { data: sess } = await portal().auth.getSession();
  const uid = sess.session?.user.id;
  if (!uid) return "client";
  const { data, error } = await portal()
    .from("profiles").select("role").eq("id", uid).maybeSingle();
  if (error || !data?.role) return "client";
  return data.role as Role;
}

// ── Staff: clients ────────────────────────────────────────────────────────────
// RLS decides the rows: an owner sees every client, an employee only the ones
// assigned to them. The same query serves both dashboards.

export async function getStaffClients(): Promise<ClientRow[]> {
  const { data, error } = await portal()
    .from("clients").select(CLIENT_COLS).order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as ClientRow[];
}

export async function getClientById(id: string): Promise<ClientRow> {
  const { data, error } = await portal()
    .from("clients").select(CLIENT_COLS).eq("id", id).single();
  if (error) throw error;
  return data as ClientRow;
}

export async function updateClientPipeline(
  id: string,
  patch: Partial<Pick<ClientRow, "status" | "plan" | "weeks_total" | "weeks_completed">>
) {
  const { error } = await portal().from("clients").update(patch).eq("id", id);
  if (error) throw error;
}

/** +1 (or -1) on the week counter, clamped server-side against weeks_total. */
export async function bumpClientWeek(id: string, delta = 1): Promise<ClientRow> {
  const { data, error } = await portal().rpc("bump_client_week", { target: id, delta });
  if (error) throw error;
  return (Array.isArray(data) ? data[0] : data) as ClientRow;
}

// ── Staff: employees & assignments ────────────────────────────────────────────

export async function listStaff(): Promise<StaffRow[]> {
  const { data, error } = await portal().rpc("list_staff");
  if (error) throw error;
  return (data || []) as StaffRow[];
}

export async function deleteStaff(userId: string) {
  const { error } = await portal().rpc("admin_delete_user", { target: userId });
  if (error) throw error;
}

/** Creates the auth user, then promotes the fresh profile row to 'employee'.
 *  Signing up swaps the current session, so the caller's session is restored
 *  from the token pair we capture first. */
export async function createEmployee(email: string, password: string) {
  const sb = portal();
  const { data: current } = await sb.auth.getSession();
  const keep = current.session;

  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) throw error;
  const newId = data.user?.id;

  if (keep) {
    await sb.auth.setSession({
      access_token: keep.access_token,
      refresh_token: keep.refresh_token,
    });
  }
  if (!newId) throw new Error("Account created but no user id came back.");

  const { error: roleErr } = await sb.from("profiles")
    .update({ role: "employee", email }).eq("id", newId);
  if (roleErr) throw roleErr;
  return newId;
}

export async function getAssignments(): Promise<AssignmentRow[]> {
  const { data, error } = await portal()
    .from("client_assignments").select("id,client_id,employee_id");
  if (error) throw error;
  return (data || []) as AssignmentRow[];
}

export async function assignClient(clientId: string, employeeId: string | null) {
  const sb = portal();
  const { error: delErr } = await sb.from("client_assignments").delete().eq("client_id", clientId);
  if (delErr) throw delErr;
  if (!employeeId) return;
  const { error } = await sb.from("client_assignments")
    .insert({ client_id: clientId, employee_id: employeeId });
  if (error) throw error;
}

// ── Messages (client ⇄ manager) ───────────────────────────────────────────────

export async function getMessages(clientId: string): Promise<MessageRow[]> {
  const { data, error } = await portal()
    .from("messages").select("*").eq("client_id", clientId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []) as MessageRow[];
}

export async function getAllMessages(): Promise<MessageRow[]> {
  const { data, error } = await portal()
    .from("messages").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []) as MessageRow[];
}

export async function sendMessage(
  clientId: string,
  body: string,
  senderRole: "client" | "owner"
) {
  const { data: sess } = await portal().auth.getSession();
  const { error } = await portal().from("messages").insert({
    client_id: clientId,
    body: body.trim(),
    sender_role: senderRole,
    sender_id: sess.session?.user.id ?? null,
  });
  if (error) throw error;
}

// ── Employee → manager updates ────────────────────────────────────────────────

export async function getEmployeeUpdates(): Promise<EmployeeUpdateRow[]> {
  const { data, error } = await portal()
    .from("employee_updates").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as EmployeeUpdateRow[];
}

export async function sendEmployeeUpdate(clientId: string, kind: UpdateKind, note?: string) {
  const { data: sess } = await portal().auth.getSession();
  const uid = sess.session?.user.id;
  if (!uid) throw new Error("Not signed in.");
  const { error } = await portal().from("employee_updates").insert({
    client_id: clientId, employee_id: uid, kind, note: note?.trim() || null,
  });
  if (error) throw error;
}

export async function acknowledgeUpdate(id: string) {
  const { error } = await portal()
    .from("employee_updates").update({ acknowledged_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
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
