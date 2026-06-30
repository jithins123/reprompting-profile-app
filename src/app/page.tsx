"use client";

import { useEffect, useMemo, useState } from "react";
import { questions } from "../lib/questions";

type Answer = { questionId: string; question: string; selectedId: string; selectedLabel: string; customText?: string };
type Step = "intro" | "questions" | "reflection" | "contact" | "processing" | "result" | "alreadyCompleted";

type Insight = {
  dominant_prompt: string;
  protective_prompt: string;
  pattern_cost: string;
  emerging_prompt: string;
  hidden_strengths: string[];
  growth_edges: string[];
  old_prompt: string;
  new_prompt: string;
  why_this_matters_now: string;
  seven_day_experiment: string;
  session_bridge: string;
  note: string;
};

const fallbackInsight: Insight = {
  dominant_prompt: "Your responses suggest a thoughtful mind that likes to see the next step clearly before moving. This can help you make careful choices and notice what matters.",
  protective_prompt: "This pattern may have helped you stay careful, prepared, and aware of risk before making important moves.",
  pattern_cost: "The cost may be that strong ideas stay private for too long. You may notice time, energy, or confidence going into preparation when part of you is ready to practise a clearer next step.",
  emerging_prompt: "A useful new direction is forming: I can take one small honest step and learn from what happens next.",
  hidden_strengths: ["Clear thinking", "Self-awareness", "Careful action"],
  growth_edges: ["Choosing one next step", "Letting action teach you"],
  old_prompt: "I prepare until I can see the next step.",
  new_prompt: "I notice one clear next step, take it with care, and learn from the result.",
  why_this_matters_now: "This matters because the next year can be shaped by small lived choices, not only private thoughts. One clear step can begin turning insight into movement.",
  seven_day_experiment: "For the next seven days, choose one small decision that matters. Take one simple step within 24 hours, then write one sentence about what you learned.",
  session_bridge: "A Reprompting call can help you work with this pattern directly, choose the next real-life move, and practise responding from your own power with support.",
  note: "This is an educational reflection based on your responses, not a diagnosis or final assessment."
};

const processingDelayMs = 7000;
const completionStorageKey = "reprompting_profile_completed";
const ctaUrl = process.env.NEXT_PUBLIC_CTA_URL || "";

export default function Home() {
  const [step, setStep] = useState<Step>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [reflection, setReflection] = useState("");
  const [contact, setContact] = useState({ firstName: "", email: "", phone: "" });
  const [consent, setConsent] = useState(false);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const question = questions[index];
  const currentAnswer = question ? answers[question.id] : undefined;
  const progress = useMemo(() => Math.round(((index + 1) / questions.length) * 100), [index]);

  useEffect(() => {
    if (hasCompletedProfile()) setStep("alreadyCompleted");
  }, []);

  function choose(optionId: string, optionLabel: string) {
    setAnswers(prev => ({
      ...prev,
      [question.id]: {
        questionId: question.id,
        question: question.title,
        selectedId: optionId,
        selectedLabel: optionLabel,
        customText: prev[question.id]?.customText || ""
      }
    }));
  }

  function setCustomText(value: string) {
    if (!currentAnswer) return;
    setAnswers(prev => ({
      ...prev,
      [question.id]: { ...prev[question.id], customText: value }
    }));
  }

  function nextQuestion() {
    if (index < questions.length - 1) setIndex(index + 1);
    else setStep("reflection");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function previousQuestion() {
    if (index > 0) setIndex(index - 1);
    else setStep("intro");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function generateInsight() {
    setError("");
    if (hasCompletedProfile()) {
      setStep("alreadyCompleted");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!contact.firstName.trim() || !contact.email.trim()) {
      setError("Please add your first name and email address.");
      return;
    }

    if (!consent) {
      setError("Please confirm you understand how your information will be used.");
      return;
    }

    setLoading(true);
    setStep("processing");
    window.scrollTo({ top: 0, behavior: "smooth" });

    const payload = {
      contact,
      reflection,
      answers: Object.values(answers),
      completedAt: new Date().toISOString(),
      consentAcceptedAt: new Date().toISOString(),
      source: "Reprompting Profile"
    };

    try {
      const [res] = await Promise.all([
        fetch("/api/insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }),
        delay(processingDelayMs)
      ]);

      const data = await res.json();
      if (data?.status === "already_completed") {
        markProfileCompleted();
        setStep("alreadyCompleted");
        return;
      }

      const generated = normalizeInsight(data?.insight);
      setInsight(generated);
      markProfileCompleted();
      setStep("result");

      await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, insight: generated })
      }).catch(() => undefined);
    } catch {
      await delay(processingDelayMs);
      setInsight(fallbackInsight);
      markProfileCompleted();
      setStep("result");
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function openCta() {
    if (!ctaUrl) return;
    window.open(ctaUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="shell">
      {step === "intro" && (
        <section className="hero">
          <div className="hero-inner">
            <div className="badge">✨ Ready For A Life Upgrade?</div>
            <div className="kicker">Reprompting Project | Prompt Engineering For Humans</div>
            <h1 className="title">
              <span>The</span>
              <span>Reprompting</span>
              <span className="script">Profile</span>
            </h1>
            <p className="lead">Discover the system prompt quietly shaping your choices, confidence, relationships and next chapter.</p>
            <div className="disclaimer"><strong>Important:</strong> This profile is for educational and reflective purposes only. It is not a diagnosis, clinical assessment, mental health report, or definitive statement about who you are. Your results are possible patterns suggested by your answers, offered as a starting point for self-observation and personal inquiry.</div>
            <div className="actions">
              <button className="btn primary" onClick={() => setStep("questions")}>🚀 Begin Profile</button>
            </div>
          </div>
        </section>
      )}

      {step === "alreadyCompleted" && (
        <section className="card processing-card">
          <div className="card-inner processing-inner">
            <div className="progress-label">Profile Already Completed</div>
            <h2 className="question-title">Looks like you've already taken this quiz.</h2>
            <p className="small processing-copy">If you're still curious, or want to understand what your result means for your next chapter, book a call and we can explore it together.</p>
            <div className="actions">
              <button className="btn primary" onClick={openCta} disabled={!ctaUrl}>Book Your Reprompting Call</button>
            </div>
          </div>
        </section>
      )}

      {step === "questions" && question && (
        <section className="card">
          <div className="card-inner">
            <div className="topbar">
              <div className="progress-label">Question {index + 1} / {questions.length}</div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            </div>
            <h2 className="question-title">{question.title}</h2>
            <div className="options">
              {question.options.map(option => (
                <button key={option.id} className={`option ${currentAnswer?.selectedId === option.id ? "selected" : ""}`} onClick={() => choose(option.id, option.label)}>
                  {option.label}
                </button>
              ))}
            </div>
            {currentAnswer?.selectedId === "other" && (
              <textarea className="textarea" placeholder="Tell us in one sentence..." value={currentAnswer.customText || ""} onChange={(e) => setCustomText(e.target.value)} maxLength={300} />
            )}
            <div className="nav">
              <button className="btn secondary" onClick={previousQuestion}>Back</button>
              <button className="btn primary" onClick={nextQuestion} disabled={!currentAnswer || (currentAnswer.selectedId === "other" && !currentAnswer.customText?.trim())}>Continue</button>
            </div>
          </div>
        </section>
      )}

      {step === "reflection" && (
        <section className="card">
          <div className="card-inner">
            <div className="progress-label">Final Reflection</div>
            <h2 className="question-title">If you could change just one thing about the way you think, react, or make decisions, what would it be?</h2>
            <p className="small">Take a moment to answer in your own words. This helps reveal the pattern underneath your choices.</p>
            <textarea className="textarea" value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="For example: I would like to stop second-guessing myself and trust my decisions more..." maxLength={1500} />
            <div className="nav">
              <button className="btn secondary" onClick={() => setStep("questions")}>Back</button>
              <button className="btn primary" disabled={!reflection.trim()} onClick={() => setStep("contact")}>Continue</button>
            </div>
          </div>
        </section>
      )}

      {step === "contact" && (
        <section className="card">
          <div className="card-inner">
            <div className="progress-label">Generate Your Profile</div>
            <h2 className="question-title">Almost done.</h2>
            <p className="small">Enter your details below and we'll generate your personalised Reprompting Profile.</p>
            <div className="form-grid">
              <input className="input" placeholder="First Name" value={contact.firstName} onChange={(e) => setContact({ ...contact, firstName: e.target.value })} maxLength={80} />
              <input className="input" placeholder="Email Address" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} maxLength={254} />
              <input className="input" placeholder="Mobile Number (optional)" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} maxLength={40} />
            </div>
            <div className="disclaimer">By continuing, you understand that this is an educational reflection based on your responses. It is not a diagnosis, therapy, treatment, or final report.</div>
            <label className="consent">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>I agree that my contact details, answers, and reflection may be processed to generate my profile and, if configured, sent to the Reprompting Project follow-up system.</span>
            </label>
            {error && <p className="error">{error}</p>}
            <div className="nav">
              <button className="btn secondary" onClick={() => setStep("reflection")}>Back</button>
              <button className="btn primary" disabled={loading} onClick={generateInsight}>{loading ? "Generating..." : "Generate Profile"}</button>
            </div>
          </div>
        </section>
      )}

      {step === "processing" && (
        <section className="card processing-card" aria-live="polite" aria-busy="true">
          <div className="card-inner processing-inner">
            <div className="processing-orbit" aria-hidden="true"><span /><span /><span /></div>
            <div className="progress-label">Processing Your Profile</div>
            <h2 className="question-title">Reading your answers with care.</h2>
            <p className="small processing-copy">Your responses, reflection, and patterns are being shaped into a grounded Reprompting Profile.</p>
          </div>
        </section>
      )}

      {step === "result" && insight && (
        <section className="card result-card">
          <div className="card-inner">
            <div className="progress-label">Your Reflective Profile</div>
            <h2 className="question-title">Here's what we noticed, {contact.firstName || "there"}.</h2>
            <div className="disclaimer result-disclaimer"><strong>Please remember:</strong> this is not a final result, diagnosis, or psychological assessment. It is an educational observation based on your answers — a possible map of prompts you may be running.</div>
            <div className="result-grid">
              <ResultBox title="The Pattern You May Be Running" text={insight.dominant_prompt} />
              <ResultBox title="How It Has Protected You" text={insight.protective_prompt} />
              <ResultBox title="Where It May Be Costing You" text={insight.pattern_cost} />
              <ResultBox title="The Shift Your System Is Ready For" text={insight.emerging_prompt} />
              <ResultBox title="Hidden Strengths" text={formatList(insight.hidden_strengths)} />
              <ResultBox title="Growth Edges" text={formatList(insight.growth_edges)} />
              <ResultBox title="Old Prompt" text={`“${insight.old_prompt}”`} />
              <ResultBox title="Personal Reprompt" text={`“${insight.new_prompt}”`} />
              <ResultBox title="Why This Matters Now" text={insight.why_this_matters_now} />
              <ResultBox title="7-Day Experiment" text={insight.seven_day_experiment} />
            </div>
            <div className="cta-panel">
              <h3>Bring this shift into your life.</h3>
              <p>{insight.session_bridge}</p>
              <button className="btn primary" onClick={openCta} disabled={!ctaUrl}>Book Your Reprompting Call</button>
            </div>
          </div>
        </section>
      )}
      <div className="footer">Reprompting Project | Prompt Engineering For Humans</div>
    </main>
  );
}

function ResultBox({ title, text }: { title: string; text: string }) {
  return <div className="result-box"><h3>{title}</h3><p>{text}</p></div>;
}

function hasCompletedProfile() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(completionStorageKey) === "true";
}

function markProfileCompleted() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(completionStorageKey, "true");
}

function normalizeInsight(value: unknown): Insight {
  const candidate = value && typeof value === "object" ? value as Partial<Insight> : {};
  const hiddenStrengths = Array.isArray(candidate.hidden_strengths) ? candidate.hidden_strengths.filter(isString) : fallbackInsight.hidden_strengths;
  const growthEdges = Array.isArray(candidate.growth_edges) ? candidate.growth_edges.filter(isString) : fallbackInsight.growth_edges;

  return {
    dominant_prompt: textOrFallback(candidate.dominant_prompt, fallbackInsight.dominant_prompt),
    protective_prompt: textOrFallback(candidate.protective_prompt, fallbackInsight.protective_prompt),
    pattern_cost: textOrFallback(candidate.pattern_cost, fallbackInsight.pattern_cost),
    emerging_prompt: textOrFallback(candidate.emerging_prompt, fallbackInsight.emerging_prompt),
    hidden_strengths: hiddenStrengths.length ? hiddenStrengths : fallbackInsight.hidden_strengths,
    growth_edges: growthEdges.length ? growthEdges : fallbackInsight.growth_edges,
    old_prompt: textOrFallback(candidate.old_prompt, fallbackInsight.old_prompt),
    new_prompt: textOrFallback(candidate.new_prompt, fallbackInsight.new_prompt),
    why_this_matters_now: textOrFallback(candidate.why_this_matters_now, fallbackInsight.why_this_matters_now),
    seven_day_experiment: textOrFallback(candidate.seven_day_experiment, fallbackInsight.seven_day_experiment),
    session_bridge: textOrFallback(candidate.session_bridge, fallbackInsight.session_bridge),
    note: textOrFallback(candidate.note, fallbackInsight.note)
  };
}

function textOrFallback(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function formatList(value: string[]) {
  return value.length ? value.join(" • ") : "No pattern detected.";
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
