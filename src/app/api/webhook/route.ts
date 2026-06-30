import { NextResponse } from "next/server";
import {
  checkRateLimit,
  clientKey,
  isSameOriginRequest,
  readJsonBody,
  sanitizeInsight,
  sanitizePayload
} from "../../../lib/security";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  const rateLimit = checkRateLimit(clientKey(request, "webhook"), 10);
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } }
    );
  }

  let body: Record<string, unknown>;
  let payload;

  try {
    body = await readJsonBody(request) as Record<string, unknown>;
    payload = sanitizePayload(body);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid webhook submission." }, { status: 400 });
  }

  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json({ ok: true, skipped: true, reason: "No GHL_WEBHOOK_URL configured" });
  }

  try {
    const insight = sanitizeInsight(body.insight);
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, insight })
    });

    return NextResponse.json({ ok: res.ok, status: res.status });
  } catch {
    return NextResponse.json({ ok: false, error: "Webhook failed" }, { status: 500 });
  }
}
