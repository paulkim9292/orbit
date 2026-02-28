import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ActivityCard } from "@/components/ActivityCard";
import { FadeIn } from "@/components/FadeIn";
import { MonthPickerSheet } from "@/components/MonthPickerSheet";
import { SocialLevelSheet } from "@/components/SocialLevelSheet";
import { fetchActivities } from "@/lib/events";
import { formatEventDate } from "@/routes/home";
import { Info, Sparkles } from "lucide-react";

export const Route = createFileRoute("/report")({
  loader: () => fetchActivities(),
  component: ReportPage,
});

/* ─── Mock report data (prototype) ─── */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MOCK_REPORT = {
  eventsJoined: 8,
  averageMood: 4.5,
  favouriteType: "Social & Purpose-driven Activities",
  moodDescription: "For this month, you felt most energised after joining small, indoor activities",
  energyChange: 10,
  pointsGained: 200,
  topMoods: [
    { image: "/images/mood-happy-selected.png", label: "Happy", count: 15 },
    { image: "/images/mood-excited.png", label: "Excited", count: 8 },
    { image: "/images/mood-good.png", label: "Good", count: 2 },
  ],
  insights: [
    {
      tag: "Mood Pattern",
      title: "Small groups bring out your best mood",
      body: "Your reviews show a clear pattern: you felt happiest after small, indoor activities with 2\u20134 participants. Out of 25 mood check-ins, \"Happy\" appeared 15 times \u2014 and 12 of those followed intimate group settings. This aligns with your onboarding profile as a Cosmic Dust: you recharge best in quieter spaces, and your mood data confirms it. Larger events scored well for excitement, but your deepest wellbeing comes from smaller circles.",
    },
    {
      tag: "Social Insight",
      title: "Your social comfort zone is expanding",
      body: "When you joined Orbit, you told us you wanted to \"stay out of your comfort zone\" \u2014 and your activity this month shows real progress. You joined 8 events, up from 3 in your first month, and your post-event reflections show growing confidence in new social settings. You started as a Cosmic Dust, but your engagement pattern this month is closer to a Comet. You\u2019re building social momentum without forcing it.",
    },
    {
      tag: "Growth & Discovery",
      title: "Physical activities are your strongest engagement driver",
      body: "With 45% of your events being physical, this is clearly where you feel most drawn \u2014 which matches the interest areas you selected during onboarding. Your reflections after these events were the most enthusiastic, averaging 40% more words than other categories. Pairing this with recreational team formats could amplify the effect: your mood scores were highest when physical effort met social interaction. We\u2019ve tailored the recommendations below to this insight.",
    },
    {
      tag: "Personal Growth",
      title: "How to keep building on this momentum",
      body: "Your data paints a clear picture: you\u2019re someone who connects deeply in small, low-pressure settings \u2014 and you\u2019re gradually stretching that comfort zone. To keep this trajectory going, try arriving 5 minutes early to events. Your reviews suggest you feel most at ease when you\u2019ve had a moment to settle in before others arrive. Also, consider alternating between familiar activity types (physical) and less explored ones (creative) each week \u2014 your mood data shows that variety sustains your excitement levels across the month. You don\u2019t need to become a different person. Your strongest growth this month came from simply showing up consistently.",
    },
  ],
};

/* ─── Detail renderer for recommendation cards ─── */

function RecommendationDetails({
  a,
}: {
  a: { eventDate: string; people: number; rewards?: number };
}) {
  return (
    <>
      <div className="flex items-center" style={{ gap: "3px" }}>
        <span>{formatEventDate(a.eventDate)}</span>
        <span style={{ opacity: 0.4 }}>&middot;</span>
        <span>{a.people}</span>
        <img
          src="/icons/home-people.svg"
          alt=""
          style={{ width: "14px", height: "7px", opacity: 0.7 }}
        />
      </div>
      {a.rewards ? (
        <span style={{ color: "var(--color-accent-pink)", fontWeight: 500 }}>+{a.rewards}pts</span>
      ) : null}
    </>
  );
}

/* ─── Page ─── */

const USER_LEVEL = { id: "cosmic-dust", label: "Cosmic Dust", image: "/images/cosmic-dust.png" };

function ReportPage() {
  const activities = Route.useLoaderData();
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showLevelSheet, setShowLevelSheet] = useState(false);

  const report = MOCK_REPORT;
  const recommendedTeam = activities.slice(0, 4);
  const recommendedPhysical = activities.slice(4, 8).length
    ? activities.slice(4, 8)
    : [...activities].reverse().slice(0, 4);

  return (
    <div className="relative flex flex-col" style={{ paddingBottom: "24px", overflow: "hidden" }}>
      {/* ─── Gradient Background Header (same as onboarding) ─── */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{ height: "290px", pointerEvents: "none" }}
      >
        <img src="/gradient-background.svg" alt="" className="w-full h-full object-cover" />
      </div>

      {/* Blue Ellipse Background (same as onboarding) */}
      <div
        className="absolute"
        style={{
          width: "843px",
          height: "733px",
          left: "-235px",
          top: "158px",
          borderRadius: "50%",
          backgroundColor: "var(--color-bg-primary)",
          pointerEvents: "none",
        }}
      />

      {/* ─── Logo + Title ─── */}
      <div
        className="relative z-10 flex flex-col items-center animate-page-enter"
        style={{ paddingTop: "58px", gap: "38px" }}
      >
        <img src="/planet-heart.svg" alt="Orbit" style={{ width: "150px", height: "88px" }} />
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "30px",
            fontWeight: 700,
            color: "#aeb1e7",
            textAlign: "center",
            letterSpacing: "1.2px",
          }}
        >
          Your Monthly Report
        </h1>
      </div>

      {/* ─── Social Level ─── */}
      <FadeIn style={{ position: "relative", zIndex: 1 }}>
        <section className="flex flex-col items-center" style={{ padding: "20px 20px 0" }}>
          {/* "Your Current Level" label */}
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "11px",
              fontWeight: 500,
              color: "rgba(174, 177, 231, 0.5)",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
            }}
          >
            Your Current Level
          </span>

          {/* Level illustration */}
          <img
            src={USER_LEVEL.image}
            alt={USER_LEVEL.label}
            style={{ width: "160px", height: "160px", objectFit: "contain", marginTop: "8px" }}
          />

          {/* Divider line */}
          <div
            style={{
              width: "200px",
              height: "1px",
              backgroundColor: "var(--color-text-primary)",
              marginTop: "6px",
            }}
          />

          {/* Level name + info button */}
          <div
            className="flex items-center justify-center"
            style={{ marginTop: "6px", gap: "8px" }}
          >
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "24px",
                fontStyle: "italic",
                color: "var(--color-text-primary)",
                textAlign: "center",
              }}
            >
              {USER_LEVEL.label}
            </p>
            <button
              onClick={() => setShowLevelSheet(true)}
              className="flex items-center justify-center shrink-0 cursor-pointer"
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                border: "1px solid rgba(174, 177, 231, 0.25)",
                backgroundColor: "transparent",
              }}
            >
              <Info size={13} color="var(--color-text-primary)" strokeWidth={2} />
            </button>
          </div>
        </section>
      </FadeIn>

      {/* ─── Section divider ─── */}
      <div
        className="relative z-10"
        style={{
          margin: "24px 20px 0",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(174, 177, 231, 0.2) 30%, rgba(174, 177, 231, 0.2) 70%, transparent)",
        }}
      />

      {/* ─── Monthly Snapshot ─── */}
      <FadeIn style={{ position: "relative", zIndex: 1 }}>
        <section
          style={{
            padding: "20px 20px 0",
          }}
        >
          <div className="flex items-center justify-between">
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "16px",
                fontWeight: 700,
                fontStyle: "italic",
                color: "#aeb1e7",
                letterSpacing: "0.64px",
              }}
            >
              Monthly Snapshot
            </h3>

            {/* Month selector pill */}
            <button
              onClick={() => setShowMonthPicker(true)}
              className="flex items-center cursor-pointer"
              style={{
                backgroundColor: "#aeb1e7",
                borderRadius: "20px",
                height: "21px",
                padding: "0 14px",
                gap: "10px",
                border: "none",
              }}
            >
              <img
                src="/icons/report-calendar.svg"
                alt=""
                style={{ width: "13px", height: "13px" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "12px",
                  color: "#090b3b",
                }}
              >
                {MONTHS[selectedMonth]} {selectedYear}
              </span>
              <svg width="9" height="6" viewBox="0 0 9 6" fill="none" style={{ opacity: 0.7 }}>
                <path
                  d="M1 1L4.5 4.5L8 1"
                  stroke="#090b3b"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Description */}
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              color: "#aeb1e7",
              textAlign: "center",
              letterSpacing: "0.64px",
              marginTop: "12px",
              lineHeight: 1.4,
            }}
          >
            {report.moodDescription}
          </p>

          {/* Stat cards */}
          <div className="flex" style={{ gap: "8px", marginTop: "16px", justifyContent: "center" }}>
            {/* Events Joined */}
            <div
              className="flex flex-col items-center justify-center"
              style={{
                flex: "0 0 auto",
                width: "74px",
                height: "53px",
                borderRadius: "15px",
                border: "1px solid #aeb1e7",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "9px",
                  color: "#aeb1e7",
                  letterSpacing: "0.36px",
                  marginBottom: "2px",
                }}
              >
                Events Joined
              </span>
              <div className="flex items-center" style={{ gap: "4px" }}>
                <img
                  src="/icons/report-calendar-check.svg"
                  alt=""
                  style={{ width: "19px", height: "19px" }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#aeb1e7",
                    letterSpacing: "0.64px",
                  }}
                >
                  {report.eventsJoined}
                </span>
              </div>
            </div>

            {/* Average Mood */}
            <div
              className="flex flex-col items-center justify-center"
              style={{
                flex: "0 0 auto",
                width: "74px",
                height: "53px",
                borderRadius: "15px",
                border: "1px solid #aeb1e7",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "9px",
                  color: "#aeb1e7",
                  letterSpacing: "0.36px",
                  marginBottom: "2px",
                }}
              >
                Average Mood
              </span>
              <div className="flex items-baseline" style={{ gap: "1px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#aeb1e7",
                    letterSpacing: "0.64px",
                  }}
                >
                  {report.averageMood}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "9px",
                    color: "#aeb1e7",
                    letterSpacing: "0.36px",
                  }}
                >
                  /5
                </span>
              </div>
            </div>

            {/* Favourite Activity Type */}
            <div
              className="flex flex-col items-center justify-center"
              style={{
                flex: "0 0 auto",
                width: "144px",
                height: "53px",
                borderRadius: "15px",
                border: "1px solid #aeb1e7",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "9px",
                  color: "#aeb1e7",
                  letterSpacing: "0.36px",
                  marginBottom: "4px",
                  textAlign: "center",
                }}
              >
                Your Favourite Activity Type
              </span>
              <div
                className="flex items-center justify-center"
                style={{
                  backgroundColor: "#aeb1e7",
                  borderRadius: "20px",
                  width: "134px",
                  height: "21px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "9px",
                    color: "#090b3b",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {report.favouriteType}
                </span>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ─── Mood Tracker ─── */}
      <FadeIn style={{ position: "relative", zIndex: 1 }}>
        <section style={{ padding: "24px 20px 0" }}>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontWeight: 700,
              fontStyle: "italic",
              color: "#aeb1e7",
              letterSpacing: "0.64px",
            }}
          >
            Your Mood Tracker
          </h3>

          {/* Mood chart image */}
          <img
            src="/images/report-mood-chart.png"
            alt="Mood tracker chart"
            style={{
              width: "80%",
              borderRadius: "10px",
              marginTop: "12px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />

          {/* Energy level text */}
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "14px",
              color: "#aeb1e7",
              textAlign: "center",
              letterSpacing: "0.56px",
              marginTop: "16px",
            }}
          >
            Your energy level has increased by {report.energyChange}% this month!
          </p>

          {/* Energy bar image */}
          <img
            src="/images/report-energy-bar.png"
            alt="Energy progress bar"
            style={{
              width: "100%",
              marginTop: "12px",
            }}
          />

          {/* Points text */}
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "10px",
              fontStyle: "italic",
              color: "#aeb1e7",
              textAlign: "right",
              letterSpacing: "0.4px",
              marginTop: "8px",
            }}
          >
            You gained {report.pointsGained} points!
          </p>
        </section>
      </FadeIn>

      {/* ─── Insight 1: Mood Pattern ─── */}
      <FadeIn style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            margin: "24px 20px 0",
            borderRadius: "16px",
            padding: "1px",
            background:
              "linear-gradient(135deg, rgba(255, 92, 117, 0.3), rgba(108, 99, 255, 0.2), rgba(174, 177, 231, 0.1))",
          }}
        >
          <div
            style={{
              borderRadius: "15px",
              backgroundColor: "rgba(9, 11, 59, 0.95)",
              padding: "20px",
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  backgroundColor: "rgba(255, 92, 117, 0.15)",
                  borderRadius: "20px",
                  padding: "4px 10px",
                }}
              >
                <Sparkles size={10} color="var(--color-accent-pink)" />
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "var(--color-accent-pink)",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  {report.insights[0].tag}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "9px",
                  color: "rgba(174, 177, 231, 0.4)",
                  letterSpacing: "0.3px",
                }}
              >
                AI-generated from your reviews
              </span>
            </div>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--color-text-white)",
                letterSpacing: "0.3px",
                marginBottom: "8px",
                lineHeight: 1.3,
              }}
            >
              {report.insights[0].title}
            </h4>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                fontWeight: 400,
                color: "var(--color-text-primary)",
                lineHeight: 1.55,
                letterSpacing: "0.2px",
              }}
            >
              {report.insights[0].body}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* ─── Top 3 Moods ─── */}
      <FadeIn style={{ position: "relative", zIndex: 1 }}>
        <section style={{ padding: "24px 20px 0" }}>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontWeight: 700,
              fontStyle: "italic",
              color: "#aeb1e7",
              letterSpacing: "0.64px",
            }}
          >
            Top 3 Moods
          </h3>

          <div
            className="flex items-end justify-between"
            style={{ marginTop: "16px", padding: "0 8px" }}
          >
            {report.topMoods.map((mood, i) => (
              <div key={i} className="flex flex-col items-center" style={{ gap: "8px" }}>
                <img
                  src={mood.image}
                  alt={mood.label}
                  style={{
                    width: i === 0 ? "120px" : i === 1 ? "82px" : "58px",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "14px",
                    fontStyle: "italic",
                    color: "#aeb1e7",
                    letterSpacing: "0.56px",
                  }}
                >
                  {mood.count} times
                </span>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ─── Insight 2: Social Insight ─── */}
      <FadeIn style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            margin: "24px 20px 0",
            borderRadius: "16px",
            padding: "1px",
            background:
              "linear-gradient(135deg, rgba(255, 92, 117, 0.3), rgba(108, 99, 255, 0.2), rgba(174, 177, 231, 0.1))",
          }}
        >
          <div
            style={{
              borderRadius: "15px",
              backgroundColor: "rgba(9, 11, 59, 0.95)",
              padding: "20px",
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  backgroundColor: "rgba(255, 92, 117, 0.15)",
                  borderRadius: "20px",
                  padding: "4px 10px",
                }}
              >
                <Sparkles size={10} color="var(--color-accent-pink)" />
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "var(--color-accent-pink)",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  {report.insights[1].tag}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "9px",
                  color: "rgba(174, 177, 231, 0.4)",
                  letterSpacing: "0.3px",
                }}
              >
                AI-generated from your reviews
              </span>
            </div>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--color-text-white)",
                letterSpacing: "0.3px",
                marginBottom: "8px",
                lineHeight: 1.3,
              }}
            >
              {report.insights[1].title}
            </h4>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                fontWeight: 400,
                color: "var(--color-text-primary)",
                lineHeight: 1.55,
                letterSpacing: "0.2px",
              }}
            >
              {report.insights[1].body}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* ─── Emotion & Activity Breakdown ─── */}
      <FadeIn style={{ position: "relative", zIndex: 1 }}>
        <section style={{ padding: "24px 20px 0" }}>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontWeight: 700,
              fontStyle: "italic",
              color: "#aeb1e7",
              letterSpacing: "0.64px",
            }}
          >
            Emotion &amp; Activity Breakdown
          </h3>

          {/* Activity breakdown image (donut chart + percentages) */}
          <img
            src="/images/report-activity-breakdown.png"
            alt="Emotion and activity breakdown chart"
            style={{
              width: "100%",
              marginTop: "16px",
            }}
          />

          {/* Legend labels */}
          <div
            className="flex flex-col"
            style={{ gap: "10px", marginTop: "24px", paddingLeft: "12px" }}
          >
            {[
              { color: "#EB576D", label: "Physical Activities" },
              { color: "#924E8F", label: "Intellectual & Cultural Activities" },
              { color: "#F5FDA1", label: "Creative & Skill-based Activities" },
              { color: "#A6FFD6", label: "Social & Purpose-driven Activities" },
            ].map((item) => (
              <div key={item.label} className="flex items-center" style={{ gap: "10px" }}>
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: item.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "14px",
                    fontStyle: "italic",
                    color: "#aeb1e7",
                    letterSpacing: "0.56px",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ─── Insight 3: Growth & Discovery ─── */}
      <FadeIn style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            margin: "24px 20px 0",
            borderRadius: "16px",
            padding: "1px",
            background:
              "linear-gradient(135deg, rgba(255, 92, 117, 0.3), rgba(108, 99, 255, 0.2), rgba(174, 177, 231, 0.1))",
          }}
        >
          <div
            style={{
              borderRadius: "15px",
              backgroundColor: "rgba(9, 11, 59, 0.95)",
              padding: "20px",
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  backgroundColor: "rgba(255, 92, 117, 0.15)",
                  borderRadius: "20px",
                  padding: "4px 10px",
                }}
              >
                <Sparkles size={10} color="var(--color-accent-pink)" />
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "var(--color-accent-pink)",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  {report.insights[2].tag}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "9px",
                  color: "rgba(174, 177, 231, 0.4)",
                  letterSpacing: "0.3px",
                }}
              >
                AI-generated from your reviews
              </span>
            </div>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--color-text-white)",
                letterSpacing: "0.3px",
                marginBottom: "8px",
                lineHeight: 1.3,
              }}
            >
              {report.insights[2].title}
            </h4>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                fontWeight: 400,
                color: "var(--color-text-primary)",
                lineHeight: 1.55,
                letterSpacing: "0.2px",
              }}
            >
              {report.insights[2].body}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* ─── Insight 4: Personal Growth ─── */}
      <FadeIn style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            margin: "24px 20px 0",
            borderRadius: "16px",
            padding: "1px",
            background:
              "linear-gradient(135deg, rgba(255, 92, 117, 0.3), rgba(108, 99, 255, 0.2), rgba(174, 177, 231, 0.1))",
          }}
        >
          <div
            style={{
              borderRadius: "15px",
              backgroundColor: "rgba(9, 11, 59, 0.95)",
              padding: "20px",
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  backgroundColor: "rgba(255, 92, 117, 0.15)",
                  borderRadius: "20px",
                  padding: "4px 10px",
                }}
              >
                <Sparkles size={10} color="var(--color-accent-pink)" />
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "var(--color-accent-pink)",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  {report.insights[3].tag}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "9px",
                  color: "rgba(174, 177, 231, 0.4)",
                  letterSpacing: "0.3px",
                }}
              >
                AI-generated from your reviews
              </span>
            </div>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--color-text-white)",
                letterSpacing: "0.3px",
                marginBottom: "8px",
                lineHeight: 1.3,
              }}
            >
              {report.insights[3].title}
            </h4>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                fontWeight: 400,
                color: "var(--color-text-primary)",
                lineHeight: 1.55,
                letterSpacing: "0.2px",
              }}
            >
              {report.insights[3].body}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* ─── Next Step Recommendations ─── */}
      <FadeIn style={{ position: "relative", zIndex: 1 }}>
        <section style={{ padding: "24px 20px 0" }}>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontWeight: 700,
              fontStyle: "italic",
              color: "#aeb1e7",
              letterSpacing: "0.64px",
              marginBottom: "12px",
            }}
          >
            Next Step Recommendations...
          </h3>

          {/* Category tag */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "#aeb1e7",
              borderRadius: "20px",
              height: "21px",
              padding: "0 12px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "12px",
                color: "#090b3b",
              }}
            >
              Recreational Team Games
            </span>
          </div>

          {/* Horizontal scroll carousel (same as home page recommended) */}
          <div
            className="flex overflow-x-auto hide-scrollbar"
            style={{ gap: "10px", paddingTop: "12px", paddingBottom: "8px" }}
          >
            {recommendedTeam.map((a) => (
              <div key={a.id} className="shrink-0" style={{ width: "160px" }}>
                <ActivityCard
                  eventId={a.id}
                  image={a.image}
                  title={a.title}
                  height="180px"
                  details={<RecommendationDetails a={a} />}
                />
              </div>
            ))}
          </div>

          {/* Second category tag */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "#aeb1e7",
              borderRadius: "20px",
              height: "21px",
              padding: "0 12px",
              marginTop: "12px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "12px",
                color: "#090b3b",
              }}
            >
              Physical Activities
            </span>
          </div>

          {/* Second horizontal scroll carousel */}
          <div
            className="flex overflow-x-auto hide-scrollbar"
            style={{ gap: "10px", paddingTop: "12px", paddingBottom: "8px" }}
          >
            {recommendedPhysical.map((a) => (
              <div key={`phys-${a.id}`} className="shrink-0" style={{ width: "160px" }}>
                <ActivityCard
                  eventId={a.id}
                  image={a.image}
                  title={a.title}
                  height="180px"
                  details={<RecommendationDetails a={a} />}
                />
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      <MonthPickerSheet
        isOpen={showMonthPicker}
        onClose={() => setShowMonthPicker(false)}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onSelect={(month, year) => {
          setSelectedMonth(month);
          setSelectedYear(year);
        }}
      />

      <SocialLevelSheet
        isOpen={showLevelSheet}
        onClose={() => setShowLevelSheet(false)}
        currentLevelId={USER_LEVEL.id}
      />
    </div>
  );
}
