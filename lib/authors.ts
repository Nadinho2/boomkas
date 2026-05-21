export type AuthorProfile = {
  slug: string;
  name: string;
  role: string;
  credentials: string[];
  bio: string;
  expertise: string[];
  email: string;
  socials: Array<{ label: string; url: string }>;
  photoDataUri: string;
};

const AVATAR_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cdefs%3E%3CradialGradient id='g' cx='30%25' cy='25%25' r='80%25'%3E%3Cstop offset='0%25' stop-color='rgba(0,240,255,0.55)'/%3E%3Cstop offset='60%25' stop-color='rgba(0,0,0,0)'/%3E%3C/radialGradient%3E%3CradialGradient id='o' cx='80%25' cy='75%25' r='80%25'%3E%3Cstop offset='0%25' stop-color='rgba(255,107,0,0.45)'/%3E%3Cstop offset='60%25' stop-color='rgba(0,0,0,0)'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='56' fill='rgb(6,10,20)'/%3E%3Crect width='240' height='240' rx='56' fill='url(%23g)'/%3E%3Crect width='240' height='240' rx='56' fill='url(%23o)'/%3E%3Ccircle cx='120' cy='98' r='34' fill='rgba(255,255,255,0.10)'/%3E%3Cpath d='M54 196c14-34 42-52 66-52s52 18 66 52' fill='rgba(255,255,255,0.10)'/%3E%3C/svg%3E";

export const AUTHORS: Record<string, AuthorProfile> = {
  "boomkas-team": {
    slug: "boomkas-team",
    name: "Boomkas Team",
    role: "Editorial & Testing",
    credentials: [
      "Hands-on testing of AI tools",
      "Workflow benchmarking across coding and automation stacks",
      "Affiliate disclosure compliant reviews",
    ],
    bio:
      "Boomkas reviews agentic AI tools with a builder-first approach. We test common workflows, document trade-offs, and update reviews when pricing and features change.",
    expertise: ["AI coding tools", "Workflow automation", "Multi-agent systems", "Evaluation rubrics"],
    email: "hello@boomkas.com",
    socials: [
      { label: "X", url: "https://x.com" },
      { label: "LinkedIn", url: "https://linkedin.com" },
    ],
    photoDataUri: AVATAR_PLACEHOLDER,
  },
};

export function getAuthorBySlug(slug: string) {
  return AUTHORS[slug] ?? null;
}

export function defaultAuthor() {
  return AUTHORS["boomkas-team"];
}

