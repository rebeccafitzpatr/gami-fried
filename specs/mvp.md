# Gami-Fried MVP — User Flow → Features → Epics

> Defines the **MVP user experience** as an end-to-end user flow, then maps each
> step to **features**, groups those into **feature groups**, and ties them back
> to **user stories / epics**.
>
> Builds on `specs/product_discovery.md` and `specs/project_proposal.md`, scoped
> to the **Must / Should** items from the MVP MoSCoW. The cooking metaphor runs
> throughout: decks = **recipes**, the catalog = **the menu**, starting a session
> = **placing an order**, studying = **cooking**, mastering a deck = **serving the
> dish**.

---

## 1. MVP scope (what's in)

**In:** account creation/sign-in, browse the menu (deck catalog), start & run a
study session (cooking) with spaced-repetition grading, doneness/progress
feedback, core rewards (points, streaks, mastery), profile/history, and authoring
(CRUD) of decks & cards.

**Out (post-MVP):** multiplayer / live study rooms, advanced badge trees,
insights/analytics dashboards, social features.

---

## 2. The MVP user flow (what the user experiences)

A new learner's golden path, end to end:

```
 (1) Land            → see value prop + "Get cooking" call to action
   │
 (2) Sign up / in    → create account or log in
   │
 (3) Browse the menu → deck catalog with mastery indicators; search/filter
   │
 (4) Open a recipe   → deck detail: description, card count, current mastery
   │
 (5) Place an order  → start a study session
   │
 (6) Cook            → see one card, reveal answer, grade recall (e.g. again/good/easy)
   │      ▲
   │      └─ repeat: scheduler picks next card; doneness meter + timer update
   │
 (7) Plate up        → session summary: cards reviewed, accuracy, points earned, streak
   │
 (8) Serve the dish  → if deck mastery threshold reached → mastery reward
   │
 (9) Profile/history → view points, streak, mastery per deck, past sessions
   │
(10) Author (opt.)   → create/edit/delete own decks & cards
```

Each numbered step is mapped below.

---

## 3. Flow step → feature → feature group → epic

| # | User flow step | Feature(s) | Feature group | Epic |
| --- | --- | --- | --- | --- |
| 1 | Land on home / value prop | Landing page, "Get cooking" CTA, responsive shell, theme (light/dark) | Onboarding & Shell | **Epic D — Accounts & Onboarding** |
| 2 | Sign up / sign in | Registration, login, session/auth scaffold, password hashing, validation | Identity & Access | **Epic D — Accounts & Onboarding** |
| 3 | Browse the menu | Deck catalog, mastery indicators, search/filter, responsive cards | Discovery ("The Menu") | **Epic A — Deck Catalog** |
| 4 | Open a recipe | Deck detail view, card count, mastery %, start button | Discovery ("The Menu") | **Epic A — Deck Catalog** |
| 5 | Place an order | Start session, session state init | Study Loop ("Cooking") | **Epic B — Study Session** |
| 6 | Cook (review cards) | Card presentation, reveal, recall grading, SM2-like scheduler, doneness meter, timer, attempt recording | Study Loop ("Cooking") | **Epic B — Study Session** |
| 7 | Plate up (summary) | Session summary, accuracy, points earned, streak update | Study Loop + Rewards | **Epic B** + **Epic C — Gamification** |
| 8 | Serve the dish (mastery) | Mastery calculation, mastery threshold, mastery reward/badge | Progress & Rewards | **Epic C — Gamification & Rewards** |
| 9 | Profile & history | Profile, points/streak display, per-deck mastery, session history | Progress & Rewards | **Epic C** + **Epic D** |
| 10 | Author decks/cards | Create/read/update/delete decks & cards, input validation/sanitization | Authoring (CRUD) | **Epic E — Authoring** |
| — | (cross-cutting) | Deploy FE+BE, Scalar API docs, RBAC, state management, README/specs | Platform & Submission | **Epic F — Platform** |

---

## 4. Feature groups (grouped view)

### FG1 — Onboarding & Shell *(Epic D)*
App shell, responsive layout, theme switching, landing page + CTA. First
impression and navigation backbone.

### FG2 — Identity & Access *(Epic D)*
Registration, login, auth scaffold, RBAC, password hashing, input validation.
Establishes trust and gates personalized data.

### FG3 — Discovery / "The Menu" *(Epic A)*
Deck catalog, mastery indicators, search/filter, deck detail. How learners find
and choose what to study.

### FG4 — Study Loop / "Cooking" *(Epic B)*
Session lifecycle (start → review → complete), card presentation & grading,
SM2-like scheduler, doneness meter, timer, attempt recording, summary. The core
learning loop and primary value.

### FG5 — Progress & Rewards *(Epic C)*
Points, streaks, mastery calculation + threshold, mastery rewards/badges,
profile, history. Drives engagement and retention.

### FG6 — Authoring / CRUD *(Epic E)*
Create/edit/delete decks and cards with validation. Satisfies the CRUD
requirement and lets users grow content.

### FG7 — Platform & Submission *(Epic F)*
Deployment (FE + BE), Scalar API docs, the 3 declared advanced features, README
sections, `/specs` AI evidence. Required to ship and be marked.

---

## 5. Epics & user stories (MVP)

### Epic A — Deck Catalog ("The Menu") — *FG3*
- **A1** As a learner, I can browse a menu of decks with mastery indicators so I can choose what to study.
  - *AC:* catalog lists decks with title, card count, mastery %; responsive on mobile + desktop.
- **A2** As a learner, I can search/filter decks so I can find relevant topics.
  - *AC:* filtering by text returns matching decks; empty state handled.
- **A3** As a learner, I can open a deck's detail so I can see what's inside before starting.
  - *AC:* detail shows description, card count, mastery %, and a start action.

### Epic B — Study Session ("Cooking") — *FG4*
- **B1** As a learner, I can start a session so I can begin studying a deck.
  - *AC:* `POST /sessions` creates a session bound to user+deck; first card shown.
- **B2** As a learner, I can view a card, reveal the answer, and grade my recall so the schedule adapts.
  - *AC:* grade recorded as an Attempt; SM2-like scheduler picks the next card.
- **B3** As a learner, I can see a doneness meter and timer so I'm paced.
  - *AC:* meter reflects progress through due cards; timer visible during session.
- **B4** As a learner, I get a session summary so I can see how I did.
  - *AC:* `POST /sessions/{id}/complete` returns cards reviewed, accuracy, points, streak.

### Epic C — Gamification & Rewards — *FG5*
- **C1** As a learner, I earn points for studying so I feel rewarded.
  - *AC:* points awarded per correct grade; reflected in summary + profile.
- **C2** As a learner, I keep a streak so I'm motivated to return.
  - *AC:* streak increments on qualifying daily activity; visible on profile.
- **C3** As a learner, I "serve the dish" when I master a deck so I hit a milestone.
  - *AC:* mastery threshold triggers a reward/badge; `deck_mastered` event fires.
- **C4** As a learner, I can view my profile, progress, and history so I can track growth.
  - *AC:* profile shows points, streak, per-deck mastery, and past sessions.

### Epic D — Accounts & Onboarding — *FG1, FG2*
- **D1** As a visitor, I can register and sign in so my progress is saved.
  - *AC:* secure auth scaffold; password hashing; validation on inputs.
- **D2** As a user, my access is role-appropriate (RBAC) so data is protected.
  - *AC:* protected endpoints enforce authorization.
- **D3** As a user, I can switch light/dark theme so the app suits my context.
  - *AC:* theme persists; both themes meet contrast/accessibility.

### Epic E — Authoring (CRUD) — *FG6*
- **E1** As a creator, I can create, edit, and delete decks so I can manage content.
- **E2** As a creator, I can create, edit, and delete cards within a deck.
  - *AC:* full CRUD via API + UI; input validated/sanitized; ownership enforced.

### Epic F — Platform & Submission — *FG7*
- **F1** As the team, FE and BE are deployed so the app is publicly usable.
- **F2** As a developer, Scalar API docs are exposed so the API is discoverable.
- **F3** As markers, the README lists exactly 3 advanced features so they're credited.
  - *AC:* README has deployment link, theme/feature explanation, 3 advanced features, AI-usage narrative, self-reflection; `/specs` holds AI prompt evidence.

---

## 6. MVP traceability summary

| Epic | Feature group(s) | Flow steps covered |
| --- | --- | --- |
| A — Deck Catalog | FG3 | 3, 4 |
| B — Study Session | FG4 | 5, 6, 7 |
| C — Gamification & Rewards | FG5 | 7, 8, 9 |
| D — Accounts & Onboarding | FG1, FG2 | 1, 2, 9 |
| E — Authoring (CRUD) | FG6 | 10 |
| F — Platform & Submission | FG7 | cross-cutting |

> **Definition of Done (MVP):** a new learner can sign up, browse the menu, run a
> study session with spaced repetition + doneness feedback, earn points/streaks,
> master a deck, and view history — on a deployed FE+BE with Scalar docs, RBAC,
> ≥2 security measures, unit tests, and a complete README + `/specs` evidence.
