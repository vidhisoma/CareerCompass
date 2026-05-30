import { useState } from "react";

const COLORS = {
  bg: "#0A0A0F",
  surface: "#111118",
  surfaceHigh: "#1A1A24",
  border: "#2A2A3A",
  accent: "#6C63FF",
  accentGlow: "#6C63FF33",
  accentSoft: "#6C63FF22",
  green: "#22C55E",
  amber: "#F59E0B",
  red: "#EF4444",
  textPrimary: "#F0F0F8",
  textSecondary: "#8888AA",
  textMuted: "#444466",
};

const styles = {
  app: {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.textPrimary,
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  sidebar: {
    width: 220,
    background: COLORS.surface,
    borderRight: `1px solid ${COLORS.border}`,
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    zIndex: 10,
  },
  logo: {
    padding: "0 20px 28px",
    borderBottom: `1px solid ${COLORS.border}`,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 17,
    fontWeight: 700,
    color: COLORS.textPrimary,
    letterSpacing: "-0.02em",
  },
  logoDot: {
    display: "inline-block",
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: COLORS.accent,
    marginRight: 8,
    boxShadow: `0 0 8px ${COLORS.accent}`,
  },
  navItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: 13.5,
    fontWeight: active ? 600 : 400,
    color: active ? COLORS.textPrimary : COLORS.textSecondary,
    background: active ? COLORS.accentSoft : "transparent",
    borderLeft: active ? `2px solid ${COLORS.accent}` : "2px solid transparent",
    transition: "all 0.15s",
  }),
  mainContent: {
    marginLeft: 220,
    flex: 1,
    padding: "32px 40px",
    maxWidth: "calc(100vw - 220px)",
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    marginBottom: 4,
  },
  pageSub: {
    fontSize: 13.5,
    color: COLORS.textSecondary,
    marginBottom: 28,
  },
  card: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 14,
    padding: "22px 24px",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 14,
    color: COLORS.textPrimary,
  },
  input: {
    width: "100%",
    background: COLORS.surfaceHigh,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    padding: "11px 14px",
    color: COLORS.textPrimary,
    fontSize: 13.5,
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
    transition: "border-color 0.15s",
  },
  btn: (variant = "primary") => ({
    padding: "10px 20px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 13.5,
    fontWeight: 600,
    transition: "all 0.15s",
    background:
      variant === "primary"
        ? COLORS.accent
        : variant === "ghost"
        ? "transparent"
        : COLORS.surfaceHigh,
    color:
      variant === "primary"
        ? "#fff"
        : variant === "ghost"
        ? COLORS.textSecondary
        : COLORS.textPrimary,
    border: variant === "ghost" ? `1px solid ${COLORS.border}` : "none",
    boxShadow: variant === "primary" ? `0 0 20px ${COLORS.accentGlow}` : "none",
  }),
  badge: (color) => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    background:
      color === "green" ? "#22C55E22" : color === "amber" ? "#F59E0B22" : color === "red" ? "#EF444422" : COLORS.accentSoft,
    color:
      color === "green" ? COLORS.green : color === "amber" ? COLORS.amber : color === "red" ? COLORS.red : COLORS.accent,
  }),
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
    marginBottom: 20,
  },
  statCard: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: "16px 18px",
  },
  statVal: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  kanbanGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
  },
  kanbanCol: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: 14,
    minHeight: 200,
  },
  kanbanHeader: {
    fontSize: 12,
    fontWeight: 600,
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
  jobCard: {
    background: COLORS.surfaceHigh,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    padding: "12px 14px",
    marginBottom: 8,
    cursor: "pointer",
    transition: "border-color 0.15s",
  },
  jobTitle: { fontSize: 13, fontWeight: 600, marginBottom: 2, color: COLORS.textPrimary },
  jobCompany: { fontSize: 12, color: COLORS.textSecondary },
  scoreBar: { height: 6, borderRadius: 3, background: COLORS.border, overflow: "hidden", marginTop: 6 },
  scoreFill: (pct, color) => ({
    height: "100%",
    width: `${pct}%`,
    background: color,
    borderRadius: 3,
    transition: "width 0.8s ease",
  }),
  interviewQ: {
    background: COLORS.surfaceHigh,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    padding: "14px 16px",
    marginBottom: 10,
  },
  feedbackBox: {
    background: "#6C63FF11",
    border: `1px solid ${COLORS.accentGlow}`,
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 12.5,
    color: COLORS.textSecondary,
    marginTop: 8,
    lineHeight: 1.6,
  },
};

// ── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_SCAN_RESULT = {
  overallScore: 72,
  atsScore: 68,
  keywordScore: 75,
  formatScore: 80,
  matched: ["React", "JavaScript", "Node.js", "API", "PostgreSQL"],
  missing: ["TypeScript", "GraphQL", "AWS", "CI/CD", "Agile"],
  improvements: [
    "Add measurable impact to each bullet — e.g. 'reduced load time by 35%' beats 'improved performance'.",
    "Include TypeScript prominently — it appears 4 times in the JD but is missing from your skills section.",
    "Add a brief 2-line summary at the top so ATS parsers can categorise your profile immediately.",
  ],
  summary:
    "Strong technical background with solid React and Node experience. Missing several keywords the ATS will screen for — adding TypeScript and AWS to your skills section could lift your score above 85.",
};

const MOCK_COVER_LETTER = {
  professional: `I am writing to express my interest in the Senior Frontend Engineer role at Stripe. With over four years of experience building high-performance React applications — including dashboards serving 50,000+ daily users — I am confident I can contribute meaningfully to your growth team from day one.

At TechCorp, I reduced API latency by 40% through strategic Redis caching and led a full migration from class-based to hook-based React patterns, cutting bundle size by 22%. I have a strong eye for performance bottlenecks and a habit of instrumenting everything before optimising, which I understand aligns closely with Stripe's engineering culture.

Stripe's focus on reliability and developer experience is what draws me most to this role. I would welcome the chance to bring my frontend expertise to a product that millions of developers depend on every day.`,

  confident: `Stripe is building the financial infrastructure of the internet — and I want to help build the interfaces that sit on top of it. As a Senior Frontend Engineer with four years of React experience and a track record of shipping at scale, I am ready to hit the ground running.

I have built dashboards used by 50,000+ users, cut API latency by 40%, and led architecture decisions that shaved 22% off our bundle size. I move fast, write clean code, and I obsess over the details that separate a good UI from a great one.

I would love to bring that same energy to Stripe's growth team. Let's talk.`,

  enthusiastic: `I have been following Stripe's engineering blog for years, so seeing this role open was genuinely exciting. Stripe is one of the few companies where the frontend work is as technically interesting as the backend — and that is exactly the kind of environment where I do my best work.

My background in React, performance optimisation, and large-scale dashboard development maps closely to what you are looking for. I shipped a 50,000-user dashboard at TechCorp, cut latency by 40%, and consistently pushed for better developer tooling across the team.

I would be thrilled to bring that enthusiasm and experience to Stripe. I am confident I would be a strong fit for this team.`,

  conversational: `Hey — I came across the Senior Frontend Engineer role at Stripe and it is pretty much exactly what I have been looking for. I have spent the last few years building React apps at scale, and I am at the point where I want to work on a product that really matters to developers.

At my current job I built and maintained dashboards with 50k+ users, dropped our API latency by 40%, and generally pushed to make the codebase cleaner and faster wherever I could. TypeScript is something I have been investing in heavily this past year too.

Would love to have a conversation about the role if you think there is a fit.`,
};

const MOCK_QUESTIONS = [
  "Walk me through a React performance problem you diagnosed and fixed in production.",
  "How do you approach building a component library that needs to scale across multiple teams?",
  "Tell me about a time you disagreed with a technical decision and how you handled it.",
  "How do you think about the trade-off between shipping fast and writing maintainable code?",
];

const MOCK_FEEDBACK = [
  "Good structure and a clear example — the STAR format comes through well. Try quantifying the outcome more specifically; 'improved performance' is less memorable than '300ms faster load time'. Quick tip: lead with the impact, then explain what you did to get there.",
  "Strong answer that shows self-awareness. The improvement area could be more concrete — instead of 'I learned to communicate better', name one specific thing you changed (e.g. 'I started sending a written summary after every verbal decision'). Quick tip: interviewers remember specifics, not generalities.",
  "Honest and direct, which interviewers respect. The strength here is that you show ownership. Push a bit further on the outcome — what happened after you raised the concern? Did the team change course, or did you commit and execute anyway? Quick tip: end on what you learned, not just what happened.",
  "Great philosophical answer. Grounding it in a real example would make it land much stronger — pick one moment where you made a deliberate call to ship faster and explain why that was the right decision in context. Quick tip: show that you have a framework, not just an instinct.",
];

// ── HELPERS ──────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function ScoreCircle({ score, label }) {
  const r = 34, cx = 40, cy = 40;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 75 ? COLORS.green : score >= 50 ? COLORS.amber : COLORS.red;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.border} strokeWidth="5" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
          transform="rotate(-90 40 40)" style={{ transition: "stroke-dasharray 1s ease" }} />
        <text x="40" y="44" textAnchor="middle" fill={color} fontSize="16" fontWeight="700" fontFamily="DM Sans, sans-serif">{score}</text>
      </svg>
      <div style={{ fontSize: 11, color: COLORS.textSecondary, marginTop: -4 }}>{label}</div>
    </div>
  );
}

function LoadingDots() {
  return (
    <span>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          display: "inline-block", width: 6, height: 6, borderRadius: "50%",
          background: COLORS.accent, margin: "0 3px",
          animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s`
        }} />
      ))}
    </span>
  );
}

// ── RESUME SCANNER ───────────────────────────────────────────────────────────

function ResumeScanner() {
  const [resume, setResume] = useState("Paste your resume here...");
  const [jd, setJd] = useState("Paste the job description here...");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    await sleep(2200);
    setResult(MOCK_SCAN_RESULT);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Your Resume</div>
          <textarea style={{ ...styles.input, minHeight: 260, fontSize: 12.5 }} value={resume} onChange={(e) => setResume(e.target.value)} />
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Job Description</div>
          <textarea style={{ ...styles.input, minHeight: 260, fontSize: 12.5 }} value={jd} onChange={(e) => setJd(e.target.value)} />
        </div>
      </div>
      <button style={styles.btn("primary")} onClick={analyze} disabled={loading}>
        {loading ? "Analyzing…" : "⚡ Scan Resume"}
      </button>

      {loading && (
        <div style={{ textAlign: "center", padding: "32px 0", color: COLORS.textSecondary }}>
          <LoadingDots />
          <div style={{ marginTop: 12, fontSize: 13 }}>Scanning against ATS filters…</div>
        </div>
      )}

      {result && !loading && (
        <div style={{ ...styles.card, marginTop: 16 }}>
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start", marginBottom: 20 }}>
            <ScoreCircle score={result.overallScore} label="Overall" />
            <ScoreCircle score={result.atsScore} label="ATS" />
            <ScoreCircle score={result.keywordScore} label="Keywords" />
            <ScoreCircle score={result.formatScore} label="Format" />
            <div style={{ flex: 1, fontSize: 13.5, color: COLORS.textSecondary, lineHeight: 1.7 }}>{result.summary}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.green, marginBottom: 8 }}>✓ MATCHED KEYWORDS</div>
              {result.matched.map((k) => (
                <span key={k} style={{ ...styles.badge("green"), marginRight: 6, marginBottom: 6, display: "inline-block" }}>{k}</span>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.red, marginBottom: 8 }}>✕ MISSING KEYWORDS</div>
              {result.missing.map((k) => (
                <span key={k} style={{ ...styles.badge("red"), marginRight: 6, marginBottom: 6, display: "inline-block" }}>{k}</span>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.amber, marginBottom: 8 }}>⚠ IMPROVEMENTS</div>
            {result.improvements.map((imp, i) => (
              <div key={i} style={{ fontSize: 13, color: COLORS.textSecondary, padding: "6px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                {i + 1}. {imp}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── COVER LETTER ─────────────────────────────────────────────────────────────

function CoverLetter() {
  const [tone, setTone] = useState("professional");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setLetter("");
    await sleep(1800);
    setLetter(MOCK_COVER_LETTER[tone]);
    setLoading(false);
  };

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>Select tone and generate</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["professional", "confident", "enthusiastic", "conversational"].map((t) => (
            <button key={t} style={{ ...styles.btn(tone === t ? "primary" : "ghost"), padding: "7px 16px", fontSize: 13 }} onClick={() => setTone(t)}>
              {t}
            </button>
          ))}
        </div>
        <button style={{ ...styles.btn("primary"), marginTop: 14 }} onClick={generate} disabled={loading}>
          {loading ? "Writing…" : "✍ Generate Cover Letter"}
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "28px 0", color: COLORS.textSecondary, fontSize: 13 }}>
          <LoadingDots />
          <div style={{ marginTop: 10 }}>Crafting your cover letter…</div>
        </div>
      )}

      {letter && !loading && (
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={styles.cardTitle}>Generated Cover Letter</div>
            <button style={{ ...styles.btn("ghost"), padding: "6px 12px", fontSize: 12 }} onClick={() => navigator.clipboard.writeText(letter)}>
              Copy
            </button>
          </div>
          <div style={{ fontSize: 13.5, lineHeight: 1.85, color: COLORS.textPrimary, whiteSpace: "pre-wrap" }}>{letter}</div>
        </div>
      )}
    </div>
  );
}

// ── JOB TRACKER ──────────────────────────────────────────────────────────────

const INITIAL_JOBS = {
  applied: [
    { id: 1, title: "Frontend Engineer", company: "Stripe", date: "May 28" },
    { id: 2, title: "React Developer", company: "Linear", date: "May 25" },
  ],
  interview: [{ id: 3, title: "UI Engineer", company: "Vercel", date: "May 20" }],
  offer: [],
  rejected: [{ id: 4, title: "SWE", company: "Meta", date: "May 15" }],
};

function JobTracker() {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", stage: "applied" });

  const stages = [
    { key: "applied", label: "Applied", color: COLORS.accent },
    { key: "interview", label: "Interview", color: COLORS.amber },
    { key: "offer", label: "Offer", color: COLORS.green },
    { key: "rejected", label: "Rejected", color: COLORS.red },
  ];

  const total = Object.values(jobs).flat().length;
  const interviews = jobs.interview.length + jobs.offer.length;

  const addJob = () => {
    if (!form.title || !form.company) return;
    const newJob = { id: Date.now(), title: form.title, company: form.company, date: "Today" };
    setJobs((prev) => ({ ...prev, [form.stage]: [newJob, ...prev[form.stage]] }));
    setForm({ title: "", company: "", stage: "applied" });
    setAdding(false);
  };

  const moveJob = (job, from, to) => {
    setJobs((prev) => ({
      ...prev,
      [from]: prev[from].filter((j) => j.id !== job.id),
      [to]: [job, ...prev[to]],
    }));
  };

  return (
    <div>
      <div style={styles.statGrid}>
        <div style={styles.statCard}><div style={styles.statVal}>{total}</div><div style={styles.statLabel}>Total applications</div></div>
        <div style={styles.statCard}><div style={{ ...styles.statVal, color: COLORS.amber }}>{interviews}</div><div style={styles.statLabel}>Interviews / offers</div></div>
        <div style={styles.statCard}><div style={{ ...styles.statVal, color: COLORS.green }}>{jobs.offer.length}</div><div style={styles.statLabel}>Offers received</div></div>
        <div style={styles.statCard}><div style={{ ...styles.statVal, color: COLORS.textSecondary }}>{total > 0 ? Math.round((interviews / total) * 100) : 0}%</div><div style={styles.statLabel}>Response rate</div></div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button style={styles.btn("primary")} onClick={() => setAdding(!adding)}>+ Add Application</button>
      </div>

      {adding && (
        <div style={{ ...styles.card, display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 5 }}>Job title</div>
            <input style={styles.input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Frontend Engineer" />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 5 }}>Company</div>
            <input style={styles.input} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. Stripe" />
          </div>
          <div style={{ minWidth: 130 }}>
            <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 5 }}>Stage</div>
            <select style={{ ...styles.input, padding: "10px 12px" }} value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
              {stages.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <button style={styles.btn("primary")} onClick={addJob}>Add</button>
          <button style={styles.btn("ghost")} onClick={() => setAdding(false)}>Cancel</button>
        </div>
      )}

      <div style={styles.kanbanGrid}>
        {stages.map(({ key, label, color }) => (
          <div key={key} style={styles.kanbanCol}>
            <div style={styles.kanbanHeader}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block" }} />
              {label}
              <span style={{ marginLeft: "auto", background: COLORS.surfaceHigh, borderRadius: 8, padding: "1px 7px", fontSize: 11, color: COLORS.textSecondary }}>
                {jobs[key].length}
              </span>
            </div>
            {jobs[key].map((job) => (
              <div key={job.id} style={styles.jobCard}>
                <div style={styles.jobTitle}>{job.title}</div>
                <div style={styles.jobCompany}>{job.company}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 6 }}>{job.date}</div>
                <div style={{ marginTop: 8, display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {stages.filter((s) => s.key !== key).map((s) => (
                    <button key={s.key} onClick={() => moveJob(job, key, s.key)}
                      style={{ fontSize: 10, padding: "2px 8px", background: COLORS.surfaceHigh, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.textSecondary, cursor: "pointer" }}>
                      → {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── INTERVIEW PREP ───────────────────────────────────────────────────────────

function InterviewPrep() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingFb, setLoadingFb] = useState({});

  const generateQuestions = async () => {
    setLoadingQ(true);
    setQuestions([]);
    setAnswers({});
    setFeedback({});
    await sleep(1600);
    setQuestions(MOCK_QUESTIONS);
    setLoadingQ(false);
  };

  const getFeedback = async (idx) => {
    if (!answers[idx]?.trim()) return;
    setLoadingFb((prev) => ({ ...prev, [idx]: true }));
    await sleep(1400);
    setFeedback((prev) => ({ ...prev, [idx]: MOCK_FEEDBACK[idx % MOCK_FEEDBACK.length] }));
    setLoadingFb((prev) => ({ ...prev, [idx]: false }));
  };

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>Generate role-specific questions</div>
        <p style={{ fontSize: 13.5, color: COLORS.textSecondary, marginBottom: 14, lineHeight: 1.6 }}>
          Click below to get 4 interview questions tailored to a Senior Frontend Engineer role. Type your answers and get feedback on each one.
        </p>
        <button style={styles.btn("primary")} onClick={generateQuestions} disabled={loadingQ}>
          {loadingQ ? "Generating…" : "🎯 Generate Interview Questions"}
        </button>
      </div>

      {loadingQ && (
        <div style={{ textAlign: "center", padding: 28, color: COLORS.textSecondary, fontSize: 13 }}>
          <LoadingDots />
          <div style={{ marginTop: 10 }}>Preparing your questions…</div>
        </div>
      )}

      {questions.map((q, i) => (
        <div key={i} style={styles.interviewQ}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 10 }}>Q{i + 1}. {q}</div>
          <textarea
            style={{ ...styles.input, minHeight: 80, fontSize: 13 }}
            placeholder="Type your answer here…"
            value={answers[i] || ""}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
          />
          <button
            style={{ ...styles.btn("ghost"), marginTop: 8, padding: "7px 14px", fontSize: 12 }}
            onClick={() => getFeedback(i)}
            disabled={loadingFb[i] || !answers[i]?.trim()}
          >
            {loadingFb[i] ? "Getting feedback…" : "Get AI Feedback"}
          </button>
          {feedback[i] && (
            <div style={styles.feedbackBox}>
              <strong style={{ color: COLORS.accent, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Feedback</strong>
              <div style={{ marginTop: 6 }}>{feedback[i]}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── DASHBOARD ────────────────────────────────────────────────────────────────

function Dashboard({ setPage }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { icon: "⚡", title: "Resume Scanner", desc: "Score your resume against any job description", page: "resume", color: COLORS.accent },
          { icon: "✍", title: "Cover Letter", desc: "Generate tailored cover letters in seconds", page: "cover", color: COLORS.green },
          { icon: "📋", title: "Job Tracker", desc: "Track applications from applied to offer", page: "tracker", color: COLORS.amber },
          { icon: "🎯", title: "Interview Prep", desc: "Practice with role-specific questions", page: "interview", color: COLORS.red },
        ].map(({ icon, title, desc, page, color }) => (
          <div key={page} style={{ ...styles.card, cursor: "pointer", transition: "border-color 0.2s" }}
            onClick={() => setPage(page)}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.border)}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 13, color: COLORS.textSecondary }}>{desc}</div>
          </div>
        ))}
      </div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>Getting started</div>
        <div style={{ fontSize: 13.5, color: COLORS.textSecondary, lineHeight: 1.7 }}>
          Start with the <span style={{ color: COLORS.textPrimary, fontWeight: 600 }}>Resume Scanner</span> — paste your resume and a job description to see your ATS score and missing keywords instantly.
        </div>
      </div>
    </div>
  );
}

// ── APP SHELL ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");

  const nav = [
    { key: "home", label: "Dashboard", icon: "🏠" },
    { key: "resume", label: "Resume Scanner", icon: "⚡" },
    { key: "cover", label: "Cover Letter", icon: "✍" },
    { key: "tracker", label: "Job Tracker", icon: "📋" },
    { key: "interview", label: "Interview Prep", icon: "🎯" },
  ];

  const pageTitles = {
    home: { title: "Dashboard", sub: "Your job search hub" },
    resume: { title: "Resume Scanner", sub: "Get your ATS score and keyword analysis" },
    cover: { title: "Cover Letter", sub: "Tailored to every job, generated instantly" },
    tracker: { title: "Job Tracker", sub: "Stay on top of every application" },
    interview: { title: "Interview Prep", sub: "Practice with role-specific questions" },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.bg}; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
        textarea:focus, input:focus, select:focus { border-color: ${COLORS.accent} !important; outline: none; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
        select option { background: ${COLORS.surfaceHigh}; }
      `}</style>

      <div style={styles.app}>
        <div style={styles.sidebar}>
          <div style={styles.logo}>
            <div style={styles.logoText}><span style={styles.logoDot} />CareerCompass</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>AI Job Search Assistant</div>
          </div>
          {nav.map(({ key, label, icon }) => (
            <div key={key} style={styles.navItem(page === key)} onClick={() => setPage(key)}>
              <span>{icon}</span> {label}
            </div>
          ))}
          <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 6 }}>Free plan</div>
            <div style={styles.scoreBar}><div style={styles.scoreFill(33, COLORS.accent)} /></div>
            <div style={{ fontSize: 11, color: COLORS.textSecondary, marginTop: 5 }}>1 of 3 scans used</div>
            <button style={{ ...styles.btn("primary"), width: "100%", marginTop: 10, padding: "8px", fontSize: 12 }}>
              Upgrade — $12/mo
            </button>
          </div>
        </div>

        <div style={styles.mainContent}>
          <div style={styles.pageTitle}>{pageTitles[page].title}</div>
          <div style={styles.pageSub}>{pageTitles[page].sub}</div>
          {page === "home" && <Dashboard setPage={setPage} />}
          {page === "resume" && <ResumeScanner />}
          {page === "cover" && <CoverLetter />}
          {page === "tracker" && <JobTracker />}
          {page === "interview" && <InterviewPrep />}
        </div>
      </div>
    </>
  );
}
