import { useState, type CSSProperties } from "react";

interface ShimmerImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  onLoad?: () => void;
}

export function ShimmerImage({
  src,
  alt,
  className = "",
  style,
  onLoad,
}: ShimmerImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div
          className={className}
          style={{
            ...style,
            position: "relative",
            overflow: "hidden",
            backgroundColor: "var(--color-card-bg)",
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
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          ...style,
          opacity: loaded ? 1 : 0,
          transition: "opacity 300ms ease-out",
        }}
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
      />
    </>
  );
}
