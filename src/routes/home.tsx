import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

function HomePage() {
  return (
    <div
      className="relative flex-1 flex items-center justify-center"
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
