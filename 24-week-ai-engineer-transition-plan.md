# 24-Week Transition Plan: Senior Full-Stack Developer to AI Engineer

**Format:** Self-managed learning and portfolio plan\
**Duration:** 24 weeks\
**Suggested commitment:** 8--10 hours per week\
**Primary stack:** TypeScript, Node.js, PostgreSQL, Docker\
**Target role:** Hands-on AI Engineer / Applied AI Engineer at a large
technology company

------------------------------------------------------------------------

## How to use this document

Treat this file as the single source of truth for the transition. Keep
it in a Git repository or a notes folder and update the checkboxes every
week.

1.  Start with the **Baseline and target** section.
2.  At the beginning of each week, write a realistic time budget.
3.  Complete the learning tasks, but prioritize building over watching
    courses.
4.  Do not mark a week complete until its **Definition of Done** is
    satisfied.
5.  Keep code, architecture decisions, evaluation results, and demos in
    a public or shareable portfolio repository where possible.
6.  Revisit the job-market calibration at Weeks 1, 12, and 24.

### Weekly time allocation

A useful default for 8--10 hours:

  ------------------------------------------------------------------------
  Activity                                Hours/week Guidance
  --------------------- ---------------------------- ---------------------
  Reading / course                            1.5--2 Learn only what is
  material                                           needed for the week's
                                                     build

  Implementation                                4--5 The majority of the
                                                     time

  Testing / evaluation                        1--1.5 Include failure cases
  / debugging                                        

  Notes / architecture                             1 Record decisions and
  / portfolio                                        evidence

  Review / interview                             0.5 Explain what was
  practice                                           built out loud
  ------------------------------------------------------------------------

### Working principles

-   Stay hands-on. The goal is not to become a prompt-only developer.
-   Keep TypeScript and Node.js as the main implementation stack.
-   Learn enough Python to read AI examples, run notebooks, and work
    with common ML tooling; do not switch your primary stack without a
    clear reason.
-   Learn concepts before adopting frameworks. Avoid learning several
    orchestration frameworks simultaneously.
-   Prefer the model provider's current API and official SDK
    documentation. APIs evolve quickly; check the docs before copying
    examples.
-   Build systems that handle uncertainty: malformed output, missing
    context, timeouts, rate limits, prompt injection, and incorrect
    answers.
-   Every portfolio project should include a README, architecture
    diagram, setup instructions, tests, sample data, evaluation
    evidence, and a short demo.

------------------------------------------------------------------------

## Baseline and target

### Starting profile

-   [ ] 15 years of software development experience
-   [ ] Senior Full-Stack Developer
-   [ ] Strong Node.js and TypeScript experience
-   [ ] Experience with microservices
-   [ ] Daily use of AI coding tools such as Cursor or GitHub Copilot
-   [ ] Has not yet built substantial production-style AI applications

### Target profile by the end of Week 24

A credible candidate should be able to:

-   Design and implement LLM-backed features using provider APIs.
-   Build structured, tool-using applications with validation and safe
    execution.
-   Implement retrieval-augmented generation (RAG), including ingestion,
    retrieval, citations, and evaluation.
-   Build bounded agentic workflows with explicit tools, state,
    permissions, and human approval where needed.
-   Deploy and operate AI services with observability, reliability,
    security, and cost controls.
-   Explain trade-offs and failure modes in a system design or coding
    interview.
-   Demonstrate three substantial projects with working code and
    evidence of quality.

### Job-market calibration

At the start, collect 15--20 relevant job descriptions from target
companies. Search for titles such as:

-   AI Engineer
-   Applied AI Engineer
-   Generative AI Engineer
-   Software Engineer, AI
-   LLM Engineer
-   AI Platform Engineer

Create a simple comparison table:

  --------------------------------------------------------------------------
  Company / role Required       Skills already Gaps           Follow-up
                 skills         strong                        
  -------------- -------------- -------------- -------------- --------------
                                                              

  --------------------------------------------------------------------------

Repeat this exercise at Week 12 and Week 24. Look for recurring
requirements rather than overreacting to one job description.

------------------------------------------------------------------------

# Phase 1 --- LLM Engineering Foundations (Weeks 1--4)

**Outcome:** A reliable TypeScript service that calls an LLM, returns
validated structured output, supports tools, and manages a conversation.

## Week 1 --- LLM APIs and the application boundary

### Learn

-   What an LLM does and does not guarantee.
-   Tokens, context windows, temperature, latency, and model selection.
-   System/developer/user messages and conversation history.
-   Provider API basics, authentication, streaming, and error handling.
-   The difference between a model response and an application contract.

### Build

-   [x] Create a TypeScript Node.js project with a clean configuration.
-   [x] Add an LLM provider SDK and keep the API key in environment
    variables.
-   [x] Build a small service with one endpoint that accepts a user
    prompt and returns a response.
-   [x] Add request validation, timeout handling, and a safe error
    response.
-   [x] Log request ID, model, latency, token usage when available, and
    status.
-   [x] Add a tiny CLI or web page to exercise the endpoint.

### Exercise

Send the same task to at least two available models. Compare output
quality, latency, and cost using a small set of representative prompts.
Record the trade-offs.

### Definition of Done

-   [x] A new developer can run the project from the README.
-   [x] Secrets are not committed.
-   [x] Invalid input and provider errors are handled.
-   [x] At least 10 test prompts are saved.
-   [x] A short note explains the chosen model and its trade-offs.

### Suggested resources

-   [OpenAI API
    documentation](https://platform.openai.com/docs/overview)
-   [OpenAI Node.js / TypeScript
    SDK](https://github.com/openai/openai-node)
-   [Vercel AI SDK documentation](https://ai-sdk.dev/docs/introduction)

## Week 2 --- Structured outputs, validation, and tool calling

### Learn

-   JSON / schema-constrained output and its limitations.
-   Function or tool calling: the model proposes a call; application
    code executes it.
-   Runtime validation with Zod.
-   Tool authorization, input validation, and safe error handling.
-   Why a valid JSON response can still be semantically wrong.

### Build

-   [ ] Create a task-extraction endpoint that returns a typed object.
-   [ ] Define a Zod schema for title, description, priority, due date,
    and tags.
-   [ ] Validate model output at runtime; handle invalid or incomplete
    output.
-   [ ] Add two tools, for example `searchTasks` and `createDraftTask`.
-   [ ] Ensure the model cannot execute arbitrary SQL, shell commands,
    or unrestricted network requests.
-   [ ] Add tests for malformed arguments, unknown tools, and denied
    operations.

### Exercise

Create 20 varied inputs, including ambiguous requests and adversarial
instructions. Measure schema validity and task correctness. Improve the
prompt or application logic where necessary.

### Definition of Done

-   [ ] Structured output is validated before use.
-   [ ] Tool execution is implemented in application code, not delegated
    blindly to the model.
-   [ ] Every tool has a narrow schema and permission boundary.
-   [ ] Tests cover success, invalid arguments, and rejected actions.
-   [ ] A short design note explains the trust boundary.

### Suggested resources

-   [OpenAI API guides](https://platform.openai.com/docs/guides)
-   [Zod documentation](https://zod.dev/)
-   [Vercel AI SDK ---
    Tools](https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling)

## Week 3 --- Streaming, conversation state, and UX

### Learn

-   Streaming tokens and partial output.
-   Conversation state and context-window management.
-   Stateless API design versus persisted conversations.
-   Retry behavior, idempotency, and duplicate requests.
-   UX patterns for loading, cancellation, and partial responses.

### Build

-   [ ] Add streaming responses to the service.
-   [ ] Persist conversation messages in PostgreSQL.
-   [ ] Add conversation ownership and access checks.
-   [ ] Add a maximum history / context policy.
-   [ ] Support cancellation or client disconnects gracefully.
-   [ ] Add idempotency protection for any state-changing operation.

### Exercise

Simulate a long conversation that exceeds your chosen context budget.
Implement a simple policy (truncate, summarize, or retrieve relevant
history) and compare the results.

### Definition of Done

-   [ ] Streaming works end-to-end.
-   [ ] Conversation history survives server restarts.
-   [ ] Users cannot access other users' conversations.
-   [ ] Long conversations have a documented context policy.
-   [ ] Retry and cancellation behavior is tested.

### Suggested resources

-   [Vercel AI SDK documentation](https://ai-sdk.dev/docs)
-   [PostgreSQL documentation](https://www.postgresql.org/docs/)

## Week 4 --- Portfolio Project 1: AI Assistant

### Project brief

Build a focused assistant for a realistic workflow, such as an
engineering team assistant that can summarize an issue, extract action
items, and prepare a draft update.

### Required features

-   [ ] Chat interface or CLI.
-   [ ] Streaming responses.
-   [ ] Persisted conversation history.
-   [ ] Structured output for at least one workflow.
-   [ ] At least two safe tools.
-   [ ] Input validation and clear error handling.
-   [ ] Unit and integration tests.
-   [ ] Basic logging and usage tracking.

### Stretch goals

-   [ ] Add user feedback (helpful / not helpful).
-   [ ] Add prompt versioning.
-   [ ] Add a small regression test set.
-   [ ] Add a human confirmation step before a write action.

### Definition of Done

-   [ ] A stranger can run the project using the README.
-   [ ] A demo video or screenshots show the happy path and one failure
    path.
-   [ ] The README includes architecture, limitations, and security
    decisions.
-   [ ] At least 20 test cases are documented.
-   [ ] The project is tagged as `project-1`.

------------------------------------------------------------------------

# Phase 2 --- Retrieval-Augmented Generation (Weeks 5--8)

**Outcome:** An enterprise-style knowledge assistant that retrieves
relevant source material and answers with traceable citations.

## Week 5 --- Embeddings and semantic search

### Learn

-   Embeddings and semantic similarity.
-   Chunking strategies and metadata.
-   Vector search versus keyword search.
-   Similarity metrics and retrieval thresholds.
-   Why embeddings do not guarantee relevance.

### Build

-   [ ] Set up PostgreSQL with `pgvector`, or another vector store if
    there is a strong reason.
-   [ ] Create an ingestion script for a small corpus of documents.
-   [ ] Extract text and metadata (source, title, section, date,
    permissions if relevant).
-   [ ] Chunk documents with overlap and preserve source references.
-   [ ] Generate and store embeddings.
-   [ ] Implement top-k semantic search.

### Exercise

Create a test set of at least 20 questions with known relevant
documents. Inspect the top 5 retrieved chunks and record whether the
correct source appears.

### Definition of Done

-   [ ] Ingestion is repeatable and handles duplicate documents.
-   [ ] Chunks retain source metadata.
-   [ ] Search returns ranked chunks with scores and source identifiers.
-   [ ] A small retrieval test set is committed.
-   [ ] Retrieval failures are recorded, not hidden.

### Suggested resources

-   [DeepLearning.AI --- Retrieval Augmented Generation
    (RAG)](https://www.deeplearning.ai/short-courses/)
-   [pgvector](https://github.com/pgvector/pgvector)
-   [OpenAI embeddings
    guide](https://platform.openai.com/docs/guides/embeddings)

## Week 6 --- Build a basic RAG pipeline

### Learn

-   The RAG pipeline: ingestion, chunking, embedding, retrieval, prompt
    assembly, generation.
-   Grounding answers in retrieved context.
-   Citation design and source attribution.
-   No-answer behavior when evidence is insufficient.
-   Context size and relevance trade-offs.

### Build

-   [ ] Add a question-answer endpoint over the indexed corpus.
-   [ ] Include retrieved chunks in the model context.
-   [ ] Require the answer to cite source identifiers.
-   [ ] Return citations separately from the answer text.
-   [ ] Add a clear "not enough information" behavior.
-   [ ] Log retrieved chunks and the final answer for debugging.

### Exercise

Test 30 questions: answerable, unanswerable, ambiguous, and questions
requiring multiple sources. Check citation correctness manually.

### Definition of Done

-   [ ] Answers include source citations.
-   [ ] The service can abstain when evidence is weak.
-   [ ] The prompt clearly separates trusted application instructions
    from retrieved text.
-   [ ] At least 30 test questions and expected sources are saved.
-   [ ] Common retrieval and grounding failures are documented.

### Suggested resources

-   [OpenAI retrieval / file search
    documentation](https://platform.openai.com/docs/guides/tools-file-search)
-   [DeepLearning.AI short
    courses](https://www.deeplearning.ai/short-courses/)

## Week 7 --- Advanced RAG and retrieval evaluation

### Learn

-   Hybrid search (keyword + vector).
-   Metadata filtering.
-   Reranking and query rewriting.
-   Chunk-size and overlap trade-offs.
-   Retrieval metrics such as Recall@k and MRR.
-   Answer quality versus retrieval quality.

### Build

-   [ ] Add keyword search and combine it with vector search.
-   [ ] Add metadata filters.
-   [ ] Compare at least two chunking strategies.
-   [ ] Add a reranking step if it improves results.
-   [ ] Create an evaluation script for retrieval.
-   [ ] Record latency and cost for each configuration.

### Exercise

Run the same test set against baseline vector search and the improved
pipeline. Report which questions improved, regressed, or remained
unchanged.

### Definition of Done

-   [ ] A repeatable evaluation script exists.
-   [ ] Baseline and improved retrieval metrics are reported.
-   [ ] At least one design decision is supported by measured results.
-   [ ] Latency and cost are measured.
-   [ ] You can explain when hybrid search or reranking is worth the
    complexity.

### Suggested resources

-   [LlamaIndex --- RAG concepts](https://docs.llamaindex.ai/)
-   [LangChain --- retrieval
    concepts](https://python.langchain.com/docs/concepts/retrieval/)

## Week 8 --- Portfolio Project 2: Enterprise Knowledge Assistant

### Project brief

Build a knowledge assistant over a realistic collection of technical
documents, runbooks, product documentation, or company-style policies.

### Required features

-   [ ] Document ingestion pipeline.
-   [ ] Chunking, metadata, embeddings, and vector storage.
-   [ ] Hybrid or otherwise justified retrieval approach.
-   [ ] Answer generation with citations.
-   [ ] Abstention when evidence is insufficient.
-   [ ] Evaluation dataset and retrieval metrics.
-   [ ] Logging of query, retrieved sources, latency, and model usage.
-   [ ] Docker-based local setup.

### Stretch goals

-   [ ] Incremental re-indexing.
-   [ ] Document deletion and re-indexing.
-   [ ] Access-control-aware retrieval.
-   [ ] Feedback capture and evaluation review workflow.
-   [ ] Basic admin page for ingestion status.

### Definition of Done

-   [ ] A demo shows ingestion, a grounded answer, citations, and an
    abstention.
-   [ ] README explains the architecture and retrieval decisions.
-   [ ] Evaluation results are included.
-   [ ] Security limitations are explicit.
-   [ ] The project is tagged as `project-2`.

------------------------------------------------------------------------

# Phase 3 --- Agents and Tool-Orchestrated Workflows (Weeks 9--13)

**Outcome:** A bounded agentic system that uses tools safely, maintains
state, and asks for approval before consequential actions.

## Week 9 --- Agent fundamentals

### Learn

-   Difference between a simple LLM call, a workflow, and an agent.
-   Agent loop: model decision, tool call, tool result, next decision.
-   Tool schemas and permissions.
-   Stop conditions, iteration limits, and timeouts.
-   Why autonomy should be constrained by task risk.

### Build

-   [ ] Convert a multi-step workflow into explicit steps.
-   [ ] Implement a small agent with two read-only tools.
-   [ ] Add a maximum number of steps and an overall timeout.
-   [ ] Capture tool inputs, outputs, and decisions.
-   [ ] Add a fallback path when the agent cannot complete the task.

### Exercise

Give the agent 10 tasks, including impossible tasks and tasks with
missing information. Record whether it stops appropriately or asks a
useful clarification.

### Definition of Done

-   [ ] The agent has explicit tools and stop conditions.
-   [ ] Tool calls are validated and logged.
-   [ ] The system cannot run indefinitely.
-   [ ] Failure and escalation behavior are tested.
-   [ ] You can explain why a deterministic workflow may be better than
    an agent.

### Suggested resources

-   [OpenAI Agents SDK
    documentation](https://openai.github.io/openai-agents-js/)
-   [OpenAI --- A practical guide to building
    agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)

## Week 10 --- Agent state, workflows, and approvals

### Learn

-   State machines and durable workflow state.
-   Checkpointing and resumability.
-   Human-in-the-loop approvals.
-   Idempotent tool execution.
-   Separation of planning from execution.

### Build

-   [ ] Add persisted state to the agent workflow.
-   [ ] Add a human approval step before a write action.
-   [ ] Make write tools idempotent.
-   [ ] Support resuming an interrupted workflow.
-   [ ] Add a clear audit trail.

### Exercise

Simulate a process that fails after a tool call. Resume it and prove
that the previous write action is not duplicated.

### Definition of Done

-   [ ] Workflow state persists.
-   [ ] Approval is required for consequential operations.
-   [ ] Replays do not duplicate writes.
-   [ ] Audit records identify actions and outcomes.
-   [ ] At least three interruption scenarios are tested.

### Suggested resources

-   [OpenAI Agents SDK
    documentation](https://openai.github.io/openai-agents-js/)
-   [Temporal documentation](https://docs.temporal.io/) (useful workflow
    concepts)

## Week 11 --- MCP and tool interoperability

### Learn

-   Model Context Protocol concepts: clients, servers, tools, resources,
    and prompts.
-   Why MCP is an integration protocol, not a guarantee of safety.
-   Authentication, authorization, and trust boundaries.
-   Tool discovery and schema validation.

### Build

-   [ ] Create a small MCP server in TypeScript exposing two safe tools.
-   [ ] Connect a client or compatible development environment.
-   [ ] Add input validation and authorization checks.
-   [ ] Document tool behavior and required permissions.
-   [ ] Test malformed and unauthorized requests.

### Exercise

Compare a direct internal tool integration with an MCP-based
integration. Write down where MCP improves portability and where it adds
operational complexity.

### Definition of Done

-   [ ] MCP server runs locally.
-   [ ] At least two tools work end-to-end.
-   [ ] Inputs and permissions are validated.
-   [ ] README explains how to connect and test it.
-   [ ] No secrets or broad permissions are exposed.

### Suggested resources

-   [MCP TypeScript
    SDK](https://github.com/modelcontextprotocol/typescript-sdk)
-   [MCP documentation](https://modelcontextprotocol.io/introduction)

## Week 12 --- Multi-agent patterns and job-market checkpoint

### Learn

-   Single-agent versus multi-agent architecture.
-   Orchestrator-worker and handoff patterns.
-   Shared state and message passing.
-   Coordination overhead and failure propagation.
-   When multiple agents are unnecessary.

### Build

-   [ ] Implement a small orchestrated workflow with two specialized
    roles, or implement a deterministic equivalent as a comparison.
-   [ ] Define clear input/output contracts for each role.
-   [ ] Add a shared trace/correlation ID.
-   [ ] Compare accuracy, latency, and cost against a single-agent
    baseline.

### Job-market checkpoint

-   [ ] Review 15--20 current job descriptions.
-   [ ] Identify the five most common technical requirements.
-   [ ] Compare requirements with Weeks 1--12 skills.
-   [ ] Adjust Weeks 13--24 only if a clear repeated gap appears.

### Definition of Done

-   [ ] You can explain when multi-agent design is justified.
-   [ ] A measured comparison with a simpler baseline exists.
-   [ ] The workflow has bounded execution and clear contracts.
-   [ ] The job-market gap analysis is updated.

### Suggested resources

-   [OpenAI Agents SDK
    documentation](https://openai.github.io/openai-agents-js/)
-   [LangGraph
    concepts](https://docs.langchain.com/oss/javascript/langgraph/overview)

## Week 13 --- Portfolio Project 3: Business Operations Agent

### Project brief

Build an agent that helps with a bounded business workflow, such as
triaging support tickets, preparing an incident summary, or coordinating
a release checklist.

### Required features

-   [ ] At least three narrowly scoped tools.
-   [ ] A defined workflow with explicit stop conditions.
-   [ ] Read-only and write actions separated.
-   [ ] Human approval before consequential writes.
-   [ ] Persisted state and resumability.
-   [ ] Audit trail and trace IDs.
-   [ ] Tests for unsafe requests, tool failures, and interrupted runs.

### Stretch goals

-   [ ] Expose one capability through MCP.
-   [ ] Add a second specialized agent only if justified.
-   [ ] Add a dashboard showing workflow state.
-   [ ] Add a replayable evaluation set.

### Definition of Done

-   [ ] Demo shows a successful workflow and a rejected unsafe action.
-   [ ] README includes threat model and architecture diagram.
-   [ ] The project explains why an agent was used instead of a simple
    workflow.
-   [ ] The project is tagged as `project-3`.

------------------------------------------------------------------------

# Phase 4 --- Enterprise AI Architecture (Weeks 14--17)

**Outcome:** The ability to design AI features as production services,
not just prototypes.

## Week 14 --- AI microservice architecture

### Learn

-   Service boundaries for model calls, retrieval, orchestration, and
    business logic.
-   Synchronous versus asynchronous execution.
-   Queues, background jobs, and backpressure.
-   API contracts and versioning.
-   Tenant isolation and data boundaries.

### Build

-   [ ] Split one portfolio project into clear modules or services where
    justified.
-   [ ] Add a background job for a long-running task.
-   [ ] Add retry policy with backoff and a dead-letter strategy.
-   [ ] Add request correlation IDs across service boundaries.
-   [ ] Document service ownership and data flow.

### Definition of Done

-   [ ] Long-running work does not block the request path unnecessarily.
-   [ ] Retries are bounded and safe.
-   [ ] Errors are observable across boundaries.
-   [ ] Architecture choices are documented with trade-offs.

### Suggested resources

-   [BullMQ documentation](https://docs.bullmq.io/)
-   [NestJS documentation](https://docs.nestjs.com/)

## Week 15 --- Scaling, performance, and resilience

### Learn

-   Rate limits, concurrency limits, and queue sizing.
-   Caching and semantic caching trade-offs.
-   Timeouts, circuit breakers, and fallbacks.
-   Streaming and perceived latency.
-   Load testing and capacity planning.

### Build

-   [ ] Add provider rate-limit handling.
-   [ ] Add bounded concurrency.
-   [ ] Add caching only for safe, well-defined cases.
-   [ ] Add timeout and fallback behavior.
-   [ ] Run a basic load test and record p50/p95 latency and error rate.

### Exercise

Simulate provider slowness and rate limiting. Show that the system
degrades gracefully rather than exhausting resources.

### Definition of Done

-   [ ] Load test results are saved.
-   [ ] p50 and p95 latency are reported.
-   [ ] Rate-limit and timeout behavior is tested.
-   [ ] Concurrency and retry limits are explicit.
-   [ ] Any cache has a documented invalidation and privacy policy.

### Suggested resources

-   [OpenTelemetry documentation](https://opentelemetry.io/docs/)
-   [k6 documentation](https://grafana.com/docs/k6/latest/)

## Week 16 --- Cloud deployment and delivery

### Learn

-   Containerization and environment configuration.
-   CI/CD and deployment environments.
-   Secrets management.
-   Health checks and graceful shutdown.
-   Cost visibility and operational ownership.

### Build

-   [ ] Dockerize one portfolio project.
-   [ ] Add a CI workflow for linting, tests, and build.
-   [ ] Deploy to a cloud platform.
-   [ ] Configure secrets outside source control.
-   [ ] Add health/readiness endpoints.
-   [ ] Document deployment and rollback steps.

### Definition of Done

-   [ ] A live or reproducible deployment exists.
-   [ ] CI runs on every change.
-   [ ] Secrets are managed safely.
-   [ ] Health checks work.
-   [ ] Deployment and rollback instructions are documented.

### Suggested resources

-   [Docker documentation](https://docs.docker.com/)
-   [GitHub Actions documentation](https://docs.github.com/actions)
-   [Kubernetes concepts](https://kubernetes.io/docs/concepts/) (learn
    fundamentals; do not force Kubernetes into a small project)

## Week 17 --- AI security and privacy

### Learn

-   Prompt injection and indirect prompt injection.
-   Sensitive data exposure and retention.
-   Insecure tool use and excessive agency.
-   Retrieval access-control risks.
-   Output validation and content handling.
-   Threat modeling for LLM applications.

### Build

-   [ ] Write a threat model for one portfolio project.
-   [ ] Add adversarial prompt-injection tests.
-   [ ] Ensure retrieved content is treated as untrusted data.
-   [ ] Enforce authorization in application code, not in prompts.
-   [ ] Add data minimization and redaction where appropriate.
-   [ ] Review logs for accidental secrets or sensitive data.

### Definition of Done

-   [ ] Threat model lists assets, actors, attack paths, and
    mitigations.
-   [ ] At least 10 adversarial tests exist.
-   [ ] Authorization is enforced outside the model.
-   [ ] Sensitive logging is minimized.
-   [ ] Known residual risks are documented.

### Suggested resources

-   [OWASP Top 10 for LLM
    Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
-   [OWASP GenAI Security Project](https://genai.owasp.org/)

------------------------------------------------------------------------

# Phase 5 --- Production AI Quality (Weeks 18--21)

**Outcome:** Evidence that the systems work reliably, can be evaluated,
and can be operated at a reasonable cost.

## Week 18 --- Evaluation and regression testing

### Learn

-   Why "it looks good" is not an evaluation strategy.
-   Golden datasets and regression suites.
-   Deterministic checks versus model-based judging.
-   Retrieval metrics versus answer-quality metrics.
-   Human review and sampling.

### Build

-   [ ] Create a golden dataset for one project.
-   [ ] Include normal, edge, ambiguous, and adversarial cases.
-   [ ] Add automated checks for schema validity, citations, and tool
    permissions.
-   [ ] Add a repeatable evaluation command.
-   [ ] Record baseline results before changing prompts or models.

### Definition of Done

-   [ ] At least 50 evaluation cases exist across the main project.
-   [ ] Evaluation is repeatable.
-   [ ] Results include pass rate and categorized failures.
-   [ ] Prompt or model changes can be compared against a baseline.

### Suggested resources

-   [OpenAI evaluation
    guide](https://platform.openai.com/docs/guides/evals)
-   [Promptfoo documentation](https://www.promptfoo.dev/docs/)

## Week 19 --- Observability and tracing

### Learn

-   Traces, spans, logs, and metrics.
-   Model, prompt, and tool-call observability.
-   Token usage, latency, error rates, and user feedback.
-   Privacy-aware observability.
-   Debugging multi-step workflows.

### Build

-   [ ] Add tracing to model calls and tool calls.
-   [ ] Capture model name, prompt version, latency, token usage, and
    outcome where available.
-   [ ] Add trace correlation across a full request.
-   [ ] Add a dashboard or trace viewer.
-   [ ] Redact secrets and sensitive content.

### Definition of Done

-   [ ] A failed request can be debugged from its trace.
-   [ ] Model and tool calls are visible as separate spans.
-   [ ] Core operational metrics are available.
-   [ ] Sensitive data is not indiscriminately recorded.

### Suggested resources

-   [Langfuse documentation](https://langfuse.com/docs)
-   [OpenTelemetry documentation](https://opentelemetry.io/docs/)

## Week 20 --- Reliability and incident readiness

### Learn

-   Failure budgets and service-level indicators.
-   Provider outages and model fallback strategies.
-   Retry storms and cascading failures.
-   Graceful degradation and human escalation.
-   Incident response and postmortems.

### Build

-   [ ] Define basic SLI targets for one project (availability, latency,
    error rate).
-   [ ] Add provider timeout and outage simulation.
-   [ ] Add a fallback or graceful failure path.
-   [ ] Add a runbook for common failures.
-   [ ] Write a short sample incident postmortem.

### Definition of Done

-   [ ] At least three failure modes are simulated.
-   [ ] The system degrades safely.
-   [ ] A runbook explains detection and recovery.
-   [ ] SLI definitions and measured results are documented.

### Suggested resources

-   [Google SRE Book](https://sre.google/sre-book/table-of-contents/)
-   [OpenTelemetry documentation](https://opentelemetry.io/docs/)

## Week 21 --- Cost and performance optimization

### Learn

-   Cost per request and cost per successful task.
-   Model routing and task/model matching.
-   Prompt/context reduction.
-   Caching, batching, and token budgets.
-   Quality-cost-latency trade-offs.

### Build

-   [ ] Establish a cost baseline for a representative workload.
-   [ ] Compare at least two model/configuration options.
-   [ ] Reduce unnecessary context.
-   [ ] Add token or cost budgets.
-   [ ] Measure quality after optimization to ensure it did not regress
    unacceptably.

### Definition of Done

-   [ ] Cost per representative task is estimated.
-   [ ] Before/after measurements are saved.
-   [ ] Quality, latency, and cost are compared together.
-   [ ] Budget limits and failure behavior are explicit.

### Suggested resources

-   [OpenAI pricing](https://openai.com/api/pricing/)
-   [Provider model and API
    documentation](https://platform.openai.com/docs/overview)

------------------------------------------------------------------------

# Phase 6 --- Portfolio, Positioning, and Interviews (Weeks 22--24)

**Outcome:** A clear professional narrative and a portfolio that
demonstrates senior-level engineering judgment applied to AI systems.

## Week 22 --- Portfolio hardening

### Tasks

-   [ ] Choose the strongest two or three projects.
-   [ ] Ensure each repository has a clear README and setup
    instructions.
-   [ ] Add architecture diagrams.
-   [ ] Add tests and evaluation results.
-   [ ] Add a short demo video or screenshots.
-   [ ] Document limitations and next steps.
-   [ ] Remove secrets, personal data, and accidental credentials.
-   [ ] Make the local setup reproducible with Docker where practical.

### Definition of Done

A technical reviewer can understand what each project does, run it,
inspect the design, and see evidence that it was tested.

## Week 23 --- CV, LinkedIn, and technical narrative

### Tasks

-   [ ] Rewrite the professional summary to connect senior
    backend/full-stack experience with applied AI engineering.
-   [ ] Describe AI projects in terms of engineering outcomes, not just
    tools used.
-   [ ] Highlight architecture, reliability, evaluation, security, and
    cost decisions.
-   [ ] Add links to the strongest repositories and demos.
-   [ ] Prepare a concise explanation of why the transition is a logical
    next step.
-   [ ] Ask one experienced engineer to review the CV and portfolio.

### Suggested positioning

"Senior software engineer specializing in TypeScript, Node.js, and
distributed systems, now building production-oriented AI applications
with LLM APIs, RAG, tool orchestration, evaluation, and observability."

Adapt this statement to reflect only work that can be demonstrated
honestly.

### Definition of Done

-   [ ] CV is updated and factually accurate.
-   [ ] LinkedIn headline and About section are aligned with target
    roles.
-   [ ] Each portfolio project has a concise impact-oriented
    description.
-   [ ] A reviewer has provided feedback and at least one revision is
    complete.

## Week 24 --- Interview preparation and applications

### Technical preparation

-   [ ] Practice explaining transformer/LLM fundamentals at an
    application-engineering level.
-   [ ] Practice designing a RAG system for a large organization.
-   [ ] Practice designing a tool-using agent with permissions and
    approvals.
-   [ ] Practice AI system reliability, evaluation, observability, and
    cost trade-offs.
-   [ ] Practice a backend/system-design interview using existing
    strengths.
-   [ ] Practice coding in TypeScript under time constraints.
-   [ ] Prepare examples of debugging, ownership, architecture
    trade-offs, and mentoring.

### Application preparation

-   [ ] Revisit 15--20 current job descriptions.
-   [ ] Identify the best-fit role titles and company types.
-   [ ] Prepare a tailored CV version for AI Engineer / Applied AI
    Engineer roles.
-   [ ] Prepare a short project walkthrough for each portfolio project.
-   [ ] Start a focused application and networking pipeline.

### Definition of Done

-   [ ] Three project walkthroughs can be delivered in 5--10 minutes
    each.
-   [ ] At least two AI system-design questions have been practiced
    end-to-end.
-   [ ] CV and portfolio are ready to share.
-   [ ] A target-company list and application tracker exist.
-   [ ] A next 30-day plan is written based on remaining gaps.

------------------------------------------------------------------------

# Recommended Technical Stack

Use this as a default, not as a checklist of technologies to collect.

  -----------------------------------------------------------------------
  Area                    Recommended starting    Notes
                          point                   
  ----------------------- ----------------------- -----------------------
  Main language           TypeScript              Keep the existing
                                                  advantage

  Runtime                 Node.js 22 LTS or       Use a supported version
                          current supported LTS   

  API framework           NestJS or a lightweight Prefer what is already
                          Node framework          familiar

  LLM integration         Provider's official     Understand raw API
                          SDK; optionally Vercel  behavior too
                          AI SDK                  

  Validation              Zod                     Validate all model/tool
                                                  boundaries

  Database                PostgreSQL              Relational data and
                                                  operational state

  Vector search           pgvector                Good starting point for
                                                  portfolio RAG

  Background jobs         BullMQ + Redis          For asynchronous
                                                  workflows

  Agent orchestration     OpenAI Agents SDK or a  Pick one primary
                          clearly defined custom  approach
                          workflow                

  Interoperability        MCP TypeScript SDK      Learn protocol and
                                                  trust boundaries

  Testing                 Vitest or Jest          Include integration and
                                                  regression tests

  Observability           OpenTelemetry +         Trace model and tool
                          Langfuse                behavior

  Packaging               Docker                  Reproducible local and
                                                  deployed environments

  Python                  Basic working           Read notebooks and
                          proficiency             ecosystem examples
  -----------------------------------------------------------------------

### Framework strategy

Do not try to master all frameworks in parallel.

1.  First understand direct model API calls, structured outputs, and
    tool calling.
2.  Choose one primary TypeScript integration/orchestration approach for
    the first projects.
3.  Learn MCP as an interoperability protocol.
4.  Study LangGraph concepts later to understand stateful graph
    workflows; implement a small comparison only if useful.
5.  Use Python when a library or task genuinely benefits from it, not
    because AI engineering is assumed to require abandoning TypeScript.

------------------------------------------------------------------------

# Portfolio Quality Checklist

Use this checklist for each of the three projects.

-   [ ] Clear problem statement and intended user.
-   [ ] Architecture diagram and explanation of major decisions.
-   [ ] Reproducible setup instructions.
-   [ ] Environment variable example file with no real secrets.
-   [ ] Input validation and explicit error handling.
-   [ ] Unit tests and integration tests.
-   [ ] Evaluation dataset and measured results.
-   [ ] Logging/tracing appropriate to the project's maturity.
-   [ ] Security and privacy considerations.
-   [ ] Known limitations and future improvements.
-   [ ] Demo video, screenshots, or hosted demonstration.
-   [ ] Clear explanation of why the chosen architecture is appropriate.

# Interview Topics to Be Able to Explain

## LLM application fundamentals

-   Tokens and context windows.
-   Temperature and model selection.
-   Structured output and validation.
-   Tool calling and application-side execution.
-   Streaming, retries, and conversation state.
-   Prompt injection and untrusted content.

## RAG

-   Chunking and metadata.
-   Embeddings and vector search.
-   Hybrid search and reranking.
-   Retrieval evaluation.
-   Citation grounding and abstention.
-   Access-control-aware retrieval.

## Agents and workflows

-   Workflow versus agent.
-   Agent loop and stop conditions.
-   Tool permissions and approvals.
-   Durable state and idempotency.
-   MCP concepts.
-   When multi-agent systems are justified.

## Production engineering

-   Latency, throughput, rate limits, and concurrency.
-   Caching and cost controls.
-   Evaluation and regression testing.
-   Observability and tracing.
-   Security and privacy.
-   Failure handling and graceful degradation.

## Senior engineering strengths to emphasize

-   Distributed systems and microservices.
-   API design and service boundaries.
-   Reliability and operational ownership.
-   Testing strategy and code quality.
-   Architecture trade-offs.
-   Mentoring, technical leadership, and delivery.

------------------------------------------------------------------------

# Progress Tracker

Update this table at the end of each week.

  -------------------------------------------------------------------------------
           Week Focus           Planned hours  Actual hours Status     Main
                                                                       evidence /
                                                                       notes
  ------------- --------------- ------------- ------------- ---------- ----------
              1 LLM APIs                                    Not        
                                                            started    

              2 Structured                                  Not        
                outputs and                                 started    
                tools                                                  

              3 Streaming and                               Not        
                state                                       started    

              4 Project 1: AI                               Not        
                Assistant                                   started    

              5 Embeddings and                              Not        
                search                                      started    

              6 Basic RAG                                   Not        
                                                            started    

              7 Advanced RAG                                Not        
                and evaluation                              started    

              8 Project 2:                                  Not        
                Knowledge                                   started    
                Assistant                                              

              9 Agent                                       Not        
                fundamentals                                started    

             10 State and                                   Not        
                approvals                                   started    

             11 MCP                                         Not        
                                                            started    

             12 Multi-agent                                 Not        
                patterns and                                started    
                market check                                           

             13 Project 3:                                  Not        
                Operations                                  started    
                Agent                                                  

             14 AI microservice                             Not        
                architecture                                started    

             15 Scaling and                                 Not        
                resilience                                  started    

             16 Cloud                                       Not        
                deployment                                  started    

             17 AI security                                 Not        
                                                            started    

             18 Evaluation and                              Not        
                regression                                  started    

             19 Observability                               Not        
                                                            started    

             20 Reliability and                             Not        
                incidents                                   started    

             21 Cost                                        Not        
                optimization                                started    

             22 Portfolio                                   Not        
                hardening                                   started    

             23 CV and LinkedIn                             Not        
                                                            started    

             24 Interviews and                              Not        
                applications                                started    
  -------------------------------------------------------------------------------

Suggested status values: `Not started`, `In progress`, `Blocked`,
`Done`.

# Weekly Review Template

Copy this block at the end of each week.

``` text
## Week __ Review

Planned hours:
Actual hours:

What I built:
What I learned:
Evidence (PR, commit, demo, evaluation report):

What went well:
What was harder than expected:
Biggest technical question still open:

Definition of Done:
- [ ] All required tasks complete
- [ ] Tests / evaluation run
- [ ] Notes and evidence saved
- [ ] README / documentation updated

Next week's first task:
```

# Final Success Criteria

At the end of 24 weeks, aim to have:

-   [ ] Three substantial AI application projects.
-   [ ] At least one deployed application.
-   [ ] One RAG system with a repeatable evaluation set and citations.
-   [ ] One tool-using agent/workflow with permissions, approvals, and
    durable state.
-   [ ] Automated tests and evaluation evidence.
-   [ ] Observability for model and tool execution.
-   [ ] Documented security, reliability, and cost decisions.
-   [ ] Updated CV and LinkedIn profile.
-   [ ] A target-company list and interview practice completed.

**Important:** This plan improves readiness; it does not guarantee a job
offer. The strongest signal will be the ability to explain and
demonstrate sound engineering decisions in working systems, not the
number of courses or frameworks completed.
