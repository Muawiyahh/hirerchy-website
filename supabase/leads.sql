-- ════════════════════════════════════════════════════════════════════════════
-- Hirerchy marketing site — `leads` table
-- Run this once in the Supabase SQL editor of the EXISTING Hirerchy project.
--
-- Captures free-resume-review and contact-form submissions from the website.
-- Security model: the public anon key can INSERT leads but can NEVER read them.
-- You (owner) read leads from the Supabase Table Editor / dashboard, which uses
-- the service role and bypasses RLS.
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  type          text not null default 'contact',   -- 'resume_review' | 'contact'
  name          text,
  email         text,
  phone         text,
  target_role   text,
  linkedin_url  text,
  resume_url    text,
  message       text,
  source        text default 'website'
);

alter table public.leads enable row level security;

-- Allow anonymous (public website) inserts only.
drop policy if exists "anon can insert leads" on public.leads;
create policy "anon can insert leads"
  on public.leads
  for insert
  to anon
  with check (true);

-- NOTE: intentionally NO select/update/delete policy for anon, so the public
-- key cannot read other people's submissions. Add an owner-read policy later if
-- you want to surface leads inside the admin panel, e.g.:
--
--   create policy "owner reads leads" on public.leads
--     for select to authenticated
--     using (exists (select 1 from public.profiles p
--                    where p.id = auth.uid() and p.role = 'owner'));

-- ── Optional: storage bucket for the optional resume upload on /free-review ──
-- Uncomment to enable file uploads (otherwise the form collects a LinkedIn URL).
--
-- insert into storage.buckets (id, name, public)
-- values ('lead-uploads', 'lead-uploads', false)
-- on conflict (id) do nothing;
--
-- create policy "anon can upload lead files"
--   on storage.objects for insert to anon
--   with check (bucket_id = 'lead-uploads');
