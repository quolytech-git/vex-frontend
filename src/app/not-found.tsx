import React from "react";
import Eyebrow from "@/components/Eyebrow";
import PalladioButton from "@/components/PalladioButton";

export default function NotFound() {
  return (
    <section className="bg-[#faf6ed] px-4 pb-28 pt-40 sm:px-8">
      <div className="mx-auto max-w-[780px] space-y-6 rounded-[28px] bg-[#f2eee2] p-8 sm:p-12">
        <Eyebrow label="404" />
        <h1 className="font-serif-display text-[clamp(2.8rem,5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.03em] text-[#212d3d]">
          This page could not{" "}
          <span className="italic text-[#5a6675]">be found.</span>
        </h1>
        <p className="max-w-[46ch] text-[16.5px] leading-[1.6] text-[#5a6675]">
          The link may have moved, or the address may be incomplete. Return to
          the Vex home page or contact the team directly.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <PalladioButton label="Return home" href="/" variant="primary" />
          <PalladioButton label="Start with Vex" href="/contact" variant="secondary" />
        </div>
      </div>
    </section>
  );
}

