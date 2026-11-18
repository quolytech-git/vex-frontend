import React from "react";
import type { Metadata } from "next";
import AuthExperience from "@/components/AuthExperience";

export const metadata: Metadata = {
  title: "Log in | Vex",
  description:
    "Access your Vex career workspace — verified profile facts, fresh role fit, tailored CV diffs, and structured mock interview prep.",
};

export default function LoginPage() {
  return <AuthExperience initialMode="login" />;
}

