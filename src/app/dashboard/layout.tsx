"use client";

import React from "react";
import { VexWorkspaceProvider } from "@/lib/vex-store";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VexWorkspaceProvider>{children}</VexWorkspaceProvider>;
}
