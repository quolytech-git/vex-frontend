"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ASSETS, SITE_META } from "@/data/palladio";
import ScrollZoomImage from "@/components/ScrollZoomImage";
import {
  ArrowRightIcon,
  SocialInstagramIcon,
  SocialLinkedInIcon,
  SocialXIcon,
  SocialYouTubeIcon,
} from "@/components/Icons";

const FOOTER_LINKS = [
  { label: "Home", href: "/#header" },
  { label: "Features", href: "/features" },
  { label: "Chrome extension", href: "/extension" },
  { label: "MCP & AI tools", href: "/mcp" },
  { label: "Get the app", href: "/download" },
  { label: "About", href: "/about" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Insights", href: "/blog" },
  { label: "Log in / Sign up", href: "/login" },
  { label: "Contact", href: "/contact" },
];

const SOCIALS = [
  { label: "X", href: "https://x.com/", icon: SocialXIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: SocialLinkedInIcon },
  { label: "YouTube", href: "https://www.youtube.com/", icon: SocialYouTubeIcon },
  { label: "Instagram", href: "https://www.instagram.com/", icon: SocialInstagramIcon },
];

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("submitting");
    setFeedback("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setFeedback(data.error || "Unable to subscribe right now.");
      } else {
        setStatus("done");
        setFeedback(
          data.message || "Subscribed. Watch for the next monthly note."
        );
        setEmail("");
      }
    } catch {
      setStatus("error");
      setFeedback("Network error while subscribing. Please try again.");
    }
  }

  return (
    <footer className="bg-[#faf6ed] p-2.5 sm:p-4">
      <div className="relative overflow-hidden rounded-[22px] bg-[#1e2938] text-[#faf6ed]">
        {/* Atmospheric Fresco Backdrop with Scroll-Linked Zoom */}
        <ScrollZoomImage
          src={ASSETS.frescoHands}
          alt=""
          fromScale={1}
          toScale={1.08}
          wrapperClassName="pointer-events-none absolute inset-0 overflow-hidden"
          className="h-full w-full object-cover object-center opacity-45 mix-blend-luminosity"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(24,33,46,0.88) 0%, rgba(24,33,46,0.68) 52%, rgba(20,28,39,0.92) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1600px] px-6 pb-7 pt-12 sm:px-10 sm:pt-14 lg:px-12 lg:pt-16">
          {/* Top Statement */}
          <h2 className="font-serif-display text-[clamp(2.1rem,3.6vw,3.2rem)] font-normal leading-[1.06] tracking-[-0.025em]">
            <span className="block text-[#faf6ed]/55">
              Interview-ready in 24 hours.
            </span>
            <span className="block text-[#faf6ed]">
              We help you earn it honestly.
            </span>
          </h2>

          {/* Middle 3-Column Row */}
          <div className="mt-14 grid grid-cols-1 items-start gap-10 md:grid-cols-12">
            {/* Column 1: Contact Details & Social Buttons */}
            <div className="space-y-4 md:col-span-4">
              <div className="space-y-2 text-[14.5px] text-[#faf6ed]/88">
                <p>
                  <a
                    href={`mailto:${SITE_META.email}`}
                    className="group relative inline-block transition-colors duration-300 hover:text-white"
                  >
                    {SITE_META.email}
                    <span className="block h-px max-w-0 bg-white/70 transition-all duration-300 ease-out group-hover:max-w-full" />
                  </a>
                </p>
                <p>
                  <a
                    href="tel:+442079460000"
                    className="group relative inline-block transition-colors duration-300 hover:text-white"
                  >
                    {SITE_META.phone}
                    <span className="block h-px max-w-0 bg-white/70 transition-all duration-300 ease-out group-hover:max-w-full" />
                  </a>
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {SOCIALS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-white/[0.14] bg-white/[0.06] text-[#faf6ed]/85 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/[0.15] hover:text-white"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Clean Center Navigation Stack */}
            <nav
              aria-label="Footer navigation"
              className="md:col-span-4 md:flex md:justify-center"
            >
              <ul className="flex flex-col gap-2.5 text-[14.5px] text-[#faf6ed]/90">
                {FOOTER_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group inline-block transition-colors duration-300 hover:text-white"
                    >
                      <span>{item.label}</span>
                      <span className="block h-px max-w-0 bg-white/75 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:max-w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Column 3: Inline Pill Newsletter Form */}
            <div className="md:col-span-4 md:flex md:justify-end">
              <div className="w-full max-w-[380px]">
                <p className="text-[13.5px] leading-[1.55] text-[#faf6ed]/82">
                  Stay in the loop. One note a month on candidate research and
                  what is shipping in Vex. Written by the product team.
                </p>

                <form
                  onSubmit={handleSubscribe}
                  className="mt-4 flex items-center rounded-full border border-white/25 bg-white/[0.06] p-1 pl-4 backdrop-blur-sm transition-colors duration-300 focus-within:border-white/60"
                >
                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="min-w-0 flex-1 bg-transparent pr-2 text-[13.5px] text-[#faf6ed] placeholder:text-[#faf6ed]/50 focus:outline-none"
                  />

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group inline-flex h-[38px] shrink-0 cursor-pointer items-center gap-2 rounded-full bg-[#faf6ed] px-4.5 text-[13.5px] font-medium text-[#212d3d] transition-all duration-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="relative inline-flex h-[18px] overflow-hidden leading-[18px]">
                      <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                        {status === "submitting"
                          ? "Sending..."
                          : status === "done"
                          ? "Subscribed"
                          : "Subscribe"}
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-full inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full"
                      >
                        {status === "submitting"
                          ? "Sending..."
                          : status === "done"
                          ? "Subscribed"
                          : "Subscribe"}
                      </span>
                    </span>
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </form>

                {feedback ? (
                  <p
                    className={`mt-2.5 text-[12px] ${
                      status === "error" ? "text-[#f4b4a3]" : "text-[#c9dfcf]"
                    }`}
                  >
                    {feedback}
                  </p>
                ) : (
                  <p className="mt-2.5 text-[11.5px] text-[#faf6ed]/55">
                    No spam. Unsubscribe any time.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Massive Edge-to-Edge Wordmark */}
          <div className="mt-14 select-none overflow-hidden sm:mt-16">
            <p className="font-serif-display text-[clamp(3.6rem,13.2vw,12.8rem)] font-normal leading-[0.88] tracking-[-0.03em] text-[#faf6ed]">
              {SITE_META.legalName}
            </p>
          </div>

          {/* Bottom Legal + Home Return CTA Bar */}
          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/[0.12] pt-5 text-[12.5px] text-[#faf6ed]/65 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                href="/legals/terms-of-service"
                className="transition-colors duration-200 hover:text-[#faf6ed]"
              >
                Terms of Service
              </Link>
              <Link
                href="/legals/privacy-policy"
                className="transition-colors duration-200 hover:text-[#faf6ed]"
              >
                Privacy Policy
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span>{SITE_META.copyright}</span>
              <span className="text-[#faf6ed]/35">•</span>
              <span>{SITE_META.location}</span>
              <Link
                href="/#header"
                className="group inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.08] px-3.5 py-1 text-[12px] font-medium text-[#faf6ed] transition-all duration-300 hover:border-white/45 hover:bg-white/[0.16]"
              >
                <span>Back to Home</span>
                <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
                  ↑
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
