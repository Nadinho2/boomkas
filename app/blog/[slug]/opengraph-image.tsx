import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await params;
  const title = titleFromSlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          backgroundColor: "#060A14",
          backgroundImage:
            "radial-gradient(circle at 20% 15%, rgba(0,240,255,0.22), transparent 58%), radial-gradient(circle at 80% 70%, rgba(255,107,0,0.18), transparent 58%)",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 16,
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            B
          </div>
          <div style={{ fontSize: 22, color: "#ffffff", fontWeight: 700 }}>
            Boom<span style={{ color: "#FF6B00" }}>kas</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.70)", marginBottom: 12 }}>
            Agentic AI Blog • 2026
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.06,
              letterSpacing: -1.2,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 24 }}>
          <div style={{ fontSize: 18, color: "rgba(255,255,255,0.72)" }}>
            Reviews, comparisons, workflows, and practical guides.
          </div>
          <div style={{ fontSize: 18, color: "rgba(0,240,255,0.92)", fontWeight: 700 }}>
            boomkas.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

