export type QualityCheckKey =
  | "first_hand_sections"
  | "tested_by_line"
  | "last_tested_line"
  | "word_count_1500"
  | "pricing_section"
  | "pros_5"
  | "cons_5"
  | "comparison_section"
  | "faq_section"
  | "affiliate_links"
  | "updated_line"
  | "internal_links_5";

export type QualityReport = {
  score: number;
  wordCount: number;
  internalLinkCount: number;
  hasAffiliate: boolean;
  checks: Record<QualityCheckKey, boolean>;
  extracted: {
    testedBy?: string;
    lastTestedISO?: string;
    updatedISO?: string;
  };
};

function normalizeHeadingText(input: string) {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function firstLines(text: string, maxLines: number) {
  const lines = text.split(/\r?\n/);
  return lines.slice(0, Math.max(1, maxLines));
}

function extractTopLineValue(lines: string[], label: string) {
  const rx = new RegExp(`^\\s*${label}\\s*:\\s*(.+?)\\s*$`, "i");
  for (const line of lines) {
    const m = line.match(rx);
    if (m && m[1]) return m[1].trim();
  }
  return undefined;
}

function parseTopDateISO(lines: string[], label: string) {
  const raw = extractTopLineValue(lines, label);
  if (!raw) return undefined;
  const datePart = raw.trim().slice(0, 10);
  const t = Date.parse(datePart);
  if (!Number.isFinite(t)) return undefined;
  return new Date(t).toISOString();
}

function h2Headings(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const headings: string[] = [];
  for (const line of lines) {
    if (line.startsWith("## ")) headings.push(normalizeHeadingText(line.slice(3)));
  }
  return headings;
}

function hasH2(markdown: string, heading: string) {
  const want = normalizeHeadingText(heading);
  return h2Headings(markdown).some((h) => h === want);
}

function countListItemsUnderH2(markdown: string, heading: string) {
  const lines = markdown.split(/\r?\n/);
  const want = normalizeHeadingText(heading);
  let inSection = false;
  let count = 0;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      const h = normalizeHeadingText(line.slice(3));
      inSection = h === want;
      continue;
    }
    if (line.startsWith("# ")) {
      inSection = false;
      continue;
    }
    if (!inSection) continue;

    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) count += 1;
  }

  return count;
}

function countInternalMarkdownLinks(markdown: string) {
  const rx = /\]\((\/(?:blog|tools|categories|use-cases|compare|guides)\/[a-z0-9\-\/]+)\)/gi;
  const set = new Set<string>();
  let m: RegExpExecArray | null = null;
  while ((m = rx.exec(markdown)) !== null) {
    if (m[1]) set.add(m[1].toLowerCase());
  }
  return set.size;
}

function hasAffiliateLinks(markdown: string) {
  return /\/go\/[a-z0-9\-]+/i.test(markdown);
}

export function inferIntentForValidation(input: { title?: string; slug?: string; markdown: string }) {
  const hay = `${input.title ?? ""} ${input.slug ?? ""} ${input.markdown.slice(0, 2000)}`.toLowerCase();
  if (/(review|vs|versus|best|alternatives)/.test(hay)) return "Commercial" as const;
  if (/(how to|what is|guide|tutorial)/.test(hay)) return "Informational" as const;
  return "Commercial" as const;
}

export function requireUniqueInsight(markdown: string) {
  const ok = hasH2(markdown, "Unique Insight");
  if (!ok) throw new Error('Missing required section: "## Unique Insight"');
}

export function validatePublishedPostBasics(markdown: string) {
  const top = firstLines(markdown, 40);
  const testedBy = extractTopLineValue(top, "Tested By");
  const lastTestedISO = parseTopDateISO(top, "Last Tested");
  const updatedISO = parseTopDateISO(top, "Updated");

  if (!testedBy) throw new Error('Missing required top line: "Tested By: ..."');
  if (!lastTestedISO) throw new Error('Missing required top line: "Last Tested: YYYY-MM-DD"');
  if (!updatedISO) throw new Error('Missing required top line: "Updated: YYYY-MM-DD"');
  requireUniqueInsight(markdown);

  const report = scoreContentQuality(markdown);
  if (!report.checks.word_count_1500) throw new Error("Minimum content length is 1,500 words");
  return report;
}

export function validateCommercialReview(markdown: string) {
  const missing: string[] = [];
  const needH2 = (h: string) => {
    if (!hasH2(markdown, h)) missing.push(`## ${h}`);
  };

  needH2("Our Testing Process");
  needH2("What We Found");
  needH2("Pricing Breakdown");
  needH2("Comparison");
  needH2("Final Verdict");
  needH2("FAQ");

  if (countListItemsUnderH2(markdown, "Pros") < 5) missing.push("## Pros (5+ bullets)");
  if (countListItemsUnderH2(markdown, "Cons") < 5) missing.push("## Cons (5+ bullets)");
  if (!hasH2(markdown, "Who it is best for") && !hasH2(markdown, "Who it's best for") && !hasH2(markdown, "Who it’s for")) {
    missing.push("## Who it is best for");
  }
  if (!hasH2(markdown, "Who should avoid it") && !hasH2(markdown, "Who to avoid") && !hasH2(markdown, "Who should avoid")) {
    missing.push("## Who should avoid it");
  }
  if (!hasH2(markdown, "Real use case examples") && !hasH2(markdown, "Use case examples") && !hasH2(markdown, "Use Cases")) {
    missing.push("## Real use case examples");
  }

  if (missing.length) {
    throw new Error(`Missing required review sections: ${missing.join(", ")}`);
  }
}

export function scoreContentQuality(markdown: string): QualityReport {
  const cleaned = markdown.replace(/[`*_>#]/g, " ");
  const wc = wordCount(cleaned);
  const internalLinkCount = countInternalMarkdownLinks(markdown);
  const hasAffiliate = hasAffiliateLinks(markdown);
  const top = firstLines(markdown, 40);

  const checks: Record<QualityCheckKey, boolean> = {
    first_hand_sections: hasH2(markdown, "Our Testing Process") && hasH2(markdown, "What We Found"),
    tested_by_line: !!extractTopLineValue(top, "Tested By"),
    last_tested_line: !!parseTopDateISO(top, "Last Tested"),
    word_count_1500: wc >= 1500,
    pricing_section: hasH2(markdown, "Pricing Breakdown") || hasH2(markdown, "Pricing"),
    pros_5: countListItemsUnderH2(markdown, "Pros") >= 5,
    cons_5: countListItemsUnderH2(markdown, "Cons") >= 5,
    comparison_section: hasH2(markdown, "Comparison"),
    faq_section: hasH2(markdown, "FAQ"),
    affiliate_links: hasAffiliate,
    updated_line: !!parseTopDateISO(top, "Updated"),
    internal_links_5: internalLinkCount >= 5,
  };

  const score =
    (checks.first_hand_sections ? 10 : 0) +
    (checks.tested_by_line ? 10 : 0) +
    (checks.word_count_1500 ? 10 : 0) +
    (checks.faq_section ? 10 : 0) +
    (checks.pros_5 ? 10 : 0) +
    (checks.cons_5 ? 10 : 0) +
    (checks.comparison_section ? 10 : 0) +
    (checks.affiliate_links ? 10 : 0) +
    (checks.updated_line ? 10 : 0) +
    (checks.internal_links_5 ? 10 : 0);

  return {
    score,
    wordCount: wc,
    internalLinkCount,
    hasAffiliate,
    checks,
    extracted: {
      testedBy: extractTopLineValue(top, "Tested By"),
      lastTestedISO: parseTopDateISO(top, "Last Tested"),
      updatedISO: parseTopDateISO(top, "Updated"),
    },
  };
}
