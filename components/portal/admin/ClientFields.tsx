"use client";

import { SECTIONS, type Field } from "../config";
import { COUNTRIES, statesFor } from "@/lib/portalData";
import type { ClientProfile } from "@/lib/portal";

/* Shared admin form styling, so the create and edit forms can't drift apart. */
export const select =
  "w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2.5 text-sm font-medium text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";
export const card = "rounded-lg border border-border bg-surface p-5 shadow-sm";
export const cardLabel = "text-xs font-semibold uppercase tracking-[0.1em] text-muted";
export const editLabel = "mb-1.5 block text-xs font-semibold text-muted";
const pill = "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition";

/** Both admin client forms are driven by the client's own intake config, so
 *  what an admin types lands in the same columns the extension autofills from
 *  and there's no second field list to drift. The repeater sections
 *  (experience, education) and the file uploads have no `fields`, so they fall
 *  out here; those stay with the client. */
export const EDIT_SECTIONS = SECTIONS.filter((s) => s.fields?.length).map((s) =>
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

export const EDIT_FIELDS: Field[] = EDIT_SECTIONS.flatMap((s) => s.fields!);

/** NOT NULL columns — blanking these has to write "" rather than null. */
const NEVER_NULL = new Set(["first_name", "last_name"]);

/** How a column's stored value looks in the form, so "changed?" compares like
 *  with like. skills is a jsonb array everywhere else; the form edits it as a
 *  comma-separated string. */
export function asText(profile: ClientProfile | null, key: string): string {
  const v = profile?.[key];
  if (v == null) return "";
  return Array.isArray(v) ? v.join(", ") : String(v);
}

/** A blank draft for every field the form covers. */
export function emptyDraft(): Record<string, string> {
  const d: Record<string, string> = {};
  for (const f of EDIT_FIELDS) d[f.name] = "";
  return d;
}

export function draftFrom(profile: ClientProfile | null): Record<string, string> {
  const d: Record<string, string> = {};
  for (const f of EDIT_FIELDS) d[f.name] = asText(profile, f.name);
  return d;
}

/**
 * Only what actually changed. Pass `base` as null when creating, where every
 * non-empty field counts as a change and empty ones are simply left off so the
 * column defaults apply.
 */
export function buildPatch(
  draft: Record<string, string>,
  base: ClientProfile | null
): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  for (const f of EDIT_FIELDS) {
    const next = (draft[f.name] ?? "").trim();
    if (next === asText(base, f.name).trim()) continue;
    if (f.name === "skills") {
      patch.skills = next.split(",").map((s) => s.trim()).filter(Boolean);
    } else if (NEVER_NULL.has(f.name)) {
      patch[f.name] = next;
    } else {
      patch[f.name] = next === "" ? null : next;
    }
  }
  return patch;
}

/** States are per-country, so the old one can't survive a country change. */
export function setDraftField(
  prev: Record<string, string>,
  key: string,
  value: string
): Record<string, string> {
  return key === "country" ? { ...prev, country: value, state: "" } : { ...prev, [key]: value };
}

export function toggleDraftOption(
  prev: Record<string, string>,
  key: string,
  option: string
): Record<string, string> {
  const on = (prev[key] || "").split(",").map((s) => s.trim()).filter(Boolean);
  const next = on.includes(option) ? on.filter((o) => o !== option) : [...on, option];
  return { ...prev, [key]: next.join(", ") };
}

export function genPassword() {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 14 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

/** Every editable section as a stack of cards. */
export function ClientFieldSections({
  draft,
  onChange,
  onToggle,
}: {
  draft: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onToggle: (key: string, option: string) => void;
}) {
  return (
    <>
      {EDIT_SECTIONS.map((s) => (
        <section key={s.id} className={`${card} mt-4`}>
          <h2 className="text-lg font-bold text-ink">{s.title}</h2>
          {s.hint && <p className="mt-1 text-xs text-muted">{s.hint}</p>}
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {s.fields!.map((f) => (
              <div
                key={f.name}
                className={f.type === "multiselect" || f.full ? "sm:col-span-2 xl:col-span-3" : ""}
              >
                <EditField
                  field={f}
                  value={draft[f.name] ?? ""}
                  country={draft.country || "United States"}
                  onChange={(v) => onChange(f.name, v)}
                  onToggle={(o) => onToggle(f.name, o)}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

/** One editable field, rendered the way the client's own form renders it —
 *  same control, same options, so the stored value matches either way. */
export function EditField({
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
