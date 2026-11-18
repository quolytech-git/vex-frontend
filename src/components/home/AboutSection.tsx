"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ABOUT_CHIPS, ASSETS } from "@/data/palladio";
import Eyebrow from "@/components/Eyebrow";
import AnimatedCounter from "@/components/AnimatedCounter";
import ScrollZoomImage from "@/components/ScrollZoomImage";
import {
  BuildingOutlineIcon,
  CheckIcon,
  CirclePlusOutlineIcon,
  UsersOutlineIcon,
} from "@/components/Icons";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutSection() {
  const logos = [...ASSETS.clientLogos, ...ASSETS.clientLogos];

  return (
    <section id="about" className="bg-[#faf6ed] px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        {/* Header Row matching Palladio layout */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: EASE }}
          className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end"
        >
          <div className="space-y-3.5 lg:col-span-7">
            <Eyebrow label="The 24-hour path" />
            <h2 className="font-serif-display text-[clamp(2.7rem,4.4vw,4.1rem)] font-normal leading-[1.02] tracking-[-0.03em] text-[#212d3d]">
              Why choose Vex
            </h2>
          </div>

          <div className="lg:col-span-5 lg:justify-self-end">
            <p className="max-w-[38ch] font-serif-display text-[20px] leading-[1.32] tracking-[-0.01em] text-[#5a6675] sm:text-[21px]">
              Ambitious on helping candidates prepare in 24 hours — honest that
              you control submission and employers control every hiring decision.
            </p>
          </div>
        </motion.div>

        {/* 4-Column Bento Grid */}
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-4">
          {/* Column 1: Feature Media Card + 4 Checklist Items */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.65, delay: 0.05, ease: EASE }}
            whileHover={{ y: -2 }}
            className="group flex flex-col justify-between rounded-[20px] bg-[#f2eee2] p-2.5 transition-shadow duration-300 hover:shadow-[0_14px_32px_rgba(33,45,61,0.08)]"
          >
            {/* Fresco Media Panel */}
            <div className="relative flex h-[270px] w-full flex-col justify-between overflow-hidden rounded-[14px] bg-[#18222e] p-5 sm:p-6">
              <ScrollZoomImage
                src={ASSETS.aboutFresco}
                alt="Fresco detail"
                fromScale={1}
                toScale={1.09}
                wrapperClassName="pointer-events-none absolute inset-0 overflow-hidden"
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className="feature-card-scrim pointer-events-none absolute inset-0"
              />

              <h3 className="relative z-10 max-w-[16ch] font-serif-display text-[26px] font-normal leading-[1.12] tracking-[-0.02em] text-[#faf6ed]">
                Readiness built on real proof.
              </h3>

              <div className="relative z-10">
                <Link
                  href="/about"
                  className="group/btn inline-flex items-center justify-center rounded-full border border-white/40 bg-black/25 px-5 py-2 text-[13.5px] font-medium text-[#faf6ed] backdrop-blur-md transition-all duration-300 hover:border-white/75 hover:bg-white/20"
                >
                  <span className="relative inline-flex h-[18px] overflow-hidden leading-[18px]">
                    <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:-translate-y-full">
                      About Vex
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-full inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:-translate-y-full"
                    >
                      About Vex
                    </span>
                  </span>
                </Link>
              </div>
            </div>

            {/* 4 Checklist Rows */}
            <ul className="space-y-2.5 px-3 pb-2.5 pt-4">
              {ABOUT_CHIPS.map((point, idx) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: 0.18 + idx * 0.06,
                    ease: EASE,
                  }}
                  className="flex items-center gap-2.5 text-[13px] font-normal text-[#5a6675]"
                >
                  <CirclePlusOutlineIcon className="h-3.5 w-3.5 shrink-0 text-[#5a6675]/80" />
                  <span>{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 2: Chip Top ("Essential intake") + Tall Stat ("58%") */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.65, delay: 0.12, ease: EASE }}
            className="flex flex-col gap-3.5"
          >
            <div className="dashed-panel group flex items-center gap-3.5 rounded-[16px] px-4 py-3.5 transition-colors duration-300 hover:border-[#212d3d]/45 hover:bg-[#faf6ed]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#ece9df] text-[#5a6675] transition-transform duration-300 group-hover:scale-105">
                <UsersOutlineIcon className="h-4 w-4" />
              </span>
              <span className="text-[13.5px] font-medium text-[#212d3d]">
                Candidate research
              </span>
            </div>

            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25 }}
              className="dashed-panel flex min-h-[290px] flex-1 flex-col justify-between rounded-[16px] p-6 transition-colors duration-300 hover:border-[#212d3d]/45 hover:bg-[#faf6ed]"
            >
              <AnimatedCounter value={58} suffix="%" duration={1.4} />
              <p className="text-[13.5px] leading-[1.52] text-[#5a6675]">
                Cited re-entering CV fields on long forms among their top
                frustrations — solved once inside Vex.
              </p>
            </motion.div>
          </motion.div>

          {/* Column 3: Tall Stat Top ("43%") + Chip Bottom ("4-tier skill proof") */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.65, delay: 0.19, ease: EASE }}
            className="flex flex-col gap-3.5"
          >
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25 }}
              className="dashed-panel flex min-h-[290px] flex-1 flex-col justify-between rounded-[16px] p-6 transition-colors duration-300 hover:border-[#212d3d]/45 hover:bg-[#faf6ed]"
            >
              <AnimatedCounter value={43} suffix="%" duration={1.25} />
              <p className="text-[13.5px] leading-[1.52] text-[#5a6675]">
                Abandon portal applications taking over 15 minutes — cut down by
                guided extension autofill.
              </p>
            </motion.div>

            <div className="dashed-panel group flex items-center gap-3.5 rounded-[16px] px-4 py-3.5 transition-colors duration-300 hover:border-[#212d3d]/45 hover:bg-[#faf6ed]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#ece9df] text-[#5a6675] transition-transform duration-300 group-hover:scale-105">
                <BuildingOutlineIcon className="h-4 w-4" />
              </span>
              <span className="text-[13.5px] font-medium text-[#212d3d]">
                8 unified modules
              </span>
            </div>
          </motion.div>

          {/* Column 4: Chip Top ("No fabricated claims") + Tall Stat ("67%") */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.65, delay: 0.26, ease: EASE }}
            className="flex flex-col gap-3.5"
          >
            <div className="dashed-panel group flex items-center gap-3.5 rounded-[16px] px-4 py-3.5 transition-colors duration-300 hover:border-[#212d3d]/45 hover:bg-[#faf6ed]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#ece9df] text-[#5a6675] transition-transform duration-300 group-hover:scale-105">
                <CheckIcon className="h-4 w-4" />
              </span>
              <span className="text-[13.5px] font-medium text-[#212d3d]">
                Zero fabricated claims
              </span>
            </div>

            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25 }}
              className="dashed-panel flex min-h-[290px] flex-1 flex-col justify-between rounded-[16px] p-6 transition-colors duration-300 hover:border-[#212d3d]/45 hover:bg-[#faf6ed]"
            >
              <AnimatedCounter value={67} suffix="%" duration={1.45} />
              <p className="text-[13.5px] leading-[1.52] text-[#5a6675]">
                Have spotted stale or suspect postings — filtered out via live
                freshness and deduplication.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Dashed Client Logos Bar with Pinned Dark Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, delay: 0.15, ease: EASE }}
          className="mt-4 flex flex-col items-stretch overflow-hidden rounded-[18px] border border-dashed border-[#212d3d]/24 bg-[#faf6ed]/55 p-1.5 sm:flex-row"
        >
          {/* Pinned Dark Label Box */}
          <div className="z-10 flex shrink-0 items-center justify-center rounded-[12px] bg-[#212d3d] px-6 py-5 text-[#faf6ed] sm:justify-start sm:px-7">
            <h3 className="whitespace-nowrap font-serif-display text-[21px] font-normal tracking-[-0.015em]">
              Built for six career tracks
            </h3>
          </div>

          {/* Infinite Dashed Logo Card Marquee */}
          <div className="marquee-wrapper relative flex flex-1 items-center overflow-hidden pt-2 sm:pl-2 sm:pt-0">
            <div className="animate-marquee-slow items-stretch gap-2 pr-2">
              {logos.map((logo, idx) => (
                <div
                  key={`${logo.name}-${idx}`}
                  className="flex min-w-[162px] shrink-0 items-center justify-center rounded-[12px] border border-dashed border-[#212d3d]/20 bg-[#faf6ed] px-7 py-5 transition-colors duration-300 hover:border-[#212d3d]/45"
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="h-5 w-auto max-w-[118px] object-contain opacity-85 transition-opacity duration-200 hover:opacity-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
