// src/ServiceQuiz.jsx
import React, { useMemo, useState } from "react";

/** i18n dictionary */
const I18N = {
  pl: {
    appTitle: "Znajdź fachowca dla siebie",
    progressAria: "Postęp",
    qOf: (s, t) => `Pytanie ${s} z ${t}`,
    back: "Wstecz",
    next: "Dalej",
    seeRecommendation: "Zobacz rekomendację",
    bestMatch: "Najlepsze dopasowanie",
    alt: "Alternatywa",
    howScored: "Jak liczymy wynik",
    provider: "Usługodawca",
    score: "Wynik",
    restart: "Zacznij od nowa",
    continue: "Kontynuuj",
    details: "Szczegóły",
    footer: "Nie wymagamy e‑maila. Twoje odpowiedzi służą wyłącznie do dopasowania rekomendacji.",
    // questions
    q_goal: "Co najlepiej opisuje Twój główny cel?",
    q_goal_helper: "To pomaga dopasować zakres i złożoność.",
    q_goal_opt1: "Szybkie, budżetowe rozwiązanie",
    q_goal_opt2: "Zrównoważony rozwój",
    q_goal_opt3: "Wdrożenie klasy enterprise",

    q_timeline: "Jaki masz horyzont czasowy?",
    q_timeline_helper: "Jeśli to ASAP, zoptymalizujemy pod kątem szybkości.",
    q_timeline_opt1: "W ciągu 1–2 tygodni",
    q_timeline_opt2: "1–2 miesiące",
    q_timeline_opt3: "3+ miesiące (etapami)",

    q_budget: "Jaki jest przybliżony budżet?",
    q_budget_helper: "Orientacyjna wartość wystarczy.",
    q_budget_opt1: "< 10 000 zł",
    q_budget_opt2: "10 000–80 000 zł",
    q_budget_opt3: "80 000+ zł",

    q_support: "Jakiego poziomu wsparcia ciągłego oczekujesz?",
    q_support_helper: "Weź pod uwagę aktualizacje, utrzymanie i SLA.",
    q_support_opt1: "Minimalne — jednorazowo",
    q_support_opt2: "Umiarkowane — miesięcznie",
    q_support_opt3: "Wysokie — tygodniowo/z SLA",

    q_compliance: "Czy masz wymagania dot. bezpieczeństwa/compliance?",
    q_compliance_helper: "Np. RODO, SOC 2, SSO, rezydencja danych.",
    q_compliance_opt1: "Brak szczególnych wymagań",
    q_compliance_opt2: "Częściowe wymagania",
    q_compliance_opt3: "Ścisłe wymagania",

    // providers
    p_basic_name: "Fachowiec Starter",
    p_basic_tag: "Szybkie i przystępne podstawy.",
    p_basic_desc:
      "Idealne do małych, jasno określonych zadań. Przejrzyste ceny i szybka realizacja.",
    p_pro_name: "Fachowiec Pro",
    p_pro_tag: "Skalowalne rozwiązania dla rozwijających się zespołów.",
    p_pro_desc:
      "Zbalansowany stosunek ceny do wartości dla zespołów potrzebujących niezawodności i wsparcia.",
    p_ent_name: "Fachowiec Enterprise",
    p_ent_tag: "Indywidualne, zgodne i krytyczne dla biznesu.",
    p_ent_desc:
      "Dla złożonych potrzeb, wymagań compliance i środowisk z wieloma interesariuszami.",
  },
  en: {
    appTitle: "Find the right expert for you",
    progressAria: "Progress",
    qOf: (s, t) => `Question ${s} of ${t}`,
    back: "Back",
    next: "Next",
    seeRecommendation: "See recommendation",
    bestMatch: "Best match",
    alt: "Runner up",
    howScored: "How we scored this",
    provider: "Provider",
    score: "Score",
    restart: "Restart quiz",
    continue: "Continue",
    details: "View",
    footer: "No email required. Your answers are only used to tailor recommendations.",
    // questions
    q_goal: "What best describes your primary goal?",
    q_goal_helper: "This helps us match scope and complexity.",
    q_goal_opt1: "Quick, budget‑friendly fix",
    q_goal_opt2: "Sustainable growth",
    q_goal_opt3: "Enterprise‑grade rollout",

    q_timeline: "What timeline are you targeting?",
    q_timeline_helper: "If it's ASAP, we’ll optimize for speed.",
    q_timeline_opt1: "Within 1–2 weeks",
    q_timeline_opt2: "1–2 months",
    q_timeline_opt3: "3+ months (phased)",

    q_budget: "What’s your approximate budget range?",
    q_budget_helper: "A ballpark is enough.",
    q_budget_opt1: "< $3k",
    q_budget_opt2: "$3k–$20k",
    q_budget_opt3: "$20k+",

    q_support: "How much ongoing support do you expect?",
    q_support_helper: "Consider updates, maintenance, and SLAs.",
    q_support_opt1: "Minimal — one‑and‑done",
    q_support_opt2: "Moderate — monthly",
    q_support_opt3: "High — weekly/with SLAs",

    q_compliance: "Any compliance/security needs?",
    q_compliance_helper: "e.g., GDPR, SOC 2, SSO, data residency.",
    q_compliance_opt1: "No special requirements",
    q_compliance_opt2: "Some requirements",
    q_compliance_opt3: "Strict requirements",

    // providers
    p_basic_name: "Starter Services Co.",
    p_basic_tag: "Quick, affordable basics.",
    p_basic_desc:
      "Ideal for small, well‑defined tasks. Transparent pricing and fast turnaround.",
    p_pro_name: "Pro Growth Studio",
    p_pro_tag: "Scalable solutions for growing teams.",
    p_pro_desc:
      "Balanced price‑to‑value for teams that need reliability, support, and room to grow.",
    p_ent_name: "Enterprise Partners",
    p_ent_tag: "Custom, compliant, mission‑critical.",
    p_ent_desc:
      "For complex needs, compliance requirements, and multi‑stakeholder environments.",
  },
};

const WEIGHTS = {
  goal: [
    { basic: 2, pro: 1, enterprise: 0 },
    { basic: 0, pro: 2, enterprise: 1 },
    { basic: 0, pro: 1, enterprise: 2 },
  ],
  timeline: [
    { basic: 2, pro: 1, enterprise: 0 },
    { basic: 0, pro: 2, enterprise: 1 },
    { basic: 0, pro: 1, enterprise: 2 },
  ],
  budget: [
    { basic: 2, pro: 1, enterprise: 0 },
    { basic: 1, pro: 2, enterprise: 1 },
    { basic: 0, pro: 1, enterprise: 2 },
  ],
  support: [
    { basic: 2, pro: 1, enterprise: 0 },
    { basic: 0, pro: 2, enterprise: 1 },
    { basic: 0, pro: 1, enterprise: 2 },
  ],
  compliance: [
    { basic: 2, pro: 1, enterprise: 0 },
    { basic: 0, pro: 2, enterprise: 1 },
    { basic: 0, pro: 1, enterprise: 2 },
  ],
};

function buildProviders(t) {
  return [
    {
      id: "basic",
      name: t.p_basic_name,
      tagline: t.p_basic_tag,
      description: t.p_basic_desc,
      ctaUrl: "#starter",
    },
    {
      id: "pro",
      name: t.p_pro_name,
      tagline: t.p_pro_tag,
      description: t.p_pro_desc,
      ctaUrl: "#pro",
    },
    {
      id: "enterprise",
      name: t.p_ent_name,
      tagline: t.p_ent_tag,
      description: t.p_ent_desc,
      ctaUrl: "#enterprise",
    },
  ];
}

function buildQuestions(t) {
  return [
    {
      id: "goal",
      text: t.q_goal,
      helper: t.q_goal_helper,
      options: [t.q_goal_opt1, t.q_goal_opt2, t.q_goal_opt3],
    },
    {
      id: "timeline",
      text: t.q_timeline,
      helper: t.q_timeline_helper,
      options: [t.q_timeline_opt1, t.q_timeline_opt2, t.q_timeline_opt3],
    },
    {
      id: "budget",
      text: t.q_budget,
      helper: t.q_budget_helper,
      options: [t.q_budget_opt1, t.q_budget_opt2, t.q_budget_opt3],
    },
    {
      id: "support",
      text: t.q_support,
      helper: t.q_support_helper,
      options: [t.q_support_opt1, t.q_support_opt2, t.q_support_opt3],
    },
    {
      id: "compliance",
      text: t.q_compliance,
      helper: t.q_compliance_helper,
      options: [t.q_compliance_opt1, t.q_compliance_opt2, t.q_compliance_opt3],
    },
  ];
}

function addWeights(base, add) {
  const next = { ...base };
  for (const k of Object.keys(add)) next[k] = (next[k] || 0) + add[k];
  return next;
}
function rankProviders(scores) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score }));
}

export default function ServiceQuiz() {
  const [lang, setLang] = useState("pl"); // change to "en" if you want English by default
  const t = I18N[lang];

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState({});
  const [scores, setScores] = useState({});
  const total = 5;
  const progress = Math.round((Math.min(step, total) / total) * 100);
  const questions = useMemo(() => buildQuestions(t), [t]);
  const providers = useMemo(() => buildProviders(t), [t]);

  const canNext = typeof selected[questions[step]?.id] === "number";
  const isComplete = step >= total;
  const ranking = useMemo(() => rankProviders(scores), [scores]);

  function onSelect(question, optionIndex) {
    setSelected((prev) => ({ ...prev, [question.id]: optionIndex }));
  }
  function onNext() {
    if (step >= total) return;
    const q = questions[step];
    const idx = selected[q.id];
    if (typeof idx !== "number") return;
    const weights = WEIGHTS[q.id][idx];
    setScores((prev) => addWeights(prev, weights));
    setStep(step + 1);
  }
  function onBack() {
    if (step === 0) return;
    const prevStep = step - 1;
    // Recompute scores from scratch up to prevStep
    const fresh = questions.slice(0, prevStep).reduce((acc, q) => {
      const ii = selected[q.id];
      if (typeof ii === "number") return addWeights(acc, WEIGHTS[q.id][ii]);
      return acc;
    }, {});
    setScores(fresh);
    setStep(prevStep);
  }
  function onRestart() {
    setStep(0);
    setSelected({});
    setScores({});
  }
  function changeLang(next) {
    if (next === lang) return;
    setLang(next);
    // Reset quiz to avoid mixing responses between languages
    setStep(0);
    setSelected({});
    setScores({});
  }

  return (
    <div className="mx-auto max-w-2xl p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">{t.appTitle}</h2>

        {/* Language toggle */}
        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => changeLang("pl")}
            className={`rounded-lg border px-2 py-1 ${
              lang === "pl" ? "border-black" : "border-neutral-300"
            }`}
            aria-pressed={lang === "pl"}
          >
            PL
          </button>
          <button
            type="button"
            onClick={() => changeLang("en")}
            className={`rounded-lg border px-2 py-1 ${
              lang === "en" ? "border-black" : "border-neutral-300"
            }`}
            aria-pressed={lang === "en"}
          >
            EN
          </button>
          <span className="ml-2 text-neutral-500 text-xs">{progress}%</span>
        </div>
      </div>

      <div
        aria-label={t.progressAria}
        className="relative mb-6 h-2 w-full overflow-hidden rounded-full bg-neutral-200"
      >
        <div
          className="absolute left-0 top-0 h-full bg-black transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {!isComplete ? (
        <QuestionCard
          t={t}
          question={questions[step]}
          step={step}
          total={total}
          selectedIndex={selected[questions[step].id]}
          onSelect={onSelect}
          onNext={onNext}
          onBack={onBack}
          canNext={canNext}
        />
      ) : (
        <ResultsCard t={t} providers={providers} ranking={ranking} onRestart={onRestart} />
      )}

      <FooterNote t={t} />
    </div>
  );
}

function QuestionCard({ t, question, step, total, selectedIndex, onSelect, onNext, onBack, canNext }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
        {t.qOf(step + 1, total)}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{question.text}</h3>
      {question.helper && <p className="mb-4 text-sm text-neutral-600">{question.helper}</p>}

      <fieldset className="space-y-2">
        <legend className="sr-only">{question.text}</legend>
        {question.options.map((label, i) => (
          <label
            key={i}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition hover:shadow-sm ${
              selectedIndex === i ? "border-black" : "border-neutral-200"
            }`}
          >
            <input
              type="radio"
              name={question.id}
              className="mt-1"
              checked={selectedIndex === i}
              onChange={() => onSelect(question, i)}
              aria-label={label}
            />
            <span className="text-base">{label}</span>
          </label>
        ))}
      </fieldset>

      <div className="mt-5 flex items-center justify-between gap-2">
        <button
          type="button"
          className="rounded-xl border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
          onClick={onBack}
          disabled={step === 0}
          aria-disabled={step === 0}
        >
          {t.back}
        </button>
        <button
          type="button"
          className={`rounded-xl px-5 py-2 text-sm font-medium text-white transition ${
            canNext ? "bg-black hover:opacity-90" : "bg-neutral-400"
          }`}
          onClick={onNext}
          disabled={!canNext}
          aria-disabled={!canNext}
        >
          {step + 1 === total ? t.seeRecommendation : t.next}
        </button>
      </div>
    </div>
  );
}

function ResultsCard({ t, providers, ranking, onRestart }) {
  if (!ranking.length) return null;
  const top3 = ranking.slice(0, 3);
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-green-700">
          {t.bestMatch}
        </div>
        <Winner t={t} providers={providers} providerId={top3[0].id} score={top3[0].score} />
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            className="rounded-xl border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
            onClick={onRestart}
          >
            {t.restart}
          </button>
          <a
            href={providers.find((p) => p.id === top3[0].id)?.ctaUrl || "#"}
            className="rounded-xl bg-black px-5 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            {t.continue}
          </a>
        </div>
      </div>

      {top3.slice(1).map((r) => (
        <div key={r.id} className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
            {t.alt}
          </div>
          <ProviderRow t={t} providers={providers} providerId={r.id} score={r.score} />
        </div>
      ))}

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h4 className="mb-2 text-lg font-semibold">{t.howScored}</h4>
        <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="text-neutral-500">
              <th className="w-1/2 p-2">{t.provider}</th>
              <th className="w-1/2 p-2">{t.score}</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((r) => {
              const p = providers.find((x) => x.id === r.id);
              return (
                <tr key={r.id} className="border-t">
                  <td className="p-2">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-neutral-500">{p.tagline}</div>
                  </td>
                  <td className="p-2 align-top">{r.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Winner({ t, providers, providerId, score }) {
  const p = providers.find((x) => x.id === providerId);
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-xl font-semibold">{p.name}</div>
        <div className="text-sm text-neutral-600">{p.tagline}</div>
        <p className="mt-2 text-sm text-neutral-700">{p.description}</p>
      </div>
      <div className="mt-2 w-full md:mt-0 md:w-auto">
        <div className="rounded-xl bg-neutral-100 p-3 text-center">
          <div className="text-xs uppercase tracking-wide text-neutral-600">{t.score}</div>
          <div className="text-2xl font-semibold">{score}</div>
        </div>
      </div>
    </div>
  );
}

function ProviderRow({ t, providers, providerId, score }) {
  const p = providers.find((x) => x.id === providerId);
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="font-medium">{p.name}</div>
        <div className="text-xs text-neutral-600">{p.tagline}</div>
      </div>
      <div className="text-sm">{score}</div>
      <a
        href={p.ctaUrl}
        className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs hover:bg-neutral-50"
      >
        {t.details}
      </a>
    </div>
  );
}

function FooterNote({ t }) {
  return <p className="mt-6 text-center text-xs text-neutral-500">{t.footer}</p>;
}
