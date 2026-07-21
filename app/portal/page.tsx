"use client";

import { useEffect, useState } from "react";
import { getSession, portalConfigured } from "@/lib/portal";
import PortalAuth from "@/components/portal/PortalAuth";
import PortalApp from "@/components/portal/PortalApp";

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-border border-t-navy" />
      </div>
    );
  }
  if (state === "in") return <PortalApp />;
  return <PortalAuth onAuthed={() => setState("in")} />;
}
