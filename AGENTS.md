# AI Roadmap Trello Task Guidelines

This repository contains the 24-week transition plan from Senior Full-Stack Developer to AI Engineer (`24-week-ai-engineer-transition-plan.md`).

Whenever creating, updating, or managing roadmap tasks in Trello, always adhere to the following specification.

---

## 1. Trello Target Configuration

- **Board Name:** `test`
  - Board URL: `https://trello.com/b/PgwTQ2uN/test`
  - Board ARI: `ari:cloud:trello::board/workspace/6af36d9784ddb105dadd5adb/6af36f16af157074b2818bc1`
- **Default List:** `ToDo`
  - List ARI: `ari:cloud:trello::list/workspace/6af36d9784ddb105dadd5adb/6af95f6092cc13dfa0e90e1d`
- **Identifying Label:** `AI Course` (Color: `sky`)
  - Label ARI: `ari:cloud:trello::label/workspace/6af36d9784ddb105dadd5adb/6af96140ee45ccb644fcd2d2`

---

## 2. Task Granularity & Card Title Format

- **Granularity Strategy:** 1 card per week (Option A).
- **Title Naming Convention:**
  `[AI Roadmap] Week XX: <Title>`
  *(e.g., `[AI Roadmap] Week 01: LLM APIs and the Application Boundary`)*

---

## 3. Card Description Template

Every card description must follow this structure in GitHub-flavored Markdown:

```markdown
### Overview & Target
<Brief 1-2 sentence objective describing what will be built and mastered.>

- **Roadmap Source:** [`24-week-ai-engineer-transition-plan.md`](https://github.com/trhv/ai-engineering-roadmap/blob/main/24-week-ai-engineer-transition-plan.md)
- **Phase:** Phase X — <Phase Name>
- **Target Stack:** Node.js (v22 LTS), TypeScript, <relevant libraries/SDKs>
- **Time Budget:** ~8–10 hours (Reading: ~2h, Implementation: ~5h, Testing/Eval: ~1.5h, Review: ~0.5h)

---

### Concrete Deliverables / Target Artifacts
- **Repository Directory:** `apps/week-XX-<short-slug>/` (or dedicated repo)
- **Key Artifacts Produced:**
  - `<main-entry-file>`: <Description>
  - `<cli-or-test-ui>`: <Description>
  - `.env.example`: Template listing required keys without actual secrets.
  - `eval/<test-dataset>`: Suite of test inputs/cases.
  - `eval/<evaluation-or-comparison-report>`: Recorded benchmarks, findings, or metrics.
  - `README.md`: Clear setup and execution guide reproducible by another engineer.

---

### Key Concepts to Learn
- <Bullet point concepts from the 'Learn' section of the week>

---

### Build Tasks
- [ ] <Implementation task 1>
- [ ] <Implementation task 2>
...

---

### Exercise
- <Practical testing/comparison exercise details from the week>

---

### Definition of Done (DoD)
- [ ] <DoD item 1>
- [ ] <DoD item 2>
- [ ] Post-ticket AI concept synthesis executed via `POST_TICKET_PROMPT.md` (updating knowledge base & `docs/index.html` portal).
...

---

### Reference Material
- [<Link Title>](<URL>)
```

---

## 4. Native Trello Checklists

For every created card, attach two interactive Trello checklists using `trelloWriteChecklist`:
1. **`Build Tasks`**: Contains the individual implementation steps from the Build section.
2. **`Definition of Done`**: Contains the verification items from the Definition of Done section, always including the final knowledge base synthesis step.

---

## 5. Tool Sequence for Creating Cards

1. Call `trelloWriteCard` with `action: "create"`, `listId`, `name`, `desc`, and `pos: "bottom"` (or `"top"`).
2. Call `trelloWriteCard` with `action: "attach_label"`, `cardId`, and `labelId: "ari:cloud:trello::label/workspace/6af36d9784ddb105dadd5adb/6af96140ee45ccb644fcd2d2"`.
3. Call `trelloWriteChecklist` with `action: "create"` to add checklist `Build Tasks`, followed by `add_item` for each step.
4. Call `trelloWriteChecklist` with `action: "create"` to add checklist `Definition of Done`, followed by `add_item` for each item.
5. Report the card name and verbatim URL back to the user.

---

## 6. Implementation Plans & Mandatory Post-Ticket Synthesis Step

Whenever creating an implementation plan (e.g. `PLAN.md` or a structured plan for executing any weekly ticket), you **MUST** include the following as the **final mandatory phase/step** in the plan:

```markdown
### Final Phase: Post-Ticket AI Concept Synthesis & Knowledge Base Update
- [ ] **Execute Post-Ticket Synthesis:** Run the instructions in [`POST_TICKET_PROMPT.md`](file:///home/arye/Documents/private/repos/ai-engineering-roadmap/POST_TICKET_PROMPT.md).
- [ ] **Extract AI Engineering Concepts:** Identify and document applied concepts (System Architecture, Reliability, Security, Tokenomics, Observability, Evals).
- [ ] **Update Knowledge Base Artifact & Repo Docs:**
  - Update persistent artifact `ai-concepts-knowledge-base.md`.
  - Sync repository file `docs/AI_CONCEPTS_KNOWLEDGE_BASE.md`.
- [ ] **Update Interactive Web Portal:**
  - Update `docs/index.html` with the new week section, live-rendered Mermaid diagrams, code snippets, copy buttons, search index, and collapsible interview prep accordions.
- [ ] **Trello Card Finalization:** Move the ticket's Trello card to the `Done` list and mark as complete.
```

---

## 7. Git Workflow & Branching Strategy

To maintain repository integrity and clean history, follow this strict Git workflow for all roadmap tickets:

### A. Golden Rule
- **Direct pushes to `main` are strictly prohibited.**
- All changes must be merged into `main` exclusively via **Pull Requests (PRs)**.

### B. Starting a New Ticket (Mandatory Sequence)
Whenever beginning work on a new ticket:
1. Switch to `main`:
   ```bash
   git checkout main
   ```
2. Pull the latest upstream commits:
   ```bash
   git pull origin main
   ```
3. Create and check out a dedicated feature branch from updated `main`:
   ```bash
   git checkout -b feat/week-XX-<short-slug>
   # Example: git checkout -b feat/week-02-structured-outputs
   ```

### C. Branch Naming Convention
- Features / Weekly tickets: `feat/week-XX-<short-slug>`
- Bugfixes / Improvements: `fix/<short-slug>`
- Documentation updates: `docs/<short-slug>`

### D. Completing the Ticket
1. Commit all ticket deliverables, tests, and knowledge base updates to the feature branch.
2. Push the feature branch to remote:
   ```bash
   git push -u origin feat/week-XX-<short-slug>
   ```
3. Open a Pull Request targeting `main`.
4. Review and merge the PR into `main`.
