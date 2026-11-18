"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

interface ScrollZoomImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  /** Subtle scale range as the container traverses the viewport */
  fromScale?: number;
  toScale?: number;
  /** Subtle vertical parallax drift in px */
  driftY?: number;
  style?: React.CSSProperties;
}

export default function ScrollZoomImage({
  src,
  alt,
  className = "h-full w-full object-cover",
  wrapperClassName = "relative h-full w-full overflow-hidden",
  fromScale = 1,
  toScale = 1.08,
  driftY = 0,
  style,
}: ScrollZoomImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.25,
  });

  const scale = useTransform(smoothProgress, [0, 1], [fromScale, toScale]);
  const y = useTransform(smoothProgress, [0, 1], [driftY, -driftY]);

  return (
    <div ref={ref} className={wrapperClassName} style={style}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        aria-hidden={alt === "" ? true : undefined}
        style={
          prefersReducedMotion
            ? undefined
            : {
                scale,
                y: driftY !== 0 ? y : undefined,
                willChange: "transform",
              }
        }
        className={className}
      />
    </div>
  );
}

