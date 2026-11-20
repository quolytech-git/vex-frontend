"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 1.008 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.34,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="origin-top"
    >
      {children}
    </motion.div>
  );
}
