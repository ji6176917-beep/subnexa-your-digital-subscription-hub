import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  Bot,
  Globe2,
  Headphones,
  Lock,
  Rocket,
  Search,
  ShieldCheck,
  Star,
  Timer,
  Wallet,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { useCatalog } from "@/lib/catalog-store";
import { CategoryIconTile } from "@/lib/category-icons";

const title = "SubNexa — Premium Subscription Marketplace";
const description =
  "Buy verified premium subscriptions for AI tools, editing apps, music, education, VPN and productivity software at wholesale prices with instant delivery.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const featuredSlugs = [
    "chatgpt-plus-5-6",
    "claude-plus-4-1",
    "perplexity-pro",
    "grok",
    "microsoft-copilot-pro",
    "deepseek",
    "poe-pro",
    "gemini-pro",
];

const trustItems = [
  { icon: Timer, title: "Instant delivery", text: "Most orders are activated within minutes of payment confirmation." },
  { icon: ShieldCheck, title: "Warranty on every order", text: "Full-term replacement warranty covering the plan you purchased." },
  { icon: Wallet, title: "Wholesale pricing", text: "Direct sourcing keeps prices far below standard retail subscriptions." },
  { icon: Headphones, title: "24/7 human support", text: "Real agents on Telegram and email, every day of the year." },
];

export default function Index() {
  const { products, categories } = useCatalog();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const totalProducts = products.length;
  const featured = products.filter((p) => featuredSlugs.includes(p.slug)).slice(0, 8);
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    navigate({ to: "/browse", search: { q: query.trim(), category: "all" } });
  };
  return (
    <div className="min-w-0 overflow-x-hidden">
      <section className="bg-hero-glow relative overflow-hidden border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-5 gap-1.5 px-3 py-1">
              <Star className="size-3.5 text-primary" />
              {totalProducts}+ premium subscriptions in stock
            </Badge>
            <h1 className="text-4xl font-bold leading-[1.05] sm:text-6xl">
              Premium software subscriptions,{" "}
              <span className="text-gradient">without premium prices.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              SubNexa is the marketplace for verified AI tools, creative suites, music, education,
              VPN and productivity subscriptions — delivered instantly and backed by a full-term
              warranty.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/browse">Browse marketplace</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/how-it-works">See how it works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          <form onSubmit={submitSearch} className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search subscriptions, AI tools, VPNs..."
              aria-label="Search subscriptions, AI tools, and VPNs"
              className="h-14 rounded-xl border-border/80 bg-card pl-12 pr-28 text-base shadow-soft"
            />
            <Button type="submit" className="absolute right-2 top-2 h-10 px-4">
              Search
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <h2 className="text-3xl font-bold">Shop by category</h2>
            <p className="mt-2 text-muted-foreground">
              Every subscription we stock, organised into {categories.length} curated collections.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link to="/categories">View all categories</Link>
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/browse"
              search={{ category: c.slug, q: "" }}
              className="group flex min-h-40 min-w-0 flex-col items-start rounded-xl border border-border/70 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-elevated sm:p-5"
            >
              <CategoryIconTile slug={c.slug} />
              <div className="mt-auto min-w-0 pt-4">
                <h3 className="line-clamp-2 text-sm font-semibold sm:text-base">{c.name}</h3>
                <p className="text-sm text-muted-foreground">{c.count} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div className="min-w-0">
              <h2 className="text-3xl font-bold">Trending right now</h2>
              <p className="mt-2 text-muted-foreground">
                The AI subscriptions our customers buy most this month.
              </p>
            </div>
            <Button asChild variant="ghost">
              <Link to="/browse">Browse all {totalProducts} products</Link>
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold">Built for buyers and resellers alike</h2>
            <p className="mt-4 text-muted-foreground">
              Order for yourself in three clicks, or plug into our reseller program and earn up to
              40% commission on every subscription you sell — with dedicated stock, an official
              Telegram bot and a multilingual storefront.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                { icon: BadgeCheck, text: "Verified, non-shared account sources" },
                { icon: Bot, text: "Official Telegram bot for instant order status" },
                { icon: Globe2, text: "Multilingual interface and worldwide delivery" },
                { icon: Lock, text: "Secure checkout with encrypted order records" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <item.icon className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/reseller">
                  <Rocket className="size-4" /> Join the reseller program
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/support">Talk to support</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-8 shadow-elevated">
            <h3 className="text-lg font-semibold">Reseller tiers</h3>
            <div className="mt-6 space-y-4">
              {[
                ["Starter", "10 orders / month", "15% commission"],
                ["Growth", "50 orders / month", "25% commission"],
                ["Partner", "200+ orders / month", "40% commission"],
              ].map(([tier, volume, commission]) => (
                <div
                  key={tier}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-surface/60 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold">{tier}</p>
                    <p className="text-xs text-muted-foreground">{volume}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">{commission}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <dl className="grid grid-cols-3 gap-3 border-b border-border/60 pb-10 text-center sm:gap-6">
            {[
              [`${totalProducts}+`, "Products"],
              [String(categories.length), "Categories"],
              ["24/7", "Support"],
            ].map(([value, label]) => (
              <div key={label} className="min-w-0">
                <dt className="font-display text-2xl font-bold sm:text-3xl">{value}</dt>
                <dd className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">{label}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item.title} className="min-w-0 rounded-xl border border-border/70 bg-card p-4 shadow-soft sm:p-6">
                <item.icon className="size-5 text-primary" />
                <h3 className="mt-4 text-sm font-semibold sm:text-base">{item.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground sm:text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
