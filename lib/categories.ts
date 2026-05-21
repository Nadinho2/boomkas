export type CategoryPage = {
  slug:
    | "ai-writing-tools"
    | "ai-image-tools"
    | "ai-coding-tools"
    | "ai-productivity-tools"
    | "ai-marketing-tools";
  title: string;
  intro: string;
  exampleToolSlugs: string[];
};

export const CATEGORY_PAGES: CategoryPage[] = [
  {
    slug: "ai-writing-tools",
    title: "AI Writing Tools",
    intro:
      "AI writing tools help teams produce drafts faster, but the best results come from the right workflow. A strong writing tool isn’t just “good at words”—it supports planning, structure, sources, and revision. For commercial intent pages (reviews, best-of lists), you want tools that can follow briefs, maintain consistent tone, and handle iterative edits without drifting. For informational intent content (guides, explainers), you want accuracy, clarity, and the ability to cite original sources.\n\nAt Boomkas, we evaluate writing tools by how they handle real constraints: outlining from a messy prompt, rewriting for different audiences, preserving factual claims, and producing reusable templates. We also look at “editability”—how easy it is to correct the output and keep the model consistent across rounds. Many tools look impressive in a single generation but fall apart when you ask for a second pass with strict requirements.\n\nIf you’re building a content engine, prioritize tools that support workflow, not just generation. Look for features like reusable prompts, style guides, team collaboration, and integration into your publishing pipeline. Also consider the risk profile: if you publish content publicly, you need explicit disclosures, strong QA, and a process for updating pages when pricing or product features change. That’s how you avoid thin content and build durable topical authority.",
    exampleToolSlugs: ["chatgpt", "claude", "perplexity"],
  },
  {
    slug: "ai-image-tools",
    title: "AI Image Tools",
    intro:
      "AI image tools are now part of most modern content and product workflows: thumbnails, ads, UI mockups, and quick creative iteration. The best tool depends on your target output and your tolerance for manual cleanup. If you need brand-consistent, reusable assets, your workflow should include style references, prompt libraries, and iteration checkpoints. If you only need occasional images, a simple interface with strong defaults is often enough.\n\nWe look at image tools through a builder lens: output quality, controllability, and repeatability. Can you regenerate variations without losing the core composition? Can you keep a consistent character or product style across images? Can you export in sizes that match your web performance targets? The details matter for real-world use—especially when images are above the fold and influence LCP.\n\nFor teams, the differentiators are collaboration, licensing clarity, and integration into existing design tools. If your site runs on Vercel, image delivery and caching strategy matters too: you want descriptive alt text, the right dimensions, and optimized delivery via modern formats. The goal isn’t just to create images; it’s to create images that support the page’s intent and load quickly on mobile.",
    exampleToolSlugs: ["midjourney", "ideogram", "leonardo-ai"],
  },
  {
    slug: "ai-coding-tools",
    title: "AI Coding Tools",
    intro:
      "AI coding tools range from autocomplete assistants to fully agentic systems that plan, edit multiple files, run tests, and ship changes. The right tool depends on your workflow: quick feature iteration, debugging, refactors, or end-to-end app building. Autonomy is valuable, but only when it stays verifiable. Builders need tools that can explain changes, follow repository conventions, and recover from errors without breaking the project.\n\nOur reviews emphasize first-hand testing: we run real tasks like adding a feature behind a flag, refactoring for performance, fixing build errors, and wiring CI-friendly outputs. We look for practical signals: how often the agent makes unsafe assumptions, whether it respects the existing architecture, and how reliably it can handle multi-step tasks. A tool that writes decent code once can still be a poor daily driver if it wastes time on rework.\n\nFor production teams, governance matters: permissions, audit trails, and predictable costs. For solo founders, speed and zero setup often win—especially for in-browser builders. The best tools combine strong models, solid UX, and a workflow that keeps you in control.",
    exampleToolSlugs: ["cursor", "github-copilot", "windsurf"],
  },
  {
    slug: "ai-productivity-tools",
    title: "AI Productivity Tools",
    intro:
      "AI productivity tools help individuals and teams reduce coordination overhead: summarizing meetings, drafting docs, pulling action items, and automating repetitive workflows. The biggest mistake is choosing tools based on novelty instead of fit. For real productivity gains, you need a clear workflow: where inputs come from (email, docs, tickets), how outputs are validated, and what gets automated versus reviewed by a human.\n\nWe evaluate productivity tools by the quality of their integrations and the reliability of their outputs over time. A productivity agent that can’t connect to your real stack becomes another chat app. We also check whether the tool supports safe automation: permission scopes, logs, and the ability to roll back or approve actions. This is especially important when agents can write to systems like Google Drive, Notion, or ticketing platforms.\n\nIn practice, the best productivity tools act like an operational layer: they reduce context switching and make it easy to capture and execute work. If you’re building a content or product machine, look for tools that improve throughput without increasing risk.",
    exampleToolSlugs: ["notion-ai", "zapier", "n8n"],
  },
  {
    slug: "ai-marketing-tools",
    title: "AI Marketing Tools",
    intro:
      "AI marketing tools sit at the intersection of content, analytics, and experimentation. They can help generate ad variations, landing pages, email sequences, and performance insights. But ranking and conversion improvements come from strategy and iteration—not from more output. Helpful content requires a real point of view, proof, and maintenance. So the best marketing stack combines generation with evaluation and data.\n\nWe look for tools that support the full lifecycle: research, creation, distribution, and measurement. That includes workflow builders for automated publishing, personalization, and reporting. We also consider compliance and trust: clear disclosures, accurate claims, and source citations. Over time, this reduces the risk of thin content flags and improves brand credibility.\n\nIf you’re scaling marketing, prioritize systems that create consistent assets and tie them to measurable outcomes. The goal is sustainable authority: pages that get better every month as your data, testing insights, and internal link structure improve.",
    exampleToolSlugs: ["hubspot", "zapier", "make"],
  },
];

export const CATEGORY_BY_SLUG: Record<string, CategoryPage> = Object.fromEntries(
  CATEGORY_PAGES.map((c) => [c.slug, c])
);

