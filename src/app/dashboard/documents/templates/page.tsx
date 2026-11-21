"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import CvTemplatePreview from "@/components/dashboard/CvTemplatePreview";
import { EmptyState, Pill } from "@/components/dashboard/kit/Kit";
import { useVexWorkspace } from "@/lib/vex-store";
import { CHOSEN_TEMPLATE_KEY, CV_CATEGORIES, CV_TEMPLATES } from "@/data/cvTemplates";

export default function CvTemplatesPage() {
  const { resumes } = useVexWorkspace();
  const resume = resumes[0];
  const [cat, setCat] = useState<(typeof CV_CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState("");

  useEffect(() => {
    try {
      setChosen(localStorage.getItem(CHOSEN_TEMPLATE_KEY) || "");
    } catch {
      /* ignore */
    }
  }, []);

  const list = useMemo(
    () =>
      CV_TEMPLATES.filter(
        (t) =>
          (cat === "All" || t.category === cat) &&
          (!query.trim() || `${t.name} ${t.tagline} ${t.bestFor.join(" ")}`.toLowerCase().includes(query.toLowerCase()))
      ),
    [cat, query]
  );

  return (
    <DashboardSubpageFrame parentSection="documents" parentLabel="Resume" pageCode="03.4" pageTitle="CV templates" philosopherTag="Leonardo · Proportion">
      <div className="mx-auto max-w-[1180px] space-y-5">
        {/* Header */}
        <section className="vex-kit rounded-[26px] bg-[#212d3d] p-6 text-[#faf6ed] sm:p-8">
          <p className="text-[10.5px] font-semibold tracking-[0.14em] text-[#faf6ed]/60 uppercase">Explore templates</p>
          <h1 className="mt-1 font-serif-display text-[clamp(1.9rem,3.4vw,2.8rem)] leading-tight">Pick a look. Keep your facts.</h1>
          <p className="mt-2 max-w-[56ch] text-[14.5px] leading-snug text-[#faf6ed]/75">
            Every template is one column and readable by applicant systems. Previews use your own CV, so you see exactly what you'll get.
          </p>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search, e.g. “graduate” or “engineering”"
            aria-label="Search templates"
            className="mt-5 w-full max-w-[520px] rounded-full border border-white/15 bg-white/10 px-5 py-3 text-[15px] text-[#faf6ed] outline-none placeholder:text-[#faf6ed]/50 focus:border-white/40"
          />
          <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
            {CV_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-[12.5px] font-medium ${cat === c ? "bg-[#faf6ed] text-[#212d3d]" : "bg-white/10 text-[#faf6ed]/80"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Gallery */}
        {list.length === 0 ? (
          <EmptyState title="No templates match" text="Try another word or choose “All”." />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {list.map((t) => (
              <Link
                key={t.id}
                href={`/dashboard/documents/templates/${t.id}`}
                className="group block rounded-[20px] border border-[#e3dccb] bg-white p-2.5 transition-transform hover:-translate-y-0.5 sm:p-3"
              >
                <div className="relative flex justify-center overflow-hidden rounded-[14px] bg-[#f2eee2] py-3">
                  {resume && <ThumbScaler template={t} resume={resume} />}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {chosen === t.id && <Pill tone="good">In use</Pill>}
                    {t.popular && chosen !== t.id && <Pill tone="navy">Popular</Pill>}
                  </div>
                </div>
                <div className="px-1 pt-2.5 pb-1">
                  <p className="truncate text-[14px] font-semibold text-[#212d3d]">{t.name}</p>
                  <p className="truncate text-[11.5px] text-[#7a705c]">{t.category} · {t.pages}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <p className="text-center text-[12px] text-[#7a705c]">
          Changing template never changes your words — only how they're laid out.
        </p>
      </div>
    </DashboardSubpageFrame>
  );
}

/** Thumbnail that fits its card width on phone and PC. */
function ThumbScaler({ template, resume }: { template: (typeof CV_TEMPLATES)[number]; resume: NonNullable<ReturnType<typeof useVexWorkspace>["resumes"][number]> }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.26);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(0.34, (el.clientWidth - 8) / 595)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="flex w-full justify-center">
      <CvTemplatePreview template={template} resume={resume} scale={scale} />
    </div>
  );
}
