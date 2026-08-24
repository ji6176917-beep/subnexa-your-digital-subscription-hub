import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatUSD, startingPrice } from "@/lib/catalog";
import { useCatalog } from "@/lib/catalog-store";

const title = "Pricing & Plans — SubNexa";
const description =
  "Transparent USD pricing for every SubNexa subscription plus membership tiers for individuals, teams and resellers.";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Individual",
    price: "Pay per order",
    highlight: false,
    features: [
      "Full catalog access",
      "Instant delivery",
      "Full-term warranty",
      "Telegram & email support",
    ],
  },
  {
    name: "Team",
    price: "$9 / month",
    highlight: true,
    features: [
      "Everything in Individual",
      "5% off every order",
      "Multi-seat order management",
      "Priority delivery queue",
      "Consolidated invoices",
    ],
  },
  {
    name: "Reseller",
    price: "Up to 40% commission",
    highlight: false,
    features: [
      "Wholesale reseller pricing",
      "Dedicated stock allocation",
      "Official Telegram bot access",
      "Dedicated account manager",
    ],
  },
];

function PricingPage() {
  const { products, categories } = useCatalog();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
        <p className="mt-3 text-muted-foreground">
          Every product price is listed in USD with no hidden fees. Choose per-order buying, a team
          membership, or join the reseller program.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-2xl border p-8 ${
              tier.highlight
                ? "border-primary/60 bg-card shadow-elevated"
                : "border-border/70 bg-card shadow-soft"
            }`}
          >
            {tier.highlight && <Badge className="mb-4">Most popular</Badge>}
            <h2 className="text-xl font-semibold">{tier.name}</h2>
            <p className="mt-2 font-display text-3xl font-bold">{tier.price}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 w-full" variant={tier.highlight ? "default" : "outline"}>
              <Link to={tier.name === "Reseller" ? "/reseller" : "/browse"}>
                {tier.name === "Reseller" ? "Apply now" : "Start buying"}
              </Link>
            </Button>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Entry prices by category</h2>
        <p className="mt-2 text-muted-foreground">
          The lowest available price in each collection, taken straight from our live catalog.
        </p>
        <div className="mt-6 overflow-hidden rounded-xl border border-border/70">
          <table className="w-full text-sm">
            <thead className="bg-surface/60 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Products</th>
                <th className="px-4 py-3 text-right font-semibold">From</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {categories.map((c) => {
                const cheapest = products
                  .filter((p) => p.categorySlug === c.slug)
                  .map(startingPrice)
                  .filter((v): v is number => v != null)
                  .sort((a, b) => a - b)[0];
                return (
                  <tr key={c.slug} className="hover:bg-surface/40">
                    <td className="px-4 py-3">
                      <Link
                        to="/browse"
                        search={{ category: c.slug, q: "" }}
                        className="hover:text-primary"
                      >
                        {c.emoji} {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.count}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {cheapest != null ? formatUSD(cheapest) : "On request"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
