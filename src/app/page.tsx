"use client";

import { useMemo, useState } from "react";
import { questions } from "../lib/questions";

type Answer = { questionId: string; question: string; selectedId: string; selectedLabel: string; customText?: string };
type Step = "intro" | "questions" | "reflection" | "contact" | "result";

type Insight = {
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

const fallbackInsight: Insight = {
  dominant_prompt: "Your responses suggest a mind that wants clarity before committing. This may be a powerful strength when used consciously, but it can become a delay pattern when you wait for perfect certainty.",
  protective_prompt: "When uncertainty rises, your system may protect you by asking for more information, more time, or more reassurance before you move.",
  emerging_prompt: "A more useful prompt may already be forming: I can learn through movement, not just preparation.",
  hidden_strengths: ["Self-awareness", "Thoughtfulness", "Desire for meaningful change"],
  blind_spots: ["Waiting until things feel completely clear", "Mistaking preparation for progress"],
  old_prompt: "I need to understand everything before I begin.",
  new_prompt: "Clarity grows through action. One honest step can teach me what thinking alone cannot.",
  seven_day_experiment: "For the next seven days, notice one place where you delay because you are waiting for more certainty. Take one small action within 24 hours and record what you learned.",
  note: "This is an educational reflection based on your responses, not a diagnosis or final assessment. Use it as a starting point for self-observation."
};

export default function Home() {
  const [step, setStep] = useState<Step>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [reflection, setReflection] = useState("");
  const [contact, setContact] = useState({ firstName: "", email: "", phone: "" });
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const question = questions[index];
  const currentAnswer = question ? answers[question.id] : undefined;
  const progress = useMemo(() => Math.round(((index + 1) / questions.length) * 100), [index]);

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
    if (!contact.firstName.trim() || !contact.email.trim()) {
      setError("Please add your first name and email address.");
      return;
    }

    setLoading(true);
    const payload = {
      contact,
      reflection,
      answers: Object.values(answers),
      completedAt: new Date().toISOString(),
      source: "Reprompting Profile"
    };

    try {
      const res = await fetch("/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const generated = data?.insight || fallbackInsight;
      setInsight(generated);
      setStep("result");

      await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, insight: generated })
      }).catch(() => undefined);
    } catch {
      setInsight(fallbackInsight);
      setStep("result");
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <main className="shell">
      {step === "intro" && (
        <section className="hero">
          <div className="hero-inner">
            <div className="badge">✨ Ready For A Life Upgrade?</div>
            <div className="kicker">Reprompting Project | Prompt Engineering For Humans</div>
            <h1 className="title">The Reprompting <span className="script">Profile™</span></h1>
            <p className="lead">Discover the system prompt quietly shaping your choices, confidence, relationships and next chapter.</p>
            <div className="disclaimer"><strong>Important:</strong> This profile is for educational and reflective purposes only. It is not a diagnosis, clinical assessment, mental health report, or definitive statement about who you are. Your results are possible patterns suggested by your answers, offered as a starting point for self-observation and personal inquiry.</div>
            <div className="actions">
              <button className="btn primary" onClick={() => setStep("questions")}>🚀 Begin Profile</button>
              <a className="btn secondary" href="#about" onClick={(e) => e.preventDefault()}>Learn More</a>
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
              <textarea className="textarea" placeholder="Tell us in one sentence..." value={currentAnswer.customText || ""} onChange={(e) => setCustomText(e.target.value)} />
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
            <p className="small">Write 2–5 sentences. This helps the AI understand your own language, not just your selected options.</p>
            <textarea className="textarea" value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="For example: I would like to stop second-guessing myself and trust my decisions more..." />
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
            <p className="small">Enter your details below and we'll generate your personalised Reprompting Profile™.</p>
            <div className="form-grid">
              <input className="input" placeholder="First Name" value={contact.firstName} onChange={(e) => setContact({ ...contact, firstName: e.target.value })} />
              <input className="input" placeholder="Email Address" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
              <input className="input" placeholder="Mobile Number (optional)" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
            </div>
            <div className="disclaimer">By continuing, you understand that this is an educational reflection based on your responses. It is not a diagnosis, therapy, treatment, or final report.</div>
            {error && <p className="error">{error}</p>}
            <div className="nav">
              <button className="btn secondary" onClick={() => setStep("reflection")}>Back</button>
              <button className="btn primary" disabled={loading} onClick={generateInsight}>{loading ? "Generating..." : "Generate Profile"}</button>
            </div>
          </div>
        </section>
      )}

      {step === "result" && insight && (
        <section className="card">
          <div className="card-inner">
            <div className="progress-label">Your Reflective Profile</div>
            <h2 className="question-title">Here's what we noticed, {contact.firstName || "there"}.</h2>
            <div className="disclaimer"><strong>Please remember:</strong> this is not a final result, diagnosis, or psychological assessment. It is an educational observation based on your answers — a possible map of prompts you may be running.</div>
            <div className="result-grid">
              <ResultBox title="Dominant Prompt" text={insight.dominant_prompt} />
              <ResultBox title="Protective Prompt" text={insight.protective_prompt} />
              <ResultBox title="Emerging Prompt" text={insight.emerging_prompt} />
              <ResultBox title="Hidden Strengths" text={insight.hidden_strengths.join(" • ")} />
              <ResultBox title="Possible Blind Spots" text={insight.blind_spots.join(" • ")} />
              <ResultBox title="Old Prompt" text={`“${insight.old_prompt}”`} />
              <ResultBox title="Personal Reprompt™" text={`“${insight.new_prompt}”`} />
              <ResultBox title="7-Day Experiment" text={insight.seven_day_experiment} />
            </div>
            <div className="actions">
              <button className="btn primary" onClick={() => window.location.href = "#"}>Book A Reprompting Session</button>
              <button className="btn secondary" onClick={() => window.location.reload()}>Retake Profile</button>
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
