import { NextResponse } from "next/server";

import { runOneKeywordPipeline } from "@/lib/automation/publish";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = process.env.CRON_SECRET;

  if (secret) {
    const auth = request.headers.get("authorization") ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";
    const qp = url.searchParams.get("secret") ?? "";
    if (token !== secret && qp !== secret) return unauthorized();
  }

  try {
    const result = await runOneKeywordPipeline();
    return NextResponse.json({ ok: true, result }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false, error: "pipeline_failed" }, { status: 500 });
  }
}
