import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

function HomePage() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "var(--color-bg-primary)",
        maxWidth: "393px",
        margin: "0 auto",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "20px",
          fontStyle: "italic",
          color: "var(--color-text-primary)",
          opacity: 0.6,
        }}
      >
        Coming soon...
      </p>
    </div>
  );
}
