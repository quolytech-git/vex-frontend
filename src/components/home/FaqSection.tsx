"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FAQS } from "@/data/palladio";
import Eyebrow from "@/components/Eyebrow";
import PalladioButton from "@/components/PalladioButton";
import { PlusIcon } from "@/components/Icons";

export default function FaqSection() {
  const [category, setCategory] = useState<"Platform" | "Results">(
    "Platform"
  );
  const filtered = FAQS.filter((item) => item.category === category);
  const [openId, setOpenId] = useState<string>(FAQS[0].id);

  function handleCategoryChange(nextCat: "Platform" | "Results") {
    setCategory(nextCat);
    const firstInCat = FAQS.find((f) => f.category === nextCat);
    if (firstInCat) setOpenId(firstInCat.id);
  }

  return (
    <section id="faq" className="bg-[#faf6ed] px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Sticky Header + Callout */}
          <div className="lg:col-span-5">
            <div className="space-y-6 lg:sticky lg:top-28">
              <Eyebrow label="Questions" />
              <h2 className="font-serif-display text-[clamp(2.5rem,4.1vw,4rem)] font-normal leading-[1.06] tracking-[-0.025em] text-[#212d3d]">
                Asked before{" "}
                <span className="italic text-[#5a6675]">you start.</span>
              </h2>
              <p className="max-w-[42ch] text-[16.5px] leading-[1.58] text-[#5a6675]">
                Twelve direct answers on how Vex keeps CVs truthful, respects your
                final submit click, and defines what 24-hour readiness covers.
              </p>

              <div className="rounded-[22px] bg-[#f2eee2] p-5 sm:p-6">
                <p className="font-serif-display text-[23px] leading-snug text-[#212d3d]">
                  Still have a question?
                </p>
                <p className="mt-1.5 text-[14px] leading-[1.55] text-[#5a6675]">
                  Write to the Vex product team directly — plain answers on data
                  portability, extension behaviour, or team rollouts.
                </p>
                <div className="mt-4">
                  <PalladioButton
                    label="Ask our team"
                    href="/contact"
                    variant="primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Tabs + Accordion */}
          <div className="lg:col-span-7">
            <div className="rounded-[28px] bg-[#f2eee2] p-3 sm:p-5">
              {/* Category Tabs */}
              <div className="mb-4 inline-flex rounded-full bg-[#ece9df] p-1">
                {(["Platform", "Results"] as const).map((tab) => {
                  const active = category === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => handleCategoryChange(tab)}
                      className={`relative cursor-pointer rounded-full px-5 py-2 text-[13.5px] font-medium transition-colors duration-300 ${
                        active ? "text-[#faf6ed]" : "text-[#5a6675] hover:text-[#212d3d]"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="faq-tab-indicator"
                          transition={{ type: "spring", stiffness: 320, damping: 32 }}
                          className="absolute inset-0 rounded-full bg-[#212d3d] shadow-xs"
                        />
                      )}
                      <span className="relative z-10">{tab}</span>
                    </button>
                  );
                })}
              </div>

              {/* FAQ Items */}
              <div className="flex flex-col gap-2.5">
                {filtered.map((item) => {
                  const isOpen = openId === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      layout="position"
                      transition={{ type: "spring", stiffness: 280, damping: 32 }}
                      className={`overflow-hidden rounded-[20px] transition-colors duration-300 ${
                        isOpen
                          ? "bg-[#faf6ed] shadow-[0_6px_24px_rgba(33,45,61,0.05)]"
                          : "bg-[#ece9df]/70 hover:bg-[#faf6ed]/75"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenId(isOpen ? "" : item.id)}
                        aria-expanded={isOpen}
                        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                      >
                        <h3 className="font-serif-display text-[22px] leading-[1.2] tracking-[-0.015em] text-[#212d3d] sm:text-[24px]">
                          {item.question}
                        </h3>
                        <motion.span
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#212d3d]/15 transition-colors duration-300 ${
                            isOpen
                              ? "bg-[#212d3d] text-[#faf6ed]"
                              : "bg-[#faf6ed] text-[#212d3d]"
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
                              height: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                              opacity: { duration: 0.3, ease: "easeOut" },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-0.5 sm:px-6 sm:pb-6">
                              <p className="text-[15px] leading-[1.62] text-[#5a6675]">
                                {item.answer}
                              </p>
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
      </div>
    </section>
  );
}

