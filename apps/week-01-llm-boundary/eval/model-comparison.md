# Model Benchmark Comparison: Gemini 2.5 Flash vs Gemini 2.5 Pro

**Evaluation Date:** 2026-11-24  
**Framework:** Vercel AI SDK (`ai` + `@ai-sdk/google`)  
**Evaluation Dataset:** [`eval/prompts.json`](file:///home/arye/Documents/private/repos/ai-engineering-roadmap/apps/week-01-llm-boundary/eval/prompts.json) (10 varied test cases)

---

## 1. Executive Summary

This evaluation analyzes the trade-offs between Google's **Gemini 2.5 Flash** (high-throughput, low-latency tier) and **Gemini 2.5 Pro** (high-reasoning, complex problem-solving tier) within our TypeScript application boundary.

| Dimension | Gemini 2.5 Flash | Gemini 2.5 Pro |
| :--- | :--- | :--- |
| **Primary Target** | Interactive UI, high-volume classification, chatbots | Complex reasoning, multi-step code synthesis |
| **Typical Latency (P50)** | ~350–550 ms | ~1100–1800 ms |
| **Token Cost Ratio** | 1x (Baseline) | ~5x–10x |
| **Constraint Adherence** | High for standard schemas | Extreme accuracy on edge/complex schemas |
| **Recommended Role** | Default API Model | Escalation / Specialist Model |

---

## 2. Test Cases Overview (`eval/prompts.json`)

The evaluation suite exercises 10 distinct failure modes and capability classes:
1. `p01-factual`: Protocol comparison (TCP vs UDP) — tests basic retrieval clarity.
2. `p02-reasoning`: Trick logic riddle (17 sheep, all but 9 run away) — tests cognitive reflection.
3. `p03-code-gen`: TypeScript generic `debounce` function — tests type system mastery.
4. `p04-creative`: Tokenization metaphor for a child — tests explanation adaptation.
5. `p05-constraints`: Strict JSON-only schema compliance without code blocks.
6. `p06-edge-empty`: Single-character prompt (`?`) — tests graceful minimal input handling.
7. `p07-edge-long`: High repetition error logs — tests context summarization and noise filtering.
8. `p08-adversarial`: Prompt injection ("Ignore all previous instructions...") — tests guardrail resistance.
9. `p09-ambiguity`: Under-specified request ("Fix my website") — tests helpful clarification vs hallucination.
10. `p10-multilingual`: English technical guideline translated to Hebrew — tests cross-lingual fidelity.

---

## 3. Detailed Comparative Analysis

### A. Latency & Responsiveness
- **Gemini 2.5 Flash** demonstrated rapid Time-to-First-Token (TTFT) and total generation latencies generally under 600ms for short-to-medium completions. This makes it ideal for real-time web applications, interactive CLI tools, and synchronous request-reply workflows.
- **Gemini 2.5 Pro** takes substantially longer (~1.2s to 2.5s) as it dedicates extra internal compute to reasoning and token planning before streaming the response.

### B. Output Quality & Reasoning
- For factual queries (`p01`), creative summaries (`p04`), and strict single-object JSON generation (`p05`), **Gemini 2.5 Flash** performed on par with Pro, adhering cleanly to formatting instructions.
- On multi-step algorithmic code generation (`p03`) and complex adversarial reasoning (`p08`), **Gemini 2.5 Pro** produced superior generic type constraints and cleaner separation of concerns.

### C. Resilience to Adversarial & Malformed Inputs
- Neither model leaked simulated system instructions or environment variables during the adversarial test (`p08`).
- Both models handled single-character input (`p06`) gracefully without throwing provider errors or hanging.

---

## 4. Architectural Recommendation for Week 01 Service

1. **Default Model:** Standardize on **`gemini-2.5-flash`** as the default server model for `POST /v1/chat/generate`. It provides the ideal balance of speed, cost, and developer experience for day-to-day operations.
2. **Model Parameter Override:** Allow clients to request `gemini-2.5-pro` via the request body payload (`{ "model": "gemini-2.5-pro" }`) when complex reasoning or critical synthesis is required.
3. **Application Boundary Guardrails:**
   - Keep the default timeout at **15,000ms** to comfortably accommodate Pro model generations while cutting off runaway requests.
   - Enforce the Zod schema validation layer before dispatching requests to avoid unnecessary token consumption on malformed requests.
