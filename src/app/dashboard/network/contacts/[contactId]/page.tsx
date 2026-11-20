"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { StatusPill } from "@/components/dashboard/StatusBadge";

export default function NetworkContactDetailPage() {
  const params = useParams<{ contactId: string }>();
  const { contacts, addContact } = useVexWorkspace();

  const contact =
    contacts.find((c) => c.id === params?.contactId) || contacts[0];

  const [followUpText, setFollowUpText] = useState(
    contact?.nextFollowUp || "In 5 days"
  );
  const [relationshipNotes, setRelationshipNotes] = useState(
    contact?.note || ""
  );
  const [touchLog, setTouchLog] = useState<string[]>([
    "Initial warm/recruiter record created in Stoa Network.",
  ]);
  const [newTouch, setNewTouch] = useState("");
  const [csvNotice, setCsvNotice] = useState("");

  function handleImportContacts(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const raw = typeof reader.result === "string" ? reader.result : "";
      const rows = raw
        .split(/\r?\n/)
        .map((r) => r.trim())
        .filter(Boolean)
        .slice(0, 5);
      let imported = 0;
      rows.forEach((row) => {
        const parts = row.split(",").map((p) => p.trim());
        if (parts[0] && parts[0].toLowerCase() !== "name") {
          addContact({
            id: `nc-imp-${Date.now()}-${imported}`,
            name: parts[0],
            role: parts[1] || "Connection",
            company: parts[2] || "Imported Contact",
            linkedApplication: "Imported Network",
            nextFollowUp: "In 7 days",
            referralPath: "Permission-imported CSV list",
            note: "Imported explicitly by candidate.",
          });
          imported += 1;
        }
      });
      setCsvNotice(
        imported > 0
          ? `Imported ${imported} contacts cleanly into Stoa Network.`
          : `Read "${file.name}". Use CSV rows as Name,Role,Company to batch-add contacts.`
      );
    };
    reader.readAsText(file);
  }

  if (!contact) {
    return (
      <DashboardSubpageFrame
        parentSection="network"
        parentLabel="Network"
        pageCode="06.1"
        pageTitle="Contact Not Found"
        philosopherTag="Plato · Relationship Guild"
      >
        <p>Contact record not found.</p>
      </DashboardSubpageFrame>
    );
  }

  return (
    <DashboardSubpageFrame
      parentSection="network"
      parentLabel="Network & Referrals"
      pageCode="06.1"
      pageTitle={`${contact.name} · ${contact.company}`}
      philosopherTag="Plato · Community & Relationships"
    >
      <div className="space-y-6">
        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow label={`Plato Stoa Dossier · ${contact.company}`} />
                <StatusPill label={contact.referralPath} tone="info" dot={false} />
              </div>
              <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.6rem)] text-[#212d3d]">
                {contact.name}
              </h1>
              <p className="text-[13.5px] text-[#5a6675]">
                {contact.role} · Linked to{" "}
                <strong className="font-medium text-[#212d3d]">
                  {contact.linkedApplication}
                </strong>
              </p>

              <div className="flex flex-wrap gap-2">
                <label className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-4 py-1.5 text-[12px] font-medium text-[#212d3d] hover:border-[#212d3d]">
                  Import Contacts (CSV with Permission)
                  <input id="page-input-1" name="page-input-1" aria-label="page input 1"
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleImportContacts}
                    className="hidden"
                  />
                </label>
                <Link
                  href="/dashboard?section=network"
                  className="rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed]"
                >
                  All Contacts ({contacts.length})
                </Link>
              </div>
              {csvNotice && <StatusPill label={csvNotice} tone="success" />}
            </div>

            <div className="flex justify-start lg:col-span-4 lg:justify-end">
              <img
                src="/images/network-stoa-council.jpg"
                alt="Plato and Council at Stoa"
                className="h-32 w-48 rounded-[18px] border border-[#cfc2a5] object-cover"
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="space-y-4 rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-6 lg:col-span-7">
            <h2 className="font-serif-display text-[22px] text-[#212d3d]">
              Relationship Notes &amp; Follow-up Schedule
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                  Next Follow-Up Window
                </label>
                <input id="page-input-2" name="page-input-2" aria-label="page input 2"
                  value={followUpText}
                  onChange={(e) => setFollowUpText(e.target.value)}
                  className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13px]"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                  Referral Path Provenance
                </label>
                <p className="mt-2 text-[13px] font-medium text-[#175cd3]">
                  {contact.referralPath}
                </p>
              </div>
            </div>
            <textarea id="page-textarea-3" name="page-textarea-3" aria-label="page textarea 3"
              rows={3}
              value={relationshipNotes}
              onChange={(e) => setRelationshipNotes(e.target.value)}
              className="w-full rounded-[12px] border border-[#dad6ca] bg-[#faf6ed] p-3 text-[13px]"
            />

            <div className="border-t border-[#ece5d5] pt-3 space-y-2.5">
              <p className="font-mono text-[10.5px] font-semibold uppercase text-[#7a6b4e]">
                Touchpoint Timeline ({touchLog.length})
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newTouch.trim()) return;
                  setTouchLog((p) => [`Today: ${newTouch.trim()}`, ...p]);
                  setNewTouch("");
                }}
                className="flex gap-2"
              >
                <input id="page-input-4" name="page-input-4" aria-label="page input 4"
                  value={newTouch}
                  onChange={(e) => setNewTouch(e.target.value)}
                  placeholder="Log outreach email, roundtable chat, or referral note..."
                  className="flex-1 rounded-full border border-[#dad6ca] bg-[#faf6ed] px-4 py-1.5 text-[12.5px]"
                />
                <button
                  type="submit"
                  className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] text-[#faf6ed]"
                >
                  Log Touch
                </button>
              </form>
              <ul className="space-y-1.5 text-[12.5px] text-[#212d3d]">
                {touchLog.map((t, i) => (
                  <li
                    key={i}
                    className="rounded-[10px] bg-[#faf6ed] px-3 py-2"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <aside className="space-y-3 rounded-[22px] border border-[#dad6ca] bg-[#f4efe3] p-6 lg:col-span-5">
            <h3 className="font-serif-display text-[20px] text-[#212d3d]">
              All Network Contacts ({contacts.length})
            </h3>
            <div className="space-y-2">
              {contacts.map((c) => (
                <Link
                  key={c.id}
                  href={`/dashboard/network/contacts/${c.id}`}
                  className={`block rounded-[14px] border p-3 text-[12.5px] ${
                    c.id === contact.id
                      ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed]"
                      : "border-[#dfd4be] bg-white text-[#212d3d]"
                  }`}
                >
                  <p className="font-medium">
                    {c.name} · {c.company}
                  </p>
                  <p className="text-[11px] opacity-80">{c.role}</p>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </DashboardSubpageFrame>
  );
}
