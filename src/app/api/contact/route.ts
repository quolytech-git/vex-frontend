import { NextRequest, NextResponse } from "next/server";
import { saveContactSubmission } from "@/lib/storage";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: unknown;
      email?: unknown;
      disciplines?: unknown;
      engagementSize?: unknown;
      plan?: unknown;
      decisionSummary?: unknown;
    };

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const decisionSummary =
      typeof body.decisionSummary === "string"
        ? body.decisionSummary.trim()
        : "";
    const engagementSize =
      typeof body.engagementSize === "string" ? body.engagementSize.trim() : "";
    const plan =
      typeof body.plan === "string" && body.plan.trim()
        ? body.plan.trim()
        : undefined;
    const disciplines = Array.isArray(body.disciplines)
      ? body.disciplines.filter((d): d is string => typeof d === "string")
      : [];

    if (!name || name.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Please enter your name." },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!decisionSummary || decisionSummary.length < 8) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please share a short note on your target roles or request.",
        },
        { status: 400 }
      );
    }

    const saved = await saveContactSubmission({
      name,
      email,
      disciplines,
      engagementSize: engagementSize || "Not specified",
      plan,
      decisionSummary,
    });

    return NextResponse.json(
      {
        ok: true,
        id: saved.id,
        message: "Thank you. The Vex team will reply within 24 hours.",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to process enquiry right now." },
      { status: 500 }
    );
  }
}

