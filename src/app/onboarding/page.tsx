import React from "react";
import type { Metadata } from "next";
import OnboardingExperience from "@/components/OnboardingExperience";

export const metadata: Metadata = {
  title: "Onboarding | Vex",
  description:
    "Four-minute essential intake with Vex — capture verified baseline facts once, choose your career track, and calibrate your Day 01 readiness workflow.",
};

export default function OnboardingPage() {
  return <OnboardingExperience />;
}
