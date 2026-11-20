"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

interface MobileSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function MobileSheet({
  open,
  onClose,
  title,
  subtitle,
  children,
}: MobileSheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-[110] flex items-end justify-center lg:hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#12222e]/45 backdrop-blur-xs"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 34 }}
            className="relative z-10 max-h-[86vh] w-full overflow-y-auto rounded-t-[28px] border-t border-[#d6cbb2] bg-[#faf6ed] px-5 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[0_-12px_40px_rgba(18,34,46,0.2)]"
          >
            {/* iOS Grabber Handle */}
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#212d3d]/20" />

            <div className="flex items-start justify-between gap-3 border-b border-[#e5dac2] pb-3">
              <div>
                {subtitle && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#7a6b4e]">
                    {subtitle}
                  </p>
                )}
                <h2 className="font-serif-display text-[22px] leading-tight text-[#212d3d]">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={`Close ${title}`}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#ece9df] text-[15px] font-medium text-[#212d3d]"
              >
                ×
              </button>
            </div>

            <div className="pt-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
