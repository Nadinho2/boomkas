import { refreshOneOldPost } from "@/lib/automation/refresh";

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function getAuthToken(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  if (header.toLowerCase().startsWith("bearer ")) return header.slice(7).trim();
  const url = new URL(request.url);
  const q = url.searchParams.get("secret");
  return q ?? "";
}

export async function GET(request: Request) {
  const secret = env("CRON_SECRET");
  const token = getAuthToken(request);
  if (token !== secret) return new Response("Unauthorized", { status: 401 });

  const result = await refreshOneOldPost();
  return Response.json(result);
}

