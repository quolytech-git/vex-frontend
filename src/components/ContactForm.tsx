"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PalladioButton from "@/components/PalladioButton";
import { CheckIcon } from "@/components/Icons";

const DISCIPLINES = [
  "Profile & Jobs",
  "CV & Letters",
  "Extension",
  "Mock Prep",
  "Skill & MCP",
] as const;

const SIZES = [
  "Core Path (Free)",
  "Vex Pro Monthly",
  "Vex Pro Annual",
  "Team / Cohort",
] as const;

export default function ContactForm() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") || undefined;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([
    "Profile & Jobs",
  ]);
  const [engagementSize, setEngagementSize] =
    useState<string>("Core Path (Free)");
  const [decisionSummary, setDecisionSummary] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (planParam === "counsel") {
      setEngagementSize("Core Path (Free)");
    } else if (planParam === "partnership") {
      setEngagementSize("Vex Pro Monthly");
    }
  }, [planParam]);

  function toggleDiscipline(item: string) {
    setSelectedDisciplines((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          disciplines: selectedDisciplines,
          engagementSize,
          plan: planParam,
          decisionSummary,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Please review the highlighted details.");
      } else {
        setStatus("success");
        setMessage(
          data.message || "Thank you. The Vex team will reply within 24 hours."
        );
        setName("");
        setEmail("");
        setDecisionSummary("");
      }
    } catch {
      setStatus("error");
      setMessage("Unable to submit right now. Please email us directly.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[28px] bg-[#f2eee2] p-8 sm:p-10">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2f6b4f] text-[#faf6ed]">
          <CheckIcon className="h-5 w-5" />
        </div>
        <h2 className="mt-5 font-serif-display text-[34px] leading-tight text-[#212d3d]">
          Enquiry received.
        </h2>
        <p className="mt-2.5 text-[16px] leading-[1.6] text-[#5a6675]">
          {message}
        </p>
        <div className="mt-6">
          <PalladioButton
            label="Send another note"
            onClick={() => setStatus("idle")}
            variant="primary"
          />
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-[28px] bg-[#f2eee2] p-6 sm:p-9"
    >
      {planParam && (
        <div className="rounded-[16px] bg-[#ece9df] px-4 py-3 text-[13.5px] text-[#212d3d]">
          Selected tier:{" "}
          <span className="font-medium capitalize">
            {planParam === "counsel"
              ? "Core Path"
              : planParam === "partnership"
              ? "Vex Pro"
              : planParam}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="contact-name"
            className="block text-[13.5px] font-medium text-[#212d3d]"
          >
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full rounded-[16px] border border-[#212d3d]/15 bg-[#faf6ed] px-4 py-3 text-[15px] text-[#212d3d] placeholder:text-[#5a6675]/60 focus:border-[#212d3d] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="contact-email"
            className="block text-[13.5px] font-medium text-[#212d3d]"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="w-full rounded-[16px] border border-[#212d3d]/15 bg-[#faf6ed] px-4 py-3 text-[15px] text-[#212d3d] placeholder:text-[#5a6675]/60 focus:border-[#212d3d] focus:outline-none"
          />
        </div>
      </div>

      {/* Platform pillar selection */}
      <div className="space-y-2.5">
        <span className="block text-[13.5px] font-medium text-[#212d3d]">
          Which workflow areas matter most?
        </span>
        <div className="flex flex-wrap gap-2">
          {DISCIPLINES.map((item) => {
            const active = selectedDisciplines.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleDiscipline(item)}
                aria-pressed={active}
                className={`rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors cursor-pointer ${
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

      {/* Preferred plan or scope */}
      <div className="space-y-2.5">
        <span className="block text-[13.5px] font-medium text-[#212d3d]">
          Plan interest
        </span>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {SIZES.map((size) => {
            const active = engagementSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setEngagementSize(size)}
                aria-pressed={active}
                className={`rounded-[14px] px-3 py-2.5 text-[13.5px] font-medium transition-colors cursor-pointer ${
                  active
                    ? "bg-[#212d3d] text-[#faf6ed]"
                    : "bg-[#faf6ed] text-[#5a6675] hover:text-[#212d3d]"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Career goals description */}
      <div className="space-y-2">
        <label
          htmlFor="contact-decision"
          className="block text-[13.5px] font-medium text-[#212d3d]"
        >
          Your target roles and 24-hour goal
        </label>
        <textarea
          id="contact-decision"
          required
          rows={5}
          value={decisionSummary}
          onChange={(e) => setDecisionSummary(e.target.value)}
          placeholder="Tell us the roles you are targeting, what portal bottlenecks slow you down, or how we can help set up your Vex workspace."
          className="w-full rounded-[18px] border border-[#212d3d]/15 bg-[#faf6ed] p-4 text-[15px] text-[#212d3d] placeholder:text-[#5a6675]/60 focus:border-[#212d3d] focus:outline-none"
        />
      </div>

      {status === "error" && message && (
        <p className="rounded-[14px] bg-[#9c4930]/10 px-4 py-3 text-[13.5px] text-[#9c4930]">
          {message}
        </p>
      )}

      <div className="flex flex-col justify-between gap-4 pt-2 sm:flex-row sm:items-center">
        <p className="text-[12.5px] leading-[1.5] text-[#5a6675]">
          By submitting, you agree to our{" "}
          <Link
            href="/legals/privacy-policy"
            className="underline hover:text-[#212d3d]"
          >
            privacy policy
          </Link>
          . The Vex team replies within 24 hours.
        </p>

        <PalladioButton
          type="submit"
          label={status === "submitting" ? "Sending..." : "Send note"}
          variant="primary"
          disabled={status === "submitting"}
        />
      </div>
    </form>
  );
}

