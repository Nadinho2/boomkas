import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <Card className="overflow-hidden border-border/60 bg-card/40">
        <CardHeader>
          <CardTitle className="text-xl">Page not found</CardTitle>
          <CardDescription>
            The page you’re looking for doesn’t exist or may have moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="sm:w-auto">
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild variant="secondary" className="sm:w-auto">
            <Link href="/tools">Explore tools</Link>
          </Button>
          <Button asChild variant="ghost" className="sm:w-auto">
            <Link href="/blog">Read the blog</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

