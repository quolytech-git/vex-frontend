import React from "react";
import { DIFFERENCE } from "@/data/palladio";
import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/Reveal";
import { CheckIcon, XIcon } from "@/components/Icons";

export default function DifferenceSection() {
  return (
    <section
      id="difference"
      className="bg-[#faf6ed] px-4 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Sticky Column */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHead
                eyebrow="Our difference"
                title={
                  <>
                    What changes{" "}
                    <span className="italic text-[#5a6675]">
                      across your search.
                    </span>
                  </>
                }
                lead="We built Vex directly around the frustrations candidates encounter daily — fragmented portal re-entry, synthetic AI filler, and opaque status guesses."
                ctaLabel="See pricing"
                ctaHref="/#pricing"
                layout="stacked"
              />
            </div>
          </div>

          {/* Right Comparison Pair */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {/* Without Vex */}
            <Reveal delay={0.05} className="h-full">
              <div className="flex h-full flex-col justify-between rounded-[24px] bg-[#f2eee2] p-6 sm:p-7">
                <div>
                  <p className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-[#5a6675]">
                    Traditional search
                  </p>
                  <h3 className="mt-2 font-serif-display text-[26px] leading-[1.15] tracking-[-0.02em] text-[#212d3d]">
                    {DIFFERENCE.without.title}
                  </h3>

                  <ul className="mt-6 divide-y divide-dashed divide-[#212d3d]/20">
                    {DIFFERENCE.without.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 py-3.5 text-[14.5px] text-[#5a6675]"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#212d3d]/10 text-[#9c4930]">
                          <XIcon className="h-3.5 w-3.5" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            {/* With Palladio */}
            <Reveal delay={0.14} className="h-full">
              <div className="flex h-full flex-col justify-between rounded-[24px] bg-[#212d3d] p-6 text-[#faf6ed] sm:p-7">
                <div>
                  <p className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-[#c9c1b2]">
                    Our standard
                  </p>
                  <h3 className="mt-2 font-serif-display text-[26px] leading-[1.15] tracking-[-0.02em] text-[#faf6ed]">
                    {DIFFERENCE.with.title}
                  </h3>

                  <ul className="mt-6 divide-y divide-dashed divide-white/15">
                    {DIFFERENCE.with.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 py-3.5 text-[14.5px] text-[#faf6ed]/90"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#faf6ed] text-[#212d3d]">
                          <CheckIcon className="h-3.5 w-3.5 text-[#2f6b4f]" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
