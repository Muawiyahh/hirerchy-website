"use client";

import { useCallback, useEffect, useState } from "react";
import StaffShell from "../StaffShell";
import AdminClients from "./AdminClients";
import AdminClientDetail from "./AdminClientDetail";
import AdminEmployees from "./AdminEmployees";
import AdminOperations from "./AdminOperations";
import AdminMessages from "./AdminMessages";
import {
  getStaffClients, listStaff, getAssignments, getAllMessages, getEmployeeUpdates,
  type ClientRow, type StaffRow, type AssignmentRow, type MessageRow, type EmployeeUpdateRow,
} from "@/lib/portal";

export type AdminTab = "clients" | "employees" | "operations" | "messages";

const TABS = [
  { id: "clients" as const, label: "Client queue" },
  { id: "employees" as const, label: "Employees" },
  { id: "operations" as const, label: "Operations" },
  { id: "messages" as const, label: "Messages" },
];

export interface AdminData {
  clients: ClientRow[];
  staff: StaffRow[];
  assignments: AssignmentRow[];
  messages: MessageRow[];
  updates: EmployeeUpdateRow[];
}

const EMPTY: AdminData = { clients: [], staff: [], assignments: [], messages: [], updates: [] };

/** Plain fetch, outside the component, so the mount effect and the refresh
 *  callback share it without either setting state synchronously. */
async function fetchAll(): Promise<AdminData> {
  const [clients, staff, assignments, messages, updates] = await Promise.all([
    getStaffClients(), listStaff(), getAssignments(), getAllMessages(), getEmployeeUpdates(),
  ]);
  return { clients, staff, assignments, messages, updates };
}

const errText = (e: unknown) =>
  e instanceof Error ? e.message : "Could not load the dashboard.";

/** Owner dashboard. Everything the extension's admin panel did, plus the
 *  pipeline, week counters and the client message thread. */
export default function AdminApp() {
  const [tab, setTab] = useState<AdminTab>("clients");
  const [openClient, setOpenClient] = useState<string | null>(null);
  const [data, setData] = useState<AdminData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(
    () =>
      fetchAll()
        .then((d) => {
          setData(d);
          setError("");
        })
        .catch((e) => setError(errText(e)))
        .finally(() => setLoading(false)),
    []
  );

  useEffect(() => {
    let alive = true;
    fetchAll()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(errText(e)))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const unreadFromClients = data.messages.filter(
    (m) => m.sender_role === "client" && !m.read_at
  ).length;

  const tabsWithBadge = TABS.map((t) =>
    t.id === "messages" ? { ...t, badge: unreadFromClients } : t
  );

  const detail = openClient ? data.clients.find((c) => c.id === openClient) : null;

  return (
    <StaffShell
      label="Manager"
      tabs={tabsWithBadge}
      active={tab}
      onSelect={(t) => {
        setTab(t);
        setOpenClient(null);
      }}
    >
      {error && (
        <p className="mb-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-border border-t-navy" />
        </div>
      ) : detail ? (
        <AdminClientDetail
          client={detail}
          staff={data.staff}
          assignments={data.assignments}
          onBack={() => setOpenClient(null)}
          onChanged={load}
        />
      ) : (
        <>
          {tab === "clients" && (
            <AdminClients data={data} onOpen={setOpenClient} onChanged={load} />
          )}
          {tab === "employees" && <AdminEmployees data={data} onChanged={load} />}
          {tab === "operations" && (
            <AdminOperations data={data} onOpen={setOpenClient} onChanged={load} />
          )}
          {tab === "messages" && <AdminMessages data={data} onChanged={load} />}
        </>
      )}
    </StaffShell>
  );
}
