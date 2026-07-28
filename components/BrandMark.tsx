import Image from "next/image";

/** Hirerchy logo tile — the navy "H" with the briefcase cut into it. Pass
 *  `onDark` when it sits on a navy band so the tile keeps an edge against it. */
export default function BrandMark({
  size = 40,
  className = "",
  onDark = false,
}: {
  size?: number;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      priority
      className={`block rounded-md ${onDark ? "ring-1 ring-white/15" : ""} ${className}`}
      style={{ width: size, height: size }}
    />
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
      {withMark && <BrandMark size={size === "lg" ? 40 : 32} onDark={onDark} />}
      <span
        className={`font-display font-bold tracking-[0.01em] ${
          onDark ? "text-white" : "text-ink"
        } ${size === "lg" ? "text-[19px]" : "text-base"}`}
      >
        Hirerchy
      </span>
    </span>
  );
}
