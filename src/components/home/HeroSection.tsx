"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ASSETS, CASE_STUDIES } from "@/data/palladio";
import Eyebrow from "@/components/Eyebrow";
import PalladioButton from "@/components/PalladioButton";
import { ArrowRightIcon } from "@/components/Icons";

const EASE = [0.22, 1, 0.36, 1] as const;
const HERO_WORDS = [
  { text: "From", italic: false },
  { text: "sign-up", italic: false },
  { text: "to", italic: false },
  { text: "interview-ready", italic: false },
  { text: "in", italic: true },
  { text: "24 hours.", italic: true },
];

export default function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);
  const featuredStudy = CASE_STUDIES[0];

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -36]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

  return (
    <section ref={heroRef} id="header" className="bg-[#faf6ed] px-2.5 pb-2.5 pt-[76px]">
      <div className="relative flex min-h-[calc(100vh-88px)] flex-col justify-between overflow-hidden rounded-[30px] bg-[#12222e] text-[#faf6ed]">
        {/* Parallax Fresco Backdrop */}
        <motion.img
          style={{ y: bgY, scale: bgScale }}
          initial={{ scale: 1.08, opacity: 0.6 }}
          animate={{ scale: 1.02, opacity: 0.78 }}
          transition={{ duration: 1.35, ease: EASE }}
          src={ASSETS.frescoHands}
          alt="Fresco of two outstretched hands almost touching against a slate-blue sky"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center will-change-transform"
        />
        <div
          aria-hidden="true"
          className="hero-scrim pointer-events-none absolute inset-0"
        />

        {/* Headline Block */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 mx-auto w-full max-w-[1280px] px-5 pt-10 sm:px-9 sm:pt-14 lg:px-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-5"
          >
            <Eyebrow label="From messy CVs to interview-ready" tone="dark" />
          </motion.div>

          <h1 className="max-w-[15ch] font-serif-display text-[clamp(3.35rem,6.8vw,6.4rem)] font-normal leading-[0.98] tracking-[-0.03em] text-[#faf6ed]">
            {HERO_WORDS.map((word, idx) => (
              <motion.span
                key={`${word.text}-${idx}`}
                initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.75,
                  delay: 0.08 + idx * 0.065,
                  ease: EASE,
                }}
                className={`mr-[0.22em] inline-block ${
                  word.italic ? "italic text-[#faf6ed]/85" : ""
                }`}
              >
                {word.text}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        {/* Bottom Split Row: Lead + Actions (Left) & Frosted Latest Case Card (Right) */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 mx-auto w-full max-w-[1280px] px-5 pb-7 pt-12 sm:px-9 sm:pb-10 lg:px-12"
        >
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            {/* Lead & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.36, ease: EASE }}
              className="space-y-6 lg:col-span-6 xl:col-span-7"
            >
              <p className="max-w-[46ch] text-[16.5px] leading-[1.58] text-[#faf6ed]/85 sm:text-[17.5px]">
                Vex is a candidate-first career platform — structured fact
                profiles, deduplicated job fit, truth-checked CV tailoring, and
                mock interview prep that respects your agency.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <PalladioButton
                  label="Start free"
                  href="/signup"
                  variant="onDark"
                />

                <Link
                  href="/#pricing"
                  className="group inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 py-3 text-[14.5px] font-medium text-[#faf6ed] backdrop-blur-md transition-colors duration-300 hover:border-white/60 hover:bg-white/20"
                >
                  <span className="relative inline-flex h-[18px] overflow-hidden leading-[18px]">
                    <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                      View pricing
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-full inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full"
                    >
                      View pricing
                    </span>
                  </span>
                </Link>
              </div>
            </motion.div>

            {/* Right Frosted Case Study Card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
              className="lg:col-span-6 xl:col-span-5"
            >
              <Link
                href={`/case-studies/${featuredStudy.slug}`}
                className="frost-card group flex flex-col gap-4 rounded-[20px] p-3 text-[#212d3d] transition-transform duration-300 hover:-translate-y-1 sm:flex-row sm:items-stretch"
              >
                <div className="aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[14px] bg-[#ece9df] sm:aspect-auto sm:w-[150px]">
                  <img
                    src={featuredStudy.image}
                    alt="Fresco of a waterwheel and mill beside an arched aqueduct"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between gap-3 py-1 pr-1">
                  <div className="space-y-2">
                    <span className="inline-flex rounded-full bg-[#ece9df] px-2.5 py-0.5 text-[11.5px] font-medium text-[#5a6675]">
                      Case study
                    </span>
                    <p className="text-[13.5px] leading-[1.45] text-[#212d3d]/85">
                      {featuredStudy.summary}
                    </p>
                  </div>

                  <div className="flex items-end justify-between gap-3 border-t border-[#212d3d]/10 pt-2.5">
                    <div>
                      <p className="font-serif-display text-[28px] leading-none tracking-[-0.02em] text-[#212d3d]">
                        24 hrs
                      </p>
                      <p className="mt-0.5 text-[11.5px] font-medium text-[#5a6675]">
                        Sign-up to interview-ready
                      </p>
                    </div>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#212d3d] text-[#faf6ed] transition-transform duration-300 group-hover:translate-x-0.5">
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
