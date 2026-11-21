"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { useVexWorkspace } from "@/lib/vex-store";
import { EmptyState, KitButton, KitCard } from "@/components/dashboard/kit/Kit";

const FAQ: { topic: string; q: string; a: string; href?: string }[] = [
  { topic: "Getting started", q: "What should I do first?", a: "Open Home and follow the “Next best action” card. It always shows the single most useful step and why.", href: "/dashboard" },
  { topic: "Getting started", q: "Is the data I see real?", a: "Not yet. Jobs, applications and scores marked “Sample data” are examples so you can explore. Nothing is sent to employers." },
  { topic: "Jobs", q: "Why is a job marked “may be closed”?", a: "Vex couldn't confirm the listing is still open when it last checked. Open the original page before applying.", href: "/dashboard?section=jobs" },
  { topic: "Jobs", q: "What does the match % mean?", a: "The share of the job's listed requirements your profile has evidence for. It is not a prediction that you'll be invited." },
  { topic: "CV & letters", q: "Why can't I export my CV?", a: "A suggestion contains a claim your profile doesn't support (for example a number you never entered). Accept a true version or reject it, and export unlocks.", href: "/dashboard?section=documents" },
  { topic: "CV & letters", q: "Does Vex rewrite my CV for me?", a: "Only as suggestions. Every change is shown line by line and nothing is applied until you accept it." },
  { topic: "Applying", q: "Will Vex submit applications for me?", a: "Never. The extension fills supported fields; you check them and press Submit yourself." },
  { topic: "Applying", q: "What's the difference between prepared, self-reported and verified?", a: "Prepared = ready but not sent. Self-reported = you told Vex you sent it. Verified = a confirmation page or email was recorded.", href: "/dashboard?section=applications" },
  { topic: "Extension", q: "Which sites does the extension work on?", a: "Greenhouse and Lever fully, Ashby partly, Workday with manual help. You switch each site on yourself.", href: "/dashboard/extension" },
  { topic: "Interviews", q: "Are the interview scores real feedback?", a: "They rate structure, clarity and relevance of one practice answer against the STAR outline. They don't predict how an interviewer will judge you.", href: "/dashboard?section=interviews" },
  { topic: "Privacy", q: "Where is my data stored?", a: "On this device for now. You can export it as JSON or delete everything from Settings.", href: "/dashboard?section=settings" },
  { topic: "Privacy", q: "How do I stop Vex estimating my skills?", a: "Turn off “Use my CV and answers for skill estimates” in Settings → Your data.", href: "/dashboard?section=settings" },
  { topic: "Account", q: "I forgot my password", a: "Use “Reset your password” — the link expires after 30 minutes.", href: "/forgot-password" },
];

export default function HelpPage() {
  const { setCoachOpen } = useVexWorkspace();
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const [open, setOpen] = useState<string | null>(FAQ[0].q);
  const topics = ["All", ...Array.from(new Set(FAQ.map((f) => f.topic)))];
  const list = useMemo(
    () =>
      FAQ.filter(
        (f) =>
          (topic === "All" || f.topic === topic) &&
          (!query.trim() || (f.q + " " + f.a).toLowerCase().includes(query.toLowerCase()))
      ),
    [query, topic]
  );

  return (
    <DashboardSubpageFrame parentSection="settings" parentLabel="Settings" pageCode="11.3" pageTitle="Help & support" philosopherTag="Themis · Clear answers">
      <div className="mx-auto max-w-[900px] space-y-5">
        <section className="vex-kit rounded-[26px] bg-[#212d3d] p-6 text-[#faf6ed] sm:p-8">
          <h1 className="font-serif-display text-[34px] leading-tight">How can we help?</h1>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, e.g. “export” or “extension”"
            aria-label="Search help"
            className="mt-4 w-full rounded-full border border-white/15 bg-white/10 px-5 py-3 text-[15px] text-[#faf6ed] outline-none placeholder:text-[#faf6ed]/50 focus:border-white/40"
          />
          <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
            {topics.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(t)}
                className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-[12.5px] font-medium ${topic === t ? "bg-[#faf6ed] text-[#212d3d]" : "bg-white/10 text-[#faf6ed]/80"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {list.length === 0 ? (
          <EmptyState title="No answers found" text="Try another word, or contact us and we'll reply within one working day." />
        ) : (
          <ul className="space-y-2">
            {list.map((f) => {
              const isOpen = open === f.q;
              return (
                <li key={f.q} className="overflow-hidden rounded-[18px] border border-[#e3dccb] bg-white">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : f.q)}
                    className="flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-semibold tracking-[0.1em] text-[#7a705c] uppercase">{f.topic}</span>
                      <span className="block text-[15px] font-semibold text-[#212d3d]">{f.q}</span>
                    </span>
                    <span className={`text-[18px] text-[#7a705c] transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-[14px] leading-relaxed text-[#5a6675]">
                      {f.a}
                      {f.href && (
                        <Link href={f.href} className="mt-2 block font-semibold text-[#212d3d]">
                          Go there →
                        </Link>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <KitCard eyebrow="New here?" title="Replay the guided tour">
            <p className="text-[13.5px] text-[#5a6675]">A philosopher guide walks you through every page and button.</p>
            <div className="mt-3">
              <KitButton
                onClick={() => {
                  setCoachOpen(true);
                  window.location.href = "/dashboard";
                }}
              >
                Start tour
              </KitButton>
            </div>
          </KitCard>
          <KitCard tone="cream" eyebrow="Still stuck?" title="Contact support">
            <p className="text-[13.5px] text-[#5a6675]">We reply within one working day. Never share passwords in a message.</p>
            <div className="mt-3">
              <Link href="/contact" className="inline-flex rounded-full bg-[#212d3d] px-4 py-2 text-[13px] font-semibold text-[#faf6ed]">
                Send a message
              </Link>
            </div>
          </KitCard>
        </div>
      </div>
    </DashboardSubpageFrame>
  );
}
