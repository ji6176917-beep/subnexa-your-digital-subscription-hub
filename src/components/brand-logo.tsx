import { useState } from "react";
import { cn } from "@/lib/utils";
import { brandFallbackLogoUrl, brandInitials, brandLogoUrl } from "@/lib/brand-logos";

type Props = {
  name: string;
  /** rendered logo size in px */
  size?: number;
  className?: string;
};

export function BrandLogo({ name, size = 32, className }: Props) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const failed = stage === 2;
  const box = Math.round(size * 1.4);

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-secondary/70 shadow-sm",
        className,
      )}
      style={{ width: box, height: box }}
    >
      {failed ? (
        <span
          className="bg-gradient-primary flex size-full items-center justify-center font-bold text-primary-foreground"
          style={{ fontSize: Math.round(size * 0.44) }}
        >
          {brandInitials(name)}
        </span>
      ) : (
        <img
          key={stage}
          src={stage === 0 ? brandLogoUrl(name) : brandFallbackLogoUrl(name)}
          alt={`${name} logo`}
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          onError={() => setStage((s) => (s === 0 ? 1 : 2))}
          style={{ width: size, height: size }}
          className="object-contain dark:brightness-125"
        />
      )}
    </span>
  );
}
