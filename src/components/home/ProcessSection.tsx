"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROCESS_STEPS } from "@/data/palladio";
import SectionHead from "@/components/SectionHead";
import { PlusIcon } from "@/components/Icons";

export default function ProcessSection() {
  const [openStep, setOpenStep] = useState<string>(PROCESS_STEPS[0].number);

  return (
    <section id="process" className="bg-[#faf6ed] px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Sticky Column */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHead
                eyebrow="The 24-hour workflow"
                title={
                  <>
                    Four steps,{" "}
                    <span className="italic text-[#5a6675]">
                      written clearly.
                    </span>
                  </>
                }
                lead="A single guided progression from four-minute intake to truth-checked application drafts, reviewed portal autofill and structured mock interviews."
                ctaLabel="Start free"
                ctaHref="/signup"
                layout="stacked"
              />
            </div>
          </div>

          {/* Right Process Steps Wrapper */}
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-3 rounded-[28px] bg-[#f2eee2] p-3 sm:p-4">
              {PROCESS_STEPS.map((step) => {
                const isOpen = openStep === step.number;
                return (
                  <motion.div
                    key={step.number}
                    layout="position"
                    transition={{ type: "spring", stiffness: 280, damping: 32 }}
                    className={`overflow-hidden rounded-[22px] transition-colors duration-300 ${
                      isOpen
                        ? "bg-[#faf6ed] shadow-[0_6px_24px_rgba(33,45,61,0.05)]"
                        : "bg-[#ece9df]/80 hover:bg-[#faf6ed]/75"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenStep(step.number)}
                      aria-expanded={isOpen}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-flex h-8 min-w-[44px] items-center justify-center rounded-full px-2.5 text-[12px] font-medium transition-colors duration-300 ${
                            isOpen
                              ? "bg-[#212d3d] text-[#faf6ed]"
                              : "bg-[#faf6ed] text-[#5a6675]"
                          }`}
                        >
                          {step.number}
                        </span>
                        <h3 className="font-serif-display text-[26px] leading-[1.15] tracking-[-0.02em] text-[#212d3d] sm:text-[28px]">
                          {step.title}
                        </h3>
                      </div>

                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#212d3d]/15 transition-colors duration-300 ${
                          isOpen
                            ? "bg-[#212d3d] text-[#faf6ed]"
                            : "text-[#212d3d]"
                        }`}
                      >
                        <PlusIcon className="h-3.5 w-3.5" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: 0.44, ease: [0.22, 1, 0.36, 1] },
                            opacity: { duration: 0.3, ease: "easeOut" },
                          }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-5 px-5 pb-6 pt-1 sm:px-6">
                            <p className="text-[15.5px] leading-[1.6] text-[#5a6675]">
                              {step.description}
                            </p>

                            <div className="border-t border-[#212d3d]/10 pt-4">
                              <p className="mb-2.5 text-[11.5px] font-medium uppercase tracking-[0.1em] text-[#5a6675]">
                                What this includes
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {step.chips.map((chip) => (
                                  <span
                                    key={chip}
                                    className="rounded-full bg-[#ece9df] px-3.5 py-1.5 text-[13px] font-medium text-[#212d3d]"
                                  >
                                    {chip}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

