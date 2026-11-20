"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { InterviewTranscriptTurn } from "@/data/dashboard";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { StatusPill } from "@/components/dashboard/StatusBadge";

const SESSION_PROMPTS: Record<
  "Behavioral" | "Technical" | "HR" | "Company-specific",
  string[]
> = {
  Behavioral: [
    "Tell me about a high-stakes rollout or incident where you stepped in to coordinate across engineering and operations.",
    "Describe a decision you had to make with incomplete metrics. How did you validate alignment?",
    "Walk me through a time you prevented a silent defect from reaching production customers.",
  ],
  Technical: [
    "How would you structure a SQL cohort funnel query so non-converting users are never accidentally excluded?",
    "Design the client-side UI & retry flow when an external ATS endpoint returns HTTP 503.",
    "What edge cases do you test around WCAG focus traps and async state race conditions?",
  ],
  HR: [
    "Why does this team's current operating stage align with your career focus over the next 24 months?",
    "Describe the team communication rhythm and feedback cadence where you do your sharpest work.",
    "Walk through your compensation range and hybrid/remote working preferences clearly.",
  ],
  "Company-specific": [
    "Based on the role specification, what would your first 30-day audit focus on?",
    "Which requirement in this listing represents your strongest proof, and where would you ramp quickly?",
    "How does your experience with written decision memos help scale cross-functional handoffs?",
  ],
};

export default function ActiveInterviewSessionPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const { applications, addInterviewSession } = useVexWorkspace();

  const matchingApp =
    applications.find((a) => a.id === params?.sessionId) || applications[0];

  const [selectedAppId, setSelectedAppId] = useState(matchingApp?.id || "");
  const [mode, setMode] = useState<
    "Behavioral" | "Technical" | "HR" | "Company-specific"
  >("Behavioral");
  const [difficulty, setDifficulty] = useState<"Entry" | "Mid" | "Senior">("Mid");
  const [qIdx, setQIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [turns, setTurns] = useState<InterviewTranscriptTurn[]>([]);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [listening, setListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState("");

  useEffect(() => {
    const t = window.setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, []);

  const app = applications.find((a) => a.id === selectedAppId) || applications[0];
  const questions = SESSION_PROMPTS[mode];
  const currentQ = questions[qIdx];

  function toggleSpeechToText() {
    if (typeof window === "undefined") return;
    const win = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        onresult: ((ev: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
        start: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        onresult: ((ev: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
        start: () => void;
      };
    };
    const Rec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!Rec) {
      setVoiceNote(
        "Browser SpeechRecognition is unavailable in this browser — type response directly below."
      );
      return;
    }
    try {
      const rec = new Rec();
      rec.lang = "en-US";
      rec.interimResults = false;
      setListening(true);
      setVoiceNote("Listening via browser Web Speech API...");
      rec.onresult = (ev) => {
        const lastIdx = ev.results.length - 1;
        const transcript = ev.results[lastIdx]?.[0]?.transcript || "";
        if (transcript) {
          setAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };
      rec.onerror = () => {
        setListening(false);
        setVoiceNote("Microphone permission denied or unavailable — type answer below.");
      };
      rec.onend = () => setListening(false);
      rec.start();
    } catch {
      setListening(false);
      setVoiceNote("Voice capture fallback active — type response below.");
    }
  }

  function speakPrompt() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setVoiceNote("Speech synthesis not available in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(currentQ);
    utter.rate = 0.96;
    window.speechSynthesis.speak(utter);
  }

  function saveCurrentTurn() {
    const clean =
      answer.trim() ||
      `For ${app?.company || "this role"}, I led a structured release review, verified root telemetry logs, and shipped an explicit mitigation checklist.`;
    const wc = clean.split(/\s+/).length;
    const structureScore = Math.min(95, 74 + Math.min(20, Math.round(wc / 4)));
    const clarityScore = clean.includes("?") ? 76 : 86;
    const relevanceScore = clean.toLowerCase().includes("verified") || wc >= 20 ? 89 : 79;

    const entry: InterviewTranscriptTurn = {
      question: currentQ,
      answer: clean,
      mode,
      structureScore,
      clarityScore,
      relevanceScore,
      wordCount: wc,
      feedbackNote:
        wc < 30
          ? "Concise answer — Socrates recommends naming one measurable metric or post-incident safeguard."
          : "Strong depth and concrete ownership; ensure the closing sentence links directly to impact.",
    };
    setTurns((prev) => [...prev, entry]);
    setAnswer("");

    if (qIdx < questions.length - 1) {
      setQIdx((i) => i + 1);
    } else {
      const avgScore = Math.round(
        ([...turns, entry].reduce(
          (sum, t) =>
            sum + (t.structureScore + t.clarityScore + t.relevanceScore) / 3,
          0
        )) /
          (turns.length + 1)
      );
      const id = `sess-${Date.now()}`;
      addInterviewSession({
        id,
        applicationId: app?.id || "app-1",
        company: app?.company || "Target Role",
        roleTitle: app?.title || "Practice Role",
        philosopher: "Socrates",
        mode,
        difficulty,
        createdAt: "Completed just now",
        overallScore: avgScore,
        voiceUsed: Boolean(voiceNote),
        turns: [...turns, entry],
      });
      router.push(`/dashboard/interviews/${id}/report`);
    }
  }

  return (
    <DashboardSubpageFrame
      parentSection="interviews"
      parentLabel="Interview Studio"
      pageCode="07.1"
      pageTitle={`Socratic Live Session · ${app?.company || "General"}`}
      philosopherTag="Socrates · Dialectic Probing"
    >
      <div className="space-y-6">
        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow label={`Socratic Active Session · Q${qIdx + 1} of ${questions.length}`} />
                <StatusPill
                  label={`Elapsed ${Math.floor(elapsedSec / 60)}:${String(
                    elapsedSec % 60
                  ).padStart(2, "0")}`}
                  tone="navy"
                  dot={false}
                />
                <StatusPill label={`${turns.length} Answered`} tone="success" dot={false} />
              </div>
              <h1 className="font-serif-display text-[clamp(1.85rem,3vw,2.5rem)] text-[#212d3d]">
                Live Rehearsal Session
              </h1>

              <div className="flex flex-wrap gap-2">
                <select id="page-select-1" name="page-select-1" aria-label="page select 1"
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-4 py-1.5 text-[12px] font-medium"
                >
                  {applications.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.company} — {a.title}
                    </option>
                  ))}
                </select>
                {(["Behavioral", "Technical", "HR", "Company-specific"] as const).map(
                  (m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMode(m);
                        setQIdx(0);
                      }}
                      className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[12px] font-medium ${
                        mode === m
                          ? "bg-[#212d3d] text-[#faf6ed]"
                          : "border border-[#cfc2a5] bg-white text-[#212d3d]"
                      }`}
                    >
                      {m}
                    </button>
                  )
                )}
                {(["Entry", "Mid", "Senior"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`cursor-pointer rounded-full px-3 py-1.5 text-[11.5px] font-medium ${
                      difficulty === lvl
                        ? "bg-[#212d3d] text-[#faf6ed]"
                        : "border border-[#cfc2a5] bg-white text-[#5a6675]"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-start lg:col-span-4 lg:justify-end">
              <div className="flex w-full max-w-[300px] items-center gap-3.5 rounded-[20px] border border-[#cfc2a5] bg-[#fffef9] p-3">
                <img
                  src="/images/interview-socrates-dialectic.jpg"
                  alt="Socrates questioning"
                  className="h-20 w-18 rounded-[12px] object-cover object-top"
                />
                <div className="space-y-1">
                  <p className="font-mono text-[9.5px] font-semibold uppercase text-[#7a6b4e]">
                    Socrates
                  </p>
                  <p className="text-[11.5px] leading-snug text-[#212d3d]">
                    “State the constraint, trace your action, and verify the result.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ACTIVE QUESTION & RESPONSE CAPTURE */}
        <section className="rounded-[24px] border border-[#dad6ca] bg-[#fffef9] p-6 space-y-5">
          <div className="rounded-[18px] border border-[#e3dac5] bg-[#f4efe3] p-5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                {mode} · Question {qIdx + 1} / {questions.length}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={speakPrompt}
                  className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-3 py-1 text-[11.5px] font-medium text-[#212d3d]"
                >
                  Read Question Aloud
                </button>
                <button
                  type="button"
                  onClick={toggleSpeechToText}
                  className={`cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-medium ${
                    listening
                      ? "bg-[#b42318] text-white"
                      : "border border-[#212d3d] bg-white text-[#212d3d]"
                  }`}
                >
                  {listening ? "Recording Speech..." : "Dictate Answer (Voice)"}
                </button>
              </div>
            </div>
            <p className="font-serif-display text-[24px] leading-snug text-[#212d3d]">
              “{currentQ}”
            </p>
            {voiceNote && (
              <p className="font-mono text-[11px] text-[#5a6675]">{voiceNote}</p>
            )}
          </div>

          <textarea id="page-textarea-2" name="page-textarea-2" aria-label="page textarea 2"
            rows={6}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Record your Situation -> Task -> Action -> Verified Result answer..."
            className="w-full rounded-[16px] border border-[#dad6ca] bg-[#faf6ed] p-4 text-[14px] leading-relaxed text-[#212d3d]"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={saveCurrentTurn}
                className="cursor-pointer rounded-full bg-[#212d3d] px-5 py-2.5 text-[13px] font-medium text-[#faf6ed] hover:bg-[#314158]"
              >
                {qIdx < questions.length - 1
                  ? "Save & Next Question ->"
                  : "Finish Session & Open Report ->"}
              </button>
              <Link
                href="/dashboard/interviews/sess-meridian-1/report"
                className="rounded-full border border-[#cfc2a5] bg-white px-4 py-2 text-[12.5px] text-[#212d3d]"
              >
                View Past Report
              </Link>
            </div>
            <span className="font-mono text-[11.5px] text-[#5a6675]">
              Word count: {answer.trim() ? answer.trim().split(/\s+/).length : 0}
            </span>
          </div>
        </section>
      </div>
    </DashboardSubpageFrame>
  );
}
