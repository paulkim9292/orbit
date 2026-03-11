import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { OptionButton } from "@/components/OptionButton";
import { GridButton } from "@/components/GridButton";
import { DatePickerSheet } from "@/components/DatePickerSheet";
import { TimePickerSheet } from "@/components/TimePickerSheet";

export const Route = createFileRoute("/create-event")({
  component: CreateEventPage,
});

/* ─── Data ─── */

interface SubcategorySection {
  title: string;
  items: string[];
}

const categories = [
  "Physical Activities",
  "Intellectual & Cultural Activities",
  "Creative & Skill-based Activities",
  "Social & Purpose-driven Activities",
  "Others",
];

const subcategories: Record<string, SubcategorySection[]> = {
  "Physical Activities": [
    {
      title: "Light/Recovery Activities",
      items: [
        "Walking/\nCasual Walk Groups",
        "Yoga/Pilates/\nStretching",
        "Light Cycling/\nMobility Sessions",
        "Meditation/\nMindful Movements",
      ],
    },
    {
      title: "Team Sports",
      items: [
        "Soccer/Futsal",
        "Basketball/Volleyball",
        "Baseball/Softball",
        "Recreational Team Games",
      ],
    },
    {
      title: "Racket-based & Individual Sports",
      items: [
        "Tennis/Badminton",
        "Table Tennis/Squash",
        "Jogging & Short-Distance Running Crew",
        "Indoor Climbing/\nBouldering",
      ],
    },
    {
      title: "Endurance/Adventure Sports",
      items: [
        "Hiking/Long-distance Trekking",
        "Surfing & Water Sports",
        "Marathon/\nEndurance Training",
        "Competitive Leagues & Tournaments",
      ],
    },
  ],
  "Intellectual & Cultural Activities": [
    {
      title: "Learning & Discussion",
      items: [
        "Book Clubs & Reading Circles",
        "Exam & Certification Study Groups",
        "Language Exchange & Practice Groups",
        "Humanities/Society & Current Affairs Dialogue",
      ],
    },
    {
      title: "Arts & Cultural Discovery",
      items: [
        "Movie & Performance Watching",
        "Exhibition & Museum Visits",
        "Concerts & Music Appreciation Sessions",
        "Architecture & Historical Exploration",
      ],
    },
  ],
  "Creative & Skill-based Activities": [
    {
      title: "Technology & Development",
      items: [
        "Coding & Development Projects",
        "Data Analysis & AI Study Groups",
        "Website / App Building Meetups",
        "Tech Collaboration & Hack Sessions",
      ],
    },
    {
      title: "Creative Arts & DIY",
      items: [
        "Drawing & Photography",
        "Cooking & Baking",
        "Craft & DIY\n(Pottery, Woodwork etc)",
        "Musical Instrument Practices & Composition",
      ],
    },
  ],
  "Social & Purpose-driven Activities": [
    {
      title: "Social Networking",
      items: [
        "Café & Casual Hangouts",
        "Board Games & Card Games",
        "Dining & Drinks Gatherings",
        "City Walks & Local Exploration",
      ],
    },
    {
      title: "Volunteering & Social Contribution",
      items: [
        "Environmental Clean-up & Plogging",
        "Community Service & Elderly Support",
        "Mentorship & Talent-sharing Volunteering",
        "Social Impact Projects & Campaigns",
      ],
    },
    {
      title: "e-Sports & Gaming",
      items: [
        "Online Multiplayer Games",
        "Offline PC Café / Arcade Meetups",
        "Casual Team-based Gaming Sessions",
        "Competitive Gaming & Tournaments",
      ],
    },
  ],
};

/* ─── Page ─── */

function CreateEventPage() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const navigate = useNavigate();

  /* Step 2 form state */
  const [title, setTitle] = useState("");
  const [gender, setGender] = useState<"anyone" | "girls" | "boys">("anyone");
  const [ageMode, setAgeMode] = useState<"anyone" | "range">("anyone");
  const [ageFrom, setAgeFrom] = useState("18");
  const [ageTo, setAgeTo] = useState("65");
  const [eventDate, setEventDate] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [location, setLocation] = useState("");
  const [maxPeople, setMaxPeople] = useState("2");
  const [description, setDescription] = useState("");

  /* Picker sheet visibility */
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState<"from" | "to" | null>(null);

  /* Find section title for selected subcategory */
  const selectedSectionTitle = (() => {
    if (!selectedCategory || !selectedSubcategory) return null;
    const sections = subcategories[selectedCategory];
    if (!sections) return null;
    for (const section of sections) {
      if (section.items.includes(selectedSubcategory)) return section.title;
    }
    return null;
  })();

  /* ─── Handlers ─── */

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    if (category === "Others") {
      setSelectedSubcategory("Others");
      setTimeout(() => setStep(2), 300);
    } else {
      setTimeout(() => setStep(1), 300);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      if (selectedCategory === "Others") {
        setStep(0);
        setSelectedSubcategory(null);
      } else {
        setStep(1);
      }
    } else if (step === 1) {
      setStep(0);
      setSelectedSubcategory(null);
    } else {
      navigate({ to: "/home" });
    }
  };

  const handleNext = () => {
    if (step === 1 && selectedSubcategory) {
      setStep(2);
    }
  };

  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const { createEvent } = await import("@/lib/events");
      await createEvent({
        title,
        category: selectedCategory ?? "",
        subcategory: selectedSubcategory ?? "",
        gender,
        ageFrom: ageMode === "range" ? parseInt(ageFrom) || null : null,
        ageTo: ageMode === "range" ? parseInt(ageTo) || null : null,
        eventDate: `${eventDate || new Date().toISOString().slice(0, 10)}T${timeFrom || "00:00"}:00`,
        timeFrom,
        timeTo,
        location,
        maxPeople: parseInt(maxPeople) || 2,
        description,
      });
      navigate({ to: "/home" });
    } catch (err) {
      console.error("Failed to create event:", err);
      alert("Failed to publish event. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  /* ─── Style helpers ─── */

  const chipStyle = (active: boolean): React.CSSProperties => ({
    height: "21px",
    borderRadius: "20px",
    border: "1px solid var(--color-text-primary)",
    backgroundColor: active ? "var(--color-text-primary)" : "transparent",
    color: active ? "var(--color-bg-primary)" : "var(--color-text-primary)",
    fontFamily: "var(--font-heading)",
    fontSize: "12px",
    padding: "0 12px",
    whiteSpace: "nowrap",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 200ms ease",
  });

  const fieldLabel: React.CSSProperties = {
    fontFamily: "var(--font-heading)",
    fontSize: "12px",
    fontStyle: "italic",
    color: "var(--color-text-primary)",
    letterSpacing: "0.48px",
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: "var(--font-heading)",
    fontSize: "16px",
    fontStyle: "italic",
    color: "var(--color-text-primary)",
    letterSpacing: "0.64px",
  };

  const pillInput: React.CSSProperties = {
    width: "100%",
    height: "36px",
    borderRadius: "100px",
    border: "1px solid var(--color-text-primary)",
    backgroundColor: "transparent",
    color: "var(--color-text-primary)",
    fontFamily: "var(--font-settings)",
    fontSize: "12px",
    fontStyle: "italic",
    fontWeight: 500,
    padding: "0 16px",
    outline: "none",
  };

  const numberPill = (active: boolean): React.CSSProperties => ({
    width: "32px",
    height: "21px",
    borderRadius: "20px",
    border: "1px solid var(--color-text-primary)",
    backgroundColor: active ? "var(--color-text-primary)" : "transparent",
    color: active ? "var(--color-bg-primary)" : "var(--color-text-primary)",
    fontFamily: "var(--font-heading)",
    fontSize: "12px",
    textAlign: "center",
    outline: "none",
    padding: 0,
  });

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient Background Header — steps 0 and 2 */}
      {step !== 1 && (
        <div className="absolute top-0 left-0 w-full" style={{ height: "290px" }}>
          <img src="/gradient-background.svg" alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Blue Ellipse Background — steps 0 and 2 */}
      {step !== 1 && (
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
      )}

      {/* Content */}
      <div
        className="relative z-10 flex flex-col pb-8"
        style={{
          minHeight: "100vh",
          paddingLeft: step === 2 ? "24px" : "42px",
          paddingRight: step === 2 ? "24px" : "42px",
        }}
      >
        {step === 0 ? (
          /* ─── Step 0: Category Selection ─── */
          <>
            {/* Planet Illustration */}
            <div className="flex justify-center animate-stagger-1" style={{ marginTop: "58px" }}>
              <img
                src="/planet-heart.svg"
                alt="Planet with heart"
                style={{ width: "150px", height: "88px" }}
              />
            </div>

            {/* Heading */}
            <h1
              className="text-center animate-stagger-2"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "30px",
                fontStyle: "italic",
                color: "var(--color-text-primary)",
                marginTop: "46px",
                letterSpacing: "1.2px",
              }}
            >
              What activity do you want to host?
            </h1>

            {/* Main Categories Badge */}
            <div className="animate-stagger-3" style={{ marginTop: "24px" }}>
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-heading)",
                  fontSize: "12px",
                  backgroundColor: "var(--color-text-primary)",
                  color: "var(--color-bg-primary)",
                  borderRadius: "20px",
                  padding: "3px 14px",
                }}
              >
                Main Categories
              </span>
            </div>

            {/* Category Options */}
            <div className="flex flex-col animate-stagger-4" style={{ gap: "9px", marginTop: "16px" }}>
              {categories.map((category) => (
                <OptionButton
                  key={category}
                  label={category}
                  selected={selectedCategory === category}
                  onClick={() => handleCategorySelect(category)}
                />
              ))}
            </div>
          </>
        ) : step === 1 ? (
          /* ─── Step 1: Subcategory Selection ─── */
          <div key={selectedCategory} className="animate-slideLeft">
            {/* Category Badge */}
            <div style={{ marginTop: "61px" }}>
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-heading)",
                  fontSize: "12px",
                  backgroundColor: "var(--color-text-primary)",
                  color: "var(--color-bg-primary)",
                  borderRadius: "20px",
                  padding: "3px 14px",
                }}
              >
                {selectedCategory}
              </span>
            </div>

            {/* Sections */}
            {selectedCategory &&
              subcategories[selectedCategory]?.map((section) => (
                <div key={section.title} style={{ marginTop: "12px" }}>
                  {/* Section Header */}
                  <p
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "16px",
                      fontStyle: "italic",
                      color: "var(--color-text-primary)",
                      letterSpacing: "0.64px",
                      marginBottom: "12px",
                    }}
                  >
                    {section.title}
                  </p>

                  {/* 2-column grid of subcategory buttons */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    {section.items.map((item) => (
                      <GridButton
                        key={item}
                        label={item}
                        fontSize={12}
                        selected={selectedSubcategory === item}
                        onClick={() => {
                          setSelectedSubcategory(item);
                          setTimeout(() => setStep(2), 300);
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          /* ─── Step 2: Event Details Form ─── */
          <div className="animate-slideLeft">
            {/* Back arrow */}
            <button
              onClick={handleBack}
              className="cursor-pointer"
              style={{ marginTop: "20px", background: "none", border: "none", padding: 0 }}
              aria-label="Back to subcategories"
            >
              <img src="/icons/arrow-left.svg" alt="" style={{ width: "24px", height: "24px" }} />
            </button>

            {/* Planet Illustration */}
            <div className="flex justify-center" style={{ marginTop: "12px" }}>
              <img src="/planet-heart.svg" alt="" style={{ width: "150px", height: "88px" }} />
            </div>

            {/* Heading */}
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "30px",
                fontWeight: 700,
                color: "var(--color-text-primary)",
                textAlign: "center",
                marginTop: "24px",
                letterSpacing: "1.2px",
              }}
            >
              I want to host:
            </h1>

            {/* Selected category & section chips */}
            <div className="flex flex-wrap" style={{ gap: "7px", marginTop: "12px" }}>
              <span style={{ ...chipStyle(true), cursor: "default" }}>
                {selectedCategory}
              </span>
              {selectedSectionTitle && (
                <span style={{ ...chipStyle(true), cursor: "default" }}>
                  {selectedSectionTitle}
                </span>
              )}
            </div>

            {/* Title input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title of the event"
              style={{ ...pillInput, marginTop: "16px" }}
            />

            {/* ── Who can attend? ── */}
            <div style={{ marginTop: "17px" }}>
              <p style={sectionTitleStyle}>Who can attend?</p>

              {/* Gender */}
              <div className="flex items-center" style={{ gap: "6px", marginTop: "13px" }}>
                <span style={{ ...fieldLabel, minWidth: "48px" }}>Gender:</span>
                <button onClick={() => setGender("anyone")} className="cursor-pointer" style={chipStyle(gender === "anyone")}>Anyone!</button>
                <button onClick={() => setGender("girls")} className="cursor-pointer" style={chipStyle(gender === "girls")}>Girls Only</button>
                <button onClick={() => setGender("boys")} className="cursor-pointer" style={chipStyle(gender === "boys")}>Boys Only</button>
              </div>

              {/* Age */}
              <div className="flex items-center" style={{ gap: "6px", marginTop: "8px" }}>
                <span style={{ ...fieldLabel, minWidth: "48px" }}>Age:</span>
                <button
                  onClick={() => setAgeMode("anyone")}
                  className="cursor-pointer"
                  style={chipStyle(ageMode === "anyone")}
                >
                  Anyone!
                </button>
                <span style={fieldLabel}>From:</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={ageFrom}
                  onChange={(e) => {
                    setAgeFrom(e.target.value.replace(/\D/g, ""));
                    setAgeMode("range");
                  }}
                  onFocus={() => setAgeMode("range")}
                  style={numberPill(ageMode === "range")}
                />
                <span style={fieldLabel}>To:</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={ageTo}
                  onChange={(e) => {
                    setAgeTo(e.target.value.replace(/\D/g, ""));
                    setAgeMode("range");
                  }}
                  onFocus={() => setAgeMode("range")}
                  style={numberPill(ageMode === "range")}
                />
              </div>
            </div>

            {/* ── When is the event hosted? ── */}
            <div style={{ marginTop: "17px" }}>
              <p style={sectionTitleStyle}>When is the event hosted?</p>

              {/* Date */}
              <div className="flex items-center" style={{ gap: "6px", marginTop: "13px" }}>
                <span style={{ ...fieldLabel, minWidth: "48px" }}>Dates:</span>
                <button
                  onClick={() => setShowDatePicker(true)}
                  className="cursor-pointer"
                  style={chipStyle(!!eventDate)}
                >
                  {eventDate ? eventDate.replace(/-/g, "/") : "Select date"}
                </button>
              </div>

              {/* Time */}
              <div className="flex items-center" style={{ gap: "6px", marginTop: "8px" }}>
                <span style={{ ...fieldLabel, minWidth: "48px" }}>Time:</span>
                <span style={fieldLabel}>From:</span>
                <button
                  onClick={() => setShowTimePicker("from")}
                  className="cursor-pointer"
                  style={chipStyle(!!timeFrom)}
                >
                  {timeFrom || "00:00"}
                </button>
                <span style={fieldLabel}>To:</span>
                <button
                  onClick={() => setShowTimePicker("to")}
                  className="cursor-pointer"
                  style={chipStyle(!!timeTo)}
                >
                  {timeTo || "00:00"}
                </button>
              </div>
            </div>

            {/* ── Where is the event hosted? ── */}
            <div style={{ marginTop: "17px" }}>
              <p style={sectionTitleStyle}>Where is the event hosted?</p>
              <div className="flex items-center" style={{ gap: "6px", marginTop: "10px" }}>
                <MapPin size={18} color="var(--color-text-primary)" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Look for location"
                  style={{
                    height: "21px",
                    borderRadius: "20px",
                    border: "1px solid var(--color-text-primary)",
                    backgroundColor: "transparent",
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-heading)",
                    fontSize: "12px",
                    padding: "0 16px",
                    outline: "none",
                    minWidth: "113px",
                  }}
                />
              </div>
            </div>

            {/* ── How many people can join? ── */}
            <div style={{ marginTop: "17px" }}>
              <p style={sectionTitleStyle}>How many people can join?</p>
              <div className="flex items-center" style={{ gap: "8px", marginTop: "13px" }}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={maxPeople}
                  onChange={(e) => setMaxPeople(e.target.value.replace(/\D/g, ""))}
                  style={numberPill(true)}
                />
                <span
                  style={{
                    fontFamily: "var(--font-settings)",
                    fontSize: "9px",
                    fontStyle: "italic",
                    fontWeight: 500,
                    color: "var(--color-text-primary)",
                  }}
                >
                  Total members: {(parseInt(maxPeople) || 0) + 1} people including you
                </span>
              </div>
            </div>

            {/* Description input */}
            <input
              type="text"
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 1000) setDescription(e.target.value);
              }}
              placeholder="Brief description of the event"
              style={{ ...pillInput, marginTop: "24px" }}
            />

            {/* Character count */}
            <p
              style={{
                fontFamily: "var(--font-settings)",
                fontSize: "9px",
                fontStyle: "italic",
                fontWeight: 500,
                color: "var(--color-text-primary)",
                textAlign: "right",
                marginTop: "4px",
              }}
            >
              {description.length}/1000 letters
            </p>

            {/* Publish Event button */}
            <div className="flex justify-center" style={{ marginTop: "16px", marginBottom: "24px" }}>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="cursor-pointer"
                style={{
                  width: "109px",
                  height: "30px",
                  borderRadius: "100px",
                  backgroundColor: "var(--color-text-primary)",
                  color: "var(--color-bg-primary)",
                  fontFamily: "var(--font-settings)",
                  fontSize: "12px",
                  fontStyle: "italic",
                  fontWeight: 500,
                  border: "none",
                  opacity: publishing ? 0.6 : 1,
                  transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onPointerDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.95)";
                }}
                onPointerUp={(e) => {
                  e.currentTarget.style.transform = "";
                }}
                onPointerLeave={(e) => {
                  e.currentTarget.style.transform = "";
                }}
              >
                {publishing ? "Publishing..." : "Publish Event"}
              </button>
            </div>
          </div>
        )}

        {/* Spacer — push nav to bottom (steps 0 & 1 only) */}
        {step !== 2 && <div style={{ flexGrow: 1 }} />}

        {/* Navigation Arrows (steps 0 & 1 only) */}
        {step !== 2 && (
          <div
            className="flex items-center"
            style={{
              justifyContent: "space-between",
              width: "214px",
              marginLeft: "auto",
              marginRight: "auto",
              paddingBottom: "16px",
            }}
          >
            <button
              onClick={handleBack}
              className="rounded-full flex items-center justify-center"
              style={{
                width: "30px",
                height: "30px",
                borderColor: "var(--color-text-primary)",
                backgroundColor: "transparent",
              }}
              aria-label={step === 0 ? "Back to home" : "Back to categories"}
            >
              <img src="/icons/arrow-left.svg" alt="" style={{ width: "30px", height: "30px" }} />
            </button>
            <button
              onClick={handleNext}
              className="rounded-full flex items-center justify-center"
              style={{
                width: "30px",
                height: "30px",
                backgroundColor:
                  step === 1 && selectedSubcategory
                    ? "var(--color-text-primary)"
                    : "rgba(174, 177, 231, 0.3)",
                transition: "background-color 200ms ease",
              }}
              aria-label="Next"
            >
              <img src="/icons/arrow-right.svg" alt="" style={{ width: "30px", height: "30px" }} />
            </button>
          </div>
        )}
      </div>

      {/* ── Picker sheets ── */}
      <DatePickerSheet
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={eventDate}
        onSelect={setEventDate}
      />
      <TimePickerSheet
        isOpen={showTimePicker !== null}
        onClose={() => setShowTimePicker(null)}
        selectedTime={showTimePicker === "to" ? timeTo : timeFrom}
        onSelect={(t) => {
          if (showTimePicker === "to") setTimeTo(t);
          else setTimeFrom(t);
        }}
      />
    </div>
  );
}
