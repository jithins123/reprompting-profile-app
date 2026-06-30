type RateBucket = {
  count: number;
  resetAt: number;
};

export type ContactPayload = {
  firstName: string;
  email: string;
  phone: string;
};

export type AnswerPayload = {
  questionId: string;
  question: string;
  selectedId: string;
  selectedLabel: string;
  customText?: string;
};

export type RepromptingPayload = {
  contact: ContactPayload;
  reflection: string;
  answers: AnswerPayload[];
  completedAt?: string;
  source?: string;
  consentAcceptedAt?: string;
};

export type InsightPayload = {
  dominant_prompt: string;
  protective_prompt: string;
  emerging_prompt: string;
  hidden_strengths: string[];
  blind_spots: string[];
  old_prompt: string;
  new_prompt: string;
  seven_day_experiment: string;
  note: string;
};

const buckets = new Map<string, RateBucket>();

const RATE_LIMIT_WINDOW_MS = 60_000;
const DEFAULT_RATE_LIMIT = 8;
const MAX_BODY_BYTES = 24_000;
const MAX_TEXT_LENGTH = 1_500;
const MAX_SHORT_TEXT_LENGTH = 300;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function clientKey(request: Request, namespace: string) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return `${namespace}:${forwardedFor || realIp || "unknown"}`;
}

export function checkRateLimit(key: string, limit = DEFAULT_RATE_LIMIT) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }

  if (current.count >= limit) {
    return {
      ok: false,
      retryAfter: Math.ceil((current.resetAt - now) / 1000)
    };
  }

  current.count += 1;
  return { ok: true };
}

export async function readJsonBody(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") || "0");
  if (declaredLength > MAX_BODY_BYTES) {
    throw new Error("Request body is too large.");
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
    throw new Error("Request body is too large.");
  }

  return JSON.parse(text);
}

export function sanitizePayload(input: unknown): RepromptingPayload {
  const body = asRecord(input);
  const contact = asRecord(body.contact);
  const answers = Array.isArray(body.answers) ? body.answers.slice(0, 20) : [];

  const firstName = cleanText(contact.firstName, 80);
  const email = cleanText(contact.email, 254).toLowerCase();
  const phone = cleanText(contact.phone, 40);
  const reflection = cleanText(body.reflection, MAX_TEXT_LENGTH);

  if (!firstName || !EMAIL_PATTERN.test(email)) {
    throw new Error("A valid first name and email address are required.");
  }

  if (!reflection) {
    throw new Error("Reflection is required.");
  }

  const sanitizedAnswers = answers.map(answer => {
    const item = asRecord(answer);
    return {
      questionId: cleanText(item.questionId, 80),
      question: cleanText(item.question, MAX_SHORT_TEXT_LENGTH),
      selectedId: cleanText(item.selectedId, 80),
      selectedLabel: cleanText(item.selectedLabel, MAX_SHORT_TEXT_LENGTH),
      customText: cleanText(item.customText, MAX_SHORT_TEXT_LENGTH)
    };
  }).filter(answer => answer.questionId && answer.selectedId && answer.selectedLabel);

  if (sanitizedAnswers.length === 0) {
    throw new Error("At least one answer is required.");
  }

  return {
    contact: { firstName, email, phone },
    reflection,
    answers: sanitizedAnswers,
    completedAt: cleanText(body.completedAt, 40),
    source: cleanText(body.source, 80),
    consentAcceptedAt: cleanText(body.consentAcceptedAt, 40)
  };
}

export function sanitizeInsight(input: unknown): InsightPayload | null {
  const body = asRecord(input);
  const insight = {
    dominant_prompt: cleanText(body.dominant_prompt, MAX_TEXT_LENGTH),
    protective_prompt: cleanText(body.protective_prompt, MAX_TEXT_LENGTH),
    emerging_prompt: cleanText(body.emerging_prompt, MAX_TEXT_LENGTH),
    hidden_strengths: cleanList(body.hidden_strengths, 5),
    blind_spots: cleanList(body.blind_spots, 5),
    old_prompt: cleanText(body.old_prompt, MAX_SHORT_TEXT_LENGTH),
    new_prompt: cleanText(body.new_prompt, MAX_SHORT_TEXT_LENGTH),
    seven_day_experiment: cleanText(body.seven_day_experiment, MAX_TEXT_LENGTH),
    note: cleanText(body.note, MAX_TEXT_LENGTH)
  };

  if (
    !insight.dominant_prompt ||
    !insight.protective_prompt ||
    !insight.emerging_prompt ||
    insight.hidden_strengths.length === 0 ||
    insight.blind_spots.length === 0 ||
    !insight.old_prompt ||
    !insight.new_prompt ||
    !insight.seven_day_experiment ||
    !insight.note
  ) {
    return null;
  }

  return insight;
}

function asRecord(input: unknown): Record<string, unknown> {
  return input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
}

function cleanText(input: unknown, maxLength: number) {
  if (typeof input !== "string") return "";
  return input.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function cleanList(input: unknown, maxItems: number) {
  if (!Array.isArray(input)) return [];
  return input.map(item => cleanText(item, MAX_SHORT_TEXT_LENGTH)).filter(Boolean).slice(0, maxItems);
}
