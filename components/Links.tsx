"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { SITE_ORIGIN } from "@/lib/seo";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function InternalLink({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Link> & { children: ReactNode }) {
  return (
    <Link {...props} className={cn(className)}>
      {children}
    </Link>
  );
}

export function AffiliateLink({
  href,
  className,
  children,
  target = "_blank",
  ...props
}: {
  href: string;
  className?: string;
  children: ReactNode;
  target?: "_blank" | "_self";
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children" | "target" | "rel">) {
  const absoluteOrigin = SITE_ORIGIN;
  const isInternal = href.startsWith("/") || href.startsWith(absoluteOrigin);
  const rel = isInternal ? "noopener noreferrer" : "nofollow sponsored noopener noreferrer";

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={cn(className)}
      onClick={(e) => {
        const handler = props.onClick;
        if (typeof handler === "function") handler(e);
        window.gtag?.("event", "affiliate_click", {
          href,
          internal: isInternal,
        });
      }}
      {...props}
    >
      {children}
    </a>
  );
}
