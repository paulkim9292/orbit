import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <div className="relative flex flex-col flex-1 overflow-hidden">
      {/* Gradient Background Header */}
      <div className="absolute top-0 left-0 w-full" style={{ height: "290px" }}>
        <img
          src="/gradient-background.svg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Blue Ellipse Background */}
      <div
        className="absolute"
        style={{
          width: "843px",
          height: "733px",
          left: "-235px",
          top: "158px",
          borderRadius: "50%",
          backgroundColor: "var(--color-bg-primary)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col">
        {/* Planet Illustration */}
        <div className="flex justify-center" style={{ marginTop: "58px" }}>
          <img
            src="/planet-heart.svg"
            alt="Planet with heart"
            style={{ width: "150px", height: "88px" }}
          />
        </div>

        {/* Notification Cards */}
        <div
          className="flex flex-col"
          style={{ marginTop: "70px", padding: "0 21px", gap: "8px" }}
        >
          <img src="/icons/notification-1.svg" alt="Someone has joined the event you hosted!" className="w-full" />
          <img src="/icons/notification-1.svg" alt="Someone has joined the event you hosted!" className="w-full" />
        </div>
      </div>
    </div>
  );
}
