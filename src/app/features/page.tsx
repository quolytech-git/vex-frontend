import type { Metadata } from "next";
import InfoPage, { PillLink } from "@/components/web/InfoPage";
import { InstallAppButton } from "@/components/InstallApp";

export const metadata: Metadata = {
  title: "Features | Vex",
  description: "Everything Vex does to get you interview-ready in 24 hours — jobs, CV, tracker, interviews, learning, AI assistant and more.",
};

export default function FeaturesPage() {
  return (
    <InfoPage
      eyebrow="Features"
      title={<>Everything you need, <span className="italic text-[#faf6ed]/80">nothing invented.</span></>}
      lead="Vex keeps your job search in one calm place: find roles that fit, tailor your CV honestly, track every application, and practise before the interview."
      image="/images/raphael-athens.jpg"
      actions={
        <>
          <PillLink href="/signup">Start free</PillLink>
          <InstallAppButton variant="onDark" />
          <PillLink href="/dashboard" variant="ghost">Open dashboard</PillLink>
        </>
      }
      stats={[
        { value: "24h", label: "Sign-up to interview-ready" },
        { value: "11", label: "Connected workspaces" },
        { value: "0", label: "Invented CV claims" },
        { value: "3", label: "Devices: phone, PC, browser" },
      ]}
      sections={[
        {
          eyebrow: "Find & apply",
          title: "From the right job to a sent application",
          lead: "Each step hands its work to the next, so you never type the same thing twice.",
          items: [
            { icon: "search", title: "Job matching", text: "Duplicates merged across boards. Every role shows its match % and why it fits you.", href: "/dashboard?section=jobs" },
            { icon: "doc", title: "CV & cover letters", text: "Line-by-line suggestions you accept or reject. Unsupported claims are blocked from export.", href: "/dashboard?section=documents" },
            { icon: "check", title: "Honest tracker", text: "Prepared, self-reported and verified applications kept separate, with a calendar and follow-ups.", href: "/dashboard?section=applications" },
            { icon: "puzzle", title: "Chrome extension", text: "Fills job forms from your verified profile and always stops before Submit.", href: "/extension" },
            { icon: "people", title: "Network", text: "Recruiters, warm intros and company briefs, with ready-to-send intro messages.", href: "/dashboard?section=network" },
            { icon: "bell", title: "Smart alerts", text: "Only deadlines and real recruiter replies get through. Snooze the rest.", href: "/dashboard?section=alerts" },
          ],
        },
        {
          eyebrow: "Get better",
          title: "Practise until it feels easy",
          tone: "dark",
          items: [
            { icon: "mic", title: "Interview practice", text: "Role-specific questions, a 2-minute timer, STAR outlines and instant feedback." },
            { icon: "book", title: "Learning path", text: "Watch, practise, check a PDF, ask the tutor. Finished skills move up your CV." },
            { icon: "chart", title: "Readiness score", text: "One number for how ready you are, plus the exact checks still missing." },
          ],
        },
        {
          eyebrow: "AI you control",
          title: "Helpful AI with a human approval gate",
          layout: "list",
          items: [
            { icon: "spark", title: "AI assistant", text: "Plans multi-step tasks and shows each step before anything runs.", tag: "Approval first" },
            { icon: "plug", title: "MCP tools", text: "Connect Gmail, Greenhouse, Drive or your own AI app with clear, revocable scopes." },
            { icon: "shield", title: "Privacy by default", text: "Your data stays in your workspace. Export or reset it any time." },
          ],
        },
        {
          eyebrow: "Everywhere",
          title: "Same Vex on your phone and computer",
          layout: "steps",
          items: [
            { title: "Install on iPhone or Android", text: "Add Vex to your home screen — no app store needed." },
            { title: "Install on PC or Mac", text: "Open Vex in its own window from Chrome or Edge." },
            { title: "Add the Chrome extension", text: "Autofill job forms right where you apply." },
          ],
        },
      ]}
      closing={{
        title: "Ready in 24 hours",
        text: "Create your profile once and Vex prepares the rest. Free to start.",
        actions: (
          <>
            <PillLink href="/signup" variant="solid">Start free</PillLink>
            <InstallAppButton variant="light" />
          </>
        ),
      }}
    />
  );
}
