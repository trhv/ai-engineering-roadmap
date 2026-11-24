# Post-Ticket AI Concept Synthesis Prompt

> **Mandatory Final Phase for All Roadmap Tickets:**  
> This prompt is executed as the final step in every ticket implementation plan (`PLAN.md`) immediately after verifying deliverables and before closing out the ticket.

---

```markdown
We have just completed the current Trello ticket. Please execute our post-ticket AI concept synthesis:

1. **Extract AI Concepts:**
   - Read every source, eval, and test file of the ticket's app in full (not just the main service) before writing anything.
   - Identify all core AI Engineering concepts applied (e.g., tokenomics, model boundaries, RAG retrieval, agent state, tool schemas, guardrails, evals).
   - **Coverage check against the roadmap:** open the week's section in `24-week-ai-engineer-transition-plan.md` and map every bullet in its "Learn" list to a concept. Every bullet must get its own concept (or be explicitly covered inside one), even if it was not implemented — in that case mark it **"Not implemented in Week XX"**, link the code that does the alternative (e.g. blocking call instead of streaming), and label any code snippet as a reference sketch that is not in the repo.
   - Also add a concept for anything the code uses that is a core LLM topic but not in the Learn list (e.g. sampling parameters, message roles, SDK default retries).

2. **Update Persistent Knowledge Base Artifact & Website:**
   - Read and update our persistent knowledge base artifact: `ai-concepts-knowledge-base.md`.
   - Update the interactive web portal at `docs/index.html` to include the new week's concepts, interactive Mermaid architecture diagrams, code snippets, search indexing, and collapsible interview prep questions.
   - Maintain a tabbed/navigation bar at the top linking to all tickets (e.g., `[Week 01: LLM Boundary]`, `[Week 02: Tool Calling]`, etc.).
   - Under the tab for the completed ticket, include:
     - **Concept Name & Category** (e.g. Reliability, Model Routing, Prompt Engineering, Evaluation)
     - **Where We Used It:** Clickable file links with line references (e.g. `[src/services/llm.service.ts](file:///...)`) and a brief code snippet.
     - **In-Depth Explanation:** Technical breakdown of what it is, why it matters in production AI systems, and common interview questions around it.
     - **Failure Modes & Trade-Offs:** What happens when this concept is ignored (e.g., hallucinations, runaway costs, prompt injections).

3. **Accuracy Rules (describe the code as it is, not as it should be):**
   - **Explanations must match actual behaviour.** Before claiming a guarantee (e.g. "validated at the boundary", "keys are always redacted", "errors never leak internals", "config is validated at startup"), trace the code path and confirm it holds for *every* entry point (HTTP, CLI, eval harness, workers). Check fallbacks, catch blocks, and what the error handler actually returns to the client.
   - **Document gaps explicitly.** If the code only partially implements a concept, add a "Known gap" note saying what is missing, where (file + line), and what the production fix would be. Never present a best practice as implemented when it isn't.
   - **Data must be measured.** Latency, cost, pass-rate, or quality numbers may only come from an actual run whose output is in the repo. Before citing eval results, confirm the dataset parses (e.g. `JSON.parse` on `prompts.json`) and the harness ran. Otherwise label numbers as "not measured" or omit them.
   - **Verify technical facts against the installed version, not memory:** enum/string values (e.g. AI SDK `finishReason` is `content-filter`, not `content_filter`), API names (e.g. `AbortSignal.timeout()`, not `AbortController.timeout()`), SDK defaults (e.g. `maxRetries`), and which usage fields map to which provider fields. Check `node_modules/<pkg>/dist/*.d.ts` or the source.
   - **Verify pricing and model claims** against the provider's current pricing/model pages; state the date checked. Don't recommend deprecated or retired models.
   - **Keep the two docs consistent:** the same claim (e.g. a cost ratio) must have the same value in `docs/AI_CONCEPTS_KNOWLEDGE_BASE.md` and `docs/index.html`.

4. **Reference Validation (run before finishing):**
   - Every file link must point to an existing file, and every `#Lx-Ly` range must cover the whole construct described (whole function/method, including its `catch` block and fallbacks — not just the happy path).
   - Code snippets labelled with a file path must be verbatim excerpts (shortening with `...` is fine; rewriting conditions or messages is not).
   - In `docs/index.html`, escape `<` and `>` inside `<code>` blocks (`&lt;` / `&gt;`) so generics like `Promise<T>` aren't parsed as HTML tags.
   - Open `docs/index.html` in a browser and confirm: all concept cards render, Mermaid diagrams render, code is syntax-highlighted, accordions and search work, no console errors.

5. **Cumulative Preservation:**
   - Do not overwrite previous tickets. Append this ticket as a new tab/section in the index.
   - Also sync/save a copy to `docs/AI_CONCEPTS_KNOWLEDGE_BASE.md` and keep `docs/index.html` updated inside the repository so it is tracked in Git.
```
