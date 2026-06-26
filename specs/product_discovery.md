# Product Discovery: Gami-Fried Core (Phase 1) — Actionable Plan

## Vision
A heavily gamified flashcard, spaced repetition assistant where each concept/deck is a recipe. Users can browse a menu of decks (recipes), place orders, and study through the topics to "serve" complete dishes, i.e., master decks and earn rewards. The UI emphasizes a cooking motif and progressive mastery.

## Problem statement
- Learners struggle with engagement and long-term retention in traditional flashcard/spaced-repetition tools.
- There is no cohesive, gamified flow that maps study sessions to tangible milestones (serving a dish) within a cooking-themed narrative.
- Teams need a design-system-driven UI, analytics, and scalable backend for decks, cards, sessions, and progress.

## Objectives (SMART)
- Increase deck-level completion rate by 25% within 12 weeks of MVP release.
- Achieve at least 3x weekly study sessions per active user over 8 weeks.
- Attain 70% mastery On Deck within 2–3 weeks of starting a deck for new users.
- Deliver an MVP with working SPA frontend, .NET 10+ backend with EF Core, and basic scheduling, plus a readme documenting AI usage and deployment.

## Stakeholders
- Product Manager (PM)
- Engineering Lead / Senior Engineers
- Design Lead / Senior Product Designer
- QA / Test Engineers
- DevOps / Platform
- Data & Analytics
- End users (learners)

## Personas (references)
- Senior Software Engineer: `/specs/personas/senior-software-engineer.md`
- Senior Product Designer: `/specs/personas/senior-product-design.md`
- Senior Product Manager: `/specs/personas/senior-product-manager.md`

## Opportunity framing
- Leverage familiar game design elements (points, badges, streaks, progress bars) to drive engagement.
- Use the cooking metaphor to provide a memorable narrative and progression path (decks as recipes, sessions as cooking, serving as mastery).
- Build a scalable data model (Decks, Cards, Sessions, Attempts, Mastery) that supports future features (multiplayer, AI hints, Storybook components).

## Success metrics (leading/trailing)
- Leading: sessions per user per week, average session duration, deck access rate.
- Trailing: deck mastery rate, time to mastery, retention over 14 days, number of daily active users.
- Quality: API error rate, test coverage, and UI accessibility conformance.

## Hypotheses
1) If we present a clear deck catalog with visual mastery indicators, users will start more study sessions. 
2) A pacing mechanic (doneness meter) with prompts will increase deck completion rate. 
3) Providing a review history and insights will improve retention and motivation. 
4) Storybook-driven UI components will reduce design-developer handoff time by at least 20%. 
5) RBAC and basic security measures will reduce risk and improve trust during onboarding.

## MVP scope (Phase 1)
- Backend: Decks, Cards, Users, Sessions, Attempts; basic SM2-like scheduling; EF Core; CRUD for decks/cards; basic progress tracking.
- Frontend: Deck catalog, session flow, card presentation, doneness indicator, timer, responsive UI; user profile; basic authentication scaffold.
- Persistence: SQL database (EF Core) or NoSQL as alternative; scalar API docs UI instead of Swagger.
- Testing: Backend unit tests; basic frontend tests.
- Readme: AI usage narrative and deployment notes.

## Non-functional requirements & constraints
- Security: basic authentication scaffold; plan for RBAC, CSRF protection, input validation.
- Observability: basic logging and metrics plan.
- Accessibility: semantic UI and keyboard navigation.
- Compliance: ensure data privacy and secure storage of credentials.

## Roadmap (high-level, 12–14 weeks)
- Weeks 1–2: Define data models, API contracts, and initial repo structure; set up Storybook and skeleton frontend.
- Weeks 3–4: Implement core backend (Decks, Cards, Users, Sessions, Attempts) and SM2-like scheduler; basic frontend views.
- Weeks 5–6: Implement UI components, theming, and basic tests; begin readme with AI usage plan.
- Weeks 7–8: Add advanced features (Storybook integration, theming, RBAC skeleton, Cypress tests, Docker scaffolding).
- Weeks 9–10: Integrate WebSockets for live study rooms (optional), integrate analytics/events.
- Weeks 11–12: End-to-end validation, optimize performance, finalize deployment scripts and README sections for submission.

## Validation plan & experiments
- Usability testing sessions with 5–8 participants.
- A/B test deck layout w.r.t. doneness indicators.
- Measure time-to-master before/after improvements.

## Data model (high level)
- User, Deck (Recipe), Card, Session, Attempt, Mastery, Progress, Badges

## API design overview (high level)
- GET/POST/PUT/DELETE for Decks, Cards, Users
- POST /sessions (start), GET /sessions/:id (status), POST /sessions/:id/complete
- POST /attempts (record attempt)
- GET /mastery (per deck/user)

## Data & analytics plan
- Events: deck_view, session_start, session_end, card_shown, answer_submitted, correct, incorrect, mastery_updated, deck_mastered, user_login
- Metrics: activation, retention, DAU/MAU, time_on_task, learning_sprint_anxiety (qualitative)

## UX research plan
- Compile a short set of interview questions to validate the cooking metaphor, deck discovery, and session flow.
- Schedule 2–3 design critiques with stakeholders per milestone.

## AI usage plan (how AI will be used)
- Use AI to generate initial prompts and learning content prompts; document prompts and rationale in specs/.md prompts files.
- AI-assisted explanations in the UI to explain why cards are shown next (without exposing private chain-of-thought).

## Risks & mitigations
- Risk: Scheduler complexity. Mitigation: start with a simple SM2-like approach and document behavior clearly.
- Risk: Over-gamification causing distraction. Mitigation: focus on meaningful milestones and transparent progress.
- Risk: Scope creep. Mitigation: strict MVP scope and milestone gating.

## Validation & learnings artifacts
- Specs folder: store prompts used for AI-assisted development and design decisions.

## DoD (Definition of Done)
- MVP shippable with core deck flow, session, and basic analytics; README documents AI usage and advanced feature plan.
