"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SITE_META } from "@/data/palladio";
import PalladioButton from "./PalladioButton";
import { VexLogoMark } from "./Icons";

const MENU_LINKS = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Onboarding", href: "/onboarding" },
  { label: "About", href: "/about" },
  { label: "Cases", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "Log in", href: "/login" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onPointerDown = (e: MouseEvent) => {
      if (
        menuOpen &&
        navRef.current &&
        !navRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [menuOpen]);

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <motion.header
      ref={navRef}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 bg-[#faf6ed]/95 backdrop-blur-md transition-[border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-b border-[#212d3d]/[0.08] shadow-[0_6px_24px_rgba(18,34,46,0.05)]"
          : "border-b border-transparent"
      }`}
    >
      {/* Top Bar matching Palladio's 72px cream bar */}
      <div className="mx-auto flex h-[72px] w-full items-center justify-between px-5 sm:px-6">
        {/* Left Logo Mark + Serif Wordmark */}
        <Link
          href="/#header"
          className="group flex items-center gap-[8px] text-[#212d3d] transition-opacity hover:opacity-80"
        >
          <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center overflow-hidden">
            <VexLogoMark className="h-[30px] w-[30px]" />
          </span>
          <span className="font-serif-display text-[25px] font-normal leading-none tracking-[-0.02em] text-[#212d3d]">
            Vex
          </span>
        </Link>

        {/* Right Actions: Start free CTA + Circular 42px Menu Toggle */}
        <div className="flex items-center gap-[6px]">
          <PalladioButton label="Start free" href="/signup" variant="nav" />

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="relative flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#212d3d] text-[#faf6ed] transition-colors duration-300 hover:bg-[#33445c] cursor-pointer"
          >
            <motion.span
              animate={
                menuOpen
                  ? { y: 0, rotate: 45 }
                  : { y: -4, rotate: 0 }
              }
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="absolute block h-[2px] w-[19px] rounded-full bg-[#faf6ed]"
            />
            <motion.span
              animate={
                menuOpen
                  ? { y: 0, rotate: -45 }
                  : { y: 4, rotate: 0 }
              }
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="absolute block h-[2px] w-[19px] rounded-full bg-[#faf6ed]"
            />
          </button>
        </div>
      </div>

      {/* Right-aligned Compact Two-Card Dropdown Menu matching .framer-cst8nd */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            className="pointer-events-auto absolute right-0 top-[74px] flex w-[320px] max-w-[calc(100vw-20px)] flex-col gap-[10px] px-5 pb-5"
          >
            {/* Card 1: Navigation Links */}
            <nav
              aria-label="Main"
              className="flex flex-col gap-3 rounded-[24px] bg-[#0e1820]/90 px-7 py-[26px] text-[#faf6ed] shadow-[0_24px_48px_rgba(14,24,32,0.35)] backdrop-blur-xl"
            >
              {MENU_LINKS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="group inline-flex w-fit flex-col py-0.5 text-[16px] font-medium tracking-[-0.01em] text-[#faf6ed]"
                  >
                    <span
                      className={`transition-opacity duration-200 ${
                        isActive
                          ? "text-[#faf6ed]"
                          : "text-[#faf6ed]/85 group-hover:text-[#faf6ed]"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`mt-0.5 h-[1px] bg-[#faf6ed] transition-all duration-300 ${
                        isActive
                          ? "w-full opacity-90"
                          : "w-0 opacity-0 group-hover:w-full group-hover:opacity-80"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Card 2: Contact Coordinates */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.06,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="flex flex-col gap-2.5 rounded-[24px] bg-[#0e1820]/90 px-7 py-[24px] text-[#faf6ed] shadow-[0_24px_48px_rgba(14,24,32,0.35)] backdrop-blur-xl"
            >
              <a
                href={`mailto:${SITE_META.email}`}
                className="text-[14.5px] font-medium text-[#faf6ed]/90 transition-colors hover:text-white"
              >
                {SITE_META.email}
              </a>
              <a
                href="tel:+442079460000"
                className="text-[14px] text-[#faf6ed]/70 transition-colors hover:text-[#faf6ed]"
              >
                {SITE_META.phone}
              </a>
              <p className="pt-1 text-[12px] text-[#faf6ed]/50">
                {SITE_META.location}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
