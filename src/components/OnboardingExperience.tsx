"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { INDUSTRIES, SERVICES } from "@/data/palladio";
import Eyebrow from "@/components/Eyebrow";
import PalladioButton from "@/components/PalladioButton";
import { ArrowRightIcon, CheckIcon, VexLogoMark } from "@/components/Icons";

const EASE = [0.22, 1, 0.36, 1] as const;

const PHILOSOPHER_STEPS = [
  {
    step: 1,
    number: "01",
    label: "Baseline",
    quote: "Begin with what is already true.",
    note: "Give Vex your real timeline once. No 20-page questionnaire — we extract essential facts and reuse them cleanly everywhere.",
  },
  {
    step: 2,
    number: "02",
    label: "Track & Role",
    quote: "Aim where your proof actually lands.",
    note: "Select your career domain and role target so freshness signals and explainable match reasons stay sharp from hour one.",
  },
  {
    step: 3,
    number: "03",
    label: "Priorities",
    quote: "Automate drudgery, never truth.",
    note: "Pick what Vex prepares first inside your first 24 hours — while final submit clicks and honesty boundaries remain strictly yours.",
  },
  {
    step: 4,
    number: "04",
    label: "Ready",
    quote: "Prepared to meet the room.",
    note: "Your write-once fact profile is structured. Review your four-tier skill ladder and launch straight into tailored preparation.",
  },
] as const;

const WORK_MODES = ["Hybrid", "Remote UK / EU", "London On-site", "Global Remote"] as const;

const PRIORITY_CARDS = [
  {
    id: "cv-diffs",
    title: "Evidence-locked CV diffs",
    badge: "Zero invented claims",
    summary: "Tailor bullets per role using line-by-line factual diffs.",
    image: SERVICES[1].image,
  },
  {
    id: "autofill",
    title: "Assisted portal autofill",
    badge: "Stops before submit",
    summary: "Pre-fill fragmented ATS forms cleanly under your final check.",
    image: SERVICES[2].image,
  },
  {
    id: "mock-prep",
    title: "Text-first mock interviews",
    badge: "No covert overlays",
    summary: "Rehearse role-grounded follow-up questions before screening.",
    image: SERVICES[3].image,
  },
  {
    id: "skill-mcp",
    title: "4-tier skill proof & MCP",
    badge: "Scoped portability",
    summary: "Upgrade CV skills via drills and sync authorised AI tools.",
    image: SERVICES[4].image,
  },
] as const;

export default function OnboardingExperience() {
  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);

  const [fullName, setFullName] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [intakeMethod, setIntakeMethod] = useState<"upload" | "manual">("upload");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = params.get("name");
    const e = params.get("email");
    if (n) {
      setFullName(n);
    } else {
      try {
        const stored = window.localStorage.getItem("vex_frontend_user");
        if (stored) {
          const parsed = JSON.parse(stored) as { name?: string; email?: string };
          if (parsed.name) setFullName(parsed.name);
          if (parsed.email && !e) setInitialEmail(parsed.email);
        }
      } catch {
        // Pure client UI fallback.
      }
    }
    if (e) setInitialEmail(e);
  }, []);
  const [cvExcerpt, setCvExcerpt] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<string>(INDUSTRIES[2].name);
  const [workMode, setWorkMode] = useState<string>("Hybrid");
  const [priorities, setPriorities] = useState<string[]>(["cv-diffs", "mock-prep"]);
  const [agreedBoundary, setAgreedBoundary] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const currentMeta = PHILOSOPHER_STEPS[step - 1];

  function togglePriority(id: string) {
    setPriorities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function goToStep(next: number) {
    setErrorMsg("");
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

  function handleNext() {
    setErrorMsg("");

    if (step === 1) {
      if (!targetRole.trim()) {
        setTargetRole("Product Manager");
      }
      goToStep(2);
      return;
    }

    if (step === 2) {
      goToStep(3);
      return;
    }

    if (step === 3) {
      const chosenPriorities = priorities.length > 0 ? priorities : ["cv-diffs"];
      if (priorities.length === 0) {
        setPriorities(chosenPriorities);
      }
      setSubmitting(true);
      try {
        window.localStorage.setItem(
          "vex_onboarding_profile",
          JSON.stringify({
            name: fullName,
            email: initialEmail,
            intakeMethod,
            currentRole,
            targetRole: targetRole.trim() || "Product Manager",
            track: selectedTrack,
            workMode,
            priorities: chosenPriorities,
            agreedBoundary,
            completedAt: new Date().toISOString(),
          })
        );
      } catch {
        // Ignore storage restrictions in browser preview mode.
      }
      setTimeout(() => {
        setSubmitting(false);
        goToStep(4);
      }, 220);
    }
  }

  return (
    <div className="bg-[#faf6ed] pb-20">
      {/* TOP HERO WITH ANIMATED PHILOSOPHER GUIDE */}
      <section className="px-2.5 pt-[76px]">
        <div className="relative overflow-hidden rounded-[30px] bg-[#141e29] text-[#faf6ed] shadow-[0_24px_64px_rgba(14,24,32,0.22)]">
          {/* Subtle Architectural Rotunda Backdrop */}
          <motion.img
            src="/images/vex-auth-bg.jpg"
            alt="Architectural rotunda backdrop"
            initial={{ scale: 1.06, opacity: 0.35 }}
            animate={{ scale: 1, opacity: 0.42 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center mix-blend-luminosity"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(20,30,41,0.94) 0%, rgba(24,36,48,0.82) 55%, rgba(16,25,35,0.92) 100%)",
            }}
          />

          <div className="relative z-10 mx-auto max-w-[1220px] px-5 py-10 sm:px-9 sm:py-12 lg:px-12 lg:py-14">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              {/* Left Editorial Guidance + Step Progress */}
              <div className="space-y-6 lg:col-span-7">
                <div className="flex flex-wrap items-center gap-3">
                  <Eyebrow
                    label={`4-minute onboarding • Step ${currentMeta.number} / 04`}
                    tone="dark"
                  />
                  {fullName && (
                    <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[12px] text-[#faf6ed]/80">
                      Welcome, {fullName}
                    </span>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMeta.step}
                    initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.42, ease: EASE }}
                    className="space-y-3"
                  >
                    <h1 className="font-serif-display text-[clamp(2.3rem,4.2vw,3.9rem)] font-normal leading-[1.03] tracking-[-0.03em] text-[#faf6ed]">
                      “{currentMeta.quote}”
                    </h1>
                    <p className="max-w-[54ch] text-[16px] leading-[1.6] text-[#faf6ed]/78">
                      {currentMeta.note}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Step Pills + Animated Track Rail */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {PHILOSOPHER_STEPS.map((item) => {
                      const active = step === item.step;
                      const done = step > item.step;
                      const clickable = item.step < step;
                      return (
                        <button
                          key={item.number}
                          type="button"
                          disabled={!clickable}
                          onClick={() => clickable && goToStep(item.step)}
                          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-all duration-300 ${
                            active
                              ? "bg-[#faf6ed] text-[#212d3d] shadow-xs"
                              : done
                              ? "cursor-pointer border border-white/25 bg-white/12 text-[#faf6ed] hover:bg-white/20"
                              : "cursor-default border border-white/10 bg-white/[0.04] text-[#faf6ed]/45"
                          }`}
                        >
                          <span className="font-mono text-[11px] font-semibold">
                            {done ? "OK" : item.number}
                          </span>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Smooth Spring Progress Line */}
                  <div className="h-[3px] w-full max-w-[440px] overflow-hidden rounded-full bg-white/15">
                    <motion.div
                      animate={{ width: `${(step / 4) * 100}%` }}
                      transition={{ type: "spring", stiffness: 220, damping: 28 }}
                      className="h-full rounded-full bg-[#faf6ed]"
                    />
                  </div>
                </div>
              </div>

              {/* Right Philosopher Centerpiece on Top with Bigger Orbital Frame & Floating Discipline Pills */}
              <div className="flex items-center justify-center lg:col-span-5 lg:justify-end">
                <div className="relative flex h-[340px] w-[300px] items-center justify-center sm:h-[400px] sm:w-[350px]">
                  {/* Ambient Warm Parchment Aureole */}
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    aria-hidden="true"
                    className="pointer-events-none absolute h-[290px] w-[290px] rounded-full bg-[#faf6ed]/15 blur-3xl sm:h-[340px] sm:w-[340px]"
                  />

                  {/* Slow Rotating Dashed Celestial / Vex Radar Orbit */}
                  <motion.svg
                    animate={{ rotate: 360 }}
                    transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
                    viewBox="0 0 320 320"
                    fill="none"
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-4 h-[calc(100%+32px)] w-[calc(100%+32px)]"
                  >
                    <circle
                      cx="160"
                      cy="160"
                      r="148"
                      stroke="#faf6ed"
                      strokeOpacity="0.28"
                      strokeWidth="1.2"
                      strokeDasharray="5 7"
                    />
                    <circle
                      cx="265"
                      cy="56"
                      r="4.5"
                      fill="#faf6ed"
                      fillOpacity="0.9"
                    />
                    <circle
                      cx="55"
                      cy="264"
                      r="3"
                      fill="#84a9dc"
                      fillOpacity="0.85"
                    />
                  </motion.svg>

                  {/* Counter-Rotating Inner Fine Ring */}
                  <motion.svg
                    animate={{ rotate: -360 }}
                    transition={{ duration: 64, repeat: Infinity, ease: "linear" }}
                    viewBox="0 0 320 320"
                    fill="none"
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full"
                  >
                    <circle
                      cx="160"
                      cy="160"
                      r="128"
                      stroke="#faf6ed"
                      strokeOpacity="0.16"
                      strokeWidth="1"
                    />
                  </motion.svg>

                  {/* Levitating Bigger Arched Philosopher Frame */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 5.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative h-[330px] w-[260px] overflow-hidden rounded-t-full rounded-b-[28px] border border-white/40 bg-[#faf6ed] shadow-[0_32px_72px_rgba(8,14,20,0.55)] sm:h-[375px] sm:w-[295px]"
                  >
                    <motion.img
                      key={step}
                      initial={{ scale: 1.08 }}
                      animate={{ scale: 1.01 }}
                      transition={{ duration: 0.9, ease: EASE }}
                      src="/images/vex-philosopher.jpg"
                      alt="Classical philosopher mentor guiding onboarding"
                      className="h-full w-full object-cover object-[center_12%]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#18222e]/75 to-transparent"
                    />
                    <div className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/45 bg-[#faf6ed]/90 px-4 py-1.5 backdrop-blur-md">
                      <VexLogoMark className="h-4 w-4" />
                      <span className="whitespace-nowrap text-[11.5px] font-medium text-[#212d3d]">
                        {["Gnothi Seauton · Intake", "Telos · Direction", "Logos · Strategy", "Amor Fati · Ready"][step - 1]}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUESTIONNAIRE STAGE */}
      <section className="mx-auto mt-10 max-w-[1160px] px-4 sm:px-8">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              initial={{ opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -28 }}
              transition={{ duration: 0.42, ease: EASE }}
              className="space-y-8 rounded-[28px] bg-[#f2eee2] p-6 sm:p-10"
            >
              <div className="flex flex-col justify-between gap-4 border-b border-[#212d3d]/10 pb-6 sm:flex-row sm:items-end">
                <div>
                  <Eyebrow label="Step 01 — Write-once baseline" />
                  <h2 className="mt-3 font-serif-display text-[clamp(2rem,3.4vw,2.9rem)] font-normal leading-[1.06] tracking-[-0.025em] text-[#212d3d]">
                    How should Vex capture{" "}
                    <span className="italic text-[#5a6675]">your record?</span>
                  </h2>
                </div>
                <p className="max-w-[36ch] text-[14px] leading-[1.55] text-[#5a6675]">
                  Only essential details requested here. You can expand full
                  credential proof anytime.
                </p>
              </div>

              {/* Illustrated Method Picker Cards */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  {
                    id: "upload" as const,
                    title: "Paste or import CV summary",
                    desc: "Drop in existing experience bullets so Vex extracts a clean canonical inventory you can verify.",
                    image: SERVICES[0].image,
                    tag: "Fastest (~2 mins)",
                  },
                  {
                    id: "manual" as const,
                    title: "Clean manual baseline",
                    desc: "Start fresh with just your role trajectory and core capabilities — zero legacy formatting noise.",
                    image: SERVICES[1].image,
                    tag: "Clean slate (~4 mins)",
                  },
                ].map((option) => {
                  const selected = intakeMethod === option.id;
                  return (
                    <motion.button
                      key={option.id}
                      type="button"
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => setIntakeMethod(option.id)}
                      className={`group flex cursor-pointer flex-col justify-between overflow-hidden rounded-[22px] border p-4 text-left transition-all duration-300 sm:p-5 ${
                        selected
                          ? "border-[#212d3d] bg-[#faf6ed] shadow-[0_14px_32px_rgba(33,45,61,0.08)]"
                          : "border-[#212d3d]/10 bg-[#ece9df]/70 hover:border-[#212d3d]/30 hover:bg-[#faf6ed]"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[14px] bg-[#ece9df]">
                          <img
                            src={option.image}
                            alt={option.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-full bg-[#ece9df] px-2.5 py-0.5 text-[11px] font-medium text-[#5a6675]">
                              {option.tag}
                            </span>
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                                selected
                                  ? "bg-[#212d3d] text-[#faf6ed]"
                                  : "border border-[#212d3d]/20 text-transparent"
                              }`}
                            >
                              <CheckIcon className="h-3.5 w-3.5" />
                            </span>
                          </div>
                          <h3 className="mt-2 font-serif-display text-[23px] leading-tight text-[#212d3d]">
                            {option.title}
                          </h3>
                          <p className="mt-1 text-[13.5px] leading-[1.5] text-[#5a6675]">
                            {option.desc}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Essential Inputs */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[#212d3d]">
                    Your name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full rounded-[16px] border border-[#212d3d]/15 bg-[#faf6ed] px-4 py-3 text-[14.5px] text-[#212d3d] placeholder:text-[#5a6675]/60 focus:border-[#212d3d] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[#212d3d]">
                    Current or most recent title
                  </label>
                  <input
                    type="text"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    placeholder="e.g. Senior Product Analyst"
                    className="w-full rounded-[16px] border border-[#212d3d]/15 bg-[#faf6ed] px-4 py-3 text-[14.5px] text-[#212d3d] placeholder:text-[#5a6675]/60 focus:border-[#212d3d] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[#212d3d]">
                    Target role you want next
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Product Manager"
                    className="w-full rounded-[16px] border border-[#212d3d]/15 bg-[#faf6ed] px-4 py-3 text-[14.5px] text-[#212d3d] placeholder:text-[#5a6675]/60 focus:border-[#212d3d] focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Product Manager", "Frontend Engineer", "Strategy Lead"].map(
                      (sample) => (
                        <button
                          key={sample}
                          type="button"
                          onClick={() => setTargetRole(sample)}
                          className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[11.5px] transition-colors ${
                            targetRole === sample
                              ? "bg-[#212d3d] text-[#faf6ed]"
                              : "bg-[#faf6ed] text-[#5a6675] hover:text-[#212d3d]"
                          }`}
                        >
                          {sample}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {intakeMethod === "upload" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-[13px] font-medium text-[#212d3d]">
                        Paste key CV bullets or recent achievements (optional)
                      </label>
                      <textarea
                        rows={3}
                        value={cvExcerpt}
                        onChange={(e) => setCvExcerpt(e.target.value)}
                        placeholder="Paste highlights recruiters should see — Vex anchors future tailoring strictly to verified lines here."
                        className="w-full rounded-[18px] border border-[#212d3d]/15 bg-[#faf6ed] p-4 text-[14.5px] text-[#212d3d] placeholder:text-[#5a6675]/60 focus:border-[#212d3d] focus:outline-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              initial={{ opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -28 }}
              transition={{ duration: 0.42, ease: EASE }}
              className="space-y-8 rounded-[28px] bg-[#f2eee2] p-6 sm:p-10"
            >
              <div className="flex flex-col justify-between gap-4 border-b border-[#212d3d]/10 pb-6 sm:flex-row sm:items-end">
                <div>
                  <Eyebrow label="Step 02 — Career track & setup" />
                  <h2 className="mt-3 font-serif-display text-[clamp(2rem,3.4vw,2.9rem)] font-normal leading-[1.06] tracking-[-0.025em] text-[#212d3d]">
                    Which domain fits{" "}
                    <span className="italic text-[#5a6675]">your target?</span>
                  </h2>
                </div>
                <p className="max-w-[36ch] text-[14px] leading-[1.55] text-[#5a6675]">
                  Used to tune deduplicated role alerts and interview follow-up
                  rubrics.
                </p>
              </div>

              {/* 6 Illustrated Career Track Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {INDUSTRIES.map((sector) => {
                  const selected = selectedTrack === sector.name;
                  return (
                    <motion.button
                      key={sector.name}
                      type="button"
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => setSelectedTrack(sector.name)}
                      className={`group flex cursor-pointer flex-col justify-between overflow-hidden rounded-[22px] border p-3.5 text-left transition-all duration-300 ${
                        selected
                          ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed] shadow-[0_14px_32px_rgba(33,45,61,0.16)]"
                          : "border-[#212d3d]/10 bg-[#faf6ed] text-[#212d3d] hover:border-[#212d3d]/35"
                      }`}
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[15px] bg-[#ece9df]">
                        <img
                          src={sector.image}
                          alt={sector.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        />
                        {selected && (
                          <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#faf6ed] text-[#212d3d] shadow-xs">
                            <CheckIcon className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="mt-3.5 space-y-1 px-1 pb-1">
                        <h3 className="font-serif-display text-[22px] leading-tight">
                          {sector.name}
                        </h3>
                        <p
                          className={`text-[13px] leading-[1.45] ${
                            selected ? "text-[#faf6ed]/75" : "text-[#5a6675]"
                          }`}
                        >
                          {sector.summary}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Work Arrangement Pills */}
              <div className="space-y-3 border-t border-[#212d3d]/10 pt-5">
                <p className="text-[13.5px] font-medium text-[#212d3d]">
                  Preferred working pattern
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {WORK_MODES.map((item) => {
                    const active = workMode === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setWorkMode(item)}
                        className={`cursor-pointer rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors ${
                          active
                            ? "bg-[#212d3d] text-[#faf6ed]"
                            : "bg-[#faf6ed] text-[#5a6675] hover:text-[#212d3d]"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              initial={{ opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -28 }}
              transition={{ duration: 0.42, ease: EASE }}
              className="space-y-8 rounded-[28px] bg-[#f2eee2] p-6 sm:p-10"
            >
              <div className="flex flex-col justify-between gap-4 border-b border-[#212d3d]/10 pb-6 sm:flex-row sm:items-end">
                <div>
                  <Eyebrow label="Step 03 — First 24 hours" />
                  <h2 className="mt-3 font-serif-display text-[clamp(2rem,3.4vw,2.9rem)] font-normal leading-[1.06] tracking-[-0.025em] text-[#212d3d]">
                    What slows your search{" "}
                    <span className="italic text-[#5a6675]">down most?</span>
                  </h2>
                </div>
                <p className="max-w-[36ch] text-[14px] leading-[1.55] text-[#5a6675]">
                  Select every bottleneck Vex should prioritise first inside Day
                  01.
                </p>
              </div>

              {/* 4 Illustrated Priority Toggle Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {PRIORITY_CARDS.map((card) => {
                  const selected = priorities.includes(card.id);
                  return (
                    <motion.button
                      key={card.id}
                      type="button"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => togglePriority(card.id)}
                      className={`group flex cursor-pointer items-center gap-4 rounded-[22px] border p-4 text-left transition-all duration-300 ${
                        selected
                          ? "border-[#212d3d] bg-[#faf6ed] shadow-[0_12px_28px_rgba(33,45,61,0.08)]"
                          : "border-[#212d3d]/10 bg-[#ece9df]/70 hover:bg-[#faf6ed]"
                      }`}
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[14px] bg-[#ece9df]">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-[#ece9df] px-2.5 py-0.5 text-[11px] font-medium text-[#5a6675]">
                            {card.badge}
                          </span>
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                              selected
                                ? "bg-[#212d3d] text-[#faf6ed]"
                                : "border border-[#212d3d]/20 text-transparent"
                            }`}
                          >
                            <CheckIcon className="h-3.5 w-3.5" />
                          </span>
                        </div>
                        <h3 className="mt-1.5 font-serif-display text-[22px] leading-tight text-[#212d3d]">
                          {card.title}
                        </h3>
                        <p className="mt-1 text-[13px] leading-[1.45] text-[#5a6675]">
                          {card.summary}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Dark Trust & Boundary Compact Banner */}
              <div className="flex flex-col items-start justify-between gap-4 rounded-[22px] bg-[#212d3d] p-5 text-[#faf6ed] sm:flex-row sm:items-center sm:p-6">
                <div className="space-y-1">
                  <p className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-[#c9c1b2]">
                    Vex honesty standard
                  </p>
                  <p className="text-[14.5px] leading-[1.55] text-[#faf6ed]/85">
                    Vex accelerates your preparation inside 24 hours, pauses for
                    your review before any portal submit, and never invents CV
                    metrics.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAgreedBoundary((v) => !v)}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-[#faf6ed] px-4 py-2 text-[13px] font-medium text-[#212d3d] transition-colors hover:bg-white"
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full ${
                      agreedBoundary
                        ? "bg-[#2f6b4f] text-[#faf6ed]"
                        : "border border-[#212d3d]/30"
                    }`}
                  >
                    {agreedBoundary && <CheckIcon className="h-2.5 w-2.5" />}
                  </span>
                  <span>Confirmed</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-4"
              custom={direction}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="space-y-8 rounded-[28px] bg-[#f2eee2] p-6 sm:p-10"
            >
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-7">
                  <div className="inline-flex items-center gap-2.5 rounded-full bg-[#2f6b4f] px-3.5 py-1.5 text-[12.5px] font-medium text-[#faf6ed]">
                    <CheckIcon className="h-3.5 w-3.5" />
                    <span>Onboarding Complete • Day 01 Initialised</span>
                  </div>
                  <h2 className="font-serif-display text-[clamp(2.2rem,3.8vw,3.4rem)] font-normal leading-[1.04] tracking-[-0.03em] text-[#212d3d]">
                    Your Vex workspace is{" "}
                    <span className="italic text-[#5a6675]">ready to run.</span>
                  </h2>
                  <p className="max-w-[50ch] text-[15.5px] leading-[1.6] text-[#5a6675]">
                    {fullName ? `${fullName}, your` : "Your"} baseline profile
                    targeting{" "}
                    <strong className="font-medium text-[#212d3d]">
                      {targetRole || "your next role"}
                    </strong>{" "}
                    in{" "}
                    <strong className="font-medium text-[#212d3d]">
                      {selectedTrack}
                    </strong>{" "}
                    ({workMode}) is structured.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <PalladioButton
                      label="Open your Vex dashboard"
                      href="/dashboard"
                      variant="primary"
                    />
                    <PalladioButton
                      label="Return home"
                      href="/"
                      variant="secondary"
                    />
                  </div>
                </div>

                {/* Right Evidence & Three-State Readiness Card */}
                <div className="rounded-[24px] bg-[#212d3d] p-6 text-[#faf6ed] lg:col-span-5">
                  <p className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-[#c9c1b2]">
                    Active inside your workspace
                  </p>
                  <div className="mt-4 divide-y divide-white/12 text-[14px]">
                    <div className="flex items-center justify-between py-3">
                      <span className="text-[#faf6ed]/75">Skill provenance</span>
                      <span className="font-medium">4 explicit tiers</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-[#faf6ed]/75">Submission ledger</span>
                      <span className="font-medium">
                        Prepared / Reported / Verified
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-[#faf6ed]/75">Focus areas</span>
                      <span className="font-medium">
                        {priorities.length} selected
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Validation Error Toast */}
        <AnimatePresence>
          {errorMsg && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 rounded-[16px] bg-[#9c4930]/12 px-5 py-3 text-[13.5px] text-[#9c4930]"
            >
              {errorMsg}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Bottom Stepper Navigation Bar styled identically to PalladioButton */}
        {step < 4 && (
          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button"
              disabled={step === 1 || submitting}
              onClick={() => goToStep(step - 1)}
              className="inline-flex h-[46px] cursor-pointer items-center gap-2 rounded-full bg-[#ece9df] px-5 text-[14px] font-medium text-[#212d3d] transition-colors hover:bg-[#e2ddd0] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span>←</span>
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={handleNext}
              className="group relative inline-flex h-[46px] cursor-pointer items-center gap-3 overflow-hidden rounded-full bg-[#212d3d] pl-6 pr-2.5 text-[14.5px] font-medium text-[#faf6ed] transition-colors hover:bg-[#2a394d] disabled:opacity-60"
            >
              <span className="relative inline-flex h-[20px] overflow-hidden leading-[20px]">
                <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                  {submitting
                    ? "Saving profile..."
                    : step === 3
                    ? "Finish onboarding"
                    : "Next step"}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-full inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full"
                >
                  {submitting
                    ? "Saving profile..."
                    : step === 3
                    ? "Finish onboarding"
                    : "Next step"}
                </span>
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#faf6ed] text-[#212d3d] transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

