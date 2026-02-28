import { useState, useMemo, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { HeroBanner } from "@/components/HeroBanner";
import { FilterChip } from "@/components/FilterChip";
import { ActivityCard } from "@/components/ActivityCard";
import { SearchOverlay } from "@/components/SearchOverlay";
import { RegionSheet } from "@/components/RegionSheet";
import { fetchActivities } from "@/lib/events";

export const Route = createFileRoute("/home")({
  loader: () => fetchActivities(),
  component: HomePage,
});

/* ─── Normalized activity data ─── */

export interface Activity {
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

/* ─── Helpers ─── */

type SortMode = "upcoming" | "nearby" | "views";

export function formatEventDate(iso: string): string {
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
      ) : null}
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
        {a.rewards ? (
          <>
            <span style={{ opacity: 0.4 }}>&middot;</span>
            <span style={{ color: "var(--color-accent-pink)", fontWeight: 500 }}>
              +{a.rewards}pts
            </span>
          </>
        ) : null}
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
  const activities = Route.useLoaderData();
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
  }, [activities, activeSort, selectedRegion]);

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
          gap: "8px",
          animation: "pageEnter 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          animationDelay: "80ms",
          animationFillMode: "backwards",
        }}
      >
        {/* Search icon button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="shrink-0 flex items-center justify-center cursor-pointer"
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            border: "1px solid rgba(174, 177, 231, 0.25)",
            background: "rgba(174, 177, 231, 0.08)",
            transition: "all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onPointerDown={(e) => {
            const el = e.currentTarget;
            el.style.transform = "scale(0.88)";
          }}
          onPointerUp={(e) => {
            const el = e.currentTarget;
            el.style.transform = "";
          }}
          onPointerLeave={(e) => {
            const el = e.currentTarget;
            el.style.transform = "";
          }}
          aria-label="Search"
        >
          <Search
            size={12}
            color="var(--color-text-primary)"
            strokeWidth={2.5}
          />
        </button>

        {/* Sort chips */}
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

        {/* Region chip */}
        <FilterChip
          label={regionLabel}
          icon="filter"
          onClick={() => setRegionSheetOpen(true)}
        />
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
                eventId={a.id}
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
                  eventId={a.id}
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
        activities={activities}
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
