"use client";

import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "./Icons";

type ButtonVariant = "primary" | "onDark" | "secondary" | "nav";

interface PalladioButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  showArrow?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-[#212d3d] text-[#faf6ed] border border-[#212d3d]",
  onDark: "bg-[#faf6ed] text-[#212d3d] border border-[#faf6ed]",
  secondary:
    "bg-[#f2eee2] text-[#212d3d] border border-[#212d3d]/15",
  nav: "bg-[#212d3d] text-[#faf6ed] border border-[#212d3d]",
};

const CURTAIN_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-[#33445c]",
  onDark: "bg-[#ece9df]",
  secondary: "bg-[#ece9df]",
  nav: "bg-[#33445c]",
};

const ICON_BADGE_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-[#faf6ed]/12 text-[#faf6ed]",
  onDark: "bg-[#212d3d] text-[#faf6ed]",
  secondary: "bg-[#212d3d] text-[#faf6ed]",
  nav: "bg-[#faf6ed]/12 text-[#faf6ed]",
};

export default function PalladioButton({
  label,
  href,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  fullWidth = false,
  showArrow = true,
}: PalladioButtonProps) {
  const isNavStyle = variant === "nav";
  const shouldShowArrow = showArrow && !isNavStyle;

  const inner = (
    <>
      {/* Bottom-up background fill curtain matching Palladio hover */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-px -left-px -right-px z-[1] h-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:h-[calc(100%+2px)] ${CURTAIN_CLASSES[variant]}`}
      />

      <span className="relative z-10 flex w-full items-center justify-between gap-2.5">
        <span className="relative inline-flex h-[18px] overflow-hidden text-[14px] font-medium leading-[18px] tracking-[-0.01em]">
          <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
            {label}
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-full inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full"
          >
            {label}
          </span>
        </span>

        {shouldShowArrow && (
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:translate-x-0.5 ${ICON_BADGE_CLASSES[variant]}`}
          >
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </span>
        )}
      </span>
    </>
  );

  const paddingClass = isNavStyle
    ? "h-[42px] px-[24px]"
    : shouldShowArrow
    ? "pl-5 pr-2 py-2"
    : "px-6 py-3";

  const baseClass = `group relative inline-flex items-center justify-center overflow-hidden rounded-full ${paddingClass} transition-colors duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
    VARIANT_CLASSES[variant]
  } ${fullWidth ? "w-full" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClass}
    >
      {inner}
    </button>
  );
}
