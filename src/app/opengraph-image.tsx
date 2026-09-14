import { ImageResponse } from "next/og";

export const alt = "MockData — Free Fake REST APIs for Frontend Developers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e0f12",
          color: "#eceef2",
          padding: "64px 72px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 28,
            color: "#9aa3b5",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          mockdata.ir
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
            }}
          >
            MockData
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#ffb020",
              letterSpacing: "-0.02em",
              maxWidth: 900,
              lineHeight: 1.25,
            }}
          >
            Free Fake REST APIs for Frontend Developers
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 28,
            fontSize: 22,
            color: "#9aa3b5",
          }}
        >
          <span>Live JSON</span>
          <span>·</span>
          <span>Docs</span>
          <span>·</span>
          <span>Playground</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
