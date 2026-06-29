import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json({ ok: true, skipped: true, reason: "No GHL_WEBHOOK_URL configured" });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    return NextResponse.json({ ok: res.ok, status: res.status });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Webhook failed" }, { status: 500 });
  }
}
