export type GlossaryTerm = {
  term: string;
  definition: string;
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Agentic AI",
    definition:
      "Systems that plan and execute multi-step tasks (often with tools) rather than only generating text responses.",
  },
  {
    term: "Autonomy",
    definition:
      "How independently an agent can act. Higher autonomy needs stronger verification, permissions, and rollback paths.",
  },
  {
    term: "RAG",
    definition:
      "Retrieval-Augmented Generation. The model pulls relevant documents from a source before answering or acting.",
  },
  {
    term: "Tool Use",
    definition:
      "When an agent calls functions/APIs like search, databases, or code execution to complete tasks.",
  },
  {
    term: "Workflow Automation",
    definition:
      "Orchestrating triggers, actions, and integrations (often with approvals) to execute repeatable processes.",
  },
  {
    term: "Evaluation",
    definition:
      "Measuring quality and reliability using tests, benchmarks, human review, and guardrail metrics like hallucination rate.",
  },
  {
    term: "Prompt Drift",
    definition:
      "When an AI’s output becomes inconsistent over iterative edits, often losing constraints or style requirements.",
  },
  {
    term: "INP",
    definition:
      "Interaction to Next Paint. A Core Web Vitals metric that reflects how quickly pages respond to user interactions.",
  },
];

