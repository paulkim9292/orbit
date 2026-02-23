import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col items-center"
    >
      {/* Gradient Background Header */}
      <div className="absolute top-0 left-0 w-full" style={{ height: "340px" }}>
        <img src="/gradient-background.svg" alt="" className="w-full h-full object-cover" />
      </div>

      {/* Blue Ellipse Background */}
      <div
        className="absolute"
        style={{
          width: "843px",
          height: "733px",
          left: "-235px",
          top: "220px",
          borderRadius: "50%",
          backgroundColor: "var(--color-bg-primary)",
        }}
      />

      {/* Glow behind logo */}
      <div
        className="absolute animate-pulse-glow"
        style={{
          width: "200px",
          height: "200px",
          top: "130px",
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(134, 140, 228, 0.3) 0%, transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{ minHeight: "100vh", width: "100%", paddingTop: "100px" }}
      >
        {/* Planet Illustration */}
        <div className="animate-stagger-1">
          <img src="/planet-heart.svg" alt="Orbit" style={{ width: "180px", height: "106px" }} />
        </div>

        {/* Wordmark */}
        <img
          src="/orbit-text.svg"
          alt="Orbit"
          className="animate-stagger-2"
          style={{ width: "220px", marginTop: "120px" }}
        />

        {/* Tagline */}
        <p
          className="animate-stagger-3"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1rem, 2vw, 1.5rem)",
            fontStyle: "italic",
            fontWeight: 400,
            color: "var(--color-text-primary)",
            letterSpacing: "1.5px",
            marginTop: "6px",
            textAlign: "center",
          }}
        >
          Your space to connect
        </p>

        {/* Spacer */}
        <div style={{ flexGrow: 1 }} />

        {/* CTA Buttons */}
        <div className="flex flex-col items-center" style={{ gap: "14px", marginBottom: "140px" }}>
          <Link
            to="/onboarding"
            className="animate-stagger-4 flex items-center justify-center rounded-full"
            onPointerDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(0.96)"; }}
            onPointerUp={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
            onPointerLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
            style={{
              width: "260px",
              height: "50px",
              backgroundColor: "var(--color-text-primary)",
              color: "var(--color-bg-primary)",
              fontFamily: "var(--font-heading)",
              fontSize: "17px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              textDecoration: "none",
              transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            Get Started
          </Link>

          <Link
            to="/home"
            className="animate-stagger-5 flex items-center justify-center rounded-full border"
            onPointerDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(0.96)"; }}
            onPointerUp={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
            onPointerLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
            style={{
              width: "260px",
              height: "50px",
              borderColor: "var(--color-border-button)",
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-heading)",
              fontSize: "17px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              textDecoration: "none",
              transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1), background-color 250ms",
            }}
          >
            Browse
          </Link>
        </div>
      </div>
    </div>
  );
}
