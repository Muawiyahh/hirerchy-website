"use client";

/**
 * A timestamp rendered in the reader's own locale and timezone.
 *
 * The server has no idea what those are, so it formats in UTC and the browser
 * then formats differently — React sees the text change and throws a hydration
 * mismatch. `suppressHydrationWarning` is the sanctioned escape hatch for
 * exactly this case: the server output is a reasonable placeholder and the
 * client's value is the one that matters.
 */
export default function LocalTime({
  value,
  dateOnly = false,
  className = "",
}: {
  value: string;
  dateOnly?: boolean;
  className?: string;
}) {
  const d = new Date(value);
  const text = Number.isNaN(d.getTime())
    ? value
    : dateOnly
      ? d.toLocaleDateString()
      : d.toLocaleString();

  return (
    <span suppressHydrationWarning className={className}>
      {text}
    </span>
  );
}
