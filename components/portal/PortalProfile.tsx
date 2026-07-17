"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BrandMark from "@/components/BrandMark";
import {
  getMyProfile, saveProfile, signOut, uploadResume, uploadCoverLetter,
  getMyApplications, lookupZip,
  type ClientProfile, type WorkEntry, type EduEntry, type AppRow,
} from "@/lib/portal";
import { COUNTRIES, DEGREE_TYPES, statesFor, COUNTRY_CODES } from "@/lib/portalData";
import { SECTIONS, VISA_TYPES, type Field } from "./config";

// ── shared class strings (site's light navy + gold palette) ────────────────────
const input =
  "w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";
const labelCls = "mb-1.5 block text-sm font-medium text-ink/90";
const pill = "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition select-none";
const cardCls = "rounded-2xl border border-border bg-surface p-6 shadow-sm";
const addBtn = "rounded-lg border border-dashed border-accent/50 bg-accent/5 px-4 py-2.5 text-sm font-semibold text-accent-deep transition hover:bg-accent/10";
const primaryBtn = "rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-2";

const COMPLETION = [
  "first_name", "last_name", "email", "phone", "address_line1", "city", "state", "zip", "country",
  "is_18_plus", "work_authorized", "requires_sponsorship", "visa_type", "non_compete", "worked_for_government",
  "employment_type", "work_arrangement", "years_experience", "availability", "salary_expectation",
  "willing_to_relocate", "willing_to_travel", "has_drivers_license", "linkedin_url", "skills",
];

// Fields that MUST be filled before the profile can be completed (flagged
// `required` in config) — the essentials the extension needs to autofill.
const REQUIRED = SECTIONS.flatMap((s) => s.fields ?? []).filter((f) => f.required).map((f) => f.name);
const FIELD_LABEL: Record<string, string> = Object.fromEntries(
  SECTIONS.flatMap((s) => s.fields ?? []).map((f) => [f.name, f.label])
);

export default function PortalProfile() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Record<string, string>>({});
  const [work, setWork] = useState<WorkEntry[]>([]);
  const [edu, setEdu] = useState<EduEntry[]>([]);
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [coverMode, setCoverMode] = useState<"upload" | "paste">("upload");
  const [apps, setApps] = useState<AppRow[]>([]);
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState(false);
  const [done, setDone] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef("");
  const workRef = useRef<WorkEntry[]>([]);
  const eduRef = useRef<EduEntry[]>([]);
  const formRef = useRef<Record<string, string>>({});
  useEffect(() => { workRef.current = work; }, [work]);
  useEffect(() => { eduRef.current = edu; }, [edu]);
  useEffect(() => { formRef.current = form; }, [form]);

  // ── load ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const c = await getMyProfile();
        idRef.current = c.id;
        const f: Record<string, string> = {};
        for (const [k, v] of Object.entries(c)) {
          if (v == null) continue;
          if (k === "skills" && Array.isArray(v)) f[k] = v.join(", ");
          else if (Array.isArray(v)) continue;
          else f[k] = String(v);
        }
        if (!f.country) f.country = "United States";
        setForm(f);
        setWork(Array.isArray(c.work_experience) ? c.work_experience.map((w) => ({ ...w })) : []);
        setEdu(Array.isArray(c.education) ? c.education.map((e) => ({ ...e })) : []);
        setResumeUrl(c.resume_url || "");
        setCoverUrl(c.cover_letter_url || "");
        if (c.cover_letter_text) setCoverMode("paste");
        getMyApplications(c.id).then(setApps).catch(() => {});
      } catch {
        /* leave empty; user can retry */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── save (debounced) ──────────────────────────────────────────────────────────
  const collect = useCallback((): Partial<ClientProfile> => {
    const f = formRef.current;
    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(f)) {
      if (k === "id" || k === "profile_id" || k === "created_at") continue;
      if (k === "skills") patch[k] = v.split(",").map((s) => s.trim()).filter(Boolean);
      else patch[k] = v;
    }
    patch.work_experience = workRef.current;
    patch.education = eduRef.current;
    return patch as Partial<ClientProfile>;
  }, []);

  const flush = useCallback(async () => {
    if (!idRef.current) return;
    try {
      await saveProfile(idRef.current, collect());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { /* retry on next change */ }
  }, [collect]);

  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flush, 800);
  }, [flush]);

  const setField = useCallback((name: string, value: string) => {
    setForm((p) => ({ ...p, [name]: value }));
    scheduleSave();
  }, [scheduleSave]);

  const toggleMulti = useCallback((name: string, option: string) => {
    setForm((p) => {
      const cur = (p[name] || "").split(",").map((s) => s.trim()).filter(Boolean);
      const next = cur.includes(option) ? cur.filter((x) => x !== option) : [...cur, option];
      return { ...p, [name]: next.join(", ") };
    });
    scheduleSave();
  }, [scheduleSave]);

  const onCountry = useCallback((country: string) => {
    setForm((p) => ({ ...p, country, state: "" }));
    scheduleSave();
  }, [scheduleSave]);

  const onZipBlur = useCallback(async () => {
    const f = formRef.current;
    const cc = (COUNTRY_CODES as Record<string, string>)[f.country || "United States"];
    if (!cc || !f.zip) return;
    const r = await lookupZip(f.country || "United States", f.zip, cc);
    if (!r) return;
    setForm((p) => {
      const next = { ...p };
      if (r.city && !p.city) next.city = r.city;
      if (r.state && statesFor(p.country || "United States").includes(r.state)) next.state = r.state;
      return next;
    });
    scheduleSave();
  }, [scheduleSave]);

  // ── uploads ───────────────────────────────────────────────────────────────────
  async function onResume(file?: File) {
    if (!file || !idRef.current) return;
    const url = await uploadResume(idRef.current, file);
    setResumeUrl(url);
    await saveProfile(idRef.current, { resume_url: url });
  }
  async function onCover(file?: File) {
    if (!file || !idRef.current) return;
    const url = await uploadCoverLetter(idRef.current, file);
    setCoverUrl(url);
    await saveProfile(idRef.current, { cover_letter_url: url });
  }

  // ── work / education mutations ─────────────────────────────────────────────────
  const addWork = () => { setWork((w) => [...w, { title: "", company: "", location: "", start: "", end: "", description: "" }]); scheduleSave(); };
  const addEdu = () => { setEdu((e) => [...e, { school: "", degree: "", field: "", start: "", end: "", gpa: "" }]); scheduleSave(); };
  const setWorkField = (i: number, k: keyof WorkEntry, v: string) => { setWork((w) => w.map((x, j) => (j === i ? { ...x, [k]: v } : x))); scheduleSave(); };
  const setEduField = (i: number, k: keyof EduEntry, v: string) => { setEdu((e) => e.map((x, j) => (j === i ? { ...x, [k]: v } : x))); scheduleSave(); };
  const rmWork = (i: number) => { setWork((w) => w.filter((_, j) => j !== i)); scheduleSave(); };
  const rmEdu = (i: number) => { setEdu((e) => e.filter((_, j) => j !== i)); scheduleSave(); };

  // ── completion meter ────────────────────────────────────────────────────────────
  const pct = useMemo(() => {
    const extras = 3;
    let filled = 0;
    for (const key of COMPLETION) if ((form[key] || "").trim() !== "") filled++;
    if (work.some((w) => w.title || w.company)) filled++;
    if (edu.some((e) => e.school || e.degree)) filled++;
    if (resumeUrl) filled++;
    return Math.round((filled / (COMPLETION.length + extras)) * 100);
  }, [form, work, edu, resumeUrl]);

  // Block completion until every required field is filled; jump to the first
  // section that still has a gap.
  async function completeProfile() {
    const miss = REQUIRED.filter((k) => !(formRef.current[k] || "").trim());
    if (miss.length) {
      setMissing(miss);
      const idx = SECTIONS.findIndex((s) => s.fields?.some((f) => miss.includes(f.name)));
      if (idx >= 0) setActive(idx);
      return;
    }
    setMissing([]);
    await flush();
    setDone(true);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-border border-t-navy" />
      </div>
    );
  }

  const section = SECTIONS[active];
  const isLast = active === SECTIONS.length - 1;

  return (
    <div className="min-h-[calc(100vh-68px)]">
      {/* portal toolbar — sits just under the site navbar (68px) */}
      <header className="sticky top-[68px] z-20 border-b border-border bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-2.5 sm:px-8">
          <div className="ml-auto hidden min-w-[220px] flex-col gap-1 sm:flex">
            <div className="flex justify-between text-[11px] font-medium text-muted">
              <span>Profile completion</span><span className="text-accent-deep">{pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <button onClick={() => signOut().then(() => location.reload())}
            className="ml-auto rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-ink">
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-5 py-8 sm:px-8">
        {/* sidebar */}
        <nav className="hidden w-52 shrink-0 lg:block">
          <ul className="sticky top-[124px] space-y-1 rounded-2xl bg-navy p-3 shadow-[0_20px_50px_-24px_rgba(15,31,61,0.65)]">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <button onClick={() => setActive(i)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                    i === active ? "bg-white/10 font-semibold text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
                  }`}>
                  <span className={`text-[11px] tabular-nums ${i === active ? "text-accent" : "text-white/30"}`}>{String(i + 1).padStart(2, "0")}</span>
                  {s.nav}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* content */}
        <main className="min-w-0 flex-1">
          {missing.length > 0 && (
            <div className="mb-4 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
              Please complete the required fields before finishing:{" "}
              <span className="font-semibold">{missing.map((k) => FIELD_LABEL[k] || k).join(", ")}</span>.
            </div>
          )}
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-accent-deep">
              {String(active + 1).padStart(2, "0")} — {section.nav}
            </div>
            <h2 className="mt-1 text-2xl font-bold text-ink">{section.title}</h2>
            {section.hint && <p className="mt-2 max-w-2xl text-sm text-muted">{section.hint}</p>}
          </div>

          <div className={cardCls}>
            {section.custom ? renderCustom(section.custom) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {section.fields!.map((f) => (
                  <div key={f.name} className={f.type === "multiselect" || f.full ? "sm:col-span-2" : ""}>
                    {renderField(f)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* tab nav */}
          <div className="mt-6 flex items-center justify-between">
            <button disabled={active === 0} onClick={() => setActive((a) => a - 1)}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted transition enabled:hover:bg-surface-2 enabled:hover:text-ink disabled:opacity-0">
              ← Previous
            </button>
            {isLast ? (
              <button onClick={completeProfile} className={primaryBtn}>
                Complete profile
              </button>
            ) : (
              <button onClick={() => setActive((a) => a + 1)} className={primaryBtn}>
                Next: {SECTIONS[active + 1].nav} →
              </button>
            )}
          </div>
        </main>
      </div>

      {/* save toast */}
      <div className={`fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-ink shadow-lg transition ${saved ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        ✓ All changes saved
      </div>

      {/* success modal */}
      {done && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-navy/50 px-4 backdrop-blur-sm" onClick={() => setDone(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center"><BrandMark size={40} /></div>
            <h2 className="mt-4 text-xl font-bold text-ink">Your profile is complete!</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Thank you — your profile has been submitted. Hirerchy will now take care of your job applications on your behalf. You can come back and update your details anytime.
            </p>
            <button onClick={() => setDone(false)} className={`${primaryBtn} mt-6 w-full`}>Done</button>
          </div>
        </div>
      )}
    </div>
  );

  // ── field renderers ─────────────────────────────────────────────────────────────
  function renderField(f: Field) {
    const val = form[f.name] ?? "";
    if (f.type === "multiselect") {
      const sel = val.split(",").map((s) => s.trim()).filter(Boolean);
      return (
        <>
          <label className={labelCls}>{f.label}{f.required && <span className="text-error"> *</span>}{f.hint && <span className="ml-1 font-normal text-muted">({f.hint})</span>}</label>
          <div className="flex flex-wrap gap-2">
            {f.options!.map((o) => {
              const on = sel.includes(o);
              return (
                <label key={o} className={`${pill} ${on ? "border-navy bg-navy text-white" : "border-border bg-surface-2 text-ink/70 hover:border-accent"}`}>
                  <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleMulti(f.name, o)} />
                  {o}
                </label>
              );
            })}
          </div>
        </>
      );
    }
    if (f.type === "select") {
      const options =
        f.name === "country" ? COUNTRIES :
        f.name === "state" ? statesFor(form.country || "United States") :
        f.options || [];
      return (
        <>
          <label className={labelCls}>{f.label}{f.required && <span className="text-error"> *</span>}</label>
          <select className={`${input} appearance-none`} value={val}
            onChange={(e) => (f.name === "country" ? onCountry(e.target.value) : setField(f.name, e.target.value))}>
            <option value="">{options.length ? "— select —" : "— n/a —"}</option>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          {f.name === "visa_type" && val && !VISA_TYPES.includes(val) && (
            <input className={`${input} mt-2`} value={val} placeholder="Describe your work authorization status…"
              onChange={(e) => setField("visa_type", e.target.value)} />
          )}
        </>
      );
    }
    if (f.type === "textarea") {
      return (
        <>
          <label className={labelCls}>{f.label}{f.required && <span className="text-error"> *</span>}</label>
          <textarea className={`${input} min-h-[90px] resize-y`} value={val} placeholder={f.placeholder}
            onChange={(e) => setField(f.name, e.target.value)} />
        </>
      );
    }
    return (
      <>
        <label className={labelCls}>{f.label}</label>
        <input className={input} type={f.type} value={val} placeholder={f.placeholder}
          onChange={(e) => setField(f.name, e.target.value)}
          onBlur={f.name === "zip" ? onZipBlur : undefined} />
      </>
    );
  }

  function renderCustom(kind: NonNullable<Field["type"]> | string) {
    if (kind === "experience") {
      return (
        <div className="space-y-4">
          {work.map((w, i) => (
            <div key={i} className="relative rounded-xl border border-border bg-surface-2 p-4">
              <button onClick={() => rmWork(i)} className="absolute right-3 top-3 text-muted hover:text-error">✕</button>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelCls}>Job title</label><input className={input} value={w.title || ""} onChange={(e) => setWorkField(i, "title", e.target.value)} /></div>
                <div><label className={labelCls}>Company</label><input className={input} value={w.company || ""} onChange={(e) => setWorkField(i, "company", e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={labelCls}>Location <span className="font-normal text-muted">(optional)</span></label><input className={input} value={w.location || ""} placeholder="e.g. Austin, TX" onChange={(e) => setWorkField(i, "location", e.target.value)} /></div>
                <div><label className={labelCls}>Start date</label><input type="month" className={input} value={w.start || ""} onChange={(e) => setWorkField(i, "start", e.target.value)} /></div>
                <div><label className={labelCls}>End date <span className="font-normal text-muted">(blank if current)</span></label><input type="month" className={input} value={w.end || ""} onChange={(e) => setWorkField(i, "end", e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={labelCls}>Description</label><textarea className={`${input} resize-y`} rows={2} value={w.description || ""} onChange={(e) => setWorkField(i, "description", e.target.value)} /></div>
              </div>
            </div>
          ))}
          <button onClick={addWork} className={addBtn}>+ Add position</button>
        </div>
      );
    }
    if (kind === "education") {
      return (
        <div className="space-y-4">
          {edu.map((e, i) => (
            <div key={i} className="relative rounded-xl border border-border bg-surface-2 p-4">
              <button onClick={() => rmEdu(i)} className="absolute right-3 top-3 text-muted hover:text-error">✕</button>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelCls}>School</label><input className={input} value={e.school || ""} onChange={(ev) => setEduField(i, "school", ev.target.value)} /></div>
                <div><label className={labelCls}>Degree</label>
                  <select className={`${input} appearance-none`} value={e.degree || ""} onChange={(ev) => setEduField(i, "degree", ev.target.value)}>
                    <option value="">— select —</option>
                    {DEGREE_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2"><label className={labelCls}>Field of study</label><input className={input} value={e.field || ""} onChange={(ev) => setEduField(i, "field", ev.target.value)} /></div>
                <div><label className={labelCls}>Start date</label><input type="month" className={input} value={e.start || ""} onChange={(ev) => setEduField(i, "start", ev.target.value)} /></div>
                <div><label className={labelCls}>End date</label><input type="month" className={input} value={e.end || ""} onChange={(ev) => setEduField(i, "end", ev.target.value)} /></div>
                <div><label className={labelCls}>GPA <span className="font-normal text-muted">(optional)</span></label><input className={input} value={e.gpa || ""} placeholder="e.g. 3.8" onChange={(ev) => setEduField(i, "gpa", ev.target.value)} /></div>
              </div>
            </div>
          ))}
          <button onClick={addEdu} className={addBtn}>+ Add education</button>
        </div>
      );
    }
    if (kind === "cover") {
      return (
        <div>
          <div className="mb-4 inline-flex rounded-lg border border-border bg-surface-2 p-1">
            {(["upload", "paste"] as const).map((m) => (
              <button key={m} onClick={() => setCoverMode(m)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${coverMode === m ? "bg-navy text-white" : "text-muted hover:text-ink"}`}>
                {m === "upload" ? "Upload document" : "Paste text"}
              </button>
            ))}
          </div>
          {coverMode === "upload" ? (
            <div>
              {coverUrl && <p className="mb-3 text-sm text-muted">📄 Current: <strong className="text-ink">{decodeURIComponent(coverUrl.split("/").pop() || "")}</strong></p>}
              <FileDrop label="Upload cover letter (PDF, DOC, DOCX)" onFile={onCover} />
            </div>
          ) : (
            <div>
              <label className={labelCls}>Cover letter text</label>
              <textarea className={`${input} min-h-[180px] resize-y`} value={form.cover_letter_text || ""}
                placeholder="Paste or type your cover letter here..." onChange={(e) => setField("cover_letter_text", e.target.value)} />
            </div>
          )}
        </div>
      );
    }
    if (kind === "resume") {
      return (
        <div>
          {resumeUrl && <p className="mb-3 text-sm text-muted">📄 Current resume: <strong className="text-ink">{decodeURIComponent(resumeUrl.split("/").pop() || "")}</strong></p>}
          <FileDrop label="Upload resume (PDF, DOC, DOCX)" onFile={onResume} />
        </div>
      );
    }
    // applications
    return apps.length ? (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-wide text-muted">
            <tr><th className="pb-3 pr-4">Company</th><th className="pb-3 pr-4">Role</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Applied</th></tr>
          </thead>
          <tbody className="text-ink/80">
            {apps.map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="py-2.5 pr-4 font-medium text-ink">{a.company}</td>
                <td className="py-2.5 pr-4">{a.role_title || "—"}</td>
                <td className="py-2.5 pr-4"><span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-ink/70">{a.status}</span></td>
                <td className="py-2.5 text-muted">{a.applied_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-sm text-muted">No applications logged yet. Once Hirerchy starts applying on your behalf, they’ll show up here.</p>
    );
  }
}

function FileDrop({ label, onFile }: { label: string; onFile: (f?: File) => void }) {
  return (
    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-surface-2 px-6 py-8 text-center transition hover:border-accent/60 hover:bg-accent/5">
      <span className="text-2xl text-accent-deep">⬆</span>
      <span className="text-sm text-muted">{label}</span>
      <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
    </label>
  );
}
