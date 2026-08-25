import { useState } from "react";
import { cn } from "@/lib/utils";

export type PaymentBrand = "binance" | "usdt" | "epay" | "bkash" | "nagad";

type BrandDef = {
  label: string;
  src: string;
  color: string;
  initials: string;
};

const brands: Record<PaymentBrand, BrandDef> = {
  binance: {
    label: "Binance Pay",
    src: "https://cdn.simpleicons.org/binance/F0B90B",
    color: "#F0B90B",
    initials: "B",
  },
  usdt: {
    label: "Tether USDT",
    src: "https://cdn.simpleicons.org/tether/50AF95",
    color: "#50AF95",
    initials: "₮",
  },
  epay: {
    label: "ePay",
    src: "https://www.google.com/s2/favicons?domain=epay.com&sz=128",
    color: "#0F6FDE",
    initials: "e",
  },
  bkash: {
    label: "bKash",
    src: "https://www.google.com/s2/favicons?domain=bkash.com&sz=128",
    color: "#E2136E",
    initials: "b",
  },
  nagad: {
    label: "Nagad",
    src: "https://www.google.com/s2/favicons?domain=nagad.com.bd&sz=128",
    color: "#EE7623",
    initials: "N",
  },
};

export function PaymentLogo({
  brand,
  size = 22,
  className,
}: {
  brand: PaymentBrand;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const def = brands[brand];
  const box = Math.round(size * 1.5);

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background shadow-sm",
        className,
      )}
      style={{ width: box, height: box }}
      title={def.label}
    >
      {failed ? (
        <span
          className="flex size-full items-center justify-center rounded-lg font-bold text-white"
          style={{ background: def.color, fontSize: Math.round(size * 0.55) }}
        >
          {def.initials}
        </span>
      ) : (
        <img
          src={def.src}
          alt={`${def.label} logo`}
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          style={{ width: size, height: size }}
          className="object-contain"
        />
      )}
    </span>
  );
}

export function BdtPairLogo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center -space-x-2", className)}>
      <PaymentLogo brand="bkash" size={18} />
      <PaymentLogo brand="nagad" size={18} />
    </span>
  );
}
