# Gami-Fried MVP — User Flow → Features → Epics (Revised MVP)

> Defines the MVP user experience as an end-to-end flow, then maps each step to features, groups them into feature groups, and ties them back to user stories / epics. The cooking metaphor remains central: decks are recipes, the catalog is the menu, starting a session is placing an order, and serving a dish is mastering a deck.

## 1. MVP scope (what's in)

In the revised MVP, the user journey centers on personalized AI-generated content and a day-based study loop that simulates a small shop/day:

- User authentication: sign in / sign up
- Topic input: user enters a subject/topic they want to learn
- AI deck generation: an AI API creates 4–5 flashcard decks (each deck is a recipe) related to the topic
- Game load: on load, the UI presents 2–3 available decks (the current menu)
- Shop & session: user opens the shop to start a study session; this represents taking an order
- Customer orders: customers arrive with orders that specify a range of decks to study (combinations of decks to go through)
- Study loop: for each order, the user repeatedly studies through the specified decks using flashcards; progress is tracked with a SM2-like scheduler, a doneness indicator, and a timer
- Day summary: after 2–3 customers, the shop closes for the day and a summary of results is shown (points, streaks, mastery, deck-level progress)
- Next day: user can move on to the next day and repeat the flow
- Post-MVP: potential for progressively increasing difficulty and introducing more features

In scope, not in MVP: multiplayer/live rooms, advanced analytics dashboards, social features, and deeper AI-content curation beyond initial topic-based deck generation.

## 2. The MVP user flow (end-to-end experience)

New learner's day in a nutshell:

```
(1) Sign in / sign up
(2) Enter topic to learn
(3) AI generates 4–5 decks for the topic
(4) Game loads; 2–3 decks appear on the menu
(5) Open shop and start a study session (place an order)
(6) For each order: work through the selected decks (cards) – reveal, recall, rate (again/good/easy) – scheduler selects next card; doneness + timer update
(7) End of day: session summary (points, streak, accuracy, decks mastered)
(8) Option to advance to the next day and repeat
```

## 3. Flow step → feature → feature group → epic

| # | User flow step | Feature(s) | Feature group | Epic |
|---|---|---|---|---|
| 1 | Sign in / sign up | Auth scaffold, password hashing, validation | Identity & Access | Epic D — Accounts & Onboarding |
| 2 | Enter topic | Topic input, AI deck generation trigger | AI Content Generation | Epic G — AI Deck Generator |
| 3 | AI creates decks | AI-generated 4–5 decks loaded | AI Content Generation | Epic G — AI Deck Generator |
| 4 | Game loads; show 2–3 decks | Deck catalog with previews and mastery indicators | Discovery ("The Menu") | Epic A — Deck Catalog |
| 5 | Open shop and start a study session | Session start, order management, session state | Study Loop ("Cooking") | Epic B — Study Session |
| 6 | Customer orders arrive | Order queue, deck selection by order, batch loading | Orders & Orchestration | Epic C — Customer Orders |
| 7 | Study through each order | Recurrent study loop across decks per order; SM2-like scheduling, doneness, timer | Study Loop ("Cooking") | Epic B — Study Session |
| 8 | Day summary | Day end summary, analytics, reward tallies | Day-End & Rewards | Epic D — Day Summary & Rewards |
| 9 | Next day | Day progression, daily reset, new AI-generated decks (optional) | Day Progression | Epic F — Day Progression |
| - | (cross-cutting) | Deploy FE+BE, RBAC, state mgmt, README/specs | Platform & Submission | Epic G — Platform & Submission |

## 4. Feature groups (grouped view)

### FG1 — Onboarding & Shell *(Epic D)*
App shell, responsive layout, theme switching, landing page + CTA. First impression and navigation backbone.

### FG2 — Identity & Access *(Epic D)*
Registration, login, auth scaffold, RBAC, password hashing, input validation. Establishes trust and gates personalized data.

### FG3 — Discovery / "The Menu" *(Epic A)*
Deck catalog, mastery indicators, search/filter, deck detail. How learners find and choose what to study.

### FG4 — Study Loop / "Cooking" *(Epic B)*
Session lifecycle (start → review → complete), card presentation & grading, SM2-like scheduler, doneness meter, timer, attempt recording, summary. The core learning loop and primary value.

### FG5 — Progress & Rewards *(Epic C)*
Points, streaks, mastery calculation + threshold, mastery rewards/badges, profile, history. Drives engagement and retention.

### FG6 — Authoring / CRUD *(Epic E)*
Create/edit/delete decks and cards with validation. Satisfies the CRUD requirement and lets users grow content.

### FG7 — Platform & Submission *(Epic F)*
Deployment (FE + BE), Scalar API docs, the 3 declared advanced features, README sections, `/specs` AI evidence. Required to ship and be marked.

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
- **B5** As a learner, I can advance to the next day so I can continue my learning journey.
  - *AC:* state resets for a new day, new deck orders are prepared.

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

### Epic G — AI Deck Generator — *FG2, FG3*
- **G1** As a learner, I can enter a topic so I can receive relevant study material.
  - *AC:* topic input field accepts text; triggers AI deck generation.
- **G2** As a learner, I receive 4–5 AI-generated decks based on my topic so I have options to study.
  - *AC:* decks are created via AI API; each deck contains a set of flashcards.

## 6. MVP traceability summary

| Epic | Feature group(s) | Flow steps covered |
| --- | --- | --- |
| A — Deck Catalog | FG3 | 4 |
| B — Study Session | FG4 | 5, 6, 7, 8 |
| C — Gamification & Rewards | FG5 | 7 |
| D — Accounts & Onboarding | FG1, FG2 | 1 |
| E — Authoring (CRUD) | FG6 | 10 |
| F — Platform & Submission | FG7 | cross-cutting |
| G — AI Deck Generator | FG2, FG3 | 2, 3 |

> **Definition of Done (MVP):** a new learner can sign up, enter a topic, receive AI-generated decks, run a study session with spaced repetition + doneness feedback, earn points/streaks, master a deck, and view history — on a deployed FE+BE with Scalar docs, RBAC, ≥2 security measures, unit tests, and a complete README + `/specs` evidence.
