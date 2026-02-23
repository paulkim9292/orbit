import { useState, useMemo, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HeroBanner } from "@/components/HeroBanner";
import { FilterChip } from "@/components/FilterChip";
import { ActivityCard } from "@/components/ActivityCard";
import { SearchOverlay } from "@/components/SearchOverlay";
import { RegionSheet } from "@/components/RegionSheet";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

/* ─── Normalized activity data ─── */

interface Activity {
  id: string;
  image: string;
  title: string;
  eventDate: string;
  uploadDate: string;
  district: string;
  people: number;
  views: number;
  rewards?: number;
  featured: boolean;
}

const activities: Activity[] = [
  {
    id: "1",
    image: "/images/home-card-hiking.jpg",
    title: "Dragon's Back Hiking",
    eventDate: "2025-01-10T19:00:00",
    uploadDate: "2025-01-05T10:00:00",
    district: "Southern",
    people: 2,
    views: 342,
    rewards: 300,
    featured: true,
  },
  {
    id: "2",
    image: "/images/home-card-kayaking.jpg",
    title: "Kayaking to Sharp Island",
    eventDate: "2025-01-11T18:00:00",
    uploadDate: "2025-01-04T14:30:00",
    district: "Sai Kung",
    people: 4,
    views: 518,
    rewards: 1000,
    featured: true,
  },
  {
    id: "3",
    image: "/images/home-card-walk.jpg",
    title: "Walk at Waterfront Park",
    eventDate: "2025-01-09T12:00:00",
    uploadDate: "2025-01-06T08:00:00",
    district: "Sai Kung",
    people: 5,
    views: 127,
    featured: false,
  },
  {
    id: "4",
    image: "/images/home-card-running.jpg",
    title: "Anyone down for Running?",
    eventDate: "2025-01-10T13:00:00",
    uploadDate: "2025-01-07T20:15:00",
    district: "Kwun Tong",
    people: 10,
    views: 83,
    featured: false,
  },
  {
    id: "5",
    image: "/images/home-card-yoga.jpg",
    title: "Sunset Yoga at Repulse Bay",
    eventDate: "2025-01-12T17:30:00",
    uploadDate: "2025-01-06T11:00:00",
    district: "Southern",
    people: 8,
    views: 621,
    featured: false,
  },
  {
    id: "6",
    image: "/images/home-card-cycling.jpg",
    title: "Tolo Harbour Cycling",
    eventDate: "2025-01-13T08:00:00",
    uploadDate: "2025-01-05T16:45:00",
    district: "Tai Po",
    people: 6,
    views: 295,
    rewards: 500,
    featured: true,
  },
  {
    id: "7",
    image: "/images/home-card-swim.jpg",
    title: "Morning Swim at Shek O",
    eventDate: "2025-01-11T07:00:00",
    uploadDate: "2025-01-07T09:00:00",
    district: "Southern",
    people: 3,
    views: 189,
    featured: false,
  },
  {
    id: "8",
    image: "/images/home-card-lionrock.jpg",
    title: "Lion Rock Trail Run",
    eventDate: "2025-01-14T06:30:00",
    uploadDate: "2025-01-06T22:00:00",
    district: "Wong Tai Sin",
    people: 12,
    views: 437,
    featured: false,
  },
  {
    id: "9",
    image: "/images/home-card-taichi.jpg",
    title: "Tai Chi at Victoria Park",
    eventDate: "2025-01-09T07:00:00",
    uploadDate: "2025-01-03T15:00:00",
    district: "Wan Chai",
    people: 15,
    views: 204,
    featured: false,
  },
  {
    id: "10",
    image: "/images/home-card-sup.jpg",
    title: "SUP at Sai Kung Pier",
    eventDate: "2025-01-15T10:00:00",
    uploadDate: "2025-01-08T07:30:00",
    district: "Sai Kung",
    people: 4,
    views: 156,
    featured: false,
  },
];

/* ─── Helpers ─── */

type SortMode = "upcoming" | "nearby" | "views";

function formatEventDate(iso: string): string {
  const d = new Date(iso);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const day = d.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th";
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  return `${months[d.getMonth()]} ${day}${suffix} ${h12}:${minutes}${ampm}`;
}

function sortActivities(
  items: Activity[],
  mode: SortMode,
  selectedRegion: string,
): Activity[] {
  const copy = [...items];
  switch (mode) {
    case "upcoming":
      return copy.sort(
        (a, b) =>
          new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
      );
    case "views":
      return copy.sort((a, b) => b.views - a.views);
    case "nearby":
      if (selectedRegion === "All Region") {
        return copy.sort((a, b) => a.district.localeCompare(b.district));
      }
      return copy.sort((a, b) => {
        const aMatch = a.district === selectedRegion ? 0 : 1;
        const bMatch = b.district === selectedRegion ? 0 : 1;
        if (aMatch !== bMatch) return aMatch - bMatch;
        return a.district.localeCompare(b.district);
      });
  }
}

/* ─── Detail renderers ─── */

function FeaturedDetails({ a }: { a: Activity }) {
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
        <span style={{ color: "var(--color-accent-pink)", fontWeight: 500 }}>
          +{a.rewards}pts
        </span>
      ) : (
        <span style={{ opacity: 0.6 }}>
          {a.views.toLocaleString()} views
        </span>
      )}
    </>
  );
}

function GridDetails({ a }: { a: Activity }) {
  return (
    <>
      <span>{formatEventDate(a.eventDate)}</span>
      <div className="flex items-center" style={{ gap: "3px" }}>
        <span>{a.people}</span>
        <img
          src="/icons/home-people.svg"
          alt=""
          style={{ width: "14px", height: "7px", opacity: 0.7 }}
        />
        <span style={{ opacity: 0.4 }}>&middot;</span>
        <span style={{ opacity: 0.6 }}>
          {a.views.toLocaleString()} views
        </span>
      </div>
    </>
  );
}

/* ─── Skeleton loader ─── */

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        height: "155px",
        borderRadius: "12px",
        backgroundColor: "var(--color-card-bg)",
        animation: "fadeIn 300ms ease-out",
        animationDelay: `${index * 60}ms`,
        animationFillMode: "backwards",
      }}
    >
      {/* Shimmer sweep */}
      <div
        className="absolute inset-0"
        style={{
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(174, 177, 231, 0.06) 40%, rgba(174, 177, 231, 0.1) 50%, rgba(174, 177, 231, 0.06) 60%, transparent 100%)",
            animation: "shimmerLine 1.8s ease-in-out infinite",
          }}
        />
      </div>
      {/* Placeholder lines at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col"
        style={{ padding: "10px 12px", gap: "6px" }}
      >
        <div
          style={{
            width: "70%",
            height: "10px",
            borderRadius: "5px",
            backgroundColor: "rgba(174, 177, 231, 0.1)",
          }}
        />
        <div
          style={{
            width: "45%",
            height: "8px",
            borderRadius: "4px",
            backgroundColor: "rgba(174, 177, 231, 0.07)",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Page ─── */

function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [regionSheetOpen, setRegionSheetOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("All Region");
  const [activeSort, setActiveSort] = useState<SortMode>("upcoming");

  const regionLabel =
    selectedRegion === "All Region" ? "All Region" : selectedRegion;

  const featuredActivities = activities.filter((a) => a.featured);

  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);

  const filteredAndSorted = useMemo(() => {
    const filtered =
      selectedRegion === "All Region"
        ? activities
        : activities.filter((a) => a.district === selectedRegion);
    return sortActivities(filtered, activeSort, selectedRegion);
  }, [activeSort, selectedRegion]);

  // Show 2s loading skeleton when sort or region changes (not on initial mount)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, [activeSort, selectedRegion]);

  return (
    <div className="relative flex flex-col" style={{ paddingBottom: "24px" }}>
      {/* Hero Banner */}
      <div className="animate-page-enter" style={{ paddingTop: "20px" }}>
        <HeroBanner />
      </div>

      {/* Filter Tags */}
      <div
        className="flex items-center"
        style={{
          padding: "16px 20px",
          gap: "5px",
          animation: "pageEnter 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          animationDelay: "80ms",
          animationFillMode: "backwards",
        }}
      >
        {/* Left group — sort chips */}
        <div className="flex" style={{ gap: "5px" }}>
          <FilterChip
            label="Upcoming"
            active={activeSort === "upcoming"}
            onClick={() => setActiveSort("upcoming")}
          />
          <FilterChip
            label="Nearby"
            active={activeSort === "nearby"}
            onClick={() => setActiveSort("nearby")}
          />
          <FilterChip
            label="Views"
            active={activeSort === "views"}
            onClick={() => setActiveSort("views")}
          />
        </div>
        {/* Spacer */}
        <div className="flex-1" />
        {/* Right group — actions */}
        <div className="flex" style={{ gap: "5px" }}>
          <FilterChip
            label="Search"
            icon="filter"
            onClick={() => setSearchOpen(true)}
          />
          <FilterChip
            label={regionLabel}
            icon="filter"
            onClick={() => setRegionSheetOpen(true)}
          />
        </div>
      </div>

      {/* For this week, we recommend */}
      <section
        style={{
          padding: "0 20px",
          animation: "pageEnter 450ms cubic-bezier(0.16, 1, 0.3, 1)",
          animationDelay: "150ms",
          animationFillMode: "backwards",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "20px",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            letterSpacing: "0.8px",
          }}
        >
          For this week, we recommend:
        </h2>
        <div
          className="flex overflow-x-auto hide-scrollbar"
          style={{ gap: "10px", paddingTop: "12px", paddingBottom: "8px" }}
        >
          {featuredActivities.map((a) => (
            <div key={a.id} className="shrink-0" style={{ width: "160px" }}>
              <ActivityCard
                image={a.image}
                title={a.title}
                height="180px"
                details={<FeaturedDetails a={a} />}
              />
            </div>
          ))}
        </div>
      </section>

      {/* All Activities — 2-column grid, sorted by active filter */}
      <section
        style={{
          padding: "16px 20px 0",
          animation: "pageEnter 450ms cubic-bezier(0.16, 1, 0.3, 1)",
          animationDelay: "250ms",
          animationFillMode: "backwards",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "20px",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            letterSpacing: "0.8px",
          }}
        >
          All Activities
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            paddingTop: "12px",
            paddingBottom: "8px",
          }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} index={i} />
              ))
            : filteredAndSorted.map((a) => (
                <ActivityCard
                  key={a.id}
                  image={a.image}
                  title={a.title}
                  height="155px"
                  details={<GridDetails a={a} />}
                />
              ))}
        </div>
      </section>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Region Bottom Sheet */}
      <RegionSheet
        isOpen={regionSheetOpen}
        onClose={() => setRegionSheetOpen(false)}
        selectedRegion={selectedRegion}
        onSelect={setSelectedRegion}
      />
    </div>
  );
}
