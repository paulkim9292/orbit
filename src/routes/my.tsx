import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ActivityCard } from "@/components/ActivityCard";
import { formatEventDate, type Activity } from "./home";
import { fetchActivities } from "@/lib/events";

export const Route = createFileRoute("/my")({
  loader: () => fetchActivities({ includePast: true }),
  component: MyPage,
});

/* ─── Detail renderer ─── */

function EventDetails({ a }: { a: Activity & { status: "upcoming" | "past" } }) {
  return (
    <>
      <div className="flex items-center" style={{ gap: "3px" }}>
        <span>{formatEventDate(a.eventDate)}</span>
        <span style={{ opacity: 0.4 }}>&middot;</span>
        <span>{a.district}</span>
      </div>
      <div className="flex items-center" style={{ gap: "3px" }}>
        <span>{a.people}</span>
        <img
          src="/icons/home-people.svg"
          alt=""
          style={{ width: "14px", height: "7px", opacity: 0.7 }}
        />
        {a.rewards ? (
          <>
            <span style={{ opacity: 0.4 }}>&middot;</span>
            <span style={{ color: "var(--color-accent-pink)", fontWeight: 500 }}>
              {a.status === "past" ? "" : "+"}
              {a.rewards}pts
            </span>
          </>
        ) : null}
      </div>
    </>
  );
}

/* ─── Empty state ─── */

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ padding: "48px 20px", gap: "12px" }}
    >
      <img
        src="/planet-heart.svg"
        alt=""
        style={{ width: "80px", height: "47px", opacity: 0.4 }}
      />
      <span
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "14px",
          color: "var(--color-text-primary)",
          opacity: 0.5,
          textAlign: "center",
        }}
      >
        {message}
      </span>
    </div>
  );
}

/* ─── Page ─── */

type Tab = "upcoming" | "past";

function MyPage() {
  const activities = Route.useLoaderData();
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

  const now = new Date();
  const withStatus = activities.map((a) => ({
    ...a,
    status: (new Date(a.eventDate) > now ? "upcoming" : "past") as
      | "upcoming"
      | "past",
  }));

  const upcomingEvents = withStatus
    .filter((e) => e.status === "upcoming")
    .sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
    );

  const pastEvents = withStatus
    .filter((e) => e.status === "past")
    .sort(
      (a, b) =>
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
    );

  const events = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <div
      className="relative flex flex-col animate-page-enter"
      style={{ paddingBottom: "24px" }}
    >
      {/* Header */}
      <div
        style={{ padding: "48px 20px 0" }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "26px",
            fontWeight: 700,
            color: "var(--color-text-white)",
            letterSpacing: "0.5px",
          }}
        >
          My Events
        </h1>
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "13px",
            fontWeight: 400,
            color: "var(--color-text-primary)",
            marginTop: "4px",
            opacity: 0.7,
          }}
        >
          Events you've joined and participated in
        </p>
      </div>

      {/* Tab bar */}
      <div
        className="flex"
        style={{
          margin: "20px 20px 0",
          borderRadius: "10px",
          backgroundColor: "rgba(59, 60, 97, 0.5)",
          padding: "3px",
        }}
      >
        {(["upcoming", "past"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 cursor-pointer"
            style={{
              padding: "8px 0",
              borderRadius: "8px",
              border: "none",
              fontFamily: "var(--font-heading)",
              fontSize: "13px",
              fontWeight: activeTab === tab ? 600 : 400,
              letterSpacing: "0.5px",
              color:
                activeTab === tab
                  ? "var(--color-text-white)"
                  : "var(--color-text-primary)",
              backgroundColor:
                activeTab === tab
                  ? "var(--color-card-bg)"
                  : "transparent",
              transition:
                "all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {tab === "upcoming" ? "Upcoming" : "Past"}
            <span
              style={{
                marginLeft: "6px",
                fontSize: "11px",
                opacity: 0.6,
              }}
            >
              {tab === "upcoming"
                ? upcomingEvents.length
                : pastEvents.length}
            </span>
          </button>
        ))}
      </div>

      {/* Event list */}
      <section
        style={{
          padding: "16px 20px 0",
        }}
      >
        {events.length === 0 ? (
          <EmptyState
            message={
              activeTab === "upcoming"
                ? "No upcoming events yet. Browse and join some!"
                : "No past events yet. Your history will show up here."
            }
          />
        ) : (
          <div
            className="flex flex-col"
            style={{ gap: "12px" }}
          >
            {events.map((event) => (
              <ActivityCard
                key={event.id}
                eventId={event.id}
                image={event.image}
                title={event.title}
                height="140px"
                details={<EventDetails a={event} />}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
