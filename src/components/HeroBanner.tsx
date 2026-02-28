import { ShimmerImage } from "./ShimmerImage";

export function HeroBanner() {
  return (
    <div
      className="mx-auto"
      style={{
        width: "320px",
        height: "150px",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <ShimmerImage
        src="/images/home-ad.svg"
        alt="Promotion"
        className="w-full h-full"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
