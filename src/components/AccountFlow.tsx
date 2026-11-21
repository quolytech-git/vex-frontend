"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { VexLogoMark } from "@/components/Icons";

/* ------------------------------------------------------------------ */
/*  Account recovery & verification screens (frontend preview).        */
/*  Emails are not sent yet — each screen says so, and the flow can    */
/*  still be walked through end to end.                                */
/* ------------------------------------------------------------------ */

type Mode = "forgot" | "reset" | "verify";

function Shell({ title, lead, children }: { title: string; lead: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#faf6ed] px-4 pt-[96px] pb-16">
      <div className="w-full max-w-[440px] rounded-[28px] border border-[#e3dccb] bg-white p-6 shadow-[0_24px_60px_rgba(33,45,61,0.08)] sm:p-8">
        <div className="flex items-center gap-2.5">
          <VexLogoMark className="h-8 w-8 rounded-[9px]" />
          <span className="font-serif-display text-[24px] leading-none text-[#212d3d]">Vex</span>
        </div>
        <h1 className="mt-6 font-serif-display text-[34px] leading-[1.05] text-[#212d3d]">{title}</h1>
        <p className="mt-2 text-[14.5px] leading-snug text-[#5a6675]">{lead}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

const input =
  "w-full rounded-[14px] border border-[#d6cbb2] bg-white px-4 py-3 text-[15px] text-[#212d3d] outline-none placeholder:text-[#9a907b] focus:border-[#212d3d]";
const primary =
  "w-full cursor-pointer rounded-full bg-[#212d3d] py-3 text-[15px] font-semibold text-[#faf6ed] transition-colors hover:bg-[#33445c] disabled:cursor-not-allowed disabled:opacity-45";

export default function AccountFlow({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const [expired, setExpired] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("vex_frontend_user") || "{}");
      if (u.email) setEmail(u.email);
    } catch {
      /* ignore */
    }
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("expired") === "1") setExpired(true);
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  const validEmail = /\S+@\S+\.\S+/.test(email);
  const strong = pw.length >= 8 && /\d/.test(pw) && /[A-Za-z]/.test(pw);
  const preview = <p className="mt-4 rounded-[12px] bg-[#f2eee2] px-3 py-2 text-[12px] text-[#5a6675]">Preview: emails are sent once the account service is connected.</p>;

  if (mode === "forgot") {
    return (
      <Shell title={sent ? "Check your email" : "Reset your password"} lead={sent ? `If an account exists for ${email}, a reset link is on its way. It expires in 30 minutes.` : "Enter the email you signed up with and we'll send you a reset link."}>
        {!sent ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!validEmail) return;
              setSent(true);
              setCooldown(30);
            }}
            className="space-y-3"
          >
            <label className="block text-[13px] font-medium text-[#212d3d]">
              Email
              <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`mt-1 ${input}`} placeholder="you@example.com" />
            </label>
            {email && !validEmail && <p role="alert" className="text-[12.5px] text-[#b42318]">Enter a valid email address.</p>}
            <button type="submit" disabled={!validEmail} className={primary}>Send reset link</button>
          </form>
        ) : (
          <div className="space-y-3">
            <Link href="/reset-password" className={`${primary} block text-center`}>Open the reset link (preview)</Link>
            <button type="button" disabled={cooldown > 0} onClick={() => setCooldown(30)} className="w-full cursor-pointer rounded-full border border-[#d6cbb2] py-3 text-[14px] font-semibold text-[#212d3d] disabled:opacity-50">
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend link"}
            </button>
          </div>
        )}
        {preview}
        <p className="mt-5 text-center text-[13.5px] text-[#5a6675]">
          Remembered it? <Link href="/login" className="font-semibold text-[#212d3d] underline underline-offset-2">Log in</Link>
        </p>
      </Shell>
    );
  }

  if (mode === "reset") {
    if (expired)
      return (
        <Shell title="This link has expired" lead="Reset links last 30 minutes. Ask for a new one — it only takes a moment.">
          <Link href="/forgot-password" className={`${primary} block text-center`}>Send a new link</Link>
        </Shell>
      );
    return (
      <Shell title={done ? "Password updated" : "Choose a new password"} lead={done ? "You can now log in with your new password." : "Use at least 8 characters with a letter and a number."}>
        {done ? (
          <Link href="/login" className={`${primary} block text-center`}>Log in</Link>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (strong && pw === pw2) setDone(true);
            }}
            className="space-y-3"
          >
            <label className="block text-[13px] font-medium text-[#212d3d]">
              New password
              <div className="relative mt-1">
                <input type={show ? "text" : "password"} autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} className={`${input} pr-16`} />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-[12.5px] font-semibold text-[#5a6675]">
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </label>
            <div className="flex gap-1.5">
              {[pw.length >= 8, /[A-Za-z]/.test(pw), /\d/.test(pw)].map((ok, i) => (
                <span key={i} className={`h-1.5 flex-1 rounded-full ${ok ? "bg-[#067647]" : "bg-[#e3dccb]"}`} />
              ))}
            </div>
            <label className="block text-[13px] font-medium text-[#212d3d]">
              Repeat password
              <input type={show ? "text" : "password"} autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} className={`mt-1 ${input}`} />
            </label>
            {pw2 && pw !== pw2 && <p role="alert" className="text-[12.5px] text-[#b42318]">The passwords don't match.</p>}
            <button type="submit" disabled={!strong || pw !== pw2} className={primary}>Save new password</button>
          </form>
        )}
        {!done && preview}
      </Shell>
    );
  }

  // verify
  return (
    <Shell title={done ? "Email verified" : "Verify your email"} lead={done ? "Thanks — your account is confirmed. You won't miss deadline alerts." : `We sent a 6-digit code to ${email || "your email"}. It protects your account and lets us send important alerts.`}>
      {done ? (
        <Link href="/dashboard" className={`${primary} block text-center`}>Go to your dashboard</Link>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pw.replace(/\D/g, "").length === 6) setDone(true);
          }}
          className="space-y-3"
        >
          <label className="block text-[13px] font-medium text-[#212d3d]">
            Verification code
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={pw}
              onChange={(e) => setPw(e.target.value.replace(/\D/g, ""))}
              className={`mt-1 ${input} text-center font-mono text-[22px] tracking-[0.5em]`}
              placeholder="••••••"
            />
          </label>
          <button type="submit" disabled={pw.length !== 6} className={primary}>Verify</button>
          <button type="button" disabled={cooldown > 0} onClick={() => setCooldown(30)} className="w-full cursor-pointer rounded-full border border-[#d6cbb2] py-3 text-[14px] font-semibold text-[#212d3d] disabled:opacity-50">
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
          <Link href="/dashboard" className="block text-center text-[13px] font-medium text-[#5a6675] underline underline-offset-2">Skip for now</Link>
        </form>
      )}
      {!done && <p className="mt-4 rounded-[12px] bg-[#f2eee2] px-3 py-2 text-[12px] text-[#5a6675]">Preview: any 6 digits work until the account service is connected.</p>}
    </Shell>
  );
}
