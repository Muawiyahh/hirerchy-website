"use client";

import { useEffect, useState } from "react";
import { WeekBar, clientName, initials } from "../StaffShell";
import {
  CLIENT_STATUSES, updateClientPipeline, bumpClientWeek, assignClient,
  getFullClient, sendPasswordReset, saveProfile, deleteClient,
  type ClientRow, type StaffRow, type AssignmentRow, type ClientStatus, type ClientProfile,
} from "@/lib/portal";
import { SECTIONS, type Field } from "../config";
import { COUNTRIES, statesFor } from "@/lib/portalData";
import { plans } from "@/lib/content";

const select =
  "w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2.5 text-sm font-medium text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";
const card = "rounded-lg border border-border bg-surface p-5 shadow-sm";
const cardLabel = "text-xs font-semibold uppercase tracking-[0.1em] text-muted";
const editLabel = "mb-1.5 block text-xs font-semibold text-muted";
const pill =
  "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition";

/** Detail groups shown under the control row. Keys map to `clients` columns. */
const GROUPS: { title: string; fields: [string, string][] }[] = [
  {
    title: "Candidate",
    fields: [
      ["Full name", "__name"], ["Phone", "phone"], ["Job email", "job_email"],
      ["Account email", "email"], ["Date of birth", "date_of_birth"], ["Address", "address_line1"],
      ["City", "city"], ["State", "state"], ["Country", "country"], ["ZIP / PIN", "zip"],
      ["LinkedIn", "linkedin_url"], ["Portfolio", "portfolio_url"],
    ],
  },
  {
    title: "Work authorisation",
    fields: [
      ["18 or over", "is_18_plus"], ["Work authorised", "work_authorized"],
      ["Needs sponsorship", "requires_sponsorship"], ["Visa type", "visa_type"],
      ["Non-compete", "non_compete"], ["Government work", "worked_for_government"],
      ["Security clearance", "security_clearance"], ["Background check", "background_check"],
    ],
  },
  {
    title: "Preferences",
    fields: [
      ["Employment type", "employment_type"], ["Arrangement", "work_arrangement"],
      ["Experience", "years_experience"], ["Availability", "availability"],
      ["Salary expectation", "salary_expectation"], ["Notice period", "notice_period"],
      ["Will relocate", "willing_to_relocate"], ["Will travel", "willing_to_travel"],
      ["Preferred locations", "preferred_locations"], ["Driver's licence", "has_drivers_license"],
    ],
  },
];

/** The edit form is driven by the client's own intake config, so an admin edit
 *  writes exactly the values the extension autofills from — no second list of
 *  fields to drift. The repeater sections (experience, education) and the file
 *  uploads have no `fields`, so they fall out here; those stay with the client. */
const EDIT_SECTIONS = SECTIONS.filter((s) => s.fields?.length).map((s) =>
  s.id === "personal"
    ? {
        ...s,
        fields: [
          ...s.fields!,
          {
            name: "job_email",
            label: "Job application email",
            type: "email" as const,
            hint: "the inbox used when applying",
          },
        ],
      }
    : s
);

const EDIT_FIELDS: Field[] = EDIT_SECTIONS.flatMap((s) => s.fields!);

/** NOT NULL columns — blanking these has to write "" rather than null. */
const NEVER_NULL = new Set(["first_name", "last_name"]);

/** How a column's stored value looks in the form, so "changed?" compares like
 *  with like. skills is a jsonb array everywhere else; the form edits it as a
 *  comma-separated string. */
function asText(profile: ClientProfile | null, key: string): string {
  const v = profile?.[key];
  if (v == null) return "";
  return Array.isArray(v) ? v.join(", ") : String(v);
}

export default function AdminClientDetail({
  client,
  staff,
  assignments,
  onBack,
  onChanged,
}: {
  client: ClientRow;
  staff: StaffRow[];
  assignments: AssignmentRow[];
  onBack: () => void;
  onChanged: () => void;
}) {
  const employees = staff.filter((s) => s.role === "employee");
  const assigned = assignments.find((a) => a.client_id === client.id)?.employee_id ?? "";

  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [weeksTotal, setWeeksTotal] = useState(String(client.weeks_total || ""));
  const [full, setFull] = useState<ClientProfile | null>(null);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    let alive = true;
    getFullClient(client.id)
      .then((f) => alive && setFull(f))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [client.id]);

  async function run(what: string, fn: () => Promise<unknown>, ok?: string) {
    setBusy(what);
    setError("");
    setNote("");
    try {
      await fn();
      if (ok) setNote(ok);
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "That didn't save.");
    } finally {
      setBusy("");
    }
  }

  const name = clientName(client);
  const val = (key: string) => {
    if (key === "__name") return name;
    const v = full?.[key];
    if (v == null || String(v).trim() === "") return null;
    return Array.isArray(v) ? v.join(", ") : String(v);
  };

  // ── editing ───────────────────────────────────────────────────────────────

  function startEdit() {
    const d: Record<string, string> = {};
    for (const f of EDIT_FIELDS) d[f.name] = asText(full, f.name);
    setDraft(d);
    setError("");
    setNote("");
    setEditing(true);
  }

  const setField = (key: string, value: string) =>
    setDraft((p) =>
      // States are per-country, so the old one can't survive a country change.
      key === "country" ? { ...p, country: value, state: "" } : { ...p, [key]: value }
    );

  const toggleMulti = (key: string, option: string) =>
    setDraft((p) => {
      const on = (p[key] || "").split(",").map((s) => s.trim()).filter(Boolean);
      const next = on.includes(option) ? on.filter((o) => o !== option) : [...on, option];
      return { ...p, [key]: next.join(", ") };
    });

  async function saveEdits() {
    const patch: Record<string, unknown> = {};
    for (const f of EDIT_FIELDS) {
      const next = (draft[f.name] ?? "").trim();
      if (next === asText(full, f.name).trim()) continue;
      if (f.name === "skills") {
        patch.skills = next.split(",").map((s) => s.trim()).filter(Boolean);
      } else if (NEVER_NULL.has(f.name)) {
        patch[f.name] = next;
      } else {
        patch[f.name] = next === "" ? null : next;
      }
    }

    if (Object.keys(patch).length === 0) {
      setEditing(false);
      setNote("Nothing changed.");
      return;
    }

    setBusy("edit");
    setError("");
    setNote("");
    try {
      await saveProfile(client.id, patch);
      setFull(await getFullClient(client.id));
      setEditing(false);
      setNote("Details saved.");
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Those details didn't save.");
    } finally {
      setBusy("");
    }
  }

  async function removeClient() {
    setBusy("delete");
    setError("");
    try {
      await deleteClient(client.id);
      onBack();
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete that client.");
      setBusy("");
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-accent/60"
        >
          ← Back to Queue
        </button>

        {!editing && (
          <button
            onClick={startEdit}
            disabled={!full}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-accent/60 disabled:opacity-40"
          >
            {full ? "Edit Details" : "Loading…"}
          </button>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-navy text-lg font-bold text-white">
          {initials(name)}
        </span>
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">{name}</h1>
          <p className="text-sm text-muted">{client.email}</p>
        </div>
      </div>

      {error && (
        <p className="mt-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}
      {note && (
        <p className="mt-5 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          {note}
        </p>
      )}

      {/* control row */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className={card}>
          <div className={cardLabel}>Status</div>
          <select
            className={`${select} mt-2.5`}
            value={client.status}
            disabled={busy !== ""}
            onChange={(e) =>
              run("status", () =>
                updateClientPipeline(client.id, { status: e.target.value as ClientStatus })
              )
            }
          >
            {CLIENT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <p className="mt-2 text-[11px] text-muted">The client sees this on their dashboard.</p>
        </div>

        <div className={card}>
          <div className={cardLabel}>Assigned employee</div>
          <select
            className={`${select} mt-2.5`}
            value={assigned}
            disabled={busy !== ""}
            onChange={(e) => run("assign", () => assignClient(client.id, e.target.value || null))}
          >
            <option value="">Unassigned</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.email}</option>
            ))}
          </select>
          <p className="mt-2 text-[11px] text-muted">
            {employees.length ? "Only they can see this client." : "No employees yet."}
          </p>
        </div>

        <div className={card}>
          <div className={cardLabel}>Documents</div>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <DocLink href={full?.resume_url as string | undefined} label="Resume" />
            <DocLink href={full?.cover_letter_url as string | undefined} label="Cover Letter" />
          </div>
          {full?.cover_letter_text ? (
            <p className="mt-2 text-[11px] text-muted">Cover letter supplied as text.</p>
          ) : null}
        </div>

        <div className={card}>
          <div className={cardLabel}>Plan progress</div>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-2xl font-extrabold tabular-nums text-ink">
              {client.weeks_completed}
            </span>
            <span className="text-muted">/</span>
            <input
              type="number"
              min={0}
              value={weeksTotal}
              onChange={(e) => setWeeksTotal(e.target.value)}
              onBlur={() =>
                run("total", () =>
                  updateClientPipeline(client.id, {
                    weeks_total: Math.max(0, parseInt(weeksTotal || "0", 10)),
                  })
                )
              }
              placeholder="—"
              className="w-16 rounded-lg border border-border bg-surface-2 px-2 py-1.5 text-center text-sm font-bold text-ink outline-none focus:border-accent"
            />
            <span className="text-sm text-muted">weeks</span>
          </div>
          <div className="mt-2.5">
            <WeekBar done={client.weeks_completed} total={client.weeks_total} />
          </div>
          <div className="mt-3 flex gap-2">
            <button
              disabled={busy !== "" || client.weeks_completed >= client.weeks_total}
              onClick={() => run("week", () => bumpClientWeek(client.id, 1))}
              className="flex-1 rounded-lg bg-navy px-3 py-2 text-xs font-bold text-white transition hover:bg-navy-2 disabled:opacity-40"
            >
              +1 Week Completed
            </button>
            <button
              disabled={busy !== "" || client.weeks_completed <= 0}
              onClick={() => run("week", () => bumpClientWeek(client.id, -1))}
              className="rounded-lg border border-border px-3 py-2 text-xs font-bold text-muted transition hover:text-ink disabled:opacity-40"
            >
              −
            </button>
          </div>
        </div>
      </div>

      {/* plan + account access */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className={card}>
          <div className={cardLabel}>Plan</div>
          <select
            className={`${select} mt-2.5`}
            value={client.plan ?? ""}
            disabled={busy !== ""}
            onChange={(e) =>
              run("plan", () => updateClientPipeline(client.id, { plan: e.target.value || null }))
            }
          >
            <option value="">No plan set</option>
            {plans.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className={card}>
          <div className={cardLabel}>Account access</div>
          <button
            disabled={busy !== "" || !client.email}
            onClick={() =>
              run(
                "reset",
                () => sendPasswordReset(client.email!),
                `Password reset link sent to ${client.email}.`
              )
            }
            className="mt-2.5 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-semibold text-ink transition hover:border-accent/60 disabled:opacity-40"
          >
            {busy === "reset" ? "Sending…" : "Reset Password"}
          </button>
          <p className="mt-2 text-[11px] text-muted">
            Emails the client a reset link. We never see or set their password.
          </p>
        </div>
      </div>

      {editing ? (
        <>
          {EDIT_SECTIONS.map((s) => (
            <section key={s.id} className={`${card} mt-4`}>
              <h2 className="text-lg font-bold text-ink">{s.title}</h2>
              {s.hint && <p className="mt-1 text-xs text-muted">{s.hint}</p>}
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {s.fields!.map((f) => (
                  <div
                    key={f.name}
                    className={
                      f.type === "multiselect" || f.full ? "sm:col-span-2 xl:col-span-3" : ""
                    }
                  >
                    <EditField
                      field={f}
                      value={draft[f.name] ?? ""}
                      country={draft.country || "United States"}
                      onChange={(v) => setField(f.name, v)}
                      onToggle={(o) => toggleMulti(f.name, o)}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}

          <p className="mt-4 text-xs text-muted">
            Work experience, education, the resume and the cover letter are edited by the client
            from their own portal — they aren&apos;t changed here.
          </p>

          {/* sticky so Save stays reachable down a long form */}
          <div className="sticky bottom-0 z-30 mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface px-5 py-3.5 shadow-lg">
            <button
              onClick={saveEdits}
              disabled={busy !== ""}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-accent-2 disabled:opacity-60"
            >
              {busy === "edit" ? "Saving…" : "Save Changes"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setError("");
              }}
              disabled={busy !== ""}
              className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-accent/60 disabled:opacity-60"
            >
              Cancel
            </button>
            <span className="text-xs text-muted">
              Changes apply to what the extension autofills on their next application.
            </span>
          </div>
        </>
      ) : (
        <>
          {GROUPS.map((g) => {
            const rows = g.fields.filter(([, k]) => val(k) !== null);
            if (rows.length === 0) return null;
            return (
              <section key={g.title} className={`${card} mt-4`}>
                <h2 className="text-lg font-bold text-ink">{g.title}</h2>
                <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
                  {rows.map(([label, key]) => (
                    <div key={key}>
                      <dt className="text-xs font-medium text-muted">{label}</dt>
                      <dd className="mt-0.5 break-words text-sm font-semibold text-ink">{val(key)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}

          {!full && <p className="mt-4 text-sm text-muted">Loading the full profile…</p>}

          {/* danger zone — last thing on the page, and never shown mid-edit */}
          <section className="mt-4 rounded-lg border border-error/40 bg-error/[0.04] p-5">
            <h2 className="text-lg font-bold text-ink">Delete this client</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted">
              Permanently removes {name} — their profile, every logged application, the message
              thread and their login. Their email is freed for reuse. This cannot be undone.
            </p>

            {!confirmOpen ? (
              <button
                onClick={() => setConfirmOpen(true)}
                className="mt-4 rounded-lg border border-error/50 px-4 py-2 text-sm font-bold text-error transition hover:bg-error/10"
              >
                Delete Client
              </button>
            ) : (
              <div className="mt-4 max-w-md">
                <label className={editLabel} htmlFor="confirm-delete">
                  Type DELETE to confirm
                </label>
                <input
                  id="confirm-delete"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  autoComplete="off"
                  className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm font-semibold tracking-wide text-ink outline-none transition-colors focus:border-error focus:ring-2 focus:ring-error/25"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={removeClient}
                    disabled={confirmText.trim() !== "DELETE" || busy !== ""}
                    className="rounded-lg bg-error px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-40"
                  >
                    {busy === "delete" ? "Deleting…" : "Delete Permanently"}
                  </button>
                  <button
                    onClick={() => {
                      setConfirmOpen(false);
                      setConfirmText("");
                    }}
                    disabled={busy !== ""}
                    className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-accent/60 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}

/** One editable field, rendered the way the client's own form renders it —
 *  same control, same options, so the stored value matches either way. */
function EditField({
  field: f,
  value,
  country,
  onChange,
  onToggle,
}: {
  field: Field;
  value: string;
  country: string;
  onChange: (v: string) => void;
  onToggle: (option: string) => void;
}) {
  const text = (
    <>
      {f.label}
      {f.hint && <span className="ml-1 font-normal normal-case text-muted/80">({f.hint})</span>}
    </>
  );
  const label = (
    <label className={editLabel} htmlFor={`edit-${f.name}`}>
      {text}
    </label>
  );

  if (f.type === "multiselect") {
    const on = value.split(",").map((s) => s.trim()).filter(Boolean);
    // A group of checkboxes has no single control to label, so this is a
    // caption on the group rather than a <label for>.
    return (
      <fieldset>
        <legend className={editLabel}>{text}</legend>
        <div className="flex flex-wrap gap-2">
          {f.options!.map((o) => {
            const active = on.includes(o);
            return (
              <label
                key={o}
                className={`${pill} ${
                  active
                    ? "border-accent bg-accent text-navy"
                    : "border-border bg-surface-2 text-ink/70 hover:border-accent"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={active}
                  onChange={() => onToggle(o)}
                />
                {o}
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  // Country and state options are runtime — the state list depends on the
  // country picked above it, and is empty for countries we don't have one for.
  const options =
    f.name === "country" ? COUNTRIES : f.name === "state" ? statesFor(country) : f.options;

  if (f.type === "select" && options?.length) {
    return (
      <>
        {label}
        <select
          id={`edit-${f.name}`}
          className={select}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">— not set —</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </>
    );
  }

  if (f.type === "textarea") {
    return (
      <>
        {label}
        <textarea
          id={`edit-${f.name}`}
          rows={4}
          className={select}
          value={value}
          placeholder={f.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </>
    );
  }

  return (
    <>
      {label}
      <input
        id={`edit-${f.name}`}
        // a state with no option list still needs typing into
        type={f.type === "select" ? "text" : f.type}
        className={select}
        value={value}
        placeholder={f.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
}

function DocLink({ href, label }: { href?: string; label: string }) {
  const base =
    "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition";
  if (!href) {
    return <span className={`${base} bg-surface-2 text-muted/60`}>{label} — none</span>;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} bg-surface-2 text-ink hover:bg-accent hover:text-navy`}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" />
      </svg>
      {label}
    </a>
  );
}
