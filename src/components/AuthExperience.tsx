"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon, CheckIcon, VexLogoMark } from "@/components/Icons";

type AuthMode = "login" | "signup" | "forgot";

interface AuthExperienceProps {
  initialMode?: "login" | "signup";
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AuthExperience({
  initialMode = "login",
}: AuthExperienceProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  function switchMode(next: AuthMode) {
    setMode(next);
    setStatus("idle");
    setFeedback("");
    setTimeout(() => {
      if (next === "signup") {
        nameInputRef.current?.focus();
      } else {
        emailInputRef.current?.focus();
      }
    }, 120);
  }

  function saveFrontendSession(displayName: string, userEmail: string) {
    try {
      window.localStorage.setItem(
        "vex_frontend_user",
        JSON.stringify({
          name: displayName,
          email: userEmail,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch {
      // Ignore storage quota / private mode issues in pure UI mode.
    }
  }

  function navigateToOnboarding(displayName: string, userEmail: string) {
    const qs = new URLSearchParams();
    if (displayName) qs.set("name", displayName);
    if (userEmail) qs.set("email", userEmail);
    setTimeout(() => {
      router.push(`/onboarding${qs.toString() ? `?${qs.toString()}` : ""}`);
    }, 350);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanEmail = email.trim() || "candidate@vex.careers";
    const cleanName = name.trim() || cleanEmail.split("@")[0] || "Candidate";

    if (mode === "forgot") {
      setStatus("success");
      setFeedback(`Reset preview ready for ${cleanEmail}.`);
      return;
    }

    setStatus("submitting");
    setFeedback("");
    saveFrontendSession(cleanName, cleanEmail);

    setTimeout(() => {
      setStatus("success");
      if (mode === "signup") {
        setFeedback("Account created — opening your 4-minute onboarding.");
        navigateToOnboarding(cleanName, cleanEmail);
      } else {
        setFeedback("Signed in — opening your Vex Readiness Dashboard.");
        setTimeout(() => router.push("/dashboard"), 300);
      }
    }, 240);
  }

  function handleGoogleQuick() {
    const cleanEmail = email.trim() || "candidate@vex.careers";
    const cleanName = name.trim() || "Vex Candidate";
    setStatus("submitting");
    setFeedback("");
    saveFrontendSession(cleanName, cleanEmail);

    setTimeout(() => {
      setStatus("success");
      if (mode === "signup") {
        setFeedback("Google workspace connected — opening your 4-minute onboarding.");
        navigateToOnboarding(cleanName, cleanEmail);
      } else {
        setFeedback("Signed in with Google — opening your Vex Readiness Dashboard.");
        setTimeout(() => router.push("/dashboard"), 300);
      }
    }, 220);
  }

  return (
    <section className="bg-[#faf6ed] px-2.5 pb-2.5 pt-[76px]">
      <div className="relative flex min-h-[calc(100vh-88px)] items-center justify-center overflow-hidden rounded-[30px] bg-[#18222e] py-12 sm:py-16">
        {/* Custom Classical Rotunda + Crystal Sphere Backdrop matching Vex Palette */}
        <motion.img
          initial={{ scale: 1.08, opacity: 0.75 }}
          animate={{ scale: 1.01, opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
          src="/images/vex-auth-bg.jpg"
          alt="Sunlit stone rotunda with glass sphere reflecting warm daylight"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center will-change-transform"
        />
        {/* Subtle Editorial Scrim so frosted glass bento pops cleanly */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(24,34,46,0.12) 0%, rgba(18,28,39,0.52) 100%)",
          }}
        />

        {/* Centered Reference-Adapted Floating Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE }}
          className="relative z-10 mx-auto w-full max-w-[1020px] px-4 sm:px-6"
        >
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-12">
            {/* LEFT COLUMN: Frosted Glass Auth Card + Dark Readiness Promo Card */}
            <div className="flex flex-col gap-4 md:col-span-6">
              {/* Top Frosted Glass Auth Card */}
              <motion.div
                layout="position"
                transition={{ duration: 0.35, ease: EASE }}
                className="flex flex-1 flex-col justify-between rounded-[28px] border border-white/55 bg-[#faf6ed]/80 p-7 text-[#212d3d] shadow-[0_32px_72px_rgba(14,24,32,0.28)] backdrop-blur-2xl sm:p-9"
              >
                <div>
                  {/* Card Top Bar: Brand + Mode Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <VexLogoMark className="h-[22px] w-[22px]" />
                      <span className="font-serif-display text-[17px] tracking-[-0.01em] text-[#212d3d]">
                        Vex Workspace
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        switchMode(mode === "signup" ? "login" : "signup")
                      }
                      className="cursor-pointer rounded-full px-3 py-1 text-[13px] font-medium text-[#212d3d] transition-colors hover:bg-[#212d3d]/8"
                    >
                      {mode === "signup" ? "Log in" : "Sign up"}
                    </button>
                  </div>

                  {/* Title & Quick OAuth Pill Row */}
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <AnimatePresence mode="wait">
                      <motion.h1
                        key={mode}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.24, ease: EASE }}
                        className="font-serif-display text-[40px] font-normal leading-none tracking-[-0.03em] text-[#212d3d]"
                      >
                        {mode === "login"
                          ? "Log in"
                          : mode === "signup"
                          ? "Sign up"
                          : "Recover"}
                      </motion.h1>
                    </AnimatePresence>

                    <button
                      type="button"
                      onClick={handleGoogleQuick}
                      disabled={status === "submitting"}
                      className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#212d3d]/20 bg-[#faf6ed]/70 px-3.5 py-1.5 text-[12.5px] font-medium text-[#212d3d] transition-all duration-200 hover:border-[#212d3d]/45 hover:bg-white disabled:opacity-50"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#212d3d] text-[10px] font-bold text-[#faf6ed]">
                        G
                      </span>
                      <span>Google</span>
                    </button>
                  </div>

                  {/* Form Inputs */}
                  <form onSubmit={handleSubmit} className="mt-6 space-y-2.5">
                    <AnimatePresence initial={false}>
                      {mode === "signup" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                          animate={{ opacity: 1, height: "auto", marginBottom: 10 }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.28, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <label className="flex items-center gap-3 rounded-full border border-[#212d3d]/10 bg-[#ece9df]/75 px-3 py-2 transition-colors focus-within:border-[#212d3d]/40 focus-within:bg-[#faf6ed]/95">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#faf6ed] font-mono text-[10px] font-semibold text-[#5a6675]">
                              ID
                            </span>
                              <input
                                ref={nameInputRef}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="full name"
                                className="w-full bg-transparent pr-2 text-[14px] text-[#212d3d] placeholder:text-[#5a6675]/75 focus:outline-none"
                              />
                            </label>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Email Pill */}
                      <label className="flex items-center gap-3 rounded-full border border-[#212d3d]/10 bg-[#ece9df]/75 px-3 py-2 transition-colors focus-within:border-[#212d3d]/40 focus-within:bg-[#faf6ed]/95">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#faf6ed] text-[13px] font-medium text-[#5a6675]">
                          @
                        </span>
                        <input
                          ref={emailInputRef}
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e-mail address"
                          className="w-full bg-transparent pr-2 text-[14px] text-[#212d3d] placeholder:text-[#5a6675]/75 focus:outline-none"
                        />
                      </label>

                      {/* Password Pill */}
                      {mode !== "forgot" && (
                        <div className="flex items-center gap-3 rounded-full border border-[#212d3d]/10 bg-[#ece9df]/75 py-2 pl-3 pr-2 transition-colors focus-within:border-[#212d3d]/40 focus-within:bg-[#faf6ed]/95">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#faf6ed] text-[#5a6675]">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.8}
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            >
                              <circle cx="8" cy="15" r="4" />
                              <path d="M10.8 12.2 19 4m-3 3 2 2" />
                            </svg>
                          </span>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
                            className="min-w-0 flex-1 bg-transparent text-[14px] text-[#212d3d] placeholder:text-[#5a6675]/75 focus:outline-none"
                          />
                          {mode === "login" ? (
                            <button
                              type="button"
                              onClick={() => { window.location.href = "/forgot-password"; }}
                              className="shrink-0 cursor-pointer rounded-full bg-[#faf6ed] px-3 py-1 text-[11.5px] font-medium text-[#5a6675] shadow-2xs transition-colors hover:text-[#212d3d]"
                            >
                              I forgot
                            </button>
                          ) : (
                            <Link
                              href="/onboarding"
                              className="shrink-0 rounded-full bg-[#faf6ed]/90 px-2.5 py-1 text-[11px] font-medium text-[#212d3d] transition-colors hover:bg-white"
                            >
                              Preview flow →
                            </Link>
                          )}
                        </div>
                      )}

                    {/* Status Feedback */}
                    <AnimatePresence>
                      {feedback && (
                        <motion.p
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`rounded-[14px] px-3.5 py-2.5 text-[12.5px] leading-[1.45] ${
                            status === "error"
                              ? "bg-[#9c4930]/12 text-[#9c4930]"
                              : "bg-[#2f6b4f]/12 text-[#2f6b4f]"
                          }`}
                        >
                          {feedback}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Disclaimer Note + Connected Liquid Arrow Submit Button */}
                    <div className="flex items-center justify-between gap-4 pt-3">
                      <p className="text-[10.5px] leading-[1.45] text-[#5a6675]">
                        Ambitious on helping you prepare inside 24 hours. Honest on
                        outcomes —{" "}
                        {mode === "forgot" ? (
                          <button
                            type="button"
                            onClick={() => switchMode("login")}
                            className="cursor-pointer underline hover:text-[#212d3d]"
                          >
                            back to log in
                          </button>
                        ) : (
                          <span>no blind auto-submit ever.</span>
                        )}
                      </p>

                      {/* Signature Connected Double-Lobe Submit Button matching Reference */}
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        aria-label={
                          mode === "signup"
                            ? "Create account"
                            : mode === "forgot"
                            ? "Send reset link"
                            : "Log in"
                        }
                        className="group relative flex shrink-0 cursor-pointer items-center disabled:opacity-60"
                      >
                        <span className="flex h-[38px] items-center rounded-full bg-[#18222e] pl-4 pr-3 text-[12.5px] font-medium text-[#faf6ed] shadow-[0_8px_20px_rgba(24,34,46,0.22)] transition-all duration-300 group-hover:bg-[#212d3d]">
                          {status === "submitting" ? (
                            <span>Wait...</span>
                          ) : status === "success" ? (
                            <CheckIcon className="h-4 w-4 text-[#c9dfcf]" />
                          ) : (
                            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                          )}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>

                <p className="mt-5 text-center text-[11.5px] font-medium text-[#212d3d]/70">
                  Write once. Own every factual claim.
                </p>
              </motion.div>

              {/* Bottom Dark Bento Card ("What's inside / 24h Readiness Path") */}
              <Link
                href="/case-studies/from-signup-to-interview-ready-in-24-hours"
                className="group flex flex-col justify-between rounded-[28px] border border-white/[0.08] bg-[#141c24]/93 p-6 text-[#faf6ed] shadow-[0_24px_60px_rgba(14,24,32,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#192430] sm:p-7"
              >
                <div>
                  <p className="font-serif-display text-[32px] leading-[1.05] tracking-[-0.02em] text-[#faf6ed]">
                    New in Vex
                  </p>
                  <p className="mt-1 font-serif-display text-[22px] leading-tight text-[#faf6ed]/60">
                    Evidence-locked CV diffs & MCP
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between pt-2">
                  <span className="text-[12px] uppercase tracking-[0.12em] text-[#faf6ed]/45">
                    3-state honest tracking
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#faf6ed] transition-transform duration-300 group-hover:translate-x-0.5">
                    <span>Discover</span>
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </div>

            {/* RIGHT COLUMN: Classical Philosopher Editorial Feature Card */}
            <div className="flex md:col-span-6">
              <div className="relative flex min-h-[600px] w-full flex-col justify-between overflow-hidden rounded-[28px] border border-white/75 bg-[#faf6ed] text-[#212d3d] shadow-[0_32px_72px_rgba(14,24,32,0.28)]">
                {/* Full-Bleed Classical Philosopher Fresco & Marble Artwork */}
                <motion.img
                  src="/images/vex-philosopher.jpg"
                  alt="Classical Greco-Roman philosopher fresco draped in slate navy"
                  initial={{ scale: 1.04 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.3, ease: EASE }}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_12%]"
                />

                {/* Top Plaster Gradient Wash so Header Typography reads Effortlessly */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[185px]"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(250,246,237,0.92) 0%, rgba(250,246,237,0.45) 55%, rgba(250,246,237,0) 100%)",
                  }}
                />

                {/* Subtle Bottom Vignette over Cloak for Grounded Depth */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[160px]"
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(20,28,36,0.42) 0%, rgba(20,28,36,0) 100%)",
                  }}
                />

                {/* Top Header Row */}
                <div className="relative z-10 grid grid-cols-12 items-start px-7 pt-7 sm:px-8 sm:pt-8">
                  <div className="col-span-7">
                    <p className="font-serif-display text-[52px] leading-[0.94] tracking-[-0.03em] text-[#212d3d]">
                      Day
                    </p>
                    <p className="font-serif-display text-[52px] italic leading-[0.94] tracking-[-0.03em] text-[#5a6675]/85">
                      01
                    </p>
                  </div>

                  <div className="col-span-5 pt-1 text-right text-[12.5px] font-medium leading-[1.45] text-[#5a6675]">
                    <p className="text-[#212d3d]">Interview-ready</p>
                    <p>in 24 hours</p>
                  </div>
                </div>

                {/* Bottom Stack: Floating Milestone Glass Pill + Brand & Join CTA */}
                <div className="relative z-10 space-y-5 px-7 pb-7 sm:px-8 sm:pb-8">
                  <Link
                    href="/onboarding"
                    className="group/pill inline-flex flex-col gap-1 rounded-[20px] border border-white/60 bg-[#faf6ed]/78 px-4 py-3 text-[13.5px] leading-[1.45] text-[#212d3d] shadow-[0_12px_32px_rgba(14,24,32,0.14)] backdrop-blur-xl transition-all duration-300 hover:bg-[#faf6ed]/95"
                  >
                    <p className="flex items-center gap-2 font-medium text-[#212d3d]">
                      <span>04:00 min intake</span>
                      <ArrowRightIcon className="h-3 w-3 transition-transform duration-300 group-hover/pill:translate-x-0.5" />
                    </p>
                    <p className="text-[#5a6675]">Verified skill facts</p>
                    <p className="text-[#5a6675]">Assisted portal autofill</p>
                  </Link>

                  <div className="flex items-end justify-between gap-3">
                    {/* Left Minimalist Crest + Wordmark Pill */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-[#faf6ed]/88 px-3.5 py-2 shadow-xs backdrop-blur-md">
                      <VexLogoMark className="h-[24px] w-[24px]" />
                      <span className="font-serif-display text-[15px] leading-none tracking-[-0.01em] text-[#212d3d]">
                        Vex.careers
                      </span>
                    </div>

                    {/* Right Connected Split Pill CTA matching reference "Join in >" */}
                    <button
                      type="button"
                      onClick={() =>
                        switchMode(mode === "signup" ? "login" : "signup")
                      }
                      className="group relative flex cursor-pointer items-center"
                    >
                      <span className="flex h-[42px] items-center rounded-full bg-[#18222e] px-5 text-[13px] font-medium text-[#faf6ed] shadow-[0_10px_24px_rgba(24,34,46,0.28)] transition-colors duration-300 group-hover:bg-[#212d3d]">
                        {mode === "signup" ? "Log in" : "Join in"}
                      </span>
                      <span className="-ml-1.5 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#18222e] text-[#faf6ed] shadow-[0_10px_24px_rgba(24,34,46,0.28)] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#33445c]">
                        <ArrowRightIcon className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

