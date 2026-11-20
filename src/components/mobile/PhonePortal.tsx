"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * On phones, when `when` is true, renders children into <body> so a
 * full-screen page can sit above the app's header and tab bar.
 * Everywhere else it renders children in place (desktop is untouched).
 */
export default function PhonePortal({
  when,
  children,
}: {
  when: boolean;
  children: React.ReactNode;
}) {
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023.98px)");
    const update = () => setIsPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (when && isPhone) return createPortal(children, document.body);
  return <>{children}</>;
}
