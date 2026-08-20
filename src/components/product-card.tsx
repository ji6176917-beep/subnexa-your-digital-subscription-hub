import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/brand-logo";
import { availablePlans, formatUSD, startingPrice, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const from = startingPrice(product);
  const plans = availablePlans(product);

  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group relative flex flex-col rounded-xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-elevated"
    >
      <div className="flex items-start gap-3">
        <BrandLogo name={product.name} size={26} />
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{product.name}</h3>
          <p className="truncate text-xs text-muted-foreground">{product.category}</p>
        </div>
        <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {plans.slice(0, 3).map((p) => (
          <Badge key={p.key} variant="secondary" className="text-[11px] font-medium">
            {p.label}
          </Badge>
        ))}
        {plans.length > 3 && (
          <Badge variant="secondary" className="text-[11px]">
            +{plans.length - 3}
          </Badge>
        )}
      </div>

      <div className="mt-5 flex items-end justify-between border-t border-border/60 pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">From</p>
          <p className="text-xl font-bold">{from != null ? formatUSD(from) : "Custom"}</p>
        </div>
        <span className="text-xs font-medium text-primary">View plans</span>
      </div>
    </Link>
  );
}
