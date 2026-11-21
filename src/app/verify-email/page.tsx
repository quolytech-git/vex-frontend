import type { Metadata } from "next";
import AccountFlow from "@/components/AccountFlow";

export const metadata: Metadata = { title: "Verify your email | Vex" };

export default function Page() {
  return <AccountFlow mode="verify" />;
}
