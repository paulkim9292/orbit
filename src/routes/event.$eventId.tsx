import { useState, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Eye,
  Share2,
  Heart,
  MessageCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { fetchEventById, type EventDetail } from "@/lib/events";
import { formatEventDate } from "./home";

export const Route = createFileRoute("/event/$eventId")({
  loader: ({ params }) => fetchEventById(params.eventId),
  component: EventDetailPage,
});

/* ─── Helpers ─── */

function formatTime(time: string | null): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m}${ampm}`;
}

function getGenderLabel(gender: string | null): string {
  if (!gender || gender === "anyone") return "Everyone welcome";
  if (gender === "girls") return "Girls only";
  if (gender === "boys") return "Boys only";
  return "Everyone welcome";
}

function getAgeLabel(from: number | null, to: number | null): string {
  if (!from && !to) return "All ages";
  if (from && to) return `${from} – ${to} years`;
  if (from) return `${from}+ years`;
  return `Up to ${to} years`;
}

function getTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

/* ─── Attendee avatar row ─── */

function AttendeeAvatars({ count, max }: { count: number; max: number | null }) {
  const shown = Math.min(count, 5);
  const remaining = count - shown;

  return (
    <div className="flex items-center">
      <div className="flex" style={{ marginLeft: "2px" }}>
        {Array.from({ length: shown }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "2px solid var(--color-bg-primary)",
              marginLeft: i === 0 ? "0" : "-8px",
              background: `linear-gradient(135deg, ${
                [
                  "#7c6ee7, #b47ee7",
                  "#e76e9a, #e7a87e",
                  "#6eb5e7, #6ee7c4",
                  "#e7d16e, #e7926e",
                  "#9a6ee7, #e76eb5",
                ][i % 5]
              })`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: shown - i,
              animation: `slideUp 400ms cubic-bezier(0.16, 1, 0.3, 1) backwards ${300 + i * 60}ms`,
            }}
          >
            <img
              src="/icons/avatar.svg"
              alt=""
              style={{
                width: "14px",
                height: "14px",
                opacity: 0.9,
                filter: "brightness(2)",
              }}
            />
          </div>
        ))}
      </div>
      <span
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "12px",
          color: "var(--color-text-primary)",
          marginLeft: "10px",
          letterSpacing: "0.3px",
        }}
      >
        {remaining > 0 && `+${remaining} `}
        {count} joined
        {max ? (
          <span style={{ opacity: 0.5 }}> / {max} spots</span>
        ) : null}
      </span>
    </div>
  );
}

/* ─── Info row component ─── */

function InfoRow({
  icon,
  label,
  value,
  accent,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
  delay?: number;
}) {
  return (
    <div
      className="flex items-start"
      style={{
        gap: "12px",
        animation: `slideUp 450ms cubic-bezier(0.16, 1, 0.3, 1) backwards ${delay}ms`,
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          backgroundColor: "rgba(174, 177, 231, 0.08)",
          border: "1px solid rgba(174, 177, 231, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div className="flex flex-col" style={{ gap: "2px", paddingTop: "2px" }}>
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "10px",
            color: "var(--color-text-primary)",
            opacity: 0.5,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "14px",
            fontWeight: 500,
            color: accent ? "var(--color-accent-pink)" : "var(--color-text-white)",
            letterSpacing: "0.3px",
            lineHeight: 1.3,
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

/* ─── Completion Code Modal ─── */

function CompletionCodeModal({
  open,
  onClose,
  eventId,
}: {
  open: boolean;
  onClose: () => void;
  eventId: string;
}) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [confirmed, setConfirmed] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const modalNavigate = useNavigate();

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setCode(["", "", "", "", "", ""]);
      onClose();
      modalNavigate({
        to: "/review/$eventId",
        params: { eventId },
      });
    }, 1200);
  };

  if (!open) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        zIndex: 50,
        backgroundColor: "rgba(9, 11, 59, 0.7)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        animation: "fadeIn 250ms ease-out",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "303px",
          borderRadius: "20px",
          backgroundColor: "rgba(174, 177, 231, 0.96)",
          boxShadow: "0 4px 10px rgba(9, 11, 59, 0.69)",
          padding: "24px 24px 20px",
          position: "relative",
          animation: "slideUp 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute flex items-center justify-center cursor-pointer"
          style={{
            top: "12px",
            right: "12px",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "rgba(9, 11, 59, 0.15)",
          }}
        >
          <X size={14} color="#0a0c3c" strokeWidth={2.5} />
        </button>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "30px",
            fontWeight: 700,
            color: "#0a0c3c",
            textAlign: "center",
            letterSpacing: "1.2px",
            marginBottom: "20px",
          }}
        >
          {confirmed ? "Confirmed!" : "Completion Code"}
        </h3>

        {confirmed ? (
          <div
            className="flex flex-col items-center"
            style={{ gap: "8px", paddingBottom: "4px" }}
          >
            <CheckCircle size={40} color="#0a0c3c" strokeWidth={1.5} />
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                color: "#0a0c3c",
                opacity: 0.7,
              }}
            >
              Event completion recorded
            </span>
          </div>
        ) : (
          <>
            {/* Code inputs */}
            <div
              className="flex justify-center"
              style={{ gap: "8px", marginBottom: "20px" }}
            >
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInput(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  style={{
                    width: "36px",
                    height: "42px",
                    borderRadius: "8px",
                    border: "2px solid #090b3b",
                    backgroundColor: "transparent",
                    fontFamily: "var(--font-heading)",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#090b3b",
                    textAlign: "center",
                    outline: "none",
                  }}
                />
              ))}
            </div>

            {/* Confirm button */}
            <div className="flex justify-center">
              <button
                onClick={handleConfirm}
                className="cursor-pointer"
                disabled={code.some((d) => !d)}
                style={{
                  height: "32px",
                  padding: "0 32px",
                  borderRadius: "20px",
                  border: "1px solid #090b3b",
                  backgroundColor: "transparent",
                  fontFamily: "var(--font-heading)",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#090b3b",
                  letterSpacing: "0.3px",
                  opacity: code.some((d) => !d) ? 0.4 : 1,
                  transition: "opacity 200ms ease",
                }}
              >
                Confirm Code
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Page ─── */

function EventDetailPage() {
  const event = Route.useLoaderData() as EventDetail;
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);

  const isPast = new Date(event.eventDate) < new Date();
  const spotsLeft =
    event.maxPeople != null ? Math.max(0, event.maxPeople - event.people) : null;

  const handleJoin = () => {
    setJoining(true);
    setTimeout(() => {
      setJoining(false);
      setJoined(true);
    }, 800);
  };

  return (
    <div className="relative flex flex-col" style={{ minHeight: "100dvh" }}>
      {/* ─── Hero Image ─── */}
      <div
        className="relative"
        style={{
          height: "300px",
          overflow: "hidden",
          animation: "fadeIn 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <img
          src={event.image}
          alt={event.title}
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: "cover" }}
        />

        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(9, 11, 59, 0.6) 0%, transparent 35%, transparent 50%, rgba(9, 11, 59, 0.95) 100%)",
          }}
        />

        {/* Top bar — back + actions */}
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-between"
          style={{
            padding: "16px 20px",
            paddingTop: "20px",
            animation:
              "slideUp 400ms cubic-bezier(0.16, 1, 0.3, 1) backwards 100ms",
          }}
        >
          <button
            onClick={() => navigate({ to: "/home" })}
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "rgba(9, 11, 59, 0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(174, 177, 231, 0.15)",
              transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onPointerDown={(e) => {
              e.currentTarget.style.transform = "scale(0.88)";
            }}
            onPointerUp={(e) => {
              e.currentTarget.style.transform = "";
            }}
            onPointerLeave={(e) => {
              e.currentTarget.style.transform = "";
            }}
            aria-label="Go back"
          >
            <ArrowLeft size={18} color="#fff" strokeWidth={2} />
          </button>

          <div className="flex" style={{ gap: "8px" }}>
            <button
              onClick={() => {}}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "rgba(9, 11, 59, 0.5)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(174, 177, 231, 0.15)",
                transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onPointerDown={(e) => {
                e.currentTarget.style.transform = "scale(0.88)";
              }}
              onPointerUp={(e) => {
                e.currentTarget.style.transform = "";
              }}
              onPointerLeave={(e) => {
                e.currentTarget.style.transform = "";
              }}
              aria-label="Share"
            >
              <Share2 size={16} color="#fff" strokeWidth={2} />
            </button>
            <button
              onClick={() => setLiked((l) => !l)}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: liked
                  ? "rgba(255, 92, 117, 0.25)"
                  : "rgba(9, 11, 59, 0.5)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: liked
                  ? "1px solid rgba(255, 92, 117, 0.4)"
                  : "1px solid rgba(174, 177, 231, 0.15)",
                transition:
                  "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onPointerDown={(e) => {
                e.currentTarget.style.transform = "scale(0.88)";
              }}
              onPointerUp={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                setTimeout(() => {
                  if (e.currentTarget)
                    e.currentTarget.style.transform = "";
                }, 150);
              }}
              onPointerLeave={(e) => {
                e.currentTarget.style.transform = "";
              }}
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart
                size={16}
                color={liked ? "#ff5c75" : "#fff"}
                fill={liked ? "#ff5c75" : "none"}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>

        {/* Points badge — floating on hero */}
        {event.rewards && (
          <div
            className="absolute"
            style={{
              bottom: "16px",
              right: "20px",
              animation:
                "slideUp 500ms cubic-bezier(0.16, 1, 0.3, 1) backwards 200ms",
            }}
          >
            <div
              className="flex items-center"
              style={{
                gap: "5px",
                padding: "5px 12px",
                borderRadius: "100px",
                backgroundColor: "rgba(255, 92, 117, 0.15)",
                border: "1px solid rgba(255, 92, 117, 0.3)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <Star
                size={12}
                color="#ff5c75"
                fill="#ff5c75"
                strokeWidth={0}
              />
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#ff5c75",
                  letterSpacing: "0.3px",
                }}
              >
                +{event.rewards}pts
              </span>
            </div>
          </div>
        )}

        {/* Category chip — floating on hero */}
        {event.category && (
          <div
            className="absolute"
            style={{
              bottom: "16px",
              left: "20px",
              animation:
                "slideUp 500ms cubic-bezier(0.16, 1, 0.3, 1) backwards 250ms",
            }}
          >
            <span
              style={{
                display: "inline-block",
                fontFamily: "var(--font-heading)",
                fontSize: "11px",
                fontWeight: 500,
                backgroundColor: "rgba(174, 177, 231, 0.15)",
                color: "var(--color-text-primary)",
                borderRadius: "100px",
                padding: "4px 12px",
                border: "1px solid rgba(174, 177, 231, 0.2)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                letterSpacing: "0.3px",
              }}
            >
              {event.subcategory?.replace(/\n/g, " ") || event.category}
            </span>
          </div>
        )}
      </div>

      {/* ─── Content ─── */}
      <div
        className="flex flex-col"
        style={{
          padding: "24px 20px",
          gap: "24px",
          paddingBottom: "100px",
        }}
      >
        {/* Title + meta */}
        <div
          style={{
            animation:
              "slideUp 450ms cubic-bezier(0.16, 1, 0.3, 1) backwards 150ms",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--color-text-white)",
              letterSpacing: "0.5px",
              lineHeight: 1.25,
            }}
          >
            {event.title}
          </h1>
          <div
            className="flex items-center"
            style={{
              gap: "8px",
              marginTop: "8px",
            }}
          >
            <div className="flex items-center" style={{ gap: "4px" }}>
              <Eye size={12} color="var(--color-text-primary)" strokeWidth={2} />
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "11px",
                  color: "var(--color-text-primary)",
                  opacity: 0.6,
                }}
              >
                {event.views} views
              </span>
            </div>
            <span
              style={{
                color: "var(--color-text-primary)",
                opacity: 0.3,
                fontSize: "11px",
              }}
            >
              &middot;
            </span>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "11px",
                color: "var(--color-text-primary)",
                opacity: 0.6,
              }}
            >
              Posted {getTimeAgo(event.uploadDate)}
            </span>
          </div>
        </div>

        {/* ─── Info cards ─── */}
        <div className="flex flex-col" style={{ gap: "16px" }}>
          <InfoRow
            icon={<Calendar size={16} color="var(--color-text-primary)" strokeWidth={2} />}
            label="Date"
            value={formatEventDate(event.eventDate)}
            delay={200}
          />
          {(event.timeFrom || event.timeTo) && (
            <InfoRow
              icon={<Clock size={16} color="var(--color-text-primary)" strokeWidth={2} />}
              label="Time"
              value={
                event.timeFrom && event.timeTo
                  ? `${formatTime(event.timeFrom)} – ${formatTime(event.timeTo)}`
                  : formatTime(event.timeFrom || event.timeTo)
              }
              delay={260}
            />
          )}
          <InfoRow
            icon={<MapPin size={16} color="var(--color-text-primary)" strokeWidth={2} />}
            label="Location"
            value={event.location || event.district}
            delay={320}
          />
          <InfoRow
            icon={<Users size={16} color="var(--color-text-primary)" strokeWidth={2} />}
            label="Who can join"
            value={`${getGenderLabel(event.gender)} · ${getAgeLabel(event.ageFrom, event.ageTo)}`}
            delay={380}
          />
          {event.rewards && (
            <InfoRow
              icon={<Star size={16} color="#ff5c75" strokeWidth={2} />}
              label="Social Wellbeing Points"
              value={`+${event.rewards} points`}
              accent
              delay={440}
            />
          )}
        </div>

        {/* ─── Divider ─── */}
        <div
          style={{
            height: "1px",
            backgroundColor: "rgba(174, 177, 231, 0.1)",
            animation:
              "slideUp 400ms cubic-bezier(0.16, 1, 0.3, 1) backwards 400ms",
          }}
        />

        {/* ─── Attendees ─── */}
        <div
          style={{
            animation:
              "slideUp 450ms cubic-bezier(0.16, 1, 0.3, 1) backwards 450ms",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontWeight: 600,
              color: "var(--color-text-white)",
              letterSpacing: "0.5px",
              marginBottom: "12px",
            }}
          >
            Attendees
          </h2>
          <AttendeeAvatars count={event.people} max={event.maxPeople} />
          {spotsLeft !== null && spotsLeft > 0 && !isPast && (
            <span
              style={{
                display: "inline-block",
                fontFamily: "var(--font-heading)",
                fontSize: "11px",
                color: "var(--color-accent-pink)",
                marginTop: "8px",
                letterSpacing: "0.3px",
              }}
            >
              {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left!
            </span>
          )}
        </div>

        {/* ─── Description ─── */}
        {event.description && (
          <div
            style={{
              animation:
                "slideUp 450ms cubic-bezier(0.16, 1, 0.3, 1) backwards 500ms",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "16px",
                fontWeight: 600,
                color: "var(--color-text-white)",
                letterSpacing: "0.5px",
                marginBottom: "10px",
              }}
            >
              About this event
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--color-text-primary)",
                lineHeight: 1.65,
                opacity: 0.8,
                letterSpacing: "0.2px",
              }}
            >
              {event.description}
            </p>
          </div>
        )}
      </div>

      {/* ─── Sticky bottom CTA ─── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          padding: "16px 20px",
          paddingBottom: "24px",
          background:
            "linear-gradient(to top, var(--color-bg-primary) 60%, transparent)",
          animation:
            "slideUp 500ms cubic-bezier(0.16, 1, 0.3, 1) backwards 400ms",
        }}
      >
        {joined ? (
          /* ─── Post-join action buttons ─── */
          <div
            className="flex"
            style={{
              gap: "10px",
              animation: "slideUp 400ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Message Group button */}
            <button
              onClick={() =>
                navigate({
                  to: "/chat/$eventId",
                  params: { eventId: event.id },
                })
              }
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "1px solid rgba(174, 177, 231, 0.25)",
                backgroundColor: "rgba(174, 177, 231, 0.12)",
                flexShrink: 0,
                transition: "all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onPointerDown={(e) => {
                e.currentTarget.style.transform = "scale(0.9)";
              }}
              onPointerUp={(e) => {
                e.currentTarget.style.transform = "";
              }}
              onPointerLeave={(e) => {
                e.currentTarget.style.transform = "";
              }}
              aria-label="Message group"
            >
              <MessageCircle
                size={20}
                color="var(--color-text-primary)"
                strokeWidth={2}
              />
            </button>

            {/* Confirm completion button */}
            <button
              onClick={() => setCompletionModalOpen(true)}
              className="flex-1 cursor-pointer"
              style={{
                height: "48px",
                borderRadius: "100px",
                border: "none",
                fontFamily: "var(--font-heading)",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.4px",
                color: "var(--color-bg-primary)",
                backgroundColor: "var(--color-accent-yellow)",
                boxShadow: "0 4px 20px rgba(245, 253, 161, 0.2)",
                transition: "all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onPointerDown={(e) => {
                e.currentTarget.style.transform = "scale(0.97)";
              }}
              onPointerUp={(e) => {
                e.currentTarget.style.transform = "";
              }}
              onPointerLeave={(e) => {
                e.currentTarget.style.transform = "";
              }}
            >
              Confirm Completion
            </button>
          </div>
        ) : (
          /* ─── Pre-join / default button ─── */
          <button
            onClick={handleJoin}
            disabled={
              isPast ||
              joining ||
              (spotsLeft !== null && spotsLeft <= 0)
            }
            className="w-full cursor-pointer"
            style={{
              height: "48px",
              borderRadius: "100px",
              border: "none",
              fontFamily: "var(--font-heading)",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              color: isPast
                ? "var(--color-text-primary)"
                : "var(--color-bg-primary)",
              backgroundColor: isPast
                ? "rgba(174, 177, 231, 0.15)"
                : spotsLeft !== null && spotsLeft <= 0
                  ? "rgba(174, 177, 231, 0.15)"
                  : "var(--color-text-primary)",
              opacity: joining ? 0.7 : 1,
              transition: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: isPast
                ? "none"
                : "0 4px 20px rgba(174, 177, 231, 0.15)",
            }}
            onPointerDown={(e) => {
              if (!isPast)
                e.currentTarget.style.transform = "scale(0.97)";
            }}
            onPointerUp={(e) => {
              e.currentTarget.style.transform = "";
            }}
            onPointerLeave={(e) => {
              e.currentTarget.style.transform = "";
            }}
          >
            {joining
              ? "Joining..."
              : isPast
                ? "Event has ended"
                : spotsLeft !== null && spotsLeft <= 0
                  ? "No spots left"
                  : "Join this event"}
          </button>
        )}
      </div>

      {/* ─── Completion Code Modal ─── */}
      <CompletionCodeModal
        open={completionModalOpen}
        onClose={() => setCompletionModalOpen(false)}
        eventId={event.id}
      />
    </div>
  );
}
