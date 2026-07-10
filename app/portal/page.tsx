"use client";

import { useEffect, useState } from "react";
import { getSession, portalConfigured } from "@/lib/portal";
import PortalAuth from "@/components/portal/PortalAuth";
import PortalProfile from "@/components/portal/PortalProfile";

export default function PortalPage() {
  const [state, setState] = useState<"loading" | "auth" | "in">(
    portalConfigured ? "loading" : "auth"
  );

  useEffect(() => {
    if (!portalConfigured) return;
    getSession()
      .then((s) => setState(s ? "in" : "auth"))
      .catch(() => setState("auth"));
  }, []);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-white/15 border-t-violet-400" />
      </div>
    );
  }
  if (state === "in") return <PortalProfile />;
  return <PortalAuth onAuthed={() => setState("in")} />;
}
