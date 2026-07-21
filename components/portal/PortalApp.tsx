"use client";

import { useEffect, useState } from "react";
import {
  getMyProfile, getMyApplications, saveProfile, signOut,
  type ClientProfile, type AppRow,
} from "@/lib/portal";
import { completionFromProfile } from "./config";
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

  const name = profile?.first_name || "";
  const pct = profile ? completionFromProfile(profile) : 0;

  const tabs: { id: View; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "tracker", label: "Applications" },
    { id: "profile", label: "My Profile" },
  ];

  return (
    <div className="min-h-[calc(100vh-68px)]">
      {/* sub-bar under the site navbar (68px) */}
      <header className="sticky top-[68px] z-20 border-b border-border bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-1 px-5 py-2 sm:px-8">
          {onboarded ? (
            tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  view === t.id ? "bg-navy text-white" : "text-muted hover:bg-surface-2 hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))
          ) : (
            <span className="px-1 text-sm font-semibold text-ink">Set up your profile</span>
          )}
          <button
            onClick={() => signOut().then(() => location.reload())}
            className="ml-auto rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </header>

      {view === "onboarding" && <PortalProfile mode="onboarding" onComplete={handleComplete} />}
      {view === "profile" && <PortalProfile mode="edit" onComplete={handleComplete} />}
      {view === "overview" && profile && (
        <PortalOverview
          name={name}
          completionPct={pct}
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
