"use client";

import { useState } from "react";
import {
  CLIENT_STATUSES, createClientRecord, assignClient, errorText,
  type ClientStatus, type StaffRow,
} from "@/lib/portal";
import {
  ClientFieldSections, buildPatch, emptyDraft, genPassword, setDraftField, toggleDraftOption,
  card, cardLabel, editLabel, select,
} from "./ClientFields";
import { plans } from "@/lib/content";

interface Done {
  id: string;
  name: string;
  email: string;
  password?: string;
  loginError?: string;
}

/**
 * Create a client without waiting for them to sign up. The record can stand on
 * its own — if no login is made here, the first time that person signs up with
 * the same email get_or_create_my_client_profile links them to this row rather
 * than starting a blank one.
 */
export default function AdminNewClient({
  staff,
  onBack,
  onOpen,
  onChanged,
}: {
  staff: StaffRow[];
  onBack: () => void;
  onOpen: (id: string) => void;
  onChanged: () => void;
}) {
  const employees = staff.filter((s) => s.role === "employee");

  const [draft, setDraft] = useState<Record<string, string>>(emptyDraft);
  const [status, setStatus] = useState<ClientStatus>("Submitted");
  const [plan, setPlan] = useState("");
  const [weeksTotal, setWeeksTotal] = useState("");
  const [employee, setEmployee] = useState("");

  const [makeLogin, setMakeLogin] = useState(true);
  const [password, setPassword] = useState(genPassword);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Done | null>(null);

  const first = (draft.first_name || "").trim();
  const last = (draft.last_name || "").trim();
  const email = (draft.email || "").trim();
  const canSave = Boolean(first && last && email) && !busy;

  function reset() {
    setDraft(emptyDraft());
    setStatus("Submitted");
    setPlan("");
    setWeeksTotal("");
    setEmployee("");
    setMakeLogin(true);
    setPassword(genPassword());
    setError("");
    setDone(null);
  }

  async function create() {
    if (!canSave) return;
    setBusy(true);
    setError("");
    try {
      // Empty fields are simply left off so the column defaults apply.
      const values = buildPatch(draft, null);
      values.status = status;
      values.plan = plan || null;
      values.weeks_total = Math.max(0, parseInt(weeksTotal || "0", 10));

      const { id, loginError } = await createClientRecord(
        values,
        makeLogin ? { email, password } : undefined
      );

      if (employee) {
        // A failed assignment shouldn't read as a failed create — the client
        // exists either way and can be assigned from their detail page.
        try {
          await assignClient(id, employee);
        } catch {
          /* left unassigned */
        }
      }

      setDone({
        id,
        name: `${first} ${last}`.trim(),
        email,
        password: makeLogin && !loginError ? password : undefined,
        loginError,
      });
      onChanged();
    } catch (e) {
      setError(errorText(e, "Could not create that client."));
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <>
        <button
          onClick={onBack}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-accent/60"
        >
          ← Back to Queue
        </button>

        <section className="mt-6 max-w-xl rounded-lg border border-success/40 bg-success/5 p-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Client created</h1>
          <p className="mt-1 text-sm text-muted">
            {done.name} is in the queue.
            {done.password
              ? " Send them these details — the password can't be recovered later."
              : " They'll be linked to this record the first time they sign up with that email."}
          </p>

          {done.password && (
            <div className="mt-4 rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm text-ink">
              {done.email}
              <br />
              {done.password}
            </div>
          )}

          {done.loginError && (
            <p className="mt-4 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
              The client record was saved, but their login wasn&apos;t created: {done.loginError}
              <br />
              They can still sign up themselves with {done.email} and will be linked to this record.
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => onOpen(done.id)}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-accent-2"
            >
              Open Client
            </button>
            <button
              onClick={reset}
              className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-accent/60"
            >
              Add Another
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <button
        onClick={onBack}
        className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-accent/60"
      >
        ← Back to Queue
      </button>

      <div className="mt-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">New Client</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          First name, last name and email are all that&apos;s required — fill in as much of the
          rest as you have. The client can complete anything you leave blank from their own
          portal, and what you enter here is what the extension autofills with.
        </p>
      </div>

      {error && (
        <p className="mt-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}

      {/* pipeline + access, the bits the client's own form has no say over */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className={card}>
          <div className={cardLabel}>Status</div>
          <select
            className={`${select} mt-2.5`}
            value={status}
            onChange={(e) => setStatus(e.target.value as ClientStatus)}
          >
            {CLIENT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className={card}>
          <div className={cardLabel}>Plan</div>
          <select
            className={`${select} mt-2.5`}
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          >
            <option value="">No plan set</option>
            {plans.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className={card}>
          <div className={cardLabel}>Weeks in plan</div>
          <input
            type="number"
            min={0}
            value={weeksTotal}
            onChange={(e) => setWeeksTotal(e.target.value)}
            placeholder="0"
            className={`${select} mt-2.5`}
          />
        </div>

        <div className={card}>
          <div className={cardLabel}>Assign to</div>
          <select
            className={`${select} mt-2.5`}
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
          >
            <option value="">Unassigned</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.email}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={`${card} mt-4`}>
        <div className={cardLabel}>Portal login</div>
        <label className="mt-3 flex items-start gap-3">
          <input
            type="checkbox"
            checked={makeLogin}
            onChange={(e) => setMakeLogin(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-accent)]"
          />
          <span className="text-sm text-ink">
            Create their login now
            <span className="mt-0.5 block text-xs text-muted">
              Uses the email below. Leave this off and they can sign up themselves with that
              same email — they&apos;ll be linked to this record either way.
            </span>
          </span>
        </label>

        {makeLogin && (
          <div className="mt-4 max-w-sm">
            <label className={editLabel} htmlFor="new-client-password">
              Temporary password
            </label>
            <div className="flex gap-2">
              <input
                id="new-client-password"
                className={select}
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setPassword(genPassword())}
                className="shrink-0 rounded-lg border border-border px-3 text-xs font-semibold text-muted transition hover:text-ink"
              >
                New
              </button>
            </div>
            <p className="mt-2 text-[11px] text-muted">
              Shown once after saving — hand it over, then they can change it.
            </p>
          </div>
        )}
      </div>

      <ClientFieldSections
        draft={draft}
        onChange={(k, v) => setDraft((p) => setDraftField(p, k, v))}
        onToggle={(k, o) => setDraft((p) => toggleDraftOption(p, k, o))}
      />

      <p className="mt-4 text-xs text-muted">
        Work experience, education, the resume and the cover letter are added by the client from
        their own portal.
      </p>

      {/* sticky so Create stays reachable down a long form */}
      <div className="sticky bottom-0 z-30 mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface px-5 py-3.5 shadow-lg">
        <button
          onClick={create}
          disabled={!canSave}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-accent-2 disabled:opacity-40"
        >
          {busy ? "Creating…" : "Create Client"}
        </button>
        <button
          onClick={onBack}
          disabled={busy}
          className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-accent/60 disabled:opacity-60"
        >
          Cancel
        </button>
        <span className="text-xs text-muted">
          {canSave || busy
            ? "Ready to save."
            : "First name, last name and email are needed before saving."}
        </span>
      </div>
    </>
  );
}
