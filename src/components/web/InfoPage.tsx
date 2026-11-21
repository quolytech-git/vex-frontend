import React from "react";
import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";

/* ------------------------------------------------------------------ */
/*  Shared layout for the public product pages (Features, MCP,         */
/*  Extension, Download). Same structure on phone and PC — it just     */
/*  stacks on small screens.                                            */
/* ------------------------------------------------------------------ */

export interface InfoItem {
  title: string;
  text: string;
  icon?: string; // emoji-free short glyph name from ICONS below
  href?: string;
  tag?: string;
}

export interface InfoSection {
  eyebrow: string;
  title: string;
  lead?: string;
  layout?: "grid" | "steps" | "list";
  items: InfoItem[];
  tone?: "light" | "dark";
}

const ICONS: Record<string, string> = {
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3",
  doc: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4",
  check: "M9 4.5H7a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6.5a2 2 0 0 0-2-2h-2M9 3h6v3.5H9zM9 14l2 2 4-4",
  mic: "M9 3h6v11H9zM5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21",
  book: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5zM4 19a2.5 2.5 0 0 1 2.5-2.5H20",
  people: "M9 5.3a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zM3 20a6 6 0 0 1 12 0M16 4.8a3.2 3.2 0 0 1 0 6.4M18 14.5a6 6 0 0 1 3 5.5",
  spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  plug: "M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4",
  puzzle: "M10 3h4v3a2 2 0 1 0 4 0V3h3v7h-3a2 2 0 1 0 0 4h3v7h-7v-3a2 2 0 1 0-4 0v3H3v-7h3a2 2 0 1 0 0-4H3V3z",
  phone: "M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2",
  laptop: "M4 5h16v11H4zM2 19h20",
  lock: "M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
};

export function InfoIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name] || ICONS.spark} />
    </svg>
  );
}

export default function InfoPage({
  eyebrow,
  title,
  lead,
  image,
  actions,
  stats,
  sections,
  closing,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead: string;
  image?: string;
  actions: React.ReactNode;
  stats?: { value: string; label: string }[];
  sections: InfoSection[];
  closing?: { title: string; text: string; actions: React.ReactNode };
}) {
  return (
    <div className="bg-[#faf6ed]">
      {/* Hero */}
      <section className="px-2.5 pt-[76px] pb-2.5">
        <div className="relative overflow-hidden rounded-[30px] bg-[#12222e] text-[#faf6ed]">
          {image && (
            <img src={image} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35" />
          )}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#12222e]/40 via-[#12222e]/70 to-[#12222e]" />
          <div className="relative z-10 mx-auto max-w-[1180px] px-5 pt-14 pb-10 sm:px-9 lg:px-12 lg:pt-24 lg:pb-16">
            <Eyebrow label={eyebrow} tone="dark" />
            <h1 className="mt-4 max-w-[18ch] font-serif-display text-[clamp(2.4rem,5.4vw,4.6rem)] leading-[1.04] tracking-[-0.03em]">
              {title}
            </h1>
            <p className="mt-4 max-w-[56ch] text-[16px] leading-[1.6] text-[#faf6ed]/80 sm:text-[17px]">{lead}</p>
            <div className="mt-7 flex flex-wrap items-center gap-2.5">{actions}</div>
            {stats && (
              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
                    <p className="font-serif-display text-[28px] leading-none">{s.value}</p>
                    <p className="mt-1.5 text-[12px] text-[#faf6ed]/65">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sections */}
      {sections.map((sec) => {
        const dark = sec.tone === "dark";
        return (
          <section key={sec.title} className={`px-2.5 ${dark ? "py-2.5" : ""}`}>
            <div className={`${dark ? "rounded-[30px] bg-[#212d3d] text-[#faf6ed]" : ""}`}>
              <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-8 lg:py-20">
                <Eyebrow label={sec.eyebrow} tone={dark ? "dark" : "light"} />
                <h2 className={`mt-3 max-w-[22ch] font-serif-display text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.06] tracking-[-0.025em] ${dark ? "" : "text-[#212d3d]"}`}>
                  {sec.title}
                </h2>
                {sec.lead && (
                  <p className={`mt-3 max-w-[60ch] text-[15.5px] leading-[1.6] ${dark ? "text-[#faf6ed]/75" : "text-[#5a6675]"}`}>{sec.lead}</p>
                )}

                {sec.layout === "steps" ? (
                  <ol className="mt-9 grid grid-cols-1 gap-3 md:grid-cols-3">
                    {sec.items.map((it, i) => (
                      <li key={it.title} className={`rounded-[22px] p-5 ${dark ? "bg-white/[0.06]" : "border border-[#e3dccb] bg-white"}`}>
                        <span className={`flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-semibold ${dark ? "bg-[#e3cea0] text-[#212d3d]" : "bg-[#212d3d] text-[#faf6ed]"}`}>
                          {i + 1}
                        </span>
                        <p className="mt-4 text-[17px] font-semibold">{it.title}</p>
                        <p className={`mt-1.5 text-[14px] leading-[1.55] ${dark ? "text-[#faf6ed]/70" : "text-[#5a6675]"}`}>{it.text}</p>
                      </li>
                    ))}
                  </ol>
                ) : sec.layout === "list" ? (
                  <ul className={`mt-8 divide-y overflow-hidden rounded-[22px] ${dark ? "divide-white/10 bg-white/[0.05]" : "divide-[#ece5d5] border border-[#e3dccb] bg-white"}`}>
                    {sec.items.map((it) => (
                      <li key={it.title} className="flex items-start gap-3.5 px-5 py-4">
                        <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] ${dark ? "bg-white/10" : "bg-[#f2eee2] text-[#212d3d]"}`}>
                          <InfoIcon name={it.icon || "check"} className="h-[18px] w-[18px]" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-semibold">
                            {it.title}
                            {it.tag && (
                              <span className={`ml-2 rounded-full px-2 py-0.5 align-middle text-[10.5px] font-semibold ${dark ? "bg-[#e3cea0] text-[#212d3d]" : "bg-[#067647]/10 text-[#067647]"}`}>
                                {it.tag}
                              </span>
                            )}
                          </p>
                          <p className={`mt-0.5 text-[13.5px] leading-[1.5] ${dark ? "text-[#faf6ed]/70" : "text-[#5a6675]"}`}>{it.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {sec.items.map((it) => {
                      const body = (
                        <>
                          <span className={`flex h-11 w-11 items-center justify-center rounded-[14px] ${dark ? "bg-[#e3cea0] text-[#212d3d]" : "bg-[#212d3d] text-[#e3cea0]"}`}>
                            <InfoIcon name={it.icon || "spark"} />
                          </span>
                          <p className="mt-4 text-[17px] font-semibold">{it.title}</p>
                          <p className={`mt-1.5 text-[14px] leading-[1.55] ${dark ? "text-[#faf6ed]/70" : "text-[#5a6675]"}`}>{it.text}</p>
                          {it.href && <p className={`mt-3 text-[13px] font-semibold ${dark ? "text-[#e3cea0]" : "text-[#212d3d]"}`}>Open →</p>}
                        </>
                      );
                      const cls = `block h-full rounded-[22px] p-5 transition-transform hover:-translate-y-0.5 ${dark ? "bg-white/[0.06]" : "border border-[#e3dccb] bg-white"}`;
                      return it.href ? (
                        <Link key={it.title} href={it.href} className={cls}>{body}</Link>
                      ) : (
                        <div key={it.title} className={cls}>{body}</div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {closing && (
        <section className="px-4 pb-16 sm:px-8">
          <div className="mx-auto max-w-[1180px] rounded-[28px] border border-[#e3dccb] bg-white px-6 py-10 text-center sm:px-12">
            <h2 className="font-serif-display text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.08] text-[#212d3d]">{closing.title}</h2>
            <p className="mx-auto mt-3 max-w-[52ch] text-[15px] leading-[1.6] text-[#5a6675]">{closing.text}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">{closing.actions}</div>
          </div>
        </section>
      )}
    </div>
  );
}

/** Pill link for page actions. "cream"/"ghost" sit on the dark hero; "solid"/"outline" on light cards. */
export function PillLink({
  href,
  children,
  variant = "cream",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "cream" | "ghost" | "solid" | "outline";
}) {
  const cls = {
    cream: "bg-[#faf6ed] text-[#212d3d] hover:bg-white",
    ghost: "border border-white/25 text-[#faf6ed] hover:bg-white/10",
    solid: "bg-[#212d3d] text-[#faf6ed] hover:bg-[#33445c]",
    outline: "border border-[#cfc4a7] bg-white text-[#212d3d] hover:border-[#212d3d]",
  }[variant];
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold whitespace-nowrap transition-colors ${cls}`}
    >
      {children}
    </Link>
  );
}
