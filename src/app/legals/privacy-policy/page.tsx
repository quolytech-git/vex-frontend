import React from "react";
import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import { LEGAL_DOCS } from "@/data/palladio";

export const metadata: Metadata = {
  title: "Privacy Policy | Vex",
  description:
    "How Vex collects, stores, scopes with MCP, and protects candidate profile information.",
};

export default function PrivacyPolicyPage() {
  const doc = LEGAL_DOCS.privacyPolicy;

  return (
    <article className="bg-[#faf6ed] px-4 pb-24 pt-32 sm:px-8 lg:pt-40">
      <div className="mx-auto max-w-[820px]">
        <div className="space-y-5">
          <Eyebrow label="Legals" />
          <h1 className="font-serif-display text-[clamp(2.8rem,5vw,4.5rem)] font-normal leading-[1.04] tracking-[-0.03em] text-[#212d3d]">
            Privacy{" "}
            <span className="italic text-[#5a6675]">Policy</span>
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
            <section key={section.heading} className="space-y-3">
              <h2 className="font-serif-display text-[28px] leading-tight text-[#212d3d]">
                {section.heading}
              </h2>

              {"body" in section && section.body && (
                <p className="text-[15.5px] leading-[1.68] text-[#5a6675]">
                  {section.body}
                </p>
              )}

              {"bullets" in section && section.bullets && (
                <ul className="space-y-2 pl-5">
                  {section.bullets.map((item) => (
                    <li
                      key={item}
                      className="list-disc text-[15.5px] leading-[1.65] text-[#5a6675]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {"footerNote" in section && section.footerNote && (
                <p className="text-[15.5px] leading-[1.68] text-[#212d3d]">
                  {section.footerNote}
                </p>
              )}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

