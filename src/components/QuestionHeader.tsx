import { useRef, useState, useLayoutEffect } from "react";

interface QuestionHeaderProps {
  questionNumber: string;
  questionText: string;
  subtitle?: string;
  category: string;
}

const BASE_FONT_SIZE = 17;
const MIN_FONT_SIZE = 12;
const MAX_LINES = 2;

export function QuestionHeader({
  questionNumber,
  questionText,
  subtitle,
  category,
}: QuestionHeaderProps) {
  const textRef = useRef<HTMLHeadingElement>(null);
  const [fontSize, setFontSize] = useState(BASE_FONT_SIZE);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    let size = BASE_FONT_SIZE;
    el.style.fontSize = `${size}px`;

    while (size > MIN_FONT_SIZE) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      if (el.scrollHeight <= lineHeight * MAX_LINES + 1) break;
      size -= 1;
      el.style.fontSize = `${size}px`;
    }

    setFontSize(size);
  }, [questionText]);

  return (
    <div className="flex flex-col">
      <h1
        className="text-(--color-text-primary) text-3xl font-bold"
        style={{
          fontFamily: "var(--font-heading)",
          letterSpacing: "1.2px",
        }}
      >
        {questionNumber}
      </h1>
      <div style={{ minHeight: "2.4em" }}>
        <h2
          ref={textRef}
          className="text-(--color-text-primary) font-semibold"
          style={{
            fontFamily: "var(--font-heading)",
            letterSpacing: "0.68px",
            fontSize: `${fontSize}px`,
            maxWidth: "318px",
          }}
        >
          {questionText}
        </h2>
        {subtitle && (
          <p
            className="text-(--color-text-primary) font-semibold italic"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "17px",
              letterSpacing: "0.68px",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      <div className="inline-flex mt-6">
        <span
          className="px-3 py-1 rounded-full text-xs"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "12px",
            backgroundColor: "var(--color-text-primary)",
            color: "var(--color-bg-primary)",
          }}
        >
          {category}
        </span>
      </div>
    </div>
  );
}
