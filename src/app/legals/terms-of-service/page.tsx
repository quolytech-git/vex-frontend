import React from "react";
import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import { LEGAL_DOCS } from "@/data/palladio";

export const metadata: Metadata = {
  title: "Terms of Service | Vex",
  description:
    "Terms governing use of the Vex website, browser extension, and career readiness workspace.",
};

export default function TermsOfServicePage() {
  const doc = LEGAL_DOCS.termsOfService;

  return (
    <article className="bg-[#faf6ed] px-4 pb-24 pt-32 sm:px-8 lg:pt-40">
      <div className="mx-auto max-w-[820px]">
        <div className="space-y-5">
          <Eyebrow label="Legals" />
          <h1 className="font-serif-display text-[clamp(2.8rem,5vw,4.5rem)] font-normal leading-[1.04] tracking-[-0.03em] text-[#212d3d]">
            Terms of{" "}
            <span className="italic text-[#5a6675]">Service</span>
          </h1>
          <p className="text-[13.5px] font-medium text-[#9c4930]">
            {doc.updated}
          </p>
          <p className="text-[17px] leading-[1.65] text-[#5a6675]">
            {doc.intro}
          </p>
        </div>

        <div className="mt-12 space-y-8 border-t border-[#212d3d]/10 pt-10">
          {doc.sections.map((section) => (
            <section key={section.heading} className="space-y-2.5">
              <h2 className="font-serif-display text-[28px] leading-tight text-[#212d3d]">
                {section.heading}
              </h2>
              <p className="text-[15.5px] leading-[1.68] text-[#5a6675]">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

