import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard | Vex",
  description:
    "Your Vex 24-hour interview-readiness workspace — honest tracker, deduplicated jobs, CV truth diffs, mock interviews, living skill tiers, and MCP controls.",
};

export default function DashboardPage() {
  return <DashboardShell />;
}

