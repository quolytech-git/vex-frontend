import React from "react";
import type { Metadata } from "next";
import { ASSETS } from "@/data/palladio";
import Eyebrow from "@/components/Eyebrow";
import BlogArchive from "@/components/BlogArchive";

export const metadata: Metadata = {
  title: "Insights | Vex",
  description:
    "Candidate research, product principles, and honest evidence behind the 24-hour Vex readiness workflow.",
};

export default function BlogPage() {
  return (
    <>
      <section className="bg-[#faf6ed] px-2.5 pb-2.5 pt-[76px]">
        <div className="relative flex min-h-[54vh] flex-col justify-between overflow-hidden rounded-[30px] bg-[#12222e] text-[#faf6ed]">
          <img
            src={ASSETS.blogHero}
            alt="Vex Research & Insights"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50"
          />
          <div
            aria-hidden="true"
            className="hero-scrim pointer-events-none absolute inset-0"
          />
          <div className="h-10" />

          <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 pb-12 pt-10 sm:px-9 lg:px-12">
            <div className="max-w-[780px] space-y-5">
              <Eyebrow label="Research & notes" tone="dark" />
              <h1 className="font-serif-display text-[clamp(3rem,5.4vw,5.2rem)] font-normal leading-[1.04] tracking-[-0.03em]">
                Notes on{" "}
                <span className="italic text-[#faf6ed]/85">honest readiness</span>
              </h1>
              <p className="max-w-[52ch] text-[17px] leading-[1.6] text-[#faf6ed]/80">
                What candidate benchmarks reveal about portal abandonment,
                evidence-locked CVs, and building software that refuses AI hype.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BlogArchive />
    </>
  );
}

