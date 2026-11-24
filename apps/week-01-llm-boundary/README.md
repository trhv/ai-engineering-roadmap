# Week 01: LLM APIs and the Application Boundary

A production-grade TypeScript microservice that establishes a robust application boundary around LLM provider APIs (Google Gemini via Vercel AI SDK), with strict schema validation, structured error mapping, observability, an interactive CLI, and an evaluation testbench.

---

## 🏛️ Architecture & System Design

```mermaid
flowchart LR
    Client["Client / CLI / Test Suite"] -->|HTTP / JSON| Server["Express API Service"]
    Server -->|Schema Validation (Zod)| Boundary["Application Boundary Wrapper"]
    Boundary -->|Timeout / Normalization / Logging| Provider["Google Gemini (Vercel AI SDK)"]
    Provider -->|Tokens & Raw Response| Boundary
    Boundary -->|Audit Log + Token Metrics| Server
    Server -->|Clean Contract / Sanitized Errors| Client
```

### Core Architectural Decisions
1. **Application Boundary Over Raw Output:** Model responses are probabilistic and prone to upstream issues (timeouts, rate limits, schema drift). This service decouples internal callers from upstream instability through:
   - Request timeouts via `AbortController` (configurable via `REQUEST_TIMEOUT_MS`).
   - Upstream error normalization into a unified `AppError` hierarchy.
   - Strict credential redaction (secrets and keys are never printed in logs or sent to clients).
2. **Observability & Traceability:**
   - Every request is tagged with an `X-Request-Id` (propagated from caller or generated as UUID v4).
   - Structured JSON logging with Pino tracks prompt length, latency (ms), token usage (prompt, completion, total), and status.
3. **Multi-Model Support via Vercel AI SDK:**
   - Provider abstraction enables switching between Gemini models (e.g. `gemini-2.5-flash` vs `gemini-2.5-pro`) on a per-request basis without modifying application code.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v22+ (tested on Node.js v24 LTS)
- Google Gemini API Key ([Google AI Studio](https://aistudio.google.com/app/apikey))

#### How to Generate a Google Gemini API Key
1. Navigate to [Google AI Studio](https://aistudio.google.com/) and sign in with your Google account.
2. Click **"Get API key"** in the top navigation or visit [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
3. Click **"Create API key"** and choose:
   - **"Create API key in new project"** (instant setup), or
   - Select an existing Google Cloud project.
4. Copy the generated key (starts with `AIzaSy...`).
5. Keep it private—never commit your key to Git.

### 1. Installation
```bash
cd apps/week-01-llm-boundary
npm install
```

### 2. Environment Configuration
Copy the template and configure your API key:
```bash
cp .env.example .env
```
Edit `.env`:
```env
PORT=3000
NODE_ENV=development
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_gemini_api_key_here
DEFAULT_MODEL=gemini-2.5-flash
BENCHMARK_MODEL_A=gemini-2.5-flash
BENCHMARK_MODEL_B=gemini-2.5-pro
REQUEST_TIMEOUT_MS=15000
MAX_TOKENS=2048
```

> [!NOTE]
> `.env` is strictly excluded in `.gitignore` to prevent secret leakage.

### 3. Build & Run the API Server
```bash
# Development mode (with live watch & pretty logs)
npm run dev

# Or build and run production bundle
npm run build
npm start
```

---

## 📡 API Reference

### 1. Health Check
```http
GET /health
```
**Response (200 OK):**
```json
{
  "status": "ok",
  "uptime": 12.34,
  "timestamp": "2026-11-24T09:15:00.000Z",
  "defaultModel": "gemini-2.5-flash"
}
```

### 2. Generate Chat Completion
```http
POST /v1/chat/generate
Content-Type: application/json
X-Request-Id: optional-client-uuid
```

**Request Body:**
```json
{
  "prompt": "Explain tokenization in 2 sentences.",
  "systemPrompt": "You are a concise technical educator.",
  "model": "gemini-2.5-flash",
  "temperature": 0.5,
  "maxTokens": 1000
}
```

**Success Response (200 OK):**
```json
{
  "requestId": "d0449bce-ec89-43a3-8cc7-966debb05132",
  "model": "gemini-2.5-flash",
  "content": "Tokenization is the process of breaking down raw text into smaller chunks called tokens...",
  "usage": {
    "promptTokens": 24,
    "completionTokens": 38,
    "totalTokens": 62
  },
  "latencyMs": 482,
  "finishReason": "stop"
}
```

**Validation Error Response (400 Bad Request):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "requestId": "f96397f8-6c75-433f-a7ea-eae4e08cb9e1",
    "details": {
      "prompt": {
        "_errors": ["Prompt cannot be empty"]
      }
    }
  }
}
```

---

## 💻 Interactive CLI

The service includes an interactive CLI REPL to query models, test prompts, and observe real-time latency and token metrics:

```bash
# Start the interactive REPL
npm run cli

# Or execute a single prompt directly
npm run cli -- -p "What is an LLM context window?" -m gemini-2.5-flash
```

---

## 🧪 Testing & Evaluation

### Boundary & Sanitization Tests
Run the automated test suite verifying input validation, schema enforcement, and sanitized error normalization:
```bash
npx tsx tests/boundary.test.ts
```

### Evaluation & Model Benchmark
Run the automated evaluation benchmark across the 10 test prompts in [`eval/prompts.json`](file:///home/arye/Documents/private/repos/ai-engineering-roadmap/apps/week-01-llm-boundary/eval/prompts.json):
```bash
npm run benchmark
```
Detailed findings and architectural trade-offs are recorded in [`eval/model-comparison.md`](file:///home/arye/Documents/private/repos/ai-engineering-roadmap/apps/week-01-llm-boundary/eval/model-comparison.md).
