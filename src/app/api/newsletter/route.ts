import { NextRequest, NextResponse } from "next/server";
import { saveNewsletterSubscription } from "@/lib/storage";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: unknown };
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const result = await saveNewsletterSubscription(email);

    return NextResponse.json(
      {
        ok: true,
        alreadySubscribed: result.alreadySubscribed,
        message: result.alreadySubscribed
          ? "You are already subscribed to the monthly note."
          : "Subscribed. Watch for the next monthly note.",
      },
      { status: result.alreadySubscribed ? 200 : 201 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to process subscription right now." },
      { status: 500 }
    );
  }
}

