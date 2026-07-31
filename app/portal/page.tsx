"use client";

import { useCallback, useEffect, useState } from "react";
import { getSession, getMyRole, portal, portalConfigured, type Role } from "@/lib/portal";
import PortalAuth from "@/components/portal/PortalAuth";
import PortalApp from "@/components/portal/PortalApp";
import AdminApp from "@/components/portal/admin/AdminApp";
import EmployeeApp from "@/components/portal/employee/EmployeeApp";

/** Null when there's no session; otherwise the role to render. */
async function resolveRole(): Promise<Role | null> {
  const session = await getSession();
  if (!session) return null;
  return getMyRole();
}

/**
 * One entry point for all three roles. After sign-in we read `profiles.role`
 * and hand off to the matching dashboard — clients get the portal, employees
 * their assigned-client list, the owner the full admin panel.
 */
export default function PortalPage() {
  const [state, setState] = useState<"loading" | "auth" | "in">(
    portalConfigured ? "loading" : "auth"
  );
  const [role, setRole] = useState<Role>("client");
  const [signedOut, setSignedOut] = useState(false);

  // Resolved outside the component so the mount effect never sets state
  // synchronously — it only settles in a promise callback.
  const resolve = useCallback(
    () =>
      resolveRole()
        .then((r) => {
          if (!r) {
            setState("auth");
            return;
          }
          setRole(r);
          setState("in");
        })
        .catch(() => setState("auth")),
    []
  );

  // Signing out used to call location.reload(), which tore the whole app down
  // and rebuilt it — that full round trip is the flash. Supabase fires
  // SIGNED_OUT locally the moment the session is cleared, so swapping straight
  // to the auth view is instant and nothing remounts that doesn't have to.
  useEffect(() => {
    if (!portalConfigured) return;
    const { data } = portal().auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setRole("client");
        setSignedOut(true);
        setState("auth");
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!portalConfigured) return;
    let alive = true;
    resolveRole()
      .then((r) => {
        if (!alive) return;
        if (!r) {
          setState("auth");
          return;
        }
        setRole(r);
        setState("in");
      })
      .catch(() => alive && setState("auth"));
    return () => {
      alive = false;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-border border-t-navy" />
      </div>
    );
  }

  if (state === "in") {
    if (role === "owner") return <AdminApp />;
    if (role === "employee") return <EmployeeApp />;
    return <PortalApp />;
  }

  return (
    <PortalAuth
      defaultMode={signedOut ? "signin" : undefined}
      onAuthed={() => {
        setSignedOut(false);
        setState("loading");
        resolve();
      }}
    />
  );
}
