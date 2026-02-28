import { useRef, useState, useEffect, type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

export function FadeIn({ children, className, style, delay = 0 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${visible ? "animate-scroll-fade-up" : ""} ${className ?? ""}`}
      style={{
        ...style,
        opacity: visible ? undefined : 0,
        animationDelay: delay ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
}
