export {};

import fs from "node:fs";
import path from "node:path";

import { sanityEnsureAuthor } from "../lib/sanity";

function loadDotEnvLocal() {
  try {
    const filePath = path.join(process.cwd(), ".env.local");
    const raw = fs.readFileSync(filePath, "utf8");
    const lines = raw.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx <= 0) continue;
      const key = trimmed.slice(0, idx).trim();
      const valueRaw = trimmed.slice(idx + 1).trim();
      const value = valueRaw.startsWith("\"") && valueRaw.endsWith("\"") ? valueRaw.slice(1, -1) : valueRaw;
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {}
}

async function main() {
  loadDotEnvLocal();
  const id = await sanityEnsureAuthor({
    slug: "boomkas-team",
    name: "Boomkas Team",
    bio: "We test AI tools hands-on across real workflows and publish practical, verifiable takeaways.",
    credentials: "Hands-on AI tool testing • Automation workflows • Agentic systems",
  });
  console.log(`OK: ensured author ${id}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
