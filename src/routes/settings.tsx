import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToggleSwitch } from "@/components/ToggleSwitch";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="relative flex flex-col flex-1">
      {/* Profile Avatar Section */}
      <div className="flex justify-center" style={{ paddingTop: "60px" }}>
        <img
          src="/icons/avatar.svg"
          alt="Profile avatar"
          style={{ width: "86px", height: "86px" }}
        />
      </div>

      {/* Settings Menu Items */}
      <div className="flex flex-col" style={{ marginTop: "60px" }}>
        {/* Row 1: Notification */}
        <div className="flex items-center" style={{ padding: "0 34px", height: "54px" }}>
          <img
            src="/icons/settings-notification.svg"
            alt=""
            style={{ width: "17px", height: "18px" }}
          />
          <span
            className="flex-1"
            style={{
              fontFamily: "var(--font-settings)",
              fontSize: "15px",
              color: "var(--color-text-primary)",
              marginLeft: "23px",
            }}
          >
            Notification
          </span>
          <ToggleSwitch checked={notifications} onChange={setNotifications} />
        </div>

        {/* Row 3: Manage My Events */}
        <div className="flex items-center" style={{ padding: "0 34px", height: "54px" }}>
          <img src="/icons/settings-person.svg" alt="" style={{ width: "18px", height: "18px" }} />
          <span
            style={{
              fontFamily: "var(--font-settings)",
              fontSize: "15px",
              color: "var(--color-text-primary)",
              marginLeft: "23px",
            }}
          >
            Manage My Events
          </span>
        </div>

        {/* Row 4: Manage Subscription Plan */}
        <div className="flex items-center" style={{ padding: "0 34px", height: "54px" }}>
          <img
            src="/icons/settings-subscription.svg"
            alt=""
            style={{ width: "18px", height: "18px" }}
          />
          <span
            style={{
              fontFamily: "var(--font-settings)",
              fontSize: "15px",
              color: "var(--color-text-primary)",
              marginLeft: "23px",
            }}
          >
            Manage Subscription Plan
          </span>
        </div>
      </div>
    </div>
  );
}
