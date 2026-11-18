import React from "react";
import type { Metadata } from "next";
import { ABOUT_PAGE, ASSETS } from "@/data/palladio";
import Eyebrow from "@/components/Eyebrow";
import PalladioButton from "@/components/PalladioButton";
import SectionHead from "@/components/SectionHead";
import FaqSection from "@/components/home/FaqSection";

export const metadata: Metadata = {
  title: "About | Vex",
  description:
    "The team and product principles behind Vex — helping candidates go from sign-up to interview-ready in 24 hours without fabricated claims.",
};

export default function AboutPage() {
  const logos = [...ASSETS.clientLogos, ...ASSETS.clientLogos];

  return (
    <>
      {/* Hero */}
      <section className="bg-[#faf6ed] px-2.5 pb-2.5 pt-[76px]">
        <div className="relative flex min-h-[64vh] flex-col justify-between overflow-hidden rounded-[30px] bg-[#12222e] text-[#faf6ed]">
          <img
            src={ASSETS.aboutHero}
            alt="Vex product team in London"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55"
          />
          <div
            aria-hidden="true"
            className="hero-scrim pointer-events-none absolute inset-0"
          />
          <div className="h-10" />

          <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 pb-12 pt-10 sm:px-9 lg:px-12">
            <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
              <div className="space-y-5 lg:col-span-8">
                <Eyebrow label="Who we are" tone="dark" />
                <h1 className="font-serif-display text-[clamp(3rem,5.5vw,5.25rem)] font-normal leading-[1.04] tracking-[-0.03em]">
                  Built around the{" "}
                  <span className="italic text-[#faf6ed]/85">24-hour loop</span>
                </h1>
                <p className="max-w-[54ch] text-[17px] leading-[1.6] text-[#faf6ed]/80">
                  Vex replaces fragmented boards, repetitive forms, and fabricated
                  AI copy with one grounded workspace — ambitious on readiness,
                  honest on outcomes.
                </p>
              </div>

              <div className="lg:col-span-4">
                <div className="frost-card rounded-[24px] p-5 text-[#212d3d]">
                  <div className="flex items-center gap-4">
                    <img
                      src={ASSETS.teamPortraits.adrian}
                      alt="Adrian Vance, Vex Founder"
                      className="h-16 w-16 shrink-0 rounded-[14px] object-cover object-top"
                    />
                    <div>
                      <p className="text-[11.5px] font-medium uppercase tracking-[0.08em] text-[#5a6675]">
                        Vex Founder
                      </p>
                      <p className="font-serif-display text-[22px] leading-tight">
                        Adrian Vance
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-[14px] leading-[1.55] text-[#5a6675]">
                    Built Vex after watching strong candidates stall in
                    15-minute portals and synthetic resume slop.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story & Stats */}
      <section className="bg-[#faf6ed] px-4 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-[1280px]">
          <SectionHead
            eyebrow="Our story"
            title={
              <>
                A career workspace{" "}
                <span className="italic text-[#5a6675]">
                  we trusted ourselves
                </span>
              </>
            }
            lead="Vex started in 2026 to fix the everyday gap between capable candidates and broken application tooling — automating form drudgery and evidence-checked drafts while keeping every claim factual."
          />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_PAGE.stats.map((stat, idx) => (
              <div
                key={stat.value}
                className={`flex flex-col justify-between rounded-[24px] p-6 sm:p-7 ${
                  idx === 3
                    ? "bg-[#212d3d] text-[#faf6ed]"
                    : "bg-[#f2eee2] text-[#212d3d]"
                }`}
              >
                <p className="font-serif-display text-[56px] leading-none tracking-[-0.03em]">
                  {stat.value}
                </p>
                <p
                  className={`mt-6 text-[14.5px] leading-[1.58] ${
                    idx === 3 ? "text-[#faf6ed]/80" : "text-[#5a6675]"
                  }`}
                >
                  {stat.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 border-y border-[#212d3d]/10 py-8">
            <p className="mb-6 text-center text-[12px] font-medium uppercase tracking-[0.14em] text-[#5a6675]">
              Built across six career domains
            </p>
            <div className="marquee-wrapper relative overflow-hidden">
              <div className="animate-marquee-slow items-center gap-14 pr-14">
                {logos.map((logo, idx) => (
                  <div
                    key={`${logo.name}-${idx}`}
                    className="flex h-8 shrink-0 items-center justify-center opacity-70 grayscale"
                  >
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className="h-6 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Builders */}
      <section className="bg-[#faf6ed] px-4 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-[1280px]">
          <SectionHead
            eyebrow="Product team"
            title={
              <>
                Our product{" "}
                <span className="italic text-[#5a6675]">builders</span>
              </>
            }
            lead="Researchers, systems engineers and curriculum architects building candidate-first tools around honesty and speed."
          />

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_PAGE.team.map((member) => (
              <div
                key={member.name}
                className="flex flex-col rounded-[24px] bg-[#f2eee2] p-4"
              >
                <div className="aspect-[896/1040] overflow-hidden rounded-[18px] bg-[#ece9df]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="mt-4 space-y-1.5 px-1 pb-2">
                  <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#9c4930]">
                    {member.role}
                  </p>
                  <h3 className="font-serif-display text-[26px] leading-tight text-[#212d3d]">
                    {member.name}
                  </h3>
                  <p className="text-[13.5px] leading-[1.55] text-[#5a6675]">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers */}
      <section className="bg-[#faf6ed] px-4 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-5">
              <Eyebrow label="Careers" />
              <h2 className="font-serif-display text-[clamp(2.4rem,3.8vw,3.5rem)] leading-[1.06] tracking-[-0.025em] text-[#212d3d]">
                We hire rarely{" "}
                <span className="italic text-[#5a6675]">and carefully</span>
              </h2>
              <p className="text-[16px] leading-[1.6] text-[#5a6675]">
                Every builder here cares deeply about trustworthy AI evaluations,
                clean browser systems, and measurable candidate time saved.
              </p>

              <div className="rounded-[22px] bg-[#f2eee2] p-6">
                <h3 className="font-serif-display text-[24px] text-[#212d3d]">
                  Nothing that fits?
                </h3>
                <p className="mt-2 text-[14.5px] leading-[1.58] text-[#5a6675]">
                  Write to us anyway. We have made a role for the right person
                  more than once, and we would rather meet you early than not
                  at all.
                </p>
                <div className="mt-4">
                  <PalladioButton
                    label="Send an introduction"
                    href="/contact"
                    variant="primary"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="flex flex-col gap-3 rounded-[26px] bg-[#f2eee2] p-3 sm:p-4">
                {ABOUT_PAGE.careers.map((role) => (
                  <div
                    key={role.title}
                    className="flex flex-col items-start justify-between gap-4 rounded-[20px] bg-[#faf6ed] px-5 py-5 sm:flex-row sm:items-center"
                  >
                    <div>
                      <h3 className="font-serif-display text-[25px] leading-tight text-[#212d3d]">
                        {role.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2 text-[12px] text-[#5a6675]">
                        <span className="rounded-full bg-[#ece9df] px-3 py-1 font-medium text-[#212d3d]">
                          {role.practice}
                        </span>
                        <span className="rounded-full bg-[#ece9df] px-3 py-1">
                          {role.location}
                        </span>
                        <span className="rounded-full bg-[#ece9df] px-3 py-1">
                          {role.type}
                        </span>
                      </div>
                    </div>
                    <PalladioButton
                      label="Apply now"
                      href="/contact"
                      variant="secondary"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
    </>
  );
}

