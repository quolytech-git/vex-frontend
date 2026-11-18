import React, { Suspense } from "react";
import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import ContactForm from "@/components/ContactForm";
import FaqSection from "@/components/home/FaqSection";
import { SITE_META } from "@/data/palladio";

export const metadata: Metadata = {
  title: "Get Started | Vex",
  description:
    "Request early access, university/boot-camp cohort onboarding, or ask the Vex product team about your 24-hour workflow.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-[#faf6ed] px-4 pb-20 pt-32 sm:px-8 lg:pt-40">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Intro & Assurances */}
            <div className="space-y-8 lg:col-span-5">
              <div className="space-y-5">
                <Eyebrow label="Start with Vex" />
                <h1 className="font-serif-display text-[clamp(3rem,5vw,4.75rem)] font-normal leading-[1.04] tracking-[-0.03em] text-[#212d3d]">
                  Start your{" "}
                  <span className="italic text-[#5a6675]">24-hour path.</span>
                </h1>
                <p className="max-w-[44ch] text-[17px] leading-[1.6] text-[#5a6675]">
                  Tell us your target roles, timeline, or workspace needs. We
                  set up your Vex access or walk you through Pro & MCP options.
                </p>
              </div>

              <div className="space-y-3">
                <div className="rounded-[22px] bg-[#f2eee2] p-5">
                  <h2 className="font-serif-display text-[23px] leading-tight text-[#212d3d]">
                    Four-minute setup, zero bloat
                  </h2>
                  <p className="mt-1.5 text-[14px] leading-[1.55] text-[#5a6675]">
                    Only essential career facts required — no 20-step intake
                    forms standing between you and live matches.
                  </p>
                </div>

                <div className="rounded-[22px] bg-[#f2eee2] p-5">
                  <h2 className="font-serif-display text-[23px] leading-tight text-[#212d3d]">
                    Direct reply from product engineers
                  </h2>
                  <p className="mt-1.5 text-[14px] leading-[1.55] text-[#5a6675]">
                    Questions about extension permissions, MCP keys, or cohort
                    seats receive a clear reply within 24 hours.
                  </p>
                </div>
              </div>

              <div className="border-t border-[#212d3d]/10 pt-5 text-[14.5px] text-[#5a6675]">
                <p>
                  Direct line:{" "}
                  <a
                    href="tel:+442079460000"
                    className="font-medium text-[#212d3d] hover:underline"
                  >
                    {SITE_META.phone}
                  </a>
                </p>
                <p className="mt-1">
                  Email:{" "}
                  <a
                    href={`mailto:${SITE_META.email}`}
                    className="font-medium text-[#212d3d] hover:underline"
                  >
                    {SITE_META.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Right Interactive Form */}
            <div className="lg:col-span-7">
              <Suspense
                fallback={
                  <div className="rounded-[28px] bg-[#f2eee2] p-9 text-[#5a6675]">
                    Loading enquiry form...
                  </div>
                }
              >
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
    </>
  );
}

