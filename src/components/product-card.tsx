import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/brand-logo";
import { availablePlans, formatUSD, startingPrice } from "@/lib/catalog";
import type { EditableProduct } from "@/lib/catalog-store";

export function ProductCard({ product }: { product: EditableProduct }) {
  const from = startingPrice(product);
  const plans = availablePlans(product);

  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group relative flex min-w-0 flex-col rounded-xl border border-border/70 bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-elevated sm:p-5"
    >
       <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2 sm:gap-3">
        <BrandLogo name={product.name} slug={product.slug} logoUrl={product.logoUrl} size={26} />
        <div className="min-w-0">
           <h3 className="truncate text-sm font-semibold sm:text-base">{product.name}</h3>
          <p className="truncate text-xs text-muted-foreground">{product.category}</p>
        </div>
        <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

       <div className="mt-3 flex min-h-6 flex-wrap gap-1 sm:mt-4 sm:min-h-0 sm:gap-1.5">
         {plans.slice(0, 2).map((p) => (
          <Badge key={p.key} variant="secondary" className="text-[11px] font-medium">
            {p.label}
          </Badge>
        ))}
         {plans.length > 2 && (
          <Badge variant="secondary" className="text-[11px]">
             +{plans.length - 2}
          </Badge>
        )}
      </div>

       <div className="mt-auto flex items-end justify-between gap-2 border-t border-border/60 pt-3 sm:pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">From</p>
           <p className="text-base font-bold sm:text-xl">{from != null ? formatUSD(from) : "Custom"}</p>
        </div>
         <span className="hidden text-xs font-medium text-primary sm:inline">View plans</span>
      </div>
    </Link>
  );
}
