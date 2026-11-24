# Implementation Plan: Week 01 — LLM APIs and the Application Boundary

**Target Directory:** [`apps/week-01-llm-boundary/`](file:///home/arye/Documents/private/repos/ai-engineering-roadmap/apps/week-01-llm-boundary)  
**Parent Roadmap:** [24-week-ai-engineer-transition-plan.md](file:///home/arye/Documents/private/repos/ai-engineering-roadmap/24-week-ai-engineer-transition-plan.md#L134-L178)  
**Trello Card:** [Week 01: LLM APIs and the Application Boundary](https://trello.com/c/NHEm9FlN/21-ai-roadmap-week-01-llm-apis-and-the-application-boundary)

---

## 1. Objectives & Scope

Build a production-grade TypeScript microservice that establishes a robust application boundary around raw LLM provider APIs:
- Encapsulate provider API interactions behind strict type contracts.
- Handle malformed inputs, timeouts, rate limits, and provider outages gracefully without leaking internal secrets or raw stack traces.
- Provide structured observability logging (Request ID, model, latency, token usage, status).
- Deliver an interactive CLI tool to query the service.
- Construct an evaluation test bench (`eval/prompts.json`) and run benchmark comparisons (`eval/model-comparison.md`) between at least two Gemini models (e.g., `gemini-2.5-flash` vs `gemini-2.5-pro` / `gemini-1.5-flash`).

```mermaid
flowchart LR
    Client["Client / CLI"] -->|HTTP / JSON| Server["API Service (Express)"]
    Server -->|Validate Schema (Zod)| Boundary["Application Boundary Wrapper"]
    Boundary -->|Timeout / Retry / Log| Provider["LLM Provider (Google Gemini via Vercel AI SDK)"]
    Provider -->|Tokens & Raw Response| Boundary
    Boundary -->|Normalize & Calculate Metrics| Server
    Server -->|Structured Output + Audit Log| Client
```

---

## 2. Selected Tech Stack

| Component | Choice | Rationale |
| :--- | :--- | :--- |
| **Runtime & Language** | Node.js (v22 LTS) + TypeScript 5.x | Modern ESM, native fetch, strong typing |
| **HTTP Server** | Express (`express`, `@types/express`) | Classic, robust, widely adopted web server |
| **LLM SDK** | Vercel AI SDK (`ai` + `@ai-sdk/google`) | Standardized prompt format, clean model switching, token metrics |
| **Model Provider** | Google Gemini (`GEMINI_API_KEY` / `GOOGLE_GENERATIVE_AI_API_KEY`) | High throughput, generous context window, competitive pricing |
| **Validation** | Zod | Runtime contract enforcement and type inference |
| **Logging** | Pino (`pino`, `pino-http`, `pino-pretty`) | High-speed structured JSON logging with request correlation IDs |
| **CLI Client** | Commander / Prompts | Interactive prompt tester for the terminal |

---

## 3. Directory Layout

```text
apps/week-01-llm-boundary/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
├── PLAN.md                     # This plan
├── src/
│   ├── index.ts                # Application entrypoint / server listener
│   ├── server.ts               # Express app, middleware, routes
│   ├── cli.ts                  # Interactive CLI prompt runner
│   ├── config/
│   │   └── env.ts              # Type-safe environment variables (Zod)
│   ├── schemas/
│   │   └── prompt.schema.ts    # Request/Response schemas & TypeScript types
│   ├── services/
│   │   ├── llm.service.ts      # LLM provider wrapper & boundary abstraction
│   │   └── logger.service.ts   # Structured Pino logger with request context
│   └── errors/
│       └── app-error.ts        # Normalized error hierarchy (Timeout, ProviderError, ValidationError)
└── eval/
    ├── prompts.json            # 10+ varied benchmark & edge-case prompts
    ├── run-benchmark.ts        # Automated script to run prompts across 2 Gemini models
    └── model-comparison.md     # Recorded metrics: latency, token usage, cost, quality
```

---

## 4. Phased Implementation Steps

### Phase 1: Project Initialization & Configuration
- [ ] Initialize `apps/week-01-llm-boundary` with `package.json` (`"type": "module"`).
- [ ] Install dependencies:
  - Runtime: `express`, `ai`, `@ai-sdk/google`, `zod`, `pino`, `pino-http`, `dotenv`, `uuid`, `commander`.
  - Dev: `typescript`, `@types/node`, `@types/express`, `@types/uuid`, `tsx`, `pino-pretty`.
- [ ] Configure `tsconfig.json` for NodeNext resolution and strict type checking.
- [ ] Setup `.gitignore` ensuring `.env` and `node_modules` are excluded.
- [ ] Create `.env.example` defining `PORT`, `GOOGLE_GENERATIVE_AI_API_KEY`, `DEFAULT_MODEL`, `REQUEST_TIMEOUT_MS`.
- [ ] Implement `src/config/env.ts` with Zod schema for validated startup config.

### Phase 2: Application Boundary & LLM Service
- [ ] Define standardized response interface:
  ```ts
  interface GenerateResponse {
    requestId: string;
    model: string;
    content: string;
    usage: { promptTokens: number; completionTokens: number; totalTokens: number };
    latencyMs: number;
    finishReason: string;
  }
  ```
- [ ] Implement `LlmService`:
  - Request timeout via `AbortSignal.timeout(timeoutMs)`.
  - Structured error mapping: map 401/429/500/timeout into normalized `AppError`.
  - Token count tracking and latency calculation.
- [ ] Implement `src/services/logger.service.ts` to output structured JSON logs with `requestId`, `model`, `latencyMs`, `tokens`, and `status`.

### Phase 3: Express HTTP API Endpoint
- [ ] Implement `POST /v1/chat/generate` accepting:
  - `prompt`: string (min: 1, max: 8000)
  - `systemPrompt` (optional): string
  - `model` (optional): string override
  - `temperature` (optional): number (0.0 to 2.0)
- [ ] Add input validation middleware with Zod.
- [ ] Add Request ID generation (`X-Request-Id`) & correlation middleware.
- [ ] Add centralized error handler returning clean JSON error responses (`{ error: { code, message, requestId } }`).
- [ ] Add `GET /health` endpoint for readiness/liveness checks.

### Phase 4: Interactive CLI
- [ ] Build `src/cli.ts` allowing:
  - Interactive prompt entry via terminal.
  - Model selection flag (`--model`).
  - Formatted display of response text, latency (ms), token usage, and cost estimation.

### Phase 5: Evaluation Suite & Model Comparison
- [ ] Create `eval/prompts.json` containing 10 diverse prompts:
  1. *Factual / Retrieval:* Exact knowledge question.
  2. *Reasoning:* Multi-step logic puzzle.
  3. *Code Generation:* TypeScript utility function with edge cases.
  4. *Creative Writing:* Technical explainer with specific constraints.
  5. *Constraint Following:* Strict formatting rule (e.g. JSON only, character limit).
  6. *Edge Case:* Empty string / whitespace.
  7. *Edge Case:* Extremely long prompt.
  8. *Adversarial:* Prompt injection attempt ("Ignore previous instructions...").
  9. *Ambiguous / Under-specified:* Query requiring safe clarification or cautious response.
  10. *Multilingual / Translation:* Technical terms translated into another language.
- [ ] Create `eval/run-benchmark.ts` to run all 10 prompts against two Gemini models (e.g., `gemini-2.5-flash` vs `gemini-2.5-pro` or `gemini-1.5-flash`).
- [ ] Generate `eval/model-comparison.md` documenting:
  - P50 & P95 latencies.
  - Token efficiency and pricing comparison.
  - Quality observations across categories.
  - Final recommendation & trade-off rationale.

### Phase 6: Documentation & Definition of Done Verification
- [ ] Write comprehensive `README.md` with:
  - Architecture overview.
  - Quick start instructions.
  - API endpoint reference & cURL examples.
  - How to run the CLI and evaluation benchmark.
- [ ] Verify all Definition of Done checklist items.

---

## 5. Verification Checklist (Definition of Done)

- [ ] **Out-of-the-box Execution:** A new engineer can clone, run `npm install`, configure `.env`, and start the app (`npm run dev` / `npm start`).
- [ ] **Secret Hygiene:** Verification that `.env` is ignored by git and only `.env.example` is committed.
- [ ] **Error & Boundary Resilience:** Tests confirm invalid inputs, missing keys, timeouts, and provider errors return structured errors without crashing.
- [ ] **10+ Test Prompts:** `eval/prompts.json` contains at least 10 categorized test cases.
- [ ] **Model Comparison:** `eval/model-comparison.md` contains recorded metrics and clear architectural rationale.
