import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionHeader } from "@/components/QuestionHeader";
import { OptionButton } from "@/components/OptionButton";
import { GridButton } from "@/components/GridButton";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

interface QuestionDef {
  number: string;
  text: string;
  subtitle?: string;
  category: string;
  progress: number;
  layout: "list" | "mbti" | "grid3";
  options: string[];
}

const questions: QuestionDef[] = [
  {
    number: "Q1.",
    text: "How old are you?",
    category: "Basic Information",
    progress: 5,
    layout: "list",
    options: ["Under 18", "Between 18-24", "Between 25-34", "35+"],
  },
  {
    number: "Q2.",
    text: "How far are you willing to travel?",
    category: "Basic Information",
    progress: 15,
    layout: "list",
    options: [
      "Walking distance only (<1km)",
      "Up to 3km (<3km)",
      "Up to 5km (<5km)",
      "More than 5km (>5km)",
    ],
  },
  {
    number: "Q3.",
    text: "What is you MBTI test?",
    category: "Basic Information",
    progress: 25,
    layout: "mbti",
    options: [
      "I don't know / prefer not to say",
      "ISTJ",
      "ISFJ",
      "INFJ",
      "INTJ",
      "ISTP",
      "ISFP",
      "INFP",
      "INTP",
      "ESTP",
      "ESFP",
      "ENFP",
      "ENTP",
      "ESTJ",
      "ESFJ",
      "ENFJ",
      "ENTJ",
    ],
  },
  {
    number: "Q4.",
    text: "How do you operate your social energy?",
    category: "Personal Energy",
    progress: 34,
    layout: "list",
    options: [
      "I recharge in my own personal quiet space",
      "I hang out with 1-3 group of people",
      "I adapt to the situation",
      "I frequently hang out with friends",
      "I love meeting new people",
    ],
  },
  {
    number: "Q5.",
    text: "How often do you participate in group activities (e.g. sports, volunteering, clubs)?",
    category: "Availability",
    progress: 44,
    layout: "list",
    options: ["Never", "Monthly", "Weekly", "Multiple times a week"],
  },
  {
    number: "Q6.",
    text: "I prefer texting over face-to-face conversations",
    category: "Availability",
    progress: 55,
    layout: "list",
    options: ["Never", "Sometimes", "Often times", "Multiple times a week"],
  },
  {
    number: "Q7.",
    text: "Through Orbit, I want to:",
    subtitle: "(select up to 3)",
    category: "Goals & Motivation",
    progress: 66,
    layout: "list",
    options: [
      "Make new friends",
      "Explore city and new places",
      "Stay entertained",
      "Find workout/study buddies",
      "Stay out of comfort zone",
    ],
  },
  {
    number: "Q8.",
    text: "Which area are you interested in?",
    category: "Vibe & Preferences",
    progress: 77,
    layout: "grid3",
    options: [
      "Light/Recovery Activities",
      "Team Sports",
      "Racket-based Sports",
      "Learning & Discussion",
      "Arts & Cultural Discoveries",
      "Endurance/ Adventure Sports",
      "Community & Volunteering",
      "Technology & Development",
      "e-Sports & Gaming",
      "Creative Arts & DIY Work",
      "Social Networking",
      "Others",
    ],
  },
  {
    number: "Q9.",
    text: "What kind of event vibe do you prefer?",
    subtitle: "(Select up to 3)",
    category: "Vibe & Preferences",
    progress: 88,
    layout: "list",
    options: [
      "Chill & Relaxed",
      "Active and Energetic",
      "Intellectual & Stimulating",
      "Creative & Expressive",
      "Adventurous & Challenging",
    ],
  },
  {
    number: "Q10.",
    text: "What are the one/two most important aspects when joining an event?",
    category: "Vibe & Preferences",
    progress: 98,
    layout: "list",
    options: ["Age range", "Interests/Hobbies", "Personality types", "Gender"],
  },
];

type SocialLevel = "cosmic-dust" | "comet" | "moon";

const SOCIAL_LEVEL_CONFIG: Record<
  SocialLevel,
  { label: string; image: string }
> = {
  "cosmic-dust": { label: "Cosmic Dust", image: "/images/cosmic-dust.png" },
  comet: { label: "Comet", image: "/images/comet.png" },
  moon: { label: "Moon", image: "/images/moon.png" },
};

// Based on SOCIAL_ENERGY_MAP from docs/onboarding-weight.md
const Q4_SCORE: Record<string, number> = {
  "I recharge in my own personal quiet space": 1,
  "I hang out with 1-3 group of people": 2,
  "I adapt to the situation": 3,
  "I frequently hang out with friends": 4,
  "I love meeting new people": 5,
};

const Q5_SCORE: Record<string, number> = {
  Never: 1,
  Monthly: 2.33,
  Weekly: 3.67,
  "Multiple times a week": 5,
};

// Inverted: preferring texting = less social
const Q6_SCORE: Record<string, number> = {
  Never: 5,
  Sometimes: 3.67,
  "Often times": 2.33,
  "Multiple times a week": 1,
};

function computeSocialLevel(answers: Record<number, string>): SocialLevel {
  const q4 = Q4_SCORE[answers[3]] ?? 3;
  const q5 = Q5_SCORE[answers[4]] ?? 3;
  const q6 = Q6_SCORE[answers[5]] ?? 3;
  const score = (q4 + q5 + q6) / 3;

  if (score < 2.34) return "cosmic-dust";
  if (score < 3.67) return "comet";
  return "moon";
}

function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  // Safety net: if currentStep goes out of bounds (e.g. HMR state), show result
  useEffect(() => {
    if (currentStep >= questions.length) {
      setShowResult(true);
    }
  }, [currentStep]);

  const clampedStep = Math.min(currentStep, questions.length - 1);
  const question = questions[clampedStep];

  const goNext = () => {
    if (currentStep === questions.length - 1) {
      setShowResult(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSelect = (option: string) => {
    const updated = { ...answers, [currentStep]: option };
    setAnswers(updated);
    setTimeout(() => {
      if (currentStep === questions.length - 1) {
        setShowResult(true);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }, 300);
  };

  const isSelected = (option: string) => answers[currentStep] === option;

  if (showResult) {
    const level = computeSocialLevel(answers);
    const { label, image } = SOCIAL_LEVEL_CONFIG[level];

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

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-[42px] pb-8" style={{ minHeight: "100vh" }}>
          {/* Planet Illustration */}
          <div className="flex justify-center" style={{ marginTop: "58px" }}>
            <img
              src="/planet-heart.svg"
              alt="Planet with heart"
              style={{ width: "150px", height: "88px" }}
            />
          </div>

          {/* Result Block */}
          <div className="flex flex-col items-center" style={{ marginTop: "100px" }}>
            {/* "You are all set!" Title */}
            <h1
              className="text-center animate-stagger-1"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "40px",
                fontWeight: 700,
                fontStyle: "italic",
                color: "var(--color-text-primary)",
              }}
            >
              You are all set!
            </h1>

            {/* Level Illustration */}
            <div className="flex justify-center animate-stagger-2" style={{ marginTop: "24px" }}>
              <img
                src={image}
                alt={label}
                style={{ width: "200px", height: "200px", objectFit: "contain" }}
              />
            </div>

            {/* Divider Line */}
            <div
              className="animate-stagger-3"
              style={{
                width: "241px",
                height: "1px",
                backgroundColor: "var(--color-text-primary)",
                marginTop: "8px",
              }}
            />

            {/* Level Name */}
            <p
              className="text-center animate-stagger-3"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "30px",
                fontStyle: "italic",
                color: "var(--color-text-primary)",
                marginTop: "6px",
              }}
            >
              {label}
            </p>

            {/* Get Started Button */}
            <button
              onClick={() => navigate({ to: "/home" })}
              className="animate-stagger-4 cursor-pointer"
              style={{
                width: "309px",
                height: "43px",
                borderRadius: "100px",
                border: "1px solid var(--color-text-primary)",
                backgroundColor: "transparent",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-heading)",
                fontSize: "16px",
                marginTop: "56px",
              }}
            >
              Get Started!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
    >
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

      {/* Content */}
      <div className="relative z-10 flex flex-col px-[42px] pb-8" style={{ minHeight: "100vh" }}>
        {/* Planet Illustration */}
        <div className="flex justify-center" style={{ marginTop: "58px" }}>
          <img
            src="/planet-heart.svg"
            alt="Planet with heart"
            style={{ width: "150px", height: "88px" }}
          />
        </div>

        {/* Welcome Text */}
        <h1
          className="text-center"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "30px",
            fontStyle: "italic",
            color: "var(--color-text-primary)",
            marginTop: "46px",
          }}
        >
          Welcome on-board!
        </h1>

        {/* Progress Bar */}
        <div style={{ marginTop: "26px" }}>
          <ProgressBar progress={question.progress} />
        </div>

        {/* Animated Question Content */}
        <div key={currentStep} className="animate-slideLeft">
          {/* Question Header */}
          <div style={{ marginTop: "16px" }}>
            <QuestionHeader
              questionNumber={question.number}
              questionText={question.text}
              subtitle={question.subtitle}
              category={question.category}
            />
          </div>

          {/* Options: List layout */}
          {question.layout === "list" && (
            <div className="flex flex-col" style={{ gap: "9px", marginTop: "12px" }}>
              {question.options.map((option) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={isSelected(option)}
                  onClick={() => handleSelect(option)}
                />
              ))}
            </div>
          )}

          {/* Options: MBTI layout */}
          {question.layout === "mbti" && (
            <div style={{ marginTop: "12px" }}>
              <OptionButton
                label={question.options[0]}
                selected={isSelected(question.options[0])}
                onClick={() => handleSelect(question.options[0])}
              />
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "repeat(4, 72px)",
                  gap: "9px",
                  marginTop: "9px",
                }}
              >
                {question.options.slice(1).map((option) => (
                  <GridButton
                    key={option}
                    label={option}
                    selected={isSelected(option)}
                    onClick={() => handleSelect(option)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Options: 3-column interest grid */}
          {question.layout === "grid3" && (
            <div
              className="grid"
              style={{
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "9px",
                marginTop: "12px",
              }}
            >
              {question.options.map((option) => (
                <GridButton
                  key={option}
                  label={option}
                  selected={isSelected(option)}
                  onClick={() => handleSelect(option)}
                  fontSize={12}
                />
              ))}
            </div>
          )}
        </div>

        {/* Navigation — pushed to bottom */}
        <div style={{ flexGrow: 1 }} />
        <div
          className="flex items-center"
          style={{
            justifyContent: currentStep === 0 ? "center" : "space-between",
            width: "214px",
            marginLeft: "auto",
            marginRight: "auto",
            paddingBottom: "16px",
          }}
        >
          {currentStep > 0 && (
            <button
              onClick={goBack}
              className="rounded-full flex items-center justify-center"
              style={{
                width: "30px",
                height: "30px",
                borderColor: "var(--color-text-primary)",
                backgroundColor: "transparent",
              }}
              aria-label="Previous"
            >
              <img src="/icons/arrow-left.svg" alt="" style={{ width: "30px", height: "30px" }} />
            </button>
          )}
          <button
            onClick={goNext}
            className="rounded-full flex items-center justify-center"
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "var(--color-text-primary)",
            }}
            aria-label="Next"
          >
            <img src="/icons/arrow-right.svg" alt="" style={{ width: "30px", height: "30px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
