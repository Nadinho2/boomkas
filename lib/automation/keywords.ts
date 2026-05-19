import { parseCsv } from "@/lib/automation/csv";

export type KeywordRow = {
  keyword: string;
  volume?: number;
  difficulty?: number;
};

function normalizeKeyword(keyword: string) {
  return keyword.replace(/\s+/g, " ").trim();
}

function parseNumber(value: string | undefined) {
  if (!value) return undefined;
  const n = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

export async function fetchKeywordsFromCsvUrl(csvUrl: string): Promise<KeywordRow[]> {
  const res = await fetch(csvUrl, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch CSV (${res.status})`);
  const text = await res.text();
  const rows = parseCsv(text);
  if (rows.length === 0) return [];

  const header = rows[0].map((h) => h.toLowerCase().trim());
  const keywordIdx = header.findIndex((h) => h === "keyword" || h === "keywords" || h.includes("keyword"));
  const volumeIdx = header.findIndex((h) => h === "volume" || h.includes("search volume"));
  const difficultyIdx = header.findIndex((h) => h === "difficulty" || h.includes("kd") || h.includes("difficulty"));

  const seen = new Set<string>();
  const out: KeywordRow[] = [];

  for (const r of rows.slice(1)) {
    const raw = r[keywordIdx >= 0 ? keywordIdx : 0] ?? "";
    const keyword = normalizeKeyword(raw);
    if (!keyword) continue;
    const key = keyword.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({
      keyword,
      volume: parseNumber(volumeIdx >= 0 ? r[volumeIdx] : undefined),
      difficulty: parseNumber(difficultyIdx >= 0 ? r[difficultyIdx] : undefined),
    });
  }

  return out;
}

