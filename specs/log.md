# Logbook

## Explaining development and design decisions

### 25/6/26
First step after initialising the repo is creating Agent personas to use as 'lenses' for AI outputs. Particularly in /personas:
- the SWE persona is to ensure code is maintable, high quality and scalable.
- the PM persona is to ensure the project idea can be broken down into actionable steps
- the Product Designer lens is to ensure that the final product is most useful and intuitive for end users.

Together, these will ensure the product is high quality in all aspects. Also I have specified that each of these personas should elaborate on the decision making so that I can see the reasoning/though process.

Next I created an initial product_discovery.md which is the initial project breakdown - basically combining my app idea with the requirements specified by MSA. 

### 26/6/26
Created specs/project_proposal.md - a project breakdown viewed through the three personas as 'lenses'. The PM lens covers the problem, prioritized backlog (epics/stories, MoSCoW), metrics and roadmap; the SWE lens covers architecture, data model, API, scheduling, testing and security; the Product Designer lens covers the cooking-metaphor UX flows, design system and accessibility. Each lens elaborates its reasoning/trade-offs so the decision making is visible, and the proposal maps the work to the MSA Phase 2 requirements (including the three advanced features to declare in the README).

Created specs/mvp.md - defines the MVP as an end-to-end user flow (what the learner experiences, step by step) and maps each step to features, feature groups, and user stories/epics, with a traceability table tying epics back to flow steps. This narrows product_discovery/project_proposal down to the Must/Should MVP scope.

Added 35 issues in the Github to breakdown the project. Automated this process using AI and Devin agent
