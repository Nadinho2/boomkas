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
  const preferredHost = (() => {
    try {
      return new URL(SITE_ORIGIN).host.toLowerCase();
    } catch {
      return "www.boomkas.com";
    }
  })();

  const alternateHost = preferredHost.startsWith("www.") ? preferredHost.slice(4) : `www.${preferredHost}`;
  const allowedHosts = new Set([preferredHost, alternateHost]);

  const isInternal = (() => {
    if (href.startsWith("/")) return true;
    try {
      const u = new URL(href);
      if (u.protocol !== "https:" && u.protocol !== "http:") return false;
      return allowedHosts.has(u.host.toLowerCase());
    } catch {
      return false;
    }
  })();
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
