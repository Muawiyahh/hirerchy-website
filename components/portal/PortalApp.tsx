"use client";

import { useEffect, useState } from "react";
import {
  getMyProfile, getMyApplications, saveProfile, signOut,
  type ClientProfile, type AppRow,
} from "@/lib/portal";

import ThemeToggle from "@/components/ThemeToggle";
import PortalProfile from "./PortalProfile";
import PortalOverview from "./PortalOverview";
import PortalTracker from "./PortalTracker";

type View = "onboarding" | "overview" | "tracker" | "profile";

/**
 * Logged-in portal shell. First-time clients see the onboarding form; once
 * they've submitted (clients.submitted_at set), they land on the Overview
 * dashboard with tabs for Overview / Applications / My Profile.
 */
export default function PortalApp() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [apps, setApps] = useState<AppRow[]>([]);
  const [view, setView] = useState<View>("onboarding");
  const [justSubmitted, setJustSubmitted] = useState(false);
  // Sticky for the session once the client has finished onboarding — drives tab
  // visibility so navigating away from Overview never strands them without tabs.
  const [onboarded, setOnboarded] = useState(false);

  async function load() {
    const p = await getMyProfile();
    setProfile(p);
    getMyApplications(p.id).then(setApps).catch(() => {});
    return p;
  }

  useEffect(() => {
    (async () => {
      try {
        const p = await load();
        const done = !!p.submitted_at;
        setOnboarded(done);
        setView(done ? "overview" : "onboarding");
      } catch {
        /* stay on onboarding; the form will surface its own errors */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fired by PortalProfile's "Complete profile" (onboarding) / "Save & return" (edit).
  async function handleComplete() {
    if (!profile) return;
    if (!onboarded) {
      try {
        await saveProfile(profile.id, { submitted_at: new Date().toISOString() });
      } catch { /* non-fatal — tabs work from session state either way */ }
      setJustSubmitted(true);
    }
    setOnboarded(true);
    await load(); // refresh completion % + apps for the overview snapshot
    setView("overview");
    window.scrollTo({ top: 0 });
  }

  function go(v: View) {
    setJustSubmitted(false);
    setView(v);
    window.scrollTo({ top: 0 });
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-border border-t-navy" />
      </div>
    );
  }

  const tabs: { id: View; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "tracker", label: "Applications" },
    { id: "profile", label: "My Profile" },
  ];

  return (
    <div className="staff-canvas min-h-screen bg-bg">
      {/* The site navbar hides itself inside the portal once signed in, so this
          bar is the top of the page — pinning it any lower leaves a dead band
          above it that the page then scrolls through. */}
      <header className="sticky top-0 z-30 bg-navy">
        <div className="flex w-full items-center gap-1.5 px-5 py-3 sm:px-7">
          {onboarded ? (
            tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  view === t.id
                    ? "bg-accent text-navy"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))
          ) : (
            <span className="px-1 text-sm font-semibold text-white">Set up your profile</span>
          )}
          <div className="ml-auto flex items-center gap-2">
          <ThemeToggle className="text-white/60 hover:bg-white/10 hover:text-white" />
          <button
            onClick={() => signOut().then(() => location.reload())}
            className="rounded-lg border border-white/25 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Sign out
          </button>
          </div>
        </div>
      </header>

      {view === "onboarding" && <PortalProfile mode="onboarding" onComplete={handleComplete} />}
      {view === "profile" && <PortalProfile mode="edit" onComplete={handleComplete} />}
      {view === "overview" && profile && (
        <PortalOverview
          profile={profile}
          apps={apps}
          justSubmitted={justSubmitted}
          onGoTracker={() => go("tracker")}
          onGoProfile={() => go("profile")}
        />
      )}
      {view === "tracker" && <PortalTracker apps={apps} />}
    </div>
  );
}
