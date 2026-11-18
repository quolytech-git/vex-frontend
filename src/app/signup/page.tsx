import React from "react";
import type { Metadata } from "next";
import AuthExperience from "@/components/AuthExperience";

export const metadata: Metadata = {
  title: "Sign up | Vex",
  description:
    "Create your Vex workspace and move from essential 4-minute intake to interview-ready in 24 hours.",
};

export default function SignupPage() {
  return <AuthExperience initialMode="signup" />;
}

