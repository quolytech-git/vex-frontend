"use client";

import React, { useState } from "react";
import { SUBSCRIPTION_TIERS, type SubscriptionPlan } from "@/data/dashboard";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import { CheckIcon } from "@/components/Icons";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { StatusPill } from "@/components/dashboard/StatusBadge";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";

export default function BillingAndSubscriptionPage() {
  const { plan, invoices, diffs, interviewSessions, changePlan } =
    useVexWorkspace();

  const [checkoutPlan, setCheckoutPlan] = useState<SubscriptionPlan | null>(null);
  const [checkoutMsg, setCheckoutMsg] = useState("");
  const [annualCycle, setAnnualCycle] = useState(false);

  const aiQuota = plan === "Ultra" ? 500 : plan === "Pro" ? 120 : 15;
  const aiUsed = diffs.length * 4 + interviewSessions.length * 6;
  const quotaPct = Math.min(100, Math.round((aiUsed / aiQuota) * 100));

  function formatDisplayPrice(tierPlan: SubscriptionPlan, basePrice: string) {
    if (!annualCycle || tierPlan === "Free") return basePrice;
    return tierPlan === "Pro" ? "£15/mo (billed annually)" : "£31/mo (billed annually)";
  }

  function confirmPreviewPlanChange() {
    if (!checkoutPlan) return;
    changePlan(
      checkoutPlan,
      `Switched to ${checkoutPlan} (local preview only — connect Stripe backend for live charges).`
    );
    setCheckoutMsg(
      `Plan updated to ${checkoutPlan} in local workspace preview. Real card billing requires Stripe server endpoints.`
    );
    setCheckoutPlan(null);
  }

  return (
    <DashboardSubpageFrame
      parentSection="settings"
      parentLabel="Settings & Privacy"
      pageCode="11.1"
      pageTitle="Plutus Billing & Usage"
      philosopherTag="Plutus · Transparent Value"
    >
      <div className="space-y-6">
        <MobilePhilosopherPill
          name="Plutus"
          role="Transparent Quotas"
          image="/images/plutus-treasury-ledger.jpg"
          quote="Every quota metered openly; zero hidden charges, ever."
          guidance={`Active plan preview: ${plan} (${aiUsed}/${aiQuota} AI draft units used). No real payment methods are processed in frontend preview.`}
        />

        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow label="Plutus Ledger · Subscriptions & Honest Usage Quotas" />
                <StatusPill label={`Active Plan: ${plan}`} tone="navy" />
              </div>
              <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.6rem)] text-[#212d3d]">
                Plans, AI Quotas &amp;{" "}
                <span className="font-serif-calligraphic text-[#5a6675]">
                  Invoice History.
                </span>
              </h1>
              <p className="max-w-[64ch] text-[13px] text-[#5a6675]">
                Upgrade, downgrade, or inspect transparent monthly limits. Note:
                this frontend workspace previews subscription states locally and
                never fakes live credit-card charges without a payment backend.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="inline-flex rounded-full border border-[#cfc2a5] bg-white p-1 text-[11.5px]">
                  <button
                    type="button"
                    onClick={() => setAnnualCycle(false)}
                    className={`cursor-pointer rounded-full px-3.5 py-1 font-medium transition-colors ${
                      !annualCycle ? "bg-[#212d3d] text-[#faf6ed]" : "text-[#5a6675]"
                    }`}
                  >
                    Monthly Cycle
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnnualCycle(true)}
                    className={`cursor-pointer rounded-full px-3.5 py-1 font-medium transition-colors ${
                      annualCycle ? "bg-[#212d3d] text-[#faf6ed]" : "text-[#5a6675]"
                    }`}
                  >
                    Annual Preview (Save ~20%)
                  </button>
                </div>

                <div className="min-w-[200px] rounded-[14px] border border-[#dfd4be] bg-white px-4 py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                      Monthly AI Units
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-[#212d3d]">
                      {aiUsed} / {aiQuota} ({quotaPct}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#efe7d5]">
                    <div
                      className="h-full rounded-full bg-[#212d3d]"
                      style={{ width: `${quotaPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden justify-start lg:col-span-4 lg:flex lg:justify-end">
              <div className="w-full max-w-[295px] overflow-hidden rounded-t-[140px] rounded-b-[18px] border border-[#cfc2a5] bg-[#e9e0cc] shadow-sm">
                <img
                  src="/images/plutus-treasury-ledger.jpg"
                  alt="Plutus beside carved stone ledger and bronze astrolabe"
                  className="aspect-[4/3.6] w-full object-cover object-top"
                />
                <div className="border-t border-[#d8cbb0] bg-[#fffef9] px-4 py-2.5">
                  <p className="font-mono text-[9.5px] font-semibold uppercase text-[#7a6b4e]">
                    Plutus · Steward of Value
                  </p>
                  <p className="text-[11.5px] text-[#212d3d]">
                    “Every quota metered openly; zero hidden charges, ever.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {checkoutMsg && (
          <div className="rounded-[14px] border border-[#067647]/35 bg-[#067647]/10 px-4 py-3 text-[12.5px] text-[#067647]">
            {checkoutMsg}
          </div>
        )}

        {/* TIER COMPARISON CARDS */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SUBSCRIPTION_TIERS.map((tier) => {
            const isActive = plan === tier.plan;
            return (
              <div
                key={tier.plan}
                className={`flex flex-col justify-between rounded-[22px] border p-6 ${
                  isActive
                    ? "border-[#212d3d] bg-[#f4efe3] shadow-sm"
                    : "border-[#dad6ca] bg-[#fffef9]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-serif-display text-[26px] text-[#212d3d]">
                      {tier.plan}
                    </h2>
                    <span className="font-mono text-[13px] font-semibold text-[#212d3d]">
                      {formatDisplayPrice(tier.plan, tier.price)}
                    </span>
                  </div>
                  <p className="mt-1 text-[12.5px] text-[#5a6675]">
                    {tier.tagline}
                  </p>
                  <ul className="mt-4 space-y-2 text-[12.5px] text-[#212d3d]">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#067647]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setCheckoutPlan(tier.plan)}
                  disabled={isActive}
                  className={`mt-5 w-full rounded-full py-2 text-[12.5px] font-medium ${
                    isActive
                      ? "bg-[#212d3d]/15 text-[#212d3d]"
                      : "cursor-pointer bg-[#212d3d] text-[#faf6ed] hover:bg-[#314158]"
                  }`}
                >
                  {isActive ? "Current Tier" : `Preview Switch to ${tier.plan}`}
                </button>
              </div>
            );
          })}
        </section>

        {/* PREVIEW CHECKOUT DIALOG */}
        {checkoutPlan && (
          <section className="rounded-[22px] border border-[#b54708]/40 bg-[#faf6ed] p-6 space-y-3">
            <h3 className="font-serif-display text-[22px] text-[#212d3d]">
              Confirm Plan Preview: {checkoutPlan}
            </h3>
            <p className="text-[13px] text-[#5a6675]">
              Production checkout requires a backend Stripe Checkout session API.
              Confirming here updates your local test entitlement and appends a
              &ldquo;Local preview (no charge)&rdquo; invoice row.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={confirmPreviewPlanChange}
                className="cursor-pointer rounded-full bg-[#212d3d] px-5 py-2 text-[12.5px] font-medium text-[#faf6ed]"
              >
                Confirm Local Plan Preview
              </button>
              <button
                type="button"
                onClick={() => setCheckoutPlan(null)}
                className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-4 py-2 text-[12.5px] text-[#5a6675]"
              >
                Cancel
              </button>
            </div>
          </section>
        )}

        {/* INVOICE LEDGER: Mobile Stacked Cards + Desktop Table */}
        <section className="rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-5 sm:p-6 space-y-3">
          <h2 className="font-serif-display text-[22px] text-[#212d3d]">
            Billing History &amp; Invoices ({invoices.length})
          </h2>

          {/* Mobile Card List */}
          <div className="space-y-2.5 md:hidden">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="rounded-[16px] border border-[#e3dac5] bg-[#faf6ed] p-4 space-y-1.5 text-[12.5px]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11.5px] font-semibold text-[#212d3d]">
                    {inv.id} · {inv.plan}
                  </span>
                  <span className="font-mono font-semibold text-[#212d3d]">
                    {inv.amount}
                  </span>
                </div>
                <p className="text-[11.5px] text-[#5a6675]">{inv.date}</p>
                <StatusPill label={inv.status} tone="info" dot={false} />
                <p className="text-[11.5px] text-[#5a6675]">{inv.note}</p>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-[#dad6ca] font-mono text-[10.5px] uppercase text-[#7a6b4e]">
                  <th className="py-2 pr-4">Invoice ID</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Tier</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ece5d5]">
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="py-2.5 pr-4 font-mono text-[11.5px] font-semibold">
                      {inv.id}
                    </td>
                    <td className="py-2.5 pr-4">{inv.date}</td>
                    <td className="py-2.5 pr-4">{inv.plan}</td>
                    <td className="py-2.5 pr-4 font-medium">{inv.amount}</td>
                    <td className="py-2.5 pr-4">
                      <StatusPill label={inv.status} tone="info" dot={false} />
                    </td>
                    <td className="py-2.5 text-[#5a6675]">{inv.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardSubpageFrame>
  );
}
