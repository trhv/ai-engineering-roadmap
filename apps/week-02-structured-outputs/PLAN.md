# Implementation Plan: Week 02 — Structured Outputs, Validation, and Tool Calling

**Target Directory:** [`apps/week-02-structured-outputs/`](file:///home/arye/Documents/private/repos/ai-engineering-roadmap/apps/week-02-structured-outputs)  
**Parent Roadmap:** [24-week-ai-engineer-transition-plan.md](file:///home/arye/Documents/private/repos/ai-engineering-roadmap/24-week-ai-engineer-transition-plan.md#L179-L224)  
**Trello Card:** [[AI Roadmap] Week 02: Structured outputs, validation, and tool calling](https://trello.com/c/t2EUpfej/22-ai-roadmap-week-02-structured-outputs-validation-and-tool-calling)

---

## 1. Objectives & Scope

Build an enterprise-grade TypeScript microservice showcasing **schema-constrained structured outputs** and **application-governed tool calling**:
- **Structured Task Extraction:** Accept raw unstructured text and extract structured task specifications validated at runtime against strict Zod schemas (`title`, `description`, `priority`, `dueDate`, `tags`).
- **Defensive Parsing & Fallback:** Handle malformed, partial, or semantically invalid LLM responses with structured error recovery.
- **Application-Governed Tool Calling:** Provide tools (`searchTasks`, `createDraftTask`) where the LLM proposes tool execution, but application logic authorizes, sanitizes parameters, validates against business rules, and executes.
- **Strict Trust Boundaries:** Guarantee the LLM cannot execute arbitrary SQL, shell scripts, or open network requests.
- **Evaluation Suite:** Run 20 varied inputs (edge cases, ambiguous text, prompt injections/jailbreaks, missing required fields) assessing both schema validity and semantic task correctness.
- **Interactive CLI & REST Endpoints:** Offer both a developer-friendly CLI tool and Express endpoints for inspection.

```mermaid
flowchart TD
    User["User / Client Request"] --> API["Express / CLI Layer"]
    API --> Extractor["Task Extraction Service"]
    API --> ToolAgent["Tool-Calling Agent Service"]

    subgraph Trust Boundary ["Strict Application Trust Boundary"]
        ZodSchema["Zod Schema Validation & Sanitation"]
        AuthCheck["Permission & Rate Gate"]
        SafeExecution["Pure In-Memory / Sandboxed Storage Engine"]
    end

    subgraph LLM Layer ["Probabilistic Model Layer"]
        Model["Gemini 2.5 Flash / Pro (Vercel AI SDK)"]
    end

    Extractor -->|Prompt + JSON Schema / generateObject| Model
    Model -->|Raw Proposed JSON| ZodSchema
    ZodSchema -->|Validated Object / Typed Error| API

    ToolAgent -->|Tool Definitions & Prompt| Model
    Model -->|Proposes Tool Call (name, args)| AuthCheck
    AuthCheck -->|Authorize & Validate Args| ZodSchema
    ZodSchema --> SafeExecution
    SafeExecution -->|Tool Execution Result| Model
    Model -->|Final Assistant Summary| API
```

---

## 2. Tech Stack & Dependencies

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime & Language** | Node.js (v22 LTS) + TypeScript 5.8 (ESM) | Native fetch, modern async tooling, strict type safety |
| **AI SDK** | Vercel AI SDK (`ai` + `@ai-sdk/google`) | Clean `generateObject` and `generateText` with native tool definitions |
| **Model Provider** | Google Gemini (`gemini-2.5-flash`, `gemini-2.5-pro`) | High speed, native structured outputs, robust function calling |
| **Validation** | Zod 3.24 | Runtime schema enforcement, transformation, and error formatting |
| **HTTP Framework** | Express 4.21 | REST API endpoints for extraction and agent tool dispatch |
| **Logging** | Pino & Pino-Pretty | High-throughput structured JSON logging with correlation IDs |
| **CLI & Testing** | Commander + `node:test` / `node:assert` | Interactive terminal UI and native TypeScript unit/integration tests |

---

## 3. Directory Layout

```text
apps/week-02-structured-outputs/
├── .env.example
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
├── PLAN.md                                    # This plan
├── src/
│   ├── index.ts                               # Server bootstrapper & listener
│   ├── server.ts                              # Express app, routes, middleware, error handlers
│   ├── cli.ts                                 # Interactive CLI for extraction & tool interaction
│   ├── config/
│   │   └── env.ts                             # Validated environment configuration (Zod)
│   ├── schemas/
│   │   ├── task.schema.ts                     # Task extraction schema, priority enum, ISO date validation
│   │   └── tools.schema.ts                    # Tool argument schemas (searchTasks, createDraftTask)
│   ├── services/
│   │   ├── llm.service.ts                     # Vercel AI SDK wrapper for Gemini models
│   │   ├── task-extractor.service.ts          # Structured output extraction & fallback recovery
│   │   ├── tool-executor.service.ts           # Authorized tool execution engine with trust boundary
│   │   └── logger.service.ts                  # Structured Pino logging
│   ├── storage/
│   │   └── in-memory-task.store.ts            # Safe task repository with seed data
│   └── errors/
│       └── app-errors.ts                      # ToolExecutionError, SchemaValidationError, SecurityViolationError
├── tests/
│   ├── schema-validation.test.ts              # Zod unit tests & invalid edge cases
│   ├── tool-trust-boundary.test.ts            # Injection, unauthorized tools, malformed arguments
│   └── task-extraction.test.ts                # Extraction service integration tests
└── eval/
    ├── test-inputs.json                       # 20 varied evaluation prompts (normal, edge, adversarial)
    ├── run-eval.ts                            # Automated evaluation test bench runner
    └── eval-report.md                         # Benchmark metrics, schema validity rate & error analysis
```

---

## 4. Implementation Phases

### Phase 1: Environment, Dependencies & Configuration
- [ ] Initialize `package.json`, `tsconfig.json`, `.gitignore`, `.env.example`.
- [ ] Setup type-safe environment configuration in `src/config/env.ts`.
- [ ] Verify dependencies installation (`ai`, `@ai-sdk/google`, `zod`, `express`, `pino`, `commander`).

### Phase 2: Domain Schemas & In-Memory Storage
- [ ] Define `TaskSchema` with fields:
  - `title`: string (min 3, max 100)
  - `description`: string (max 500)
  - `priority`: `'low' | 'medium' | 'high' | 'urgent'`
  - `dueDate`: string (nullable, validated ISO 8601 date)
  - `tags`: array of sanitized lowercase strings (max 5)
  - `estimatedHours`: number (nullable, positive integer)
- [ ] Define tool input schemas:
  - `SearchTasksArgsSchema`: `query` (string), `priority` (optional), `tag` (optional), `limit` (max 20)
  - `CreateDraftTaskArgsSchema`: matches `TaskSchema`
- [ ] Implement `InMemoryTaskStore` with seed data, query filter, and creation capabilities.

### Phase 3: Task Extraction Service with Fallback & Error Handling
- [ ] Implement `TaskExtractorService` leveraging `generateObject` with schema guidance.
- [ ] Implement fallback repair strategy: if the model outputs a slight syntax error or markdown backticks, cleanly parse and validate.
- [ ] Add semantic validation checks (e.g. detect if extracted task is empty or hallucinated non-actionable gibberish).

### Phase 4: Application-Governed Tool Calling & Security Boundary
- [ ] Implement `ToolExecutorService`:
  - White-listed tools only (`searchTasks`, `createDraftTask`).
  - Explicit parameter validation using Zod before calling the underlying storage.
  - Strict sandbox: reject any tool call attempting SQL injection, shell command strings, or URL fetch attempts.
  - Audit logging for all tool proposals and executions.
- [ ] Implement conversational agent flow that supports multiple tool execution cycles via `generateText` with `maxSteps: 5`.

### Phase 5: REST Endpoints & Interactive CLI
- [ ] Express endpoints:
  - `POST /api/extract-task`: Unstructured text -> validated JSON task.
  - `POST /api/agent/chat`: Natural language instruction -> multi-step tool execution + summary.
  - `GET /api/tasks`: List current store tasks.
  - `GET /health`: Health check & active model info.
- [ ] Interactive CLI (`src/cli.ts`):
  - Option 1: Extract Task from raw text.
  - Option 2: Conversational Task Assistant (interactive tool calling).
  - Option 3: Inspect In-Memory Store.

### Phase 6: Automated Unit Tests & 20-Input Evaluation Suite
- [ ] Unit tests for schemas, invalid arguments, denied tools, adversarial injection strings.
- [ ] Construct `eval/test-inputs.json` with 20 distinct scenarios:
  - 8 Standard/realistic business tasks (varying complexity, dates, priorities).
  - 4 Ambiguous/incomplete requests (missing priority, relative dates like "tomorrow afternoon").
  - 4 Adversarial/jailbreak prompts (attempts to execute `DROP TABLE`, `cat /etc/passwd`, arbitrary fetch).
  - 4 Edge cases (empty string, emojis only, multi-task lists, non-English).
- [ ] Build `eval/run-eval.ts` runner measuring schema validity rate, semantic correctness, and latency.
- [ ] Generate comprehensive `eval/eval-report.md`.

### Phase 7: Verification & Documentation
- [ ] Run all tests and benchmark script to ensure 100% pass rate.
- [ ] Author `README.md` including architecture, security trust boundary explanation, setup instructions, and curl examples.
- [ ] Verify all Definition of Done checklist items.

---

### Final Phase: Post-Ticket AI Concept Synthesis & Knowledge Base Update
- [ ] **Execute Post-Ticket Synthesis:** Run the instructions in [`POST_TICKET_PROMPT.md`](file:///home/arye/Documents/private/repos/ai-engineering-roadmap/POST_TICKET_PROMPT.md).
- [ ] **Extract AI Engineering Concepts:** Identify and document applied concepts (System Architecture, Reliability, Security, Tokenomics, Observability, Evals).
- [ ] **Update Knowledge Base Artifact & Repo Docs:**
  - Update persistent artifact `ai-concepts-knowledge-base.md`.
  - Sync repository file `docs/AI_CONCEPTS_KNOWLEDGE_BASE.md`.
- [ ] **Update Interactive Web Portal:**
  - Update `docs/index.html` with the new week section, live-rendered Mermaid diagrams, code snippets, copy buttons, search index, and collapsible interview prep accordions.
- [ ] **Trello Card Finalization:** Move the ticket's Trello card to the `Done` list and mark as complete.
