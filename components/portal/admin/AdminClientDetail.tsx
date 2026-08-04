"use client";

import { useEffect, useState } from "react";
import { WeekBar, clientName, initials } from "../StaffShell";
import {
  CLIENT_STATUSES, updateClientPipeline, bumpClientWeek, assignClient,
  getFullClient, sendPasswordReset, saveProfile, deleteClient,
  type ClientRow, type StaffRow, type AssignmentRow, type ClientStatus, type ClientProfile,
  errorText,
} from "@/lib/portal";
import {
  ClientFieldSections, buildPatch, draftFrom, setDraftField, toggleDraftOption,
  card, cardLabel, editLabel, select,
} from "./ClientFields";
import { plans } from "@/lib/content";

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
      setError(errorText(e, "That didn't save."));
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
    setDraft(draftFrom(full));
    setError("");
    setNote("");
    setEditing(true);
  }

  async function saveEdits() {
    const patch = buildPatch(draft, full);

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
      setError(errorText(e, "Those details didn't save."));
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
      setError(errorText(e, "Could not delete that client."));
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
          <ClientFieldSections
            draft={draft}
            onChange={(k, v) => setDraft((p) => setDraftField(p, k, v))}
            onToggle={(k, o) => setDraft((p) => toggleDraftOption(p, k, o))}
          />

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
