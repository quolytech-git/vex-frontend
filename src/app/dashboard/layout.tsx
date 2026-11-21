"use client";

import React from "react";
import { VexWorkspaceProvider } from "@/lib/vex-store";
import PersistentTabBar from "@/components/mobile/PersistentTabBar";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VexWorkspaceProvider>
      {children}
      {/* Mounted once for every dashboard page, so it never flickers between pages. */}
      <PersistentTabBar />
    </VexWorkspaceProvider>
  );
}
