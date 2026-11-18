"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export default function AnimatedCounter({
  value,
  suffix = "+",
  duration = 1.4,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="inline-flex items-baseline gap-1 tabular-nums">
      <span className="font-serif-display text-[50px] leading-none tracking-[-0.03em] text-[#212d3d] sm:text-[56px]">
        {displayValue}
      </span>
      {suffix && (
        <span className="font-serif-display text-[44px] leading-none text-[#212d3d]/80 sm:text-[48px]">
          {suffix}
        </span>
      )}
    </span>
  );
}

