import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Clock, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import {
  availablePlans,
  formatUSD,
  getProduct,
  relatedProducts,
  type Product,
} from "@/lib/catalog";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product not found — SubNexa" }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.product;
    const title = `${p.name} Premium Subscription — SubNexa`;
    const description = `Buy ${p.name} (${p.category}) at wholesale pricing on SubNexa. Verified account, instant delivery and full-term warranty.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: ProductNotFound,
});

function ProductNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Subscription not found</h1>
      <p className="mt-3 text-muted-foreground">
        This product may have been renamed or removed from the catalog.
      </p>
      <Button asChild className="mt-6">
        <Link to="/browse">Back to marketplace</Link>
      </Button>
    </div>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const plans = availablePlans(product);
  const [selected, setSelected] = useState(plans[0]?.key ?? null);
  const active = plans.find((p) => p.key === selected);
  const related = relatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        to="/browse"
        search={{ category: product.categorySlug, q: "" }}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to {product.category}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex items-start gap-4">
            <span className="bg-gradient-primary flex size-16 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-primary-foreground">
              {product.name.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <Badge variant="secondary">{product.category}</Badge>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{product.name}</h1>
            </div>
          </div>

          <p className="mt-6 text-muted-foreground">
            Genuine {product.name} premium access sourced directly and delivered to you after
            checkout. Choose the term that fits your workflow — longer plans carry the lowest
            effective monthly cost.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Clock, title: "Instant delivery", text: "Activated within minutes" },
              { icon: ShieldCheck, title: "Full warranty", text: "Replacement for the full term" },
              { icon: BadgeCheck, title: "Verified source", text: "Checked before dispatch" },
            ].map((f) => (
              <div key={f.title} className="rounded-lg border border-border/70 bg-card p-4">
                <f.icon className="size-4 text-primary" />
                <p className="mt-3 text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>

          {product.customOptions && (
            <div className="mt-8 rounded-xl border border-border/70 bg-surface/50 p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Sparkles className="size-4 text-primary" /> Custom options
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {product.customOptions.split("|").map((option) => (
                  <li key={option} className="rounded-md bg-card px-3 py-2">
                    {option.trim()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 rounded-xl border border-border/70 bg-card p-6">
            <h2 className="text-base font-semibold">All plans</h2>
            <div className="mt-4 divide-y divide-border/60">
              {plans.map((p) => (
                <div key={p.key} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-muted-foreground">{p.label}</span>
                  <span className="font-semibold">{formatUSD(p.price)}</span>
                </div>
              ))}
              {plans.length === 0 && (
                <p className="py-3 text-sm text-muted-foreground">
                  Pricing for this product is quoted on request via support.
                </p>
              )}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-elevated">
            <p className="text-sm text-muted-foreground">Select a plan</p>
            <div className="mt-4 space-y-2">
              {plans.map((p) => {
                const isActive = p.key === selected;
                return (
                  <button
                    key={p.key}
                    onClick={() => setSelected(p.key)}
                    className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                      isActive
                        ? "border-primary bg-primary/10"
                        : "border-border/70 hover:border-primary/40"
                    }`}
                  >
                    <span className="text-sm font-medium">{p.label}</span>
                    <span className="text-sm font-bold">{formatUSD(p.price)}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-end justify-between border-t border-border/60 pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-2xl font-bold">
                {active ? formatUSD(active.price) : "On request"}
              </span>
            </div>

            <Button
              className="mt-5 w-full"
              size="lg"
              onClick={() =>
                toast.success("Order started", {
                  description: active
                    ? `${product.name} · ${active.label} · ${formatUSD(active.price)}. Checkout goes live with the payment integration.`
                    : `Our team will quote ${product.name} for you.`,
                })
              }
            >
              Buy now
            </Button>
            <Button asChild variant="outline" className="mt-3 w-full">
              <a href="https://t.me/subnexa" target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" /> Ask on Telegram
              </a>
            </Button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Secure checkout · Instant delivery · Warranty included
            </p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold">More in {product.category}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
