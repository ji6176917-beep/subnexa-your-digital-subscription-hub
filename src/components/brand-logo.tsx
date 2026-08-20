import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { brandInitials, brandLogoCandidates } from "@/lib/brand-logos";

type Props = {
  name: string;
  /** rendered logo size in px */
  size?: number;
  className?: string;
};

export function BrandLogo({ name, size = 32, className }: Props) {
  const candidates = brandLogoCandidates(name);
  const [index, setIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const src = candidates[index];
  const box = Math.round(size * 1.4);

  const next = () => setIndex((i) => i + 1);

  // Errors that happen before hydration never reach React's onError, so
  // re-check the decoded image once mounted.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) next();
  }, [src]);

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-secondary/70 shadow-sm",
        className,
      )}
      style={{ width: box, height: box }}
    >
      {src ? (
        <img
          key={src}
          ref={imgRef}
          src={src}
          alt={`${name} logo`}
          width={size}
          height={size}
          decoding="async"
          onError={next}
          style={{ width: size, height: size }}
          className="object-contain"
        />
      ) : (
        <span
          className="bg-gradient-primary flex size-full items-center justify-center font-bold text-primary-foreground"
          style={{ fontSize: Math.round(size * 0.44) }}
        >
          {brandInitials(name)}
        </span>
      )}
    </span>
  );
}
