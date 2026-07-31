import Image from "next/image";

/** Hirerchy logo tile — the "H" with the briefcase cut into its leg.
 *  The artwork is a navy tile with a white glyph, which disappears on a navy
 *  band, so `onDark` swaps in the inverted variant (white tile, navy glyph). */
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
    <Image
      src={onDark ? "/logo-on-dark.png" : "/logo.png"}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      priority
      className={`block rounded-[22%] ${className}`}
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
      {withMark && <BrandMark size={size === "lg" ? 42 : 32} onDark={onDark} />}
      <span
        className={`font-display font-bold tracking-[0.01em] ${
          onDark ? "text-white" : "text-ink"
        } ${size === "lg" ? "text-[23px]" : "text-lg"}`}
      >
        Hirerchy
      </span>
    </span>
  );
}
