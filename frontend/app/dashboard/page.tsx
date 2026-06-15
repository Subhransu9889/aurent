import type { Metadata } from "next";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard | Aurent",
  description:
    "Your Aurent command center for inbox triage, calendar planning, and AI agent work.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
