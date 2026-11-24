# AI Engineering Roadmap

A 24-week structured transition plan and hands-on repository transforming a Senior Full-Stack Developer into a Production AI Engineer.

---

## 🧭 Navigation & Knowledge Base

- **Interactive Web Portal:** Open [`docs/index.html`](file:///home/arye/Documents/private/repos/ai-engineering-roadmap/docs/index.html) in your browser for live Mermaid diagrams, concept search, syntax-highlighted code, and collapsible interview prep accordions.
- **Git Markdown Knowledge Base:** [`docs/AI_CONCEPTS_KNOWLEDGE_BASE.md`](file:///home/arye/Documents/private/repos/ai-engineering-roadmap/docs/AI_CONCEPTS_KNOWLEDGE_BASE.md)
- **Transition Roadmap Plan:** [`24-week-ai-engineer-transition-plan.md`](file:///home/arye/Documents/private/repos/ai-engineering-roadmap/24-week-ai-engineer-transition-plan.md)
- **Trello Workflow Rules:** [`AGENTS.md`](file:///home/arye/Documents/private/repos/ai-engineering-roadmap/AGENTS.md)

---

## 🔑 Generating a Google Gemini API Key

Most weekly projects in this roadmap leverage Google Gemini models (`gemini-2.5-flash`, `gemini-2.5-pro`) via the Vercel AI SDK. Follow these steps to generate a free API key:

1. **Go to Google AI Studio:**
   - Visit [Google AI Studio](https://aistudio.google.com/) and sign in with your Google account.

2. **Access the API Keys Dashboard:**
   - Click **"Get API key"** on the left menu, or go directly to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).

3. **Create Your Key:**
   - Click the blue **"Create API key"** button.
   - Choose **"Create API key in new project"** for a quick default setup, or link to an existing Google Cloud project.

4. **Copy the Key:**
   - Copy the generated API key (it begins with `AIzaSy...`).

5. **Configure Locally:**
   - In each weekly application directory (e.g. `apps/week-01-llm-boundary/`), create your `.env` file from `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Set the key:
     ```env
     GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyYourGeneratedKeyHere
     ```
   - `.env` files are strictly excluded from version control via `.gitignore`.

---

## 📁 Repository Structure

```text
ai-engineering-roadmap/
├── 24-week-ai-engineer-transition-plan.md  # Complete 24-week curriculum
├── AGENTS.md                               # Trello task specifications & guidelines
├── POST_TICKET_PROMPT.md                   # Mandatory post-ticket concept synthesis prompt
├── docs/
│   ├── index.html                          # Interactive documentation web portal
│   └── AI_CONCEPTS_KNOWLEDGE_BASE.md       # Git-tracked markdown knowledge base
└── apps/
    └── week-01-llm-boundary/               # Week 01: LLM APIs & Application Boundary
```

---

## 🚀 Active Weekly Applications

### [Week 01: LLM APIs and the Application Boundary](file:///home/arye/Documents/private/repos/ai-engineering-roadmap/apps/week-01-llm-boundary)
- **Focus:** Application boundary wrapper, Zod contracts, timeout handling, secret hygiene, dual-model benchmark comparison, interactive CLI.
- **Quickstart:**
  ```bash
  cd apps/week-01-llm-boundary
  npm install
  cp .env.example .env  # Add your Gemini key
  npm run dev           # Start Express API server
  npm run cli           # Launch interactive REPL
  npm run benchmark     # Run evaluation suite
  ```
