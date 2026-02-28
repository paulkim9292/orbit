import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/review/$eventId")({
  component: ReviewPage,
});

/* ─── Mood options ─── */

interface MoodOption {
  id: string;
  label: string;
  image: string;
  imageSelected: string;
}

const MOODS: MoodOption[] = [
  { id: "excited", label: "Excited!", image: "/images/mood-excited.png", imageSelected: "/images/mood-excited-selected.png" },
  { id: "happy", label: "Happy", image: "/images/mood-happy.png", imageSelected: "/images/mood-happy-selected.png" },
  { id: "good", label: "Good", image: "/images/mood-good.png", imageSelected: "/images/mood-good-selected.png" },
  { id: "not-good", label: "Not Good", image: "/images/mood-notgood.png", imageSelected: "/images/mood-notgood-selected.png" },
  { id: "confused", label: "Confused", image: "/images/mood-confused.png", imageSelected: "/images/mood-confused-selected.png" },
  { id: "sad", label: "Sad", image: "/images/mood-sad.png", imageSelected: "/images/mood-sad-selected.png" },
];

/* ─── Page ─── */

function ReviewPage() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [reflection, setReflection] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      navigate({ to: "/home" });
    }, 1500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient Background Header */}
      <div className="absolute top-0 left-0 w-full" style={{ height: "290px" }}>
        <img src="/gradient-background.svg" alt="" className="w-full h-full object-cover" />
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

      {/* ─── Content ─── */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{ padding: "48px 20px 40px", minHeight: "100vh" }}
      >
        {/* Planet heart logo */}
        <div
          style={{
            animation:
              "slideUp 500ms cubic-bezier(0.16, 1, 0.3, 1) backwards",
          }}
        >
          <img
            src="/planet-heart.svg"
            alt=""
            style={{ width: "150px", height: "88px" }}
          />
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "30px",
            fontWeight: 700,
            color: "var(--color-text-primary)",
            textAlign: "center",
            letterSpacing: "1.2px",
            marginTop: "52px",
            animation:
              "slideUp 500ms cubic-bezier(0.16, 1, 0.3, 1) backwards 80ms",
          }}
        >
          How was the event?
        </h1>

        {/* ─── Quick Mood-Check ─── */}
        <div
          className="w-full"
          style={{
            marginTop: "32px",
            animation:
              "slideUp 500ms cubic-bezier(0.16, 1, 0.3, 1) backwards 150ms",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontWeight: 700,
              fontStyle: "italic",
              color: "var(--color-text-primary)",
              letterSpacing: "0.64px",
              marginBottom: "12px",
              paddingLeft: "1px",
            }}
          >
            Quick Mood-Check!
          </h2>

          <div
            style={{
              border: "1px solid var(--color-text-primary)",
              borderRadius: "20px",
              padding: "12px 8px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "8px 4px",
              }}
            >
              {MOODS.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className="flex flex-col items-center cursor-pointer"
                  style={{
                    gap: "6px",
                    padding: "4px",
                    border: "none",
                    backgroundColor: "transparent",
                    transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onPointerDown={(e) => {
                    e.currentTarget.style.transform = "scale(0.92)";
                  }}
                  onPointerUp={(e) => {
                    e.currentTarget.style.transform = "";
                  }}
                  onPointerLeave={(e) => {
                    e.currentTarget.style.transform = "";
                  }}
                >
                  <img
                    src={selectedMood === mood.id ? mood.imageSelected : mood.image}
                    alt={mood.label}
                    style={{
                      width: "102px",
                      height: "60px",
                      objectFit: "contain",
                      opacity: selectedMood && selectedMood !== mood.id ? 0.4 : 1,
                      transition: "opacity 250ms ease",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "10px",
                      fontWeight: 700,
                      fontStyle: "italic",
                      color: "var(--color-text-primary)",
                      letterSpacing: "0.4px",
                      textAlign: "center",
                      opacity: selectedMood && selectedMood !== mood.id ? 0.4 : 1,
                      transition: "opacity 250ms ease",
                    }}
                  >
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── One-Sentence Reflection ─── */}
        <div
          className="w-full"
          style={{
            marginTop: "24px",
            animation:
              "slideUp 500ms cubic-bezier(0.16, 1, 0.3, 1) backwards 220ms",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontWeight: 700,
              fontStyle: "italic",
              color: "var(--color-text-primary)",
              letterSpacing: "0.64px",
              marginBottom: "12px",
              paddingLeft: "1px",
            }}
          >
            One-Sentence Reflection
          </h2>

          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="It was a great new experience!"
            style={{
              width: "100%",
              height: "87px",
              borderRadius: "20px",
              border: "1px solid var(--color-text-primary)",
              backgroundColor: "transparent",
              padding: "16px 18px",
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontStyle: "italic",
              color: "var(--color-text-primary)",
              letterSpacing: "0.64px",
              lineHeight: 1.4,
              outline: "none",
              resize: "none",
              caretColor: "var(--color-accent-yellow)",
            }}
          />
        </div>

        {/* ─── Submit ─── */}
        <div
          style={{
            marginTop: "40px",
            animation:
              "slideUp 500ms cubic-bezier(0.16, 1, 0.3, 1) backwards 300ms",
          }}
        >
          <button
            onClick={handleSubmit}
            disabled={!selectedMood || submitted}
            className="cursor-pointer"
            style={{
              width: "191px",
              height: "30px",
              borderRadius: "20px",
              border: "none",
              backgroundColor: submitted
                ? "var(--color-accent-yellow)"
                : "var(--color-text-primary)",
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontWeight: 700,
              fontStyle: "italic",
              color: submitted ? "var(--color-bg-primary)" : "#090b3b",
              letterSpacing: "0.64px",
              opacity: !selectedMood && !submitted ? 0.4 : 1,
              transition: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onPointerDown={(e) => {
              if (selectedMood)
                e.currentTarget.style.transform = "scale(0.95)";
            }}
            onPointerUp={(e) => {
              e.currentTarget.style.transform = "";
            }}
            onPointerLeave={(e) => {
              e.currentTarget.style.transform = "";
            }}
          >
            {submitted ? "Submitted!" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
