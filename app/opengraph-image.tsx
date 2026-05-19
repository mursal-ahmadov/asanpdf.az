import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AsanPDF.com — Pulsuz PDF alətləri Azərbaycan dilində";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #2563eb 0%, #6366f1 50%, #8b5cf6 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Decorative grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Document icon */}
        <div
          style={{
            width: 140,
            height: 170,
            background: "white",
            borderRadius: 16,
            position: "relative",
            marginBottom: 48,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 24,
            boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
          }}
        >
          {/* Folded corner */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 0,
              height: 0,
              borderTop: "32px solid #e5e7eb",
              borderLeft: "32px solid transparent",
              borderRadius: "0 16px 0 0",
            }}
          />
          <div
            style={{
              fontSize: 38,
              fontWeight: 900,
              color: "#2563eb",
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            PDF
          </div>
        </div>

        {/* Brand */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: 24,
            display: "flex",
          }}
        >
          <span>AsanPDF</span>
          <span style={{ color: "#fde047" }}>.com</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 38,
            fontWeight: 500,
            opacity: 0.95,
            display: "flex",
          }}
        >
          Pulsuz PDF alətləri — Azərbaycan dilində
        </div>

        {/* Feature badges */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 48,
            fontSize: 24,
            opacity: 0.95,
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              background: "rgba(255,255,255,0.18)",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            🔒 Brauzerdə işləyir
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              background: "rgba(255,255,255,0.18)",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            ⚡ Sürətli
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              background: "rgba(255,255,255,0.18)",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            💯 Pulsuz
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
