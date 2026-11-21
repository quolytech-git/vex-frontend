import type { Metadata } from "next";
import AccountFlow from "@/components/AccountFlow";

export const metadata: Metadata = { title: "Choose a new password | Vex" };

export default function Page() {
  return <AccountFlow mode="reset" />;
}
