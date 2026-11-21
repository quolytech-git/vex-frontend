"use client";

import React from "react";

// Page changes are animated by the cloud transition (PageTransition), so the
// template no longer re-animates every page — that caused a visible jump.
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
