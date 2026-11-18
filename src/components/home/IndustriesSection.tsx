import React from "react";
import { INDUSTRIES } from "@/data/palladio";
import SectionHead from "@/components/SectionHead";
import ScrollZoomImage from "@/components/ScrollZoomImage";

export default function IndustriesSection() {
  const repeated = [...INDUSTRIES, ...INDUSTRIES];

  return (
    <section
      id="industries"
      className="overflow-hidden bg-[#faf6ed] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <SectionHead
          eyebrow="Career tracks"
          title={
            <>
              Six domains,{" "}
              <span className="italic text-[#5a6675]">prepared in depth.</span>
            </>
          }
          lead="Built around six real hiring domains — matching verified candidate skills to fresh roles and authentic technical and operational prep."
          ctaLabel="View case studies"
          ctaHref="/case-studies"
        />
      </div>

      {/* Marquee Cards Track */}
      <div className="marquee-wrapper mt-12 overflow-hidden">
        <div className="animate-marquee-cards gap-5 pl-5">
          {repeated.map((sector, idx) => (
            <div
              key={`${sector.name}-${idx}`}
              className="group flex w-[290px] shrink-0 flex-col justify-between rounded-[24px] bg-[#f2eee2] p-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(33,45,61,0.08)] sm:w-[330px]"
            >
              <div className="aspect-square overflow-hidden rounded-[18px] bg-[#ece9df]">
                <ScrollZoomImage
                  src={sector.image}
                  alt={sector.name}
                  fromScale={1}
                  toScale={1.08}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-4 space-y-1.5 px-1 pb-1">
                <h3 className="font-serif-display text-[25px] leading-[1.15] tracking-[-0.02em] text-[#212d3d]">
                  {sector.name}
                </h3>
                <p className="text-[13.5px] leading-[1.5] text-[#5a6675]">
                  {sector.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

