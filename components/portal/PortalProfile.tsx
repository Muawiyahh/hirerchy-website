"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getMyProfile, saveProfile, uploadResume, uploadCoverLetter, lookupZip,
  type ClientProfile, type WorkEntry, type EduEntry,
} from "@/lib/portal";
import { COUNTRIES, DEGREE_TYPES, statesFor, COUNTRY_CODES } from "@/lib/portalData";
import { SECTIONS, VISA_TYPES, COMPLETION_KEYS, type Field } from "./config";

// ── shared class strings (site's light navy + gold palette) ────────────────────
const input =
  "w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";
const labelCls = "mb-1.5 block text-sm font-medium text-ink/90";
const pill = "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition select-none";
const cardCls = "rounded-2xl border border-border bg-surface p-6 shadow-sm";
const addBtn = "rounded-lg border border-dashed border-accent/50 bg-accent/5 px-4 py-2.5 text-sm font-semibold text-accent-deep transition hover:bg-accent/10";
const primaryBtn = "rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-accent-2";

// Fields that MUST be filled before the profile can be completed (flagged
// `required` in config) — the essentials the extension needs to autofill.
/* The intake rail groups the form's sections into four stages, so onboarding
   reads as a short journey. `from` is the first section index of each stage;
   the last one runs to the end of SECTIONS. */
const STAGES: { label: string; from: number }[] = [
  { label: "Candidate", from: 0 },
  { label: "Preferences", from: 3 },
  { label: "Academic", from: 6 },
  { label: "Activate", from: 9 },
];

const stageOf = (section: number) => {
  let idx = 0;
  for (let i = 0; i < STAGES.length; i++) if (section >= STAGES[i].from) idx = i;
  return idx;
};

const REQUIRED = SECTIONS.flatMap((s) => s.fields ?? []).filter((f) => f.required).map((f) => f.name);
const FIELD_LABEL: Record<string, string> = Object.fromEntries(
  SECTIONS.flatMap((s) => s.fields ?? []).map((f) => [f.name, f.label])
);

export default function PortalProfile({
  mode,
  onComplete,
}: {
  mode: "onboarding" | "edit";
  onComplete: () => void | Promise<void>;
}) {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Record<string, string>>({});
  const [work, setWork] = useState<WorkEntry[]>([]);
  const [edu, setEdu] = useState<EduEntry[]>([]);
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [coverMode, setCoverMode] = useState<"upload" | "paste">("upload");
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState(false);
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
      // security_ack is a boolean column — the form stores everything as text.
      else if (k === "security_ack") patch[k] = v === "true";
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
    for (const key of COMPLETION_KEYS) if ((form[key] || "").trim() !== "") filled++;
    if (work.some((w) => w.title || w.company)) filled++;
    if (edu.some((e) => e.school || e.degree)) filled++;
    if (resumeUrl) filled++;
    return Math.round((filled / (COMPLETION_KEYS.length + extras)) * 100);
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
    await onComplete();
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
  const onboarding = mode === "onboarding";
  const stageIndex = stageOf(active);

  return (
    <div
      className={
        onboarding
          ? "intake-dark min-h-[calc(100vh-68px)] bg-[radial-gradient(1100px_600px_at_50%_-10%,#132a4f_0%,#0a1628_60%)]"
          : ""
      }
    >
      {onboarding && (
        <header className="px-5 pt-14 text-center sm:px-8">
          <h1 className="text-2xl font-extrabold uppercase tracking-[0.06em] text-white sm:text-4xl">
            Hirerchy Candidate Intake
          </h1>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Intake protocol
          </p>
          <p className="mt-2 text-sm text-[#94a6c4]">
            {STAGES.length} stages. Once complete, we start applying on your behalf.
          </p>

          {/* stage rail — the eleven form sections grouped into four stages, so
              the client sees a short journey rather than a long one. */}
          <ol className="mx-auto mt-9 flex w-full max-w-3xl items-start justify-between gap-1">
            {STAGES.map((st, i) => {
              const now = i === stageIndex;
              const done = i < stageIndex;
              return (
                <li key={st.label} className="relative flex flex-1 flex-col items-center">
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className={`absolute right-1/2 top-5 h-px w-full ${
                        done || now ? "bg-accent/50" : "bg-white/12"
                      }`}
                    />
                  )}
                  <button
                    onClick={() => setActive(st.from)}
                    aria-current={now ? "step" : undefined}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition ${
                      now
                        ? "bg-accent text-navy"
                        : done
                          ? "bg-accent/25 text-accent"
                          : "bg-white/[0.08] text-white/40 hover:text-white/70"
                    }`}
                  >
                    {done ? "✓" : String(i + 1).padStart(2, "0")}
                  </button>
                  <span
                    className={`mt-2.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
                      now ? "text-accent" : "text-white/35"
                    }`}
                  >
                    Stage {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`text-xs ${now ? "text-white" : "text-white/45"}`}>
                    {st.label}
                  </span>
                </li>
              );
            })}
          </ol>

          <p className="mt-6 text-xs text-white/45">
            Step {active + 1} of {SECTIONS.length} — {section.nav}
          </p>
        </header>
      )}

      <div
        className={`mx-auto flex w-full gap-8 px-5 sm:px-8 ${
          onboarding ? "max-w-4xl py-10" : "max-w-6xl py-8"
        }`}
      >
        {/* sidebar — edit mode only; onboarding uses the stage rail above */}
        <nav className={`w-52 shrink-0 ${onboarding ? "hidden" : "hidden lg:block"}`}>
          <ul className="sticky top-[124px] space-y-1 rounded-2xl border border-border bg-navy p-3 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.7)]">
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
          {/* inline completion meter */}
          <div className="mb-5 flex items-center gap-3">
            <span className="whitespace-nowrap text-[11px] font-medium text-muted">Profile completion</span>
            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[11px] font-semibold text-accent-deep">{pct}%</span>
          </div>
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

          {/* Account security policy — first stage of the intake only. The
              client confirms the application email is separate from their
              personal account before they can go on. */}
          {onboarding && active === 0 && (
            <div className="mt-5 rounded-2xl border border-accent/40 bg-accent/[0.06] p-6">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <span className="text-accent">🛡</span> Account Security Policy
                <span className="text-error">*</span>
              </div>

              <label className={`${labelCls} mt-5`}>
                Job application email <span className="text-error">*</span>
              </label>
              <input
                className={input}
                type="email"
                value={form.job_email ?? ""}
                onChange={(e) => setField("job_email", e.target.value)}
                placeholder="eg: michael.career@gmail.com"
              />
              <p className="mt-2 text-xs text-muted">
                An existing email you already use for job applications works fine — or create a
                new one. Just keep it separate from your personal account.
              </p>

              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="font-bold text-accent">Why a separate account</dt>
                  <dd className="mt-1 text-muted">
                    We never request access to your personal Google account. A dedicated,
                    job-only email keeps your personal mail, contacts and files completely
                    walled off from anything done on your behalf.
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-accent">What you do now</dt>
                  <dd className="mt-1 text-muted">
                    If you already use a separate email for job applications, enter it above. If
                    not, create a new one for this purpose only.
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-accent">What happens next</dt>
                  <dd className="mt-1 text-muted">
                    Once your profile is reviewed and approved, a member of our team will contact
                    you to set up official Gmail delegation — Google&apos;s own access-sharing
                    feature — to this account only. You can revoke that access at any time.
                  </dd>
                </div>
              </dl>

              <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface-2 p-4 text-sm text-ink">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#c9a227]"
                  checked={form.security_ack === "true"}
                  onChange={(e) => setField("security_ack", e.target.checked ? "true" : "false")}
                />
                I confirm the email above is used only for job applications, separate from my
                personal account.
              </label>
            </div>
          )}

          {/* tab nav */}
          <div className="mt-6 flex items-center justify-between">
            <button disabled={active === 0} onClick={() => setActive((a) => a - 1)}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted transition enabled:hover:bg-surface-2 enabled:hover:text-ink disabled:opacity-0">
              ← Previous
            </button>
            {isLast ? (
              <button onClick={completeProfile} className={primaryBtn}>
                {mode === "edit" ? "Save & return" : "Complete profile"}
              </button>
            ) : (
              <button
                onClick={() => setActive((a) => a + 1)}
                disabled={onboarding && active === 0 && form.security_ack !== "true"}
                className={`${primaryBtn} disabled:cursor-not-allowed disabled:opacity-40`}
                title={
                  onboarding && active === 0 && form.security_ack !== "true"
                    ? "Confirm the account security policy to continue"
                    : undefined
                }
              >
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
                <label key={o} className={`${pill} ${on ? "border-accent bg-accent text-navy" : "border-border bg-surface-2 text-ink/70 hover:border-accent"}`}>
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
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${coverMode === m ? "bg-accent text-navy" : "text-muted hover:text-ink"}`}>
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
    return null;
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
