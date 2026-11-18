"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ASSETS, PRICING_PLANS } from "@/data/palladio";
import Eyebrow from "@/components/Eyebrow";
import PalladioButton from "@/components/PalladioButton";
import { CheckIcon } from "@/components/Icons";

export default function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="bg-[#faf6ed] p-2.5 py-6">
      <div className="relative overflow-hidden rounded-[30px] bg-[#12222e] text-[#faf6ed]">
        <img
          src={ASSETS.frescoHands}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-luminosity"
        />
        <div
          aria-hidden="true"
          className="pricing-footer-scrim pointer-events-none absolute inset-0"
        />

        <div className="relative z-10 mx-auto max-w-[1280px] px-5 py-16 sm:px-9 sm:py-20 lg:px-12 lg:py-24">
          {/* Header & Billing Switcher */}
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-[660px] space-y-5">
              <Eyebrow label="Pricing" tone="dark" />
              <h2 className="font-serif-display text-[clamp(2.5rem,4.2vw,4rem)] font-normal leading-[1.06] tracking-[-0.025em] text-[#faf6ed]">
                Honest tiers,{" "}
                <span className="italic text-[#faf6ed]/80">
                  free to start today.
                </span>
              </h2>
              <p className="max-w-[50ch] text-[16.5px] leading-[1.6] text-[#faf6ed]/75">
                Start the 24-hour readiness path on Core at zero cost, or unlock
                unlimited evidence-checked tailoring, full portal autofill and
                MCP workflows on Vex Pro.
              </p>
            </div>

            {/* Monthly / Yearly Toggle */}
            <div className="inline-flex items-center self-start rounded-full border border-white/15 bg-white/[0.08] p-1.5 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`rounded-full px-5 py-2 text-[13.5px] font-medium transition-all cursor-pointer ${
                  billing === "monthly"
                    ? "bg-[#faf6ed] text-[#212d3d] shadow-xs"
                    : "text-[#faf6ed]/75 hover:text-[#faf6ed]"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling("yearly")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-[13.5px] font-medium transition-all cursor-pointer ${
                  billing === "yearly"
                    ? "bg-[#faf6ed] text-[#212d3d] shadow-xs"
                    : "text-[#faf6ed]/75 hover:text-[#faf6ed]"
                }`}
              >
                <span>Yearly</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    billing === "yearly"
                      ? "bg-[#2f6b4f] text-[#faf6ed]"
                      : "bg-white/15 text-[#faf6ed]"
                  }`}
                >
                  Save 2 mo
                </span>
              </button>
            </div>
          </div>

          {/* Two Plan Cards */}
          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {PRICING_PLANS.map((plan) => {
              const price =
                billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
              const unit =
                billing === "monthly" ? plan.monthlyUnit : plan.yearlyUnit;

              return (
                <div
                  key={plan.id}
                  className={`flex flex-col justify-between rounded-[26px] border p-7 backdrop-blur-md sm:p-9 ${
                    plan.featured
                      ? "border-white/25 bg-white/[0.11]"
                      : "border-white/[0.14] bg-white/[0.07]"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[12.5px] font-medium text-[#faf6ed]/70">
                          {plan.eyebrow}
                        </p>
                        <h3 className="mt-1.5 font-serif-display text-[36px] leading-tight text-[#faf6ed]">
                          {plan.name}
                        </h3>
                      </div>
                      {plan.featured && (
                        <span className="rounded-full bg-[#faf6ed] px-3 py-1 text-[11.5px] font-medium text-[#212d3d]">
                          Most common
                        </span>
                      )}
                    </div>

                    <div className="mt-6 flex items-baseline gap-2.5 border-y border-white/12 py-5">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`${plan.id}-${billing}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="font-serif-display text-[56px] leading-none tracking-[-0.03em] text-[#faf6ed]"
                        >
                          {price}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-[14px] text-[#faf6ed]/70">
                        {unit}
                      </span>
                    </div>

                    <p className="mt-5 text-[15px] leading-[1.6] text-[#faf6ed]/80">
                      {plan.summary}
                    </p>

                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-3 text-[14.5px] text-[#faf6ed]/90"
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-[#faf6ed]">
                            <CheckIcon className="h-3 w-3" />
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-2">
                    <PalladioButton
                      label={plan.ctaLabel}
                      href={`/contact?plan=${plan.id}`}
                      variant={plan.featured ? "onDark" : "nav"}
                      fullWidth
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

