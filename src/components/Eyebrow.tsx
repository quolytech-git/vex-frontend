import React from "react";
import { PlusIcon } from "./Icons";

interface EyebrowProps {
  label: string;
  tone?: "light" | "dark";
}

export default function Eyebrow({ label, tone = "light" }: EyebrowProps) {
  const isDark = tone === "dark";

  return (
    <div className="inline-flex items-center gap-2.5">
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full ${
          isDark
            ? "bg-[#faf6ed] text-[#12222e]"
            : "bg-[#212d3d] text-[#faf6ed]"
        }`}
      >
        <PlusIcon className="h-2.5 w-2.5" />
      </span>
      <span
        className={`text-[11px] font-medium uppercase tracking-[0.14em] ${
          isDark ? "text-[#faf6ed]/85" : "text-[#5a6675]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
