import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AuthorProfile } from "@/lib/authors";

export function AuthorBox({
  author,
  lastTestedISO,
  updatedISO,
}: {
  author: AuthorProfile;
  lastTestedISO: string;
  updatedISO: string;
}) {
  const lastTested = new Date(lastTestedISO).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const updated = new Date(updatedISO).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <Card className="border-border/60 bg-card/40">
      <CardHeader className="flex flex-row items-start gap-4">
        <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
          <Image src={author.photoDataUri} alt={`${author.name} photo`} fill sizes="56px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <CardTitle className="text-base">
            <Link href={`/authors/${author.slug}`} className="hover:underline">
              Tested by {author.name}
            </Link>
          </CardTitle>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{author.role}</span>
            <span aria-hidden className="text-white/20">
              •
            </span>
            <span>Last tested: {lastTested}</span>
            <span aria-hidden className="text-white/20">
              •
            </span>
            <span>Updated: {updated}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="cyan">We tested this</Badge>
          {author.expertise.slice(0, 3).map((e) => (
            <Badge key={e} variant="default">
              {e}
            </Badge>
          ))}
        </div>
        <div className="text-sm leading-7 text-muted-foreground sm:text-base">{author.bio}</div>
      </CardContent>
    </Card>
  );
}

