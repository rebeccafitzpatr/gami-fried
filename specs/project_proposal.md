# Project Proposal: Gami-Fried

> A heavily gamified, cooking-themed flashcard & spaced-repetition app.
> **Tagline:** *Gamifying the learning process — DON'T GET COOKED.*

This proposal breaks the project down through three persona "lenses" — **Senior
Product Manager**, **Senior Software Engineer**, and **Senior Product Designer**
(see `specs/personas/`). Each lens elaborates on its reasoning so the decision
making process is visible, as set out in `specs/log.md`. It builds directly on
`specs/product_discovery.md` and maps the work to the MSA Phase 2 Software Stream
requirements in `specs/assessment_description.md`.

---

## 1. Summary

Gami-Fried turns studying into a cooking game. Each deck of flashcards is a
**recipe**; studying a deck is **cooking**; mastering it is **serving the dish**.
Learners browse a **menu** of decks, **place orders**, study through spaced
repetition, and earn points, badges, and streaks as they progress. The goal is
to improve engagement and long-term retention versus traditional flashcard tools.

**Stack (per assessment):** React + TypeScript frontend, C#/.NET 10+ backend with
EF Core, SQL persistence, Scalar API docs. Both tiers deployed, both unit-tested,
plus **three advanced requirements** (see §5).

---

## 2. The three lenses at a glance

| Lens | Core question it answers | Primary owns |
| --- | --- | --- |
| **Product Manager** | *Are we building the right thing, in the right order, measured the right way?* | Problem, scope, roadmap, metrics, prioritization |
| **Software Engineer** | *Can we build it so it's scalable, maintainable, secure, and testable?* | Architecture, data model, API, testing, CI/CD, security |
| **Product Designer** | *Is it intuitive, accessible, and delightful for learners?* | UX flows, cooking metaphor, design system, accessibility |

Together they ensure quality across **value (PM)**, **build (SWE)**, and
**experience (Design)**.

---

## 3. Product Manager lens — what & why, prioritized

### 3.1 Problem & opportunity
- Learners struggle with engagement and long-term retention in traditional
  flashcard / spaced-repetition tools.
- No cohesive narrative ties study sessions to tangible milestones.
- **Opportunity:** use familiar game-design elements (points, badges, streaks,
  progress) wrapped in a memorable cooking metaphor (decks→recipes,
  sessions→cooking, mastery→serving) to drive engagement and retention.

### 3.2 Objectives (SMART)
- +25% deck-level completion rate within 12 weeks of MVP.
- ≥3 weekly study sessions per active user over 8 weeks.
- 70% mastery on a deck within 2–3 weeks for new users.
- Ship an MVP: SPA frontend + .NET 10/EF Core backend with basic scheduling, a
  README documenting AI usage and deployment.

### 3.3 Success metrics
- **Leading:** sessions/user/week, avg session duration, deck access rate.
- **Trailing:** deck mastery rate, time-to-mastery, 14-day retention, DAU/MAU.
- **Quality:** API error rate, test coverage, accessibility conformance.

### 3.4 Hypotheses
1. Visual mastery indicators on the deck catalog → more sessions started.
2. A pacing mechanic ("doneness" meter) → higher deck completion.
3. Review history + insights → better retention & motivation.
4. Storybook-driven components → ≥20% less design↔dev handoff time.
5. RBAC + basic security → more trust at onboarding.

### 3.5 Backlog breakdown (epics → representative stories)

**Epic A — Deck Catalog ("The Menu")**
- As a learner, I can browse a menu of decks with mastery indicators so I can pick what to study.
- As a learner, I can search/filter decks so I can find relevant topics.
- *Acceptance:* catalog lists decks with title, card count, mastery %; responsive on mobile + desktop.

**Epic B — Study Session ("Cooking")**
- As a learner, I can start a session, see cards one at a time, and grade my recall.
- As a learner, I see a "doneness" meter and timer so I'm paced.
- *Acceptance:* attempts recorded; scheduler updates next-review; session completes & reports results.

**Epic C — Gamification & Rewards**
- As a learner, I earn points/badges and keep a streak so I stay motivated.
- *Acceptance:* events fire on correct/incorrect, mastery, deck_mastered; rewards visible in profile.

**Epic D — Accounts & Profile**
- As a learner, I can register/sign in and view my progress & history.
- *Acceptance:* auth scaffold + RBAC; profile shows mastery, streaks, history.

**Epic E — Authoring (CRUD)**
- As a creator, I can create/edit/delete decks & cards.
- *Acceptance:* full CRUD via API + UI; validation/sanitization on input.

**Epic F — Platform & Submission**
- Deployment (FE + BE), Scalar docs, README sections, `/specs` AI-prompt evidence.

### 3.6 Prioritization (MoSCoW for MVP)
- **Must:** A, B, D (auth scaffold), E (CRUD), F (deploy + Scalar + README).
- **Should:** C (core points/streaks), basic analytics events.
- **Could:** advanced badges, insights dashboard.
- **Won't (MVP):** multiplayer / live study rooms (revisit post-MVP).

> **PM reasoning:** Sequence delivers a usable learning loop (browse → study →
> progress) before layering reward depth. Multiplayer is deferred — high effort,
> not required to validate the core retention hypotheses. Risk: over-gamification
> distracting from learning; mitigate by tying rewards to meaningful milestones.

---

## 4. Software Engineer lens — how we build it

### 4.1 Architecture
- **Frontend:** React + TypeScript SPA, React Router, a state library (Zustand or
  Redux), component library documented in Storybook, theme switching (light/dark).
- **Backend:** ASP.NET Core (.NET 10+) Web API, EF Core, SQL database, layered as
  Controllers → Services → Repositories/EF. Scalar serves API docs (not Swagger).
- **Contracts:** REST endpoints with DTOs; validation at the boundary.

### 4.2 Data model (high level)
`User`, `Deck` (Recipe), `Card`, `Session`, `Attempt`, `Mastery`, `Progress`,
`Badge`. Relationships: a Deck has many Cards; a Session belongs to a User+Deck and
has many Attempts; Mastery/Progress are derived per User+Deck.

### 4.3 API overview
- CRUD: `GET/POST/PUT/DELETE` for `/decks`, `/cards`, `/users`.
- Sessions: `POST /sessions` (start), `GET /sessions/{id}` (status),
  `POST /sessions/{id}/complete`.
- Attempts: `POST /attempts`. Mastery: `GET /mastery` (per deck/user).

### 4.4 Scheduling
Start with a simple **SM2-like** spaced-repetition algorithm; document behavior
clearly so it can be tuned later.

### 4.5 Testing & quality
- Backend unit tests on scheduler, services, and CRUD; frontend component tests.
- Optional Cypress E2E as an advanced requirement.
- CI/CD pipeline; coverage tracked; PR reviews enforce standards.

### 4.6 Security (basic + advanced)
- Password hashing, input validation/sanitization, RBAC authorization; plan for
  anti-CSRF and rate limiting. Document importance + implementation in README.

### 4.7 Observability
- Structured logging and basic metrics; API error-rate monitoring.

> **SWE reasoning:** A layered architecture keeps the scheduler and domain logic
> testable and swappable. SM2-like scheduling first balances delivery speed vs.
> long-term quality — documented so it's safe to evolve. Trade-off: SQL/EF Core
> chosen over NoSQL for relational integrity across Decks/Cards/Sessions/Attempts.
> Key risk: scheduler complexity → mitigate with a simple, well-tested baseline.

---

## 5. Advanced requirements (choose & declare 3)

The assessment marks **only the top 3 advanced features listed in the README**.
Recommended primary three, with rationale:

1. **State management library (Zustand/Redux)** — natural fit for session/streak
   state; low risk, high signal of competence.
2. **Theme switching (light/dark)** — pairs with the design-system work; visible,
   achievable, demoable.
3. **Security measures (≥2 with write-up)** — RBAC + input validation/sanitization
   (or password hashing); directly required write-up in README.

**Strong backups** (swap in if ahead of schedule): Storybook integration,
Dockerize, Cypress E2E, WebSockets (live study rooms), caching/API optimization,
performance tests + logging/metrics.

> Decision will be finalized and **explicitly listed in the README** before
> submission so the markers credit them.

---

## 6. Product Designer lens — the experience

### 6.1 Experience principles
- **Cooking metaphor, consistently applied:** menu (catalog), order (start),
  cooking (session), doneness (pacing), serving (mastery).
- **Progressive mastery is always visible:** progress bars, doneness meter,
  badges.
- **Calm, not noisy:** rewards reinforce meaningful milestones, not every tap.

### 6.2 Key flows
1. **Browse the menu** → see decks with mastery indicators.
2. **Place an order** → start a session, see card + doneness meter + timer.
3. **Cook** → grade recall; immediate, friendly feedback.
4. **Serve the dish** → mastery reached; reward + history updated.

### 6.3 Design system
- Tokens (color, type, spacing), reusable components in **Storybook**, theme
  switching (light/dark), responsive layouts for mobile + desktop.

### 6.4 Accessibility
- Semantic HTML, keyboard navigation, sufficient contrast (both themes),
  ARIA where needed; validate usability each release.

### 6.5 Research & validation
- Usability tests with 5–8 participants; A/B test deck layout vs. doneness
  indicators; measure time-to-master before/after.

> **Design reasoning:** A single coherent metaphor lowers cognitive load and makes
> progress legible, supporting the retention objective. Storybook + tokens reduce
> design↔dev handoff (hypothesis #4). Trade-off: the playful theme must never
> compromise contrast/accessibility — both themes are validated.

---

## 7. Roadmap (12–14 weeks)

| Weeks | Focus | Lenses leading |
| --- | --- | --- |
| 1–2 | Data models, API contracts, repo structure; Storybook + skeleton FE | SWE + Design |
| 3–4 | Core backend (Decks/Cards/Users/Sessions/Attempts) + SM2 scheduler; basic FE views | SWE + PM |
| 5–6 | UI components, theming, basic tests; begin README + AI-usage notes | Design + SWE |
| 7–8 | Advanced features (state lib, theming, RBAC, security write-up; optional Storybook/Cypress/Docker) | All |
| 9–10 | Optional WebSockets live rooms; analytics/events | SWE + PM |
| 11–12 | E2E validation, performance, deploy scripts, finalize README for submission | All |

---

## 8. Risks & mitigations

| Risk | Lens | Mitigation |
| --- | --- | --- |
| Scheduler complexity | SWE | Start simple (SM2-like), document, test |
| Over-gamification distracts | Design/PM | Tie rewards to meaningful milestones |
| Scope creep | PM | Strict MVP scope, milestone gating, MoSCoW |
| Accessibility regressions in themes | Design | Validate contrast/keyboard each release |
| Missing advanced-feature credit | PM | List exactly 3 advanced features in README |

---

## 9. Definition of Done (MVP)

- Working SPA + .NET 10/EF Core backend deployed; Scalar API docs exposed.
- Core loop: browse → study (SM2) → progress/mastery; CRUD for decks/cards.
- Auth scaffold + RBAC; ≥2 security measures with README write-up.
- Backend + frontend unit tests; CI green.
- README with deployment link, theme/feature explanation, **3 advanced features
  listed**, AI-usage narrative, and self-reflection.
- `/specs` contains planning, design, and AI prompt evidence (`.md`).

---

## 10. AI usage (per assessment)
AI is used for research, planning, prompt generation, and documentation. Prompts
and rationale are stored as `.md` files in `specs/`. AI-generated outputs are
critically reviewed; in-product AI explanations (why a card is shown next) avoid
exposing private chain-of-thought.
