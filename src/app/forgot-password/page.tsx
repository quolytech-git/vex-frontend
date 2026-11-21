import type { Metadata } from "next";
import AccountFlow from "@/components/AccountFlow";

export const metadata: Metadata = { title: "Reset your password | Vex" };

export default function Page() {
  return <AccountFlow mode="forgot" />;
}
