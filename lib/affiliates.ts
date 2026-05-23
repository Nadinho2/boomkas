import { SITE_ORIGIN } from "@/lib/seo";

export type AffiliateEntry = {
  slug: string;
  label: string;
  url: string;
  hasAffiliate: boolean;
  officialUrl: string;
  badge?: string;
};

type AffiliateSeed = {
  slug: string;
  name: string;
  officialUrl: string;
  rating: number;
  hasFreeTier: boolean;
};

const AFFILIATE_SEEDS: AffiliateSeed[] = [
  { slug: "cursor", name: "Cursor", officialUrl: "https://cursor.com", rating: 4.6, hasFreeTier: true },
  { slug: "openai-operator", name: "OpenAI Operator", officialUrl: "https://openai.com", rating: 4.6, hasFreeTier: false },
  { slug: "claude-code", name: "Claude Code", officialUrl: "https://www.anthropic.com", rating: 4.5, hasFreeTier: false },
  { slug: "n8n", name: "n8n", officialUrl: "https://n8n.io", rating: 4.45, hasFreeTier: true },
  { slug: "crewai", name: "CrewAI", officialUrl: "https://crewai.com", rating: 4.4, hasFreeTier: true },
  { slug: "copilot-studio", name: "Copilot Studio", officialUrl: "https://copilotstudio.microsoft.com", rating: 4.4, hasFreeTier: false },
  { slug: "trae", name: "Trae", officialUrl: "https://trae.ai", rating: 4.35, hasFreeTier: true },
  { slug: "make", name: "Make.com", officialUrl: "https://www.make.com", rating: 4.35, hasFreeTier: true },
  { slug: "devin", name: "Devin AI", officialUrl: "https://www.cognition.ai", rating: 4.3, hasFreeTier: false },
  { slug: "zapier-agents", name: "Zapier Agents", officialUrl: "https://zapier.com", rating: 4.3, hasFreeTier: true },
  { slug: "langgraph", name: "LangGraph", officialUrl: "https://langchain.com/langgraph", rating: 4.3, hasFreeTier: true },
  { slug: "decagon", name: "Decagon", officialUrl: "https://decagon.ai", rating: 4.3, hasFreeTier: false },
  { slug: "relay", name: "Relay.app", officialUrl: "https://relay.app", rating: 4.25, hasFreeTier: false },
  { slug: "lindy", name: "Lindy", officialUrl: "https://lindy.ai", rating: 4.25, hasFreeTier: false },
  { slug: "lovable", name: "Lovable", officialUrl: "https://lovable.dev", rating: 4.2, hasFreeTier: true },
  { slug: "windsurf", name: "Windsurf", officialUrl: "https://codeium.com/windsurf", rating: 4.2, hasFreeTier: false },
  { slug: "zed-agent", name: "Zed", officialUrl: "https://zed.dev", rating: 4.2, hasFreeTier: true },
  { slug: "taskade-genesis", name: "Taskade Genesis", officialUrl: "https://www.taskade.com", rating: 4.2, hasFreeTier: true },
  { slug: "manus", name: "Manus", officialUrl: "https://manus.ai", rating: 4.2, hasFreeTier: true },
  { slug: "relevance-ai", name: "Relevance AI", officialUrl: "https://relevanceai.com", rating: 4.2, hasFreeTier: true },
  { slug: "pipedream-agents", name: "Pipedream Agents", officialUrl: "https://pipedream.com", rating: 4.2, hasFreeTier: true },
  { slug: "intercom-fin", name: "Intercom Fin", officialUrl: "https://www.intercom.com", rating: 4.2, hasFreeTier: false },
  { slug: "gumloop", name: "Gumloop", officialUrl: "https://gumloop.com", rating: 4.15, hasFreeTier: true },
  { slug: "pearai", name: "PearAI", officialUrl: "https://pearai.com", rating: 4.1, hasFreeTier: true },
  { slug: "autogen", name: "AutoGen", officialUrl: "https://github.com/microsoft/autogen", rating: 4.1, hasFreeTier: true },
  { slug: "stack-ai", name: "Stack AI", officialUrl: "https://www.stack-ai.com", rating: 4.1, hasFreeTier: false },
  { slug: "salesforce-agentforce", name: "Salesforce Agentforce", officialUrl: "https://www.salesforce.com", rating: 4.1, hasFreeTier: false },
  { slug: "hubspot-breeze-agents", name: "HubSpot Breeze Agents", officialUrl: "https://www.hubspot.com", rating: 4.1, hasFreeTier: false },
  { slug: "notion-ai-agents", name: "Notion AI", officialUrl: "https://www.notion.so", rating: 4.1, hasFreeTier: false },
  { slug: "workbeaver", name: "Workbeaver", officialUrl: "https://workbeaver.ai", rating: 4.0, hasFreeTier: true },
  { slug: "airops", name: "AirOps", officialUrl: "https://www.airops.com", rating: 4.0, hasFreeTier: false },
  { slug: "bardeen", name: "Bardeen", officialUrl: "https://www.bardeen.ai", rating: 4.0, hasFreeTier: true },
  { slug: "asana-ai-studio", name: "Asana AI Studio", officialUrl: "https://asana.com", rating: 4.0, hasFreeTier: false },
  { slug: "bolt-new", name: "Bolt.new", officialUrl: "https://bolt.new", rating: 4.39, hasFreeTier: true },
  { slug: "replit-agent", name: "Replit Agent", officialUrl: "https://replit.com", rating: 4.3, hasFreeTier: true },
  { slug: "v0-vercel", name: "v0 by Vercel", officialUrl: "https://v0.dev", rating: 4.2, hasFreeTier: true },
  {
    slug: "github-copilot",
    name: "GitHub Copilot",
    officialUrl: "https://github.com/features/copilot",
    rating: 4.3,
    hasFreeTier: true,
  },
  { slug: "gemini-cli", name: "Gemini CLI", officialUrl: "https://github.com/google-gemini/gemini-cli", rating: 4.1, hasFreeTier: true },
  { slug: "dify-ai", name: "Dify.ai", officialUrl: "https://dify.ai", rating: 4.3, hasFreeTier: true },
  { slug: "flowise", name: "Flowise", officialUrl: "https://flowiseai.com", rating: 4.1, hasFreeTier: true },
  { slug: "dust-tt", name: "Dust.tt", officialUrl: "https://dust.tt", rating: 4.1, hasFreeTier: true },
  { slug: "sierra", name: "Sierra", officialUrl: "https://sierra.ai", rating: 4.2, hasFreeTier: false },
  {
    slug: "servicenow-ai-agents",
    name: "ServiceNow AI Agents",
    officialUrl: "https://www.servicenow.com/products/ai-agents.html",
    rating: 4.1,
    hasFreeTier: false,
  },
  {
    slug: "vertex-ai-agent-builder",
    name: "Google Vertex AI Agent Builder",
    officialUrl: "https://cloud.google.com/products/agent-builder",
    rating: 4.2,
    hasFreeTier: true,
  },
  { slug: "coze", name: "Coze", officialUrl: "https://www.coze.com", rating: 4.1, hasFreeTier: true },
];

const BEST_DEAL_SLUGS = new Set(
  [...AFFILIATE_SEEDS]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)
    .map((s) => s.slug)
);

function buildLabel(seed: AffiliateSeed) {
  return `Get ${seed.name}`;
}

export const AFFILIATES: Record<string, AffiliateEntry> = Object.fromEntries(
  AFFILIATE_SEEDS.map((seed) => {
    const url = `${SITE_ORIGIN}/go/${seed.slug}`;
    const badge = BEST_DEAL_SLUGS.has(seed.slug) ? "Best Deal" : seed.hasFreeTier ? "Free Trial" : undefined;
    return [
      seed.slug,
      {
        slug: seed.slug,
        label: buildLabel(seed),
        url,
        hasAffiliate: true,
        officialUrl: seed.officialUrl,
        ...(badge ? { badge } : {}),
      } satisfies AffiliateEntry,
    ];
  })
) as Record<string, AffiliateEntry>;

export function getAffiliateLink(slug: string): AffiliateEntry | null {
  return AFFILIATES[slug] ?? null;
}
