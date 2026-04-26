# 🔍 HireSense — AI-Powered Talent Scouting & Engagement Agent

> An intelligent, end-to-end talent discovery platform that parses job descriptions, discovers matching candidates from a simulated talent pool, engages them through AI-driven conversational outreach, and produces a dual-scored ranked shortlist that recruiters can act on immediately.

---

## 📌 Project Overview

**Problem:** Recruiters spend hours manually sifting through candidate profiles, trying to gauge both technical fit and genuine interest. There's no unified system that handles discovery, evaluation, and engagement in one flow.

**Solution:** HireSense is an AI agent that automates the entire scouting pipeline:

1. **Parses** a raw Job Description into structured requirements
2. **Discovers** the best-matching candidates from a talent pool using multi-factor scoring
3. **Engages** each candidate through simulated conversational outreach
4. **Ranks** candidates on two dimensions — **Match Score** and **Interest Score**
5. **Exports** the final shortlist as JSON/CSV for immediate recruiter action

**Key Differentiator:** Every score comes with full explainability — recruiters see *why* a candidate scored the way they did across 5 match dimensions and 5 interest signals.

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Structure** | HTML5 | Semantic, accessible single-page application |
| **Styling** | Vanilla CSS | Custom "Aurora Dark" design system — no frameworks, full control |
| **Logic** | Vanilla JavaScript (ES Modules) | Zero dependencies, runs anywhere, no build step |
| **Typography** | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) + [Inter](https://fonts.google.com/specimen/Inter) | Display + body font pairing via Google Fonts |
| **Visualization** | Canvas API + SVG | Custom radar charts, donut gauges, score visualizations |
| **Avatars** | [DiceBear API](https://www.dicebear.com/) | Programmatic avatar generation (Notionists style) |
| **Dev Server** | `npx serve` | Zero-install static file server for local development |
| **Deployment** | Any static host | GitHub Pages, Netlify, Vercel, or just open `index.html` |

### What's NOT Used (and why)
- **No React/Vue/Angular** — The app is lightweight enough that a framework adds unnecessary complexity
- **No Tailwind** — Custom CSS gives full design control for the premium aesthetic
- **No Node.js backend** — Everything runs client-side; no API keys or server needed
- **No database** — Candidate data is embedded (simulated talent pool of 30 profiles)
- **No external AI APIs** — All intelligence is algorithmic (keyword matching, weighted scoring, template-based conversation generation)

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE (SPA)                        │
│                                                                      │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌────────┐ │
│   │ 1. Input │─▶│ 2. Parse │─▶│3. Match  │─▶│4. Chat │─▶│5. Rank │ │
│   │   View   │  │   View   │  │  View    │  │  View  │  │  View  │ │
│   └──────────┘  └──────────┘  └──────────┘  └────────┘  └────────┘ │
└───────────┬──────────┬──────────┬──────────────┬──────────┬─────────┘
            │          │          │              │          │
            ▼          ▼          ▼              ▼          ▼
┌───────────────────────────────────────────────────────────────────────┐
│                        PROCESSING ENGINES                            │
│                                                                       │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  ┌────────┐ │
│  │  JD Parser  │  │ Match Engine │  │  Conversation   │  │Ranking │ │
│  │             │  │              │  │  Engine          │  │Engine  │ │
│  │ • NLP-based │  │ • 5-dim      │  │ • Personality-  │  │        │ │
│  │   keyword   │  │   weighted   │  │   driven chat   │  │ • Dual │ │
│  │   extraction│  │   scoring    │  │   simulation    │  │   score│ │
│  │ • Pattern   │  │ • Explainable│  │ • 5-signal      │  │   fuse │ │
│  │   matching  │  │   breakdowns │  │   interest      │  │ • Tier │ │
│  │ • Taxonomy  │  │ • Top-N      │  │   analysis      │  │   A/B/C│ │
│  │   lookup    │  │   selection  │  │ • 3 enthusiasm  │  │ • JSON │ │
│  │             │  │              │  │   tiers         │  │   /CSV │ │
│  └─────────────┘  └──────────────┘  └─────────────────┘  └────────┘ │
│                          │                                            │
│              ┌───────────▼────────────┐                               │
│              │      DATA LAYER        │                               │
│              │                        │                               │
│              │ • 30 candidate profiles│                               │
│              │ • 7-category skills    │                               │
│              │   taxonomy (100+ skills│                               │
│              │ • 5 sample JDs         │                               │
│              └────────────────────────┘                               │
└───────────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Pipeline Stages (Detailed)

### Stage 1: JD Parsing (`jdParser.js`)

Takes raw job description text and extracts structured data:

| Field Extracted | Method | Example Output |
|----------------|--------|----------------|
| Job Title | Regex pattern matching + first-line fallback | "Senior Frontend Engineer" |
| Required Skills | Taxonomy keyword scan against 100+ skills | `["React", "TypeScript", "Next.js"]` |
| Preferred Skills | Section-aware extraction (after "nice to have") | `["Figma", "Storybook"]` |
| Experience Range | Multiple regex patterns (`5+ years`, `3-6 yrs`) | `{ min: 5, max: 8 }` |
| Education | Degree keyword hierarchy + field detection | `{ degree: "B.Tech", field: "CS" }` |
| Domain/Industry | 16-domain keyword dictionary | `["Fintech", "SaaS"]` |
| Location | City name detection + remote preference | `"Bangalore"`, `"hybrid"` |
| Salary Range | INR LPA and USD pattern matching | `{ min: 30, max: 45 }` |
| Seniority Level | Keyword classification | `"senior"` |

### Stage 2: Candidate Discovery & Matching (`matchEngine.js`)

Scores each of 30 candidates against the parsed JD using 5 weighted dimensions:

| Dimension | Weight | Scoring Method |
|-----------|--------|---------------|
| **Skills Overlap** | 40% | Exact match (1.0×) + same-category proximity (0.4×) via skills taxonomy. Preferred skills add up to +15 bonus. Formula: `(exact + related×0.4) / total × 85 + preferredBonus` |
| **Experience** | 25% | Gaussian-inspired scoring centered at the JD's required range midpoint. In-range: 85–100. Overqualified: -8/year over max. Under-qualified: -15/year under min. |
| **Education** | 15% | Degree hierarchy comparison (PhD > M.Tech > M.S. > B.Tech > etc.) weighted 60% + field relatedness weighted 40%. |
| **Domain** | 10% | Direct industry overlap (proportional credit) + adjacency bonus (+20 for any related domain). |
| **Location** | 10% | Remote preference alignment (same=+40, compatible=+25) + city match bonus (+10). |

**Output:** Top 10 candidates sorted by weighted match score, each with per-dimension breakdown and human-readable explanation.

### Stage 3: Conversational Outreach (`conversationEngine.js`)

Simulates a 10-message multi-turn recruiter↔candidate chat:

- **Personality-driven responses:** Each candidate has `enthusiasm`, `openness`, and `directness` traits (0–1)
- **3 response tiers:** High enthusiasm (>0.7), Medium (0.4–0.7), Low (<0.4)
- **Conversation flow:** Greeting → Role description → Interest check → Availability → Salary → Closing
- **Dynamic variables:** Candidate name, company, skills, salary range, timeline are injected into templates

**Interest Score** is computed from 5 signals:

| Signal | Weight | How It's Derived |
|--------|--------|-----------------|
| **Enthusiasm** | 30% | Personality trait + match quality boost + random variation |
| **Availability** | 25% | Immediate=95, Two-week=80, One-month=55, Passive=25 |
| **Salary Alignment** | 20% | Candidate vs JD salary range overlap ratio |
| **Role Perception** | 15% | Composite of match score × enthusiasm |
| **Cultural Fit** | 10% | Openness×50 + directness×20 + enthusiasm×30 |

### Stage 4: Ranking & Export (`rankingEngine.js`)

Fuses both scores into a final ranked shortlist:

```
Combined Score = (matchWeight × Match Score) + (interestWeight × Interest Score)
Default: 60% Match / 40% Interest (adjustable via UI sliders)
```

| Tier | Threshold | Recommended Action |
|------|-----------|-------------------|
| **A** | Combined ≥ 75 | Schedule Interview |
| **B** | Combined ≥ 55 | Follow-up Needed |
| **C** | Combined < 55 | Pipeline Reserve |

Each candidate gets a generated recruiter insight paragraph explaining why they were ranked where they are.

**Export formats:** JSON (full data) and CSV (flat table).

---

## 📂 File Structure

```
HireSense/                         Total: ~170KB, 16 files, 0 dependencies
│
├── index.html                      Main SPA — 5 views, stepper nav, modal
│
├── css/
│   ├── design-system.css           Color palette, typography, aurora bg, dot grid
│   ├── components.css              Cards, buttons, badges, chat, gauges, modal
│   ├── pages.css                   Per-view layouts, orbital hero, responsive
│   └── animations.css              Hero reveal, stagger, shimmer, pulse, scan
│
├── js/
│   ├── app.js                      SPA router, state management, view rendering
│   ├── jdParser.js                 JD text → structured requirements + 5 sample JDs
│   ├── candidateDB.js              30 realistic profiles + 7-category skills taxonomy
│   ├── matchEngine.js              5-dimension weighted scoring with explainability
│   ├── conversationEngine.js       Multi-turn chat simulation + interest scoring
│   ├── rankingEngine.js            Dual-score fusion, tiers, insights, export
│   ├── charts.js                   Canvas radar charts, SVG donut gauges
│   └── utils.js                    DOM helpers, score colors, avatars, export, toast
│
├── docs/
│   ├── architecture.md             System design diagrams + scoring formulas
│   └── sample-io.md               Sample JD → parsed → matched → ranked walkthrough
│
└── README.md                       This file
```

---

## 🚀 Setup & Running

### Prerequisites
- A modern web browser (Chrome, Edge, Firefox, Safari)
- Node.js (optional, only for the dev server)

### Option 1: Local Dev Server (Recommended)
```bash
cd HireSense
npx -y serve .
```
Open **http://localhost:3000**

### Option 2: VS Code Live Server
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Right-click `index.html` → "Open with Live Server"

### Option 3: Direct (limited)
Open `index.html` directly in browser. Note: ES modules require HTTP, so some browsers may block local file:// loading.

> **No API keys. No npm install. No build step. No backend.**

---

## 🎨 Design System — "Aurora Dark"

| Token | Value | Purpose |
|-------|-------|---------|
| `--iris` | `#5B5FEF` | Primary actions, active states |
| `--electric` | `#00D4FF` | Accent highlights, links |
| `--mint` | `#00E6A7` | Success, high scores, Tier A |
| `--amber` | `#FFB347` | Warnings, mid scores, Tier B |
| `--coral` | `#FF6B6B` | Errors, low scores, Tier C |
| `--rose` | `#FF79C6` | Decorative accent |
| `--bg-void` | `#07080E` | Deepest background |
| `--bg-raised` | `#12131C` | Card surfaces |

**Visual Signatures:**
- Aurora gradient ambient background with slow hue-shift animation
- Dot-grid overlay (32px spacing, 3% opacity)
- Animated gradient borders on cards (iris → electric → mint on hover)
- Shimmer sweep effect on primary buttons
- Orbital ring decoration on hero section
- Space Grotesk display font for headings, Inter for body
- Blur-enhanced page transitions

---

## 📊 Data Model

### Candidate Profile Schema
```javascript
{
  id: Number,
  name: String,
  currentRole: String,
  company: String,
  skills: String[],              // From taxonomy
  experience: Number,            // Years
  education: {
    degree: String,              // "B.Tech", "M.S.", "Ph.D.", etc.
    field: String,               // "Computer Science", "AI & ML", etc.
    institution: String
  },
  domains: String[],             // ["Fintech", "SaaS"]
  location: String,              // "Bangalore", "Remote"
  remote: String,                // "remote" | "hybrid" | "onsite"
  salaryRange: [Number, Number], // [min, max] in LPA
  personality: {
    enthusiasm: Number,          // 0–1
    openness: Number,            // 0–1
    directness: Number           // 0–1
  },
  availability: String,          // "immediate" | "two-week" | "one-month" | "passive"
  bio: String                    // One-liner professional summary
}
```

### Skills Taxonomy (7 categories, 100+ skills)
- **Frontend:** React, Vue.js, Angular, Svelte, Next.js, TypeScript, etc.
- **Backend:** Node.js, Python, Java, Go, Rust, Django, Spring Boot, etc.
- **Data:** SQL, PostgreSQL, MongoDB, Kafka, Spark, Snowflake, dbt, etc.
- **ML/AI:** PyTorch, TensorFlow, NLP, LLMs, RAG, Hugging Face, etc.
- **DevOps:** AWS, Azure, GCP, Docker, Kubernetes, Terraform, CI/CD, etc.
- **Mobile:** React Native, Flutter, Swift, Kotlin, iOS, Android, etc.
- **Soft Skills:** Leadership, Communication, Agile, Mentoring, System Design, etc.

---

## 🎯 Usage Walkthrough

1. **Paste a JD** → Enter any job description text, or click a sample JD chip (5 pre-built samples: React Dev, ML Engineer, DevOps, Full Stack, Data Engineer)
2. **Review Analysis** → See extracted skills (color-coded required vs preferred), experience range, education, domain, location, salary
3. **Discover Candidates** → Watch as the top 10 matching candidates appear with animated cards showing match scores and per-dimension breakdowns
4. **Watch Outreach** → Click each candidate to see their simulated conversation with typing indicators and interest signal analysis
5. **View Shortlist** → Final ranked table with tier badges (A/B/C), adjustable weight sliders, and one-click JSON/CSV export. Click any row for a detailed modal with radar chart.

---

## 📸 Sample Input/Output

**Input:** "Senior Frontend Engineer, React, TypeScript, 5+ years, Fintech, Bangalore, 30-45 LPA"

**Output (Top 3):**

| # | Tier | Candidate | Match | Interest | Combined | Action |
|---|------|-----------|-------|----------|----------|--------|
| 1 | A | Aarav Mehta (Razorpay) | 87 | 81 | 85 | Schedule Interview |
| 2 | A | Divya Krishnan (Notion) | 78 | 68 | 74 | Schedule Interview |
| 3 | B | Riya Banerjee (Figma) | 72 | 82 | 76 | Follow-up Needed |

See [docs/sample-io.md](docs/sample-io.md) for full walkthrough with conversation transcripts.

---

## 📄 License

MIT License — Free to use, modify, and distribute.

---

<p align="center">
  Built with ❤️ by Ronit Das
</p>
