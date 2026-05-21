import type { SanityBlock, SanityLinkMarkDef, SanitySpan } from "@/lib/sanity";

function key(prefix: string) {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}`;
}

function clamp(input: string, max: number) {
  const s = input.trim();
  return s.length > max ? s.slice(0, max) : s;
}

type InlineToken =
  | { type: "text"; value: string }
  | { type: "strong"; value: string }
  | { type: "em"; value: string }
  | { type: "link"; text: string; href: string }
  | { type: "internal"; text: string; href: string };

function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let i = 0;

  const pushText = (t: string) => {
    if (!t) return;
    tokens.push({ type: "text", value: t });
  };

  while (i < text.length) {
    const rest = text.slice(i);

    const internal = rest.match(/^\[INTERNAL_LINK:\s*"([^"]+)"\s*"([^"]+)"\s*\]/);
    if (internal) {
      const href = internal[1].trim();
      const label = internal[2].trim();
      tokens.push({ type: "internal", href, text: label });
      i += internal[0].length;
      continue;
    }

    const mdLink = rest.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
    if (mdLink) {
      tokens.push({ type: "link", text: mdLink[1], href: mdLink[2] });
      i += mdLink[0].length;
      continue;
    }

    const strong = rest.match(/^\*\*([^*]+)\*\*/);
    if (strong) {
      tokens.push({ type: "strong", value: strong[1] });
      i += strong[0].length;
      continue;
    }

    const em = rest.match(/^\*([^*]+)\*/);
    if (em) {
      tokens.push({ type: "em", value: em[1] });
      i += em[0].length;
      continue;
    }

    const nextSpecial = (() => {
      const idxs = [
        rest.indexOf("[INTERNAL_LINK:"),
        rest.indexOf("]("),
        rest.indexOf("**"),
        rest.indexOf("*"),
      ].filter((x) => x >= 0);
      return idxs.length ? Math.min(...idxs) : -1;
    })();

    if (nextSpecial === -1) {
      pushText(rest);
      break;
    }

    pushText(rest.slice(0, nextSpecial));
    i += nextSpecial;
  }

  return tokens;
}

function spansFromInline(text: string): { children: SanitySpan[]; markDefs: SanityLinkMarkDef[] } {
  const parts = tokenizeInline(text);
  const children: SanitySpan[] = [];
  const markDefs: SanityLinkMarkDef[] = [];

  const ensureLinkMark = (href: string) => {
    const existing = markDefs.find((d) => d.href === href);
    if (existing) return existing._key;
    const _key = key("l");
    markDefs.push({ _key, _type: "link", href });
    return _key;
  };

  for (const p of parts) {
    if (p.type === "text") {
      children.push({ _key: key("s"), _type: "span", text: p.value });
      continue;
    }
    if (p.type === "strong") {
      children.push({ _key: key("s"), _type: "span", text: p.value, marks: ["strong"] });
      continue;
    }
    if (p.type === "em") {
      children.push({ _key: key("s"), _type: "span", text: p.value, marks: ["em"] });
      continue;
    }
    if (p.type === "link") {
      const mark = ensureLinkMark(p.href);
      children.push({ _key: key("s"), _type: "span", text: p.text, marks: [mark] });
      continue;
    }
    if (p.type === "internal") {
      const href = p.href.startsWith("/") ? p.href : `/${p.href}`;
      const mark = ensureLinkMark(href);
      children.push({ _key: key("s"), _type: "span", text: p.text, marks: [mark] });
      continue;
    }
  }

  if (children.length === 0) children.push({ _key: key("s"), _type: "span", text: "" });
  return { children, markDefs };
}

function block(style: "normal" | "h2" | "h3", text: string, extra?: Partial<SanityBlock>): SanityBlock {
  const { children, markDefs } = spansFromInline(text);
  return {
    _key: key("b"),
    _type: "block",
    style,
    children,
    markDefs,
    ...extra,
  };
}

export function plainStringToPortableText(input: string): SanityBlock[] {
  const lines = input.replace(/\r\n/g, "\n").split("\n");
  const blocks: SanityBlock[] = [];

  let i = 0;
  while (i < lines.length) {
    const raw = lines[i] ?? "";
    const line = raw.trimEnd();

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(block("h2", clamp(line.slice(3), 200)));
      i += 1;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push(block("h3", clamp(line.slice(4), 200)));
      i += 1;
      continue;
    }

    const isBullet = (s: string) => s.trimStart().startsWith("- ") || s.trimStart().startsWith("* ");
    if (isBullet(line)) {
      while (i < lines.length && isBullet(lines[i] ?? "")) {
        const itemLine = (lines[i] ?? "").trimStart().slice(2);
        blocks.push(block("normal", itemLine, { listItem: "bullet", level: 1 }));
        i += 1;
      }
      continue;
    }

    const paraLines: string[] = [];
    while (i < lines.length) {
      const l = (lines[i] ?? "").trimEnd();
      if (!l.trim()) break;
      if (l.startsWith("## ") || l.startsWith("### ") || isBullet(l)) break;
      paraLines.push(l.trim());
      i += 1;
    }
    const paragraph = paraLines.join(" ");
    blocks.push(block("normal", paragraph));
  }

  return blocks;
}

