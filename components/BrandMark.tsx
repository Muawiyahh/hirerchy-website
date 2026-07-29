/** Hirerchy "H" brand mark — navy square with a gold lettermark, matching the
 *  Chrome Web Store icon and the admin panel. Pass `onDark` when it sits on a
 *  navy band so the square stays visible. */
export default function BrandMark({
  size = 34,
  className = "",
  onDark = false,
}: {
  size?: number;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect width="40" height="40" rx="11" fill={onDark ? "#1e2f52" : "#0f1f3d"} />
      <path
        d="M13 11v18M27 11v18M13 20h14"
        stroke="#c9a227"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wordmark({
  size = "lg",
  withMark = true,
  onDark = false,
}: {
  size?: "sm" | "lg";
  withMark?: boolean;
  onDark?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      {withMark && <BrandMark size={size === "lg" ? 34 : 28} onDark={onDark} />}
      <span
        className={`font-extrabold tracking-[-0.02em] ${
          onDark ? "text-white" : "text-ink"
        } ${size === "lg" ? "text-xl" : "text-lg"}`}
      >
        Hirerchy
      </span>
    </span>
  );
}
