# Post-Ticket AI Concept Synthesis Prompt

> **Mandatory Final Phase for All Roadmap Tickets:**  
> This prompt is executed as the final step in every ticket implementation plan (`PLAN.md`) immediately after verifying deliverables and before closing out the ticket.

---

```markdown
We have just completed the current Trello ticket. Please execute our post-ticket AI concept synthesis:

1. **Extract AI Concepts:**
   - Analyze the current ticket's deliverables, code files, and build tasks.
   - Identify all core AI Engineering concepts applied (e.g., tokenomics, model boundaries, RAG retrieval, agent state, tool schemas, guardrails, evals).

2. **Update Persistent Knowledge Base Artifact & Website:**
   - Read and update our persistent knowledge base artifact: `ai-concepts-knowledge-base.md`.
   - Update the interactive web portal at `docs/index.html` to include the new week's concepts, interactive Mermaid architecture diagrams, code snippets, search indexing, and collapsible interview prep questions.
   - Maintain a tabbed/navigation bar at the top linking to all tickets (e.g., `[Week 01: LLM Boundary]`, `[Week 02: Tool Calling]`, etc.).
   - Under the tab for the completed ticket, include:
     - **Concept Name & Category** (e.g. Reliability, Model Routing, Prompt Engineering, Evaluation)
     - **Where We Used It:** Clickable file links with line references (e.g. `[src/services/llm.service.ts](file:///...)`) and a brief code snippet.
     - **In-Depth Explanation:** Technical breakdown of what it is, why it matters in production AI systems, and common interview questions around it.
     - **Failure Modes & Trade-Offs:** What happens when this concept is ignored (e.g., hallucinations, runaway costs, prompt injections).

3. **Cumulative Preservation:**
   - Do not overwrite previous tickets. Append this ticket as a new tab/section in the index.
   - Also sync/save a copy to `docs/AI_CONCEPTS_KNOWLEDGE_BASE.md` and keep `docs/index.html` updated inside the repository so it is tracked in Git.
```
