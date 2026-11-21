"use client";

import React, { useEffect, useState } from "react";
import { KitButton, KitCard, Modal, Pill } from "./Kit";

/* ================================================================== */
/*  EXTENSION · per-site permissions, data disclosure, popup preview   */
/* ================================================================== */

const SITES = [
  { host: "boards.greenhouse.io", name: "Greenhouse", support: "Supported" },
  { host: "jobs.lever.co", name: "Lever", support: "Supported" },
  { host: "jobs.ashbyhq.com", name: "Ashby", support: "Partial" },
  { host: "myworkdayjobs.com", name: "Workday", support: "Manual assist" },
] as const;

const SITE_KEY = "vex_ext_site_permissions";

export function ExtensionSitePermissions() {
  const [allowed, setAllowed] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try {
      setAllowed(JSON.parse(localStorage.getItem(SITE_KEY) || "{}"));
    } catch {
      /* ignore */
    }
  }, []);
  function toggle(host: string) {
    setAllowed((prev) => {
      const next = { ...prev, [host]: !prev[host] };
      try {
        localStorage.setItem(SITE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }
  return (
    <KitCard eyebrow="You choose where it works" title="Site permissions">
      <ul className="divide-y divide-[#ece5d5]">
        {SITES.map((s) => {
          const on = Boolean(allowed[s.host]);
          return (
            <li key={s.host} className="flex items-center gap-3 py-3">
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-[14px] font-medium text-[#212d3d]">
                  {s.name}
                  <Pill tone={s.support === "Supported" ? "good" : s.support === "Partial" ? "warn" : "neutral"}>{s.support}</Pill>
                </span>
                <span className="block truncate text-[12px] text-[#7a705c]">{s.host}</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={`Allow on ${s.name}`}
                onClick={() => toggle(s.host)}
                className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full ${on ? "bg-[#067647]" : "bg-[#d6cfbf]"}`}
              >
                <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-[12px] text-[#7a705c]">Off by default. The extension only acts on sites you switch on, and only when you click it.</p>
    </KitCard>
  );
}

export function ExtensionDisclosure() {
  return (
    <KitCard tone="cream" eyebrow="Plain words" title="What the extension reads">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-[14px] bg-white p-3.5">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-[#067647] uppercase">Reads</p>
          <ul className="mt-1.5 space-y-1 text-[13px] text-[#212d3d]">
            <li>• The application form you opened</li>
            <li>• Field labels, to match them to your profile</li>
            <li>• The confirmation page, if you allow it</li>
          </ul>
        </div>
        <div className="rounded-[14px] bg-white p-3.5">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-[#b42318] uppercase">Never reads</p>
          <ul className="mt-1.5 space-y-1 text-[13px] text-[#212d3d]">
            <li>• Passwords or payment details</li>
            <li>• Other tabs or your browsing history</li>
            <li>• Sites you haven't switched on</li>
          </ul>
        </div>
      </div>
      <p className="mt-3 text-[12px] text-[#5a6675]">Sends to Vex: which fields were filled and whether you marked it submitted. Never auto-fills sensitive questions (disability, ethnicity, right to work).</p>
    </KitCard>
  );
}

type PopupState = "found" | "review" | "unsupported";

export function ExtensionPopupPreview() {
  const [state, setState] = useState<PopupState>("found");
  return (
    <KitCard
      eyebrow="Preview"
      title="The extension popup"
      action={
        <div className="no-scrollbar flex gap-1 overflow-x-auto">
          {(["found", "review", "unsupported"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setState(s)}
              className={`shrink-0 cursor-pointer rounded-full px-3 py-1 text-[12px] font-medium ${state === s ? "bg-[#212d3d] text-[#faf6ed]" : "bg-[#f2eee2] text-[#5a6675]"}`}
            >
              {s === "found" ? "Job found" : s === "review" ? "Review" : "Unsupported"}
            </button>
          ))}
        </div>
      }
    >
      <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[20px] border border-[#d6cbb2] bg-[#faf6ed] shadow-lg">
        <div className="flex items-center justify-between bg-[#212d3d] px-4 py-3 text-[#faf6ed]">
          <span className="font-serif-display text-[19px]">Vex</span>
          <span className={`h-2.5 w-2.5 rounded-full ${state === "unsupported" ? "bg-[#f97066]" : "bg-[#4ade80]"}`} />
        </div>
        <div className="space-y-2 p-4 text-[13px]">
          {state === "found" && (
            <>
              <p className="font-semibold text-[#212d3d]">Supported page found</p>
              {["Role: Product Operations Lead", "Company: Northbridge Systems", "Source: employer site", "Not saved yet"].map((r) => (
                <p key={r} className="rounded-[10px] bg-white px-3 py-2 text-[#5a6675]">{r}</p>
              ))}
              <button type="button" className="mt-1 w-full rounded-full bg-[#212d3d] py-2.5 font-semibold text-[#faf6ed]">Save to Vex</button>
            </>
          )}
          {state === "review" && (
            <>
              <p className="font-semibold text-[#212d3d]">Review before you continue</p>
              <p className="rounded-[10px] bg-[#067647]/10 px-3 py-2 text-[#067647]">Filled: 14 fields</p>
              <p className="rounded-[10px] bg-[#b54708]/10 px-3 py-2 text-[#b54708]">Needs your answer: 3</p>
              <p className="rounded-[10px] bg-[#f2eee2] px-3 py-2 text-[#5a6675]">Needs approval: 2</p>
              <p className="rounded-[10px] bg-[#b42318]/8 px-3 py-2 text-[#b42318]">Not detected: 1</p>
              <button type="button" className="mt-1 w-full rounded-full bg-[#212d3d] py-2.5 font-semibold text-[#faf6ed]">Review fields</button>
              <p className="text-center text-[11px] text-[#7a705c]">You press Submit on the site yourself.</p>
            </>
          )}
          {state === "unsupported" && (
            <>
              <p className="font-semibold text-[#212d3d]">This form isn't supported yet</p>
              <p className="rounded-[10px] bg-[#b42318]/8 px-3 py-2 text-[#b42318]">We can't fill it safely</p>
              <p className="rounded-[10px] bg-white px-3 py-2 text-[#5a6675]">Your details are ready to copy</p>
              <button type="button" className="mt-1 w-full rounded-full bg-[#212d3d] py-2.5 font-semibold text-[#faf6ed]">Open application pack</button>
            </>
          )}
        </div>
      </div>
      <p className="mt-3 text-center text-[12px] text-[#7a705c]">This is how the popup will look in Chrome. The real extension arrives with the store release.</p>
    </KitCard>
  );
}

/* ================================================================== */
/*  RESUME · confirm parsed CV                                         */
/* ================================================================== */

export interface ParsedField {
  key: string;
  label: string;
  value: string;
  sourceLine: string;
}

export function ParsedCvConfirm({
  open,
  onClose,
  fileName,
  fields,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  fileName: string;
  fields: ParsedField[];
  onConfirm: (values: Record<string, string>) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [ok, setOk] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (open) {
      setValues(Object.fromEntries(fields.map((f) => [f.key, f.value])));
      setOk({});
    }
  }, [open, fields]);
  const confirmed = fields.filter((f) => ok[f.key]).length;

  return (
    <Modal open={open} onClose={onClose} title="Confirm your CV facts" wide>
      <p className="text-[13px] text-[#5a6675]">
        Read from <strong className="text-[#212d3d]">{fileName}</strong>. Check each fact against the original line — Vex only uses facts you confirm.
      </p>
      <ul className="mt-4 space-y-3">
        {fields.map((f) => (
          <li key={f.key} className={`rounded-[16px] border bg-white p-3.5 ${ok[f.key] ? "border-[#067647]/40" : "border-[#e3dccb]"}`}>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.1em] text-[#7a705c] uppercase">In your file</p>
                <p className="mt-1 rounded-[10px] bg-[#faf6ed] px-3 py-2 font-mono text-[12px] text-[#5a6675]">{f.sourceLine || "—"}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-[0.1em] text-[#7a705c] uppercase">{f.label}</p>
                <input
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  className="mt-1 w-full rounded-[10px] border border-[#d6cbb2] px-3 py-2 text-[13.5px] text-[#212d3d] outline-none focus:border-[#212d3d]"
                />
              </div>
            </div>
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-[12.5px] text-[#212d3d]">
              <input type="checkbox" checked={Boolean(ok[f.key])} onChange={(e) => setOk((o) => ({ ...o, [f.key]: e.target.checked }))} className="h-4 w-4 accent-[#067647]" />
              This is correct
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[12.5px] text-[#5a6675]">{confirmed} of {fields.length} confirmed</span>
        <div className="flex gap-2">
          <KitButton variant="light" onClick={onClose}>Later</KitButton>
          <KitButton onClick={() => { onConfirm(values); onClose(); }} disabled={confirmed === 0}>Use confirmed facts</KitButton>
        </div>
      </div>
    </Modal>
  );
}
