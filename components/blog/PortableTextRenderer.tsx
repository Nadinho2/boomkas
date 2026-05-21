import Link from "next/link";
import type { ReactNode } from "react";

import type { SanityBlock, SanityLinkMarkDef, SanitySpan } from "@/lib/sanity";

function renderSpan(input: {
  span: SanitySpan;
  markDefs: SanityLinkMarkDef[];
}): ReactNode {
  const marks = Array.isArray(input.span.marks) ? input.span.marks : [];
  let node: ReactNode = input.span.text;

  for (const m of marks) {
    if (m === "strong") {
      node = <strong key={`${input.span._key}-strong`}>{node}</strong>;
      continue;
    }
    if (m === "em") {
      node = <em key={`${input.span._key}-em`}>{node}</em>;
      continue;
    }
    const def = input.markDefs.find((d) => d._key === m);
    if (def && def._type === "link" && typeof def.href === "string") {
      const href = def.href;
      const isInternal = href.startsWith("/");
      node = isInternal ? (
        <Link key={`${input.span._key}-link`} href={href} className="underline underline-offset-4 hover:text-foreground">
          {node}
        </Link>
      ) : (
        <a
          key={`${input.span._key}-link`}
          href={href}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="underline underline-offset-4 hover:text-foreground"
        >
          {node}
        </a>
      );
      continue;
    }
  }

  return node;
}

function renderBlock(block: SanityBlock) {
  const markDefs = Array.isArray(block.markDefs) ? block.markDefs : [];
  const children = (block.children ?? []).map((s) => renderSpan({ span: s, markDefs }));

  if (block.style === "h2") {
    return <h2 className="scroll-mt-24 text-xl font-semibold tracking-tight sm:text-2xl">{children}</h2>;
  }
  if (block.style === "h3") {
    return <h3 className="scroll-mt-24 text-base font-semibold tracking-tight sm:text-lg">{children}</h3>;
  }
  return <p className="text-sm leading-7 text-muted-foreground sm:text-base">{children}</p>;
}

export function PortableTextRenderer({ value }: { value: SanityBlock[] }) {
  const blocks = Array.isArray(value) ? value : [];
  const out: ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const b = blocks[i];
    if (!b || b._type !== "block") {
      i += 1;
      continue;
    }

    if (b.listItem === "bullet") {
      const items: ReactNode[] = [];
      while (i < blocks.length && blocks[i] && blocks[i]._type === "block" && blocks[i].listItem === "bullet") {
        const li = blocks[i];
        const markDefs = Array.isArray(li.markDefs) ? li.markDefs : [];
        const children = (li.children ?? []).map((s) => renderSpan({ span: s, markDefs }));
        items.push(
          <li key={li._key} className="leading-7">
            {children}
          </li>
        );
        i += 1;
      }
      out.push(
        <ul key={`ul-${b._key}`} className="list-disc space-y-2 pl-5 text-sm text-muted-foreground sm:text-base">
          {items}
        </ul>
      );
      continue;
    }

    out.push(<div key={b._key}>{renderBlock(b)}</div>);
    i += 1;
  }

  return <div className="space-y-6">{out}</div>;
}

