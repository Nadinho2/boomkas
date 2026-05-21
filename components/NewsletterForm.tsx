"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function NewsletterForm({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        window.gtag?.("event", "newsletter_signup", { source, email_domain: email.split("@")[1] ?? "" });
      }}
    >
      <Input
        type="email"
        name="email"
        placeholder="you@company.com"
        aria-label="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit" size="lg" className="w-full" disabled={submitted}>
        {submitted ? "Subscribed" : "Subscribe"}
      </Button>
      <div className="text-xs text-muted-foreground">
        By subscribing, you agree to receive emails from Boomkas. Unsubscribe anytime.
      </div>
    </form>
  );
}

