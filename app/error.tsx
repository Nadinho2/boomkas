"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GlobalError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <Card className="overflow-hidden border-border/60 bg-card/40">
        <CardHeader>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
          <CardDescription>
            This page hit an unexpected error. Try again, or head back to the main sections of Boomkas.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => reset()} className="sm:w-auto">
            Try again
          </Button>
          <Button asChild variant="secondary" className="sm:w-auto">
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild variant="ghost" className="sm:w-auto">
            <Link href="/tools">Browse tools</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

