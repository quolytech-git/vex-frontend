import React from "react";
import Link from "next/link";
import { CASE_STUDIES } from "@/data/palladio";
import SectionHead from "@/components/SectionHead";
import PalladioButton from "@/components/PalladioButton";
import Reveal from "@/components/Reveal";
import ScrollZoomImage from "@/components/ScrollZoomImage";
import { ArrowRightIcon } from "@/components/Icons";

export default function CaseStudiesSection() {
  const featured = CASE_STUDIES.slice(0, 3);

  return (
    <section
      id="case-studies"
      className="bg-[#faf6ed] px-4 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <SectionHead
          eyebrow="Platform mechanics"
          title={
            <>
              How Vex works,{" "}
              <span className="italic text-[#5a6675]">in practice.</span>
            </>
          }
          lead="Three core workflows designed directly from candidate research — eliminating repeated typing, stale listings and fabricated claims."
          ctaLabel="View all studies"
          ctaHref="/case-studies"
        />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {featured.map((study, idx) => (
            <Reveal key={study.slug} delay={idx * 0.08}>
              <Link
                href={`/case-studies/${study.slug}`}
                prefetch={true}
                className="group flex h-full flex-col justify-between rounded-[26px] bg-[#f2eee2] p-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(33,45,61,0.08)] active:scale-[0.985] sm:p-5"
              >
                <div>
                  <div className="aspect-[1200/896] overflow-hidden rounded-[18px] bg-[#ece9df]">
                    <ScrollZoomImage
                      src={study.image}
                      alt={study.title}
                      fromScale={1}
                      toScale={1.08}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-2 px-1">
                    <span className="inline-flex items-center rounded-full bg-[#ece9df] px-3 py-1 text-[12px] font-medium text-[#5a6675]">
                      {study.sector}
                    </span>
                    <span className="text-[12.5px] font-medium text-[#9c4930]">
                      {study.metricHighlight}
                    </span>
                  </div>

                  <h3 className="mt-3 px-1 font-serif-display text-[26px] leading-[1.15] tracking-[-0.02em] text-[#212d3d]">
                    {study.title}
                  </h3>

                  <p className="mt-2.5 px-1 text-[14.5px] leading-[1.58] text-[#5a6675]">
                    {study.summary}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#212d3d]/10 px-1 pt-4 text-[13.5px] font-medium text-[#212d3d]">
                  <span>Read full case study</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#faf6ed] transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Archive strip */}
        <Reveal delay={0.12}>
          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-[22px] bg-[#f2eee2] px-6 py-5 sm:flex-row sm:items-center">
            <p className="text-[15px] text-[#5a6675]">
              Explore every workflow study across profile intake, autofill and
              four-tier skill provenance.
            </p>
            <PalladioButton
              label="Browse archive"
              href="/case-studies"
              variant="secondary"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
