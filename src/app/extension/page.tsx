import type { Metadata } from "next";
import InfoPage, { PillLink } from "@/components/web/InfoPage";

export const metadata: Metadata = {
  title: "Chrome extension | Vex",
  description: "Vex Apply fills job application forms from your verified profile and always stops before Submit.",
};

export default function ExtensionPage() {
  return (
    <InfoPage
      eyebrow="Vex Apply · Chrome extension"
      title={<>Fill job forms in seconds. <span className="italic text-[#faf6ed]/80">You press Submit.</span></>}
      lead="Vex Apply fills long application forms from your verified profile and attaches the right CV and cover letter. It always stops before Submit so you can check everything."
      image="/images/hermes-messenger-alerts.jpg"
      actions={
        <>
          <PillLink href="/dashboard/extension">Add to Chrome</PillLink>
          <PillLink href="/dashboard/apply/tutorial" variant="ghost">See how it works</PillLink>
        </>
      }
      stats={[
        { value: "~15 min", label: "Saved per application" },
        { value: "4", label: "Supported portals" },
        { value: "0", label: "Auto-submits" },
        { value: "Desktop", label: "Chrome & Edge" },
      ]}
      sections={[
        {
          eyebrow: "What it does",
          title: "The boring part, done for you",
          items: [
            { icon: "doc", title: "Fills your details", text: "Name, contact, work history and education from your profile." },
            { icon: "check", title: "Attaches the right files", text: "The tailored CV and cover letter for that exact job." },
            { icon: "bell", title: "Flags what needs you", text: "Screening questions and anything it isn't sure about are left for you." },
            { icon: "shield", title: "Stops before Submit", text: "A hard lock: the extension can never press Submit." },
            { icon: "chart", title: "Logs the submission", text: "Tick “I submitted” and the tracker marks it verified." },
            { icon: "lock", title: "Skips sensitive fields", text: "Diversity and other sensitive questions are never auto-filled." },
          ],
        },
        {
          eyebrow: "Install",
          title: "Ready in under a minute",
          layout: "steps",
          tone: "dark",
          items: [
            { title: "Add to Chrome", text: "Open the install page in the dashboard on your computer." },
            { title: "Pin it", text: "Pin Vex Apply to your toolbar so it's one click away." },
            { title: "Open a job form", text: "Click the Vex icon, check the fields, then press Submit yourself." },
          ],
        },
        {
          eyebrow: "Works with",
          title: "Supported job portals",
          layout: "list",
          items: [
            { icon: "check", title: "Greenhouse", text: "Full profile, CV, cover letter and custom text questions.", tag: "Supported" },
            { icon: "check", title: "Lever", text: "Contact, portfolio links and CV upload.", tag: "Supported" },
            { icon: "check", title: "Ashby", text: "Core profile; some custom fields need a manual check.", tag: "Partial" },
            { icon: "lock", title: "Workday & custom SSO", text: "Detects the login wall and hands over to you.", tag: "Manual assist" },
          ],
        },
      ]}
      closing={{
        title: "On your phone?",
        text: "The extension runs on desktop Chrome and Edge. On your phone, use the Vex app to prepare everything and finish on your computer.",
        actions: (
          <>
            <PillLink href="/dashboard/extension" variant="solid">Install on computer</PillLink>
            <PillLink href="/download" variant="outline">Get the phone app</PillLink>
          </>
        ),
      }}
    />
  );
}
