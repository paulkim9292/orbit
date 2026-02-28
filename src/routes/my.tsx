import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ActivityCard } from "@/components/ActivityCard";
import { formatEventDate, type Activity } from "./home";

export const Route = createFileRoute("/my")({
  component: MyPage,
});

/* ─── Mock joined events (subset of activities the user "joined") ─── */

const joinedEvents: (Activity & { status: "upcoming" | "past" })[] = [
  {
    id: "j1",
    image: "/images/home-card-hiking.jpg",
    title: "Dragon's Back Hiking",
    eventDate: "2025-02-28T09:00:00",
    uploadDate: "2025-01-05T10:00:00",
    district: "Southern",
    people: 12,
    views: 342,
    rewards: 300,
    featured: false,
    status: "upcoming",
  },
  {
    id: "j2",
    image: "/images/home-card-yoga.jpg",
    title: "Sunset Yoga at Repulse Bay",
    eventDate: "2025-03-02T17:30:00",
    uploadDate: "2025-01-06T11:00:00",
    district: "Southern",
    people: 8,
    views: 621,
    rewards: 400,
    featured: false,
    status: "upcoming",
  },
  {
    id: "j3",
    image: "/images/home-card-hackathon.jpg",
    title: "Hackathon: Build for Good",
    eventDate: "2025-03-08T09:00:00",
    uploadDate: "2025-01-06T14:00:00",
    district: "Sha Tin",
    people: 20,
    views: 754,
    rewards: 800,
    featured: false,
    status: "upcoming",
  },
  {
    id: "j4",
    image: "/images/home-card-jazz.jpg",
    title: "Jazz Night at Fringe Club",
    eventDate: "2025-01-11T20:00:00",
    uploadDate: "2025-01-04T18:00:00",
    district: "Central & Western",
    people: 12,
    views: 489,
    rewards: 500,
    featured: false,
    status: "past",
  },
  {
    id: "j5",
    image: "/images/home-card-pottery.jpg",
    title: "Pottery Workshop at PMQ",
    eventDate: "2025-01-12T14:00:00",
    uploadDate: "2025-01-05T20:00:00",
    district: "Central & Western",
    people: 6,
    views: 312,
    rewards: 400,
    featured: false,
    status: "past",
  },
  {
    id: "j6",
    image: "/images/home-card-cleanup.jpg",
    title: "Beach Clean-up at Shek O",
    eventDate: "2025-01-13T08:00:00",
    uploadDate: "2025-01-07T08:00:00",
    district: "Southern",
    people: 25,
    views: 530,
    rewards: 1200,
    featured: false,
    status: "past",
  },
  {
    id: "j7",
    image: "/images/home-card-bookclub.jpg",
    title: "Kowloon City Book Club",
    eventDate: "2024-12-20T19:30:00",
    uploadDate: "2024-12-15T09:00:00",
    district: "Kowloon City",
    people: 6,
    views: 175,
    rewards: 350,
    featured: false,
    status: "past",
  },
  {
    id: "j8",
    image: "/images/home-card-language.jpg",
    title: "Language Exchange Café",
    eventDate: "2024-12-28T15:00:00",
    uploadDate: "2024-12-22T13:00:00",
    district: "Wan Chai",
    people: 12,
    views: 318,
    rewards: 600,
    featured: false,
    status: "past",
  },
];

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
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

  const upcomingEvents = joinedEvents
    .filter((e) => e.status === "upcoming")
    .sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
    );

  const pastEvents = joinedEvents
    .filter((e) => e.status === "past")
    .sort(
      (a, b) =>
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
    );

  const events = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <div
      className="relative flex flex-col"
      style={{ paddingBottom: "24px" }}
    >
      {/* Header */}
      <div
        className="animate-page-enter"
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
          animation: "pageEnter 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          animationDelay: "80ms",
          animationFillMode: "backwards",
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
          animation: "pageEnter 450ms cubic-bezier(0.16, 1, 0.3, 1)",
          animationDelay: "150ms",
          animationFillMode: "backwards",
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
            {events.map((event, index) => (
              <div
                key={event.id}
                style={{
                  animation: "pageEnter 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                  animationDelay: `${index * 60}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <ActivityCard
                  image={event.image}
                  title={event.title}
                  height="140px"
                  details={<EventDetails a={event} />}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
