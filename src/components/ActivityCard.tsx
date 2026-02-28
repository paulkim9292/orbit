import { type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ShimmerImage } from "./ShimmerImage";

interface ActivityCardProps {
  image: string;
  title: string;
  details: ReactNode;
  height?: string;
  eventId?: string;
}

export function ActivityCard({
  image,
  title,
  details,
  height = "180px",
  eventId,
}: ActivityCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="relative overflow-hidden w-full"
      style={{
        height,
        borderRadius: "12px",
        border: "1px solid rgba(174, 177, 231, 0.1)",
        boxShadow: "0 2px 16px rgba(0, 0, 0, 0.25)",
        backgroundColor: "var(--color-card-bg)",
        cursor: "pointer",
        transition:
          "transform 350ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 350ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onClick={() => {
        if (eventId) navigate({ to: "/event/$eventId", params: { eventId } });
      }}
      onPointerDown={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "scale(0.97)";
        el.style.boxShadow = "0 1px 8px rgba(0, 0, 0, 0.3)";
      }}
      onPointerUp={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "";
        el.style.boxShadow = "";
      }}
      onPointerLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "";
        el.style.boxShadow = "";
      }}
    >
      {/* Image — fills entire card, with shimmer while loading */}
      <ShimmerImage
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: "cover" }}
      />

      {/* Bottom gradient — immersive text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(9, 11, 59, 0.92) 0%, rgba(9, 11, 59, 0.45) 50%, transparent 72%)",
        }}
      />

      {/* Text overlay at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col"
        style={{ padding: "10px 12px" }}
      >
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "13px",
            fontWeight: 600,
            color: "#fff",
            letterSpacing: "0.3px",
            lineHeight: 1.2,
          }}
        >
          {title}
        </span>
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "10px",
            fontWeight: 400,
            color: "var(--color-text-primary)",
            letterSpacing: "0.3px",
            marginTop: "4px",
            lineHeight: 1.4,
          }}
        >
          {details}
        </div>
      </div>
    </div>
  );
}
