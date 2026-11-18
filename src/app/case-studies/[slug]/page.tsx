import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CASE_STUDIES } from "@/data/palladio";
import Eyebrow from "@/components/Eyebrow";
import PalladioButton from "@/components/PalladioButton";
import { CheckIcon } from "@/components/Icons";

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) return { title: "Case Study | Vex" };
  return {
    title: `${study.title} | Vex`,
    description: study.summary,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) notFound();

  const related = CASE_STUDIES.filter((c) => c.slug !== study.slug).slice(
    0,
    2
  );

  return (
    <article className="bg-[#faf6ed] px-4 pb-20 pt-32 sm:px-8 lg:pt-40">
      <div className="mx-auto max-w-[1140px]">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-[13px] text-[#5a6675]">
          <Link href="/case-studies" className="hover:text-[#212d3d]">
            ← Back to case studies
          </Link>
          <span>•</span>
          <span>{study.sector}</span>
          <span>•</span>
          <span>{study.duration}</span>
          <span>•</span>
          <span>{study.year}</span>
        </div>

        <div className="space-y-6">
          <Eyebrow label={study.sector} />
          <h1 className="font-serif-display text-[clamp(2.8rem,5vw,4.7rem)] font-normal leading-[1.04] tracking-[-0.03em] text-[#212d3d]">
            {study.title}
          </h1>
          <p className="max-w-[56ch] text-[19px] leading-[1.58] text-[#5a6675]">
            {study.summary}
          </p>
        </div>

        {/* Cover */}
        <div className="mt-10 overflow-hidden rounded-[28px] bg-[#f2eee2]">
          <img
            src={study.image}
            alt={study.title}
            className="max-h-[520px] w-full object-cover"
          />
        </div>

        {/* Outcomes Ribbon */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {study.outcomes.map((item) => (
            <div
              key={item.label}
              className="rounded-[22px] bg-[#212d3d] p-6 text-[#faf6ed]"
            >
              <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#faf6ed]/65">
                {item.label}
              </p>
              <p className="mt-2 font-serif-display text-[36px] leading-tight">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Structured Narrative */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <div className="rounded-[24px] bg-[#f2eee2] p-7">
              <h2 className="font-serif-display text-[30px] leading-tight text-[#212d3d]">
                The situation
              </h2>
              <p className="mt-3 text-[16px] leading-[1.65] text-[#5a6675]">
                {study.context}
              </p>
            </div>

            <div className="rounded-[24px] bg-[#f2eee2] p-7">
              <h2 className="font-serif-display text-[30px] leading-tight text-[#212d3d]">
                Why previous attempts stalled
              </h2>
              <ul className="mt-4 space-y-3">
                {study.challenge.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-[15.5px] leading-[1.6] text-[#5a6675]"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9c4930]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[24px] bg-[#f2eee2] p-7">
              <h2 className="font-serif-display text-[30px] leading-tight text-[#212d3d]">
                What we built and delivered
              </h2>
              <ul className="mt-4 space-y-3.5">
                {study.whatWeBuilt.map((step) => (
                  <li
                    key={step}
                    className="flex items-start gap-3 text-[15.5px] leading-[1.6] text-[#212d3d]"
                  >
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2f6b4f] text-[#faf6ed]">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-[24px] bg-[#ece9df] p-6">
              <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#5a6675]">
                In practice
              </p>
              <p className="mt-3 text-[15px] leading-[1.6] text-[#212d3d]">
                {study.closingNote}
              </p>
            </div>

            <div className="rounded-[24px] bg-[#212d3d] p-6 text-[#faf6ed]">
              <h3 className="font-serif-display text-[28px] leading-tight">
                Ready to try this loop?
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-[1.58] text-[#faf6ed]/75">
                Start your essential Vex profile on Core Path or ask about Pro
                workflows and MCP integrations.
              </p>
              <div className="mt-5">
                <PalladioButton
                  label="Start free with Vex"
                  href="/contact"
                  variant="onDark"
                  fullWidth
                />
              </div>
            </div>
          </aside>
        </div>

        {/* Related */}
        <div className="mt-20 border-t border-[#212d3d]/10 pt-12">
          <h2 className="font-serif-display text-[34px] text-[#212d3d]">
            More case studies
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/case-studies/${item.slug}`}
                className="flex flex-col justify-between rounded-[22px] bg-[#f2eee2] p-6 transition-transform hover:-translate-y-0.5"
              >
                <div>
                  <span className="text-[12px] font-medium text-[#9c4930]">
                    {item.sector} — {item.metricHighlight}
                  </span>
                  <h3 className="mt-2 font-serif-display text-[26px] text-[#212d3d]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14.5px] text-[#5a6675]">
                    {item.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

