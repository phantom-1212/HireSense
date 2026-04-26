# TalentLens — Architecture & Scoring Logic

## System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ ┌───────┐ │
│  │ JD Input │→│ Analysis │→│ Discovery│→│Outreach│→│ Short │ │
│  │  View    │ │  View    │ │  View    │ │  View  │ │ list  │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ └───────┘ │
└────────────────────────┬───────────────────────────────────────┘
                         │
┌────────────────────────▼───────────────────────────────────────┐
│                     PROCESSING PIPELINE                        │
│                                                                │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  JD Parser  │───→│ Match Engine │───→│ Conversation     │  │
│  │             │    │              │    │ Engine           │  │
│  │ • Skills    │    │ • 5-dim score│    │ • Personality AI │  │
│  │ • Experience│    │ • Explainable│    │ • Interest score │  │
│  │ • Education │    │ • Top-N pick │    │ • Signal analysis│  │
│  │ • Domain    │    │              │    │                  │  │
│  └─────────────┘    └──────┬───────┘    └────────┬─────────┘  │
│                            │                      │            │
│                    ┌───────▼──────────────────────▼──────┐     │
│                    │         Ranking Engine              │     │
│                    │  • Dual-score fusion                │     │
│                    │  • Tier classification (A/B/C)      │     │
│                    │  • Recruiter insights               │     │
│                    │  • CSV/JSON export                  │     │
│                    └────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────┘
                         │
┌────────────────────────▼───────────────────────────────────────┐
│                       DATA LAYER                               │
│  ┌──────────────────┐  ┌─────────────────────────────────┐    │
│  │ Skills Taxonomy  │  │ Candidate Database (30 profiles) │    │
│  │ 7 categories     │  │ Skills, experience, personality  │    │
│  │ 100+ skills      │  │ education, salary, availability  │    │
│  └──────────────────┘  └─────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────┘
```

## Match Score — Weighted Multi-Factor (0–100)

### Skills Overlap (40% weight)
- **Exact match**: Candidate skill directly in JD required list → full credit
- **Category proximity**: Candidate has a related skill in the same taxonomy category → 40% credit
- **Preferred bonus**: Up to +15 points for matching "nice to have" skills
- **Formula**: `(exact × 1.0 + related × 0.4) / total_required × 85 + preferred_bonus`

### Experience Level (25% weight)
- **In range**: Candidate years within [min, max] → score 85–100 (peaks at midpoint)
- **Overqualified**: Each year over max → -8 points (floor at 40)
- **Under range**: Each year under min → -15 points (floor at 20)
- **Method**: Gaussian-inspired penalty centered at range midpoint

### Education Match (15% weight)
- **Degree hierarchy**: PhD > M.Tech > M.S. > MBA > B.Tech > B.E. > B.S.
- **Meets/exceeds**: 100 points for degree at or above required level
- **Field matching**: Exact field = 100, related field = 75, unrelated = 50
- **Composite**: 60% degree score + 40% field score

### Domain/Industry (10% weight)
- **Direct match**: Each matching domain → proportional credit up to 80 points
- **Adjacent bonus**: +20 points if candidate has any industry experience
- **Formula**: `(overlap_count / required_count) × 80 + adjacency_bonus`

### Location & Remote (10% weight)
- **Remote alignment**: Same preference = +40, compatible = +15–25
- **City match**: +10 bonus for same city/region
- **Base score**: 50 (neutral)

## Interest Score — Conversational Signal Analysis (0–100)

### Enthusiasm (30% weight)
- Base: Candidate personality `enthusiasm` trait (0–1)
- Boost: +0.10 if match score ≥ 80, +0.05 if ≥ 90
- Randomization: ±0.075 for natural variation
- Maps to one of three response tiers: high/medium/low

### Availability (25% weight)
- Immediate → 95 | Two-week → 80 | One-month → 55 | Passive → 25

### Salary Alignment (20% weight)
- Ratio of candidate midpoint to JD midpoint
- 0.85–1.15 → 90 | 0.70–1.30 → 70 | >1.30 (too expensive) → 35

### Role Perception (15% weight)
- Composite of match quality and enthusiasm
- `min(100, matchScore × 0.6 + enthusiasm × 50)`

### Cultural Fit (10% weight)
- `openness × 50 + directness × 20 + enthusiasm × 30`

## Combined Score & Tier Classification

```
Combined = (matchWeight × matchScore) + (interestWeight × interestScore)
Default weights: 60% match / 40% interest (adjustable via UI)

Tier A: combined ≥ 75  → "Schedule Interview"
Tier B: combined ≥ 55  → "Follow-up Needed"
Tier C: combined < 55  → "Pipeline Reserve"
```
