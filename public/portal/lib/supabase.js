// Replace these two values after creating your Supabase project.
// Dashboard > Settings > API > Project URL & anon/public key
export const SUPABASE_URL = 'https://ldsenbixipybcufoyqni.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxkc2VuYml4aXB5YmN1Zm95cW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0Mzk5MjMsImV4cCI6MjA5NTAxNTkyM30.Gsol8dbWCFE6eWSwmGZP2emSVwQoQPeP728JsLTXOzQ';

const headers = (token) => ({
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${token || SUPABASE_ANON_KEY}`,
});

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function signIn(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Sign-in failed');
  return data; // { access_token, refresh_token, user, ... }
}

export async function signUp(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || data.msg || data.error || 'Sign-up failed');
  }
  return data; // may include a session if email confirmation is disabled
}

export async function signOut(accessToken) {
  await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
    method: 'POST',
    headers: headers(accessToken),
  });
}

export async function refreshSession(refreshToken) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Session refresh failed');
  return data;
}

// ── Shared option lists (US-focused) ──────────────────────────────────────────

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
  'Puerto Rico',
];

export const COUNTRIES = [
  'United States', 'Canada', 'Mexico', 'United Kingdom', 'Ireland', 'India',
  'China', 'Philippines', 'Pakistan', 'Bangladesh', 'Nigeria', 'Brazil',
  'Colombia', 'Argentina', 'Germany', 'France', 'Spain', 'Italy', 'Poland',
  'Ukraine', 'Russia', 'Australia', 'New Zealand', 'Japan', 'South Korea',
  'Vietnam', 'Indonesia', 'Malaysia', 'Singapore', 'Thailand', 'Nepal',
  'Sri Lanka', 'South Africa', 'Kenya', 'Egypt', 'Ghana', 'Ethiopia',
  'Saudi Arabia', 'United Arab Emirates', 'Israel', 'Turkey', 'Iran',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Portugal', 'Greece',
  'Romania', 'Venezuela', 'Peru', 'Chile', 'Ecuador', 'Guatemala',
  'Dominican Republic', 'Jamaica', 'Haiti', 'Other',
];

// Build <option> HTML for a select. Marks `selected` when it matches.
export function optionList(items, selected = '', placeholder = '— select —') {
  return [`<option value="">${placeholder}</option>`]
    .concat(items.map(i =>
      `<option value="${i}"${i === selected ? ' selected' : ''}>${i}</option>`))
    .join('');
}

// ── Session persistence (for standalone extension pages) ──────────────────────
// localStorage-based so the admin panel and client portal stay logged in across
// reloads. Not used by the service worker (which has no localStorage).

export function saveStoredSession(key, session) {
  try { localStorage.setItem(key, JSON.stringify(session)); } catch { /* ignore */ }
}

export function loadStoredSession(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}

export function clearStoredSession(key) {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

// True if the access token is missing, expired, or within 60s of expiring.
export function isSessionExpired(session) {
  if (!session?.access_token) return true;
  let exp = session.expires_at;
  if (!exp) {
    try { exp = JSON.parse(atob(session.access_token.split('.')[1])).exp; }
    catch { return false; }
  }
  return (Date.now() / 1000) > (exp - 60);
}

// ── Profile ───────────────────────────────────────────────────────────────────

export async function getMyProfile(accessToken) {
  // Decode the user id directly from the JWT — no extra request needed
  const payload = JSON.parse(atob(accessToken.split('.')[1]));
  const userId  = payload.sub;

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?select=role,email&id=eq.${userId}&limit=1`,
    { headers: headers(accessToken) }
  );
  const data = await res.json();
  if (!res.ok || !data.length) throw new Error('Could not load profile');
  return data[0];
}

// ── Client self-profile ─────────────────────────────────────────────────────

// Returns the logged-in user's own client row, creating & linking it on first
// login. Used by the client portal so no admin pre-setup is needed.
export async function getOrCreateMyClientProfile(accessToken) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/get_or_create_my_client_profile`,
    { method: 'POST', headers: headers(accessToken), body: '{}' }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Could not load your profile');
  // PostgREST returns the composite row as an object (or single-element array)
  return Array.isArray(data) ? data[0] : data;
}

// ── Clients ───────────────────────────────────────────────────────────────────

export async function getClients(accessToken) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/clients?select=*&order=last_name.asc`,
    { headers: headers(accessToken) }
  );
  const data = await res.json();
  if (!res.ok) throw new Error('Could not load clients');
  return data;
}

export async function createClient(accessToken, clientData) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/clients`, {
    method: 'POST',
    headers: { ...headers(accessToken), Prefer: 'return=representation' },
    body: JSON.stringify(clientData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || 'Could not create client');
  }
  return Array.isArray(data) ? data[0] : data;
}

export async function updateClient(accessToken, id, clientData) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/clients?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...headers(accessToken), Prefer: 'return=minimal' },
    body: JSON.stringify(clientData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Could not update client');
  }
}

export async function deleteClient(accessToken, id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/clients?id=eq.${id}`, {
    method: 'DELETE',
    headers: headers(accessToken),
  });
  if (!res.ok) throw new Error('Could not delete client');
}

// ── Employees ─────────────────────────────────────────────────────────────────

export async function getEmployees(accessToken) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?select=id,role,email&role=eq.employee&order=email.asc`,
    { headers: headers(accessToken) }
  );
  const data = await res.json();
  if (!res.ok) throw new Error('Could not load employees');
  return data;
}

// ── Assignments ───────────────────────────────────────────────────────────────

export async function getAssignments(accessToken) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/client_assignments?select=*`,
    { headers: headers(accessToken) }
  );
  const data = await res.json();
  if (!res.ok) throw new Error('Could not load assignments');
  return data;
}

export async function assignClient(accessToken, clientId, employeeId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/client_assignments`, {
    method: 'POST',
    headers: { ...headers(accessToken), Prefer: 'return=representation' },
    body: JSON.stringify({ client_id: clientId, employee_id: employeeId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Could not assign client');
  return data[0];
}

export async function unassignClient(accessToken, clientId, employeeId) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/client_assignments?client_id=eq.${clientId}&employee_id=eq.${employeeId}`,
    { method: 'DELETE', headers: headers(accessToken) }
  );
  if (!res.ok) throw new Error('Could not remove assignment');
}

// ── Resume upload ─────────────────────────────────────────────────────────────

export async function uploadResume(accessToken, clientId, file) {
  const path = `${clientId}/${file.name}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/resumes/${path}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': file.type,
    },
    body: file,
  });
  if (!res.ok) throw new Error('Resume upload failed');
  return `${SUPABASE_URL}/storage/v1/object/public/resumes/${path}`;
}

// ── Applications (client-facing tracker, read-only) ───────────────────────────

// Load the logged-in client's own applications, newest first. RLS ensures a
// client can only ever read rows tied to their own profile.
export async function getMyApplications(accessToken, clientId) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/applications?select=*&client_id=eq.${clientId}&order=applied_at.desc,created_at.desc`,
    { headers: headers(accessToken) }
  );
  const data = await res.json();
  if (!res.ok) throw new Error('Could not load applications');
  return data;
}
