import { useState } from "react";
import { cn } from "@/lib/utils";
import { brandInitials, brandLogoFor } from "@/lib/brand-logos";

type Props = {
  name: string;
  /** product slug — used to look up the verified logo URL */
  slug: string;
  /** explicit logo URL override (admin-managed products) */
  logoUrl?: string | null | undefined;
  /** rendered logo size in px */
  size?: number;
  className?: string;
};

export function BrandLogo({ name, slug, logoUrl, size = 32, className }: Props) {
  const [failed, setFailed] = useState(false);
  const src = logoUrl || brandLogoFor(slug);
  const box = Math.round(size * 1.4);

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-secondary/70 shadow-sm",
        className,
      )}
      style={{ width: box, height: box }}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={`${name} logo`}
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
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
