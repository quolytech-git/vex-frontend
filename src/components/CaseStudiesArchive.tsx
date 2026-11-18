"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CASE_STUDIES, INDUSTRIES } from "@/data/palladio";
import ScrollZoomImage from "@/components/ScrollZoomImage";
import { ArrowRightIcon } from "@/components/Icons";

const FILTER_OPTIONS = ["All", ...INDUSTRIES.map((i) => i.name)];

export default function CaseStudiesArchive() {
  const [selectedSector, setSelectedSector] = useState<string>("All");

  const visible =
    selectedSector === "All"
      ? CASE_STUDIES
      : CASE_STUDIES.filter((c) => c.sector === selectedSector);

  return (
    <section className="bg-[#faf6ed] px-4 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        {/* Sector Filter Bar */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-[12.5px] font-medium uppercase tracking-[0.1em] text-[#5a6675]">
            Career tracks
          </span>
          {FILTER_OPTIONS.map((sector) => {
            const active = selectedSector === sector;
            return (
              <button
                key={sector}
                type="button"
                onClick={() => setSelectedSector(sector)}
                className={`rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors cursor-pointer ${
                  active
                    ? "bg-[#212d3d] text-[#faf6ed]"
                    : "bg-[#f2eee2] text-[#5a6675] hover:bg-[#ece9df] hover:text-[#212d3d]"
                }`}
              >
                {sector}
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((study) => (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}`}
              prefetch={true}
              className="group flex flex-col justify-between rounded-[26px] bg-[#f2eee2] p-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(33,45,61,0.08)] active:scale-[0.985] sm:p-5"
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
                  <span className="rounded-full bg-[#ece9df] px-3 py-1 text-[12px] font-medium text-[#5a6675]">
                    {study.sector}
                  </span>
                  <span className="text-[12.5px] font-medium text-[#9c4930]">
                    {study.metricHighlight}
                  </span>
                </div>

                <h2 className="mt-3 px-1 font-serif-display text-[27px] leading-[1.15] tracking-[-0.02em] text-[#212d3d]">
                  {study.title}
                </h2>

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
          ))}
        </div>
      </div>
    </section>
  );
}

