"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TESTIMONIALS } from "@/data/palladio";
import SectionHead from "@/components/SectionHead";
import ScrollZoomImage from "@/components/ScrollZoomImage";
import { QuoteIcon, StarIcon } from "@/components/Icons";

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = TESTIMONIALS[activeIndex];

  return (
    <section
      id="testimonials"
      className="bg-[#faf6ed] px-4 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <SectionHead
          eyebrow="Candidate stories"
          title={
            <>
              What candidates{" "}
              <span className="italic text-[#5a6675]">experience in practice.</span>
            </>
          }
          lead="How applicants use Vex to move past form fatigue, verify real role fit cleanly, and prepare honestly for panel interviews."
        />

        {/* Review Spotlight Container */}
        <div className="mt-12 rounded-[30px] bg-[#ece9df] p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 gap-8 rounded-[24px] bg-[#faf6ed] p-5 sm:p-7 lg:grid-cols-12 lg:items-center lg:gap-10"
            >
              {/* Portrait Column */}
              <div className="lg:col-span-4">
                <div className="aspect-[880/1060] overflow-hidden rounded-[20px] bg-[#f2eee2]">
                  <ScrollZoomImage
                    src={current.image}
                    alt={current.name}
                    fromScale={1}
                    toScale={1.07}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Quote & Metadata Column */}
              <div className="flex flex-col justify-between gap-6 lg:col-span-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1 text-[#9c4930]">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <StarIcon key={idx} className="h-4 w-4" />
                    ))}
                  </div>
                  <QuoteIcon className="h-7 w-7 text-[#212d3d]/20" />
                </div>

                <blockquote className="font-serif-display text-[clamp(1.65rem,2.6vw,2.35rem)] leading-[1.2] tracking-[-0.02em] text-[#212d3d]">
                  “{current.quote}”
                </blockquote>

                <div className="flex flex-col justify-between gap-4 border-t border-[#212d3d]/10 pt-5 sm:flex-row sm:items-end">
                  <div>
                    <p className="font-serif-display text-[24px] leading-tight text-[#212d3d]">
                      {current.name}
                    </p>
                    <p className="text-[14px] text-[#5a6675]">
                      {current.role}, {current.company}
                    </p>
                  </div>

                  <span className="inline-flex items-center rounded-full bg-[#f2eee2] px-3.5 py-1.5 text-[12.5px] font-medium text-[#212d3d]">
                    {current.outcome}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 5 Client Portrait Switcher Thumbnails */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {TESTIMONIALS.map((item, idx) => {
              const selected = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-pressed={selected}
                  className={`relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-[16px] p-2.5 text-left transition-colors duration-300 ${
                    selected
                      ? "text-[#faf6ed]"
                      : "bg-[#faf6ed]/75 text-[#212d3d] hover:bg-[#faf6ed]"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="testimonial-switcher-pill"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="absolute inset-0 rounded-[16px] bg-[#212d3d] shadow-xs"
                    />
                  )}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="relative z-10 h-11 w-11 shrink-0 rounded-[10px] object-cover object-top"
                  />
                  <div className="relative z-10 min-w-0">
                    <p className="truncate text-[13.5px] font-medium leading-tight">
                      {item.name}
                    </p>
                    <p
                      className={`truncate text-[11.5px] transition-colors duration-300 ${
                        selected ? "text-[#faf6ed]/70" : "text-[#5a6675]"
                      }`}
                    >
                      {item.company}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

