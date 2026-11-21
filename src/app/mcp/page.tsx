import type { Metadata } from "next";
import InfoPage, { PillLink } from "@/components/web/InfoPage";

export const metadata: Metadata = {
  title: "MCP & AI tools | Vex",
  description: "Connect Gmail, Greenhouse, Drive and your own AI apps to Vex through MCP — with clear, revocable permissions.",
};

export default function McpPage() {
  return (
    <InfoPage
      eyebrow="MCP & AI tools"
      title={<>Connect your tools. <span className="italic text-[#faf6ed]/80">Keep the keys.</span></>}
      lead="Vex uses the Model Context Protocol (MCP) to talk to your email, job boards and AI apps. Every connection shows exactly what it can read, and you can switch it off in one tap."
      image="/images/hephaestus-mcp-forge.jpg"
      actions={
        <>
          <PillLink href="/dashboard/integrations/mcp">Open MCP hub</PillLink>
          <PillLink href="/dashboard?section=mcp" variant="ghost">Try the AI assistant</PillLink>
        </>
      }
      stats={[
        { value: "Read-only", label: "Default access" },
        { value: "1 tap", label: "To revoke a tool" },
        { value: "Every", label: "Action logged" },
        { value: "Never", label: "Auto-submits" },
      ]}
      sections={[
        {
          eyebrow: "Connectors",
          title: "What you can connect",
          items: [
            { icon: "bell", title: "Gmail & Outlook", text: "Reads only recruiter and interview threads so the tracker updates itself." },
            { icon: "search", title: "Greenhouse & job feeds", text: "Pulls fresh roles and checks they're still open." },
            { icon: "doc", title: "Google Drive", text: "Reads only the portfolio folder you choose." },
            { icon: "chart", title: "Calendar", text: "Checks free/busy so you can reply to invites faster." },
            { icon: "spark", title: "Your AI apps", text: "Let ChatGPT, Claude or others read scoped parts of your profile." },
            { icon: "plug", title: "Custom MCP server", text: "Add your own server URL with a written scope." },
          ],
        },
        {
          eyebrow: "How it works",
          title: "Three steps, all in your control",
          layout: "steps",
          tone: "dark",
          items: [
            { title: "Pick a tool", text: "Open the MCP hub and choose what to connect." },
            { title: "Read the scope", text: "See exactly what it can and can't do before you allow it." },
            { title: "Approve each run", text: "The assistant shows its plan; nothing runs until you say yes." },
          ],
        },
        {
          eyebrow: "Safety",
          title: "Rules that never change",
          layout: "list",
          items: [
            { icon: "lock", title: "Outside text is data, never orders", text: "Emails and web pages can't instruct the assistant." },
            { icon: "shield", title: "No silent sending", text: "Vex never submits an application or sends a message for you." },
            { icon: "check", title: "Full activity log", text: "Every action is recorded with time, tool and result." },
          ],
        },
      ]}
      closing={{
        title: "Connect your first tool",
        text: "Start with read-only Gmail so recruiter replies land in your tracker automatically.",
        actions: <PillLink href="/dashboard/integrations/mcp" variant="solid">Open MCP hub</PillLink>,
      }}
    />
  );
}
