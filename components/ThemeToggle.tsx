"use client";

import { useEffect, useState } from "react";

export const THEME_KEY = "hirerchy-theme";

/** Runs before paint (see layout.tsx) so the page never flashes the wrong
 *  theme. Kept here so the script and the toggle can't drift apart. */
export const THEME_BOOT = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

/** Reads what the boot script already decided rather than deciding again.
 *  `null` until mounted, so the icon can't render for the wrong theme. */
function useCurrentTheme(): [boolean | null, (v: boolean) => void] {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setDark(document.documentElement.classList.contains("dark"))
    );
    return () => cancelAnimationFrame(id);
  }, []);
  return [dark, setDark];
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [darkState, setDark] = useCurrentTheme();
  const dark = darkState === true;
  const ready = darkState !== null;

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      /* private mode — the choice just won't persist */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink ${className}`}
    >
      {/* Render nothing until we know the theme, so the icon can't flip on load */}
      {ready &&
        (dark ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
        ))}
    </button>
  );
}
