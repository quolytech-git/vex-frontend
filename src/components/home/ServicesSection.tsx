"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SERVICES } from "@/data/palladio";
import Eyebrow from "@/components/Eyebrow";
import PalladioButton from "@/components/PalladioButton";
import { CirclePlusOutlineIcon } from "@/components/Icons";
import ScrollZoomImage from "@/components/ScrollZoomImage";

const RAIL_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 32,
  mass: 0.9,
};

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="services"
      className="bg-[#faf6ed] px-5 py-20 sm:px-8 lg:px-14 lg:py-28"
    >
      <div className="mx-auto max-w-[1600px]">
        {/* Section Head */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-6">
            <Eyebrow label="Platform pillars" />
            <h2 className="mt-4 font-serif-display text-[clamp(2.5rem,4.5vw,3.9rem)] font-normal leading-[1.06] tracking-[-0.025em] text-[#212d3d]">
              Five ways Vex helps
            </h2>
          </div>
          <div className="lg:col-span-6 lg:flex lg:justify-end">
            <p className="max-w-[440px] text-[16px] leading-[1.6] text-[#212d3d]/72">
              Open any pillar to inspect how the workflow stays connected — from
              essential setup and deduplicated jobs to evidence-locked CVs and
              mock interview practice.
            </p>
          </div>
        </motion.div>

        {/* Desktop Expanding Horizontal Accordion Rail — matches live site */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden rounded-[26px] border border-[#212d3d]/[0.06] bg-[#f4efe3] p-2.5 lg:flex lg:h-[540px] lg:gap-2.5"
        >
          {SERVICES.map((service, idx) => {
            const isActive = idx === activeIndex;
            return (
              <motion.button
                key={service.id}
                type="button"
                layout="position"
                onClick={() => setActiveIndex(idx)}
                aria-expanded={isActive}
                transition={{ layout: RAIL_SPRING }}
                className={`group relative overflow-hidden rounded-[22px] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#212d3d]/40 ${
                  isActive
                    ? "flex-1 cursor-default bg-[#faf6ed] shadow-[0_1px_2px_rgba(33,45,61,0.03)]"
                    : "w-[76px] shrink-0 cursor-pointer bg-[#faf6ed] transition-colors duration-300 hover:bg-[#fcfaf4]"
                }`}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {isActive ? (
                    <motion.div
                      key={`${service.id}-open`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                      className="relative h-full w-full overflow-hidden p-8 xl:p-9"
                    >
                      {/* Right-aligned Artwork with Feathered Left Edge Blend & Scroll Zoom */}
                      <div
                        className="pointer-events-none absolute inset-y-0 right-0 w-[52%] xl:w-[50%]"
                        style={{
                          maskImage:
                            "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 16%, rgba(0,0,0,1) 42%)",
                          WebkitMaskImage:
                            "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 16%, rgba(0,0,0,1) 42%)",
                        }}
                      >
                        <ScrollZoomImage
                          src={service.image}
                          alt={`${service.name} — Vex platform illustration`}
                          fromScale={1.01}
                          toScale={1.1}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      {/* Subtle top-right pill badge */}
                      <span className="absolute right-8 top-8 z-20 inline-flex h-[28px] items-center justify-center rounded-full border border-[#212d3d]/[0.1] bg-[#faf6ed] px-3 text-[11.5px] font-medium tracking-[0.04em] text-[#212d3d]/75">
                        {service.number}
                      </span>

                      {/* Left Text Content */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.48,
                          delay: 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="relative z-10 flex h-full max-w-[390px] flex-col justify-between"
                      >
                        <div>
                          <h3 className="font-serif-display text-[clamp(1.65rem,2.2vw,2.15rem)] font-normal leading-[1.12] tracking-[-0.02em] text-[#212d3d]">
                            {service.headline}
                          </h3>
                          <p className="mt-3 text-[14.5px] leading-[1.6] text-[#212d3d]/72">
                            {service.description}
                          </p>
                        </div>

                        <div className="pt-4">
                          <p className="mb-3 text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#212d3d]/60">
                            What is included
                          </p>
                          <ul className="space-y-2.5">
                            {service.deliverables.map((item) => (
                              <li
                                key={item}
                                className="flex items-center gap-2.5 text-[14px] text-[#212d3d]/82"
                              >
                                <CirclePlusOutlineIcon className="h-3.5 w-3.5 shrink-0 text-[#212d3d]/55" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`${service.id}-closed`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex h-full w-full flex-col items-center justify-between py-6"
                    >
                      <span className="inline-flex h-[28px] items-center justify-center rounded-full border border-[#212d3d]/[0.1] bg-[#faf6ed] px-2.5 text-[11.5px] font-medium tracking-[0.04em] text-[#212d3d]/60 transition-colors group-hover:border-[#212d3d]/25 group-hover:text-[#212d3d]">
                        {service.number}
                      </span>

                      <span
                        className="font-serif-display text-[20px] leading-none tracking-[-0.01em] text-[#212d3d]/80 transition-colors group-hover:text-[#212d3d]"
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                        }}
                      >
                        {service.name}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Mobile / Tablet Stacked Accordion */}
        <div className="space-y-3 rounded-[22px] bg-[#f4efe3] p-2.5 lg:hidden">
          {SERVICES.map((service, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={service.id}
                className="overflow-hidden rounded-[18px] bg-[#faf6ed]"
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-expanded={isActive}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[#fcfaf4]"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="inline-flex h-[26px] items-center justify-center rounded-full border border-[#212d3d]/10 bg-[#faf6ed] px-2.5 text-[11.5px] font-medium text-[#212d3d]/65">
                      {service.number}
                    </span>
                    <span className="font-serif-display text-[21px] text-[#212d3d]">
                      {service.name}
                    </span>
                  </div>
                  <motion.span
                    animate={{ rotate: isActive ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[19px] font-light text-[#212d3d]/65"
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.3, ease: "easeOut" },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-5 border-t border-[#212d3d]/[0.07] px-5 pb-6 pt-4">
                        <div className="h-52 overflow-hidden rounded-[14px]">
                          <ScrollZoomImage
                            src={service.image}
                            alt={service.name}
                            fromScale={1}
                            toScale={1.08}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-serif-display text-[26px] leading-[1.15] text-[#212d3d]">
                            {service.headline}
                          </h3>
                          <p className="mt-2.5 text-[14.5px] leading-[1.6] text-[#212d3d]/72">
                            {service.description}
                          </p>
                        </div>
                        <div>
                          <p className="mb-2.5 text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#212d3d]/60">
                            What is included
                          </p>
                          <ul className="space-y-2">
                            {service.deliverables.map((item) => (
                              <li
                                key={item}
                                className="flex items-center gap-2.5 text-[14px] text-[#212d3d]/82"
                              >
                                <CirclePlusOutlineIcon className="h-3.5 w-3.5 shrink-0 text-[#212d3d]/55" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Section Bottom Bar CTA — matches Screenshot 1 */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="font-serif-display text-[clamp(1.2rem,1.8vw,1.5rem)] leading-[1.3] text-[#212d3d]/70">
            Write once, review every edit, stay honest at every step.
          </p>
          <PalladioButton
            href="/signup"
            label="Start free"
            variant="primary"
          />
        </div>
      </div>
    </section>
  );
}
