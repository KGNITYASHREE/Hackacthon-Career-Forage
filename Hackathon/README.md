# ⚡ InterviewIQ — Interview Readiness Score

> Gauge your interview readiness in under 2 minutes with AI-powered personalized feedback.

---

## 🚀 What It Does

InterviewIQ evaluates students across **4 key dimensions** of interview preparedness and generates a **0–100 readiness score** with a personalized action plan in under 2 minutes.

| Dimension | Weight |-What it measures |
|---|---|---|
| 💻 Technical Skills | 35% | DSA, system design, coding practice |
| 🗣️ Communication | 25% | Mock interview experience, behavioral prep |
| 📄 Resume | 20% | Tailoring, quantified achievements |
| 🗂️ Portfolio | 20% | Projects, GitHub, LinkedIn presence |

---

## 🎯 Features

- **10 smart questions** across 4 dimensions — completed in < 2 minutes
- **Role targeting** — 8 roles (SWE, Data Science, Product, Frontend, etc.)
- **Resume upload** — AI reads your resume and personalizes feedback
- **Live countdown timer** + step progress dots
- **Readiness levels**: Just Starting 🌱 → Building Up 📈 → Almost There 💪 → Interview Ready 🚀
- **Animated results dashboard** with dimension breakdown bars
- **Peer benchmarking** — see how you rank vs. previous candidates (localStorage)
- **Share your score** — one-click copy to clipboard
- **Offline fallback** — works without an API key (smart local scoring)


## 🛠️ Running Locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── LandingScreen.jsx     # Role picker + resume upload
│   ├── AssessmentScreen.jsx  # 10 questions + countdown timer
│   ├── ResultsScreen.jsx     # Score dashboard + action plan
│   └── LoadingScreen.jsx     # AI analysis animation
├── data/
│   └── questions.js          # 10 questions, role variants, DIMENSIONS config
├── services/
│   └── aiService.js          # Scoring engine
├── App.jsx                   # Screen state machine
├── main.jsx                  # Entry point
└── index.css                 # Design system (glassmorphism, animations)
```

---

## 🤖 How AI Works

1. **Local scoring** — instant math-based scoring from answers (no API needed)
2. ** prompt** — scores + Q&A + resume text sent to 
3. **Personalized output** — AI returns `summary`, `strengths[]`, and `actionPlan[]` as JSON
4. **Fallback** — if no API key or network error, a smart rule-based action plan is shown

---

## 🏆Deliverables

- ✅ **Working Prototype** — functional MVP, < 2 min assessment
- ✅ **Readiness Metric** — 0–100 score + 4 readiness levels
- ✅ **Actionable Feedback** — High/Medium/Low priority action items with time estimates
- ✅ **User-Friendly Interface** — glassmorphism UI, animations, mobile-friendly
